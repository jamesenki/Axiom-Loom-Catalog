const puppeteer = require('puppeteer');

(async () => {
  console.log('=== FINDING THE ACTUAL FUCKING ERROR ===\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true 
  });
  const page = await browser.newPage();
  
  // Intercept console
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      msg.args().forEach(async (arg) => {
        const val = await arg.jsonValue();
        console.log('  Details:', val);
      });
    }
  });
  
  page.on('pageerror', error => {
    console.log('\n🔴 PAGE ERROR:', error.message);
    console.log('Stack:', error.stack);
  });
  
  // Intercept React errors
  await page.evaluateOnNewDocument(() => {
    window.addEventListener('error', (e) => {
      console.error('REACT ERROR CAUGHT:', e.message, '\nComponent Stack:', e.error?.componentStack || 'No stack');
    });
  });
  
  console.log('Loading http://localhost...\n');
  await page.goto('http://localhost', { waitUntil: 'domcontentloaded' });
  
  // Wait for error boundary to trigger
  await page.waitForTimeout(3000);
  
  // Check what's in the DOM
  const hasError = await page.$eval('body', el => el.textContent.includes('Something went wrong'));
  
  if (hasError) {
    console.log('\n❌ ERROR PAGE IS SHOWING\n');
    
    // Try to get the actual error from React DevTools
    const errorInfo = await page.evaluate(() => {
      // Look for error boundary state
      const root = document.getElementById('root');
      const reactKey = Object.keys(root).find(key => key.startsWith('__react'));
      if (reactKey) {
        const fiber = root[reactKey];
        // Traverse up to find error boundary
        let current = fiber;
        while (current) {
          if (current.stateNode && current.stateNode.state && current.stateNode.state.hasError) {
            return {
              error: current.stateNode.state.error?.toString(),
              errorInfo: current.stateNode.state.errorInfo
            };
          }
          current = current.return;
        }
      }
      return null;
    });
    
    if (errorInfo) {
      console.log('ERROR BOUNDARY STATE:', errorInfo);
    }
  }
  
  console.log('\nKeeping browser open - check the Console tab in DevTools');
  
  // Keep open for 60 seconds
  await page.waitForTimeout(60000);
  await browser.close();
})();