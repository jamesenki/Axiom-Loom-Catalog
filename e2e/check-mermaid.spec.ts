import { test, expect } from '@playwright/test';

test('Check Mermaid rendering', async ({ page }) => {
  // Go directly to the architecture diagrams page
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  
  // Wait for initial content to load
  await page.waitForTimeout(2000);
  
  // Navigate to api-10-diagrams.md by clicking link in README
  const link = await page.$('a[href*="api-10-diagrams"]');
  if (link) {
    await link.click();
  } else {
    // If link not found, try direct navigation
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
    await page.evaluate(() => {
      // Simulate navigation to api-10-diagrams.md
      const event = new CustomEvent('navigate', { detail: 'docs/architecture/api-10-diagrams' });
      window.dispatchEvent(event);
    });
  }
  
  // Wait for the document to load
  await page.waitForTimeout(3000);
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'test-results/mermaid-check.png', fullPage: true });
  
  // Check page content
  const content = await page.content();
  
  // Check if Mermaid placeholder is visible
  if (content.includes('[MERMAID:') || content.includes('data-mermaid-id=')) {
    console.log('ERROR: Mermaid placeholders still visible in HTML!');
    console.log('Found placeholders:', content.match(/\[MERMAID:[^\]]+\]/g) || content.match(/data-mermaid-id="[^"]+"/g));
  }
  
  // Check for Mermaid SVG or canvas
  const mermaidSvg = await page.$('svg');
  const mermaidContainer = await page.$('.mermaid-container svg');
  
  console.log('SVG elements found:', await page.$$eval('svg', els => els.length));
  console.log('Mermaid containers found:', await page.$$eval('.mermaid-container', els => els.length));
  
  // Check for specific Mermaid elements
  const hasGraphElement = await page.$('text:has-text("Client Applications")');
  console.log('Has "Client Applications" text:', !!hasGraphElement);
  
  // Expect at least one SVG
  expect(await page.$$eval('svg', els => els.length)).toBeGreaterThan(0);
});