import { test, expect } from '@playwright/test';

test.describe('Visual Diagnostics - Dark Theme Issues', () => {
  const baseURL = 'http://10.0.0.109:3000';
  const docURL = `${baseURL}/docs/ai-predictive-maintenance-engine-architecture`;

  test('Detailed blur effect detection', async ({ page }) => {
    console.log('🔍 DETAILED BLUR EFFECT ANALYSIS');
    
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Take a screenshot first
    await page.screenshot({ 
      path: 'test-results/blur-analysis-homepage.png', 
      fullPage: true 
    });

    const blurAnalysis = await page.evaluate(() => {
      const results = {
        totalElements: 0,
        elementsWithBlur: [],
        blurStyles: []
      };

      const allElements = document.querySelectorAll('*');
      results.totalElements = allElements.length;

      for (let element of allElements) {
        const styles = window.getComputedStyle(element);
        const filter = styles.filter;
        const backdropFilter = styles.backdropFilter;
        
        if ((filter && filter !== 'none' && filter.includes('blur')) || 
            (backdropFilter && backdropFilter !== 'none' && backdropFilter.includes('blur'))) {
          
          results.elementsWithBlur.push({
            tagName: element.tagName,
            id: element.id || 'no-id',
            className: element.className || 'no-class',
            filter: filter,
            backdropFilter: backdropFilter,
            innerHTML: element.innerHTML.substring(0, 100) + '...',
            computedStyle: {
              position: styles.position,
              zIndex: styles.zIndex,
              opacity: styles.opacity,
              display: styles.display
            }
          });
          
          results.blurStyles.push({
            selector: element.tagName + (element.id ? '#' + element.id : '') + 
                     (element.className ? '.' + element.className.split(' ')[0] : ''),
            filter: filter,
            backdropFilter: backdropFilter
          });
        }
      }

      return results;
    });

    console.log('📊 BLUR ANALYSIS RESULTS:');
    console.log(`Total elements scanned: ${blurAnalysis.totalElements}`);
    console.log(`Elements with blur effects: ${blurAnalysis.elementsWithBlur.length}`);
    
    if (blurAnalysis.elementsWithBlur.length > 0) {
      console.log('\n🚨 BLUR EFFECTS FOUND:');
      blurAnalysis.elementsWithBlur.forEach((el, index) => {
        console.log(`\n${index + 1}. ${el.tagName} element:`);
        console.log(`   ID: ${el.id}`);
        console.log(`   Class: ${el.className}`);
        console.log(`   Filter: ${el.filter}`);
        console.log(`   Backdrop Filter: ${el.backdropFilter}`);
        console.log(`   Position: ${el.computedStyle.position}`);
        console.log(`   Z-Index: ${el.computedStyle.zIndex}`);
      });

      console.log('\n🛠️ CSS TO FIX:');
      blurAnalysis.blurStyles.forEach(style => {
        console.log(`${style.selector} { filter: ${style.filter}; backdrop-filter: ${style.backdropFilter}; }`);
      });
    }

    // FAIL if blur effects found
    if (blurAnalysis.elementsWithBlur.length > 0) {
      throw new Error(`❌ BLUR EFFECTS DETECTED: Found ${blurAnalysis.elementsWithBlur.length} elements with blur effects that need to be removed`);
    }

    console.log('✅ NO BLUR EFFECTS FOUND - GOOD!');
  });

  test('Detailed color analysis', async ({ page }) => {
    console.log('🎨 DETAILED COLOR ANALYSIS');
    
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Take screenshot for color analysis
    await page.screenshot({ 
      path: 'test-results/color-analysis-homepage.png', 
      fullPage: true 
    });

    const colorAnalysis = await page.evaluate(() => {
      const results = {
        totalElements: 0,
        yellowElements: [],
        brightElements: [],
        colorPalette: new Map(),
        backgroundPalette: new Map()
      };

      const allElements = document.querySelectorAll('*');
      results.totalElements = allElements.length;

      // Define problematic colors
      const problematicColors = [
        'yellow', 'lime', 'cyan', 'magenta',
        '#ffff00', '#00ff00', '#00ffff', '#ff00ff',
        'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 255, 255)', 'rgb(255, 0, 255)'
      ];

      for (let element of allElements) {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        const borderColor = styles.borderColor;

        // Count color usage
        if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
          const count = results.colorPalette.get(color) || 0;
          results.colorPalette.set(color, count + 1);
        }
        
        if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
          const count = results.backgroundPalette.get(backgroundColor) || 0;
          results.backgroundPalette.set(backgroundColor, count + 1);
        }

        // Check for problematic colors
        const hasYellow = problematicColors.some(problematic => 
          color.includes(problematic) || 
          backgroundColor.includes(problematic) || 
          borderColor.includes(problematic)
        );

        if (hasYellow) {
          results.yellowElements.push({
            tagName: element.tagName,
            id: element.id || 'no-id',
            className: element.className || 'no-class',
            color: color,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            innerHTML: element.innerHTML.substring(0, 50) + '...'
          });
        }

        // Check for very bright colors (high RGB values)
        const rgbMatch = color.match(/rgb\((\d+), (\d+), (\d+)\)/);
        const bgRgbMatch = backgroundColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
        
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number);
          if (r > 200 && g > 200 && b > 200) { // Very bright colors
            results.brightElements.push({
              element: element.tagName,
              color: color,
              type: 'text'
            });
          }
        }
        
        if (bgRgbMatch) {
          const [, r, g, b] = bgRgbMatch.map(Number);
          if (r > 200 && g > 200 && b > 200) { // Very bright backgrounds
            results.brightElements.push({
              element: element.tagName,
              backgroundColor: backgroundColor,
              type: 'background'
            });
          }
        }
      }

      // Convert Map to Object for logging
      results.colorPalette = Object.fromEntries(results.colorPalette);
      results.backgroundPalette = Object.fromEntries(results.backgroundPalette);

      return results;
    });

    console.log('🎨 COLOR ANALYSIS RESULTS:');
    console.log(`Total elements scanned: ${colorAnalysis.totalElements}`);
    console.log(`Yellow/problematic elements: ${colorAnalysis.yellowElements.length}`);
    console.log(`Bright elements: ${colorAnalysis.brightElements.length}`);

    // Show top colors used
    console.log('\n📊 TOP COLORS USED:');
    const topColors = Object.entries(colorAnalysis.colorPalette)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10);
    topColors.forEach(([color, count]) => {
      console.log(`   ${color}: ${count} times`);
    });

    console.log('\n📊 TOP BACKGROUND COLORS:');
    const topBgColors = Object.entries(colorAnalysis.backgroundPalette)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10);
    topBgColors.forEach(([color, count]) => {
      console.log(`   ${color}: ${count} times`);
    });

    if (colorAnalysis.yellowElements.length > 0) {
      console.log('\n🚨 PROBLEMATIC COLORS FOUND:');
      colorAnalysis.yellowElements.forEach((el, index) => {
        console.log(`\n${index + 1}. ${el.tagName} element:`);
        console.log(`   ID: ${el.id}`);
        console.log(`   Class: ${el.className}`);
        console.log(`   Color: ${el.color}`);
        console.log(`   Background: ${el.backgroundColor}`);
        console.log(`   Border: ${el.borderColor}`);
      });
    }

    if (colorAnalysis.brightElements.length > 0) {
      console.log('\n🔆 BRIGHT COLORS FOUND:');
      colorAnalysis.brightElements.forEach((el, index) => {
        console.log(`${index + 1}. ${el.element}: ${el.color || el.backgroundColor} (${el.type})`);
      });
    }

    // FAIL if problematic colors found
    if (colorAnalysis.yellowElements.length > 0) {
      throw new Error(`❌ YELLOW/PROBLEMATIC COLORS DETECTED: Found ${colorAnalysis.yellowElements.length} elements with problematic colors`);
    }

    console.log('✅ NO PROBLEMATIC COLORS FOUND - GOOD!');
  });

  test('Documentation page specific analysis', async ({ page }) => {
    console.log('📄 DOCUMENTATION PAGE ANALYSIS');
    
    await page.goto(docURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    // Take screenshot of docs page
    await page.screenshot({ 
      path: 'test-results/docs-page-analysis.png', 
      fullPage: true 
    });

    const docsAnalysis = await page.evaluate(() => {
      const results = {
        pageLoaded: false,
        hasContent: false,
        contentElements: [],
        visualIssues: {
          blurElements: [],
          problematicColors: []
        },
        pageInfo: {
          title: document.title,
          url: window.location.href,
          hasMainContent: false,
          contentSelectors: []
        }
      };

      // Check if page loaded successfully
      results.pageLoaded = !document.title.includes('404') && !document.title.includes('Not Found');

      // Look for main content
      const contentSelectors = [
        '.markdown-content',
        '.documentation-content',
        'main',
        'article', 
        '.content',
        '[role="main"]'
      ];

      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent && element.textContent.trim().length > 100) {
          results.hasContent = true;
          results.pageInfo.hasMainContent = true;
          results.pageInfo.contentSelectors.push(selector);
          results.contentElements.push({
            selector: selector,
            textLength: element.textContent.length,
            hasChildren: element.children.length > 0
          });
        }
      }

      // Check for visual issues on this specific page
      const allElements = document.querySelectorAll('*');
      for (let element of allElements) {
        const styles = window.getComputedStyle(element);
        
        // Check for blur
        if (styles.filter.includes('blur') || styles.backdropFilter.includes('blur')) {
          results.visualIssues.blurElements.push({
            tagName: element.tagName,
            className: element.className,
            filter: styles.filter,
            backdropFilter: styles.backdropFilter
          });
        }

        // Check for yellow/problematic colors
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        if (color.includes('yellow') || backgroundColor.includes('yellow') ||
            color.includes('255, 255, 0') || backgroundColor.includes('255, 255, 0')) {
          results.visualIssues.problematicColors.push({
            tagName: element.tagName,
            className: element.className,
            color: color,
            backgroundColor: backgroundColor
          });
        }
      }

      return results;
    });

    console.log('📄 DOCUMENTATION PAGE RESULTS:');
    console.log(`Page loaded successfully: ${docsAnalysis.pageLoaded}`);
    console.log(`Has main content: ${docsAnalysis.hasContent}`);
    console.log(`Page title: ${docsAnalysis.pageInfo.title}`);
    console.log(`Content selectors found: ${docsAnalysis.pageInfo.contentSelectors.join(', ')}`);
    console.log(`Blur issues: ${docsAnalysis.visualIssues.blurElements.length}`);
    console.log(`Color issues: ${docsAnalysis.visualIssues.problematicColors.length}`);

    if (docsAnalysis.visualIssues.blurElements.length > 0) {
      console.log('\n🚨 BLUR ISSUES ON DOCS PAGE:');
      docsAnalysis.visualIssues.blurElements.forEach((el, index) => {
        console.log(`${index + 1}. ${el.tagName}.${el.className}: filter=${el.filter}, backdrop-filter=${el.backdropFilter}`);
      });
    }

    if (docsAnalysis.visualIssues.problematicColors.length > 0) {
      console.log('\n🚨 COLOR ISSUES ON DOCS PAGE:');
      docsAnalysis.visualIssues.problematicColors.forEach((el, index) => {
        console.log(`${index + 1}. ${el.tagName}.${el.className}: color=${el.color}, bg=${el.backgroundColor}`);
      });
    }

    // Validate critical requirements
    expect(docsAnalysis.pageLoaded).toBe(true);
    expect(docsAnalysis.hasContent).toBe(true);
    expect(docsAnalysis.visualIssues.blurElements.length).toBe(0);
    expect(docsAnalysis.visualIssues.problematicColors.length).toBe(0);

    console.log('✅ DOCUMENTATION PAGE ANALYSIS PASSED!');
  });

  test('CSS file inspection', async ({ page }) => {
    console.log('📋 CSS FILE INSPECTION');
    
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const cssInspection = await page.evaluate(() => {
      const results = {
        stylesheets: [],
        blurRules: [],
        yellowRules: [],
        totalRules: 0,
        accessibleSheets: 0,
        blockedSheets: 0
      };

      for (let i = 0; i < document.styleSheets.length; i++) {
        const stylesheet = document.styleSheets[i];
        const sheetInfo = {
          href: stylesheet.href || 'inline',
          media: stylesheet.media.mediaText || 'all',
          rules: 0,
          accessible: true
        };

        try {
          const rules = stylesheet.cssRules || stylesheet.rules;
          if (rules) {
            sheetInfo.rules = rules.length;
            results.totalRules += rules.length;
            results.accessibleSheets++;

            for (let j = 0; j < rules.length; j++) {
              const rule = rules[j];
              const cssText = rule.cssText || '';
              
              // Check for blur in CSS rules
              if (cssText.includes('blur(') || cssText.includes('backdrop-filter')) {
                results.blurRules.push({
                  stylesheet: sheetInfo.href,
                  rule: cssText.substring(0, 200) + '...'
                });
              }
              
              // Check for yellow colors in CSS rules
              if (cssText.includes('yellow') || cssText.includes('#ffff00') || 
                  cssText.includes('rgb(255, 255, 0)') || cssText.includes('rgba(255, 255, 0')) {
                results.yellowRules.push({
                  stylesheet: sheetInfo.href,
                  rule: cssText.substring(0, 200) + '...'
                });
              }
            }
          }
        } catch (e) {
          sheetInfo.accessible = false;
          results.blockedSheets++;
          console.log(`Cannot access stylesheet: ${sheetInfo.href} - ${e.message}`);
        }

        results.stylesheets.push(sheetInfo);
      }

      return results;
    });

    console.log('📋 CSS INSPECTION RESULTS:');
    console.log(`Total stylesheets: ${cssInspection.stylesheets.length}`);
    console.log(`Accessible stylesheets: ${cssInspection.accessibleSheets}`);
    console.log(`Blocked stylesheets (CORS): ${cssInspection.blockedSheets}`);
    console.log(`Total CSS rules scanned: ${cssInspection.totalRules}`);
    console.log(`Blur rules found: ${cssInspection.blurRules.length}`);
    console.log(`Yellow color rules found: ${cssInspection.yellowRules.length}`);

    console.log('\n📄 STYLESHEETS:');
    cssInspection.stylesheets.forEach((sheet, index) => {
      console.log(`${index + 1}. ${sheet.href}`);
      console.log(`   Media: ${sheet.media}`);
      console.log(`   Rules: ${sheet.rules}`);
      console.log(`   Accessible: ${sheet.accessible}`);
    });

    if (cssInspection.blurRules.length > 0) {
      console.log('\n🚨 BLUR RULES IN CSS:');
      cssInspection.blurRules.forEach((rule, index) => {
        console.log(`${index + 1}. From ${rule.stylesheet}:`);
        console.log(`   ${rule.rule}`);
      });
    }

    if (cssInspection.yellowRules.length > 0) {
      console.log('\n🚨 YELLOW COLOR RULES IN CSS:');
      cssInspection.yellowRules.forEach((rule, index) => {
        console.log(`${index + 1}. From ${rule.stylesheet}:`);
        console.log(`   ${rule.rule}`);
      });
    }

    // Report issues but don't fail (some may be from external libraries)
    if (cssInspection.blurRules.length > 0) {
      console.log(`⚠️  WARNING: Found ${cssInspection.blurRules.length} blur-related CSS rules`);
    }
    if (cssInspection.yellowRules.length > 0) {
      console.log(`⚠️  WARNING: Found ${cssInspection.yellowRules.length} yellow color CSS rules`);
    }

    console.log('✅ CSS INSPECTION COMPLETED!');
  });
});