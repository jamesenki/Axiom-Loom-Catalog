import { test, expect } from '@playwright/test';

test('Visual check for Postman buttons', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Wait for any content to load
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'postman-buttons-check.png', fullPage: true });
  
  // Log all visible text
  const allText = await page.locator('body').textContent();
  console.log('Page content:', allText);
  
  // Count Postman occurrences
  const postmanCount = (allText?.match(/Postman/g) || []).length;
  console.log(`Found ${postmanCount} occurrences of "Postman"`);
  
  // List all button texts
  const buttons = await page.locator('button').allTextContents();
  console.log('All buttons:', buttons);
});