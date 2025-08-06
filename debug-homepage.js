const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    console.log('1. Navigating to homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    console.log('2. Current URL:', page.url());
    
    // Check page content
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('3. Page contains text:', bodyText.substring(0, 200) + '...');
    
    // Check for specific elements
    const hasHeroSection = await page.$('.highlight') !== null;
    console.log('4. Has hero section:', hasHeroSection);
    
    // Check for loading state
    const hasLoading = await page.$('[role="status"]') !== null;
    console.log('5. Has loading indicator:', hasLoading);
    
    // Check for error state
    const errorElements = await page.$$('div[class*="Error"], div[class*="error"]');
    console.log('6. Error elements found:', errorElements.length);
    
    // Wait a bit and check network requests
    console.log('7. Checking network requests...');
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    // Reload to capture network requests
    await page.reload({ waitUntil: 'networkidle0' });
    
    console.log('8. API responses:', responses);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-homepage.png', fullPage: true });
    console.log('9. Screenshot saved as debug-homepage.png');
    
    // Wait for user to inspect
    console.log('10. Browser will close in 10 seconds...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();