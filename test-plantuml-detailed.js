const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to the developer guide
  await page.goto('http://localhost:3000/docs/demo-labsdashboards');
  await page.waitForTimeout(2000);
  
  // Click on Developer Guide link
  const devGuideLink = await page.locator('a').filter({ hasText: 'Developer Guide' }).first();
  await devGuideLink.click();
  await page.waitForTimeout(3000);
  
  // Check for error details
  const errorElements = await page.locator('.text-red-600').allTextContents();
  console.log('Error details:', errorElements);
  
  // Take screenshot
  await page.screenshot({ path: 'plantuml-errors.png', fullPage: true });
  
  await browser.close();
})();