import { test, expect } from '@playwright/test';

test('Final test: Correct URL with hover effects analysis', async ({ page }) => {
  console.log('=== FINAL CORRECT URL TEST ===');
  
  // Test the CORRECT working URL (from homepage navigation)
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.click('text="Repositories"');
  await page.waitForLoadState('networkidle');
  
  // Navigate to the repository
  await page.click('text="ai-predictive-maintenance-engine-architecture"');
  await page.waitForLoadState('networkidle');
  
  // Click documentation
  await page.click('text="Documentation"');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const finalUrl = page.url();
  console.log('✅ CORRECT WORKING URL:', finalUrl);
  
  // Take full screenshot
  await page.screenshot({ path: 'CORRECT-URL-WORKING.png', fullPage: true });
  
  // Test all navigation hover effects
  console.log('\n=== HOVER EFFECTS TEST ===');
  
  const navElements = [
    { selector: 'text="Home"', name: 'Home' },
    { selector: 'text="Repositories"', name: 'Repositories' },
    { selector: 'text="APIs"', name: 'APIs' },
    { selector: 'text="Sync"', name: 'Sync' },
    { selector: '[placeholder*="Search"]', name: 'Search Box' }
  ];
  
  for (const nav of navElements) {
    try {
      const element = page.locator(nav.selector).first();
      if (await element.count() > 0) {
        console.log(`\nTesting ${nav.name}:`);
        
        // Hover
        await element.hover();
        await page.waitForTimeout(500);
        
        // Get styles during hover
        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            filter: computed.filter,
            backdropFilter: computed.backdropFilter,
            opacity: computed.opacity,
            transform: computed.transform,
            textShadow: computed.textShadow,
            background: computed.background
          };
        });
        
        console.log(`  filter: ${styles.filter}`);
        console.log(`  backdrop-filter: ${styles.backdropFilter}`);
        console.log(`  opacity: ${styles.opacity}`);
        console.log(`  transform: ${styles.transform}`);
        console.log(`  text-shadow: ${styles.textShadow}`);
        
        // Check for blur
        if (styles.filter.includes('blur') || styles.backdropFilter !== 'none') {
          console.log(`  🚨 BLUR DETECTED!`);
        } else {
          console.log(`  ✅ No blur effects`);
        }
        
        // Take hover screenshot
        await page.screenshot({ path: `hover-${nav.name.toLowerCase()}.png` });
        
        // Move mouse away
        await page.mouse.move(0, 0);
        await page.waitForTimeout(300);
      }
    } catch (error) {
      console.log(`Error testing ${nav.name}: ${error}`);
    }
  }
  
  // Check for ALL elements with any blur/filter effects
  console.log('\n=== SCANNING ALL ELEMENTS FOR BLUR ===');
  
  const allBlurElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const blurElements: any[] = [];
    
    for (const el of elements) {
      const computed = window.getComputedStyle(el);
      if (computed.filter !== 'none' || computed.backdropFilter !== 'none') {
        blurElements.push({
          tagName: el.tagName,
          className: el.className || 'no-class',
          filter: computed.filter,
          backdropFilter: computed.backdropFilter
        });
      }
    }
    
    return blurElements;
  });
  
  console.log(`Found ${allBlurElements.length} elements with filter/backdrop-filter:`);
  allBlurElements.forEach((el, i) => {
    console.log(`${i + 1}. ${el.tagName}.${el.className}`);
    console.log(`   filter: ${el.filter}`);
    console.log(`   backdrop-filter: ${el.backdropFilter}`);
  });
  
  console.log('\n=== TEST COMPLETE ===');
  console.log(`✅ CORRECT URL: ${finalUrl}`);
  console.log('❌ INCORRECT URL (404): /docs/ai-predictive-maintenance-engine-architecture');
  console.log('✅ All visual effects documented in console output above');
});