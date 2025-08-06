const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Testing direct navigation to /api-explorer/all?type=grpc...');
  
  // Navigate directly to the URL
  await page.goto('http://localhost:3000/api-explorer/all?type=grpc', { waitUntil: 'networkidle' });
  
  console.log('Current URL:', page.url());
  
  // Wait a bit for content to load
  await page.waitForTimeout(3000);
  
  // Check for API content
  const pageContent = await page.textContent('body');
  console.log('Page title:', await page.title());
  
  // Look for specific content
  if (pageContent.includes('API Explorer')) {
    console.log('✓ API Explorer page loaded successfully');
  } else if (pageContent.includes('404')) {
    console.error('✗ Got 404 error');
  } else if (pageContent.includes('Error')) {
    console.error('✗ Got error:', pageContent.substring(0, 200));
  }
  
  // Take screenshot
  await page.screenshot({ path: 'api-explorer-direct.png' });
  console.log('Screenshot saved as api-explorer-direct.png');
  
  await browser.close();
})();
