import { v4 as uuidv4 } from "uuid";
import axios, { AxiosError } from "axios";
import { sign, verifySignature, signResponse } from "../utils/sign";
import { toFormUrlEncoded, fromFormUrlEncoded } from "../utils/form";

interface PaytriotSalePayload {
  amountMinor: number;
  cardNumber: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardCVV: string;
  orderRef?: string;
  transactionUnique?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerPostCode?: string;
  customerIPAddress: string;
  statementNarrative1?: string;
  statementNarrative2?: string;
  threeDSMD?: string;
  threeDSPaRes?: string;
}

interface PaytriotResponse {
  status: "success" | "3ds_required" | "error";
  xref?: string;
  authorisationCode?: string;
  amountReceived?: string;
  responseMessage?: string;
  acsUrl?: string;
  md?: string;
  paReq?: string;
  termUrl?: string;
  code?: number;
  message?: string;
}

export class PaytriotClient {
  private gatewayUrl: string;
  private merchantId: string;
  private signatureKey: string;
  private countryCode: string;
  private currencyCode: string;
  private timeout: number;
  private termUrl: string;

  constructor() {
    // Direct Paytriot gateway - test if IP whitelist is needed
    this.gatewayUrl = "https://gateway.paytriot.co.uk/direct/";
    this.merchantId = "281927";
    this.signatureKey = "TempKey123Paytriot";
    this.countryCode = "826";
    this.currencyCode = "840";
    this.timeout = 30000;
    
    // ← YENİ BLOK BAŞLANGICI
    // 3DS callback URL - where ACS will redirect after authentication
    const baseUrl = process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : 'http://localhost:5000';
    this.termUrl = `${baseUrl}/api/paytriot/3ds-callback`;
    // ← YENİ BLOK BİTİŞİ
    
    console.log('[Paytriot] Gateway initialized');
    console.log('[Paytriot] 3DS TermUrl:', this.termUrl);  // ← DEĞİŞTİ
  }

  async sale(payload: PaytriotSalePayload): Promise<PaytriotResponse> {
    const {
      amountMinor,
      cardNumber,
      cardExpiryMonth,
      cardExpiryYear,
      cardCVV,
      orderRef,
      transactionUnique,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerPostCode,
      customerIPAddress,
      statementNarrative1,
      statementNarrative2,
      threeDSMD,
      threeDSPaRes,
    } = payload;

    if (!amountMinor || typeof amountMinor !== "number" || amountMinor <= 0) {
      throw new Error("Invalid amountMinor: must be a positive number");
    }

    if (!customerIPAddress) {
      throw new Error("customerIPAddress is required");
    }

    // Sanitize orderRef and transactionUnique to alphanumeric only
    const sanitizedOrderRef = (orderRef || `ORD${Date.now()}${uuidv4().slice(0, 8)}`).replace(/[^a-zA-Z0-9]/g, '');
    const sanitizedTransactionUnique = (transactionUnique || uuidv4()).replace(/[^a-zA-Z0-9]/g, '');

    const fields: Record<string, any> = {
      merchantID: this.merchantId,
      action: "SALE",
      type: "1",
      countryCode: this.countryCode,
      currencyCode: this.currencyCode,
      amount: String(amountMinor),
      orderRef: sanitizedOrderRef,
      transactionUnique: sanitizedTransactionUnique,
      customerIPAddress: customerIPAddress,
      threeDSRequired: "Y",
    };

    // Only include card fields if not doing 3DS completion
    // (3DS completion uses MD to reference original transaction)
    if (!threeDSMD && !threeDSPaRes) {
      fields.cardNumber = cardNumber;
      // Ensure cardExpiryMonth is 2 digits (01-12)
      const paddedMonth = cardExpiryMonth.padStart(2, '0');
      const expiryYear = cardExpiryYear ? cardExpiryYear.slice(-2) : "";
      fields.cardExpiryDate = `${paddedMonth}${expiryYear}`;
      fields.cardCVV = cardCVV;
    }

    // Only add non-empty optional fields
    if (customerName?.trim()) fields.customerName = customerName.trim();
    if (customerEmail?.trim()) fields.customerEmail = customerEmail.trim();
    if (customerPhone?.trim()) fields.customerPhone = customerPhone.trim();
    if (customerAddress?.trim()) fields.customerAddress = customerAddress.trim();
    if (customerPostCode?.trim()) fields.customerPostCode = customerPostCode.trim();
    if (statementNarrative1?.trim()) fields.statementNarrative1 = statementNarrative1.trim();
    if (statementNarrative2?.trim()) fields.statementNarrative2 = statementNarrative2.trim();

    // 3DS fields only for completion
    if (threeDSMD) fields.threeDSMD = threeDSMD;
    if (threeDSPaRes) fields.threeDSPaRes = threeDSPaRes;

    const signature = sign(fields, this.signatureKey);
    fields.signature = signature;

    // Mask sensitive data for logging (PCI compliance)
    const maskedFields = { ...fields };
    if (maskedFields.cardNumber) {
      maskedFields.cardNumber = `****${maskedFields.cardNumber.slice(-4)}`;
    }
    if (maskedFields.cardCVV) {
      maskedFields.cardCVV = '***';
    }

    console.log("[Paytriot] 🔐 REQUEST DETAILS:");
    console.log("[Paytriot] Gateway URL:", this.gatewayUrl);
    console.log("[Paytriot] Customer IP:", customerIPAddress);
    console.log("[Paytriot] Request fields (masked):", JSON.stringify(maskedFields, null, 2));
    console.log("[Paytriot] Calculated signature:", signature);

    const formBody = toFormUrlEncoded(fields);

    try {
      const response = await axios.post(this.gatewayUrl, formBody, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "text/html,application/x-www-form-urlencoded",
          "User-Agent": "PaytriotClient/1.0",
        },
        timeout: this.timeout,
        validateStatus: () => true, // Accept all status codes
      });

