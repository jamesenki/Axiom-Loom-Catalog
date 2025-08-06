const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('1. Navigating to homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Check if we're redirected to login
    const url = page.url();
    console.log('Current URL:', url);
    
    if (url.includes('/login')) {
      console.log('2. On login page, clicking any credential to enable demo mode...');
      
      // Click on the first test credential to auto-fill
      await page.click('code');
      
      // Click sign in
      await page.click('button[type="submit"]');
      
      // Wait for navigation
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      console.log('3. After login, URL:', page.url());
    }
    
    // Check for repository cards
    await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
    const cards = await page.$$('[data-testid="repository-card"]');
    console.log(`4. Found ${cards.length} repository cards`);
    
    // Take screenshot
    await page.screenshot({ path: 'homepage-test.png', fullPage: true });
    console.log('5. Screenshot saved as homepage-test.png');
    
    // Check for errors in console
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    console.log('✅ Homepage loads successfully with repository cards!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();