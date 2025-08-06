const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`Console ${type}: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  console.log('Navigating to API Explorer...');
  await page.goto('http://localhost:3000/api-explorer/all?type=grpc', { waitUntil: 'networkidle' });
  
  // Wait for content or timeout
  await page.waitForTimeout(5000);
  
  // Check what's displayed
  const content = await page.textContent('body');
  console.log('\nPage content includes:', content.substring(0, 200));
  
  // Check for loading state
  const loadingVisible = await page.isVisible('text=Loading');
  console.log('\nLoading visible:', loadingVisible);
  
  await browser.close();
})();