      console.log("[Paytriot] 📥 RESPONSE DETAILS:");
      console.log(
        "[Paytriot] HTTP Status:",
        response.status,
        response.statusText,
      );
      console.log(
        "[Paytriot] Response headers:",
        response.headers,
      );

      const responseText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      console.log(
        "[Paytriot] Raw response (first 1000 chars):",
        responseText.substring(0, 1000),
      );

      // Handle non-200 status codes
      if (response.status !== 200) {
        console.error(`[Paytriot] ⚠️ Non-200 HTTP status: ${response.status}`);
        console.error(`[Paytriot] Response body:`, responseText);
      }

      let responseData: Record<string, any>;
      try {
        responseData = typeof response.data === 'object' ? response.data : JSON.parse(responseText);
      } catch (e) {
        responseData = fromFormUrlEncoded(responseText);
      }

      console.log(
        "[Paytriot] Response data:",
        JSON.stringify(responseData, null, 2),
      );

      // Check for proxy/worker errors
      if (
        responseData["Internal Worker Error"] !== undefined ||
        responseData["error"] !== undefined
      ) {
        const errorMessage =
          responseData["Internal Worker Error"] ||
          responseData["error"] ||
          "Unknown proxy error";
        console.error("[Paytriot] Proxy/Worker error detected:", errorMessage);
        throw new Error(
          `Payment gateway error: ${errorMessage || "Proxy internal error"}`,
        );
      }

      // CRITICAL: Paytriot only sends signature on SUCCESS responses
      // Error responses don't include signature field
      const receivedSignature = responseData.signature;
      const responseCode = parseInt(responseData.responseCode, 10);


      if (receivedSignature && responseCode === 0) {
        // Verify signature only if present
        const computedSignature = signResponse(responseData, this.signatureKey);

        console.log("[Paytriot] Received signature:", receivedSignature);
        console.log("[Paytriot] Computed signature:", computedSignature);

        if (
          !verifySignature(responseData, this.signatureKey, receivedSignature)
        ) {
          console.error("[Paytriot] Signature verification failed!");
          console.error(
            "[Paytriot] Response fields:",
            Object.keys(responseData),
          );
          throw new Error("Response signature verification failed");
        }

        console.log("[Paytriot] ✅ Signature verification passed");
      } else {
        console.log(
          `[Paytriot] ⚠️ Skipping signature verification (responseCode: ${responseCode})`,
        );
      }

