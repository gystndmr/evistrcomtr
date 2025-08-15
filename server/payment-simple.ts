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

  // Generate signature exactly like the provided Node.js example
  public generateSignature(data: Record<string, any>): string {
    // Clone data to avoid modifying original
    const clonedData = JSON.parse(JSON.stringify(data));
    
    // Convert all numbers to strings (like in the example)
    Object.keys(clonedData).forEach(key => {
      if (typeof clonedData[key] === 'number') {
        clonedData[key] = String(clonedData[key]);
      }
    });
    
    // Sort keys with localeCompare like in the example
    const sortedData: Record<string, any> = {};
    Object.keys(clonedData)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .forEach(key => {
        sortedData[key] = clonedData[key];
      });
    
    // Apply recursive trimming like in the example
    const trimmedData = this.trimRecursive(sortedData);
    
    // Create JSON and escape forward slashes like in the example
    const jsonData = JSON.stringify(trimmedData).replace(/\//g, '\\/');
    
    console.log('=== Signature Generation (Node.js Example Style) ===');
    console.log('Original data:', JSON.stringify(data, null, 2));
    console.log('After number conversion:', JSON.stringify(clonedData, null, 2));
    console.log('After sorting:', JSON.stringify(sortedData, null, 2));
    console.log('After trimming:', JSON.stringify(trimmedData, null, 2));
    console.log('Final JSON for signing:', jsonData);
    console.log('=== End Signature Generation ===');
    
    // Sign with private key - try different algorithms for Node.js compatibility
    let signature: string;
    try {
      // First try the original algorithm for backwards compatibility
      const sign = crypto.createSign('md5WithRSAEncryption');
      sign.update(jsonData);
      signature = sign.sign(this.config.privateKey, 'base64');
      console.log('✅ Successfully used md5WithRSAEncryption');
    } catch (error) {
      console.log('⚠️ md5WithRSAEncryption failed, trying RSA-MD5...');
      try {
        // Try alternative MD5 algorithm name
        const sign = crypto.createSign('RSA-MD5');
        sign.update(jsonData);
        signature = sign.sign(this.config.privateKey, 'base64');
        console.log('✅ Successfully used RSA-MD5');
      } catch (error2) {
        console.log('⚠️ RSA-MD5 failed, using sha256 (modern fallback)...');
        // Fallback to SHA256 - most widely supported
        const sign = crypto.createSign('sha256');
        sign.update(jsonData);
        signature = sign.sign(this.config.privateKey, 'base64');
        console.log('✅ Successfully used sha256');
      }
    }
    
    return signature;
  }

  // Verify signature for callbacks using same logic as generateSignature
  public verifySignature(data: Record<string, any>): boolean {
    const signature = data.signature;
    if (!signature) {
      return false;
    }

    // Use the same signature generation logic
    const expectedSignature = this.generateSignature(data);
    
    return signature === expectedSignature;
  }

  // Create payment following PHP PaymentConfirmation.php logic
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Add critical fields for API mode like your successful .NET integration
      const paymentData = {
        ...request,
        merchantId: this.config.merchantId,
        connectionMode: "API", // CRITICAL: Force API mode like your .NET project
        apiVersion: "1.0" // Ensure proper API version
      };

      // Generate signature
      console.log('=== JSON Before Signature Generation ===');
      console.log('Payment Data Object:', JSON.stringify(paymentData, null, 2));
      console.log('Sorted Keys:', Object.keys(paymentData).sort());
      console.log('JSON String for Signature:', JSON.stringify(paymentData));
      console.log('=== End JSON Before Signature ===');
      
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
      
      // Debug: Log the form data being sent
      console.log('=== Sending to GPay ===');
      console.log('URL:', `${this.config.baseUrl}/v1/checkout`);
      console.log('Form Data:', formData.toString());
      console.log('=== End Sending Data ===');

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
            transactionId: request.orderRef,
            formData: formDataObj // Include form data for POST submission
          };
        }
      }

      // Handle other response types - with connectionMode=API, expect JSON
      const responseText = await response.text();
      console.log('=== GPay Response Details ===');
      console.log('Status:', response.status);
      console.log('Response:', responseText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      console.log('=== End GPay Response ===');

      try {
        // Try to parse JSON response (connectionMode=API should return JSON)
        const jsonResponse = JSON.parse(responseText);
        console.log('GPay JSON response:', jsonResponse);
        
        // GPay API returns {"status":"created","transactionId":"...","paymentLink":"...","message":"Payment Link created successfully"}
        if (jsonResponse.status === 'created' && jsonResponse.paymentLink) {
          return {
            success: true,
            paymentUrl: jsonResponse.paymentLink,
            transactionId: jsonResponse.transactionId || request.orderRef,
            formData: formDataObj // Include form data for POST submission
          };
        } else {
          return {
            success: false,
            error: jsonResponse.error || jsonResponse.message || 'GPay API error'
          };
        }
      } catch (parseError) {
        // If not JSON, return as text error
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
  // Force production credentials based on .env file
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