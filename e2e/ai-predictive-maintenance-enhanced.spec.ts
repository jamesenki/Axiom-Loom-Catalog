import { test, expect } from '@playwright/test';

/**
 * Enhanced AI Predictive Maintenance Engine Workflow Test
 * 
 * This enhanced version includes:
 * - Better error handling and debugging
 * - Multiple fallback strategies for finding elements
 * - Comprehensive logging and reporting
 * - Network request monitoring
 * - Console error tracking
 */

const BASE_URL = 'http://10.0.0.109:3000';

test.describe('Enhanced AI Predictive Maintenance Engine Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Enhanced logging setup
    const errors: string[] = [];
    const networkRequests: Array<{ url: string; status: number; method: string }> = [];

    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        console.log(`🔴 Console Error: ${text}`);
        errors.push(text);
      } else if (msg.type() === 'warn') {
        console.log(`🟡 Console Warning: ${text}`);
      }
    });

    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        status: 0,
        method: request.method()
      });
    });

    page.on('response', response => {
      const request = networkRequests.find(r => r.url === response.url());
      if (request) {
        request.status = response.status();
      }
      
      if (!response.ok()) {
        console.log(`🔴 HTTP Error: ${response.status()} - ${response.url()}`);
      }
    });

    // Store errors and requests for test access
    (page as any).testErrors = errors;
    (page as any).networkRequests = networkRequests;
  });

  test('Enhanced Workflow Test with Comprehensive Debugging', async ({ page }) => {
    console.log('\n🚀 ENHANCED AI PREDICTIVE MAINTENANCE ENGINE TEST');
    console.log('=================================================');
    console.log(`🌐 Target URL: ${BASE_URL}`);
    
    try {
      // PHASE 1: Homepage Navigation with Network Analysis
      console.log('\n📍 PHASE 1: Homepage Navigation');
      console.log('--------------------------------');
      
      const startTime = Date.now();
      const response = await page.goto(BASE_URL, { 
        waitUntil: 'networkidle',
        timeout: 60000 
      });
      const loadTime = Date.now() - startTime;
      
      console.log(`⏱️ Page load time: ${loadTime}ms`);
      console.log(`📊 Response status: ${response?.status()}`);
      
      if (!response?.ok()) {
        throw new Error(`Failed to load homepage: ${response?.status()}`);
      }

      // Wait for React app to hydrate
      await page.waitForFunction(
        () => window.React || document.querySelector('[data-testid]') || document.querySelector('.App'),
        { timeout: 30000 }
      );

      // Take initial screenshot with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await page.screenshot({
        path: `e2e/screenshots/enhanced-01-homepage-${timestamp}.png`,
        fullPage: true
      });

      // PHASE 2: Repository Discovery with Multiple Strategies  
      console.log('\n📍 PHASE 2: Repository Discovery');
      console.log('--------------------------------');
      
      // Strategy 1: Wait for any content to load
      await page.waitForSelector('body *', { timeout: 30000 });
      
      // Strategy 2: Look for common repository container patterns
      const containerSelectors = [
        '[data-testid="repository-list"]',
        '[data-testid="repository-grid"]', 
        '.repository-container',
        '.repository-list',
        '.repository-grid',
        '[class*="repository"]',
        '[role="main"]',
        'main',
        '.content'
      ];

      let repositoryContainer = null;
      for (const selector of containerSelectors) {
        try {
          const element = page.locator(selector);
          if (await element.count() > 0) {
            repositoryContainer = element;
            console.log(`✅ Found repository container: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      // Strategy 3: Get all text content for analysis
      const pageText = await page.textContent('body');
      console.log(`📄 Page content length: ${pageText?.length} characters`);
      
      // Look for AI Predictive Maintenance in the text
      const hasTargetContent = pageText?.includes('AI Predictive Maintenance Engine Architecture') || 
                              pageText?.includes('Predictive Maintenance') ||
                              pageText?.includes('AI Predictive');
      
      console.log(`🔍 Target content found in page: ${hasTargetContent}`);

      if (!hasTargetContent) {
        console.log('⚠️ Target content not found. Analyzing page structure...');
        
        // Debug: Find all headings
        const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
        console.log('📋 Available headings:', headings.slice(0, 10));
        
        // Debug: Find all cards or containers
        const cards = await page.locator('[class*="card"], [data-testid*="card"], .card').allTextContents();
        console.log('🃏 Available cards:', cards.slice(0, 10));
      }

      // PHASE 3: Advanced Element Discovery
      console.log('\n📍 PHASE 3: Advanced Element Discovery');
      console.log('-------------------------------------');
      
      // Multiple search strategies for the target card
      const searchStrategies = [
        // Exact text match
        { name: 'Exact Text', selector: 'text="AI Predictive Maintenance Engine Architecture"' },
        // Partial text match
        { name: 'Partial Text', selector: 'text="Predictive Maintenance"' },
        // Heading with content
        { name: 'Heading Match', selector: 'h1, h2, h3, h4, h5, h6' },
        // Any element containing the text
        { name: 'Any Element', selector: '*' },
        // Link or button containing text
        { name: 'Interactive Element', selector: 'a, button' }
      ];

      let targetElement = null;
      let successfulStrategy = null;

      for (const strategy of searchStrategies) {
        try {
          console.log(`🔍 Trying strategy: ${strategy.name}`);
          
          if (strategy.name === 'Heading Match' || strategy.name === 'Any Element' || strategy.name === 'Interactive Element') {
            const elements = await page.locator(strategy.selector).all();
            for (const element of elements) {
              const text = await element.textContent();
              if (text?.includes('AI Predictive Maintenance Engine Architecture') ||
                  text?.includes('Predictive Maintenance Engine')) {
                targetElement = element;
                successfulStrategy = strategy.name;
                break;
              }
            }
          } else {
            const element = page.locator(strategy.selector);
            if (await element.count() > 0) {
              targetElement = element;
              successfulStrategy = strategy.name;
            }
          }
          
          if (targetElement) {
            console.log(`✅ Found target using: ${strategy.name}`);
            break;
          }
        } catch (error) {
          console.log(`❌ Strategy ${strategy.name} failed: ${error.message}`);
        }
      }

      if (!targetElement) {
        // Final fallback: Take debug screenshot and list all available content
        await page.screenshot({
          path: `e2e/screenshots/enhanced-debug-no-target-${timestamp}.png`,
          fullPage: true
        });
        
        // List all available text content in chunks
        const allTextElements = await page.locator('*').allTextContents();
        console.log('\n🔍 AVAILABLE TEXT CONTENT:');
        allTextElements
          .filter(text => text && text.trim().length > 10)
          .slice(0, 20)
          .forEach((text, index) => {
            console.log(`${index + 1}. "${text.trim().substring(0, 100)}"`);
          });

        throw new Error('❌ Could not locate AI Predictive Maintenance Engine Architecture card using any strategy');
      }

      // PHASE 4: Documentation Button Discovery
      console.log('\n📍 PHASE 4: Documentation Button Discovery');
      console.log('------------------------------------------');
      
      // Find the parent card container
      const cardContainer = targetElement.locator('xpath=ancestor-or-self::*[contains(@class, "card") or contains(@class, "repository") or contains(@data-testid, "card") or contains(@data-testid, "repository")][1]');
      
      console.log('🔍 Looking for documentation button in card container...');
      
      const buttonStrategies = [
        { name: 'Exact Text Button', selector: 'button:has-text("Documentation")' },
        { name: 'Exact Text Link', selector: 'a:has-text("Documentation")' },
        { name: 'Partial Text Button', selector: 'button:has-text("Doc")' },
        { name: 'Partial Text Link', selector: 'a:has-text("Doc")' },
        { name: 'Data TestId', selector: '[data-testid*="documentation"], [data-testid*="doc"]' },
        { name: 'Aria Label', selector: '[aria-label*="Documentation"], [aria-label*="doc"]' },
        { name: 'Title Attribute', selector: '[title*="Documentation"], [title*="doc"]' }
      ];

      let documentationButton = null;
      let buttonStrategy = null;

      for (const strategy of buttonStrategies) {
        try {
          console.log(`🔍 Trying button strategy: ${strategy.name}`);
          
          // First try within card container, then globally
          let button = cardContainer.locator(strategy.selector);
          if (await button.count() === 0) {
            button = page.locator(strategy.selector);
          }
          
          if (await button.count() > 0) {
            documentationButton = button.first();
            buttonStrategy = strategy.name;
            console.log(`✅ Found documentation button using: ${strategy.name}`);
            break;
          }
        } catch (error) {
          console.log(`❌ Button strategy ${strategy.name} failed: ${error.message}`);
        }
      }

      if (!documentationButton) {
        // Debug: List all buttons and links in the card
        console.log('\n🔍 DEBUGGING: Available buttons and links in card:');
        const allButtons = await cardContainer.locator('button, a').all();
        for (let i = 0; i < allButtons.length; i++) {
          const text = await allButtons[i].textContent();
          const href = await allButtons[i].getAttribute('href');
          console.log(`${i + 1}. "${text?.trim()}" ${href ? `-> ${href}` : '(button)'}`);
        }

        throw new Error('❌ Could not find Documentation button');
      }

      // PHASE 5: Navigation Test
      console.log('\n📍 PHASE 5: Navigation Test');
      console.log('---------------------------');
      
      // Take screenshot before clicking
      await page.screenshot({
        path: `e2e/screenshots/enhanced-02-before-click-${timestamp}.png`,
        fullPage: true
      });

      console.log(`🖱️ Clicking documentation button (Strategy: ${buttonStrategy})`);
      
      // Get href if it's a link
      const href = await documentationButton.getAttribute('href');
      if (href) {
        console.log(`🔗 Button href: ${href}`);
      }

      await documentationButton.click();
      
      // Wait for navigation with extended timeout
      const expectedUrl = `${BASE_URL}/docs/ai-predictive-maintenance-engine-architecture`;
      try {
        await page.waitForURL(expectedUrl, { timeout: 30000 });
        console.log(`✅ Successfully navigated to: ${expectedUrl}`);
      } catch (error) {
        console.log(`⚠️ Navigation timeout. Current URL: ${page.url()}`);
        
        // Check if we're on a different but valid documentation URL
        const currentUrl = page.url();
        if (currentUrl.includes('/docs/') && currentUrl.includes('predictive-maintenance')) {
          console.log('✅ Navigated to alternative documentation URL');
        } else {
          throw new Error(`❌ Navigation failed. Expected: ${expectedUrl}, Got: ${currentUrl}`);
        }
      }

      await page.waitForLoadState('networkidle');

      // PHASE 6: Content Analysis
      console.log('\n📍 PHASE 6: Content Analysis');
      console.log('----------------------------');
      
      const finalUrl = page.url();
      console.log(`📍 Final URL: ${finalUrl}`);

      // Take screenshot of documentation page
      await page.screenshot({
        path: `e2e/screenshots/enhanced-03-documentation-${timestamp}.png`,
        fullPage: true
      });

      // Analyze page content
      const documentationContent = await page.textContent('body');
      console.log(`📄 Documentation content length: ${documentationContent?.length} characters`);

      // Look for README indicators
      const hasReadmeContent = documentationContent?.includes('README') ||
                              documentationContent?.includes('# ') ||
                              documentationContent?.includes('## ') ||
                              documentationContent?.includes('### ');

      console.log(`📋 README-like content detected: ${hasReadmeContent}`);

      // PHASE 7: Link Discovery and Testing
      console.log('\n📍 PHASE 7: Link Discovery and Testing');
      console.log('-------------------------------------');
      
      // Find all links in the documentation
      const allLinks = await page.locator('a[href]').all();
      console.log(`🔗 Total links found: ${allLinks.length}`);

      const demoAndGuideLinks = [];
      for (const link of allLinks) {
        const text = await link.textContent();
        const href = await link.getAttribute('href');
        
        if (text && href && (
          text.toLowerCase().includes('demo') ||
          text.toLowerCase().includes('implementation') ||
          text.toLowerCase().includes('guide') ||
          text.toLowerCase().includes('example') ||
          href.toLowerCase().includes('demo') ||
          href.toLowerCase().includes('implementation')
        )) {
          demoAndGuideLinks.push({ element: link, text: text.trim(), href });
        }
      }

      console.log(`🎯 Demo/Implementation links found: ${demoAndGuideLinks.length}`);

      // Test each relevant link
      const linkTestResults = [];
      for (let i = 0; i < demoAndGuideLinks.length && i < 5; i++) { // Test max 5 links
        const { element, text, href } = demoAndGuideLinks[i];
        
        console.log(`\n🧪 Testing link ${i + 1}: "${text}" -> ${href}`);
        
        try {
          await element.click();
          await page.waitForLoadState('networkidle', { timeout: 15000 });
          
          const newUrl = page.url();
          const pageContent = await page.textContent('body');
          const is404 = pageContent?.toLowerCase().includes('404') ||
                       pageContent?.toLowerCase().includes('not found') ||
                       newUrl.includes('404');

          await page.screenshot({
            path: `e2e/screenshots/enhanced-04-link-${i + 1}-${timestamp}.png`,
            fullPage: true
          });

          linkTestResults.push({
            text,
            originalHref: href,
            finalUrl: newUrl,
            is404,
            working: !is404,
            contentLength: pageContent?.length || 0
          });

          console.log(`📊 Result: ${is404 ? '❌ 404/Not Found' : '✅ Working'} (${newUrl})`);

          // Go back for next test
          if (i < demoAndGuideLinks.length - 1) {
            await page.goBack();
            await page.waitForLoadState('networkidle');
          }

        } catch (error) {
          console.log(`❌ Error testing link: ${error.message}`);
          linkTestResults.push({
            text,
            originalHref: href,
            finalUrl: 'ERROR',
            is404: true,
            working: false,
            error: error.message
          });
        }
      }

      // PHASE 8: Final Report
      console.log('\n📊 COMPREHENSIVE TEST REPORT');
      console.log('=============================');
      
      const errors = (page as any).testErrors || [];
      const requests = (page as any).networkRequests || [];
      
      console.log(`🌐 Final URL: ${finalUrl}`);
      console.log(`⏱️ Total test time: ${Date.now() - startTime}ms`);
      console.log(`🔴 Console errors: ${errors.length}`);
      console.log(`🌐 Network requests: ${requests.length}`);
      console.log(`🔗 Links tested: ${linkTestResults.length}`);
      
      const workingLinks = linkTestResults.filter(l => l.working);
      const brokenLinks = linkTestResults.filter(l => !l.working);
      
      console.log(`✅ Working links: ${workingLinks.length}`);
      console.log(`❌ Broken links: ${brokenLinks.length}`);

      if (brokenLinks.length > 0) {
        console.log('\n❌ BROKEN LINKS:');
        brokenLinks.forEach((link, index) => {
          console.log(`${index + 1}. "${link.text}" -> ${link.originalHref}`);
          if (link.error) {
            console.log(`   Error: ${link.error}`);
          }
        });
      }

      if (workingLinks.length > 0) {
        console.log('\n✅ WORKING LINKS:');
        workingLinks.forEach((link, index) => {
          console.log(`${index + 1}. "${link.text}" -> ${link.originalHref}`);
        });
      }

      if (errors.length > 0) {
        console.log('\n🔴 CONSOLE ERRORS:');
        errors.slice(0, 5).forEach((error, index) => {
          console.log(`${index + 1}. ${error}`);
        });
      }

      // Network analysis
      const failedRequests = requests.filter(r => r.status >= 400);
      if (failedRequests.length > 0) {
        console.log('\n🔴 FAILED NETWORK REQUESTS:');
        failedRequests.slice(0, 5).forEach((req, index) => {
          console.log(`${index + 1}. ${req.method} ${req.url} -> ${req.status}`);
        });
      }

      // Final screenshot
      await page.screenshot({
        path: `e2e/screenshots/enhanced-05-final-${timestamp}.png`,
        fullPage: true
      });

      console.log('\n🏁 ENHANCED TEST COMPLETED SUCCESSFULLY!');
      console.log(`📁 Screenshots saved with timestamp: ${timestamp}`);

      // Test assertions
      expect(finalUrl).toContain('/docs/');
      expect(finalUrl).toContain('predictive-maintenance');

    } catch (error) {
      console.log(`\n💥 TEST FAILED: ${error.message}`);
      
      // Take error screenshot
      const errorTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await page.screenshot({
        path: `e2e/screenshots/enhanced-ERROR-${errorTimestamp}.png`,
        fullPage: true
      });
      
      throw error;
    }
  });

  test('Direct Coming Soon URL Test', async ({ page }) => {
    console.log('\n🚀 DIRECT COMING SOON URL TEST');
    console.log('==============================');
    
    const directUrl = `${BASE_URL}/coming-soon/docs/ai-predictive-maintenance-engine-architecture/`;
    console.log(`🌐 Testing URL: ${directUrl}`);
    
    try {
      const response = await page.goto(directUrl, { timeout: 30000 });
      const status = response?.status() || 0;
      
      console.log(`📊 Response status: ${status}`);
      await page.waitForLoadState('networkidle');
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await page.screenshot({
        path: `e2e/screenshots/direct-url-${timestamp}.png`,
        fullPage: true
      });
      
      const content = await page.textContent('body');
      const has404 = content?.toLowerCase().includes('404') || 
                    content?.toLowerCase().includes('not found');
      
      console.log(`📄 Content length: ${content?.length}`);
      console.log(`❓ Has 404 content: ${has404}`);
      console.log(`📍 Final URL: ${page.url()}`);
      
      if (status === 404 || has404) {
        console.log('❌ Direct URL test failed: 404 or Not Found');
        expect(status).not.toBe(404);
      } else {
        console.log('✅ Direct URL test passed');
        expect(status).toBeGreaterThanOrEqual(200);
        expect(status).toBeLessThan(400);
      }
      
    } catch (error) {
      console.log(`❌ Direct URL test error: ${error.message}`);
      throw error;
    }
  });

});