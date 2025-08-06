const { chromium } = require('playwright');

async function captureExactError() {
  console.log('=== CAPTURING EXACT ERROR CAUSING ERROR BOUNDARY ===\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Inject error capture script before any other scripts load
  await page.addInitScript(() => {
    window.capturedErrors = [];
    window.reactErrors = [];
    
    // Capture all unhandled errors
    window.addEventListener('error', (event) => {
      const errorInfo = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error ? {
          name: event.error.name,
          message: event.error.message,
          stack: event.error.stack
        } : null,
        timestamp: Date.now()
      };
      window.capturedErrors.push(errorInfo);
      console.log('🚨 CAPTURED ERROR:', errorInfo);
    });
    
    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const errorInfo = {
        reason: event.reason,
        promise: event.promise,
        timestamp: Date.now(),
        type: 'unhandledrejection'
      };
      window.capturedErrors.push(errorInfo);
      console.log('🚨 CAPTURED REJECTION:', errorInfo);
    });
    
    // Hook into React error boundary if possible
    const originalComponentDidCatch = window.React?.Component?.prototype?.componentDidCatch;
    if (originalComponentDidCatch) {
      window.React.Component.prototype.componentDidCatch = function(error, errorInfo) {
        window.reactErrors.push({ error, errorInfo, timestamp: Date.now() });
        console.log('⚛️ REACT ERROR BOUNDARY:', { error, errorInfo });
        return originalComponentDidCatch.call(this, error, errorInfo);
      };
    }
  });

  try {
    console.log('🌐 Loading application with error capture...');
    await page.goto('http://localhost', { waitUntil: 'domcontentloaded' });
    
    // Wait for potential errors to occur
    await page.waitForTimeout(5000);
    
    // Extract captured errors
    const capturedErrors = await page.evaluate(() => window.capturedErrors || []);
    const reactErrors = await page.evaluate(() => window.reactErrors || []);
    
    console.log(`\n📊 Error Summary:`);
    console.log(`   JavaScript errors captured: ${capturedErrors.length}`);
    console.log(`   React errors captured: ${reactErrors.length}`);
    
    if (capturedErrors.length > 0) {
      console.log(`\n❌ JAVASCRIPT ERRORS:`);
      capturedErrors.forEach((error, i) => {
        console.log(`\n   ${i + 1}. ${error.message}`);
        console.log(`      File: ${error.filename}:${error.lineno}:${error.colno}`);
        if (error.error && error.error.stack) {
          console.log(`      Stack: ${error.error.stack.split('\n')[0]}`);
        }
      });
    }
    
    if (reactErrors.length > 0) {
      console.log(`\n⚛️ REACT ERROR BOUNDARY ERRORS:`);
      reactErrors.forEach((error, i) => {
        console.log(`\n   ${i + 1}. ${error.error.message || error.error}`);
        if (error.error.stack) {
          console.log(`      Stack: ${error.error.stack.split('\n').slice(0, 5).join('\n')}`);
        }
        if (error.errorInfo && error.errorInfo.componentStack) {
          console.log(`      Component Stack: ${error.errorInfo.componentStack.split('\n').slice(0, 3).join('\n')}`);
        }
      });
    }
    
    // Also check for any network errors that might be causing React to fail
    console.log(`\n🌐 Checking critical API endpoints that React might depend on...`);
    
    const criticalEndpoints = [
      '/api/auth/me',
      '/api/user/profile', 
      '/api/config',
      '/api/repositories'
    ];
    
    for (const endpoint of criticalEndpoints) {
      try {
        const response = await page.goto(`http://localhost${endpoint}`, { timeout: 5000 });
        console.log(`   ${endpoint}: ${response.status()}`);
      } catch (error) {
        console.log(`   ${endpoint}: ${error.message}`);
      }
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'exact-error-capture.png', fullPage: true });
    console.log('\n📸 Error capture screenshot saved');
    
  } catch (error) {
    console.log(`❌ SCRIPT ERROR: ${error.message}`);
  }
  
  await browser.close();
}

captureExactError().catch(console.error);