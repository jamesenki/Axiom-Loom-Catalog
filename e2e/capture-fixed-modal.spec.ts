import { test } from '@playwright/test';

test('Capture fixed modal for UAT', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Click Add Repository button
  const addButton = await page.locator('button:has-text("Add Repository")').first();
  await addButton.click();
  
  // Wait for modal
  await page.waitForSelector('h2:has-text("Add Repository")', { state: 'visible' });
  await page.waitForTimeout(500);
  
  // Take UAT screenshot
  await page.screenshot({ 
    path: 'uat-screenshots/modal-fixed-properly.png', 
    fullPage: false // Just viewport to show it's a proper overlay
  });
  
  console.log('✅ UAT screenshot saved to uat-screenshots/modal-fixed-properly.png');
});