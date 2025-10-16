import { test } from '@playwright/test';

test('Debug API Explorer', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  
  // Check API response
  page.on('response', response => {
    if (response.url().includes('/api/detect-apis/')) {
      console.log(`API Response: ${response.status()} for ${response.url()}`);
    }
  });
  
  // Navigate
  await page.goto('http://10.0.0.109:3000/api-explorer/cloudtwin-simulation-platform-architecture');
  
  // Wait for potential API call
  await page.waitForTimeout(5000);
  
  // Check page content
  const pageContent = await page.content();
  
  // Look for specific elements
  const hasError = pageContent.includes('Error');
  const hasCards = pageContent.includes('APICard');
  const hasLoading = pageContent.includes('Loading');
  
  console.log('\n=== PAGE STATE ===');
  console.log('Has Error:', hasError);
  console.log('Has Cards:', hasCards);  
  console.log('Has Loading:', hasLoading);
  
  // Check if APIs text is present
  const apisText = await page.locator('text=/API/i').count();
  console.log('Elements with "API" text:', apisText);
  
  // Check for filter buttons
  const filterButtons = await page.locator('button').count();
  console.log('Button count:', filterButtons);
  
  // Take screenshot
  await page.screenshot({ path: 'api-explorer-debug.png', fullPage: true });
  console.log('Screenshot saved as api-explorer-debug.png');
});