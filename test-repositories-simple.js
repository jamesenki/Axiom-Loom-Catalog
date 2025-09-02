const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, // Show browser for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    devtools: true
  });
  
  try {
    const page = await browser.newPage();
    
    // Capture console logs and errors
    const consoleErrors = [];
    const consoleWarnings = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      } else if (msg.type() === 'log') {
        console.log('Browser log:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      consoleErrors.push(`Page error: ${error.message}`);
    });
    
    console.log('🚀 Testing repository page visibility...\n');
    
    // Navigate to repositories page
    console.log('📄 Loading repositories page...');
    await page.goto('http://10.0.0.109:3000/', { 
      waitUntil: 'networkidle0', 
      timeout: 30000 
    });
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if any repository cards exist
    const cardCount = await page.$$eval('[data-testid="repository-card"]', els => els.length);
    console.log(`✅ Found ${cardCount} repository cards with data-testid`);
    
    // Also check for any cards without testid
    const allCards = await page.$$eval('div[class*="Card"], div[class*="card"], [class*="RepositoryCard"], [class*="repository-card"]', els => els.length);
    console.log(`🔍 Found ${allCards} total card-like elements`);
    
    // Check for any text that suggests repositories are loading
    const hasRepoText = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('repository') || text.includes('loading') || text.includes('api');
    });
    console.log(`📝 Has repository-related text: ${hasRepoText}`);
    
    // Check visibility of first card
    if (cardCount > 0) {
      const isVisible = await page.$eval('[data-testid="repository-card"]', el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          isInViewport: rect.top >= 0 && rect.left >= 0 && 
                       rect.bottom <= window.innerHeight && 
                       rect.right <= window.innerWidth
        };
      });
      
      console.log('🔍 First card visibility details:', JSON.stringify(isVisible, null, 2));
    }
    
    // Report console errors and warnings
    if (consoleErrors.length > 0) {
      console.log('❌ Console errors detected:');
      consoleErrors.forEach(err => console.log('  -', err));
    }
    
    if (consoleWarnings.length > 0) {
      console.log('⚠️  Console warnings:');
      consoleWarnings.slice(0, 5).forEach(warn => console.log('  -', warn));
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'repositories-debug.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved as repositories-debug.png');
    
    // Keep browser open for manual inspection
    console.log('🔬 Browser left open for manual inspection...');
    console.log('Press Ctrl+C to close when done');
    
    // Wait indefinitely to keep browser open
    await new Promise(() => {});
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();