// Browser console debug code
// Copy and paste this into browser console (F12)

console.log("=== GPay Payment Debug Test ===");

// Test 1: Check if payment API works
async function testPaymentAPI() {
  console.log("1. Testing Payment API...");
  try {
    const response = await fetch("/api/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 114,
        currency: "USD",
        orderId: "CONSOLE-TEST-" + Date.now(),
        description: "Console Test Payment",
        customerEmail: "console@test.com",
        customerName: "Console Test"
      })
    });
    
    const data = await response.json();
    console.log("Payment API Response:", data);
    
    if (data.success && data.paymentUrl) {
      console.log("✅ Payment API working, payment URL:", data.paymentUrl);
      return data.paymentUrl;
    } else {
      console.log("❌ Payment API failed:", data.error);
      return null;
    }
  } catch (error) {
    console.log("❌ Payment API error:", error);
    return null;
  }
}

// Test 2: Check if redirect works
function testRedirect(url) {
  console.log("2. Testing redirect to:", url);
  try {
    window.location.href = url;
    console.log("✅ Redirect initiated");
  } catch (error) {
    console.log("❌ Redirect error:", error);
  }
}

// Test 3: Check specific transaction ID
function testTransactionId(transactionId) {
  console.log("3. Testing transaction ID:", transactionId);
  const url = `https://getvisa.gpayprocessing.com/checkout/${transactionId}`;
  console.log("Testing URL:", url);
  
  fetch(url, { method: 'HEAD' })
    .then(response => {
      console.log("Transaction ID test result:", response.status);
      if (response.status === 200) {
        console.log("✅ Transaction ID is valid");
      } else {
        console.log("❌ Transaction ID invalid or expired");
      }
    })
    .catch(error => {
      console.log("❌ Transaction ID test error:", error);
    });
}

// Run all tests
async function runAllTests() {
  console.log("Starting all tests...");
  
  // Test current transaction ID
  testTransactionId("01k0c2zxvymffgs5q4m62cmzmx");
  
  // Test payment API
  const paymentUrl = await testPaymentAPI();
  
  // If payment API works, test redirect
  if (paymentUrl) {
    console.log("Payment API successful, testing redirect in 3 seconds...");
    setTimeout(() => {
      testRedirect(paymentUrl);
    }, 3000);
  }
}

// Run the tests
runAllTests();