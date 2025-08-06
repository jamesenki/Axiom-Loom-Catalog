const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable all console messages
  page.on('console', msg => console.log('Browser:', msg.text()));
  page.on('pageerror', err => console.log('Page error:', err));
  
  console.log('1. Navigating to docs...');
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForTimeout(3000);
  
  // Try to navigate directly by manipulating the component
  console.log('2. Navigating directly to api-10-diagrams.md...');
  
  await page.evaluate(() => {
    // Find the DocumentationView component and call setSelectedFile
    const event = new Event('navigate-to-file');
    event.detail = 'docs/architecture/api-10-diagrams.md';
    window.dispatchEvent(event);
  });
  
  // Wait a bit
  await page.waitForTimeout(2000);
  
  // Check if still error
  const hasError = await page.$('text="Error Loading Documentation"');
  if (hasError) {
    console.log('3. Still showing error. Trying to reload...');
    await page.click('button:has-text("Retry")');
    await page.waitForTimeout(3000);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/debug-mermaid.png', fullPage: true });
  
  // Check content
  const bodyText = await page.textContent('body');
  console.log('4. Page contains "System Architecture":', bodyText.includes('System Architecture'));
  console.log('5. Page contains "[MERMAID:":', bodyText.includes('[MERMAID:'));
  console.log('6. SVG count:', (await page.$$('svg')).length);
  
  await browser.close();
})();