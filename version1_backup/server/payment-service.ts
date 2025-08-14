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
  customerIp: string; // MANDATORY field from specification
  merchantId: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
  formData?: Record<string, string>;
}

export class GPayService {
  private config: GPayConfig;

  constructor(config: GPayConfig) {
    this.config = config;
  }

  // Generate unique order reference for GPay
  public generateOrderReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}${random}`.toUpperCase();
  }

  // Get real client IP from headers
  public getClientIp(req: any): string {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.ip ||
           '127.0.0.1';
  }

  // Trim recursively like PHP trim
  private trimRecursive(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return typeof obj === 'string' ? obj.trim() : obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.trimRecursive(item));
    }

    const result: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = this.trimRecursive(obj[key]);
      }
    }
    return result;
  }

  // Generate signature exactly like PHP implementation
  public generateSignature(data: Record<string, any>): string {
    // Clone data to avoid modifying original
    const clonedData = JSON.parse(JSON.stringify(data));
    
    // Convert all numbers to strings
    Object.keys(clonedData).forEach(key => {
      if (typeof clonedData[key] === 'number') {
        clonedData[key] = String(clonedData[key]);
      }
    });
    
    // Sort keys alphabetically
    const sortedData: Record<string, any> = {};
    Object.keys(clonedData)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .forEach(key => {
        sortedData[key] = clonedData[key];
      });
    
    // Apply recursive trimming
    const trimmedData = this.trimRecursive(sortedData);
    
    // Create JSON and escape forward slashes
    const jsonData = JSON.stringify(trimmedData).replace(/\//g, '\\/');
    
    // Sign with private key using md5WithRSAEncryption
    const sign = crypto.createSign('md5WithRSAEncryption');
    sign.update(jsonData);
    const signature = sign.sign(this.config.privateKey, 'base64');
    
    return signature;
  }

  // Create payment
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Add critical fields for API mode
      const paymentData = {
        ...request,
        merchantId: this.config.merchantId,
        connectionMode: "API",
        apiVersion: "1.0"
      };

      // Generate signature
      const signature = this.generateSignature(paymentData);
      
      // Create form data for POST request
      const formData = new URLSearchParams();
      const formDataObj: Record<string, string> = {};
      
      Object.keys(paymentData).forEach(key => {
        const value = paymentData[key as keyof typeof paymentData];
        if (value !== undefined && value !== null) {
          const stringValue = value.toString();
          formData.append(key, stringValue);
          formDataObj[key] = stringValue;
        }
      });
      formData.append('signature', signature);
      formDataObj['signature'] = signature;

      // Make POST request to GPay checkout endpoint
      const response = await fetch(`${this.config.baseUrl}/v1/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        redirect: 'manual'
      });

      if (response.status === 302) {
        // GPay redirects to payment page
        const location = response.headers.get('location');
        if (location) {
          return {
            success: true,
            paymentUrl: location,
            transactionId: request.orderRef,
            formData: formDataObj
          };
        }
      }

      // Handle other response types
      const responseText = await response.text();

      try {
        // Try to parse JSON response
        const jsonResponse = JSON.parse(responseText);
        
        if (jsonResponse.status === 'created' && jsonResponse.paymentLink) {
          return {
            success: true,
            paymentUrl: jsonResponse.paymentLink,
            transactionId: jsonResponse.transactionId || request.orderRef,
            formData: formDataObj
          };
        } else {
          return {
            success: false,
            error: jsonResponse.error || jsonResponse.message || 'GPay API error'
          };
        }
      } catch (parseError) {
        return {
          success: false,
          error: `GPay API returned status ${response.status}: ${responseText}`
        };
      }

    } catch (error) {
      console.error('GPay payment creation error:', error);
      return {
        success: false,
        error: `Payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Parse callback payload
  parseCallback(payload: string): any {
    try {
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
  const isProduction = process.env.NODE_ENV === 'production' || 
                      process.env.GPAY_MERCHANT_ID === '1100002537';
  
  return {
    baseUrl: isProduction 
      ? "https://getvisa.gpayprocessing.com" 
      : "https://payment-sandbox.gpayprocessing.com",
    merchantId: process.env.GPAY_MERCHANT_ID || "xxxxxxxxxx",
    publicKey: process.env.GPAY_PUBLIC_KEY || "",
    privateKey: process.env.GPAY_PRIVATE_KEY || ""
  };
}

export const gPayService = new GPayService(getGPayConfig());