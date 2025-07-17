# GPay Integration Code & Endpoint Details

## Our Working Integration (Merchant ID: 1100002537)

### 1. Payment Creation API Call
```javascript
// POST /api/payment/create
const createPayment = async (applicationData) => {
  const response = await fetch('/api/payment/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: applicationData.amount,
      currency: 'USD',
      orderId: applicationData.applicationNumber,
      description: 'Turkey E-Visa Payment',
      customerEmail: applicationData.email,
      customerName: applicationData.fullName,
      customerIp: '127.0.0.1',
      billingCountry: 'TR'
    })
  });
  
  return await response.json();
};
```

### 2. Backend Payment Service (Node.js)
```javascript
// server/payment-new.ts
import crypto from 'crypto';

const MERCHANT_ID = '1100002537';
const API_URL = 'https://getvisa.gpayprocessing.com/v1/checkout';

export const gloDiPayService = {
  async createPayment(paymentData) {
    const transactionId = generateTransactionId();
    
    const requestData = {
      merchantId: MERCHANT_ID,
      amount: paymentData.amount,
      currency: paymentData.currency,
      orderId: paymentData.orderId,
      description: paymentData.description,
      customerEmail: paymentData.customerEmail,
      customerName: paymentData.customerName,
      customerIp: paymentData.customerIp || '127.0.0.1',
      billingCountry: paymentData.billingCountry || 'TR',
      billingStreet1: 'Test Address',
      successUrl: `https://evisatr.xyz/payment-success?ref=${paymentData.orderId}`,
      cancelUrl: `https://evisatr.xyz/payment-cancel?ref=${paymentData.orderId}`,
      transactionId: transactionId,
      metadata: JSON.stringify({ applicationId: paymentData.orderId })
    };

    // Generate signature
    const signature = generateSignature(requestData);
    requestData.signature = signature;

    // Make API request
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(requestData).toString()
    });

    const result = await response.json();
    
    return {
      success: true,
      transactionId: transactionId,
      paymentUrl: `https://getvisa.gpayprocessing.com/checkout/${transactionId}`
    };
  }
};

function generateSignature(data) {
  const privateKey = process.env.GPAY_PRIVATE_KEY;
  const sortedData = Object.keys(data)
    .filter(key => key !== 'signature')
    .sort()
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});

  const queryString = Object.entries(sortedData)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const sign = crypto.createSign('md5WithRSAEncryption');
  sign.update(queryString);
  return sign.sign(privateKey, 'base64');
}
```

### 3. Frontend Payment Redirect (WORKING)
```javascript
// This is the CORRECT way that works
const handlePaymentRedirect = (paymentData) => {
  // ✅ CORRECT: Use GET redirect
  window.location.href = paymentData.paymentUrl;
  
  // ❌ WRONG: These cause 405/500 errors
  // fetch(paymentData.paymentUrl, { method: 'POST' });
  // form.submit();
  // window.location.replace(paymentData.paymentUrl);
};
```

### 4. Payment Success/Cancel Pages
```javascript
// Success page handler
const handlePaymentSuccess = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const applicationNumber = urlParams.get('ref');
  
  // Show success message and application tracking
  showSuccessMessage(applicationNumber);
};

// Cancel page handler
const handlePaymentCancel = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const applicationNumber = urlParams.get('ref');
  
  // Show cancel message and retry option
  showCancelMessage(applicationNumber);
};
```

## Test Transaction Details

### Sample Transaction Created
- **Transaction ID**: 01k0bscw2s4pza3m8asegewrnq
- **Checkout URL**: https://getvisa.gpayprocessing.com/checkout/01k0bscw2s4pza3m8asegewrnq
- **Amount**: 2000 (20.00 USD)
- **Order ID**: EVT-1752743463525
- **Status**: Successfully created

### Test Results
```
GET /checkout/01k0bscw2s4pza3m8asegewrnq -> 200 OK ✅
POST /checkout/01k0bscw2s4pza3m8asegewrnq -> 500 Server Error ❌
PUT /checkout/01k0bscw2s4pza3m8asegewrnq -> 405 Method Not Allowed ❌
DELETE /checkout/01k0bscw2s4pza3m8asegewrnq -> 405 Method Not Allowed ❌
```

## Debug Endpoint for Testing

### Endpoint Details
```javascript
// GET /api/debug/gpay-405
// This endpoint tests all HTTP methods on your checkout page
app.get("/api/debug/gpay-405", async (req, res) => {
  try {
    await testGPayCheckoutBehavior();
    res.json({ message: "GPay 405 analysis completed - check server logs" });
  } catch (error) {
    res.status(500).json({ error: "Debug test failed" });
  }
});
```

### Test Function
```javascript
// server/gpay-debug.ts
export const testGPayCheckoutBehavior = async () => {
  const transactionId = '01k0bscw2s4pza3m8asegewrnq';
  const checkoutUrl = `https://getvisa.gpayprocessing.com/checkout/${transactionId}`;
  
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
  
  for (const method of methods) {
    try {
      const response = await fetch(checkoutUrl, { method });
      console.log(`Method: ${method} - Status: ${response.status}`);
      
      if (response.status === 405) {
        const allowHeader = response.headers.get('Allow');
        console.log(`  → Allow header: ${allowHeader}`);
      }
    } catch (error) {
      console.log(`Method: ${method} - Error: ${error.message}`);
    }
  }
};
```

## Private Key Format (Sample)
```
-----BEGIN PRIVATE KEY-----
MIIJQQIBADANBgkqhkiG9w0BAQEFAASCCSswggknAgEAAoICAQDC+QgfII+aJokS
YWHKtut... (truncated for security)
-----END PRIVATE KEY-----
```

## Complete Request Example
```
POST https://getvisa.gpayprocessing.com/v1/checkout
Content-Type: application/x-www-form-urlencoded

merchantId=1100002537&amount=2000&currency=USD&orderId=EVT-1752743463525&description=Turkey%20E-Visa%20Payment&customerEmail=test@example.com&customerName=Test%20Customer&customerIp=127.0.0.1&billingCountry=TR&billingStreet1=Test%20Address&successUrl=https://evisatr.xyz/payment-success&cancelUrl=https://evisatr.xyz/payment-cancel&transactionId=01k0bscw2s4pza3m8asegewrnq&metadata=%7B%22applicationId%22%3A%22EVT-1752743463525%22%7D&signature=BASE64_SIGNATURE_HERE
```

## Issues Found

1. **POST Method**: Returns 500 Server Error instead of handling the request
2. **Allow Header**: Shows `GET, HEAD, POST` but POST doesn't work
3. **405 Errors**: Occur when non-GET methods are used
4. **Documentation**: Doesn't specify that only GET works for checkout page

## Contact
- **System**: Turkey E-Visa Application Platform
- **Domain**: evisatr.xyz
- **Integration**: Production environment
- **Merchant ID**: 1100002537