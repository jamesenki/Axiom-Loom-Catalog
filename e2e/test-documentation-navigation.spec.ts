import { test, expect } from '@playwright/test';

test('Test documentation navigation from repository page', async ({ page }) => {
  console.log('=== TESTING DOCUMENTATION NAVIGATION ===');
  
  // Go to the working repository URL
  await page.goto('/repository/ai-predictive-maintenance-engine-architecture');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  console.log('✅ On repository page');
  await page.screenshot({ path: 'repo-page-before-click.png', fullPage: true });
  
  // Look for documentation button/link
  const documentationSelectors = [
    'text="Documentation"',
    'button:has-text("Documentation")', 
    'a:has-text("Documentation")',
    '[data-testid="documentation-button"]',
    '.documentation-button'
  ];
  
  let clicked = false;
  for (const selector of documentationSelectors) {
    const element = page.locator(selector);
    if (await element.count() > 0) {
      console.log(`Found documentation element: ${selector}`);
      
      // Take screenshot before clicking
      await page.screenshot({ path: `before-click-docs.png` });
      
      // Click the documentation button
      await element.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Take screenshot after clicking
      await page.screenshot({ path: `after-click-docs.png`, fullPage: true });
      
      console.log('✅ Clicked documentation button');
      console.log('Current URL after click:', page.url());
      
      // Check if we're now on a docs page
      const currentUrl = page.url();
      if (currentUrl.includes('docs') || currentUrl.includes('documentation')) {
        console.log('✅ Successfully navigated to documentation');
        
        // Now test hover effects on this page
        await this.testHoverEffects(page);
        
      } else {
        console.log('URL did not change to docs page, checking page content...');
        
        // Check if documentation content loaded on same page
        const hasDocContent = await page.locator('.markdown, .document, .doc-content').count();
        if (hasDocContent > 0) {
          console.log('✅ Documentation content loaded on same page');
          await this.testHoverEffects(page);
        }
      }
      
      clicked = true;
      break;
    }
  }
  
  if (!clicked) {
    console.log('❌ Could not find documentation button');
    
    // Look for any clickable elements that might lead to docs
    const potentialLinks = await page.locator('a, button').all();
    console.log(`Found ${potentialLinks.length} clickable elements`);
    
    for (let i = 0; i < Math.min(potentialLinks.length, 10); i++) {
      const link = potentialLinks[i];
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      console.log(`${i + 1}. "${text?.trim()}" href="${href}"`);
    }
  }
  
  // Final state screenshot
  await page.screenshot({ path: 'final-documentation-state.png', fullPage: true });
});

// Helper function to test hover effects
async function testHoverEffects(page) {
  console.log('\n=== TESTING HOVER EFFECTS ON DOCS PAGE ===');
  
  // Test navigation hover effects
  const navElements = await page.locator('nav a, header a, .nav a').all();
  console.log(`Found ${navElements.length} navigation elements to test`);
  
  for (let i = 0; i < Math.min(navElements.length, 5); i++) {
    const element = navElements[i];
    try {
      const text = await element.textContent();
      console.log(`Hover testing: "${text?.trim()}"`);
      
      await element.hover();
      await page.waitForTimeout(500);
      
      // Check for blur effects during hover
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          filter: computed.filter,
          backdropFilter: computed.backdropFilter,
          opacity: computed.opacity,
          textShadow: computed.textShadow
        };
      });
      
      console.log(`  Hover styles:`, styles);
      
      // Check for any blur
      if (styles.filter.includes('blur') || styles.backdropFilter !== 'none') {
        console.log(`  🚨 BLUR DETECTED: filter=${styles.filter}, backdrop=${styles.backdropFilter}`);
      } else {
        console.log(`  ✅ No blur effects`);
      }
      
      // Move mouse away
      await page.mouse.move(0, 0);
      await page.waitForTimeout(200);
      
    } catch (error) {
      console.log(`  Error testing element ${i}: ${error}`);
    }
  }
}