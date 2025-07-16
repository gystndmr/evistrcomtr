import crypto from 'crypto';

export interface GloDiPayConfig {
  merchantId: string;
  publicKey: string;
  privateKey: string;
  apiUrl: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customerEmail: string;
  customerName: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

export class GloDiPayService {
  private config: GloDiPayConfig;

  constructor(config: GloDiPayConfig) {
    this.config = config;
  }

  private generateSignature(data: string): string {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    return sign.sign(this.config.privateKey, 'base64');
  }

  private verifySignature(data: string, signature: string): boolean {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(data);
    return verify.verify(this.config.publicKey, signature, 'base64');
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = crypto.randomBytes(16).toString('hex');
      
      const paymentData = {
        merchant_id: this.config.merchantId,
        amount: request.amount,
        currency: request.currency,
        order_id: request.orderId,
        description: request.description,
        customer_email: request.customerEmail,
        customer_name: request.customerName,
        return_url: request.returnUrl,
        cancel_url: request.cancelUrl,
        timestamp,
        nonce
      };

      // Create signature string
      const signatureString = Object.keys(paymentData)
        .sort()
        .map(key => `${key}=${paymentData[key as keyof typeof paymentData]}`)
        .join('&');

      const signature = this.generateSignature(signatureString);

      // Common endpoint patterns to try
      const endpoints = [
        '/api/v1/payments',
        '/api/v1/checkout',
        '/v1/payments',
        '/v1/checkout',
        '/payments',
        '/checkout'
      ];

      let response;
      let lastError;
      
      for (const endpoint of endpoints) {
        try {
          response = await fetch(`${this.config.apiUrl}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Signature': signature,
              'X-Merchant-Id': this.config.merchantId,
              'Authorization': `Bearer ${this.config.merchantId}` // Try both auth methods
            },
            body: JSON.stringify(paymentData)
          });
          
          if (response.status !== 404) {
            console.log(`Found working endpoint: ${endpoint}, Status: ${response.status}`);
            break;
          }
        } catch (error) {
          lastError = error;
          continue;
        }
      }

      if (!response || response.status === 404) {
        throw new Error('No working API endpoint found');
      }

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true,
          paymentUrl: result.payment_url,
          transactionId: result.transaction_id
        };
      } else {
        return {
          success: false,
          error: result.error || 'Payment creation failed'
        };
      }
    } catch (error) {
      console.error('GloDiPay payment error:', error);
      return {
        success: false,
        error: 'Payment service unavailable'
      };
    }
  }

  async verifyPayment(transactionId: string, signature: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Merchant-Id': this.config.merchantId
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          signature
        })
      });

      const result = await response.json();
      return result.success && result.status === 'completed';
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }
}

// Initialize GloDiPay service
export const gloDiPayService = new GloDiPayService({
  merchantId: '1100002537',
  publicKey: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA1tpp6AxHhhgdHqF2VYL7
FpH6nZIOO0fsyyksVE389xVcABZ6VzxF2v/tpDd8FfP9mT8C0duMGG/edTkCadCy
FQvU4UBYoqRuH8KENMZs9QdQYMAPK/OFSUs5ISlndTfv2G4mcgPmOtJmNJoJ+DKe
MnXE7vKM5cdauiGd/4m3CuLSRE2c8Oqa1uqEzULbu6b1odLhLgO61qH/NpCI5F2W
/144BlHiLC5Gxv/msdFcBHG/XzJOIpWlFmvicRNCwCI3tSbvCKp6l5zbMHMx95we
fJUoi4cAwW1iKdtT48GrknCUJ0gSPFtFc/P7GfaQP3fNdl81cwk96pkR6P8BKXuV
e8yquYD4aS6QzUMcZ1qG5ndsEfUkYtBYIlNE5RvTahqPrQyFcE/y/H52/o7nCcnq
TUI96tfp6ZrHM2r79ZTSH+/mt0lpynaORL9Vi2P+usshgtABGYD+fEsbXzrxd+mz
8i4Cak7xtcR2w0RZEfCHtkkQu3lKED+5DGB6Qu5g/zczuXcdthDXqc1qtXHFmbEz
YmJR1WpH7LcGsgAyOjQtX5Kk1qR8PgGeVfi3mzeNYijtdYfGsTEiuhVDqtvnC2YX
nL3XXpuyAJMDV6ZfQ5w2cr70+Re8QqiwfIMtFFCJQPEz085WZl3d/qQTg/5KGjw9
7X//Lnsd05V8HBAVpAnw4fECAwEAAQ==
-----END PUBLIC KEY-----`,
  privateKey: `-----BEGIN PRIVATE KEY-----
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
Isj6CZiUWzZK8X39nzFQlD0xazo62g==
-----END PRIVATE KEY-----`,
  apiUrl: 'https://payment-sandbox.gpayprocessing.com'
});