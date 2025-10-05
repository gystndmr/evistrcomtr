import { v4 as uuidv4 } from 'uuid';
import { sign, verifySignature } from '../utils/sign';
import { toFormUrlEncoded, fromFormUrlEncoded } from '../utils/form';

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
  status: 'success' | '3ds_required' | 'error';
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

  constructor() {
    this.gatewayUrl = 'https://gateway.paytriot.co.uk/direct';
    this.merchantId = '281927';
    this.signatureKey = 'TempKey123Paytriot';
    this.countryCode = '826';
    this.currencyCode = '840';
    this.timeout = 10000;
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
      threeDSPaRes
    } = payload;

    if (!amountMinor || typeof amountMinor !== 'number' || amountMinor <= 0) {
      throw new Error('Invalid amountMinor: must be a positive number');
    }

    if (!customerIPAddress) {
      throw new Error('customerIPAddress is required');
    }

    const fields: Record<string, any> = {
      merchantID: this.merchantId,
      action: 'SALE',
      type: '1',
      countryCode: this.countryCode,
      currencyCode: this.currencyCode,
      amount: String(amountMinor),
      orderRef: orderRef || `ORD-${Date.now()}-${uuidv4().slice(0, 8)}`,
      transactionUnique: transactionUnique || uuidv4(),
      customerIPAddress: customerIPAddress
    };

    // Only include card fields if not doing 3DS completion
    // (3DS completion uses MD to reference original transaction)
    if (!threeDSMD && !threeDSPaRes) {
      fields.cardNumber = cardNumber;
      const expiryYear = cardExpiryYear ? cardExpiryYear.slice(-2) : '';
      fields.cardExpiryDate = `${cardExpiryMonth}${expiryYear}`;
      fields.cardCVV = cardCVV;
    }

    if (customerName) fields.customerName = customerName;
    if (customerEmail) fields.customerEmail = customerEmail;
    if (customerPhone) fields.customerPhone = customerPhone;

    if (threeDSMD) fields.threeDSMD = threeDSMD;
    if (threeDSPaRes) fields.threeDSPaRes = threeDSPaRes;

    const signature = sign(fields, this.signatureKey);
    fields.signature = signature;

    console.log('[Paytriot] 🔐 REQUEST DETAILS:');
    console.log('[Paytriot] Gateway URL:', this.gatewayUrl);
    console.log('[Paytriot] Request fields:', JSON.stringify(fields, null, 2));
    console.log('[Paytriot] Calculated signature:', signature);
    console.log('[Paytriot] Sending form-urlencoded request with signature');

    const formBody = toFormUrlEncoded(fields);
    console.log('[Paytriot] Form body:', formBody);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(this.gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('[Paytriot] 📥 RESPONSE DETAILS:');
      console.log('[Paytriot] HTTP Status:', response.status, response.statusText);
      console.log('[Paytriot] Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('[Paytriot] Raw response (first 1000 chars):', responseText.substring(0, 1000));
      
      let responseData: Record<string, any>;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = fromFormUrlEncoded(responseText);
      }

      console.log('[Paytriot] Response data:', JSON.stringify(responseData, null, 2));
      
      // Check for proxy/worker errors
      if (responseData['Internal Worker Error'] !== undefined || responseData['error'] !== undefined) {
        const errorMessage = responseData['Internal Worker Error'] || responseData['error'] || 'Unknown proxy error';
        console.error('[Paytriot] Proxy/Worker error detected:', errorMessage);
        throw new Error(`Payment gateway error: ${errorMessage || 'Proxy internal error'}`);
      }
      
      // CRITICAL: Paytriot only sends signature on SUCCESS responses
      // Error responses don't include signature field
      const receivedSignature = responseData.signature;
      
      if (receivedSignature) {
        // Verify signature only if present
        const computedSignature = sign(responseData, this.signatureKey);
        
        console.log('[Paytriot] Received signature:', receivedSignature);
        console.log('[Paytriot] Computed signature:', computedSignature);
        
        if (!verifySignature(responseData, this.signatureKey, receivedSignature)) {
          console.error('[Paytriot] Signature verification failed!');
          console.error('[Paytriot] Response fields:', Object.keys(responseData));
          throw new Error('Response signature verification failed');
        }
        
        console.log('[Paytriot] ✅ Signature verification passed');
      } else {
        console.log('[Paytriot] ⚠️ No signature in response (likely error response)');
      }

      return this.normalizeResponse(responseData);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  private normalizeResponse(responseData: Record<string, string>): PaytriotResponse {
    const responseCode = parseInt(responseData.responseCode, 10);

    if (responseCode === 0) {
      return {
        status: 'success',
        xref: responseData.xref,
        authorisationCode: responseData.authorisationCode,
        amountReceived: responseData.amountReceived,
        responseMessage: responseData.responseMessage || 'Payment successful'
      };
    }

    if (responseCode === 65802) {
      return {
        status: '3ds_required',
        acsUrl: responseData.threeDSACSURL,
        md: responseData.threeDSMD,
        paReq: responseData.threeDSPaReq,
        termUrl: process.env.RETURN_URL
      };
    }

    if (responseCode === 65540) {
      return {
        status: 'error',
        code: responseCode,
        message: 'Forbidden: server IP not whitelisted'
      };
    }

    return {
      status: 'error',
      code: responseCode,
      message: responseData.responseMessage || 'Payment failed'
    };
  }
}
