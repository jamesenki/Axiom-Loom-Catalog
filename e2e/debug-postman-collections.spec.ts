import { test, expect } from '@playwright/test';

test.describe('Debug Postman Collections', () => {
  test('debug postman collection loading', async ({ page }) => {
    console.log('Navigating to repository page...');
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of repository page
    await page.screenshot({ path: 'test-results/debug-repo-page.png', fullPage: true });
    
    // Look for Postman button
    console.log('Looking for Postman button...');
    const postmanButton = page.locator('button:has-text("Postman"), a:has-text("Postman")');
    const buttonExists = await postmanButton.isVisible();
    
    console.log(`Postman button exists: ${buttonExists}`);
    
    if (buttonExists) {
      console.log('Clicking Postman button...');
      await postmanButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      console.log(`Current URL after clicking Postman: ${currentUrl}`);
      
      // Take screenshot of postman page
      await page.screenshot({ path: 'test-results/debug-postman-page.png', fullPage: true });
      
      // Check page content
      const pageContent = await page.textContent('body');
      console.log(`Page content includes "No Postman Collections Found": ${pageContent?.includes('No Postman Collections Found')}`);
      
      // Look for collection elements
      const collections = page.locator('[class*="collection"], [data-testid*="collection"], .postman-collection, .collection-item');
      const collectionCount = await collections.count();
      console.log(`Found ${collectionCount} collection elements`);
      
      // Look for any text mentioning collections
      const collectionText = page.locator('text=collection, text=Collection, text=postman, text=Postman');
      const textCount = await collectionText.count();
      console.log(`Found ${textCount} elements mentioning collections`);
      
      // Check for loading states
      const loadingElements = page.locator('text=Loading, [class*="loading"], [data-testid*="loading"]');
      const loadingCount = await loadingElements.count();
      console.log(`Found ${loadingCount} loading elements`);
      
      // Check console for errors
      const logs: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          logs.push(`ERROR: ${msg.text()}`);
        }
      });
      
      await page.waitForTimeout(2000);
      
      if (logs.length > 0) {
        console.log('Console errors:', logs);
      } else {
        console.log('No console errors found');
      }
      
    } else {
      console.log('Postman button not found - checking all buttons');
      const allButtons = page.locator('button, a[role="button"]');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} total buttons`);
      
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const buttonText = await allButtons.nth(i).textContent();
        console.log(`Button ${i}: "${buttonText}"`);
      }
    }
  });
});