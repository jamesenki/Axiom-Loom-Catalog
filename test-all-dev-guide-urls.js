const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const testUrls = [
    'http://localhost:3000/docs/demo-labsdashboards?path=developerguide.md',
    'http://localhost:3000/docs/demo-labsdashboards?path=DEVELOPERGUIDE.md',
    'http://localhost:3000/docs/demo-labsdashboards?path=developer-guide.md',
    'http://localhost:3000/docs/demo-labsdashboards?path=DEVELOPER_GUIDE.md',
    'http://localhost:3000/docs/demo-labsdashboards?path=docs/development/DEVELOPER_GUIDE.md'
  ];
  
  for (const url of testUrls) {
    console.log(`\nTesting: ${url}`);
    await page.goto(url);
    await page.waitForTimeout(1000);
    
    // Check for error
    const hasError = await page.locator('text=/Error|404|Failed to fetch/i').count() > 0;
    console.log(`Has error: ${hasError}`);
    
    if (!hasError) {
      const h1 = await page.locator('h1').first().textContent().catch(() => 'No H1');
      console.log(`H1 content: ${h1}`);
    }
  }
  
  await browser.close();
})();