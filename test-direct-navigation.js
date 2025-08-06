const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('1. Going to main docs page...');
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForTimeout(2000);
  
  // Look for any link that might lead to architecture diagrams
  console.log('2. Looking for architecture diagram links...');
  const links = await page.$$eval('a', links => 
    links.map(link => ({
      text: link.textContent,
      href: link.getAttribute('href')
    })).filter(l => l.href && (l.href.includes('architecture') || l.href.includes('diagram')))
  );
  
  console.log('Found links:', links);
  
  // Try to click on architecture diagrams link
  const archLink = await page.$('a[href*="architecture"]');
  if (archLink) {
    console.log('3. Clicking architecture link...');
    await archLink.click();
    await page.waitForTimeout(3000);
  }
  
  // Check current URL and content
  console.log('4. Current URL:', page.url());
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/direct-nav-test.png', fullPage: true });
  
  // Check what file is being displayed
  const selectedFile = await page.evaluate(() => {
    // Look for any indication of current file
    const urlParams = new URLSearchParams(window.location.search);
    return {
      url: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search
    };
  });
  
  console.log('5. Page info:', selectedFile);
  
  // Check for error messages
  const errorText = await page.$eval('body', body => body.textContent).catch(() => '');
  if (errorText.includes('Error Loading') || errorText.includes('404')) {
    console.log('6. ERROR: Page shows error message');
  }
  
  await browser.close();
})();