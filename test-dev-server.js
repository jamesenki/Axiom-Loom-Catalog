const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('ProtectedRoute') || text.includes('BypassAuth') || text.includes('ERROR')) {
      console.log(`[Console] ${text}`);
    }
  });
  
  page.on('pageerror', error => console.log('[Page Error]', error.message));
  page.on('response', response => {
    if (response.url().includes('/api/') && response.status() !== 200) {
      console.log(`[API Error] ${response.url()} - Status: ${response.status()}`);
    }
  });

  try {
    console.log('Testing development server at http://localhost:3000...\n');
    
    // Navigate to dev server
    const response = await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log(`Response status: ${response.status()}`);
    console.log(`Current URL: ${page.url()}`);
    
    // Wait for React to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check page state
    const pageState = await page.evaluate(() => {
      const repoCards = document.querySelectorAll('[data-testid="repository-card"]');
      const cards = document.querySelectorAll('[class*="Card"]');
      const loadingElements = document.querySelectorAll('[class*="Loading"], [class*="loading"], [class*="Skeleton"]');
      
      return {
        url: window.location.href,
        pathname: window.location.pathname,
        hasLoginForm: !!document.querySelector('input[type="password"]'),
        repoCardCount: repoCards.length,
        cardCount: cards.length,
        hasLoadingElements: loadingElements.length > 0,
        pageText: document.body.innerText.substring(0, 300)
      };
    });
    
    console.log('\nPage state:', JSON.stringify(pageState, null, 2));
    
    if (pageState.pathname === '/') {
      console.log('\n✅ Successfully loaded home page!');
      
      if (pageState.repoCardCount === 0) {
        console.log('⚠️  No repository cards found. Checking for errors...');
        
        // Check for any error messages
        const errors = await page.evaluate(() => {
          const errorElements = Array.from(document.querySelectorAll('*'))
            .filter(el => el.textContent?.toLowerCase().includes('error'))
            .map(el => el.textContent?.trim())
            .filter(Boolean)
            .slice(0, 3);
          return errorElements;
        });
        
        if (errors.length > 0) {
          console.log('Errors found:', errors);
        }
        
        // Check API call
        console.log('\nChecking API directly...');
        const apiResult = await page.evaluate(async () => {
          try {
            const response = await fetch('/api/repositories');
            const data = await response.json();
            return {
              status: response.status,
              dataLength: Array.isArray(data) ? data.length : 0,
              error: null
            };
          } catch (error) {
            return { error: error.message };
          }
        });
        
        console.log('API result:', apiResult);
      }
    }
    
    await page.screenshot({ path: 'dev-server-state.png', fullPage: true });
    console.log('\nScreenshot saved as dev-server-state.png');
    
  } catch (error) {
    console.error('Error:', error);
    await page.screenshot({ path: 'dev-server-error.png' });
  }
  
  await browser.close();
})();