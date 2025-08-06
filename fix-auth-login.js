const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('Browser:', msg.text()));
  page.on('pageerror', error => console.log('Page error:', error.message));

  try {
    console.log('Navigating to http://localhost/login...');
    await page.goto('http://localhost/login', { waitUntil: 'networkidle2' });
    
    // Wait for login form
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 5000 });
    
    console.log('Filling login form with developer credentials...');
    
    // Fill in email
    await page.type('input[type="email"], input[name="email"]', 'dev@localhost');
    
    // Fill in password
    await page.type('input[type="password"], input[name="password"]', 'developer');
    
    // Take screenshot before login
    await page.screenshot({ path: 'before-login.png' });
    
    // Click sign in button
    await page.click('button[type="submit"]');
    
    // Wait for navigation or error
    await Promise.race([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      new Promise(resolve => setTimeout(resolve, 5000))
    ]);
    
    const afterLogin = await page.evaluate(() => ({
      url: window.location.pathname,
      hasRepoCards: document.querySelectorAll('[data-testid="repository-card"]').length,
      hasError: document.body.textContent.includes('error') || document.body.textContent.includes('Error'),
      bodyPreview: document.body.innerText.substring(0, 300)
    }));
    
    console.log('\nAfter login:', afterLogin);
    
    // Take screenshot after login
    await page.screenshot({ path: 'after-login.png', fullPage: true });
    
    // If still on login page, check for errors
    if (afterLogin.url === '/login') {
      const errorMessage = await page.evaluate(() => {
        const errorElements = Array.from(document.querySelectorAll('*')).filter(el => 
          el.textContent?.toLowerCase().includes('error') || 
          el.textContent?.toLowerCase().includes('invalid') ||
          el.textContent?.toLowerCase().includes('failed')
        );
        return errorElements.map(el => el.textContent?.trim()).filter(Boolean).slice(0, 3);
      });
      
      console.log('Error messages found:', errorMessage);
    }
    
    // If we're on the home page, check repository display
    if (afterLogin.url === '/') {
      console.log(`\n✅ Successfully logged in! Found ${afterLogin.hasRepoCards} repository cards.`);
      
      if (afterLogin.hasRepoCards === 0) {
        // Check if there's a loading state
        const loadingState = await page.evaluate(() => {
          const loadingElements = document.querySelectorAll('[class*="Loading"], [class*="loading"], [class*="Skeleton"]');
          return {
            hasLoadingElements: loadingElements.length > 0,
            loadingText: Array.from(loadingElements).map(el => el.textContent).join(', ')
          };
        });
        
        console.log('Loading state:', loadingState);
        
        // Wait a bit more for data to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const finalCheck = await page.evaluate(() => ({
          hasRepoCards: document.querySelectorAll('[data-testid="repository-card"]').length,
          hasCards: document.querySelectorAll('[class*="Card"]').length,
          bodyText: document.body.innerText.substring(0, 500)
        }));
        
        console.log('\nFinal check after waiting:', finalCheck);
        await page.screenshot({ path: 'final-state.png', fullPage: true });
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
    await page.screenshot({ path: 'error-state.png', fullPage: true });
  }
  
  await browser.close();
})();