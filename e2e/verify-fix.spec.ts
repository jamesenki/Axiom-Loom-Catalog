import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('Verify rentalFleets CONTRIBUTING.md fix', async ({ page }) => {
  // Navigate to rentalFleets docs
  await page.goto(`${BASE_URL}/docs/rentalFleets`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Click the CONTRIBUTING.md link in README content
  const contributingLink = page.locator('main a[href*="CONTRIBUTING.md"]').first();
  await contributingLink.click();
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/contributing-fixed.png', fullPage: true });
  
  // Check that it loads without error
  const hasError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                  await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
  
  if (hasError) {
    console.log('❌ Still shows 404 error');
  } else {
    console.log('✅ CONTRIBUTING.md loads successfully!');
    
    // Verify content is visible
    const hasContent = await page.locator('h1:has-text("Contributing")').isVisible({ timeout: 2000 });
    expect(hasContent).toBe(true);
  }
  
  expect(hasError).toBe(false);
});