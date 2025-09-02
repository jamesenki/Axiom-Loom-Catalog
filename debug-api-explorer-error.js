const { chromium } = require('playwright');

async function debugApiExplorer() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen to console logs
  page.on('console', msg => console.log(`CONSOLE: ${msg.text()}`));
  page.on('pageerror', error => console.log(`PAGE ERROR: ${error}`));
  
  try {
    console.log('Navigating to API Explorer...');
    await page.goto('http://10.0.0.109:3000/api-explorer/eyns-api-gateway');
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    // Check if there are any error messages visible
    const errorElements = await page.$$eval('[class*="error"], .error, .alert, .warning', elements =>
      elements.map(el => el.textContent.trim())
    );
    
    console.log('Error messages found:', errorElements);
    
    // Check network requests
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('api') || response.status() >= 400) {
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    // Wait a bit more for network requests
    await page.waitForTimeout(3000);
    
    console.log('Network responses:', responses);
    
    // Check if the URL changed or if we're seeing the right page
    const currentUrl = page.url();
    const title = await page.title();
    
    console.log(`Current URL: ${currentUrl}`);
    console.log(`Page title: ${title}`);
    
    // Look for any API-related content that should be there
    const pageText = await page.textContent('body');
    const hasApiContent = pageText.includes('API') || pageText.includes('eyns-api-gateway');
    
    console.log(`Page contains API content: ${hasApiContent}`);
    
    if (pageText.includes('Failed to fetch APIs')) {
      console.log('❌ API fetch failed - this is the root cause');
      
      // Check what specific API endpoint is being called
      const apiEndpoint = await page.evaluate(() => {
        // Look for any fetch calls or API endpoints in the console or network
        return window.location.href;
      });
      
      console.log('Checking API endpoint availability...');
      
      // Try to fetch the API directly
      try {
        const response = await page.goto('http://10.0.0.109:3000/api/repositories/eyns-api-gateway/apis', { waitUntil: 'networkidle' });
        console.log(`Direct API call status: ${response.status()}`);
        
        if (response.status() === 200) {
          const data = await response.text();
          console.log('API response preview:', data.substring(0, 200));
        }
      } catch (error) {
        console.log('Direct API call failed:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Error during debug:', error);
  } finally {
    await browser.close();
  }
}

debugApiExplorer();