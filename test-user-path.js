const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testUserPath() {
  let browser, page;
  const screenshotsDir = path.join(__dirname, 'screenshots');
  
  // Ensure screenshots directory exists
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  try {
    console.log('🚀 Starting browser...');
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1200, height: 800 });
    
    console.log('📍 Step 1: Navigate to http://10.0.0.109:3000/');
    await page.goto('http://10.0.0.109:3000/', { waitUntil: 'networkidle' });
    
    // Take screenshot of home page
    await page.screenshot({ path: path.join(screenshotsDir, '01-homepage.png'), fullPage: true });
    console.log('✅ Screenshot saved: 01-homepage.png');
    
    // Wait a moment for any dynamic content to load
    await page.waitForTimeout(2000);
    
    console.log('🔍 Step 2: Looking for "AI Predictive Maintenance Engine Architecture" card...');
    
    // Look for the specific card - try different selectors
    const cardSelectors = [
      'text="AI Predictive Maintenance Engine Architecture"',
      '[data-testid*="predictive-maintenance"]',
      '.card:has-text("AI Predictive Maintenance")',
      '.repository-card:has-text("Predictive Maintenance")',
      'div:has-text("AI Predictive Maintenance Engine Architecture")'
    ];
    
    let cardFound = false;
    let cardElement = null;
    
    for (const selector of cardSelectors) {
      try {
        cardElement = await page.waitForSelector(selector, { timeout: 5000 });
        if (cardElement) {
          cardFound = true;
          console.log(`✅ Found card using selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Selector "${selector}" not found`);
      }
    }
    
    if (!cardFound) {
      console.log('🔍 Searching for all cards on the page...');
      const allCards = await page.$$eval('[class*="card"], [class*="Card"]', cards => 
        cards.map(card => ({
          text: card.textContent.trim(),
          classes: card.className
        }))
      );
      
      console.log('All cards found:');
      allCards.forEach((card, index) => {
        console.log(`  ${index + 1}. "${card.text.substring(0, 100)}..." (classes: ${card.classes})`);
      });
      
      // Try to find by partial text match
      for (const card of allCards) {
        if (card.text.toLowerCase().includes('predictive maintenance')) {
          console.log(`✅ Found matching card by text: "${card.text.substring(0, 100)}..."`);
          cardFound = true;
          break;
        }
      }
    }
    
    if (!cardFound) {
      console.log('❌ Could not find AI Predictive Maintenance Engine Architecture card');
      await page.screenshot({ path: path.join(screenshotsDir, '02-card-not-found.png'), fullPage: true });
      return;
    }
    
    console.log('🔍 Step 3: Looking for Documentation button on the card...');
    
    // Look for documentation button - try various selectors
    const docButtonSelectors = [
      'button:has-text("Documentation")',
      'a:has-text("Documentation")',
      '[href*="docs"]:has-text("Documentation")',
      '.card:has-text("AI Predictive Maintenance") button:has-text("Documentation")',
      '.card:has-text("AI Predictive Maintenance") a:has-text("Documentation")'
    ];
    
    let docButton = null;
    
    for (const selector of docButtonSelectors) {
      try {
        docButton = await page.waitForSelector(selector, { timeout: 5000 });
        if (docButton) {
          console.log(`✅ Found documentation button using selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Documentation button selector "${selector}" not found`);
      }
    }
    
    if (!docButton) {
      console.log('🔍 Searching for all buttons/links on the page...');
      const allButtons = await page.$$eval('button, a', buttons => 
        buttons.map(btn => ({
          text: btn.textContent.trim(),
          href: btn.href || 'N/A',
          tag: btn.tagName
        }))
      );
      
      console.log('All buttons/links found:');
      allButtons.forEach((btn, index) => {
        if (btn.text) {
          console.log(`  ${index + 1}. ${btn.tag}: "${btn.text}" (href: ${btn.href})`);
        }
      });
      
      console.log('❌ Could not find Documentation button');
      await page.screenshot({ path: path.join(screenshotsDir, '03-doc-button-not-found.png'), fullPage: true });
      return;
    }
    
    console.log('📱 Step 4: Clicking Documentation button...');
    await docButton.click();
    
    // Wait for navigation
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    console.log(`🌐 Current URL after click: ${currentUrl}`);
    
    console.log('📸 Step 5: Taking screenshot of documentation page...');
    await page.screenshot({ path: path.join(screenshotsDir, '04-documentation-page.png'), fullPage: true });
    
    // Check if we're on the expected URL
    const expectedUrl = 'http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture';
    if (currentUrl === expectedUrl) {
      console.log('✅ Successfully navigated to expected documentation URL');
    } else {
      console.log(`⚠️  Expected URL: ${expectedUrl}`);
      console.log(`⚠️  Actual URL: ${currentUrl}`);
    }
    
    console.log('🔍 Step 6: Checking for README.md content...');
    
    // Look for README content indicators
    const readmeIndicators = [
      'h1, h2, h3', // Markdown headings
      'pre code', // Code blocks
      'blockquote', // Blockquotes
      'ul li', // Lists
      '.markdown-content',
      '.readme-content',
      '[data-testid*="readme"]'
    ];
    
    let readmeContentFound = false;
    const contentElements = [];
    
    for (const selector of readmeIndicators) {
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        console.log(`✅ Found ${elements.length} ${selector} elements`);
        readmeContentFound = true;
        
        // Get text content of first few elements
        for (let i = 0; i < Math.min(3, elements.length); i++) {
          const text = await elements[i].textContent();
          contentElements.push(`${selector}: "${text.trim().substring(0, 100)}..."`);
        }
      }
    }
    
    if (readmeContentFound) {
      console.log('✅ README-like content found:');
      contentElements.forEach(content => console.log(`  - ${content}`));
    } else {
      console.log('❌ No README content indicators found');
      
      // Get all text content to see what's actually on the page
      const bodyText = await page.$eval('body', body => body.textContent.trim());
      console.log(`Page content preview: "${bodyText.substring(0, 300)}..."`);
    }
    
    console.log('🔗 Step 7: Looking for links within the content...');
    
    // Find all links on the page
    const links = await page.$$eval('a[href]', links => 
      links.map(link => ({
        text: link.textContent.trim(),
        href: link.href,
        isExternal: link.href.startsWith('http') && !link.href.includes('10.0.0.109:3000')
      }))
    );
    
    console.log(`Found ${links.length} links on the page:`);
    links.forEach((link, index) => {
      if (link.text) {
        console.log(`  ${index + 1}. "${link.text}" -> ${link.href} ${link.isExternal ? '(external)' : '(internal)'}`);
      }
    });
    
    console.log('🧪 Step 8: Testing clickable links...');
    
    const workingLinks = [];
    const brokenLinks = [];
    
    for (let i = 0; i < Math.min(5, links.length); i++) {
      const link = links[i];
      if (!link.text || link.text.length < 2) continue;
      
      try {
        console.log(`Testing link ${i + 1}: "${link.text}" -> ${link.href}`);
        
        if (link.isExternal) {
          // For external links, just check if they're clickable
          const linkElement = await page.$(`a[href="${link.href}"]`);
          if (linkElement) {
            console.log(`✅ External link is clickable: ${link.href}`);
            workingLinks.push(link);
          }
        } else {
          // For internal links, try to navigate
          await page.click(`a[href="${link.href}"]`);
          await page.waitForTimeout(2000);
          await page.waitForLoadState('networkidle');
          
          const newUrl = page.url();
          console.log(`✅ Internal link navigation successful: ${newUrl}`);
          workingLinks.push({ ...link, navigatedTo: newUrl });
          
          // Take screenshot of navigated page
          await page.screenshot({ 
            path: path.join(screenshotsDir, `05-link-${i + 1}-result.png`), 
            fullPage: true 
          });
          
          // Go back to the documentation page
          await page.goBack();
          await page.waitForTimeout(1000);
        }
      } catch (error) {
        console.log(`❌ Link failed: "${link.text}" -> ${link.href} (Error: ${error.message})`);
        brokenLinks.push({ ...link, error: error.message });
      }
    }
    
    console.log('\n📋 FINAL REPORT:');
    console.log('================');
    console.log(`✅ Successfully navigated to homepage: ✓`);
    console.log(`✅ Found AI Predictive Maintenance card: ${cardFound ? '✓' : '❌'}`);
    console.log(`✅ Found Documentation button: ${docButton ? '✓' : '❌'}`);
    console.log(`✅ Navigated to documentation page: ${currentUrl.includes('docs') ? '✓' : '❌'}`);
    console.log(`✅ README content visible: ${readmeContentFound ? '✓' : '❌'}`);
    console.log(`✅ Working links found: ${workingLinks.length}`);
    console.log(`❌ Broken links found: ${brokenLinks.length}`);
    
    if (workingLinks.length > 0) {
      console.log('\nWorking links:');
      workingLinks.forEach((link, i) => {
        console.log(`  ${i + 1}. "${link.text}" -> ${link.href}`);
      });
    }
    
    if (brokenLinks.length > 0) {
      console.log('\nBroken links:');
      brokenLinks.forEach((link, i) => {
        console.log(`  ${i + 1}. "${link.text}" -> ${link.href} (${link.error})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    if (page) {
      await page.screenshot({ path: path.join(screenshotsDir, 'error-screenshot.png'), fullPage: true });
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testUserPath();