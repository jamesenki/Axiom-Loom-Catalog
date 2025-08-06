const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('Browser console:', msg.text()));
  page.on('pageerror', error => console.log('Page error:', error.message));
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`API Response: ${response.url()} - Status: ${response.status()}`);
    }
  });
  
  page.on('requestfailed', request => {
    console.log('Request failed:', request.url(), request.failure().errorText);
  });

  try {
    // Go to the frontend
    console.log('Navigating to http://localhost...');
    await page.goto('http://localhost', { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait a bit for React to render
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if we're redirected to login
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-frontend-state.png', fullPage: true });
    
    // Check for repository cards
    const repoCards = await page.$$('[data-testid="repository-card"]');
    console.log(`Found ${repoCards.length} repository cards`);
    
    // Check for any error messages
    const errorElements = await page.$$eval('*', elements => 
      elements.filter(el => 
        el.textContent?.includes('Error') || 
        el.textContent?.includes('error') ||
        el.textContent?.includes('failed')
      ).map(el => ({
        tag: el.tagName,
        text: el.textContent?.trim().substring(0, 100)
      }))
    );
    
    if (errorElements.length > 0) {
      console.log('Error elements found:', errorElements);
    }
    
    // Check network tab for failed API calls
    const failedApiCalls = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('/api/') && entry.responseStatus >= 400)
        .map(entry => ({
          url: entry.name,
          status: entry.responseStatus,
          duration: entry.duration
        }));
    });
    
    if (failedApiCalls.length > 0) {
      console.log('Failed API calls:', failedApiCalls);
    }
    
    // Try to fetch repositories directly
    console.log('\nTrying direct API call to /api/repositories...');
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/repositories');
        const data = await response.json();
        return {
          status: response.status,
          statusText: response.statusText,
          dataLength: Array.isArray(data) ? data.length : 0,
          data: data
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('Direct API response:', apiResponse);
    
    // Check if the loading state is stuck
    const loadingElement = await page.$('[class*="Loading"], [class*="loading"]');
    if (loadingElement) {
      console.log('Loading element still visible');
    }
    
    // Check React state
    const reactState = await page.evaluate(() => {
      const reactRoot = document.querySelector('#root');
      if (reactRoot && reactRoot._reactRootContainer) {
        return 'React root found';
      }
      return 'React root not found or not properly initialized';
    });
    console.log('React state:', reactState);
    
  } catch (error) {
    console.error('Error during debugging:', error);
  }
  
  await browser.close();
})();