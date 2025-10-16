import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('Test the exact api-10-diagrams.md file that shows 404', async ({ page }) => {
  console.log('\nTesting the EXACT file from screenshot: api-10-diagrams.md\n');
  
  // Navigate to future-mobility-consumer-platform
  await page.goto(`${BASE_URL}/docs/future-mobility-consumer-platform`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Take initial screenshot
  await page.screenshot({ path: 'test-results/before-clicking-api-10.png', fullPage: true });
  
  // Find and click api-10-diagrams.md in the sidebar
  console.log('Looking for api-10-diagrams.md in sidebar...');
  
  // Try multiple strategies to find it
  const strategies = [
    // Strategy 1: Exact text match
    { selector: 'text="api-10-diagrams.md"', name: 'exact text' },
    // Strategy 2: Contains text
    { selector: '[class*="fileTreeItem"]:has-text("api-10-diagrams.md")', name: 'fileTreeItem with text' },
    // Strategy 3: Any element with the text
    { selector: '*:has-text("api-10-diagrams.md")', name: 'any element with text' }
  ];
  
  let clicked = false;
  for (const strategy of strategies) {
    console.log(`Trying ${strategy.name}...`);
    const element = page.locator(strategy.selector).first();
    
    if (await element.isVisible({ timeout: 2000 })) {
      console.log(`  ✓ Found using ${strategy.name}`);
      
      // Log what we're about to click
      const text = await element.textContent();
      console.log(`  Text content: "${text}"`);
      
      // Click it
      await element.click();
      clicked = true;
      break;
    } else {
      console.log(`  ✗ Not found with ${strategy.name}`);
    }
  }
  
  if (!clicked) {
    // If not found, list all visible items in sidebar
    console.log('\nListing all items in sidebar:');
    const items = await page.locator('[class*="fileTreeItem"]').all();
    for (let i = 0; i < Math.min(20, items.length); i++) {
      const text = await items[i].textContent();
      console.log(`  ${i}: ${text}`);
      if (text?.includes('api-10')) {
        console.log('    ^ This contains api-10, clicking it!');
        await items[i].click();
        clicked = true;
        break;
      }
    }
  }
  
  if (clicked) {
    await page.waitForTimeout(3000);
    
    // Take screenshot after click
    await page.screenshot({ path: 'test-results/after-clicking-api-10.png', fullPage: true });
    
    // Check for error
    const hasError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 });
    const has404 = await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
    
    if (hasError || has404) {
      console.log('\n❌ CONFIRMED: Shows 404 error');
      
      // Get the current URL
      const url = page.url();
      console.log(`Current URL: ${url}`);
      
      // Monitor network to see what request failed
      page.on('response', response => {
        if (response.status() === 404) {
          console.log(`404 Request: ${response.url()}`);
        }
      });
      
      // Try to understand what path it's trying to load
      const selectedFile = await page.evaluate(() => {
        // Try to get the selected file from React state or DOM
        const selected = document.querySelector('[class*="selected"]');
        return selected?.textContent || 'unknown';
      });
      console.log(`Selected file in UI: ${selectedFile}`);
      
    } else {
      console.log('\n✅ File loads without error');
      
      // Check content
      const hasHeading = await page.locator('h1, h2, h3').first().isVisible();
      console.log(`Has heading: ${hasHeading}`);
      
      // Check for PlantUML
      const hasPlantUMLCode = await page.locator('text="@startuml"').isVisible({ timeout: 1000 });
      const hasPlantUMLImage = await page.locator('img[src*="plantuml"]').isVisible({ timeout: 1000 });
      
      console.log(`PlantUML as code: ${hasPlantUMLCode}`);
      console.log(`PlantUML as image: ${hasPlantUMLImage}`);
    }
  } else {
    console.log('\n❌ Could not find api-10-diagrams.md in sidebar at all!');
  }
});