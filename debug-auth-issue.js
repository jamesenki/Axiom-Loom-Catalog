const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.text().includes('Theme') || msg.text().includes('auth') || msg.text().includes('Auth')) {
      console.log('Browser console:', msg.text());
    }
  });
  
  page.on('pageerror', error => console.log('Page error:', error.message));

  try {
    console.log('Navigating to http://localhost...');
    await page.goto('http://localhost', { waitUntil: 'networkidle2' });
    
    // Wait for React
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check React context values
    const authState = await page.evaluate(() => {
      // Try to access React components through React DevTools
      const root = document.querySelector('#root');
      
      // Check if window has any auth-related globals
      const globals = {
        hasReactDevTools: !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
        reactVersion: window.React?.version,
        // Look for any auth-related window properties
        authRelatedKeys: Object.keys(window).filter(key => 
          key.toLowerCase().includes('auth') || 
          key.toLowerCase().includes('user')
        )
      };
      
      // Try to find auth context in the component tree
      const findAuthContext = () => {
        try {
          // This is a hacky way to check if auth context is working
          const contextCheck = document.body.innerHTML.includes('Login') || 
                              document.body.innerHTML.includes('login');
          return {
            hasLoginPage: contextCheck,
            currentUrl: window.location.pathname,
            pageTitle: document.title
          };
        } catch (e) {
          return { error: e.message };
        }
      };
      
      return {
        globals,
        contextCheck: findAuthContext(),
        localStorage: {
          keys: Object.keys(localStorage),
          authToken: localStorage.getItem('authToken'),
          user: localStorage.getItem('user')
        }
      };
    });
    
    console.log('Auth state check:', JSON.stringify(authState, null, 2));
    
    // Try to bypass login by setting auth directly
    console.log('\nAttempting to bypass auth...');
    
    await page.evaluate(() => {
      // Set auth token in localStorage
      localStorage.setItem('authToken', 'bypass-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'bypass-user',
        email: 'demo@localhost',
        name: 'Demo User',
        role: 'DEVELOPER'
      }));
    });
    
    // Reload to see if it helps
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const afterReload = await page.evaluate(() => ({
      url: window.location.pathname,
      hasRepoCards: document.querySelectorAll('[data-testid="repository-card"]').length,
      bodyText: document.body.innerText.substring(0, 200)
    }));
    
    console.log('\nAfter reload:', afterReload);
    
    await page.screenshot({ path: 'debug-auth-state.png', fullPage: true });
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();