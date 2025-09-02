const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Capture all console output
    const logs = [];
    page.on('console', msg => {
      logs.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    page.on('pageerror', error => {
      logs.push({
        type: 'pageerror',
        text: error.message
      });
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        logs.push({
          type: 'api',
          text: `API ${response.url()} - Status: ${response.status()}`
        });
      }
    });
    
    console.log('🔍 Debugging Axiom Loom Application State...\n');
    
    // Navigate to homepage
    console.log('Loading homepage...');
    await page.goto('http://10.0.0.109:3000/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    // Wait a bit for React to render
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get page content
    const pageContent = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent || 'No title';
      const error = document.querySelector('[class*="error"], [class*="Error"]')?.textContent || null;
      const cardCount = document.querySelectorAll('[data-testid="repository-card"]').length;
      const bodyText = document.body.innerText.substring(0, 500);
      
      // Check React root
      const reactRoot = document.getElementById('root');
      const hasReactApp = reactRoot && reactRoot.children.length > 0;
      
      return {
        title,
        error,
        cardCount,
        hasReactApp,
        bodyPreview: bodyText
      };
    });
    
    console.log('\n📊 Page State:');
    console.log('- Title:', pageContent.title);
    console.log('- React App Loaded:', pageContent.hasReactApp);
    console.log('- Repository Cards:', pageContent.cardCount);
    console.log('- Error Message:', pageContent.error || 'None');
    
    console.log('\n📝 Page Content Preview:');
    console.log(pageContent.bodyPreview);
    
    console.log('\n🔧 Console Logs:');
    const importantLogs = logs.filter(log => 
      log.type === 'error' || 
      log.type === 'pageerror' || 
      log.type === 'api' ||
      log.text.includes('RepositoryList') ||
      log.text.includes('Error') ||
      log.text.includes('Failed')
    );
    
    importantLogs.forEach(log => {
      console.log(`[${log.type}] ${log.text.substring(0, 200)}`);
    });
    
    // Check for specific issues
    const apiLogs = logs.filter(l => l.type === 'api');
    if (apiLogs.length > 0) {
      console.log('\n🌐 API Calls:');
      apiLogs.forEach(log => console.log(log.text));
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-current-state.png', fullPage: true });
    console.log('\n📸 Screenshot saved as debug-current-state.png');
    
  } catch (error) {
    console.error('Debug failed:', error.message);
  } finally {
    await browser.close();
  }
})();