import { test, expect } from '@playwright/test';

/**
 * AI Predictive Maintenance Engine Workflow Test
 * 
 * This test follows the EXACT user workflow specified:
 * 1. Navigate to http://10.0.0.109:3000/
 * 2. Find the "AI Predictive Maintenance Engine Architecture" card
 * 3. Click specifically the "Documentation" button
 * 4. Verify it goes to http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture
 * 5. Take screenshots and verify content loading
 * 6. Check for README content and links
 * 7. Click on Demo/Implementation Guide links in README content
 * 8. Report any 404 errors or broken navigation
 */

// Use the exact IP address specified
const BASE_URL = 'http://10.0.0.109:3000';

test.describe('AI Predictive Maintenance Engine Architecture Workflow', () => {

  test.beforeEach(async ({ page }) => {
    // Set up console error logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console Error: ${msg.text()}`);
      }
    });

    // Set up response error logging
    page.on('response', response => {
      if (!response.ok()) {
        console.log(`HTTP Error: ${response.status()} - ${response.url()}`);
      }
    });
  });

  test('Complete AI Predictive Maintenance Engine Documentation Workflow', async ({ page }) => {
    console.log('🚀 Starting AI Predictive Maintenance Engine workflow test');

    // Step 1: Navigate to homepage
    console.log('📍 Step 1: Navigating to homepage');
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({
      path: 'e2e/screenshots/01-homepage-loaded.png',
      fullPage: true
    });
    console.log('✅ Homepage loaded and screenshot taken');

    // Step 2: Find the AI Predictive Maintenance Engine Architecture card
    console.log('📍 Step 2: Looking for AI Predictive Maintenance Engine Architecture card');
    
    // Wait for repositories to load
    await page.waitForSelector('[data-testid="repository-card"], .repository-card, [class*="card"]', {
      timeout: 30000
    });

    // Look for the specific card by text content
    const cardSelectors = [
      `text="AI Predictive Maintenance Engine Architecture"`,
      `[aria-label*="AI Predictive Maintenance Engine"]`,
      `[title*="AI Predictive Maintenance Engine"]`,
      `//*[contains(text(), "AI Predictive Maintenance Engine Architecture")]`,
      `//h3[contains(text(), "AI Predictive Maintenance Engine")]`,
      `//h2[contains(text(), "AI Predictive Maintenance Engine")]`,
      `//div[contains(text(), "AI Predictive Maintenance Engine")]`,
    ];

    let cardFound = false;
    let cardElement = null;

    for (const selector of cardSelectors) {
      try {
        cardElement = await page.locator(selector).first();
        if (await cardElement.count() > 0) {
          console.log(`✅ Found card using selector: ${selector}`);
          cardFound = true;
          break;
        }
      } catch (error) {
        console.log(`❌ Selector failed: ${selector}`);
      }
    }

    if (!cardFound) {
      // Take debug screenshot to see what's available
      await page.screenshot({
        path: 'e2e/screenshots/02-debug-no-card-found.png',
        fullPage: true
      });

      // List all available cards/text content
      const allText = await page.textContent('body');
      console.log('🔍 Available text content on page:', allText?.substring(0, 1000));
      
      // Look for any card-like elements
      const cards = await page.locator('[data-testid*="card"], .card, [class*="card"]').all();
      console.log(`🔍 Found ${cards.length} card-like elements`);
      
      for (let i = 0; i < Math.min(cards.length, 5); i++) {
        const cardText = await cards[i].textContent();
        console.log(`Card ${i}: ${cardText?.substring(0, 100)}`);
      }

      throw new Error('❌ Could not find AI Predictive Maintenance Engine Architecture card');
    }

    // Step 3: Find and click the Documentation button specifically
    console.log('📍 Step 3: Looking for Documentation button on the card');
    
    // Get the parent container of the card
    const cardContainer = cardElement.locator('xpath=ancestor::*[contains(@class, "card") or contains(@data-testid, "card")][1]');
    
    // Look for Documentation button within the card
    const docButtonSelectors = [
      `button:has-text("Documentation")`,
      `a:has-text("Documentation")`,
      `[data-testid="documentation-button"]`,
      `[aria-label*="Documentation"]`,
      `//button[contains(text(), "Documentation")]`,
      `//a[contains(text(), "Documentation")]`,
    ];

    let docButton = null;
    for (const selector of docButtonSelectors) {
      try {
        const buttons = await cardContainer.locator(selector).or(page.locator(selector)).all();
        if (buttons.length > 0) {
          docButton = buttons[0];
          console.log(`✅ Found Documentation button using: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`❌ Documentation button selector failed: ${selector}`);
      }
    }

    if (!docButton) {
      // Take debug screenshot
      await page.screenshot({
        path: 'e2e/screenshots/03-debug-no-doc-button.png',
        fullPage: true
      });
      
      // Try to find all buttons on the card
      const allButtons = await cardContainer.locator('button, a').all();
      console.log(`🔍 Found ${allButtons.length} buttons/links on the card`);
      
      for (let i = 0; i < allButtons.length; i++) {
        const buttonText = await allButtons[i].textContent();
        console.log(`Button ${i}: ${buttonText}`);
      }

      throw new Error('❌ Could not find Documentation button on the card');
    }

    // Take screenshot before clicking
    await page.screenshot({
      path: 'e2e/screenshots/04-before-doc-button-click.png',
      fullPage: true
    });

    // Click the Documentation button
    console.log('🖱️ Clicking Documentation button');
    await docButton.click();
    
    // Step 4: Verify navigation to correct URL
    console.log('📍 Step 4: Verifying navigation to documentation page');
    
    const expectedUrl = `${BASE_URL}/docs/ai-predictive-maintenance-engine-architecture`;
    await page.waitForURL(expectedUrl, { timeout: 10000 });
    
    const currentUrl = page.url();
    console.log(`✅ Navigated to: ${currentUrl}`);
    expect(currentUrl).toBe(expectedUrl);

    // Step 5: Take screenshot of loaded page
    console.log('📍 Step 5: Taking screenshot of documentation page');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'e2e/screenshots/05-documentation-page-loaded.png',
      fullPage: true
    });

    // Step 6: Check if README content is displayed
    console.log('📍 Step 6: Checking for README content');
    
    const readmeSelectors = [
      '[data-testid="readme-content"]',
      '[class*="readme"]',
      '[class*="markdown"]',
      '.markdown-content',
      '.document-content',
      'article',
      '[role="main"]',
      'main'
    ];

    let readmeContent = null;
    for (const selector of readmeSelectors) {
      try {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          readmeContent = element.first();
          console.log(`✅ Found README content using: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`❌ README selector failed: ${selector}`);
      }
    }

    if (!readmeContent) {
      await page.screenshot({
        path: 'e2e/screenshots/06-debug-no-readme.png',
        fullPage: true
      });
      console.log('⚠️ No README content found, but continuing...');
    } else {
      const readmeText = await readmeContent.textContent();
      console.log(`✅ README content found (${readmeText?.length} characters)`);
    }

    // Step 7: Look for Demo and Implementation Guide links within README content
    console.log('📍 Step 7: Looking for Demo and Implementation Guide links in README');
    
    const contentArea = readmeContent || page.locator('body');
    
    const linkSelectors = [
      `a:has-text("Demo")`,
      `a:has-text("demo")`,
      `a:has-text("Implementation Guide")`,
      `a:has-text("Implementation")`,
      `a:has-text("Guide")`,
      `a[href*="demo"]`,
      `a[href*="implementation"]`,
      `a[href*="guide"]`,
      `//a[contains(text(), "Demo")]`,
      `//a[contains(text(), "demo")]`,
      `//a[contains(text(), "Implementation")]`,
      `//a[contains(text(), "Guide")]`,
    ];

    const foundLinks = [];
    for (const selector of linkSelectors) {
      try {
        const links = await contentArea.locator(selector).all();
        for (const link of links) {
          const href = await link.getAttribute('href');
          const text = await link.textContent();
          if (href && text) {
            foundLinks.push({ element: link, href, text: text.trim() });
          }
        }
      } catch (error) {
        console.log(`❌ Link selector failed: ${selector}`);
      }
    }

    console.log(`🔍 Found ${foundLinks.length} potential Demo/Implementation links`);
    
    if (foundLinks.length === 0) {
      // Take screenshot showing available content
      await page.screenshot({
        path: 'e2e/screenshots/07-no-demo-links-found.png',
        fullPage: true
      });
      
      // List all available links
      const allLinks = await page.locator('a[href]').all();
      console.log(`🔍 All available links on page (${allLinks.length} total):`);
      for (let i = 0; i < Math.min(allLinks.length, 10); i++) {
        const href = await allLinks[i].getAttribute('href');
        const text = await allLinks[i].textContent();
        console.log(`Link ${i}: "${text?.trim()}" -> ${href}`);
      }
      
      console.log('⚠️ No Demo/Implementation links found in README content');
    }

    // Step 8: Click on Demo/Implementation links and screenshot results
    console.log('📍 Step 8: Testing Demo/Implementation links');
    
    const testedLinks = [];
    for (let i = 0; i < foundLinks.length; i++) {
      const { element, href, text } = foundLinks[i];
      
      try {
        console.log(`🖱️ Testing link ${i + 1}: "${text}" -> ${href}`);
        
        // Take screenshot before clicking
        await page.screenshot({
          path: `e2e/screenshots/08-before-link-${i + 1}-click.png`,
          fullPage: true
        });

        // Click the link
        await element.click();
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        
        const newUrl = page.url();
        const response = await page.goto(newUrl);
        const status = response?.status() || 0;
        
        console.log(`📍 Clicked link "${text}": ${newUrl} (Status: ${status})`);
        
        // Take screenshot of result
        await page.screenshot({
          path: `e2e/screenshots/09-after-link-${i + 1}-click.png`,
          fullPage: true
        });
        
        testedLinks.push({
          text,
          href,
          finalUrl: newUrl,
          status,
          is404: status === 404,
          working: status >= 200 && status < 400
        });
        
        // Check for 404 or error content
        const pageContent = await page.textContent('body');
        const has404Content = pageContent?.toLowerCase().includes('404') || 
                             pageContent?.toLowerCase().includes('not found') ||
                             pageContent?.toLowerCase().includes('page not found');
        
        if (has404Content || status === 404) {
          console.log(`❌ BROKEN LINK DETECTED: "${text}" -> ${href} (Status: ${status})`);
          testedLinks[testedLinks.length - 1].is404 = true;
          testedLinks[testedLinks.length - 1].working = false;
        }
        
        // Go back to documentation page for next test
        if (i < foundLinks.length - 1) {
          await page.goBack();
          await page.waitForLoadState('networkidle');
        }
        
      } catch (error) {
        console.log(`❌ Error testing link "${text}": ${error.message}`);
        testedLinks.push({
          text,
          href,
          finalUrl: 'ERROR',
          status: 0,
          is404: true,
          working: false,
          error: error.message
        });
      }
    }

    // Generate comprehensive report
    console.log('\n📊 COMPREHENSIVE TEST REPORT');
    console.log('================================');
    console.log(`✅ Successfully navigated to: ${expectedUrl}`);
    console.log(`📄 README Content: ${readmeContent ? 'Found' : 'Not Found'}`);
    console.log(`🔗 Links Found: ${foundLinks.length}`);
    console.log(`🧪 Links Tested: ${testedLinks.length}`);
    
    const workingLinks = testedLinks.filter(link => link.working);
    const brokenLinks = testedLinks.filter(link => !link.working);
    
    console.log(`✅ Working Links: ${workingLinks.length}`);
    console.log(`❌ Broken Links: ${brokenLinks.length}`);
    
    if (brokenLinks.length > 0) {
      console.log('\n❌ BROKEN LINKS DETECTED:');
      brokenLinks.forEach((link, index) => {
        console.log(`${index + 1}. "${link.text}" -> ${link.href}`);
        console.log(`   Status: ${link.status}, Final URL: ${link.finalUrl}`);
        if (link.error) {
          console.log(`   Error: ${link.error}`);
        }
      });
    }
    
    if (workingLinks.length > 0) {
      console.log('\n✅ WORKING LINKS:');
      workingLinks.forEach((link, index) => {
        console.log(`${index + 1}. "${link.text}" -> ${link.href} (Status: ${link.status})`);
      });
    }

    // Final screenshot
    await page.screenshot({
      path: 'e2e/screenshots/10-final-test-complete.png',
      fullPage: true
    });

    console.log('\n🏁 Test completed successfully!');
    console.log('📁 Screenshots saved to e2e/screenshots/');
    
    // Assertions for test validation
    expect(currentUrl).toBe(expectedUrl);
    if (brokenLinks.length > 0) {
      console.log(`⚠️ Warning: ${brokenLinks.length} broken links detected`);
      // Note: We're not failing the test for broken links, just reporting them
    }
  });

  test('Simple Direct URL Test - Coming Soon Path', async ({ page }) => {
    console.log('🚀 Testing direct coming-soon URL navigation');
    
    const directUrl = `${BASE_URL}/coming-soon/docs/ai-predictive-maintenance-engine-architecture/`;
    
    try {
      console.log(`📍 Navigating directly to: ${directUrl}`);
      const response = await page.goto(directUrl);
      const status = response?.status() || 0;
      
      console.log(`📊 Response Status: ${status}`);
      
      await page.waitForLoadState('networkidle');
      
      // Take screenshot
      await page.screenshot({
        path: 'e2e/screenshots/direct-url-test.png',
        fullPage: true
      });
      
      const currentUrl = page.url();
      console.log(`📍 Final URL: ${currentUrl}`);
      
      // Check if page loaded successfully
      const pageContent = await page.textContent('body');
      const has404 = pageContent?.toLowerCase().includes('404') || 
                    pageContent?.toLowerCase().includes('not found');
      
      if (has404 || status === 404) {
        console.log(`❌ Direct URL test failed: 404 or Not Found`);
        expect(status).not.toBe(404);
      } else {
        console.log(`✅ Direct URL test passed: Status ${status}`);
        expect(status).toBeGreaterThanOrEqual(200);
        expect(status).toBeLessThan(400);
      }
      
    } catch (error) {
      console.log(`❌ Direct URL test error: ${error.message}`);
      
      // Take error screenshot
      await page.screenshot({
        path: 'e2e/screenshots/direct-url-error.png',
        fullPage: true
      });
      
      throw error;
    }
  });
});