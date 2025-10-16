const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runRealUITests() {
  console.log('🚀 REAL UI TESTING - WHAT USERS ACTUALLY SEE\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
    defaultViewport: { width: 1400, height: 900 }
  });
  
  const page = await browser.newPage();
  
  let testResults = {
    passed: [],
    failed: []
  };

  // Monitor console errors
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon')) {
      console.log('🔴 Console Error:', msg.text());
      testResults.failed.push(`Console error: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log('💥 Page Error:', error.message);
    testResults.failed.push(`Page error: ${error.message}`);
  });

  try {
    // TEST 1: Load the application
    console.log('TEST 1: Loading application...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await delay(3000); // Wait for React
    
    // Check if we see login page
    const pageContent = await page.content();
    const pageText = await page.evaluate(() => document.body.innerText);
    
    if (pageContent.includes('Something went wrong') || pageContent.includes('Oops!')) {
      testResults.failed.push('ERROR PAGE IS SHOWING!');
      console.log('❌ FAILED: Error page is displayed');
      await page.screenshot({ path: 'e2e-tests/screenshots/error-page.png', fullPage: true });
    } else if (pageText.includes('Sign In') || pageText.includes('Email')) {
      testResults.passed.push('Login page loaded');
      console.log('✅ PASSED: Login page loaded');
    } else {
      testResults.failed.push('Unknown page state');
      console.log('❌ FAILED: Unknown page state');
    }
    
    await page.screenshot({ path: 'e2e-tests/screenshots/01-initial-load.png', fullPage: true });

    // TEST 2: Fill login form
    console.log('\nTEST 2: Logging in...');
    try {
      // Find and fill email
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      await page.type('input[type="email"]', 'admin@localhost');
      
      // Find and fill password
      await page.waitForSelector('input[type="password"]', { timeout: 5000 });
      await page.type('input[type="password"]', 'admin');
      
      await page.screenshot({ path: 'e2e-tests/screenshots/02-login-filled.png' });
      
      // Click login button - find by text
      const buttons = await page.$$('button');
      let loginClicked = false;
      
      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text && text.includes('Sign In')) {
          await button.click();
          loginClicked = true;
          break;
        }
      }
      
      if (!loginClicked) {
        throw new Error('Login button not found');
      }
      
      // Wait for navigation or error
      await delay(5000);
      
      const afterLoginText = await page.evaluate(() => document.body.innerText);
      await page.screenshot({ path: 'e2e-tests/screenshots/03-after-login.png', fullPage: true });
      
      if (afterLoginText.includes('Repository') || afterLoginText.includes('Dashboard') || 
          afterLoginText.includes('Logout')) {
        testResults.passed.push('Login successful');
        console.log('✅ PASSED: Login successful');
      } else if (afterLoginText.includes('Invalid') || afterLoginText.includes('Error')) {
        testResults.failed.push('Login failed with error');
        console.log('❌ FAILED: Login error');
      } else {
        testResults.failed.push('Login state unclear');
        console.log('❌ FAILED: Login state unclear');
      }
      
    } catch (e) {
      testResults.failed.push(`Login failed: ${e.message}`);
      console.log('❌ FAILED: Login -', e.message);
    }

    // TEST 3: Check for repository cards
    console.log('\nTEST 3: Looking for repository cards...');
    await delay(2000);
    
    const cards = await page.$$('[class*="card"]');
    console.log(`Found ${cards.length} card elements`);
    
    if (cards.length > 0) {
      testResults.passed.push(`Found ${cards.length} repository cards`);
      console.log(`✅ PASSED: Found ${cards.length} cards`);
      
      // Click first card
      await cards[0].click();
      await delay(3000);
      await page.screenshot({ path: 'e2e-tests/screenshots/04-card-clicked.png', fullPage: true });
    } else {
      testResults.failed.push('No repository cards found');
      console.log('❌ FAILED: No cards found');
    }

    // TEST 4: Look for key UI elements
    console.log('\nTEST 4: Checking UI elements...');
    const elements = {
      'Documentation': '[href*="/docs"], button:has-text("Docs"), a:has-text("Documentation")',
      'API Explorer': '[href*="/api"], button:has-text("API"), a:has-text("API")',
      'Postman': '[href*="/postman"], button:has-text("Postman")',
      'Navigation': 'nav, header',
      'Search': 'input[type="search"], input[placeholder*="Search"]'
    };
    
    for (const [name, selector] of Object.entries(elements)) {
      try {
        // Simple selector check
        const element = await page.$(selector.split(',')[0]);
        if (element) {
          testResults.passed.push(`${name} found`);
          console.log(`✅ ${name} found`);
        } else {
          testResults.failed.push(`${name} not found`);
          console.log(`❌ ${name} not found`);
        }
      } catch (e) {
        testResults.failed.push(`${name} selector error`);
        console.log(`❌ ${name} - selector error`);
      }
    }

    // Final screenshot
    await page.screenshot({ path: 'e2e-tests/screenshots/05-final-state.png', fullPage: true });

  } catch (error) {
    console.error('\n💥 CRITICAL ERROR:', error.message);
    testResults.failed.push(`Critical: ${error.message}`);
  }

  // Keep browser open for manual inspection
  console.log('\n⏳ Browser will stay open for 30 seconds for inspection...');
  await delay(30000);
  
  await browser.close();

  // FINAL RESULTS
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testResults.passed.length}`);
  console.log(`❌ Failed: ${testResults.failed.length}`);
  console.log(`📈 Success Rate: ${Math.round((testResults.passed.length / (testResults.passed.length + testResults.failed.length)) * 100)}%`);
  
  if (testResults.passed.length > 0) {
    console.log('\n✅ PASSED TESTS:');
    testResults.passed.forEach(test => console.log(`  - ${test}`));
  }
  
  if (testResults.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.failed.forEach(test => console.log(`  - ${test}`));
  }
  
  console.log('\n📸 Screenshots saved in e2e-tests/screenshots/');
  console.log('='.repeat(60));
  
  const successRate = (testResults.passed.length / (testResults.passed.length + testResults.failed.length)) * 100;
  
  if (successRate < 100) {
    console.log('\n🚨 UI TESTS FAILED - NOT PRODUCTION READY!');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL UI TESTS PASSED - PRODUCTION READY!');
    process.exit(0);
  }
}

runRealUITests().catch(console.error);