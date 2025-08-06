import { test, expect } from '@playwright/test';

test.describe('REAL USER EXPERIENCE TEST', () => {
  test('User can actually fucking use the app', async ({ page }) => {
    console.log('=== TESTING REAL USER EXPERIENCE ===');
    
    // 1. GO TO THE FUCKING APP
    console.log('Step 1: Loading app...');
    await page.goto('http://localhost');
    
    // 2. CAPTURE ALL CONSOLE ERRORS
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.error('BROWSER ERROR:', msg.text());
      }
    });
    
    page.on('pageerror', err => {
      errors.push(err.message);
      console.error('PAGE ERROR:', err.message);
    });
    
    // 3. WAIT FOR PAGE TO LOAD
    await page.waitForTimeout(3000);
    
    // 4. TAKE A SCREENSHOT SO WE CAN SEE WHAT THE FUCK IS HAPPENING
    await page.screenshot({ path: 'what-user-sees.png', fullPage: true });
    console.log('Screenshot saved: what-user-sees.png');
    
    // 5. CHECK IF THERE'S AN ERROR PAGE
    const errorText = await page.textContent('body');
    if (errorText?.includes('Something went wrong') || errorText?.includes('Error')) {
      console.error('ERROR PAGE DETECTED!');
      console.error('Page content:', errorText);
      
      // Get the error details
      const errorId = await page.textContent('text=/Error ID/');
      console.error('Error ID found:', errorId);
      
      throw new Error(`App shows error page instead of working! ${errorId}`);
    }
    
    // 6. CHECK IF LOGIN PAGE LOADS
    const hasLogin = await page.isVisible('input[type="email"]', { timeout: 5000 }).catch(() => false);
    if (!hasLogin) {
      console.error('Login form not found!');
      const html = await page.content();
      console.error('Page HTML:', html.substring(0, 500));
      throw new Error('Login page did not load - app is broken!');
    }
    
    // 7. TRY TO LOGIN
    console.log('Step 2: Attempting login...');
    await page.fill('input[type="email"]', 'admin@localhost');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    
    // 8. CHECK IF LOGIN WORKED
    await page.waitForTimeout(2000);
    const afterLoginUrl = page.url();
    const afterLoginContent = await page.textContent('body');
    
    if (afterLoginContent?.includes('Something went wrong') || afterLoginContent?.includes('Error')) {
      console.error('ERROR AFTER LOGIN!');
      await page.screenshot({ path: 'error-after-login.png' });
      throw new Error('Login failed - app shows error!');
    }
    
    // 9. CHECK FOR CONSOLE ERRORS
    if (errors.length > 0) {
      console.error('CONSOLE ERRORS FOUND:', errors);
      throw new Error(`Browser has ${errors.length} console errors!`);
    }
    
    // 10. VERIFY APP IS ACTUALLY WORKING
    const isLoggedIn = await page.isVisible('text=/Logout|Profile|Dashboard/', { timeout: 5000 }).catch(() => false);
    if (!isLoggedIn) {
      console.error('User is not logged in!');
      await page.screenshot({ path: 'not-logged-in.png' });
      throw new Error('Login did not work - no logged in UI elements!');
    }
    
    console.log('✅ APP IS ACTUALLY WORKING!');
  });
  
  test('Check what errors are happening', async ({ page }) => {
    // Enable request interception to see failed API calls
    page.on('requestfailed', request => {
      console.error('REQUEST FAILED:', request.url(), request.failure()?.errorText);
    });
    
    page.on('response', response => {
      if (response.status() >= 400) {
        console.error('HTTP ERROR:', response.status(), response.url());
      }
    });
    
    await page.goto('http://localhost');
    await page.waitForTimeout(5000);
    
    // Check browser console
    const consoleMessages = await page.evaluate(() => {
      return (window as any).console.logs || [];
    });
    
    console.log('Console messages:', consoleMessages);
  });
});