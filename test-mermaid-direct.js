const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('Browser:', msg.type(), msg.text()));
  
  // Go directly to docs page
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForTimeout(3000);
  
  // Find the API catalog link and click it
  const apiCatalogExpanded = await page.$('text="API Catalog (10 APIs)"');
  if (apiCatalogExpanded) {
    await apiCatalogExpanded.click();
    await page.waitForTimeout(1000);
  }
  
  // Now find and click API #10 link
  const links = await page.$$('a');
  for (const link of links) {
    const text = await link.textContent();
    if (text && text.includes('API #10')) {
      console.log('Found API #10 link, clicking...');
      await link.click();
      break;
    }
  }
  
  // Wait for navigation and content to load
  await page.waitForTimeout(5000);
  
  // Take screenshot
  await page.screenshot({ path: 'test-mermaid-final.png', fullPage: true });
  
  // Check content
  const content = await page.content();
  
  // Check for Mermaid markers
  if (content.includes('[MERMAID:')) {
    console.log('ERROR: Still see MERMAID markers!');
  } else {
    console.log('SUCCESS: No MERMAID markers found');
  }
  
  // Check for SVG elements
  const svgs = await page.$$('svg');
  console.log('SVG count:', svgs.length);
  
  // Check page text content
  const bodyText = await page.textContent('body');
  if (bodyText.includes('Client Applications') && bodyText.includes('API Gateway')) {
    console.log('SUCCESS: Diagram text content is visible');
  } else {
    console.log('WARNING: Expected diagram content not found');
  }
  
  await browser.close();
})();