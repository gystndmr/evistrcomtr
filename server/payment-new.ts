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

  private generateSignature(jsonData: string): string {
    try {
      // Convert PEM to binary exactly like .NET
      const privateKeyPem = this.config.privateKey;
      const lines = privateKeyPem.split('\n');
      const base64 = lines.filter(line => !line.startsWith('-')).join('');
      const privateKeyDer = Buffer.from(base64, 'base64');
      
      // Create RSA key from DER format
      const privateKey = crypto.createPrivateKey({
        key: privateKeyDer,
        format: 'der',
        type: 'pkcs8'
      });

      // Sign with MD5 hash exactly like .NET
      const dataBuffer = Buffer.from(jsonData, 'utf8');
      const signature = crypto.sign('md5WithRSAEncryption', dataBuffer, privateKey);
      
      return signature.toString('base64');
    } catch (error) {
      console.error('Signature generation error:', error);
      throw new Error('Failed to generate signature');
    }
  }

  private verifySignature(jsonData: string, signatureBase64: string): boolean {
    try {
      // Convert PEM to binary for public key
      const publicKeyPem = this.config.publicKey;
      const lines = publicKeyPem.split('\n');
      const base64 = lines.filter(line => !line.startsWith('-')).map(line => line.trim()).join('');
      const publicKeyDer = Buffer.from(base64, 'base64');
      
      // Create RSA public key from DER format
      const publicKey = crypto.createPublicKey({
        key: publicKeyDer,
        format: 'der',
        type: 'spki'
      });

      // Verify signature with MD5 hash
      const dataBuffer = Buffer.from(jsonData, 'utf8');
      const signatureBuffer = Buffer.from(signatureBase64, 'base64');
      
      return crypto.verify('md5WithRSAEncryption', dataBuffer, publicKey, signatureBuffer);
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Build parameters exactly like .NET implementation
      const parameters: Record<string, any> = {
        merchantId: this.config.merchantId,
        orderRef: request.orderId,
        amount: request.amount.toFixed(2),
        currency: request.currency,
        cancelUrl: request.cancelUrl,
        callbackUrl: request.returnUrl,
        notificationUrl: request.returnUrl,
        errorUrl: request.cancelUrl,
        orderDescription: request.description,
        paymentMethod: 'ALL',
        feeBySeller: '0',
        billingStreet2: '',
        metadata: '{"key":"value"}',
        transactionDocuments: '{"key":"value"}',
        brandName: '',
        colorMode: 'default-mode',
        logoSource: '',
        connectionMode: 'API'
      };

      // Add optional fields if they exist - exactly like .NET
      if (request.customerName) {
        const nameParts = request.customerName.split(' ');
        parameters.billingFirstName = nameParts[0] || '';
        parameters.billingLastName = nameParts.slice(1).join(' ') || '';
      }
      
      if (request.customerEmail) {
        parameters.billingEmail = request.customerEmail;
      }
      
      // Add billing country with default TR
      parameters.billingCountry = 'TR';
      
      if (request.customerName) {
        parameters.billingCity = 'Istanbul';
        parameters.billingStreet1 = 'Default Address';
      }

      // Sort parameters alphabetically - exactly like .NET StringComparer.Ordinal
      const sortedParams: Record<string, string> = {};
      Object.keys(parameters)
        .sort()
        .forEach(key => {
          sortedParams[key] = parameters[key].toString().trim();
        });

      // Generate JSON exactly like .NET with EscapeNonAscii and forward slash replacement
      const jsonData = JSON.stringify(sortedParams, null, 0).replace(/\//g, '\\/');
      
      console.log('🔐 JSON for signature:', jsonData);
      
      // Generate signature
      const signature = this.generateSignature(jsonData);
      
      // Verify signature locally like .NET does
      const isVerified = this.verifySignature(jsonData, signature);
      console.log('✅ Local signature verification:', isVerified);
      
      if (!isVerified) {
        throw new Error('Local signature verification failed');
      }

      // Add signature to sorted params like .NET
      sortedParams.signature = signature;

      // Create NameValueCollection equivalent - form data
      const formData = new URLSearchParams();
      Object.entries(sortedParams).forEach(([key, value]) => {
        formData.append(key, value);
      });

      console.log('🚀 Sending to GPay API:', this.config.apiUrl + '/v1/checkout');
      console.log('📝 Form data entries:', Object.fromEntries(formData.entries()));

      // Make API call exactly like .NET WebClient.UploadValues
      const response = await fetch(`${this.config.apiUrl}/v1/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        redirect: 'manual' // Handle redirects manually
      });

      console.log('📥 GPay Response Status:', response.status);
      console.log('📥 GPay Response Headers:', Object.fromEntries(response.headers.entries()));

      if (response.status === 302 || response.status === 301) {
        // Success redirect like .NET handles
        const paymentUrl = response.headers.get('location');
        console.log('✅ Payment redirect URL:', paymentUrl);
        
        return {
          success: true,
          paymentUrl: paymentUrl || `${this.config.apiUrl}/payment/${request.orderId}`,
          transactionId: request.orderId
        };
      }

      // Get response text like .NET Encoding.UTF8.GetString(uploadresult)
      const responseText = await response.text();
      console.log('📄 GPay Response Text (first 200 chars):', responseText.substring(0, 200));

      if (response.ok) {
        // Check if it's a payment page or JSON response
        if (responseText.includes('form') || responseText.includes('payment')) {
          return {
            success: true,
            paymentUrl: `${this.config.apiUrl}/v1/checkout`,
            transactionId: request.orderId
          };
        }
        
        // Try to parse as JSON
        try {
          const result = JSON.parse(responseText);
          return {
            success: true,
            paymentUrl: result.paymentUrl || `${this.config.apiUrl}/payment/${request.orderId}`,
            transactionId: result.transactionId || request.orderId
          };
        } catch {
          // Return success with response text
          return {
            success: true,
            paymentUrl: `${this.config.apiUrl}/v1/checkout`,
            transactionId: request.orderId
          };
        }
      }

      // Handle errors
      console.error('❌ GPay API Error:', response.status, responseText);
      
      return {
        success: false,
        error: `Payment creation failed: ${response.status}`
      };

    } catch (error) {
      console.error('💥 GPay Payment Error:', error);
      return {
        success: false,
        error: `Payment service error: ${error instanceof Error ? error.message : 'Unknown error'}`
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

// Initialize GloDiPay service with new credentials
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
DjPZy1LIdNVuY5gNsPweK2KBzJGc
-----END PRIVATE KEY-----`,
  apiUrl: 'https://getvisa.gpayprocessing.com'
});