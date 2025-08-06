const { chromium } = require('playwright');

async function detailedNetworkAnalysis() {
  console.log('=== DETAILED NETWORK ANALYSIS ===\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allRequests = [];
  const failedRequests = [];
  const consoleMessages = [];

  // Track all network requests
  page.on('request', request => {
    allRequests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType()
    });
  });

  page.on('response', response => {
    const request = response.request();
    if (response.status() >= 400) {
      failedRequests.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    }
  });

  // Track all console messages
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  try {
    console.log('🌐 Loading http://localhost with detailed monitoring...');
    await page.goto('http://localhost', { waitUntil: 'networkidle' });
    
    // Wait for React to potentially mount
    await page.waitForTimeout(5000);
    
    console.log('\n📊 REQUEST SUMMARY:');
    console.log(`Total requests: ${allRequests.length}`);
    console.log(`Failed requests: ${failedRequests.length}`);
    console.log(`Console messages: ${consoleMessages.length}`);
    
    console.log('\n📝 ALL REQUESTS:');
    allRequests.forEach((req, index) => {
      console.log(`${index + 1}. ${req.method} ${req.url} (${req.resourceType})`);
    });
    
    if (failedRequests.length > 0) {
      console.log('\n❌ FAILED REQUESTS:');
      failedRequests.forEach((req, index) => {
        console.log(`${index + 1}. ${req.status} ${req.statusText} - ${req.method} ${req.url} (${req.resourceType})`);
      });
    }
    
    console.log('\n💬 CONSOLE MESSAGES:');
    consoleMessages.forEach((msg, index) => {
      console.log(`${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
      if (msg.location && (msg.location.url || msg.location.lineNumber)) {
        console.log(`   Location: ${msg.location.url}:${msg.location.lineNumber}:${msg.location.columnNumber}`);
      }
    });
    
    // Check for specific error patterns in React
    const reactErrors = consoleMessages.filter(msg => 
      msg.text.includes('React') || 
      msg.text.includes('chunk') || 
      msg.text.includes('Module') ||
      msg.text.includes('Cannot resolve') ||
      msg.text.includes('Failed to fetch')
    );
    
    if (reactErrors.length > 0) {
      console.log('\n⚛️ REACT/MODULE SPECIFIC ERRORS:');
      reactErrors.forEach((msg, index) => {
        console.log(`${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
      });
    }
    
    // Check for API endpoints
    console.log('\n🔗 API CALLS:');
    const apiCalls = allRequests.filter(req => req.url.includes('/api/'));
    if (apiCalls.length === 0) {
      console.log('❌ NO API CALLS DETECTED - This might be the issue!');
    } else {
      apiCalls.forEach((req, index) => {
        console.log(`${index + 1}. ${req.method} ${req.url}`);
      });
    }
    
    // Check for specific resources that might be missing
    const criticalResources = [
      '/api/health',
      '/api/auth/local-login',
      '/api/repositories',
      '/manifest.json',
      '/favicon.ico'
    ];
    
    console.log('\n🔍 CHECKING CRITICAL RESOURCES:');
    for (const resource of criticalResources) {
      try {
        const response = await page.goto(`http://localhost${resource}`, { waitUntil: 'networkidle' });
        console.log(`✅ ${resource}: ${response.status()} ${response.statusText()}`);
      } catch (error) {
        console.log(`❌ ${resource}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ CRITICAL ERROR: ${error.message}`);
  }
  
  await browser.close();
}

detailedNetworkAnalysis().catch(console.error);