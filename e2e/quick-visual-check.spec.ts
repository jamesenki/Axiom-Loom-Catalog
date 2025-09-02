import { test, expect } from '@playwright/test';

test.describe('Quick Visual Theme Check', () => {
  const baseURL = 'http://10.0.0.109:3000';
  const docURL = `${baseURL}/docs/ai-predictive-maintenance-engine-architecture`;

  test('Quick homepage visual check', async ({ page }) => {
    console.log('🏠 Checking homepage visuals...');
    
    // Increase timeout and use load event instead of networkidle
    await page.goto(baseURL, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2000);

    // Take screenshot immediately
    await page.screenshot({ 
      path: 'test-results/homepage-quick-check.png', 
      fullPage: true 
    });

    // Quick blur check
    const hasBlur = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let blurCount = 0;
      const blurElements = [];

      for (let el of elements) {
        const styles = window.getComputedStyle(el);
        if (styles.filter.includes('blur') || styles.backdropFilter.includes('blur')) {
          blurCount++;
          blurElements.push({
            tag: el.tagName,
            class: el.className,
            filter: styles.filter,
            backdropFilter: styles.backdropFilter
          });
        }
      }

      return { blurCount, blurElements };
    });

    console.log(`Found ${hasBlur.blurCount} elements with blur effects`);
    if (hasBlur.blurCount > 0) {
      console.log('Blur elements:', hasBlur.blurElements);
    }

    // Quick yellow check
    const hasYellow = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let yellowCount = 0;
      const yellowElements = [];

      for (let el of elements) {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        if (color.includes('yellow') || backgroundColor.includes('yellow') ||
            color.includes('255, 255, 0') || backgroundColor.includes('255, 255, 0')) {
          yellowCount++;
          yellowElements.push({
            tag: el.tagName,
            class: el.className,
            color: color,
            backgroundColor: backgroundColor
          });
        }
      }

      return { yellowCount, yellowElements };
    });

    console.log(`Found ${hasYellow.yellowCount} elements with yellow colors`);
    if (hasYellow.yellowCount > 0) {
      console.log('Yellow elements:', hasYellow.yellowElements);
    }

    // Get general theme info
    const themeInfo = await page.evaluate(() => {
      const body = document.body;
      const bodyStyles = window.getComputedStyle(body);
      
      return {
        bodyBackgroundColor: bodyStyles.backgroundColor,
        bodyColor: bodyStyles.color,
        title: document.title,
        hasContent: document.body.textContent.length > 100
      };
    });

    console.log('Theme info:', themeInfo);

    // Basic validations
    expect(themeInfo.hasContent).toBe(true);
    console.log(`✅ Homepage loaded with ${hasBlur.blurCount} blur effects and ${hasYellow.yellowCount} yellow elements`);
  });

  test('Quick documentation page check', async ({ page }) => {
    console.log('📄 Checking documentation page visuals...');
    
    try {
      await page.goto(docURL, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(3000);

      // Take screenshot
      await page.screenshot({ 
        path: 'test-results/docs-quick-check.png', 
        fullPage: true 
      });

      // Check if page loaded successfully
      const pageInfo = await page.evaluate(() => {
        const title = document.title;
        const url = window.location.href;
        const hasContent = document.body.textContent.length > 100;
        const is404 = title.includes('404') || title.includes('Not Found') || 
                     document.body.textContent.includes('404') || 
                     document.body.textContent.includes('Page Not Found');

        return { title, url, hasContent, is404 };
      });

      console.log('Documentation page info:', pageInfo);

      // Quick visual checks
      const visualCheck = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let blurCount = 0;
        let yellowCount = 0;

        for (let el of elements) {
          const styles = window.getComputedStyle(el);
          
          if (styles.filter.includes('blur') || styles.backdropFilter.includes('blur')) {
            blurCount++;
          }
          
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          if (color.includes('yellow') || backgroundColor.includes('yellow')) {
            yellowCount++;
          }
        }

        return { blurCount, yellowCount };
      });

      console.log(`Docs page: ${visualCheck.blurCount} blur effects, ${visualCheck.yellowCount} yellow elements`);
      
      expect(pageInfo.hasContent).toBe(true);
      expect(pageInfo.is404).toBe(false);
      
      console.log('✅ Documentation page analysis complete');

    } catch (error) {
      console.log('❌ Documentation page error:', error);
      // Take screenshot of error state
      await page.screenshot({ 
        path: 'test-results/docs-error-state.png', 
        fullPage: true 
      });
      throw error;
    }
  });

  test('Network and performance check', async ({ page }) => {
    console.log('🌐 Checking network and performance...');
    
    // Monitor network requests
    const requests = [];
    const responses = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    });

    await page.goto(baseURL, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3000);

    console.log(`Network activity: ${requests.length} requests, ${responses.length} responses`);
    
    // Check for failed requests
    const failedRequests = responses.filter(r => r.status >= 400);
    console.log(`Failed requests: ${failedRequests.length}`);
    
    if (failedRequests.length > 0) {
      console.log('Failed requests:', failedRequests);
    }

    // Check console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a bit more for any delayed errors
    await page.waitForTimeout(2000);
    
    console.log(`Console errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Console errors found:', errors.slice(0, 5)); // Show first 5
    }

    // Basic performance check
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });

    console.log('Performance metrics:', performanceMetrics);
    console.log('✅ Network and performance check complete');
  });
});