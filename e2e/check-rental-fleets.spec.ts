import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('Check rentalFleets CONTRIBUTING.md issue', async ({ page }) => {
  await page.goto(`${BASE_URL}/docs/rentalFleets`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Take screenshot of the page
  await page.screenshot({ path: 'test-results/rentalFleets-docs-page.png', fullPage: true });
  
  // Look for CONTRIBUTING.md in the sidebar
  const contributingLink = page.locator('text="CONTRIBUTING.md"').first();
  const hasContributing = await contributingLink.isVisible({ timeout: 2000 });
  
  console.log(`CONTRIBUTING.md link visible: ${hasContributing}`);
  
  if (hasContributing) {
    // Get the parent element to see context
    const parentText = await contributingLink.locator('..').textContent();
    console.log(`Parent context: ${parentText}`);
    
    // Click it
    await contributingLink.click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of result
    await page.screenshot({ path: 'test-results/rentalFleets-contributing-clicked.png', fullPage: true });
    
    // Check for error
    const hasError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                    await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
    
    if (hasError) {
      console.log('❌ Shows 404 error as expected - file does not exist');
      
      // The link should not be shown if the file doesn't exist
      // This is the bug we need to fix
    }
  }
  
  // List all actual markdown files in rentalFleets
  console.log('\nActual markdown files in sidebar:');
  const allMdFiles = await page.locator('[class*="fileTreeItem"]').filter({ hasText: /\.md$/ }).all();
  for (const file of allMdFiles) {
    const text = await file.textContent();
    console.log(`  - ${text}`);
  }
});