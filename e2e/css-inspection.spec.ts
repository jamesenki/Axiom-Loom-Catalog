import { test } from '@playwright/test';

test('inspect CSS for blur effects', async ({ page }) => {
  await page.goto('http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture');
  await page.waitForLoadState('networkidle');

  // Get all loaded CSS files and their contents
  const cssContents = await page.evaluate(() => {
    const results = [];
    
    // Check all stylesheets
    for (let styleSheet of document.styleSheets) {
      try {
        const href = styleSheet.href || 'inline';
        const rules = [];
        
        for (let rule of styleSheet.cssRules || []) {
          const cssText = rule.cssText || '';
          if (cssText.includes('backdrop-filter') || 
              cssText.includes('filter') && cssText.includes('blur') ||
              cssText.includes('glass') ||
              cssText.includes('frosted')) {
            rules.push(cssText);
          }
        }
        
        if (rules.length > 0) {
          results.push({
            file: href,
            rules: rules
          });
        }
      } catch (e) {
        // Skip CORS-protected stylesheets
        console.log('Skipped CORS stylesheet:', styleSheet.href);
      }
    }
    
    return results;
  });

  console.log('\n=== CSS BLUR INSPECTION RESULTS ===');
  console.log(`Found ${cssContents.length} stylesheets with blur-related rules:`);
  
  cssContents.forEach((sheet, index) => {
    console.log(`\n${index + 1}. ${sheet.file}:`);
    sheet.rules.forEach((rule, ruleIndex) => {
      console.log(`   Rule ${ruleIndex + 1}: ${rule}`);
    });
  });

  if (cssContents.length === 0) {
    console.log('✅ NO BLUR EFFECTS FOUND IN CSS');
  } else {
    console.log('❌ BLUR EFFECTS DETECTED IN CSS');
  }

  // Check specifically for webkit font smoothing which might cause "fuzzing"
  const fontSmoothingElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const results = [];
    
    for (let el of elements) {
      const style = window.getComputedStyle(el);
      if (style.webkitFontSmoothing && style.webkitFontSmoothing !== 'auto') {
        const className = el.className && typeof el.className === 'string' ? el.className.split(' ')[0] : '';
        results.push({
          element: el.tagName + (className ? '.' + className : ''),
          webkitFontSmoothing: style.webkitFontSmoothing,
          fontSmooth: style.fontSmooth
        });
      }
    }
    return results;
  });

  console.log(`\n=== FONT SMOOTHING ANALYSIS ===`);
  console.log(`Found ${fontSmoothingElements.length} elements with font smoothing:`);
  
  fontSmoothingElements.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. ${item.element}: webkit-font-smoothing: ${item.webkitFontSmoothing}`);
  });

  if (fontSmoothingElements.length > 10) {
    console.log(`... and ${fontSmoothingElements.length - 10} more elements`);
  }
});