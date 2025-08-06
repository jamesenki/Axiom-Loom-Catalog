const path = require('path');
const { detectRepositoryApis } = require('./src/api/dynamicApiDetection');

async function testDetection() {
  console.log('Testing API detection...\n');
  
  const testRepos = [
    'cloudtwin-simulation-platform-architecture',
    'velocityforge-sdv-platform-architecture',
    'rentalFleets'
  ];
  
  for (const repoName of testRepos) {
    console.log(`\n=== Testing ${repoName} ===`);
    const repoPath = path.join(__dirname, 'cloned-repositories', repoName);
    
    try {
      const result = await detectRepositoryApis(repoPath, repoName);
      
      console.log('REST APIs found:', result.apis.rest.length);
      console.log('GraphQL APIs found:', result.apis.graphql.length);
      console.log('gRPC APIs found:', result.apis.grpc.length);
      console.log('Postman collections found:', result.postman?.length || 0);
      
      if (result.apis.grpc.length > 0) {
        console.log('\ngRPC files:');
        result.apis.grpc.forEach(api => {
          console.log(`  - ${api.file}`);
          if (api.services) {
            console.log(`    Services: ${api.services.join(', ')}`);
          }
        });
      }
      
      if (result.postman && result.postman.length > 0) {
        console.log('\nPostman collections:');
        result.postman.forEach(collection => {
          console.log(`  - ${collection.name}: ${collection.path}`);
        });
      }
    } catch (error) {
      console.error(`Error detecting APIs: ${error.message}`);
    }
  }
}

testDetection();