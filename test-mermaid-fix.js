const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to a page with Mermaid diagrams
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForTimeout(2000);
  
  // Click on api-10-diagrams.md
  await page.click('text=api-10-diagrams.md');
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'mermaid-test-result.png' });
  
  // Check if Mermaid rendered
  const mermaidSvg = await page.$('svg.mermaid');
  const mermaidCanvas = await page.$('.mermaid-container svg');
  const mermaidPlaceholder = await page.$('text=/\\[MERMAID:.*\\]/');
  
  console.log('Mermaid SVG found:', !!mermaidSvg);
  console.log('Mermaid Canvas found:', !!mermaidCanvas);
  console.log('Mermaid placeholder found:', !!mermaidPlaceholder);
  
  // Get page content
  const content = await page.content();
  if (content.includes('[MERMAID:')) {
    console.log('ERROR: Mermaid placeholders still visible!');
  } else {
    console.log('SUCCESS: No Mermaid placeholders found');
  }
  
  await browser.close();
})();