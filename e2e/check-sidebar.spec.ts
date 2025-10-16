import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('Check if documentation sidebar shows markdown files', async ({ page }) => {
  // Test future-mobility-consumer-platform which has many docs
  await page.goto(`${BASE_URL}/docs/future-mobility-consumer-platform`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/sidebar-check.png', fullPage: true });
  
  // Check if sidebar exists
  const sidebar = page.locator('.DocumentationView_docSidebar__aZ9pN, [class*="docSidebar"]').first();
  await expect(sidebar).toBeVisible();
  
  // Check if Files header exists
  const filesHeader = page.locator('text="📁 Files"');
  await expect(filesHeader).toBeVisible();
  
  // Check if any markdown files are visible
  const markdownFiles = await page.locator('.DocumentationView_fileTreeItem__3KxZC [class*="name"], [class*="fileTreeItem"] span').all();
  console.log(`Found ${markdownFiles.length} file items in sidebar`);
  
  // Get file names
  const fileNames = [];
  for (const file of markdownFiles) {
    const text = await file.textContent();
    if (text) fileNames.push(text);
  }
  
  console.log('Files in sidebar:', fileNames);
  
  // Should have at least some markdown files
  expect(markdownFiles.length).toBeGreaterThan(0);
});