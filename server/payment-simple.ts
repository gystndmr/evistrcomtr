import crypto from 'crypto';

// GPay configuration interface
interface GPayConfig {
  baseUrl: string;
  merchantId: string;
  publicKey: string;
  privateKey: string;
}

// Payment request interface matching PHP example
export interface PaymentRequest {
  orderRef: string;
  amount: number;
  currency: string;
  orderDescription: string;
  cancelUrl: string;
  callbackUrl: string;
  notificationUrl: string;
  errorUrl: string;
  paymentMethod: string;
  feeBySeller: number;
  billingFirstName: string;
  billingLastName: string;
  billingStreet1: string;
  billingStreet2?: string;
  billingCity: string;
  billingCountry: string;
  billingZipCode?: string;
  billingPhone?: string;
  billingEmail?: string;
  merchantId: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

export class GPayService {
  private config: GPayConfig;

  constructor(config: GPayConfig) {
    this.config = config;
  }

  // Generate signature following PHP Security.php logic
  public generateSignature(data: Record<string, any>): string {
    // Remove signature field if exists
    const cleanData = { ...data };
    delete cleanData.signature;

    // Sort keys naturally (like PHP ksort)
    const sortedKeys = Object.keys(cleanData).sort();
    const sortedData: Record<string, any> = {};
    
    sortedKeys.forEach(key => {
      const value = cleanData[key];
      // Trim string values (like PHP trim)
      sortedData[key] = typeof value === 'string' ? value.trim() : value;
    });

    // Create JSON string
    const jsonString = JSON.stringify(sortedData);
    
    // Sign with private key using md5WithRSAEncryption
    const sign = crypto.createSign('md5WithRSAEncryption');
    sign.update(jsonString);
    const signature = sign.sign(this.config.privateKey, 'base64');
    
    return signature;
  }

  // Verify signature for callbacks
  public verifySignature(data: Record<string, any>): boolean {
    const signature = data.signature;
    if (!signature) {
      return false;
    }

    // Remove signature from data
    const cleanData = { ...data };
    delete cleanData.signature;

    // Sort and trim like generateSignature
    const sortedKeys = Object.keys(cleanData).sort();
    const sortedData: Record<string, any> = {};
    
    sortedKeys.forEach(key => {
      const value = cleanData[key];
      sortedData[key] = typeof value === 'string' ? value.trim() : value;
    });

    const jsonString = JSON.stringify(sortedData);
    
    // Verify with public key
    const verify = crypto.createVerify('md5WithRSAEncryption');
    verify.update(jsonString);
    
    try {
      return verify.verify(this.config.publicKey, signature, 'base64');
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  // Create payment following PHP PaymentConfirmation.php logic
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Add merchantId to request
      const paymentData = {
        ...request,
        merchantId: this.config.merchantId
      };

      // Generate signature
      const signature = this.generateSignature(paymentData);
      
      // Create form data for POST request
      const formData = new URLSearchParams();
      Object.keys(paymentData).forEach(key => {
        const value = paymentData[key as keyof typeof paymentData];
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      formData.append('signature', signature);

      // Make POST request to GPay checkout endpoint
      const response = await fetch(`${this.config.baseUrl}/v1/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        redirect: 'manual' // Don't follow redirects automatically
      });

      if (response.status === 302) {
        // GPay redirects to payment page
        const location = response.headers.get('location');
        if (location) {
          return {
            success: true,
            paymentUrl: location,
            transactionId: request.orderRef
          };
        }
      }

      // Handle other response types
      const responseText = await response.text();
      console.log('GPay response:', response.status, responseText);

      return {
        success: false,
        error: `GPay API returned status ${response.status}: ${responseText}`
      };

    } catch (error) {
      console.error('GPay payment creation error:', error);
      return {
        success: false,
        error: `Payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Parse callback payload following PHP Result.php logic
  parseCallback(payload: string): any {
    try {
      // URL decode -> Base64 decode -> JSON parse
      const urlDecoded = decodeURIComponent(payload);
      const base64Decoded = Buffer.from(urlDecoded, 'base64').toString('utf8');
      const paymentData = JSON.parse(base64Decoded);
      
      return paymentData;
    } catch (error) {
      console.error('Callback parsing error:', error);
      return null;
    }
  }
}

// Environment-based configuration
function getGPayConfig(): GPayConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    baseUrl: isProduction 
      ? "https://payment.gpayprocessing.com" 
      : "https://payment-sandbox.gpayprocessing.com",
    merchantId: process.env.GPAY_MERCHANT_ID || "xxxxxxxxxx",
    publicKey: process.env.GPAY_PUBLIC_KEY || "",
    privateKey: process.env.GPAY_PRIVATE_KEY || ""
  };
}

export const gPayService = new GPayService(getGPayConfig());