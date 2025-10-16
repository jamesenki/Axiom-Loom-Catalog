import { test, expect } from '@playwright/test';

test.describe('Quick Login Test', () => {
  test('Login and check for styled-components error', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for redirect to login page
    await page.waitForURL('**/login', { timeout: 5000 });
    
    // Fill login form
    await page.fill('input[name="email"]', 'admin@localhost');
    await page.fill('input[name="password"]', 'admin');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation or error
    await page.waitForTimeout(2000);
    
    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    
    // Take screenshot
    await page.screenshot({ path: 'after-login.png', fullPage: true });
    
    // Check for any error messages
    const errorText = await page.textContent('body');
    if (errorText.includes('styled-components') || errorText.includes('bTrirp')) {
      console.log('STYLED-COMPONENTS ERROR DETECTED!');
      console.log('Page content:', errorText);
    }
    
    // Check console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
  });
});