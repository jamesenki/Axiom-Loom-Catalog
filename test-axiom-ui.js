const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Collect errors
    const errors = [];
    const warnings = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(`Page error: ${error.message}`);
    });
    
    console.log('🚀 Testing Axiom Loom Catalog UI...\n');
    
    // Test homepage
    console.log('📄 Loading homepage...');
    await page.goto('http://10.0.0.109:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Check for Axiom Loom branding
    const hasAxiomLoom = await page.evaluate(() => {
      return document.body.innerText.includes('Axiom Loom');
    });
    console.log(`✅ Axiom Loom branding: ${hasAxiomLoom ? 'Found' : 'Missing'}`);
    
    // Check navigation
    const navItems = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('nav a, header a').forEach(a => {
        items.push(a.innerText);
      });
      return items;
    });
    console.log(`✅ Navigation items: ${navItems.join(', ')}`);
    
    // Check for error messages
    const errorMessage = await page.evaluate(() => {
      const errorEl = document.querySelector('[class*="error"], [class*="Error"], text*="Failed"');
      return errorEl ? errorEl.innerText : null;
    });
    
    if (errorMessage) {
      console.log(`⚠️  Error message on page: ${errorMessage}`);
    }
    
    // Test repositories page
    console.log('\n📦 Testing Repositories page...');
    await page.click('a[href="/repositories"]');
    await page.waitForTimeout(3000);
    
    // Check for repository cards
    const repoCount = await page.evaluate(() => {
      return document.querySelectorAll('[class*="card"], [class*="Card"], div:has(h3)').length;
    });
    console.log(`✅ Repository cards found: ${repoCount}`);
    
    // Test APIs page
    console.log('\n🔌 Testing APIs page...');
    await page.click('a[href*="api"], a:has-text("APIs")');
    await page.waitForTimeout(3000);
    
    const apiContent = await page.evaluate(() => {
      return document.body.innerText.includes('API') || document.body.innerText.includes('GraphQL');
    });
    console.log(`✅ API content: ${apiContent ? 'Found' : 'Missing'}`);
    
    // Report errors
    console.log('\n📊 Test Summary:');
    console.log(`- Errors: ${errors.length}`);
    console.log(`- Warnings: ${warnings.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors detected:');
      errors.slice(0, 10).forEach(err => {
        console.log(`  - ${err.substring(0, 100)}...`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.slice(0, 5).forEach(warn => {
        console.log(`  - ${warn.substring(0, 100)}...`);
      });
    }
    
    // Take screenshot
    await page.screenshot({ path: 'axiom-loom-current-state.png', fullPage: true });
    console.log('\n📸 Screenshot saved as axiom-loom-current-state.png');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();