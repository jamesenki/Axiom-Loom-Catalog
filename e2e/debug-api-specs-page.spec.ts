import { test } from '@playwright/test';

test('Debug API Specs Page', async ({ page }) => {
  // Navigate to api-specs page
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForLoadState('networkidle');
  
  // Click Architecture Diagrams
  await page.click('a:has-text("Architecture Diagrams")');
  await page.waitForTimeout(2000);
  
  // Get all headings to understand page structure
  const headings = await page.locator('h1, h2, h3, h4').allTextContents();
  console.log('Page headings:', headings);
  
  // Look for any links with "architecture" in them
  const archLinks = await page.locator('a:has-text("architecture"), a:has-text("Architecture")').all();
  console.log(`\nFound ${archLinks.length} architecture links:`);
  
  for (const link of archLinks) {
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    console.log(`  "${text}" -> ${href}`);
  }
  
  // Check if page has API #10 text anywhere
  const hasAPI10 = await page.locator('text="API #10"').count();
  console.log(`\nAPI #10 mentions: ${hasAPI10}`);
  
  // Get page URL to confirm where we are
  console.log('\nCurrent URL:', page.url());
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'test-results/debug-api-specs.png', fullPage: true });
});