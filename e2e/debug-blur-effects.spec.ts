import { test, expect } from '@playwright/test';

test.describe('Blur Effects Diagnosis on Live Deployment', () => {
  test('diagnose blur and fuzzing effects on AI predictive maintenance page', async ({ page }) => {
    // Navigate to the specific URL the user reported
    console.log('🔍 Navigating to deployment URL...');
    await page.goto('http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take initial screenshot
    console.log('📸 Taking initial screenshot...');
    await page.screenshot({ 
      path: 'current-blur-state.png', 
      fullPage: true 
    });

    // Check for any backdrop-filter properties
    console.log('🔍 Checking for backdrop-filter properties...');
    const backdropFilters = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const results = [];
      
      for (let el of elements) {
        const style = window.getComputedStyle(el);
        if (style.backdropFilter && style.backdropFilter !== 'none') {
          results.push({
            element: el.tagName + (el.className ? '.' + el.className : '') + (el.id ? '#' + el.id : ''),
            backdropFilter: style.backdropFilter,
            selector: el.outerHTML.substring(0, 100) + '...'
          });
        }
      }
      return results;
    });

    // Check for filter: blur properties
    console.log('🔍 Checking for filter blur properties...');
    const filterBlurs = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const results = [];
      
      for (let el of elements) {
        const style = window.getComputedStyle(el);
        if (style.filter && style.filter.includes('blur')) {
          results.push({
            element: el.tagName + (el.className ? '.' + el.className : '') + (el.id ? '#' + el.id : ''),
            filter: style.filter,
            selector: el.outerHTML.substring(0, 100) + '...'
          });
        }
      }
      return results;
    });

    // Check for any CSS with blur in hover states
    console.log('🔍 Checking CSS stylesheets for blur effects...');
    const cssBlurRules = await page.evaluate(() => {
      const results = [];
      
      // Check all stylesheets
      for (let styleSheet of document.styleSheets) {
        try {
          for (let rule of styleSheet.cssRules || []) {
            if (rule.style) {
              const cssText = rule.cssText || '';
              if (cssText.includes('backdrop-filter') || cssText.includes('filter:') && cssText.includes('blur')) {
                results.push({
                  rule: cssText,
                  sheet: styleSheet.href || 'inline'
                });
              }
            }
          }
        } catch (e) {
          // Skip CORS-protected stylesheets
        }
      }
      return results;
    });

    // Test hover effects on key elements
    console.log('🖱️ Testing hover effects...');
    const elementsToTest = [
      'nav',
      '.sidebar',
      '.documentation-container', 
      '.markdown-content',
      'button',
      'a',
      '.repository-card',
      '[class*="blur"]',
      '[class*="backdrop"]'
    ];

    const hoverResults = [];
    
    for (const selector of elementsToTest) {
      try {
        const element = page.locator(selector).first();
        if (await element.count() > 0) {
          // Get styles before hover
          const beforeHover = await element.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return {
              backdropFilter: style.backdropFilter,
              filter: style.filter,
              opacity: style.opacity
            };
          });

          // Hover and check styles
          await element.hover();
          await page.waitForTimeout(500);

          const afterHover = await element.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return {
              backdropFilter: style.backdropFilter,
              filter: style.filter,
              opacity: style.opacity
            };
          });

          if (JSON.stringify(beforeHover) !== JSON.stringify(afterHover)) {
            hoverResults.push({
              selector,
              before: beforeHover,
              after: afterHover
            });
          }

          // Take screenshot while hovering
          await page.screenshot({ 
            path: `hover-${selector.replace(/[^a-zA-Z0-9]/g, '-')}.png` 
          });
        }
      } catch (e) {
        console.log(`⚠️ Could not test hover on ${selector}: ${e.message}`);
      }
    }

    // Check for glassmorphism or blur-related CSS classes
    console.log('🔍 Checking for blur-related CSS classes...');
    const blurClasses = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const results = [];
      
      for (let el of elements) {
        const classList = Array.from(el.classList);
        const hasBlurClass = classList.some(cls => 
          cls.includes('blur') || 
          cls.includes('glass') || 
          cls.includes('backdrop') ||
          cls.includes('frosted')
        );
        
        if (hasBlurClass) {
          results.push({
            element: el.tagName,
            classes: classList,
            selector: el.outerHTML.substring(0, 100) + '...'
          });
        }
      }
      return results;
    });

    // Log all findings
    console.log('\n=== BLUR EFFECTS DIAGNOSIS RESULTS ===');
    console.log('\n📊 BACKDROP-FILTER ELEMENTS:', backdropFilters.length);
    backdropFilters.forEach(item => {
      console.log(`  • ${item.element}: ${item.backdropFilter}`);
    });

    console.log('\n📊 FILTER BLUR ELEMENTS:', filterBlurs.length);
    filterBlurs.forEach(item => {
      console.log(`  • ${item.element}: ${item.filter}`);
    });

    console.log('\n📊 CSS RULES WITH BLUR:', cssBlurRules.length);
    cssBlurRules.forEach(item => {
      console.log(`  • ${item.sheet}: ${item.rule.substring(0, 200)}...`);
    });

    console.log('\n📊 HOVER EFFECTS DETECTED:', hoverResults.length);
    hoverResults.forEach(item => {
      console.log(`  • ${item.selector}:`);
      console.log(`    Before: ${JSON.stringify(item.before)}`);
      console.log(`    After: ${JSON.stringify(item.after)}`);
    });

    console.log('\n📊 BLUR-RELATED CLASSES:', blurClasses.length);
    blurClasses.forEach(item => {
      console.log(`  • ${item.element}: ${item.classes.join(', ')}`);
    });

    // Final screenshot
    await page.screenshot({ 
      path: 'final-blur-diagnosis.png', 
      fullPage: true 
    });

    // Assertions to fail if blur effects found
    expect(backdropFilters.length, `Found ${backdropFilters.length} elements with backdrop-filter`).toBe(0);
    expect(filterBlurs.length, `Found ${filterBlurs.length} elements with filter blur`).toBe(0);
    expect(cssBlurRules.length, `Found ${cssBlurRules.length} CSS rules with blur`).toBe(0);
    
    console.log('\n✅ DIAGNOSIS COMPLETE - Check screenshots and logs above');
  });

  test('verify text sharpness and clarity', async ({ page }) => {
    await page.goto('http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture');
    await page.waitForLoadState('networkidle');

    // Take high-resolution screenshot for text clarity analysis
    await page.screenshot({ 
      path: 'text-sharpness-test.png', 
      fullPage: false,
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });

    // Check text rendering properties
    const textRenderingProps = await page.evaluate(() => {
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
      const results = [];
      
      for (let el of textElements) {
        if (el.textContent && el.textContent.trim()) {
          const style = window.getComputedStyle(el);
          if (style.textRendering !== 'auto' || style.fontSmooth !== 'auto' || 
              style.webkitFontSmoothing !== 'auto' || style.filter.includes('blur')) {
            results.push({
              element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
              textRendering: style.textRendering,
              fontSmooth: style.fontSmooth,
              webkitFontSmoothing: style.webkitFontSmoothing,
              filter: style.filter,
              text: el.textContent.substring(0, 50) + '...'
            });
          }
        }
      }
      return results;
    });

    console.log('\n📊 TEXT RENDERING ANALYSIS:', textRenderingProps.length, 'elements with non-standard rendering');
    textRenderingProps.forEach(item => {
      console.log(`  • ${item.element}: ${item.text}`);
      console.log(`    textRendering: ${item.textRendering}`);
      console.log(`    webkitFontSmoothing: ${item.webkitFontSmoothing}`);
      console.log(`    filter: ${item.filter}`);
    });
  });
});