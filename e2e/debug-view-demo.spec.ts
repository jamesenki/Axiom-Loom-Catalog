import { test, expect } from '@playwright/test';

test.describe('Debug View Demo Button', () => {
  test('debug view demo button navigation', async ({ page }) => {
    console.log('=== TESTING VIEW DEMO BUTTON ===');
    
    // Navigate to repository page
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await page.screenshot({ path: 'test-results/view-demo-initial.png', fullPage: true });
    
    // Look for View Demo button
    console.log('1. Looking for View Demo button...');
    const viewDemoButton = page.locator('button:has-text("View Demo"), a:has-text("View Demo"), button:has-text("Demo"), a:has-text("Demo")');
    const buttonExists = await viewDemoButton.isVisible();
    console.log(`   View Demo button exists: ${buttonExists}`);
    
    if (buttonExists) {
      // Check what the button text actually says
      const buttonText = await viewDemoButton.textContent();
      console.log(`   Button text: "${buttonText}"`);
      
      // Get the href if it's a link
      const href = await viewDemoButton.getAttribute('href');
      console.log(`   Button href: ${href}`);
      
      const initialUrl = page.url();
      console.log(`   Initial URL: ${initialUrl}`);
      
      // Click the button
      console.log('2. Clicking View Demo button...');
      await viewDemoButton.click();
      await page.waitForTimeout(3000);
      
      const finalUrl = page.url();
      console.log(`   Final URL: ${finalUrl}`);
      
      // Take screenshot after click
      await page.screenshot({ path: 'test-results/view-demo-after-click.png', fullPage: true });
      
      // Check if it went to coming soon page
      const isComingSoon = finalUrl.includes('coming-soon') || 
                          await page.locator('text=Coming Soon').isVisible();
      console.log(`   Is coming soon page: ${isComingSoon}`);
      
      // Check if it went back to home page (bad)
      const wentHome = finalUrl === 'http://localhost:3000/' || finalUrl === 'http://localhost:3000';
      console.log(`   Went back to home: ${wentHome}`);
      
      // Check page content
      const pageContent = await page.textContent('body');
      const hasComingSoonText = pageContent?.includes('Coming Soon') || pageContent?.includes('coming soon');
      console.log(`   Page contains coming soon text: ${hasComingSoonText}`);
      
    } else {
      console.log('View Demo button not found - checking all buttons');
      const allButtons = page.locator('button, a[role="button"]');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} total buttons/links`);
      
      for (let i = 0; i < Math.min(buttonCount, 20); i++) {
        const btn = allButtons.nth(i);
        const text = await btn.textContent();
        const href = await btn.getAttribute('href');
        const role = await btn.getAttribute('role');
        console.log(`   Button ${i}: "${text}" href="${href}" role="${role}"`);
      }
    }
    
    console.log('=== END VIEW DEMO TEST ===');
  });
});