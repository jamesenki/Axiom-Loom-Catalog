#!/usr/bin/env ts-node

/**
 * Test Script for Dynamic API Detection
 * 
 * Tests the dynamic API detection service across all repositories
 * to validate button logic and API discovery accuracy.
 */

const fs = require('fs');
const path = require('path');

// Import our detection service
const { detectAllRepositoryApis, detectRepositoryApis } = require('../services/dynamicApiDetection');

const CLONED_REPOS_PATH = path.join(__dirname, '../../cloned-repositories');

async function testApiDetection() {
  console.log('🧪 Testing Dynamic API Detection Service\n');
  
  // Get list of repositories
  const repositories = fs.readdirSync(CLONED_REPOS_PATH, { withFileTypes: true })
    .filter((entry: any) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry: any) => entry.name);
  
  console.log(`Found ${repositories.length} repositories to test:`);
  repositories.forEach((repo: string) => console.log(`  - ${repo}`));
  console.log();
  
  // Test individual repository detection
  console.log('🔍 Testing Individual Repository Detection:\n');
  
  for (const repo of repositories) {
    try {
      console.log(`Testing ${repo}...`);
      const result = await detectRepositoryApis(repo);
      
      console.log(`  📊 Results:`);
      console.log(`    - REST APIs: ${result.apis.rest.length}`);
      console.log(`    - GraphQL Schemas: ${result.apis.graphql.length}`);
      console.log(`    - gRPC Services: ${result.apis.grpc.length}`);
      console.log(`    - Has APIs: ${result.hasAnyApis}`);
      console.log(`    - Recommended Buttons: ${result.recommendedButtons.join(', ') || 'none'}`);
      
      // Show sample API details
      if (result.apis.rest.length > 0) {
        console.log(`    - Sample REST API: ${result.apis.rest[0].title || result.apis.rest[0].file}`);
      }
      if (result.apis.graphql.length > 0) {
        console.log(`    - Sample GraphQL: ${result.apis.graphql[0].file} (${result.apis.graphql[0].type})`);
      }
      if (result.apis.grpc.length > 0) {
        console.log(`    - Sample gRPC: ${result.apis.grpc[0].services.join(', ')}`);
      }
      
      console.log();
    } catch (error) {
      console.error(`  ❌ Error testing ${repo}:`, error);
      console.log();
    }
  }
  
  // Test batch detection
  console.log('📦 Testing Batch Detection:\n');
  
  try {
    const batchResults = await detectAllRepositoryApis(repositories);
    
    console.log('📈 Summary Statistics:');
    const totalRest = batchResults.reduce((sum, r) => sum + r.apis.rest.length, 0);
    const totalGraphql = batchResults.reduce((sum, r) => sum + r.apis.graphql.length, 0);
    const totalGrpc = batchResults.reduce((sum, r) => sum + r.apis.grpc.length, 0);
    const reposWithApis = batchResults.filter(r => r.hasAnyApis).length;
    
    console.log(`  - Total REST APIs: ${totalRest}`);
    console.log(`  - Total GraphQL Schemas: ${totalGraphql}`);
    console.log(`  - Total gRPC Services: ${totalGrpc}`);
    console.log(`  - Repositories with APIs: ${reposWithApis}/${repositories.length}`);
    console.log(`  - API Coverage: ${Math.round((reposWithApis/repositories.length)*100)}%`);
    
    console.log('\n🎯 Button Recommendations by Repository:');
    batchResults.forEach(result => {
      const buttons = result.recommendedButtons.length > 0 
        ? result.recommendedButtons.join(', ')
        : 'documentation-only';
      console.log(`  - ${result.repository}: ${buttons}`);
    });
    
    console.log('\n✅ Dynamic API Detection Test Complete!');
    
    // Validate expected results
    console.log('\n🔍 Validation Checks:');
    
    // Check demo-labsdashboards has GraphQL
    const demo-labsResult = batchResults.find(r => r.repository === 'demo-labsdashboards');
    if (demo-labsResult && demo-labsResult.apis.graphql.length > 0) {
      console.log('  ✅ demo-labsdashboards correctly detected as GraphQL repository');
    } else {
      console.log('  ❌ demo-labsdashboards GraphQL detection failed');
    }
    
    // Check Future Mobility platforms have REST APIs
    const mobilityRepos = batchResults.filter(r => r.repository.includes('future-mobility'));
    const mobilityWithRest = mobilityRepos.filter(r => r.apis.rest.length > 0);
    if (mobilityWithRest.length > 0) {
      console.log(`  ✅ ${mobilityWithRest.length}/${mobilityRepos.length} Future Mobility repos have REST APIs`);
    } else {
      console.log('  ❌ No Future Mobility repos detected with REST APIs');
    }
    
    // Check total API count matches our analysis
    if (totalRest > 200) {
      console.log('  ✅ REST API count matches expected 224+ specifications');
    } else {
      console.log(`  ⚠️  REST API count (${totalRest}) lower than expected 224+`);
    }
    
  } catch (error) {
    console.error('❌ Batch detection failed:', error);
  }
}

// Run the test
if (require.main === module) {
  testApiDetection().catch(console.error);
}

export { testApiDetection };
