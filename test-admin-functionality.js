// Test admin panel data loading
async function testAdminData() {
  console.log('🔍 Testing Admin Panel Data Loading...\n');
  
  try {
    // Test insurance applications
    console.log('1. Testing Insurance Applications API...');
    const insuranceResponse = await fetch('http://localhost:5000/api/insurance-applications');
    console.log(`   Status: ${insuranceResponse.status}`);
    
    if (insuranceResponse.ok) {
      const insuranceApps = await insuranceResponse.json();
      console.log(`   Total insurance applications: ${insuranceApps.length}`);
      
      if (insuranceApps.length > 0) {
        const sample = insuranceApps[0];
        console.log(`   Sample fields:`, Object.keys(sample));
        console.log(`   Sample app: ${sample.firstName} ${sample.lastName} - ${sample.country}`);
        console.log(`   Status: ${sample.status}`);
      }
    } else {
      console.log(`   Error: ${await insuranceResponse.text()}`);
    }
    
    // Test chat messages
    console.log('\n2. Testing Chat Messages API...');
    const chatResponse = await fetch('http://localhost:5000/api/chat/messages');
    console.log(`   Status: ${chatResponse.status}`);
    
    if (chatResponse.ok) {
      const chatMessages = await chatResponse.json();
      console.log(`   Total chat messages: ${chatMessages.length}`);
      
      if (chatMessages.length > 0) {
        const sample = chatMessages[0];
        console.log(`   Sample fields:`, Object.keys(sample));
        console.log(`   Sample message: "${sample.message}" from ${sample.sender}`);
        console.log(`   Session: ${sample.sessionId}`);
      }
    } else {
      console.log(`   Error: ${await chatResponse.text()}`);
    }
    
    // Test visa applications
    console.log('\n3. Testing Visa Applications API...');
    const visaResponse = await fetch('http://localhost:5000/api/applications');
    console.log(`   Status: ${visaResponse.status}`);
    
    if (visaResponse.ok) {
      const visaApps = await visaResponse.json();
      console.log(`   Total visa applications: ${visaApps.length}`);
      
      if (visaApps.length > 0) {
        const sample = visaApps[0];
        console.log(`   Sample fields:`, Object.keys(sample));
        console.log(`   Sample app: ${sample.firstName} ${sample.lastName} - ${sample.nationality}`);
        console.log(`   Status: ${sample.status}`);
      }
    } else {
      console.log(`   Error: ${await visaResponse.text()}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing admin data:', error);
  }
}

testAdminData();