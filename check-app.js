const { chromium } = require('playwright');

(async () => {
  console.log('=== CHECKING WHAT USER ACTUALLY SEES ===\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Capture console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('❌ CONSOLE ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.error('❌ PAGE ERROR:', err.message);
    console.error(err.stack);
  });
  
  console.log('1. Loading http://localhost...');
  await page.goto('http://localhost', { waitUntil: 'networkidle' });
  
  // Wait a bit
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'what-user-sees.png', fullPage: true });
  console.log('   Screenshot saved: what-user-sees.png');
  
  // Get page content
  const content = await page.textContent('body');
  console.log('\n2. Page content preview:');
  console.log('   ', content.substring(0, 200).replace(/\s+/g, ' '));
  
  // Check for error
  if (content.includes('Something went wrong') || content.includes('Oops!')) {
    console.error('\n❌ ERROR PAGE DETECTED!');
    
    // Try to get error details
    const errorId = await page.$eval('*:has-text("Error ID")', el => el.textContent).catch(() => null);
    if (errorId) {
      console.error('   Error info:', errorId);
    }
    
    // Check network tab
    console.log('\n3. Checking failed network requests...');
    
    // Reload with network monitoring
    const failedRequests = [];
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        error: request.failure()?.errorText
      });
    });
    
    page.on('response', response => {
      if (response.status() >= 400) {
        console.error(`   ❌ HTTP ${response.status()}: ${response.url()}`);
      }
    });
    
    await page.reload({ waitUntil: 'networkidle' });
    
    if (failedRequests.length > 0) {
      console.error('\n   Failed requests:', failedRequests);
    }
  }
  
  // Check if login page loads
  const hasLoginForm = await page.isVisible('input[type="email"]');
  if (hasLoginForm) {
    console.log('\n✅ Login form found - trying to login...');
    await page.fill('input[type="email"]', 'admin@localhost');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(3000);
    const afterLogin = await page.textContent('body');
    if (afterLogin.includes('Something went wrong')) {
      console.error('❌ Error after login!');
    } else {
      console.log('✅ Login attempted');
    }
  }
  
  console.log('\nKeeping browser open for inspection...');
  // Keep browser open for manual inspection
  await page.waitForTimeout(30000);
  
  await browser.close();
})();