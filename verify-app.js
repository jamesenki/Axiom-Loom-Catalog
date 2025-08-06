#!/usr/bin/env node

const axios = require('axios');
const colors = require('colors/safe');

// Test configuration
const BASE_URL = 'http://127.0.0.1:3000';
const API_URL = 'http://127.0.0.1:3001';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper to test an endpoint
async function testEndpoint(name, url, expectedStatus = 200, checkContent = null) {
  try {
    console.log(`Testing: ${name}...`);
    const response = await axios.get(url, { validateStatus: () => true });
    const status = response.status;
    
    if (status === expectedStatus) {
      if (checkContent) {
        const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        if (checkContent(text)) {
          pass(name, 'Content check passed');
        } else {
          fail(name, 'Content check failed');
        }
      } else {
        pass(name, `Status ${status}`);
      }
    } else {
      fail(name, `Expected ${expectedStatus}, got ${status}`);
    }
  } catch (error) {
    fail(name, error.message);
  }
}

function pass(test, message) {
  results.passed++;
  results.tests.push({ test, passed: true, message });
  console.log(colors.green('✓'), test, '-', message);
}

function fail(test, message) {
  results.failed++;
  results.tests.push({ test, passed: false, message });
  console.log(colors.red('✗'), test, '-', message);
}

// Main test suite
async function runTests() {
  console.log(colors.bold('\n🧪 EYNS AI Experience Center - Verification Tests\n'));

  // 1. Backend API Tests
  console.log(colors.bold.yellow('\n1. Backend API Tests'));
  await testEndpoint('Backend Health Check', `${API_URL}/api/health`);
  await testEndpoint('Repositories API', `${API_URL}/api/repositories`, 200, 
    (text) => {
      try {
        const data = JSON.parse(text);
        return Array.isArray(data) && data.length > 0;
      } catch {
        return false;
      }
    }
  );

  // 2. Frontend Tests
  console.log(colors.bold.yellow('\n2. Frontend Tests'));
  await testEndpoint('Frontend Index', `${BASE_URL}/`, 200, 
    (text) => text.includes('<div id="root"></div>')
  );
  await testEndpoint('Frontend Bundle', `${BASE_URL}/static/js/bundle.js`);

  // 3. Proxy Tests (Frontend calling Backend)
  console.log(colors.bold.yellow('\n3. Proxy Tests'));
  await testEndpoint('Proxied Repositories API', `${BASE_URL}/api/repositories`, 200,
    (text) => {
      try {
        const data = JSON.parse(text);
        return Array.isArray(data) && data.length > 0;
      } catch {
        return false;
      }
    }
  );

  // 4. Authentication Tests
  console.log(colors.bold.yellow('\n4. Authentication Tests'));
  try {
    const loginResponse = await axios.post(`${API_URL}/api/auth/local-login`, {
      email: 'admin@localhost',
      password: 'admin'
    });
    if (loginResponse.data.accessToken) {
      pass('Local Login', 'Token received');
    } else {
      fail('Local Login', 'No token in response');
    }
  } catch (error) {
    if (error.response) {
      fail('Local Login', `Status ${error.response.status}`);
    } else {
      fail('Local Login', error.message);
    }
  }

  // 5. Repository Details Test
  console.log(colors.bold.yellow('\n5. Repository Details Tests'));
  // First get list of repositories
  try {
    const reposResponse = await axios.get(`${API_URL}/api/repositories`);
    const repos = reposResponse.data;
    if (repos.length > 0) {
      const firstRepo = repos[0];
      await testEndpoint(
        `Repository Details: ${firstRepo.name}`, 
        `${API_URL}/api/repository/${firstRepo.name}`,
        200,
        (text) => {
          try {
            const data = JSON.parse(text);
            return data.name === firstRepo.name;
          } catch {
            return false;
          }
        }
      );
    }
  } catch (error) {
    fail('Repository Details', 'Failed to fetch repository list');
  }

  // Summary
  console.log(colors.bold.yellow('\n📊 Test Summary'));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(colors.green(`Passed: ${results.passed}`));
  console.log(colors.red(`Failed: ${results.failed}`));
  
  const percentage = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
  if (percentage === '100.0') {
    console.log(colors.green.bold(`\n✅ ALL TESTS PASSED! (${percentage}%)`));
  } else {
    console.log(colors.yellow.bold(`\n⚠️  ${percentage}% tests passed`));
  }

  // List failed tests
  if (results.failed > 0) {
    console.log(colors.red.bold('\nFailed Tests:'));
    results.tests
      .filter(t => !t.passed)
      .forEach(t => console.log(colors.red(`  - ${t.test}: ${t.message}`)));
  }

  return results.failed === 0;
}

// Run tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error(colors.red.bold('\n❌ Test runner error:'), error);
    process.exit(1);
  });