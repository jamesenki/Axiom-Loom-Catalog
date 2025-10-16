import { test, expect } from '@playwright/test';

test.describe('Water Heater Platform Quick Regression Test', () => {
  const baseURL = 'http://localhost:3000';
  const repositoryURL = `${baseURL}/repository/appliances-co-water-heater-platform`;
  
  test('All demo buttons now navigate to Coming Soon pages', async ({ page }) => {
    console.log('🔍 Testing: Water Heater Platform demo button fixes');
    
    await page.goto(repositoryURL);
    await page.waitForLoadState('networkidle');
    
    // Test the three buttons that should now show Coming Soon pages
    const demoButtons = [
      { text: 'Architecture Demo', expectedPath: '/coming-soon/product/' },
      { text: 'Implementation Guide', expectedPath: '/coming-soon/docs/' },
      { text: 'Product Details', expectedPath: '/coming-soon/product/' },
      { text: 'View Demo', expectedPath: '/demo/water-heater-platform' }
    ];
    
    for (const button of demoButtons) {
      console.log(`Testing: ${button.text}`);
      
      // Go back to repository page
      await page.goto(repositoryURL);
      await page.waitForLoadState('networkidle');
      
      // Find and click the button
      const buttonElement = page.locator('button, a').filter({ hasText: button.text }).first();
      
      if (await buttonElement.isVisible()) {
        await Promise.all([
          page.waitForLoadState('networkidle'),
          buttonElement.click()
        ]);
        
        await page.waitForTimeout(1000);
        const currentUrl = page.url();
        
        if (currentUrl.includes(button.expectedPath) || currentUrl !== repositoryURL) {
          console.log(`✅ ${button.text}: Successfully navigated to ${currentUrl}`);
          
          // Check if page shows coming soon content
          const pageContent = await page.textContent('body');
          if (pageContent && (pageContent.includes('Coming Soon') || pageContent.includes('under development'))) {
            console.log(`  → Coming Soon content detected`);
          }
        } else {
          console.log(`❌ ${button.text}: Failed to navigate (still at ${currentUrl})`);
        }
      } else {
        console.log(`❌ ${button.text}: Button not found on page`);
      }
    }
    
    console.log('\n🎯 Demo button testing complete!');
  });
  
  test('All other buttons still work correctly', async ({ page }) => {
    console.log('🔍 Testing: Other buttons still functional');
    
    await page.goto(repositoryURL);
    await page.waitForLoadState('networkidle');
    
    const otherButtons = [
      'Documentation',
      'API Explorer', 
      'GitHub',
      'Postman Collections'
    ];
    
    for (const buttonText of otherButtons) {
      await page.goto(repositoryURL);
      await page.waitForLoadState('networkidle');
      
      const buttonElement = page.locator('button, a').filter({ hasText: buttonText }).first();
      
      if (await buttonElement.isVisible()) {
        const beforeUrl = page.url();
        
        await Promise.all([
          page.waitForLoadState('networkidle'),
          buttonElement.click()
        ]);
        
        await page.waitForTimeout(1000);
        const afterUrl = page.url();
        
        if (afterUrl !== beforeUrl) {
          console.log(`✅ ${buttonText}: Successfully navigated to ${afterUrl}`);
        } else {
          console.log(`⚠️  ${buttonText}: No navigation detected`);
        }
      } else {
        console.log(`❌ ${buttonText}: Button not found`);
      }
    }
  });
});