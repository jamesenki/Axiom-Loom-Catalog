const { chromium } = require('playwright');

async function testDocLinks() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Log network requests
  page.on('request', request => {
    if (request.url().includes('API_AND_PROTOCOL_REFERENCE')) {
      console.log('📤 REQUEST:', request.url());
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('API_AND_PROTOCOL_REFERENCE')) {
      console.log('📥 RESPONSE:', response.status(), response.url());
    }
  });
  
  console.log('Navigating to docs page...');
  await page.goto('http://localhost:3000/docs/vehicle-to-cloud-communications-architecture', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  await page.waitForTimeout(2000);
  
  console.log('\nClicking API and Protocol Reference link...');
  const link = page.locator('a:has-text("API and Protocol Reference")').first();
  await link.click();
  
  await page.waitForTimeout(3000);
  
  // Check for error message
  const errorMsg = await page.locator('text=Error Loading Documentation').count();
  if (errorMsg > 0) {
    console.log('\n❌ ERROR MESSAGE DISPLAYED');
    const errorText = await page.locator('text=/Failed to fetch|404 Not Found/').textContent();
    console.log('Error text:', errorText);
  } else {
    console.log('\n✅ No error message');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'doc-link-test.png', fullPage: true });
  console.log('\nScreenshot saved as doc-link-test.png');
  
  await browser.close();
}

testDocLinks().catch(console.error);
