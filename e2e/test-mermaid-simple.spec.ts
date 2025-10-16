import { test } from '@playwright/test';

test('Test Mermaid rendering directly', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => console.log('Browser console:', msg.type(), msg.text()));
  
  // Navigate to the repository page
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForTimeout(2000);
  
  // Find and click the Architecture & Implementation link
  const archLink = await page.locator('a:has-text("Architecture & Implementation")').first();
  if (await archLink.isVisible()) {
    await archLink.click();
    await page.waitForTimeout(1000);
  }
  
  // Find and click on API-10 link
  const apiLinks = await page.locator('a').all();
  for (const link of apiLinks) {
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    if (text?.includes('API #10') || href?.includes('api-10')) {
      console.log('Found API #10 link:', text, href);
      await link.click();
      break;
    }
  }
  
  // Wait for content to load
  await page.waitForTimeout(5000);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/mermaid-rendering-test.png', fullPage: true });
  
  // Check content
  const pageContent = await page.content();
  
  // Look for Mermaid markers
  if (pageContent.includes('[MERMAID:')) {
    console.log('ERROR: Found Mermaid markers in page!');
    const markers = pageContent.match(/\[MERMAID:[^\]]+\]/g);
    console.log('Markers found:', markers);
  }
  
  // Check for SVG elements
  const svgCount = await page.locator('svg').count();
  console.log('SVG elements found:', svgCount);
  
  // Check for Mermaid containers
  const mermaidContainers = await page.locator('.mermaid-container').count();
  console.log('Mermaid containers found:', mermaidContainers);
  
  // Check for specific diagram content
  const hasClientApps = pageContent.includes('Client Applications');
  const hasAPIGateway = pageContent.includes('API Gateway');
  console.log('Has "Client Applications":', hasClientApps);
  console.log('Has "API Gateway":', hasAPIGateway);
});