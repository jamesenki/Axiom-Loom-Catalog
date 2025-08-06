const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate directly to the api-10-diagrams.md file
  console.log('1. Navigating to documentation...');
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForTimeout(2000);
  
  // Click on Architecture & Implementation to expand it
  const archLink = await page.$('text="Architecture & Implementation"');
  if (archLink) {
    console.log('2. Clicking Architecture & Implementation...');
    await archLink.click();
    await page.waitForTimeout(1000);
  }
  
  // Find and click the API #10 link
  const api10Link = await page.$('a:has-text("API #10 - Intelligent EV Fleet & Grid Integration")');
  if (api10Link) {
    console.log('3. Found API #10 link, clicking...');
    await api10Link.click();
  } else {
    console.log('3. API #10 link not found, trying alternate selector...');
    // Try clicking any link with api-10 in href
    await page.click('a[href*="api-10"]').catch(() => {
      console.log('Could not find api-10 link');
    });
  }
  
  // Wait for navigation
  await page.waitForTimeout(5000);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/mermaid-verify.png', fullPage: true });
  
  // Check for Mermaid SVG elements
  const svgElements = await page.$$('svg');
  console.log(`\n4. Found ${svgElements.length} SVG elements`);
  
  // Check for Mermaid-specific classes or attributes
  const mermaidSvg = await page.$('svg[id^="mermaid"]');
  console.log('5. Found Mermaid SVG:', !!mermaidSvg);
  
  // Check for diagram content in SVG
  const svgTexts = await page.$$eval('svg text', texts => texts.map(t => t.textContent));
  console.log('6. Text found in SVGs:', svgTexts.filter(t => t).slice(0, 10));
  
  // Check if we're on the right page
  const h1Text = await page.$eval('h1', el => el.textContent).catch(() => null);
  console.log('7. Page title:', h1Text);
  
  // Check for the presence of diagram containers
  const diagramContainers = await page.$$('.mermaid-container');
  console.log(`8. Mermaid containers found: ${diagramContainers.length}`);
  
  await browser.close();
})();