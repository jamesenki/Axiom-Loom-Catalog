const { chromium } = require('playwright');

async function deepErrorIntercept() {
  console.log('=== DEEP ERROR INTERCEPTION ===\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Inject comprehensive error tracking BEFORE any scripts load
  await page.addInitScript(() => {
    // Override console methods to capture everything
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    
    window.interceptedLogs = [];
    
    console.error = (...args) => {
      window.interceptedLogs.push({ type: 'error', args: args.map(a => String(a)), timestamp: Date.now() });
      return originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
      window.interceptedLogs.push({ type: 'warn', args: args.map(a => String(a)), timestamp: Date.now() });
      return originalWarn.apply(console, args);
    };
    
    // Capture module loading errors
    const originalImport = window.import;
    if (originalImport) {
      window.import = function(...args) {
        return originalImport.apply(this, args).catch(error => {
          window.interceptedLogs.push({ 
            type: 'import-error', 
            args: [`Module import failed: ${error.message}`, error], 
            timestamp: Date.now() 
          });
          throw error;
        });
      };
    }
    
    // Capture React rendering errors using a different approach
    window.addEventListener('error', (event) => {
      window.interceptedLogs.push({
        type: 'window-error',
        args: [
          `Global error: ${event.message}`, 
          `File: ${event.filename}:${event.lineno}:${event.colno}`,
          event.error ? event.error.stack : 'No stack available'
        ],
        timestamp: Date.now()
      });
    });
    
    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      window.interceptedLogs.push({
        type: 'unhandled-rejection',
        args: [`Unhandled promise rejection: ${event.reason}`],
        timestamp: Date.now()
      });
    });
    
    // Try to hook into React when it becomes available
    Object.defineProperty(window, 'React', {
      set: function(value) {
        window._React = value;
        if (value && value.createElement) {
          const originalCreateElement = value.createElement;
          value.createElement = function(type, props, ...children) {
            try {
              return originalCreateElement.call(this, type, props, ...children);
            } catch (error) {
              window.interceptedLogs.push({
                type: 'react-create-element-error',
                args: [`React.createElement error: ${error.message}`, error.stack],
                timestamp: Date.now()
              });
              throw error;
            }
          };
        }
      },
      get: function() {
        return window._React;
      }
    });
  });

  try {
    console.log('🌐 Loading with deep error interception...');
    
    // Load the page and wait for scripts to execute
    await page.goto('http://localhost', { waitUntil: 'domcontentloaded' });
    
    console.log('⏳ Waiting for scripts to execute...');
    await page.waitForTimeout(3000);
    
    // Extract all intercepted logs
    const interceptedLogs = await page.evaluate(() => window.interceptedLogs || []);
    
    console.log(`📊 Intercepted ${interceptedLogs.length} log entries\n`);
    
    if (interceptedLogs.length > 0) {
      console.log('🔍 INTERCEPTED LOGS:');
      interceptedLogs.forEach((log, i) => {
        console.log(`\n${i + 1}. [${log.type.toUpperCase()}] (${new Date(log.timestamp).toISOString()})`);
        log.args.forEach((arg, j) => {
          console.log(`   ${j + 1}: ${arg}`);
        });
      });
    }
    
    // Check DOM state
    const rootHTML = await page.locator('#root').innerHTML();
    console.log(`\n📝 Root element content length: ${rootHTML.length}`);
    
    if (rootHTML.includes('Something went wrong')) {
      console.log('❌ Error boundary is active');
      
      // Try to extract more info from the DOM
      const errorText = await page.locator('body').textContent();
      if (errorText.includes('Error ID:')) {
        const errorIdMatch = errorText.match(/Error ID: (err-[\d\w-]+)/);
        if (errorIdMatch) {
          console.log(`🆔 Error ID: ${errorIdMatch[1]}`);
        }
      }
    } else if (rootHTML.length < 100) {
      console.log('❌ Root element is nearly empty - React not mounting');
    } else {
      console.log('✅ React appears to have mounted successfully');
    }
    
    // Check for specific React mount point
    const reactMounted = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    });
    
    console.log(`⚛️ React mounted: ${reactMounted}`);
    
    await page.screenshot({ path: 'deep-error-intercept.png', fullPage: true });
    console.log('\n📸 Screenshot saved');
    
  } catch (error) {
    console.log(`❌ SCRIPT ERROR: ${error.message}`);
  }
  
  await browser.close();
}

deepErrorIntercept().catch(console.error);