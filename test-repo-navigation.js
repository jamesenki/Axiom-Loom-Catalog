const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  console.log('Current URL:', page.url());
  
  // Try to click Explore button on first card
  try {
    const exploreButton = await page.locator('[data-testid="repository-card"]').first().locator('text="Explore"');
    console.log('Clicking Explore button...');
    await exploreButton.click();
    
    // Wait for navigation
    await page.waitForTimeout(2000);
    
    console.log('URL after click:', page.url());
    
    // Take screenshot of new page
    await page.screenshot({ path: 'after-navigation.png' });
    console.log('Screenshot saved as after-navigation.png');
    
  } catch (e) {
    console.error('Error during navigation:', e.message);
  }
  
  await browser.close();
})();