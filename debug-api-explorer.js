const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log(`Console ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  // Log network requests
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/') && url.includes('api-explorer')) {
      console.log(`\nAPI Response from ${url}:`);
      console.log('Status:', response.status());
      if (response.status() !== 200) {
        console.log('Response text:', await response.text());
      }
    }
  });
  
  console.log('Navigating to API Explorer...');
  await page.goto('http://localhost:3000/api-explorer/all?type=grpc', { waitUntil: 'networkidle' });
  
  // Wait a bit
  await page.waitForTimeout(5000);
  
  // Check what's on the page
  const pageContent = await page.textContent('body');
  console.log('\nPage content summary:');
  if (pageContent.includes('Loading...')) {
    console.log('- Page is stuck in loading state');
  }
  if (pageContent.includes('Error Loading APIs')) {
    console.log('- Error message is displayed');
  }
  if (pageContent.includes('0 GRPC APIs Found')) {
    console.log('- Shows 0 GRPC APIs');
  }
  
  // Check if React has errors
  const reactErrors = await page.evaluate(() => {
    const errorElements = document.querySelectorAll('[data-reactroot]');
    return errorElements.length;
  });
  
  await browser.close();
})();