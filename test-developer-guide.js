const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Testing developer guide access...');
  
  // First, go to the repository page
  await page.goto('http://localhost:3000/docs/demo-labsdashboards');
  await page.waitForTimeout(2000);
  
  // Look for developer guide link
  const devGuideLink = await page.locator('a:has-text("Developer Guide")').first();
  const linkExists = await devGuideLink.count() > 0;
  
  if (linkExists) {
    console.log('Found Developer Guide link');
    const href = await devGuideLink.getAttribute('href');
    console.log('Link href:', href);
    
    // Click it
    await devGuideLink.click();
    await page.waitForTimeout(2000);
    
    // Check current URL
    console.log('Current URL:', page.url());
    
    // Check for error
    const error = await page.locator('text=/Error|404|Not Found/i').count();
    console.log('Error found:', error > 0);
    
    // Check page content
    const h1 = await page.locator('h1').first().textContent().catch(() => 'No H1 found');
    console.log('Page H1:', h1);
  } else {
    console.log('Developer Guide link not found on page');
  }
  
  // Try direct access
  console.log('\nTrying direct access...');
  await page.goto('http://localhost:3000/docs/demo-labsdashboards?path=developerguide.md');
  await page.waitForTimeout(1000);
  
  const directError = await page.locator('text=/Error|404|Not Found/i').count();
  console.log('Direct access error:', directError > 0);
  
  // Try correct path
  console.log('\nTrying correct path...');
  await page.goto('http://localhost:3000/docs/demo-labsdashboards?path=docs/development/DEVELOPER_GUIDE.md');
  await page.waitForTimeout(1000);
  
  const correctError = await page.locator('text=/Error|404|Not Found/i').count();
  console.log('Correct path error:', correctError > 0);
  
  if (correctError === 0) {
    const content = await page.locator('h1').first().textContent();
    console.log('Successfully loaded:', content);
  }
  
  await page.screenshot({ path: 'developer-guide-test.png' });
  await browser.close();
})();