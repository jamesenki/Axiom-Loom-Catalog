const { chromium } = require('playwright');

async function testDocumentationButton() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('1. Navigating to http://10.0.0.109:3000');
    await page.goto('http://10.0.0.109:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('2. Looking for AI Predictive Maintenance Engine Architecture card');
    
    // Wait for the page to load and find the specific card
    const cardSelector = '[data-testid*="ai-predictive-maintenance"], [data-testid*="predictive-maintenance"], text=AI Predictive Maintenance Engine Architecture';
    
    // First, let's see what cards are available
    console.log('Scanning for available cards...');
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Look for cards containing "AI Predictive Maintenance"
    const cards = await page.locator('text=AI Predictive Maintenance').first();
    
    if (await cards.count() === 0) {
      console.log('Could not find AI Predictive Maintenance card, looking for all cards...');
      const allCards = await page.locator('[data-testid*="card"], .card, [class*="card"]').count();
      console.log(`Found ${allCards} potential cards on page`);
      
      // Take screenshot of the page to see what's available
      await page.screenshot({ path: 'page-overview.png', fullPage: true });
      console.log('Screenshot saved as page-overview.png');
    }
    
    // Look for the Documentation button on the AI Predictive Maintenance card
    console.log('3. Looking for Documentation button on AI Predictive Maintenance card');
    
    // Try different selectors to find the documentation button
    const docButtonSelectors = [
      'text=AI Predictive Maintenance >> .. >> text=Documentation',
      '[data-testid*="documentation-button"]',
      'button:has-text("Documentation")',
      'a:has-text("Documentation")'
    ];
    
    let docButton = null;
    for (const selector of docButtonSelectors) {
      try {
        docButton = page.locator(selector).first();
        if (await docButton.count() > 0) {
          console.log(`Found Documentation button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!docButton || await docButton.count() === 0) {
      console.log('Could not find Documentation button, taking screenshot of current page');
      await page.screenshot({ path: 'no-doc-button-found.png', fullPage: true });
      throw new Error('Documentation button not found');
    }
    
    console.log('4. Clicking ONLY the Documentation button');
    await docButton.click();
    
    // Wait for navigation or content to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Give it a moment to fully render
    
    console.log('5. Taking screenshot of what loads');
    await page.screenshot({ path: 'documentation-result.png', fullPage: true });
    
    // Analyze what's on the page
    const pageTitle = await page.title();
    const pageUrl = page.url();
    const bodyText = await page.locator('body').textContent();
    
    console.log('\n=== RESULTS ===');
    console.log(`Page URL: ${pageUrl}`);
    console.log(`Page Title: ${pageTitle}`);
    console.log(`Body text preview (first 500 chars): ${bodyText.substring(0, 500)}...`);
    
    // Check for specific content types
    const hasReadmeContent = bodyText.toLowerCase().includes('readme') || bodyText.toLowerCase().includes('# ');
    const hasComingSoon = bodyText.toLowerCase().includes('coming soon');
    const hasError404 = bodyText.toLowerCase().includes('404') || bodyText.toLowerCase().includes('not found');
    const isBlankPage = bodyText.trim().length < 50;
    
    let resultType = 'e) Something else';
    if (hasReadmeContent) {
      resultType = 'a) A page showing README.md content from the repository';
    } else if (hasComingSoon) {
      resultType = 'b) A "Coming Soon" page';
    } else if (hasError404) {
      resultType = 'c) A 404 error';
    } else if (isBlankPage) {
      resultType = 'd) A blank page';
    }
    
    console.log(`\nANALYSIS: ${resultType}`);
    console.log('Screenshot saved as: documentation-result.png');
    
  } catch (error) {
    console.error('Error during test:', error.message);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    console.log('Error screenshot saved as: error-screenshot.png');
  } finally {
    await browser.close();
  }
}

testDocumentationButton();