const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Go to main docs page
  console.log('Going to demo-labsdashboards docs...');
  await page.goto('http://localhost:3000/docs/demo-labsdashboards');
  await page.waitForTimeout(2000);
  
  // Look for the developer guide in the sidebar
  console.log('Looking for developer guide in sidebar...');
  const sidebarLinks = await page.locator('.markdownToc a, aside a').all();
  console.log(`Found ${sidebarLinks.length} sidebar links`);
  
  for (const link of sidebarLinks) {
    const text = await link.textContent();
    if (text.toLowerCase().includes('developer')) {
      console.log(`Found link with text: ${text}`);
      await link.click();
      await page.waitForTimeout(2000);
      break;
    }
  }
  
  // Check if we loaded the developer guide
  const h1 = await page.locator('h1').nth(1).textContent().catch(() => 'No H1');
  console.log(`Current H1: ${h1}`);
  
  // Take screenshot
  await page.screenshot({ path: 'nav-to-dev-guide.png', fullPage: true });
  
  await browser.close();
})();