const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Go to demo-labsdashboards
  await page.goto('http://localhost:3000/docs/demo-labsdashboards');
  await page.waitForTimeout(2000);
  
  // Find and click Developer Guide link
  const devGuideLink = await page.locator('a:has-text("Developer Guide")').first();
  console.log('Found Developer Guide link');
  
  await devGuideLink.click();
  await page.waitForTimeout(2000);
  
  // Check if we're showing the redirect or the actual guide
  const content = await page.locator('main').textContent();
  const hasRedirect = content.includes('has moved');
  const hasActualGuide = content.includes('IoTSphere Developer Guide (Unified)');
  
  console.log('Has redirect message:', hasRedirect);
  console.log('Has actual guide:', hasActualGuide);
  
  // If we see the redirect, click the link
  if (hasRedirect) {
    const redirectLink = await page.locator('a:has-text("IoTSphere Developer Guide")').first();
    await redirectLink.click();
    await page.waitForTimeout(2000);
    
    // Check again
    const newContent = await page.locator('main').textContent();
    const nowHasGuide = newContent.includes('clean-architecture');
    console.log('After following redirect, has guide:', nowHasGuide);
  }
  
  // Take final screenshot
  await page.screenshot({ path: 'dev-guide-final.png', fullPage: true });
  
  await browser.close();
})();