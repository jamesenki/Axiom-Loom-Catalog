import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('Test the EXACT failing file from screenshot', async ({ page }) => {
  console.log('\nTesting the EXACT scenario from the screenshot...\n');
  
  // Navigate to future-mobility-consumer-platform docs
  await page.goto(`${BASE_URL}/docs/future-mobility-consumer-platform`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Expand architecture folder
  const architectureFolder = page.locator('text="architecture"').first();
  await architectureFolder.click();
  await page.waitForTimeout(1000);
  
  // Click api-10-diagrams.md EXACTLY as shown in screenshot
  console.log('Looking for api-10-diagrams.md...');
  const api10File = page.locator('text="api-10-diagrams.md"').first();
  
  if (await api10File.isVisible()) {
    console.log('Found it - clicking...');
    await api10File.click();
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/api-10-diagrams-clicked.png', fullPage: true });
    
    // Check for error
    const hasError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                    await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
    
    if (hasError) {
      console.log('❌ CONFIRMED: Shows 404 error just like in your screenshot');
      
      // Check the URL to see what path it's trying to load
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);
      
      // Check browser console for errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.log(`Browser console error: ${msg.text()}`);
        }
      });
      
      // Try to get the actual network request
      page.on('response', response => {
        if (response.status() === 404) {
          console.log(`404 request: ${response.url()}`);
        }
      });
      
      await page.waitForTimeout(2000);
    } else {
      console.log('✅ File loads without error (this would be unexpected)');
    }
  } else {
    console.log('❌ Could not find api-10-diagrams.md in sidebar');
  }
  
  expect(hasError).toBe(false); // This will fail, proving the bug exists
});