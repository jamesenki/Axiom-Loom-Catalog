import { test, expect } from '@playwright/test';

test.describe('Debug Navigation Issue', () => {
  test('debug why View Demo button click does not navigate', async ({ page }) => {
    console.log('=== DEBUGGING NAVIGATION ISSUE ===');
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('CONSOLE ERROR:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
    });
    
    // Navigate to repository page
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('1. Initial state check...');
    const initialUrl = page.url();
    console.log(`   Initial URL: ${initialUrl}`);
    
    // Check if router is working by testing a known working link
    console.log('2. Testing back navigation to verify router works...');
    const backLink = page.locator('a[href="/"]');
    if (await backLink.isVisible()) {
      console.log('   Found back/home link, testing navigation...');
      await backLink.click();
      await page.waitForTimeout(2000);
      const homeUrl = page.url();
      console.log(`   After clicking home: ${homeUrl}`);
      
      // Go back to repository page
      await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
    
    // Find View Demo button
    console.log('3. Finding View Demo button...');
    const viewDemoButton = page.locator('a[href*="coming-soon/demo"]');
    const buttonExists = await viewDemoButton.isVisible();
    console.log(`   View Demo button exists: ${buttonExists}`);
    
    if (buttonExists) {
      const href = await viewDemoButton.getAttribute('href');
      console.log(`   Button href: ${href}`);
      
      // Check if it's actually a Link component or regular <a>
      const tagName = await viewDemoButton.evaluate(el => el.tagName);
      const role = await viewDemoButton.getAttribute('role');
      console.log(`   Element tag: ${tagName}, role: ${role}`);
      
      // Check for any click handlers
      const hasClickHandler = await viewDemoButton.evaluate(el => {
        return typeof (el as any).onclick === 'function' || 
               el.getAttribute('onclick') !== null;
      });
      console.log(`   Has click handler: ${hasClickHandler}`);
      
      // Try direct navigation first to see if the route exists
      console.log('4. Testing direct navigation to coming soon page...');
      await page.goto('http://localhost:3000/coming-soon/demo/appliances-co-water-heater-platform');
      await page.waitForTimeout(3000);
      const directUrl = page.url();
      console.log(`   Direct navigation result: ${directUrl}`);
      
      // Check page content after direct navigation
      const pageTitle = await page.title();
      const bodyText = await page.textContent('body');
      console.log(`   Page title: ${pageTitle}`);
      console.log(`   Page contains "Coming Soon": ${bodyText?.includes('Coming Soon')}`);
      console.log(`   Page contains "docs coming soon": ${bodyText?.includes('docs coming soon')}`);
      
      // Go back and try clicking the button
      console.log('5. Going back to test button click...');
      await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const beforeClickUrl = page.url();
      console.log(`   Before click URL: ${beforeClickUrl}`);
      
      // Click with force to bypass any overlays
      await viewDemoButton.click({ force: true });
      await page.waitForTimeout(3000);
      
      const afterClickUrl = page.url();
      console.log(`   After click URL: ${afterClickUrl}`);
      console.log(`   URL changed: ${beforeClickUrl !== afterClickUrl}`);
      
    } else {
      console.log('   View Demo button not found!');
    }
    
    console.log('=== END NAVIGATION DEBUG ===');
  });
});