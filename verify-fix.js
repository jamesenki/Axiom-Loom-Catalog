const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to repository detail page
  console.log('🔍 Navigating to repository detail page...');
  await page.goto('http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine-architecture');
  await page.waitForLoadState('networkidle');

  // Take screenshot
  console.log('📸 Taking screenshot of repository page...');
  await page.screenshot({ path: 'repository-with-links.png', fullPage: true });

  // Check for Coming Soon links
  const implementationLink = await page.locator('a[href*="/coming-soon/docs/"]').first();
  const productLink = await page.locator('a[href*="/coming-soon/product/"]').first();
  
  console.log('🔗 Implementation Guide link visible:', await implementationLink.isVisible());
  console.log('🔗 Product Details link visible:', await productLink.isVisible());

  // Get the text content of buttons
  const buttons = await page.locator('button, a').allTextContents();
  const relevantButtons = buttons.filter(text => 
    text.includes('Implementation Guide') || 
    text.includes('Product Details') || 
    text.includes('Architecture Demo')
  );

  console.log('📋 Coming Soon buttons found:', relevantButtons);

  // Click the Implementation Guide link
  console.log('🖱️  Clicking Implementation Guide link...');
  await implementationLink.click();
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Current URL:', page.url());
  
  // Take screenshot of Coming Soon page
  await page.screenshot({ path: 'coming-soon-verification.png' });

  await browser.close();
  console.log('✅ Verification complete! Check repository-with-links.png and coming-soon-verification.png');
})();