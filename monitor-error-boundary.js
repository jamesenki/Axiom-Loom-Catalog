const { chromium } = require('playwright');

async function monitorErrorBoundary() {
  console.log('=== MONITORING ERROR BOUNDARY LOGS ===\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errorBoundaryLogs = [];
  const allConsoleLogs = [];
  
  // Monitor ALL console messages
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    const location = msg.location();
    
    const logEntry = {
      type,
      text,
      location: location.url ? `${location.url}:${location.lineNumber}:${location.columnNumber}` : 'unknown',
      timestamp: new Date().toISOString()
    };
    
    allConsoleLogs.push(logEntry);
    
    // Look for ErrorBoundary specific logs
    if (text.includes('ErrorBoundary caught an error') || 
        text.includes('Error message:') || 
        text.includes('Error stack:') || 
        text.includes('Component stack:')) {
      errorBoundaryLogs.push(logEntry);
      console.log(`🚨 ERROR BOUNDARY LOG [${type}]: ${text}`);
    } else if (type === 'error') {
      console.log(`❌ CONSOLE ERROR: ${text}`);
    } else if (type === 'warn') {
      console.log(`⚠️  CONSOLE WARN: ${text}`);
    } else {
      console.log(`ℹ️  CONSOLE [${type}]: ${text}`);
    }
  });

  try {
    console.log('🌐 Loading application and monitoring error boundary...');
    await page.goto('http://localhost', { waitUntil: 'domcontentloaded' });
    
    // Wait longer to catch any async initialization errors
    console.log('⏳ Waiting 10 seconds for initialization and errors...');
    await page.waitForTimeout(10000);
    
    // Check if error boundary is showing
    const errorBoundaryVisible = await page.locator('text=Oops! Something went wrong').count() > 0;
    console.log(`\n🔍 Error boundary visible: ${errorBoundaryVisible}`);
    
    if (errorBoundaryVisible) {
      // Try to extract error ID from the page
      try {
        const errorIdElement = await page.locator('text=/Error ID: err-[\\d\\w-]+/').first();
        const errorId = await errorIdElement.textContent();
        console.log(`🆔 Error ID found: ${errorId}`);
      } catch (e) {
        console.log('🆔 No error ID found on page');
      }
      
      // Try to click the "Report Issue" button to see error details
      try {
        const reportButton = await page.locator('button:has-text("Report Issue")');
        if (await reportButton.count() > 0) {
          console.log('📋 Attempting to extract error details...');
          await reportButton.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log('📋 Could not click report button');
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total console messages: ${allConsoleLogs.length}`);
    console.log(`   Error boundary logs: ${errorBoundaryLogs.length}`);
    
    if (errorBoundaryLogs.length > 0) {
      console.log(`\n🚨 ERROR BOUNDARY DETAILS:`);
      errorBoundaryLogs.forEach((log, i) => {
        console.log(`   ${i + 1}. [${log.type}] ${log.text}`);
        console.log(`      Location: ${log.location}`);
        console.log(`      Time: ${log.timestamp}\n`);
      });
    } else if (errorBoundaryVisible) {
      console.log(`\n❗ Error boundary is visible but no error logs were captured!`);
      console.log(`   This suggests the error might be happening during render`);
      console.log(`   Let's check what console logs we did get:\n`);
      
      // Show recent console logs
      const recentLogs = allConsoleLogs.slice(-10);
      recentLogs.forEach((log, i) => {
        console.log(`   ${i + 1}. [${log.type}] ${log.text}`);
      });
    }
    
    // Take screenshot for reference
    await page.screenshot({ path: 'error-boundary-monitor.png', fullPage: true });
    console.log('\n📸 Screenshot saved: error-boundary-monitor.png');
    
  } catch (error) {
    console.log(`❌ MONITORING ERROR: ${error.message}`);
  }
  
  await browser.close();
}

monitorErrorBoundary().catch(console.error);