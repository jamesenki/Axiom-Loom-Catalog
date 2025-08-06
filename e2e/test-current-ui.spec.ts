import { test, expect } from '@playwright/test';

test('Take screenshot of current UI', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot
  await page.screenshot({ path: 'current-ui.png', fullPage: false });
  
  // Check what's in the nav
  const navButtons = await page.locator('nav button, nav a').allTextContents();
  console.log('Navigation items:', navButtons);
  
  // Check specifically for Demo
  const demoElements = await page.locator('text=/demo/i').count();
  console.log(`Found ${demoElements} elements with "Demo" text`);
  
  // Get all button texts
  const allButtons = await page.locator('button').allTextContents();
  console.log('All buttons:', allButtons.filter(t => t.trim()));
});