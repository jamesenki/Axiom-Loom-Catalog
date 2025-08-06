import { test, expect } from '@playwright/test';

test('Capture exact error from application', async ({ page }) => {
  // Capture console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  // Go to the page
  await page.goto('http://localhost', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Wait a bit for any errors to appear
  await page.waitForTimeout(5000);
  
  // Check what's on the page
  const pageContent = await page.content();
  const bodyText = await page.textContent('body');
  
  console.log('=== PAGE ERRORS ===');
  errors.forEach(error => console.log(error));
  
  console.log('\n=== BODY TEXT ===');
  console.log(bodyText);
  
  console.log('\n=== ERROR DETAILS ===');
  // Look for error message
  const errorMessage = await page.textContent('body').catch(() => 'Could not get body text');
  if (errorMessage?.includes('An error occurred')) {
    console.log('Found styled-components error:', errorMessage);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  
  // Check if we can find the error stack trace
  const stackTrace = await page.locator('text=Stack trace').isVisible().catch(() => false);
  if (stackTrace) {
    const details = await page.locator('pre').textContent().catch(() => 'No stack trace found');
    console.log('\n=== STACK TRACE ===');
    console.log(details);
  }
});