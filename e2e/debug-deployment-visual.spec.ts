import { test, expect } from '@playwright/test';

test('Debug deployment visual effects at exact URL', async ({ page }) => {
  console.log('=== STARTING DEPLOYMENT VISUAL DEBUG ===');
  
  // Navigate to the exact URL
  const targetUrl = '/docs/ai-predictive-maintenance-engine-architecture';
  await page.goto(targetUrl);
  
  // Wait for page to fully load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('=== PAGE LOAD TEST ===');
  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  
  // 1. EXACT SCREENSHOT of initial state
  await page.screenshot({ path: 'deployment-initial-state.png', fullPage: true });
  console.log('📸 Initial screenshot saved: deployment-initial-state.png');
  
  // 2. LIST EVERY ELEMENT with blur, backdrop-filter, or fuzzing
  console.log('\n=== CSS BLUR/FILTER ANALYSIS ===');
  
  const elementsWithEffects = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const results: any[] = [];
    
    elements.forEach((el, index) => {
      const computed = window.getComputedStyle(el);
      const hasEffects = {
        element: el.tagName + (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
        selector: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
        filter: computed.filter,
        backdropFilter: computed.backdropFilter,
        blur: computed.filter && computed.filter.includes('blur'),
        opacity: computed.opacity,
        transform: computed.transform,
        transition: computed.transition,
        hasVisualEffects: computed.filter !== 'none' || computed.backdropFilter !== 'none' || parseFloat(computed.opacity) < 1
      };
      
      if (hasEffects.hasVisualEffects) {
        results.push(hasEffects);
      }
    });
    
    return results;
  });
  
  console.log(`Found ${elementsWithEffects.length} elements with visual effects`);
  elementsWithEffects.forEach((el, i) => {
    console.log(`${i + 1}. ${el.selector}`);
    console.log(`   filter: ${el.filter}`);
    console.log(`   backdrop-filter: ${el.backdropFilter}`);
    console.log(`   opacity: ${el.opacity}`);
    console.log(`   transform: ${el.transform}`);
    console.log(`   transition: ${el.transition}`);
    console.log('');
  });
  
  // 3. HOVER TEST - Test navigation and common elements
  console.log('\n=== HOVER TESTING ===');
  
  // Find all clickable/hoverable elements
  const hoverableSelectors = [
    'nav a',
    'header a', 
    '.nav a',
    'button',
    '[role="button"]',
    '.button',
    '.btn',
    '[href]'
  ];
  
  for (const selector of hoverableSelectors) {
    const elements = await page.locator(selector).all();
    console.log(`Found ${elements.length} elements matching "${selector}"`);
    
    for (let i = 0; i < Math.min(elements.length, 3); i++) {
      const element = elements[i];
      
      try {
        // Get element info before hover
        const beforeInfo = await element.evaluate((el: any) => ({
          text: el.textContent?.trim().substring(0, 50) || '',
          className: el.className,
          tagName: el.tagName
        }));
        
        console.log(`Hovering over: ${beforeInfo.tagName}.${beforeInfo.className} "${beforeInfo.text}"`);
        
        // Screenshot before hover
        await element.screenshot({ path: `before-hover-${selector.replace(/\s+/g, '-')}-${i + 1}.png` });
        
        // Hover and capture
        await element.hover();
        await page.waitForTimeout(1000);
        
        // Screenshot during hover
        await element.screenshot({ path: `during-hover-${selector.replace(/\s+/g, '-')}-${i + 1}.png` });
        
        // Check for changes during hover
        const duringHover = await element.evaluate((el: any) => {
          const computed = window.getComputedStyle(el);
          return {
            filter: computed.filter,
            backdropFilter: computed.backdropFilter,
            opacity: computed.opacity,
            transform: computed.transform,
            blur: computed.filter && computed.filter.includes('blur')
          };
        });
        
        console.log(`   During hover - filter: ${duringHover.filter}, opacity: ${duringHover.opacity}, blur: ${duringHover.blur}`);
        
        // Move mouse away and capture after
        await page.mouse.move(0, 0);
        await page.waitForTimeout(500);
        await element.screenshot({ path: `after-hover-${selector.replace(/\s+/g, '-')}-${i + 1}.png` });
        
      } catch (error) {
        console.log(`   Error testing element: ${error}`);
      }
    }
  }
  
  // 4. CSS INSPECTION - Get all stylesheets and blur-related rules
  console.log('\n=== CSS INSPECTION ===');
  
  const cssRules = await page.evaluate(() => {
    const rules: any[] = [];
    
    // Check all stylesheets
    try {
      for (let sheet of Array.from(document.styleSheets)) {
        try {
          const cssRulesArray = Array.from(sheet.cssRules || sheet.rules || []);
          for (let rule of cssRulesArray) {
            if ((rule as any).style) {
              const cssText = (rule as any).cssText || '';
              if (cssText.includes('blur') || 
                  cssText.includes('backdrop-filter') || 
                  cssText.includes('filter:') || 
                  (cssText.includes('opacity') && cssText.includes('hover'))) {
                rules.push({
                  selector: (rule as any).selectorText,
                  cssText: cssText,
                  sheet: sheet.href || 'inline'
                });
              }
            }
          }
        } catch (e) {
          console.log('Could not access stylesheet rules:', e);
        }
      }
    } catch (e) {
      console.log('Error accessing stylesheets:', e);
    }
    
    return rules;
  });
  
  console.log(`Found ${cssRules.length} CSS rules with blur/filter/hover effects:`);
  cssRules.forEach((rule, i) => {
    console.log(`${i + 1}. ${rule.selector}`);
    console.log(`   From: ${rule.sheet}`);
    console.log(`   CSS: ${rule.cssText}`);
    console.log('');
  });
  
  // 5. Check specific problematic elements
  console.log('\n=== SPECIFIC ELEMENT CHECKS ===');
  
  // Check header
  const headerSelectors = ['header', '.header', '[role="banner"]', 'nav', '.nav'];
  for (const headerSelector of headerSelectors) {
    const header = page.locator(headerSelector).first();
    if (await header.count() > 0) {
      console.log(`Found header element: ${headerSelector}`);
      await header.screenshot({ path: `header-${headerSelector.replace(/[\[\]="]/g, '')}.png` });
      
      const headerStyles = await header.evaluate((el: any) => {
        const computed = window.getComputedStyle(el);
        return {
          filter: computed.filter,
          backdropFilter: computed.backdropFilter,
          opacity: computed.opacity,
          background: computed.background,
          boxShadow: computed.boxShadow,
          className: el.className,
          tagName: el.tagName
        };
      });
      console.log(`${headerSelector} styles:`, headerStyles);
    }
  }
  
  // Check for any elements with blur-related class names
  const blurSelectors = ['[class*="blur"]', '[class*="backdrop"]', '[class*="fuzzy"]', '[style*="blur"]', '[style*="filter"]'];
  for (const blurSelector of blurSelectors) {
    const blurElements = await page.locator(blurSelector).all();
    console.log(`Found ${blurElements.length} elements matching "${blurSelector}"`);
    
    for (const element of blurElements.slice(0, 5)) {
      try {
        const info = await element.evaluate((el: any) => ({
          className: el.className,
          tagName: el.tagName,
          style: el.style.cssText,
          computedFilter: window.getComputedStyle(el).filter,
          computedBackdropFilter: window.getComputedStyle(el).backdropFilter
        }));
        console.log(`Blur element: ${info.tagName}.${info.className}`);
        console.log(`  Style: ${info.style}`);
        console.log(`  Computed filter: ${info.computedFilter}`);
        console.log(`  Computed backdrop-filter: ${info.computedBackdropFilter}`);
      } catch (error) {
        console.log(`Error inspecting blur element: ${error}`);
      }
    }
  }
  
  // Final full page screenshot
  await page.screenshot({ path: 'deployment-final-state.png', fullPage: true });
  console.log('📸 Final screenshot saved: deployment-final-state.png');
  
  console.log('\n=== TEST COMPLETE ===');
  console.log('All screenshots and analysis complete. Check the generated PNG files for visual evidence.');
});