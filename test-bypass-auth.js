const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable all console logging
  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('Download the React DevTools')) {
      console.log(`[${msg.type()}]`, text);
    }
  });
  
  page.on('pageerror', error => console.log('Page error:', error.message));
  page.on('requestfailed', request => {
    console.log('Request failed:', request.url());
  });

  try {
    console.log('Testing authentication bypass...\n');
    
    // Navigate directly to home page
    console.log('1. Navigating to http://localhost...');
    const response = await page.goto('http://localhost', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log(`   Response status: ${response.status()}`);
    console.log(`   Final URL: ${page.url()}`);
    
    // Wait for any redirects to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check current state
    const pageState = await page.evaluate(() => {
      return {
        url: window.location.href,
        pathname: window.location.pathname,
        title: document.title,
        hasLoginForm: !!document.querySelector('input[type="password"]'),
        hasRepoCards: document.querySelectorAll('[data-testid="repository-card"]').length,
        bodyClasses: document.body.className,
        rootHTML: document.getElementById('root')?.innerHTML?.substring(0, 200)
      };
    });
    
    console.log('\n2. Current page state:', JSON.stringify(pageState, null, 2));
    
    // If we're on login page, something is wrong with bypass
    if (pageState.pathname === '/login') {
      console.log('\n❌ ERROR: Still on login page! Bypass auth not working.');
      
      // Check React component tree
      const reactInfo = await page.evaluate(() => {
        const root = document.getElementById('root');
        if (root && root._reactRootContainer) {
          return 'React root exists';
        }
        return 'No React root found';
      });
      console.log('   React info:', reactInfo);
      
      // Try to see what's in localStorage/sessionStorage
      const storage = await page.evaluate(() => ({
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage)
      }));
      console.log('   Storage keys:', storage);
    } else if (pageState.pathname === '/') {
      console.log('\n✅ Successfully bypassed authentication!');
      console.log(`   Repository cards found: ${pageState.hasRepoCards}`);
      
      if (pageState.hasRepoCards === 0) {
        // Wait for data to load
        console.log('   Waiting for repository data to load...');
        await page.waitForSelector('[data-testid="repository-card"]', { 
          timeout: 10000 
        }).catch(() => console.log('   Timeout waiting for repository cards'));
        
        const finalCount = await page.evaluate(() => 
          document.querySelectorAll('[data-testid="repository-card"]').length
        );
        console.log(`   Final repository count: ${finalCount}`);
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'bypass-auth-test.png', fullPage: true });
    console.log('\n3. Screenshot saved as bypass-auth-test.png');
    
    // Check console errors
    const jsErrors = await page.evaluate(() => {
      return window.__errors || [];
    });
    
    if (jsErrors.length > 0) {
      console.log('\n4. JavaScript errors detected:', jsErrors);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'bypass-auth-error.png', fullPage: true });
  }
  
  // Keep browser open for inspection
  console.log('\nPress Ctrl+C to close browser...');
  await new Promise(() => {}); // Wait indefinitely
})();