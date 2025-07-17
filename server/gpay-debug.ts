import fetch from 'node-fetch';

interface GPay405Analysis {
  timestamp: string;
  transactionId: string;
  checkoutUrl: string;
  status: number;
  headers: any;
  responseBody?: string;
  error?: string;
}

export async function analyzeGPay405Error(transactionId: string): Promise<GPay405Analysis> {
  const checkoutUrl = `https://getvisa.gpayprocessing.com/checkout/${transactionId}`;
  
  const analysis: GPay405Analysis = {
    timestamp: new Date().toISOString(),
    transactionId,
    checkoutUrl,
    status: 0,
    headers: {},
  };
  
  try {
    const response = await fetch(checkoutUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      redirect: 'follow',
      timeout: 10000
    });
    
    analysis.status = response.status;
    analysis.headers = Object.fromEntries(response.headers.entries());
    
    if (response.status === 405) {
      analysis.responseBody = await response.text();
      
      // Log specific 405 error details
      console.log('🚨 405 ERROR DETECTED:', {
        timestamp: analysis.timestamp,
        transactionId,
        checkoutUrl,
        status: response.status,
        statusText: response.statusText,
        headers: analysis.headers,
        allowedMethods: response.headers.get('Allow'),
        contentType: response.headers.get('Content-Type'),
        server: response.headers.get('Server'),
        cfRay: response.headers.get('CF-Ray'),
        responseBody: analysis.responseBody?.substring(0, 500)
      });
    }
    
    return analysis;
    
  } catch (error) {
    analysis.error = error instanceof Error ? error.message : 'Unknown error';
    console.error('GPay checkout analysis error:', error);
    return analysis;
  }
}

// Test multiple transactions for pattern analysis
export async function runGPay405PatternAnalysis(transactionIds: string[]): Promise<GPay405Analysis[]> {
  const results: GPay405Analysis[] = [];
  
  for (const transactionId of transactionIds) {
    const analysis = await analyzeGPay405Error(transactionId);
    results.push(analysis);
    
    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Analyze patterns
  const status405Count = results.filter(r => r.status === 405).length;
  const status200Count = results.filter(r => r.status === 200).length;
  
  console.log('📊 PATTERN ANALYSIS RESULTS:', {
    totalRequests: results.length,
    successful: status200Count,
    failed405: status405Count,
    failureRate: `${(status405Count / results.length * 100).toFixed(1)}%`,
    patterns: {
      serversWithErrors: results.filter(r => r.status === 405).map(r => r.headers?.server).filter(Boolean),
      cfRaysWithErrors: results.filter(r => r.status === 405).map(r => r.headers?.['cf-ray']).filter(Boolean),
      timestampsWithErrors: results.filter(r => r.status === 405).map(r => r.timestamp)
    }
  });
  
  return results;
}

// Specific test for checkout page behavior
export async function testGPayCheckoutBehavior(): Promise<void> {
  const testTransactionId = '01k0bscw2s4pza3m8asegewrnq'; // From recent logs
  
  console.log('🔍 STARTING GPAY CHECKOUT BEHAVIOR TEST');
  console.log('Transaction ID:', testTransactionId);
  console.log('Checkout URL:', `https://getvisa.gpayprocessing.com/checkout/${testTransactionId}`);
  
  // Test 1: Multiple rapid requests
  console.log('\n📝 TEST 1: Multiple rapid requests (10 requests)');
  const rapidResults = await runGPay405PatternAnalysis(
    Array(10).fill(testTransactionId)
  );
  
  // Test 2: Different user agents
  console.log('\n📝 TEST 2: Different user agents');
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
  ];
  
  for (const userAgent of userAgents) {
    try {
      const response = await fetch(`https://getvisa.gpayprocessing.com/checkout/${testTransactionId}`, {
        method: 'GET',
        headers: { 'User-Agent': userAgent },
        timeout: 10000
      });
      
      console.log(`User Agent: ${userAgent.split(' ')[0]} - Status: ${response.status}`);
    } catch (error) {
      console.log(`User Agent: ${userAgent.split(' ')[0]} - Error: ${error}`);
    }
  }
  
  // Test 3: Method testing
  console.log('\n📝 TEST 3: HTTP Methods');
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
  
  for (const method of methods) {
    try {
      const response = await fetch(`https://getvisa.gpayprocessing.com/checkout/${testTransactionId}`, {
        method,
        timeout: 5000
      });
      
      console.log(`Method: ${method} - Status: ${response.status}`);
      
      if (response.status === 405) {
        const allowHeader = response.headers.get('Allow');
        console.log(`  → Allow header: ${allowHeader}`);
      }
    } catch (error) {
      console.log(`Method: ${method} - Error: ${error}`);
    }
  }
  
  console.log('\n✅ GPAY CHECKOUT BEHAVIOR TEST COMPLETED');
}