const { chromium } = require('playwright');

(async () => {
  console.log('🔍 QA Agent: Detailed error analysis...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture all console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });
  
  // Capture network requests
  const networkRequests = [];
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      status: 'pending'
    });
  });
  
  page.on('response', response => {
    const req = networkRequests.find(r => r.url === response.url());
    if (req) {
      req.status = response.status();
      req.statusText = response.statusText();
    }
  });
  
  try {
    console.log('Loading page...');
    await page.goto('http://localhost', { waitUntil: 'networkidle' });
    await page.waitForTimeout(10000); // Wait longer for everything to load
    
    console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach((msg, i) => {
      console.log(`${i + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
      if (msg.location && msg.location.url) {
        console.log(`   Location: ${msg.location.url}:${msg.location.lineNumber}`);
      }
    });
    
    console.log('\n=== NETWORK REQUESTS ===');
    networkRequests.forEach((req, i) => {
      if (req.status >= 400 || req.status === 'pending') {
        console.log(`${i + 1}. [${req.status}] ${req.method} ${req.url}`);
      }
    });
    
    // Check what the main.js file contains
    const mainJsResponse = await page.goto('http://localhost/static/js/main.8ef4a54e.js');
    const mainJsContent = await mainJsResponse.text();
    
    console.log('\n=== MAIN.JS FILE SIZE ===');
    console.log(`Size: ${mainJsContent.length} characters`);
    
    // Look for common error patterns in the JS
    if (mainJsContent.includes('Cannot read properties')) {
      console.log('⚠️  Found "Cannot read properties" error pattern in main.js');
    }
    if (mainJsContent.includes('theme')) {
      console.log('✅ Theme-related code found in main.js');
    }
    if (mainJsContent.includes('createContext')) {
      console.log('✅ createContext found in main.js');
    }
    
  } catch (error) {
    console.log('❌ Debug error:', error.message);
  }
  
  await browser.close();
})();