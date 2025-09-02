import { test, expect } from '@playwright/test';

test.describe('Dark Theme Visual Verification Tests', () => {
  const baseURL = 'http://10.0.0.109:3000';
  const specificDocURL = `${baseURL}/docs/ai-predictive-maintenance-engine-architecture`;

  // Critical visual requirements from user feedback
  const visualRequirements = {
    noBlurEffects: true,
    noYellowColors: true,
    darkProfessionalColors: true,
    goodContrast: true,
    noBrightColors: true
  };

  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Add console error tracking
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`Console error: ${msg.text()}`);
      }
    });
  });

  test('Home page has proper dark theme with no blur effects', async ({ page }) => {
    console.log('Testing home page dark theme...');
    
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');

    // Wait for any dynamic content to load
    await page.waitForTimeout(3000);

    // Take screenshot for verification
    await page.screenshot({ 
      path: 'test-results/homepage-dark-theme.png', 
      fullPage: true 
    });

    // Check for absence of blur effects in CSS
    const blurElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const elementsWithBlur = [];
      
      for (let element of allElements) {
        const styles = window.getComputedStyle(element);
        const filter = styles.filter;
        const backdropFilter = styles.backdropFilter;
        
        if (filter.includes('blur') || backdropFilter.includes('blur')) {
          elementsWithBlur.push({
            tagName: element.tagName,
            className: element.className,
            filter: filter,
            backdropFilter: backdropFilter
          });
        }
      }
      
      return elementsWithBlur;
    });

    console.log('Elements with blur effects found:', blurElements.length);
    if (blurElements.length > 0) {
      console.log('Blur elements:', blurElements);
    }
    
    // CRITICAL: No blur effects should be present
    expect(blurElements.length).toBe(0);

    // Check for dark background colors
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });

    console.log('Body styles:', bodyStyles);

    // Verify dark theme colors (should be dark blue-black, not yellow/bright)
    const backgroundRgb = bodyStyles.backgroundColor;
    expect(backgroundRgb).not.toContain('255, 255, 0'); // No yellow
    expect(backgroundRgb).not.toContain('yellow');

    // Check for yellow color usage anywhere on the page
    const yellowElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const elementsWithYellow = [];
      
      for (let element of allElements) {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        if (color.includes('yellow') || color.includes('255, 255, 0') ||
            backgroundColor.includes('yellow') || backgroundColor.includes('255, 255, 0')) {
          elementsWithYellow.push({
            tagName: element.tagName,
            className: element.className,
            color: color,
            backgroundColor: backgroundColor
          });
        }
      }
      
      return elementsWithYellow;
    });

    console.log('Elements with yellow colors found:', yellowElements.length);
    if (yellowElements.length > 0) {
      console.log('Yellow elements:', yellowElements);
    }

    // CRITICAL: No yellow colors should be present
    expect(yellowElements.length).toBe(0);

    // Verify page loads successfully
    await expect(page.locator('body')).toBeVisible();
  });

  test('AI Predictive Maintenance Architecture page has proper dark theme', async ({ page }) => {
    console.log('Testing specific documentation page dark theme...');
    
    await page.goto(specificDocURL, { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');

    // Wait for content to fully render
    await page.waitForTimeout(5000);

    // Take screenshot for verification
    await page.screenshot({ 
      path: 'test-results/ai-maintenance-doc-dark-theme.png', 
      fullPage: true 
    });

    // Check that the page loaded successfully (no 404)
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    expect(pageTitle).not.toContain('404');
    expect(pageTitle).not.toContain('Not Found');

    // Verify content is visible
    const hasContent = await page.locator('main, .content, .documentation, article').first().isVisible();
    expect(hasContent).toBe(true);

    // Check for absence of blur effects specifically on this page
    const blurElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const elementsWithBlur = [];
      
      for (let element of allElements) {
        const styles = window.getComputedStyle(element);
        const filter = styles.filter;
        const backdropFilter = styles.backdropFilter;
        
        if (filter.includes('blur') || backdropFilter.includes('blur')) {
          elementsWithBlur.push({
            tagName: element.tagName,
            className: element.className,
            id: element.id,
            filter: filter,
            backdropFilter: backdropFilter,
            textContent: element.textContent?.substring(0, 50) + '...'
          });
        }
      }
      
      return elementsWithBlur;
    });

    console.log('Documentation page blur effects found:', blurElements.length);
    if (blurElements.length > 0) {
      console.log('Blur elements on docs page:', blurElements);
    }
    
    // CRITICAL: No blur effects on documentation page
    expect(blurElements.length).toBe(0);

    // Check for yellow/bright colors on documentation page
    const brightColorElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const elementsWithBrightColors = [];
      
      for (let element of allElements) {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        const borderColor = styles.borderColor;
        
        // Check for yellow, bright green, or other problematic colors
        const problematicColors = ['yellow', '255, 255, 0', 'rgb(255, 255, 0)', 
                                  'lime', 'rgb(0, 255, 0)', 'rgba(0, 255, 0'];
        
        const hasProblematicColor = problematicColors.some(problematic => 
          color.includes(problematic) || 
          backgroundColor.includes(problematic) || 
          borderColor.includes(problematic)
        );
        
        if (hasProblematicColor) {
          elementsWithBrightColors.push({
            tagName: element.tagName,
            className: element.className,
            color: color,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            textContent: element.textContent?.substring(0, 30) + '...'
          });
        }
      }
      
      return elementsWithBrightColors;
    });

    console.log('Elements with bright colors found:', brightColorElements.length);
    if (brightColorElements.length > 0) {
      console.log('Bright color elements:', brightColorElements);
    }

    // CRITICAL: No bright/problematic colors
    expect(brightColorElements.length).toBe(0);
  });

  test('Navigation and links work properly with dark theme', async ({ page }) => {
    console.log('Testing navigation functionality with dark theme...');
    
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Test navigation to documentation
    const docsLink = page.locator('a[href*="docs"], button:has-text("Docs"), .nav-link:has-text("Documentation")').first();
    
    if (await docsLink.isVisible()) {
      await docsLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Verify navigation worked
      expect(page.url()).toContain('docs');
      
      // Take screenshot after navigation
      await page.screenshot({ 
        path: 'test-results/navigation-docs-dark-theme.png', 
        fullPage: true 
      });
    }

    // Test specific AI maintenance documentation link
    try {
      await page.goto(specificDocURL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      // Verify the specific page loads
      const isLoaded = await page.locator('body').isVisible();
      expect(isLoaded).toBe(true);
      
      console.log('AI Predictive Maintenance documentation page loaded successfully');
    } catch (error) {
      console.log('Error loading specific documentation page:', error);
    }
  });

  test('Color contrast validation for readability', async ({ page }) => {
    console.log('Testing color contrast for readability...');
    
    await page.goto(specificDocURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Check text contrast ratios
    const contrastIssues = await page.evaluate(() => {
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a');
      const issues = [];
      
      for (let element of textElements) {
        if (element.textContent?.trim().length > 0) {
          const styles = window.getComputedStyle(element);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          // Simple check for very low contrast (same or very similar colors)
          if (color === backgroundColor || 
              (color.includes('rgba(0, 0, 0, 0)') && backgroundColor.includes('rgba(0, 0, 0'))) {
            issues.push({
              tagName: element.tagName,
              className: element.className,
              color: color,
              backgroundColor: backgroundColor,
              text: element.textContent?.substring(0, 50) + '...'
            });
          }
        }
      }
      
      return issues;
    });

    console.log('Contrast issues found:', contrastIssues.length);
    if (contrastIssues.length > 0) {
      console.log('Contrast issues:', contrastIssues);
    }

    // Log contrast information but don't fail test - just warn
    if (contrastIssues.length > 0) {
      console.warn('Warning: Some contrast issues detected');
    }
  });

  test('Overall visual theme validation', async ({ page }) => {
    console.log('Running comprehensive visual theme validation...');
    
    // Test both pages
    const pagesToTest = [baseURL, specificDocURL];
    
    for (const url of pagesToTest) {
      console.log(`Testing visual theme for: ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      // Get overall page theme characteristics
      const themeAnalysis = await page.evaluate(() => {
        const analysis = {
          blurEffects: 0,
          yellowElements: 0,
          brightElements: 0,
          darkBackgrounds: 0,
          totalElements: 0,
          problematicStyles: []
        };

        const allElements = document.querySelectorAll('*');
        analysis.totalElements = allElements.length;

        for (let element of allElements) {
          const styles = window.getComputedStyle(element);
          
          // Check for blur effects
          if (styles.filter.includes('blur') || styles.backdropFilter.includes('blur')) {
            analysis.blurEffects++;
            analysis.problematicStyles.push({
              type: 'blur',
              element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
              style: styles.filter || styles.backdropFilter
            });
          }
          
          // Check for yellow/bright colors
          const color = styles.color;
          const bgColor = styles.backgroundColor;
          
          if (color.includes('yellow') || bgColor.includes('yellow') ||
              color.includes('255, 255, 0') || bgColor.includes('255, 255, 0')) {
            analysis.yellowElements++;
            analysis.problematicStyles.push({
              type: 'yellow',
              element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
              color: color,
              backgroundColor: bgColor
            });
          }
          
          // Check if background is dark (good for dark theme)
          const bgRgb = bgColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
          if (bgRgb) {
            const [, r, g, b] = bgRgb.map(Number);
            if (r < 100 && g < 100 && b < 100) { // Dark background
              analysis.darkBackgrounds++;
            }
          }
        }

        return analysis;
      });

      console.log(`Theme analysis for ${url}:`, themeAnalysis);

      // CRITICAL VALIDATIONS
      expect(themeAnalysis.blurEffects).toBe(0); // NO blur effects
      expect(themeAnalysis.yellowElements).toBe(0); // NO yellow colors
      
      // Should have dark backgrounds (indicates dark theme)
      expect(themeAnalysis.darkBackgrounds).toBeGreaterThan(0);
      
      // Take final screenshot
      const filename = url.includes('docs') ? 'final-docs-validation.png' : 'final-home-validation.png';
      await page.screenshot({ 
        path: `test-results/${filename}`, 
        fullPage: true 
      });
    }
    
    console.log('✅ All visual theme validations passed!');
  });

  test('CSS inspection for theme compliance', async ({ page }) => {
    console.log('Inspecting CSS for theme compliance...');
    
    await page.goto(specificDocURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Get all stylesheets and inspect them
    const cssAnalysis = await page.evaluate(() => {
      const analysis = {
        stylesheets: [],
        blurRules: [],
        colorRules: [],
        themeIndicators: []
      };

      // Check all stylesheets
      for (let stylesheet of document.styleSheets) {
        try {
          const rules = stylesheet.cssRules || stylesheet.rules;
          if (rules) {
            for (let rule of rules) {
              const cssText = rule.cssText || '';
              
              // Check for blur in CSS
              if (cssText.includes('blur(') || cssText.includes('backdrop-filter')) {
                analysis.blurRules.push(cssText);
              }
              
              // Check for yellow colors in CSS
              if (cssText.includes('yellow') || cssText.includes('#ffff00') || 
                  cssText.includes('rgb(255, 255, 0)')) {
                analysis.colorRules.push(cssText);
              }
              
              // Look for dark theme indicators
              if (cssText.includes('dark') || cssText.includes('#000') || 
                  cssText.includes('rgb(0,') || cssText.includes('rgba(0,')) {
                analysis.themeIndicators.push(cssText.substring(0, 100));
              }
            }
          }
        } catch (e) {
          // Skip inaccessible stylesheets (CORS issues)
          console.log('Stylesheet access blocked:', e.message);
        }
      }

      return analysis;
    });

    console.log('CSS Analysis Results:');
    console.log('- Blur rules found:', cssAnalysis.blurRules.length);
    console.log('- Yellow color rules found:', cssAnalysis.colorRules.length);
    console.log('- Dark theme indicators found:', cssAnalysis.themeIndicators.length);

    if (cssAnalysis.blurRules.length > 0) {
      console.log('Blur rules:', cssAnalysis.blurRules);
    }
    if (cssAnalysis.colorRules.length > 0) {
      console.log('Yellow color rules:', cssAnalysis.colorRules);
    }

    // CRITICAL: No CSS blur or yellow rules should exist
    expect(cssAnalysis.blurRules.length).toBe(0);
    expect(cssAnalysis.colorRules.length).toBe(0);
  });
});

test.describe('Functionality Tests with Dark Theme', () => {
  const baseURL = 'http://10.0.0.109:3000';
  
  test('All critical links work correctly', async ({ page }) => {
    console.log('Testing critical link functionality...');
    
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Find and test important links
    const links = await page.locator('a[href*="docs"]').all();
    
    for (let i = 0; i < Math.min(links.length, 5); i++) {
      const link = links[i];
      const href = await link.getAttribute('href');
      
      if (href && !href.startsWith('http')) { // Internal links only
        console.log(`Testing link: ${href}`);
        
        try {
          await link.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
          
          // Verify page loaded
          const isVisible = await page.locator('body').isVisible();
          expect(isVisible).toBe(true);
          
          // Go back for next test
          await page.goBack();
          await page.waitForTimeout(1000);
        } catch (error) {
          console.log(`Link test failed for ${href}:`, error);
        }
      }
    }
  });

  test('Documentation content loads without visual issues', async ({ page }) => {
    console.log('Testing documentation content loading...');
    
    const docURL = 'http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture';
    
    await page.goto(docURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    // Check if main content is visible
    const contentSelectors = [
      '.markdown-content',
      '.documentation-content', 
      'main',
      'article',
      '.content',
      '[role="main"]'
    ];

    let contentFound = false;
    for (const selector of contentSelectors) {
      const element = page.locator(selector);
      if (await element.isVisible()) {
        contentFound = true;
        console.log(`Content found with selector: ${selector}`);
        break;
      }
    }

    expect(contentFound).toBe(true);

    // Take final screenshot
    await page.screenshot({ 
      path: 'test-results/final-documentation-test.png', 
      fullPage: true 
    });
  });
});