// Test customer application flow
async function testCustomerFlow() {
  console.log('🔍 Testing Customer Application Flow...\n');
  
  try {
    // 1. Test country selection with eligibility
    console.log('1. Testing Country Selection & Eligibility...');
    const countriesResponse = await fetch('http://localhost:5000/api/countries');
    const countries = await countriesResponse.json();
    
    const eligibleCountries = countries.filter(c => c.eligibleForEvisa);
    const ineligibleCountries = countries.filter(c => !c.eligibleForEvisa);
    
    console.log(`   ✅ Total Countries: ${countries.length}`);
    console.log(`   ✅ E-visa Eligible: ${eligibleCountries.length}`);
    console.log(`   ✅ Not Eligible (Redirect to Insurance): ${ineligibleCountries.length}`);
    
    // Test specific countries
    const testCases = [
      { name: 'Afghanistan', expected: true },
      { name: 'United States', expected: false },
      { name: 'Turkey', expected: false },
      { name: 'Germany', expected: false }
    ];
    
    testCases.forEach(testCase => {
      const country = countries.find(c => c.name === testCase.name);
      const isEligible = country?.eligibleForEvisa || false;
      const status = isEligible === testCase.expected ? '✅' : '❌';
      console.log(`   ${status} ${testCase.name}: ${isEligible ? 'ELIGIBLE' : 'REDIRECT TO INSURANCE'}`);
    });
    
    // 2. Test insurance products
    console.log('\n2. Testing Insurance Products...');
    const insuranceResponse = await fetch('http://localhost:5000/api/insurance-products');
    const insuranceProducts = await insuranceResponse.json();
    
    console.log(`   ✅ Insurance Products Available: ${insuranceProducts.length}`);
    insuranceProducts.slice(0, 3).forEach(product => {
      console.log(`   - ${product.name}: $${product.price} (${product.coverage?.Duration || 'N/A'})`);
    });
    
    // 3. Test form validation endpoint (if exists)
    console.log('\n3. Testing Form Endpoints...');
    try {
      const testApplicationData = {
        countryId: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        phone: '+90123456789',
        passportNumber: 'T123456789',
        dateOfBirth: '1990-01-01',
        arrivalDate: '2025-09-01',
        documentType: 'passport',
        processingType: 'standard'
      };
      
      console.log('   Testing application submission validation...');
      // This will likely fail due to missing fields, but we can see the validation response
      const submitResponse = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testApplicationData)
      });
      
      console.log(`   Validation Test Status: ${submitResponse.status}`);
      if (submitResponse.status !== 200) {
        const errorData = await submitResponse.text();
        console.log(`   Expected validation error: ${errorData.substring(0, 100)}...`);
      }
    } catch (e) {
      console.log('   Form validation test skipped');
    }
    
  } catch (error) {
    console.error('❌ Error testing customer flow:', error);
  }
}

testCustomerFlow();