      return this.normalizeResponse(responseData);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error("Request timeout");
        }
        console.error("[Paytriot] Axios error:", error.message);
        if (error.response) {
          console.error("[Paytriot] Error response status:", error.response.status);
          console.error("[Paytriot] Error response data:", error.response.data);
        }
      }
      throw error;
    }
  }

  private normalizeResponse(
  responseData: Record<string, string>,
): PaytriotResponse {
  const responseCode = parseInt(responseData.responseCode, 10);

  if (responseCode === 0) {
    return {
      status: "success",
      xref: responseData.xref,
      authorisationCode: responseData.authorisationCode,
      amountReceived: responseData.amountReceived,
      responseMessage: responseData.responseMessage || "Payment successful",
    };
  }

  const hasAcs =
     !!(responseData.threeDSACSURL && responseData.threeDSMD && responseData.threeDSPaReq);

   // 1) Kesin vaka: 65802 ve ACS alanları varsa → 3DS'e gönder
   if (responseCode === 65802 && hasAcs) {
     return {
       status: "3ds_required",
       acsUrl: responseData.threeDSACSURL,
       md: responseData.threeDSMD,
       paReq: responseData.threeDSPaReq,
       termUrl: this.termUrl,
     };
   }

   // 2) İstisna: 65796 geldi AMA ACS alanları da geldiyse → yine 3DS'e gönder (edge)
   if (responseCode === 65796 && hasAcs) {
     return {
       status: "3ds_required",
       acsUrl: responseData.threeDSACSURL,
       md: responseData.threeDSMD,
       paReq: responseData.threeDSPaReq,
       termUrl: this.termUrl,
     };
   }

   // 3) Diğer tüm haller → ERROR (örn. threeDSEnrolled="E" ile ACS yok)
   return {
     status: "error",
     code: responseCode,
     message:
       this.getUserFriendlyError(responseData) ||
       "3-D Secure required but ACS details were not provided.",
   };
}

private getUserFriendlyError(responseData: Record<string, string>): string {
  const responseCode = parseInt(responseData.responseCode, 10);
  const acquirerCode = responseData.acquirerResponseCode;
  const acquirerMessage = responseData.acquirerResponseMessage || "";

  // Paytriot Gateway Error Codes (65536-66559)
  const payriotErrors: Record<number, string> = {
    65539: "Invalid merchant credentials",
    65541: "Transaction not allowed in current state",
    65542: "Card details mismatch - please try again",
    65544: "Invalid payment information",
    65545: "Merchant account suspended - contact support",
    65546: "Currency not supported",
    65548: "System error - please try again",
    65554: "Duplicate transaction detected",
    65561: "Card type not supported",
    65566: "Test card used on live system",
    65567: "Card issuing country not supported",
    65796: "3-D Secure is required for this card (no ACS details returned)",
    65794: "3-D Secure unavailable on merchant account",
    65792: "3-D Secure transaction in progress",
  };

  // ISO 8583 Standard Acquirer Response Codes (0-99)
  const acquirerErrors: Record<string, string> = {
    "01": "Please contact your bank for authorization",
    "02": "Please contact your bank for authorization",
    "04": "Card declined - please use another card",
    "05": "Card declined by bank - please use another card",
    "12": "Invalid transaction - please check card details",
    "13": "Invalid amount - please check payment amount",
    "14": "Invalid card number - please check your card",
    "15": "Invalid card issuer",
    "25": "Cannot process at this time - please try again later",
    "30": "Format error - please try again",
    "41": "Lost card - please contact your bank",
    "43": "Stolen card - please contact your bank",
    "51": "Insufficient funds - please check your balance",
    "54": "Card expired - please use a valid card",
    "55": "Incorrect PIN - please try again",
    "57": "Transaction not permitted for this card",
    "58": "Transaction not permitted - contact your bank",
    "61": "Exceeds withdrawal limit",
    "62": "Restricted card - contact your bank",
    "65": "Exceeds transaction limit",
    "75": "PIN entry attempts exceeded",
    "76": "Invalid account",
    "78": "Card not activated",
    "79": "Invalid card lifecycle state",
    "82": "Incorrect CVV - please check security code",
    "83": "Cannot verify PIN",
    "85": "Card OK but transaction declined",
    "91": "Bank system unavailable - please try again",
    "92": "Unable to route transaction",
    "93": "Transaction violation",
    "94": "Duplicate transaction",
    "96": "System error - please try again later",
  };

  // Check Paytriot gateway errors first
  if (payriotErrors[responseCode]) {
    return payriotErrors[responseCode];
  }

  // Check acquirer errors (bank-specific)
  if (acquirerCode && acquirerErrors[acquirerCode]) {
    return acquirerErrors[acquirerCode];
  }

  // Standard Paytriot codes (1-99)
  if (responseCode === 2) {
    return "Please contact your bank for authorization";
  }
  if (responseCode === 4) {
    return "Card declined - please use another card";
  }
  if (responseCode === 5) {
    return "Card declined by bank - please use another card";
  }
  if (responseCode === 30) {
    return acquirerMessage || "Payment failed - please try again";
  }

  // Fallback: Use response message or generic error
  return (
    responseData.responseMessage ||
    acquirerMessage ||
    "Payment failed - please check your card details and try again"
  );
}
}
