const puppeteer = require('puppeteer');

async function testConsoleErrors() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  const warnings = [];
  const logs = [];
  
  // Capture console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    // Look for Chrome extension errors specifically
    if (text.includes('web_accessible_resources') || text.includes('Denying load')) {
      errors.push(`Chrome Extension Error: ${text}`);
    } else if (type === 'error') {
      errors.push(text);
    } else if (type === 'warning' && !text.includes('React does not recognize')) {
      warnings.push(text);
    }
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    errors.push(`Page error: ${error.message}`);
  });
  
  // Capture failed requests
  page.on('requestfailed', request => {
    errors.push(`Request failed: ${request.failure().errorText} ${request.url()}`);
  });
  
  console.log('Testing main page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('\nTesting gRPC playground...');
  // Navigate to a gRPC playground page
  await page.goto('http://localhost:3000/grpc-playground/diagnostic-as-code-platform-architecture?file=docs%2Fapi%2Fgrpc%2Fdiagnostic.proto', { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await browser.close();
  
  // Report results
  console.log('\n=== Console Error Report ===');
  if (errors.length > 0) {
    console.log('\n❌ ERRORS FOUND:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  } else {
    console.log('\n✅ No errors found');
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning}`);
    });
  }
  
  process.exit(errors.length > 0 ? 1 : 0);
}

testConsoleErrors().catch(console.error);