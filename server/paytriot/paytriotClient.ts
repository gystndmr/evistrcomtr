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
  customerAddress?: string;
  customerPostCode?: string;
  customerEmail?: string;
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
    this.gatewayUrl = process.env.PAYTRIOT_GATEWAY_URL || 'https://paytriot-proxy.renga.workers.dev';
    this.merchantId = process.env.PAYTRIOT_MERCHANT_ID || '281927';
    this.signatureKey = process.env.PAYTRIOT_SIGNATURE_KEY || 'TempKey123Paytriot';
    this.countryCode = process.env.COUNTRY_CODE || '792';
    this.currencyCode = process.env.CURRENCY_CODE || '949';
    this.timeout = parseInt(process.env.REQUEST_TIMEOUT_MS || '10000', 10);
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
      customerAddress,
      customerPostCode,
      customerEmail,
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
      fields.cardExpiryMonth = cardExpiryMonth;
      fields.cardExpiryYear = cardExpiryYear;
      fields.cardCVV = cardCVV;
    }

    if (customerAddress) fields.customerAddress = customerAddress;
    if (customerPostCode) fields.customerPostCode = customerPostCode;
    if (customerEmail) fields.customerEmail = customerEmail;
    if (statementNarrative1 || process.env.STATEMENT_NARRATIVE_1) {
      fields.statementNarrative1 = statementNarrative1 || process.env.STATEMENT_NARRATIVE_1;
    }
    if (statementNarrative2 || process.env.STATEMENT_NARRATIVE_2) {
      fields.statementNarrative2 = statementNarrative2 || process.env.STATEMENT_NARRATIVE_2;
    }

    if (threeDSMD) fields.threeDSMD = threeDSMD;
    if (threeDSPaRes) fields.threeDSPaRes = threeDSPaRes;

    const signature = sign(fields, this.signatureKey);
    fields.signature = signature;

    console.log('[Paytriot] Sending JSON request with signature');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(this.gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      console.log('[Paytriot] Raw response (first 500 chars):', responseText.substring(0, 500));
      
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
      
      const receivedSignature = responseData.signature;
      
      if (!receivedSignature) {
        console.error('[Paytriot] No signature in response!');
        console.error('[Paytriot] Response fields:', Object.keys(responseData));
        throw new Error('Invalid payment gateway response: missing signature');
      }
      
      const computedSignature = sign(responseData, this.signatureKey);
      
      console.log('[Paytriot] Received signature:', receivedSignature);
      console.log('[Paytriot] Computed signature:', computedSignature);
      
      if (!verifySignature(responseData, this.signatureKey, receivedSignature)) {
        console.error('[Paytriot] Signature verification failed!');
        console.error('[Paytriot] Response fields:', Object.keys(responseData));
        throw new Error('Response signature verification failed');
      }
      
      console.log('[Paytriot] Signature verification passed');

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
