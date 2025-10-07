import { test, expect } from '@playwright/test';

test.describe('Simple Breadcrumb Navigation Test', () => {
  test('test getting started navigation and back button', async ({ page }) => {
    console.log('=== TESTING BREADCRUMB NAVIGATION ===');
    
    // Navigate directly to docs page
    await page.goto('http://localhost:3000/docs/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of docs page
    await page.screenshot({ path: 'test-results/docs-main-page.png', fullPage: true });
    
    console.log('1. Looking for Getting Started link...');
    const gettingStartedLink = page.locator('a[href="GETTING_STARTED.md"]').first();
    const linkExists = await gettingStartedLink.isVisible();
    console.log(`   Getting Started link exists: ${linkExists}`);
    
    if (linkExists) {
      const beforeUrl = page.url();
      console.log(`   Before click URL: ${beforeUrl}`);
      
      console.log('2. Clicking Getting Started link...');
      await gettingStartedLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const afterUrl = page.url();
      console.log(`   After click URL: ${afterUrl}`);
      
      // Take screenshot of getting started page
      await page.screenshot({ path: 'test-results/getting-started-page.png', fullPage: true });
      
      console.log('3. Looking for back navigation on Getting Started page...');
      
      // Look for various back navigation options
      const backOptions = [
        'Back to Repository',
        'Back to Documentation',
        'Back',
        '← Back',
        'Documentation',
        'README',
        'Home'
      ];
      
      let foundBackNav = false;
      
      for (const backText of backOptions) {
        const backLink = page.locator(`a:has-text("${backText}"), button:has-text("${backText}")`);
        if (await backLink.isVisible()) {
          console.log(`   ✅ Found back navigation: "${backText}"`);
          foundBackNav = true;
          break;
        }
      }
      
      if (!foundBackNav) {
        console.log('   ❌ ISSUE CONFIRMED: No back navigation found');
        
        // Look for breadcrumbs
        const breadcrumbs = page.locator('[class*="breadcrumb"], nav[aria-label*="breadcrumb"]');
        const hasBreadcrumbs = await breadcrumbs.isVisible();
        console.log(`   Has breadcrumbs: ${hasBreadcrumbs}`);
        
        // Look for any links that might go back to main docs
        const docLinks = page.locator('a[href*="/docs/"]');
        const docLinkCount = await docLinks.count();
        console.log(`   Doc links found: ${docLinkCount}`);
        
        // Check if there's any way to navigate back
        const allLinks = page.locator('a');
        const linkCount = await allLinks.count();
        console.log(`   Total links on page: ${linkCount}`);
        
        // Log first few links to understand navigation structure
        for (let i = 0; i < Math.min(linkCount, 10); i++) {
          const link = allLinks.nth(i);
          const href = await link.getAttribute('href');
          const text = await link.textContent();
          if (text && text.trim().length > 0 && text.length < 50) {
            console.log(`     Link: "${text.trim()}" -> ${href}`);
          }
        }
      }
      
    } else {
      console.log('   Getting Started link not found');
    }
    
    console.log('=== END BREADCRUMB TEST ===');
  });
});