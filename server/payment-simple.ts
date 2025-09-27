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
    // Format private key exactly like GPay's example format
    let privateKey = config.privateKey;
    
    // Remove surrounding quotes if present
    privateKey = privateKey.replace(/^["']|["']$/g, '');
    
    // Ensure proper line breaks like GPay example
    if (!privateKey.includes('\n')) {
      // Split the key properly with line breaks
      privateKey = privateKey.replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
                            .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----');
      
      // Add line breaks every 64 characters in the middle content
      const lines = privateKey.split('\n');
      const formattedLines = [];
      
      for (let line of lines) {
        if (line.startsWith('-----') || line.length <= 64) {
          formattedLines.push(line);
        } else {
          // Split long lines into 64-character chunks
          while (line.length > 64) {
            formattedLines.push(line.substring(0, 64));
            line = line.substring(64);
          }
          if (line.length > 0) {
            formattedLines.push(line);
          }
        }
      }
      
      privateKey = formattedLines.join('\n');
    }
    
    this.config = {
      ...config,
      privateKey: privateKey
    };
    
    console.log('🔐 GPay Private Key Format:');
    console.log('- Length:', this.config.privateKey.length);
    console.log('- Lines:', this.config.privateKey.split('\n').length);
    console.log('- First line:', this.config.privateKey.split('\n')[0]);
    console.log('- Last line:', this.config.privateKey.split('\n').slice(-1)[0]);
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

  // Generate signature EXACTLY like GPay's official JavaScript example
  public generateSignature(data: Record<string, any>): string {
    console.log('🔥 USING OFFICIAL GPAY JAVASCRIPT SIGNATURE METHOD');
    
    // Clone data exactly like GPay example
    const clonedData = JSON.parse(JSON.stringify(data));
    
    // Convert numbers to strings exactly like GPay example
    Object.keys(clonedData).forEach(key => {
      if (typeof clonedData[key] === 'number') {
        clonedData[key] = String(clonedData[key]);
      }
    });
    
    // Sort keys exactly like GPay example
    const sortedData: Record<string, any> = {};
    Object.keys(clonedData)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .forEach(key => {
        sortedData[key] = clonedData[key];
      });
    
    // Trim recursively exactly like GPay example
    const trimRecursive = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return typeof obj === 'string' ? obj.trim() : obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => trimRecursive(item));
      }
      
      const result: Record<string, any> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = trimRecursive(obj[key]);
        }
      }
      return result;
    };
    
    const trimmedData = trimRecursive(sortedData);
    
    // Create JSON and escape slashes exactly like GPay example
    const jsonData = JSON.stringify(trimmedData).replace(/\//g, '\\/');
    
    console.log('=== OFFICIAL GPAY SIGNATURE GENERATION ===');
    console.log('Final JSON for signing:', jsonData);
    
    // Use md5WithRSAEncryption exactly like GPay example
    try {
      const sign = crypto.createSign('md5WithRSAEncryption');
      sign.update(jsonData);
      const signature = sign.sign(this.config.privateKey, 'base64');
      console.log('✅ OFFICIAL GPAY SIGNATURE SUCCESS!');
      console.log('Signature length:', signature.length);
      return signature;
    } catch (error) {
      console.error('❌ GPay signature failed:', error);
      console.log('Private key preview:', this.config.privateKey.substring(0, 100) + '...');
      throw new Error(`GPay signature generation failed: ${error}`);
    }
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
      console.log('🔍 PARSE ATTEMPT 1: URL decode + Base64 decode + JSON parse');
      
      // Method 1: URL decode -> Base64 decode -> JSON parse (original)
      const urlDecoded = decodeURIComponent(payload);
      const base64Decoded = Buffer.from(urlDecoded, 'base64').toString('utf8');
      const paymentData = JSON.parse(base64Decoded);
      
      console.log('✅ PARSE SUCCESS with Method 1');
      return paymentData;
    } catch (error1) {
      console.log('❌ PARSE Method 1 failed:', error1.message);
      
      try {
        console.log('🔍 PARSE ATTEMPT 2: Direct Base64 decode + JSON parse');
        
        // Method 2: Direct Base64 decode -> JSON parse
        const base64Decoded = Buffer.from(payload, 'base64').toString('utf8');
        const paymentData = JSON.parse(base64Decoded);
        
        console.log('✅ PARSE SUCCESS with Method 2');
        return paymentData;
      } catch (error2) {
        console.log('❌ PARSE Method 2 failed:', error2.message);
        
        try {
          console.log('🔍 PARSE ATTEMPT 3: Direct JSON parse');
          
          // Method 3: Direct JSON parse (already JSON)
          const paymentData = JSON.parse(payload);
          
          console.log('✅ PARSE SUCCESS with Method 3');
          return paymentData;
        } catch (error3) {
          console.log('❌ PARSE Method 3 failed:', error3.message);
          
          try {
            console.log('🔍 PARSE ATTEMPT 4: URL decode + JSON parse');
            
            // Method 4: URL decode -> JSON parse
            const urlDecoded = decodeURIComponent(payload);
            const paymentData = JSON.parse(urlDecoded);
            
            console.log('✅ PARSE SUCCESS with Method 4');
            return paymentData;
          } catch (error4) {
            console.log('❌ ALL PARSE METHODS FAILED');
            console.error('Original payload:', payload);
            console.error('Error 1 (URL+Base64+JSON):', error1.message);
            console.error('Error 2 (Base64+JSON):', error2.message);
            console.error('Error 3 (Direct JSON):', error3.message);
            console.error('Error 4 (URL+JSON):', error4.message);
            return null;
          }
        }
      }
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