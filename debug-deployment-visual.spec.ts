import { test, expect } from '@playwright/test';

test('Debug deployment visual effects at exact URL', async ({ page }) => {
  // Navigate to the exact URL
  await page.goto('http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture');
  
  // Wait for page to fully load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
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
    const results = [];
    
    elements.forEach((el, index) => {
      const computed = window.getComputedStyle(el);
      const hasEffects = {
        element: el.tagName + (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
        selector: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
        filter: computed.filter,
        backdropFilter: computed.backdropFilter,
        blur: computed.filter.includes('blur'),
        opacity: computed.opacity,
        transform: computed.transform,
        transition: computed.transition,
        hasVisualEffects: computed.filter !== 'none' || computed.backdropFilter !== 'none' || parseFloat(computed.opacity) < 1
      };
      
      if (hasVisualEffects.hasVisualEffects) {
        results.push(hasVisualEffects);
      }
    });
    
    return results;
  });
  
  console.log('Elements with visual effects:', elementsWithEffects.length);
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
  
  // Find navigation elements
  const navElements = await page.locator('nav, .nav, [role="navigation"], header a, .header a').all();
  console.log(`Found ${navElements.length} navigation elements to test`);
  
  for (let i = 0; i < Math.min(navElements.length, 10); i++) {
    const element = navElements[i];
    
    try {
      // Get element info before hover
      const beforeInfo = await element.evaluate((el) => ({
        text: el.textContent?.trim().substring(0, 30) || '',
        className: el.className,
        tagName: el.tagName
      }));
      
      console.log(`Hovering over: ${beforeInfo.tagName}.${beforeInfo.className} "${beforeInfo.text}"`);
      
      // Hover and capture
      await element.hover();
      await page.waitForTimeout(500);
      
      // Take screenshot during hover
      await page.screenshot({ path: `hover-test-${i + 1}.png` });
      
      // Check for changes
      const afterHover = await page.evaluate(() => {
        const hovered = document.querySelector(':hover');
        if (hovered) {
          const computed = window.getComputedStyle(hovered);
          return {
            filter: computed.filter,
            backdropFilter: computed.backdropFilter,
            opacity: computed.opacity,
            transform: computed.transform,
            blur: computed.filter.includes('blur')
          };
        }
        return null;
      });
      
      if (afterHover) {
        console.log(`   After hover - filter: ${afterHover.filter}, opacity: ${afterHover.opacity}, blur: ${afterHover.blur}`);
      }
      
      // Move mouse away
      await page.mouse.move(0, 0);
      await page.waitForTimeout(200);
      
    } catch (error) {
      console.log(`   Error hovering over element ${i + 1}: ${error.message}`);
    }
  }
  
  // 4. CSS INSPECTION - Get all stylesheets and blur-related rules
  console.log('\n=== CSS INSPECTION ===');
  
  const cssRules = await page.evaluate(() => {
    const rules = [];
    
    // Check all stylesheets
    for (let sheet of document.styleSheets) {
      try {
        for (let rule of sheet.cssRules || sheet.rules || []) {
          if (rule.style) {
            const cssText = rule.cssText;
            if (cssText.includes('blur') || cssText.includes('backdrop-filter') || cssText.includes('filter:') || cssText.includes('opacity') && cssText.includes('hover')) {
              rules.push({
                selector: rule.selectorText,
                cssText: cssText,
                sheet: sheet.href || 'inline'
              });
            }
          }
        }
      } catch (e) {
        // Some stylesheets can't be accessed due to CORS
      }
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
  const header = page.locator('header, .header, [role="banner"]').first();
  if (await header.count() > 0) {
    await header.screenshot({ path: 'header-element.png' });
    const headerStyles = await header.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        filter: computed.filter,
        backdropFilter: computed.backdropFilter,
        opacity: computed.opacity,
        background: computed.background,
        boxShadow: computed.boxShadow
      };
    });
    console.log('Header styles:', headerStyles);
  }
  
  // Check for any elements with blur class names
  const blurElements = await page.locator('[class*="blur"], [class*="backdrop"], [class*="fuzzy"]').all();
  console.log(`Found ${blurElements.length} elements with blur-related classes`);
  
  for (const element of blurElements) {
    const info = await element.evaluate((el) => ({
      className: el.className,
      tagName: el.tagName,
      styles: window.getComputedStyle(el).cssText
    }));
    console.log(`Blur element: ${info.tagName}.${info.className}`);
  }
  
  // Final screenshot
  await page.screenshot({ path: 'deployment-final-state.png', fullPage: true });
  console.log('📸 Final screenshot saved: deployment-final-state.png');
  
  // Console log analysis
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`${msg.type()}: ${msg.text()}`);
  });
  
  console.log('\n=== CONSOLE LOGS ===');
  console.log('Console messages during test:', consoleLogs.length);
  consoleLogs.forEach((log, i) => {
    console.log(`${i + 1}. ${log}`);
  });
});