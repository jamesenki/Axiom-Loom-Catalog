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
  
  // Check if PlantUML diagrams are rendering
  const plantUmlSvgs = await page.locator('svg').count();
  console.log('Number of SVG elements found:', plantUmlSvgs);
  
  // Take screenshot
  await page.screenshot({ path: 'plantuml-test.png', fullPage: true });
  
  // Check for any error messages
  const errors = await page.locator('.text-red-700').allTextContents();
  if (errors.length > 0) {
    console.log('Errors found:', errors);
  } else {
    console.log('No errors found');
  }
  
  await browser.close();
})();