// Quick test to verify Mermaid is working
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to security.md
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/security.md');
  await page.waitForTimeout(3000);
  
  // Check for mermaid containers
  const mermaidContainers = await page.locator('.mermaid-container').count();
  console.log(`Found ${mermaidContainers} mermaid containers`);
  
  // Check for SVG
  const svgs = await page.locator('.mermaid-container svg').count();
  console.log(`Found ${svgs} SVGs`);
  
  // Check for errors
  const errors = await page.locator('.bg-red-50').count();
  console.log(`Found ${errors} error containers`);
  
  // Take screenshot
  await page.screenshot({ path: 'manual-mermaid-test.png', fullPage: true });
  
  await browser.close();
})();