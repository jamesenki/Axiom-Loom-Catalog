const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to the developer guide
  await page.goto('http://localhost:3000/docs/nslabsdashboards');
  await page.waitForTimeout(2000);
  
  // Click on Developer Guide link
  const devGuideLink = await page.locator('a').filter({ hasText: 'Developer Guide' }).first();
  await devGuideLink.click();
  await page.waitForTimeout(5000);
  
  // Scroll to the architecture section
  await page.evaluate(() => {
    const architectureHeading = document.querySelector('h2#architecture');
    if (architectureHeading) {
      architectureHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  await page.waitForTimeout(2000);
  
  // Take screenshot of the page with PlantUML diagrams
  await page.screenshot({ path: 'plantuml-fixed.png', fullPage: true });
  
  console.log('Screenshot saved as plantuml-fixed.png');
  
  await browser.close();
})();