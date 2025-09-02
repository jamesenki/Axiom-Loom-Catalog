import { test, expect } from '@playwright/test';

test('Direct URL hover test', async ({ page }) => {
  console.log('=== DIRECT URL HOVER TEST ===');
  
  // Go directly to the working URL we found
  await page.goto('http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture');
  
  // Wait for page load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Loaded page directly');
  console.log('Current URL:', page.url());
  
  // Take initial screenshot
  await page.screenshot({ path: 'DIRECT-URL-LOADED.png', fullPage: true });
  
  // Test navigation hover effects
  console.log('\n=== NAVIGATION HOVER TESTS ===');
  
  const navSelectors = [
    'a[href="/"]', // Home link
    'a[href="/repositories"]', // Repositories link
    'text="APIs"',
    'text="Sync"',
    'input[type="search"], [placeholder*="Search"]'
  ];
  
  for (let i = 0; i < navSelectors.length; i++) {
    const selector = navSelectors[i];
    try {
      const element = page.locator(selector).first();
      if (await element.count() > 0) {
        const text = await element.textContent();
        console.log(`\nTesting: ${selector} ("${text?.trim()}")`);
        
        // Before hover
        await page.screenshot({ path: `before-hover-${i + 1}.png` });
        
        // Hover
        await element.hover();
        await page.waitForTimeout(1000);
        
        // During hover - get styles
        const hoverStyles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            filter: computed.filter,
            backdropFilter: computed.backdropFilter,
            opacity: computed.opacity,
            transform: computed.transform,
            textShadow: computed.textShadow,
            blur: computed.filter.includes('blur')
          };
        });
        
        console.log('  Hover styles:', hoverStyles);
        
        // Screenshot during hover
        await page.screenshot({ path: `during-hover-${i + 1}.png` });
        
        // Check for blur
        if (hoverStyles.blur || hoverStyles.backdropFilter !== 'none') {
          console.log(`  🚨 BLUR FOUND: filter=${hoverStyles.filter}, backdrop=${hoverStyles.backdropFilter}`);
        } else {
          console.log(`  ✅ NO BLUR: Clean hover effect`);
        }
        
        // Move away
        await page.mouse.move(0, 0);
        await page.waitForTimeout(500);
        
        // After hover
        await page.screenshot({ path: `after-hover-${i + 1}.png` });
      } else {
        console.log(`❌ Element not found: ${selector}`);
      }
    } catch (error) {
      console.log(`❌ Error testing ${selector}: ${error}`);
    }
  }
  
  // Global blur scan
  console.log('\n=== GLOBAL BLUR SCAN ===');
  
  const blurScan = await page.evaluate(() => {
    const results = {
      totalElements: 0,
      elementsWithFilter: 0,
      elementsWithBackdropFilter: 0,
      elementsWithBlur: 0,
      blurElements: [] as any[]
    };
    
    const allElements = document.querySelectorAll('*');
    results.totalElements = allElements.length;
    
    allElements.forEach((el) => {
      const computed = window.getComputedStyle(el);
      
      if (computed.filter !== 'none') {
        results.elementsWithFilter++;
        if (computed.filter.includes('blur')) {
          results.elementsWithBlur++;
          results.blurElements.push({
            tag: el.tagName,
            class: el.className,
            filter: computed.filter
          });
        }
      }
      
      if (computed.backdropFilter !== 'none') {
        results.elementsWithBackdropFilter++;
        results.blurElements.push({
          tag: el.tagName,
          class: el.className,
          backdropFilter: computed.backdropFilter
        });
      }
    });
    
    return results;
  });
  
  console.log(`\nBLUR SCAN RESULTS:`);
  console.log(`  Total elements scanned: ${blurScan.totalElements}`);
  console.log(`  Elements with filter: ${blurScan.elementsWithFilter}`);
  console.log(`  Elements with backdrop-filter: ${blurScan.elementsWithBackdropFilter}`);
  console.log(`  Elements with blur: ${blurScan.elementsWithBlur}`);
  
  if (blurScan.blurElements.length > 0) {
    console.log(`\n  BLUR ELEMENTS FOUND:`);
    blurScan.blurElements.forEach((el, i) => {
      console.log(`    ${i + 1}. ${el.tag}.${el.class}`);
      if (el.filter) console.log(`       filter: ${el.filter}`);
      if (el.backdropFilter) console.log(`       backdrop-filter: ${el.backdropFilter}`);
    });
  } else {
    console.log(`  ✅ NO BLUR ELEMENTS FOUND`);
  }
  
  // Final screenshot
  await page.screenshot({ path: 'FINAL-BLUR-TEST-COMPLETE.png', fullPage: true });
  
  console.log('\n=== TEST COMPLETE ===');
});