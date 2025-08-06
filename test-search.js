const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('1. Navigating to homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Test search functionality
    console.log('2. Looking for search button...');
    
    // Try different selectors for search
    const searchSelectors = [
      'button[aria-label*="search"]',
      'button[title*="search"]',
      'button:has(svg[class*="search"])',
      'button:contains("Search")',
      'button:contains("⌘K")',
      '[data-testid="search-button"]',
      'button'
    ];
    
    let searchButton = null;
    for (const selector of searchSelectors) {
      try {
        searchButton = await page.$(selector);
        if (searchButton) {
          const text = await page.evaluate(el => el.textContent, searchButton);
          if (text && (text.includes('Search') || text.includes('⌘K'))) {
            console.log(`Found search button with selector: ${selector}`);
            break;
          }
        }
      } catch (e) {
        // Continue trying other selectors
      }
    }
    
    if (searchButton) {
      console.log('Clicking search button...');
      await searchButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Look for search modal or input
      const searchInput = await page.$('input[type="search"], input[placeholder*="search" i], input[placeholder*="Search" i]');
      if (searchInput) {
        console.log('Found search input, typing query...');
        await searchInput.type('cloudtwin');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check for search results
        const results = await page.$$('[data-testid*="search-result"], [class*="search-result"]');
        console.log(`Found ${results.length} search results`);
        
        // Press Escape to close search
        await page.keyboard.press('Escape');
      }
    } else {
      console.log('Search button not found, trying keyboard shortcut...');
      
      // Try Cmd+K shortcut
      await page.keyboard.down('Meta');
      await page.keyboard.press('k');
      await page.keyboard.up('Meta');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Look for search modal
      const searchModal = await page.$('[role="dialog"], [class*="modal"], [class*="search"]');
      if (searchModal) {
        console.log('Search modal opened via keyboard shortcut');
        
        const searchInput = await page.$('input[type="search"], input[type="text"]');
        if (searchInput) {
          console.log('Found search input in modal, typing query...');
          await searchInput.type('api');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    console.log('Search test completed!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();