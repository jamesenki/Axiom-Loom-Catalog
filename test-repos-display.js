const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('1. Navigating to homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'initial-state.png', fullPage: true });
    console.log('Screenshot saved as initial-state.png');
    
    // Check network logs
    page.on('response', response => {
      if (response.url().includes('/api/repositories')) {
        console.log(`API Response: ${response.status()} - ${response.url()}`);
      }
    });
    
    // Wait a bit for any API calls
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we're on login page
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // Check for any error messages
    const errorMessage = await page.$eval('body', el => {
      const error = el.querySelector('[class*="error"], [class*="Error"]');
      return error ? error.textContent : null;
    }).catch(() => null);
    
    if (errorMessage) {
      console.log('Error message found:', errorMessage);
    }
    
    // Check what content is actually on the page
    const bodyText = await page.$eval('body', el => el.innerText);
    console.log('Page content preview:', bodyText.substring(0, 500));
    
    // Check for specific elements
    const hasRepoCards = await page.$('[data-testid="repository-card"]').then(el => !!el).catch(() => false);
    const hasRepoList = await page.$('[class*="repository"], [class*="Repository"]').then(el => !!el).catch(() => false);
    const hasSearchBar = await page.$('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').then(el => !!el).catch(() => false);
    
    console.log('Has repository cards:', hasRepoCards);
    console.log('Has repository list:', hasRepoList);  
    console.log('Has search bar:', hasSearchBar);
    
    // Try to make an API call directly
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/repositories');
        const data = await response.json();
        return { status: response.status, data: data };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('Direct API call result:', JSON.stringify(apiResponse, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();