import { test, expect } from '@playwright/test';

test.describe('Test Actual User Flow', () => {
  test('Complete user journey from login to repository viewing', async ({ page }) => {
    // Capture all errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console Error:', msg.text());
        errors.push(msg.text());
      }
    });

    console.log('1. Going to homepage...');
    await page.goto('http://localhost');
    await page.waitForLoadState('networkidle');
    
    // Check if we're on login page
    const isLoginPage = await page.locator('text=Local Authentication').isVisible();
    console.log('   - On login page:', isLoginPage);
    
    if (isLoginPage) {
      console.log('2. Logging in as admin...');
      await page.fill('input[type="email"]', 'admin@localhost');
      await page.fill('input[type="password"]', 'admin');
      await page.click('button:has-text("Sign In")');
      
      console.log('3. Waiting for navigation after login...');
      await page.waitForTimeout(3000);
    }
    
    // Check what page we're on now
    const currentUrl = page.url();
    console.log('   - Current URL:', currentUrl);
    
    // Check for error page
    const hasError = await page.locator('text=Something went wrong').isVisible().catch(() => false);
    const hasOopsError = await page.locator('text=Oops!').isVisible().catch(() => false);
    
    if (hasError || hasOopsError) {
      console.log('❌ ERROR PAGE DETECTED!');
      const errorText = await page.textContent('body');
      console.log('Error page content:', errorText);
      
      // Look for styled-components error
      const styledError = await page.locator('text=An error occurred').textContent().catch(() => '');
      if (styledError) {
        console.log('Styled-components error:', styledError);
      }
      
      // Try to get stack trace
      const stackTrace = await page.locator('pre').textContent().catch(() => '');
      if (stackTrace) {
        console.log('Stack trace:', stackTrace);
      }
    } else {
      console.log('4. Checking for repository cards...');
      const hasCards = await page.locator('[data-testid="repository-card"]').count();
      console.log('   - Repository cards found:', hasCards);
      
      if (hasCards > 0) {
        console.log('✅ SUCCESS! Application is working!');
      } else {
        console.log('❌ No repository cards found');
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'current-state.png', fullPage: true });
    console.log('\nScreenshot saved as current-state.png');
    
    // Report errors
    if (errors.length > 0) {
      console.log('\n❌ Console errors detected:', errors);
    }
  });
});