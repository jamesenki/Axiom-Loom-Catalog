const { chromium } = require('playwright');

(async () => {
  console.log('🔍 QA Agent: Debugging frontend content...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    // Get the full page content
    const rootContent = await page.locator('#root').innerHTML();
    console.log('\n=== ROOT ELEMENT CONTENT ===');
    console.log(rootContent.substring(0, 2000) + '...');
    
    // Check for any error messages
    const errorMessages = await page.locator('text=/error|Error|ERROR/i').allTextContents();
    if (errorMessages.length > 0) {
      console.log('\n=== ERROR MESSAGES FOUND ===');
      errorMessages.forEach(msg => console.log(msg));
    }
    
    // Check for loading states
    const loadingElements = await page.locator('text=/loading|Loading/i').allTextContents();
    if (loadingElements.length > 0) {
      console.log('\n=== LOADING STATES ===');
      loadingElements.forEach(msg => console.log(msg));
    }
    
    // Look for any buttons or interactive elements
    const buttons = await page.locator('button').allTextContents();
    console.log('\n=== BUTTONS FOUND ===');
    buttons.forEach(btn => console.log(`Button: ${btn}`));
    
    // Look for any links
    const links = await page.locator('a').allTextContents();
    console.log('\n=== LINKS FOUND ===');
    links.forEach(link => console.log(`Link: ${link}`));
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    console.log('\n✅ Screenshot saved as debug-screenshot.png');
    
  } catch (error) {
    console.log('❌ Debug error:', error.message);
  }
  
  await browser.close();
})();