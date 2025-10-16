const { chromium } = require('playwright');

(async () => {
  console.log('🔍 QA Agent: Final verification of application state...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('Loading application...');
    await page.goto('http://localhost', { waitUntil: 'networkidle' });
    await page.waitForTimeout(10000);
    
    // Get the actual content being displayed
    const bodyContent = await page.locator('body').innerHTML();
    
    console.log('\n=== CHECKING FOR ERROR PAGE ===');
    if (bodyContent.includes('Oops! Something went wrong')) {
      console.log('❌ STILL SHOWING ERROR PAGE');
      console.log('The application is still displaying the error boundary.');
      
      // Check what specific error is being logged
      const errorMessage = await page.locator('text=We encountered an unexpected error').textContent();
      console.log('Error message:', errorMessage);
      
      // Take screenshot of error state
      await page.screenshot({ path: 'error-state-final.png', fullPage: true });
      console.log('Screenshot saved: error-state-final.png');
      
    } else {
      console.log('✅ NO ERROR PAGE DETECTED');
      console.log('Checking for actual application content...');
      
      // Look for actual application elements
      const hasLogin = bodyContent.includes('Login') || bodyContent.includes('login');
      const hasRepositories = bodyContent.includes('repository') || bodyContent.includes('Repository');
      const hasNavigation = bodyContent.includes('nav') || bodyContent.includes('Navigation');
      
      console.log(`Login elements: ${hasLogin ? '✅' : '❌'}`);
      console.log(`Repository content: ${hasRepositories ? '✅' : '❌'}`);
      console.log(`Navigation: ${hasNavigation ? '✅' : '❌'}`);
      
      // Take screenshot of working state
      await page.screenshot({ path: 'working-state-final.png', fullPage: true });
      console.log('Screenshot saved: working-state-final.png');
    }
    
    // Check for any obvious React content
    const hasReactContent = bodyContent.length > 5000; // React apps typically have substantial content
    console.log(`React content detected: ${hasReactContent ? '✅' : '❌'} (${bodyContent.length} chars)`);
    
  } catch (error) {
    console.log('❌ Verification error:', error.message);
  }
  
  await browser.close();
})();