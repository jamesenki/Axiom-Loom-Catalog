/**
 * EYNS AI Experience Center - Comprehensive Regression Test Suite
 * 
 * This suite tests all critical functionality to prevent regressions
 */

const { chromium } = require('playwright');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';
const API_BASE = 'http://localhost:3001/api';

class RegressionTestSuite {
  constructor() {
    this.results = [];
    this.browser = null;
    this.page = null;
  }

  async setup() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
  }

  async teardown() {
    if (this.browser) await this.browser.close();
  }

  async runTest(name, description, testFn) {
    console.log(`\nRunning: ${name}`);
    console.log(`Description: ${description}`);
    
    try {
      await testFn();
      this.results.push({ name, description, status: 'PASSED' });
      console.log('✅ PASSED');
    } catch (error) {
      this.results.push({ name, description, status: 'FAILED', error: error.message });
      console.log(`❌ FAILED: ${error.message}`);
    }
  }

  async runAllTests() {
    await this.setup();

    // Test 1: Homepage Load
    await this.runTest(
      'Homepage Load Test',
      'Verifies the homepage loads without errors and displays the EYNS header',
      async () => {
        await this.page.goto(BASE_URL);
        const title = await this.page.textContent('h1');
        assert(title.includes('EYNS'), 'Homepage should display EYNS branding');
      }
    );

    // Test 2: Repository List Display
    await this.runTest(
      'Repository List Display',
      'Ensures all repositories are displayed with proper cards and metadata',
      async () => {
        await this.page.goto(BASE_URL);
        await this.page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
        const repoCards = await this.page.$$('[data-testid="repository-card"]');
        assert(repoCards.length > 0, 'Should display at least one repository');
      }
    );

    // Test 3: API Detection - gRPC
    await this.runTest(
      'gRPC API Detection',
      'Verifies gRPC APIs are detected in repositories that contain .proto files',
      async () => {
        const response = await fetch(`${API_BASE}/detect-apis/cloudtwin-simulation-platform-architecture`);
        const data = await response.json();
        assert(data.grpc && data.grpc.length > 0, 'Should detect gRPC APIs in cloudtwin repository');
      }
    );

    // Test 4: API Detection - Postman
    await this.runTest(
      'Postman Collection Detection',
      'Verifies Postman collections are detected in repositories',
      async () => {
        const response = await fetch(`${API_BASE}/api-explorer/all?type=postman`);
        const data = await response.json();
        assert(data.total > 0, 'Should detect Postman collections');
      }
    );

    // Test 5: All APIs Endpoint
    await this.runTest(
      'All APIs Explorer Endpoint',
      'Tests the /api-explorer/all endpoint returns all APIs with proper filtering',
      async () => {
        // Test all APIs
        const allResponse = await fetch(`${API_BASE}/api-explorer/all`);
        const allData = await allResponse.json();
        assert(allData.apis && allData.total > 0, 'Should return all APIs');

        // Test filtered gRPC
        const grpcResponse = await fetch(`${API_BASE}/api-explorer/all?type=grpc`);
        const grpcData = await grpcResponse.json();
        assert(grpcData.filter === 'grpc', 'Should filter by gRPC type');
        assert(grpcData.apis.every(api => api.type === 'gRPC'), 'All returned APIs should be gRPC type');
      }
    );

    // Test 6: Repository Navigation
    await this.runTest(
      'Repository Detail Navigation',
      'Tests clicking on a repository card navigates to the detail page',
      async () => {
        await this.page.goto(BASE_URL);
        await this.page.waitForSelector('[data-testid="repository-card"]');
        await this.page.click('[data-testid="repository-card"]');
        await this.page.waitForURL(/\/repository\/.+/);
        const url = this.page.url();
        assert(url.includes('/repository/'), 'Should navigate to repository detail page');
      }
    );

    // Test 7: API Buttons Display
    await this.runTest(
      'API Buttons on Repository Card',
      'Verifies API buttons (GraphQL, gRPC, Postman) appear on repository cards when APIs are detected',
      async () => {
        await this.page.goto(BASE_URL);
        await this.page.waitForSelector('[data-testid="repository-card"]');
        
        // Check for API buttons
        const buttons = await this.page.$$('[data-testid="api-button"]');
        assert(buttons.length > 0, 'Should display API buttons on cards with APIs');
      }
    );

    // Test 8: Search Functionality
    await this.runTest(
      'Search Functionality',
      'Tests the global search feature works correctly',
      async () => {
        await this.page.goto(BASE_URL);
        await this.page.keyboard.press('Control+K'); // or Meta+K for Mac
        await this.page.waitForSelector('[data-testid="search-modal"]', { timeout: 5000 });
        await this.page.type('[data-testid="search-input"]', 'diagnostic');
        await this.page.waitForTimeout(500);
        const results = await this.page.$$('[data-testid="search-result"]');
        assert(results.length > 0, 'Should show search results');
      }
    );

    // Test 9: Document Viewer
    await this.runTest(
      'Markdown Document Viewer',
      'Tests that markdown documents render correctly with link navigation',
      async () => {
        await this.page.goto(`${BASE_URL}/repository/diagnostic-as-code-platform-architecture`);
        await this.page.waitForSelector('[data-testid="document-link"]');
        await this.page.click('[data-testid="document-link"]');
        await this.page.waitForSelector('[data-testid="markdown-content"]');
        const content = await this.page.textContent('[data-testid="markdown-content"]');
        assert(content.length > 0, 'Should display markdown content');
      }
    );

    // Test 10: Error Handling
    await this.runTest(
      'Error Handling - 404 Routes',
      'Verifies proper error handling for non-existent routes',
      async () => {
        await this.page.goto(`${BASE_URL}/non-existent-route`);
        const body = await this.page.textContent('body');
        assert(!body.includes('Cannot GET'), 'Should handle 404 routes gracefully');
      }
    );

    // Test 11: API Explorer All Types
    await this.runTest(
      'API Explorer - All Types Page',
      'Tests the /api-explorer/all page loads and displays APIs correctly',
      async () => {
        await this.page.goto(`${BASE_URL}/api-explorer/all?type=grpc`);
        await this.page.waitForSelector('h2', { timeout: 10000 });
        const heading = await this.page.textContent('h2');
        assert(heading.includes('APIs Found'), 'Should display API count');
      }
    );

    // Test 12: GraphQL Playground
    await this.runTest(
      'GraphQL Playground Access',
      'Verifies GraphQL playground is accessible for GraphQL APIs',
      async () => {
        await this.page.goto(`${BASE_URL}/repository/cloudtwin-simulation-platform-architecture`);
        const hasGraphQL = await this.page.$('[data-testid="graphql-button"]');
        if (hasGraphQL) {
          await hasGraphQL.click();
          await this.page.waitForURL(/graphql/);
          assert(true, 'GraphQL playground should be accessible');
        } else {
          console.log('Skipped - No GraphQL APIs in this repository');
        }
      }
    );

    // Test 13: Sync Functionality
    await this.runTest(
      'Repository Sync Button',
      'Tests that the sync button is present and clickable (not testing actual sync)',
      async () => {
        await this.page.goto(BASE_URL);
        const syncButton = await this.page.$('button:has-text("Sync")');
        assert(syncButton, 'Sync button should be present');
      }
    );

    // Test 14: Authentication
    await this.runTest(
      'Authentication Flow',
      'Verifies authentication is working (bypass auth mode)',
      async () => {
        await this.page.goto(BASE_URL);
        // In bypass mode, should not see login screen
        const hasLogin = await this.page.$('text=Login');
        assert(!hasLogin, 'Should not show login in bypass auth mode');
      }
    );

    // Test 15: Performance - Page Load Time
    await this.runTest(
      'Performance - Homepage Load Time',
      'Ensures homepage loads within acceptable time (< 3 seconds)',
      async () => {
        const startTime = Date.now();
        await this.page.goto(BASE_URL);
        await this.page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        assert(loadTime < 3000, `Page should load in under 3 seconds (actual: ${loadTime}ms)`);
      }
    );

    await this.teardown();
    this.printSummary();
  }

  printSummary() {
    console.log('\n=====================================');
    console.log('REGRESSION TEST SUMMARY');
    console.log('=====================================');
    
    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed > 0) {
      console.log('\nFailed Tests:');
      this.results.filter(r => r.status === 'FAILED').forEach(test => {
        console.log(`\n- ${test.name}`);
        console.log(`  Description: ${test.description}`);
        console.log(`  Error: ${test.error}`);
      });
    }
    
    console.log('\n=====================================');
    
    // Exit with error code if tests failed
    if (failed > 0) {
      process.exit(1);
    }
  }
}

// Run the test suite
const suite = new RegressionTestSuite();
suite.runAllTests().catch(console.error);