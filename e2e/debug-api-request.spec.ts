import { test } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('Debug API request for architecture files', async ({ page }) => {
  // Monitor network requests
  const apiRequests = [];
  
  page.on('request', request => {
    if (request.url().includes('/api/repository/')) {
      console.log(`API Request: ${request.method()} ${request.url()}`);
      apiRequests.push(request.url());
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/repository/') && response.status() === 404) {
      console.log(`❌ 404 Response: ${response.url()}`);
    }
  });
  
  // Navigate to docs
  await page.goto(`${BASE_URL}/docs/future-mobility-consumer-platform`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  console.log('\nInitial API requests:');
  apiRequests.forEach(url => console.log(`  - ${url}`));
  
  // Clear requests
  apiRequests.length = 0;
  
  // Try to find and click a nested file
  console.log('\nLooking for nested architecture files...');
  
  // Take screenshot to see current state
  await page.screenshot({ path: 'test-results/debug-sidebar-state.png' });
  
  // Get all visible file items
  const fileItems = await page.locator('[class*="fileTreeItem"]').all();
  console.log(`Found ${fileItems.length} items in sidebar`);
  
  // Look for architecture folder or files
  for (let i = 0; i < Math.min(10, fileItems.length); i++) {
    const text = await fileItems[i].textContent();
    console.log(`Item ${i}: ${text}`);
    
    if (text?.includes('architecture')) {
      console.log('  ^ Found architecture item - clicking...');
      await fileItems[i].click();
      await page.waitForTimeout(1000);
    }
  }
  
  // Now look for api-10-diagrams.md
  const allItems = await page.locator('[class*="fileTreeItem"]').all();
  for (const item of allItems) {
    const text = await item.textContent();
    if (text?.includes('api-10-diagrams.md')) {
      console.log(`\nFound api-10-diagrams.md: "${text}"`);
      console.log('Clicking it...');
      
      await item.click();
      await page.waitForTimeout(2000);
      
      console.log('\nAPI requests after click:');
      apiRequests.forEach(url => console.log(`  - ${url}`));
      
      // Take screenshot
      await page.screenshot({ path: 'test-results/debug-after-click.png' });
      break;
    }
  }
});