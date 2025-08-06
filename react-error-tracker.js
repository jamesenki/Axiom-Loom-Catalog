const { chromium } = require('playwright');

async function trackReactErrors() {
  console.log('=== REACT ERROR TRACKER ===\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allErrors = [];
  const reactErrors = [];
  
  // Intercept console messages
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    const location = msg.location();
    
    console.log(`[${type.toUpperCase()}] ${text}`);
    if (location.url) {
      console.log(`   at ${location.url}:${location.lineNumber}:${location.columnNumber}`);
    }
    
    if (type === 'error') {
      allErrors.push({ text, location, type });
      
      if (text.includes('React') || text.includes('chunk') || text.includes('Module') || 
          text.includes('Cannot resolve') || text.includes('Failed to fetch') ||
          text.includes('TypeError') || text.includes('ReferenceError')) {
        reactErrors.push({ text, location, type });
      }
    }
  });

  // Intercept JavaScript errors
  page.on('pageerror', error => {
    console.log(`❌ PAGE ERROR: ${error.message}`);
    console.log(`   Stack: ${error.stack}`);
    allErrors.push({ text: error.message, stack: error.stack, type: 'pageerror' });
  });

  // Track network failures
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`🌐 NETWORK ERROR: ${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log('🚀 Loading application...');
    await page.goto('http://localhost', { waitUntil: 'domcontentloaded' });
    
    // Wait for React to potentially mount
    console.log('⏳ Waiting for React initialization...');
    await page.waitForTimeout(5000);
    
    // Check if React app mounted
    const rootElement = await page.locator('#root');
    const rootHTML = await rootElement.innerHTML();
    
    console.log(`\n📊 Root element content length: ${rootHTML.length}`);
    
    if (rootHTML.length < 200) {
      console.log('❌ Root element appears empty - React may not have mounted');
      console.log('Root content preview:', rootHTML.substring(0, 100));
    }
    
    // Look for specific error patterns
    const hasErrorBoundary = await page.locator('text=Oops! Something went wrong').count() > 0;
    const hasLoadingState = await page.locator('text=Loading').count() > 0;
    
    console.log(`\n🔍 UI State:`);
    console.log(`   Error boundary active: ${hasErrorBoundary}`);
    console.log(`   Loading states present: ${hasLoadingState}`);
    
    // Try to access React DevTools data if available
    const reactVersion = await page.evaluate(() => {
      return window.React ? window.React.version : 'Not found';
    });
    console.log(`   React version: ${reactVersion}`);
    
    // Check for specific error element and get its error ID
    if (hasErrorBoundary) {
      const errorId = await page.textContent('[data-error-id]') || 
                      await page.textContent('text=/Error ID: err-[\\d\\w-]+/') ||
                      'No specific error ID found';
      console.log(`   Error ID: ${errorId}`);
    }
    
    // Final state screenshot
    await page.screenshot({ path: 'react-error-analysis.png', fullPage: true });
    console.log('📸 Analysis screenshot saved');
    
  } catch (error) {
    console.log(`❌ CRITICAL: ${error.message}`);
  }
  
  console.log(`\n📈 ERROR SUMMARY:`);
  console.log(`   Total errors: ${allErrors.length}`);
  console.log(`   React-specific errors: ${reactErrors.length}`);
  
  if (reactErrors.length > 0) {
    console.log(`\n⚛️ REACT ERRORS:`);
    reactErrors.forEach((error, i) => {
      console.log(`   ${i + 1}. ${error.text}`);
      if (error.location) {
        console.log(`      Location: ${error.location.url}:${error.location.lineNumber}`);
      }
    });
  }
  
  await browser.close();
}

trackReactErrors().catch(console.error);