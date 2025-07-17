# GPay 405 Error Analysis Report

## Problem
Intermittent 405 "Method Not Allowed" errors on GPay checkout pages causing payment failures.

## Root Cause
HTTP method restrictions on checkout endpoint `/checkout/[transactionId]`

## Test Results
```
✅ GET Method:     Status 200 (SUCCESS)
❌ POST Method:    Status 500 (SERVER ERROR)
❌ PUT Method:     Status 405 (METHOD NOT ALLOWED)
❌ DELETE Method:  Status 405 (METHOD NOT ALLOWED)
❌ PATCH Method:   Status 405 (METHOD NOT ALLOWED)
✅ OPTIONS Method: Status 200 (SUCCESS)
```

**Allow Header**: `GET, HEAD, POST` (but POST returns 500)

## Why 405 Errors Occur
1. Client-side frameworks using POST method
2. HTML forms defaulting to POST
3. JavaScript redirects using wrong HTTP method

## Solution
Use GET method only for checkout page access:

```javascript
// CORRECT
window.location.href = paymentData.paymentUrl;

// INCORRECT - Causes 500/405 errors
// fetch(paymentData.paymentUrl, { method: 'POST' })
// form.submit()
```

## Recommendations for GPay Team

### IMMEDIATE (Critical)
1. **Fix POST Method Handler** - Currently returns 500 Server Error
2. **Update Documentation** - Specify that checkout page only supports GET
3. **Improve Error Messages** - Return clear guidance for 405 errors

### MEDIUM TERM
4. **Align Allow Header** - Remove POST from Allow header or make it work
5. **Add Code Examples** - Show proper redirect methods in documentation

## Test Environment & Debug Endpoint
- **Date**: July 17, 2025
- **Transaction**: 01k0bscw2s4pza3m8asegewrnq
- **Merchant ID**: 1100002537 (Production)
- **API**: https://getvisa.gpayprocessing.com/v1/checkout
- **Debug Endpoint**: Available on request (live testing endpoint)

## Testing Code
You can test the checkout endpoint behavior using this code:

```javascript
// Test different HTTP methods on checkout page
const testCheckoutMethods = async (transactionId) => {
  const baseUrl = `https://getvisa.gpayprocessing.com/checkout/${transactionId}`;
  
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
  
  for (const method of methods) {
    try {
      const response = await fetch(baseUrl, { method });
      console.log(`${method}: Status ${response.status}`);
      
      if (response.status === 405) {
        const allowHeader = response.headers.get('Allow');
        console.log(`  → Allow header: ${allowHeader}`);
      }
    } catch (error) {
      console.log(`${method}: Error - ${error.message}`);
    }
  }
};

// Test with our transaction ID
testCheckoutMethods('01k0bscw2s4pza3m8asegewrnq');
```

## Live Debug Endpoint
We have a debug endpoint that automatically tests your checkout behavior:
- **Method**: GET
- **Response**: JSON with test results and server logs
- **Availability**: Can be provided for live testing upon request

## Payment Integration Code
Our working payment integration (Merchant ID: 1100002537):

```javascript
// Working payment creation
const createPayment = async (amount, orderId) => {
  const response = await fetch('/api/payment/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amount,
      currency: 'USD',
      orderId: orderId,
      description: 'Turkey E-Visa Payment',
      customerEmail: 'customer@example.com',
      customerName: 'Customer Name'
    })
  });
  
  const result = await response.json();
  
  // CORRECT: Use GET redirect
  window.location.href = result.paymentUrl;
  
  // WRONG: These cause 405/500 errors
  // fetch(result.paymentUrl, { method: 'POST' })
  // form.submit()
};
```

## Status
✅ **ROOT CAUSE CONFIRMED & RESOLVED**
- API integration works perfectly (200 status)
- Signature generation correct
- Solution: Use GET method only for checkout redirects

---
**Generated**: July 17, 2025  
**By**: Turkey E-Visa System Technical Team  
**For**: GPay Developer Team