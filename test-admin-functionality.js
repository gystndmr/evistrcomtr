// Test admin panel functionality
async function testAdminEndpoints() {
  console.log('🔍 Testing Admin Panel Endpoints...\n');
  
  try {
    // Test admin applications endpoint
    console.log('1. Testing /api/admin/applications...');
    const appsResponse = await fetch('http://localhost:5000/api/admin/applications?page=1&limit=5');
    const appsData = await appsResponse.json();
    console.log(`   Status: ${appsResponse.status}`);
    console.log(`   Total Applications: ${appsData.totalCount}`);
    console.log(`   Current Page: ${appsData.currentPage}`);
    console.log(`   Sample Application Fields:`, Object.keys(appsData.applications[0] || {}));
    
    // Test admin insurance applications endpoint
    console.log('\n2. Testing /api/admin/insurance-applications...');
    const insuranceResponse = await fetch('http://localhost:5000/api/admin/insurance-applications?page=1&limit=5');
    const insuranceData = await insuranceResponse.json();
    console.log(`   Status: ${insuranceResponse.status}`);
    console.log(`   Total Insurance Applications: ${insuranceData.totalCount}`);
    console.log(`   Current Page: ${insuranceData.currentPage}`);
    console.log(`   Sample Insurance Application Fields:`, Object.keys(insuranceData.applications[0] || {}));
    
    // Test search functionality
    console.log('\n3. Testing search functionality...');
    const searchResponse = await fetch('http://localhost:5000/api/admin/applications?page=1&limit=5&search=test');
    const searchData = await searchResponse.json();
    console.log(`   Search Status: ${searchResponse.status}`);
    console.log(`   Search Results: ${searchData.totalCount} found`);
    
    // Test statistics endpoint if exists
    console.log('\n4. Testing statistics...');
    try {
      const statsResponse = await fetch('http://localhost:5000/api/admin/stats');
      const statsData = await statsResponse.json();
      console.log(`   Stats Status: ${statsResponse.status}`);
      console.log(`   Stats Data:`, statsData);
    } catch (e) {
      console.log('   Stats endpoint not available');
    }
    
  } catch (error) {
    console.error('❌ Error testing admin endpoints:', error);
  }
}

testAdminEndpoints();