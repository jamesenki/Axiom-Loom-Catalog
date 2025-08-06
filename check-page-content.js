const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error' || text.includes('Error') || text.includes('error')) {
        console.log(`CONSOLE ${type.toUpperCase()}:`, text);
      }
    });
    
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Wait a bit for React to render
    await page.waitForTimeout(3000);
    
    // Check what's actually rendered
    const pageContent = await page.evaluate(() => {
      const info = {
        title: document.title,
        bodyClasses: document.body.className,
        mainContent: document.querySelector('main')?.innerHTML?.substring(0, 500) || 'No main element',
        hasCards: document.querySelectorAll('[data-testid="repository-card"]').length,
        hasError: document.body.innerHTML.includes('Error') || document.body.innerHTML.includes('error'),
        heroText: document.querySelector('h1')?.textContent || 'No H1',
        allDataTestIds: Array.from(document.querySelectorAll('[data-testid]')).map(el => el.getAttribute('data-testid'))
      };
      return info;
    });
    
    console.log('Page Analysis:', JSON.stringify(pageContent, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: 'page-content-check.png', fullPage: true });
    console.log('Screenshot saved as page-content-check.png');
    
    // Keep browser open for manual inspection
    console.log('Browser will close in 15 seconds...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();