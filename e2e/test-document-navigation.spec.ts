import { test, expect } from '@playwright/test';

test.describe('Document Navigation Test', () => {
  test('test sub-document navigation and breadcrumbs', async ({ page }) => {
    console.log('=== TESTING DOCUMENT NAVIGATION ===');
    
    // Navigate to repository page
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('1. Looking for Documentation button...');
    const docsButton = page.locator('button:has-text("Documentation"), a:has-text("Documentation")');
    await expect(docsButton).toBeVisible();
    
    // Take screenshot before clicking
    await page.screenshot({ path: 'test-results/before-docs-click.png', fullPage: true });
    
    console.log('2. Clicking Documentation button...');
    await docsButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const docsUrl = page.url();
    console.log(`   Docs URL: ${docsUrl}`);
    
    // Take screenshot of docs landing page
    await page.screenshot({ path: 'test-results/docs-landing-page.png', fullPage: true });
    
    console.log('3. Looking for sub-document links...');
    
    // Look for common sub-document links
    const subDocLinks = [
      'Getting Started',
      'Getting started', 
      'GETTING_STARTED',
      'API Documentation',
      'Developer Guide',
      'Architecture'
    ];
    
    let foundLink = null;
    let foundLinkText = '';
    
    for (const linkText of subDocLinks) {
      const link = page.locator(`a:has-text("${linkText}")`);
      if (await link.isVisible()) {
        foundLink = link;
        foundLinkText = linkText;
        console.log(`   Found sub-document link: "${linkText}"`);
        break;
      }
    }
    
    // Also look for any markdown file links
    const mdLinks = page.locator('a[href*=".md"]');
    const mdLinkCount = await mdLinks.count();
    console.log(`   Found ${mdLinkCount} .md file links`);
    
    if (mdLinkCount > 0) {
      for (let i = 0; i < Math.min(mdLinkCount, 5); i++) {
        const link = mdLinks.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        console.log(`     Link ${i}: "${text}" -> ${href}`);
      }
      
      if (!foundLink) {
        foundLink = mdLinks.first();
        foundLinkText = await foundLink.textContent() || 'First .md link';
      }
    }
    
    if (foundLink) {
      console.log('4. Clicking on sub-document...');
      const beforeSubDocUrl = page.url();
      
      await foundLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const subDocUrl = page.url();
      console.log(`   Before: ${beforeSubDocUrl}`);
      console.log(`   After: ${subDocUrl}`);
      
      // Take screenshot of sub-document page
      await page.screenshot({ path: 'test-results/sub-document-page.png', fullPage: true });
      
      console.log('5. Looking for navigation back to main docs...');
      
      // Look for various types of back navigation
      const backNavOptions = [
        'Back to Repository',
        'Back to Documentation', 
        'Back',
        '← Back',
        'Home',
        'README',
        'Documentation'
      ];
      
      let hasBackNavigation = false;
      
      for (const navText of backNavOptions) {
        const backLink = page.locator(`a:has-text("${navText}"), button:has-text("${navText}")`);
        if (await backLink.isVisible()) {
          console.log(`   ✅ Found back navigation: "${navText}"`);
          hasBackNavigation = true;
          
          // Test clicking it
          const beforeBackUrl = page.url();
          await backLink.click();
          await page.waitForTimeout(3000);
          const afterBackUrl = page.url();
          
          console.log(`     Before back click: ${beforeBackUrl}`);
          console.log(`     After back click: ${afterBackUrl}`);
          
          if (afterBackUrl !== beforeBackUrl) {
            console.log(`     ✅ Back navigation works`);
          } else {
            console.log(`     ❌ Back navigation did not change URL`);
          }
          break;
        }
      }
      
      if (!hasBackNavigation) {
        console.log('   ❌ ISSUE CONFIRMED: No back navigation found from sub-document');
        
        // Look for breadcrumbs
        const breadcrumbs = page.locator('[aria-label*="breadcrumb"], nav[class*="breadcrumb"], .breadcrumb');
        const hasBreadcrumbs = await breadcrumbs.isVisible();
        console.log(`   Breadcrumbs present: ${hasBreadcrumbs}`);
        
        // Look for any navigation elements
        const navElements = page.locator('nav, [role="navigation"]');
        const navCount = await navElements.count();
        console.log(`   Navigation elements found: ${navCount}`);
        
        for (let i = 0; i < Math.min(navCount, 3); i++) {
          const nav = navElements.nth(i);
          const navText = await nav.textContent();
          console.log(`     Nav ${i}: "${navText?.substring(0, 100)}..."`);
        }
      }
      
    } else {
      console.log('   No sub-document links found to test navigation');
    }
    
    console.log('=== END DOCUMENT NAVIGATION TEST ===');
  });
});