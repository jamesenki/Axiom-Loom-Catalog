const fetch = require('node-fetch');

async function testDetection() {
  console.log('Testing API detection via API endpoints...\n');
  
  const testRepos = [
    'cloudtwin-simulation-platform-architecture',
    'velocityforge-sdv-platform-architecture',
    'rentalFleets'
  ];
  
  // Test the all APIs endpoint
  console.log('=== Testing /api/api-explorer/all endpoint ===');
  try {
    const response = await fetch('http://127.0.0.1:3000/api/api-explorer/all');
    const data = await response.json();
    
    console.log('Total APIs found:', data.total);
    
    // Count by type
    const byType = {};
    data.apis.forEach(api => {
      byType[api.type] = (byType[api.type] || 0) + 1;
    });
    
    console.log('APIs by type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
    // Check for gRPC APIs
    const grpcApis = data.apis.filter(api => api.type === 'gRPC');
    console.log('\ngRPC APIs found:', grpcApis.length);
    grpcApis.forEach(api => {
      console.log(`  - ${api.repository}: ${api.path}`);
      if (api.services) {
        console.log(`    Services: ${api.services.join(', ')}`);
      }
    });
  } catch (error) {
    console.error('Error testing all APIs endpoint:', error.message);
  }
  
  // Test individual repository detection
  console.log('\n\n=== Testing individual repository detection ===');
  for (const repoName of testRepos) {
    console.log(`\nTesting ${repoName}:`);
    
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/detect-apis/${repoName}`);
      const data = await response.json();
      
      console.log('REST APIs found:', data.apis?.rest?.length || 0);
      console.log('GraphQL APIs found:', data.apis?.graphql?.length || 0);
      console.log('gRPC APIs found:', data.apis?.grpc?.length || 0);
      console.log('Postman collections found:', data.postman?.length || 0);
      
      if (data.postman && data.postman.length > 0) {
        console.log('\nPostman collections:');
        data.postman.forEach(collection => {
          console.log(`  - ${collection.name}: ${collection.path}`);
        });
      }
    } catch (error) {
      console.error(`Error testing ${repoName}:`, error.message);
    }
  }
  
  // Test postman collections endpoint specifically
  console.log('\n\n=== Testing Postman collections endpoint ===');
  for (const repoName of testRepos) {
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/postman-collections/${repoName}`);
      const data = await response.json();
      
      if (data.collections && data.collections.length > 0) {
        console.log(`\n${repoName} - ${data.collections.length} collections found:`);
        data.collections.forEach(collection => {
          console.log(`  - ${collection.name} (${collection.path})`);
        });
      }
    } catch (error) {
      // Ignore if endpoint doesn't exist
    }
  }
}

testDetection();