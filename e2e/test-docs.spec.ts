import { test, expect } from '@playwright/test';

test('Documentation should load after CORS fix', async ({ page }) => {
  // Go to documentation page
  await page.goto('http://localhost:3000/docs/ai-predictive-maintenance-engine');
  
  // Wait for API calls
  await page.waitForTimeout(3000);
  
  // Check for error
  const errorElement = page.locator('text=/Error|Failed/i');
  const errorCount = await errorElement.count();
  
  if (errorCount > 0) {
    const errorText = await errorElement.first().textContent();
    console.log('❌ Documentation error:', errorText);
  } else {
    console.log('✅ Documentation loaded without errors');
  }
  
  // Check if file tree loaded
  const fileTreeItems = page.locator('[class*="FileTree"], [class*="file-tree"], a[href*=".md"]');
  const fileCount = await fileTreeItems.count();
  console.log(`📁 File tree items found: ${fileCount}`);
  
  // Check if content loaded
  const contentArea = page.locator('[class*="content"], [class*="markdown"], pre');
  const hasContent = await contentArea.count() > 0;
  console.log(`📄 Content loaded: ${hasContent ? 'Yes' : 'No'}`);
  
  // Try clicking a file if available
  if (fileCount > 0) {
    await fileTreeItems.first().click();
    await page.waitForTimeout(2000);
    
    const contentAfterClick = await contentArea.count() > 0;
    console.log(`📄 Content after click: ${contentAfterClick ? 'Yes' : 'No'}`);
  }
  
  // Final check
  expect(errorCount).toBe(0);
});