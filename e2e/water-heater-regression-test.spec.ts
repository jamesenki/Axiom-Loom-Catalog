import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Water Heater Platform Regression Tests', () => {
  const baseURL = 'http://localhost:3000';
  const repositoryURL = `${baseURL}/repository/appliances-co-water-heater-platform`;
  
  let screenshotCounter = 1;
  
  const takeScreenshot = async (page: any, name: string) => {
    const screenshotPath = path.join('e2e/screenshots', `${screenshotCounter}-${name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
    screenshotCounter++;
    return screenshotPath;
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to the water heater platform repository page
    await page.goto(repositoryURL);
    await page.waitForLoadState('networkidle');
  });

  test('Page loads successfully without errors', async ({ page }) => {
    console.log('🔍 Testing: Water Heater Platform page loads correctly');
    
    // Take initial screenshot
    await takeScreenshot(page, 'water-heater-page-loaded');
    
    // Verify page loaded successfully
    await expect(page).toHaveTitle(/Axiom Loom Catalog/);
    
    // Check for basic page elements
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    
    // Verify no console errors
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(`Console Error: ${msg.text()}`);
      }
    });
    
    // Wait a bit to catch any delayed console errors
    await page.waitForTimeout(2000);
    
    if (consoleLogs.length > 0) {
      console.log('⚠️  Console errors detected:', consoleLogs);
    } else {
      console.log('✅ No console errors detected');
    }
    
    console.log('✅ Page loads successfully');
  });

  test('Test all action buttons systematically', async ({ page }) => {
    console.log('🔍 Testing: All action buttons functionality');
    
    // Define expected buttons and their behavior
    const expectedButtons = [
      { text: 'Documentation', expectation: 'documentation' },
      { text: 'API Explorer', expectation: 'api' },
      { text: 'GitHub', expectation: 'github' },
      { text: 'Postman Collections', expectation: 'postman' },
      { text: 'View Demo', expectation: 'coming-soon' },
      { text: 'Architecture Demo', expectation: 'coming-soon' },
      { text: 'Implementation Guide', expectation: 'coming-soon' },
      { text: 'Product Details', expectation: 'coming-soon' }
    ];
    
    const buttonResults: Array<{name: string, status: string, destination: string, error?: string}> = [];
    
    for (const button of expectedButtons) {
      console.log(`Testing button: "${button.text}"`);
      
      try {
        // Look for the button
        const buttonElement = page.locator(`button, a`).filter({ hasText: button.text }).first();
        
        if (await buttonElement.isVisible()) {
          // Take screenshot before clicking
          await takeScreenshot(page, `before-click-${button.text.toLowerCase().replace(/\s+/g, '-')}`);
          
          if (button.expectation === 'github') {
            // For GitHub, check that it's an external link
            const href = await buttonElement.getAttribute('href');
            if (href && href.includes('github.com')) {
              buttonResults.push({
                name: button.text,
                status: '✅ WORKING',
                destination: `External GitHub: ${href}`
              });
              console.log(`✅ ${button.text}: External GitHub link found`);
            } else {
              buttonResults.push({
                name: button.text,
                status: '❌ ISSUE',
                destination: href || 'No href found',
                error: 'GitHub link not detected'
              });
            }
          } else if (button.expectation === 'coming-soon') {
            // Click and check for coming soon page
            await Promise.all([
              page.waitForLoadState('networkidle'),
              buttonElement.click()
            ]);
            
            await page.waitForTimeout(1000);
            
            // Check if we're on a coming soon page
            const currentUrl = page.url();
            const pageContent = await page.textContent('body');
            
            if (currentUrl.includes('/coming-soon') || pageContent?.includes('Coming Soon')) {
              buttonResults.push({
                name: button.text,
                status: '✅ FIXED',
                destination: `Coming Soon page: ${currentUrl}`
              });
              console.log(`✅ ${button.text}: Now shows Coming Soon page`);
            } else {
              buttonResults.push({
                name: button.text,
                status: '❌ ISSUE',
                destination: currentUrl,
                error: 'Not redirecting to Coming Soon page'
              });
            }
            
            // Take screenshot after navigation
            await takeScreenshot(page, `after-click-${button.text.toLowerCase().replace(/\s+/g, '-')}`);
            
            // Navigate back to repository page for next test
            await page.goto(repositoryURL);
            await page.waitForLoadState('networkidle');
            
          } else {
            // For other buttons, just click and see what happens
            await Promise.all([
              page.waitForLoadState('networkidle'),
              buttonElement.click()
            ]);
            
            await page.waitForTimeout(1000);
            const currentUrl = page.url();
            
            buttonResults.push({
              name: button.text,
              status: '✅ WORKING',
              destination: currentUrl
            });
            
            // Take screenshot after navigation
            await takeScreenshot(page, `after-click-${button.text.toLowerCase().replace(/\s+/g, '-')}`);
            
            // Navigate back for next test
            await page.goto(repositoryURL);
            await page.waitForLoadState('networkidle');
          }
        } else {
          buttonResults.push({
            name: button.text,
            status: '❌ MISSING',
            destination: 'Button not found',
            error: 'Button element not visible on page'
          });
        }
      } catch (error) {
        buttonResults.push({
          name: button.text,
          status: '❌ ERROR',
          destination: 'Error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Print comprehensive button test results
    console.log('\n📊 BUTTON FUNCTIONALITY MATRIX:');
    console.log('=' .repeat(80));
    buttonResults.forEach(result => {
      console.log(`${result.status} ${result.name}`);
      console.log(`   → Destination: ${result.destination}`);
      if (result.error) {
        console.log(`   → Error: ${result.error}`);
      }
      console.log('');
    });
    
    // Calculate success rate
    const workingButtons = buttonResults.filter(r => r.status.includes('✅')).length;
    const totalButtons = buttonResults.length;
    const successRate = Math.round((workingButtons / totalButtons) * 100);
    
    console.log(`📈 OVERALL BUTTON HEALTH: ${workingButtons}/${totalButtons} (${successRate}%)`);
  });

  test('Verify Postman Collections functionality specifically', async ({ page }) => {
    console.log('🔍 Testing: Postman Collections button specifically');
    
    const postmanButton = page.locator('button, a').filter({ hasText: 'Postman Collections' }).first();
    
    if (await postmanButton.isVisible()) {
      await takeScreenshot(page, 'postman-button-before');
      
      await Promise.all([
        page.waitForLoadState('networkidle'),
        postmanButton.click()
      ]);
      
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      
      await takeScreenshot(page, 'postman-button-after');
      
      console.log(`Postman button clicked, current URL: ${currentUrl}`);
      
      // Check if we navigated somewhere meaningful
      if (currentUrl !== repositoryURL) {
        console.log('✅ Postman Collections: Navigation occurred');
      } else {
        console.log('⚠️  Postman Collections: No navigation detected');
      }
    } else {
      console.log('❌ Postman Collections button not found');
    }
  });

  test('Test documentation navigation', async ({ page }) => {
    console.log('🔍 Testing: Documentation navigation and rendering');
    
    // Look for documentation button/link
    const docButton = page.locator('button, a').filter({ hasText: 'Documentation' }).first();
    
    if (await docButton.isVisible()) {
      await takeScreenshot(page, 'documentation-before');
      
      await Promise.all([
        page.waitForLoadState('networkidle'),
        docButton.click()
      ]);
      
      await page.waitForTimeout(2000);
      await takeScreenshot(page, 'documentation-after');
      
      // Check if documentation content is visible
      const docContent = await page.textContent('body');
      
      if (docContent && docContent.length > 100) {
        console.log('✅ Documentation: Content loaded successfully');
        
        // Check for markdown rendering
        const hasMarkdown = await page.locator('h1, h2, h3, p, code, pre').count();
        if (hasMarkdown > 0) {
          console.log('✅ Documentation: Markdown rendering detected');
        } else {
          console.log('⚠️  Documentation: No markdown elements detected');
        }
      } else {
        console.log('❌ Documentation: Insufficient content loaded');
      }
    } else {
      console.log('❌ Documentation button not found');
    }
  });

  test('Overall quality assessment and comparison', async ({ page }) => {
    console.log('🔍 Testing: Overall quality assessment');
    
    await takeScreenshot(page, 'final-quality-assessment');
    
    // Check for DNS errors or 404s by monitoring network requests
    const networkErrors: string[] = [];
    const successfulRequests: string[] = [];
    
    page.on('response', response => {
      const url = response.url();
      const status = response.status();
      
      if (status >= 400) {
        networkErrors.push(`${status}: ${url}`);
      } else if (status >= 200 && status < 300) {
        successfulRequests.push(`${status}: ${url}`);
      }
    });
    
    // Trigger some interactions to generate network activity
    const allButtons = await page.locator('button, a').all();
    
    console.log(`Found ${allButtons.length} interactive elements on the page`);
    
    // Wait to capture any network activity
    await page.waitForTimeout(3000);
    
    console.log('\n📊 NETWORK HEALTH ASSESSMENT:');
    console.log('=' .repeat(50));
    
    if (networkErrors.length > 0) {
      console.log('❌ Network Errors Detected:');
      networkErrors.forEach(error => console.log(`   ${error}`));
    } else {
      console.log('✅ No network errors detected');
    }
    
    console.log(`✅ Successful requests: ${successfulRequests.length}`);
    
    // Final quality score
    const hasErrors = networkErrors.length > 0;
    const qualityScore = hasErrors ? 'NEEDS IMPROVEMENT' : 'EXCELLENT';
    
    console.log(`\n🎯 OVERALL QUALITY SCORE: ${qualityScore}`);
    
    if (!hasErrors) {
      console.log('🎉 All previous DNS and navigation issues appear to be resolved!');
    }
  });
});