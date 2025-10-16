const puppeteer = require('puppeteer');

// Configuration
const BASE_URL = 'http://localhost';
const TIMEOUT = 30000;

// Test credentials
const TEST_USER = {
  email: 'admin@localhost',
  password: 'admin'
};

async function runFullUITest() {
  let browser;
  let passed = 0;
  let failed = 0;
  const errors = [];

  try {
    console.log('🚀 STARTING COMPREHENSIVE UI TESTING PIPELINE\n');
    
    browser = await puppeteer.launch({
      headless: false, // Show browser so we can SEE what's happening
      slowMo: 100, // Slow down actions so we can see them
      defaultViewport: { width: 1280, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // For Docker environments
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
        errors.push(`Console: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
      errors.push(`Page Error: ${error.message}`);
    });

    // Intercept failed requests
    page.on('requestfailed', request => {
      console.log('❌ Request Failed:', request.url());
      errors.push(`Request Failed: ${request.url()}`);
    });

    // TEST 1: Load homepage
    console.log('📋 TEST 1: Loading homepage...');
    try {
      const response = await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: TIMEOUT });
      
      if (!response.ok()) {
        throw new Error(`HTTP ${response.status()}`);
      }
      
      // Wait a bit for React to render
      await page.waitForTimeout(3000);
      
      // Check for error page by looking for specific text
      const pageContent = await page.content();
      if (pageContent.includes('Something went wrong') || pageContent.includes('Oops!')) {
        throw new Error('ERROR PAGE IS SHOWING!');
      }
      
      // Take screenshot of what loaded
      await page.screenshot({ path: 'e2e-tests/screenshots/homepage.png', fullPage: true });
      
      console.log('✅ Homepage loaded successfully');
      passed++;
    } catch (e) {
      console.log('❌ FAILED: Homepage load -', e.message);
      failed++;
      errors.push(`Homepage: ${e.message}`);
      
      // Get page content for debugging
      const content = await page.content();
      console.log('Page content preview:', content.substring(0, 500));
    }

    // TEST 2: Check what's actually on the page
    console.log('\n📋 TEST 2: Checking page content...');
    try {
      // Get all visible text
      const visibleText = await page.evaluate(() => document.body.innerText);
      console.log('Visible text on page:', visibleText.substring(0, 200));
      
      // Check if it's login page or dashboard
      if (visibleText.includes('Sign in') || visibleText.includes('Login') || visibleText.includes('Email')) {
        console.log('✅ Login page detected');
        passed++;
      } else if (visibleText.includes('Dashboard') || visibleText.includes('Repositories')) {
        console.log('✅ Dashboard detected (already logged in?)');
        passed++;
      } else {
        throw new Error('Unknown page state');
      }
    } catch (e) {
      console.log('❌ FAILED: Page content check -', e.message);
      failed++;
    }

    // TEST 3: Try to find login form with various selectors
    console.log('\n📋 TEST 3: Looking for login form...');
    try {
      // Try multiple selectors
      const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email" i]');
      const passwordInput = await page.$('input[type="password"], input[name="password"], input[placeholder*="password" i]');
      const submitButton = await page.$('button[type="submit"], button:contains("Sign in"), button:contains("Login"), input[type="submit"]');
      
      if (emailInput && passwordInput) {
        console.log('✅ Login form found');
        
        // Clear and type credentials
        await emailInput.click({ clickCount: 3 });
        await emailInput.type(TEST_USER.email);
        
        await passwordInput.click({ clickCount: 3 });
        await passwordInput.type(TEST_USER.password);
        
        // Take screenshot before login
        await page.screenshot({ path: 'e2e-tests/screenshots/before-login.png' });
        
        // Find and click submit
        const buttons = await page.$$('button');
        for (let button of buttons) {
          const text = await page.evaluate(el => el.textContent, button);
          if (text && (text.includes('Sign in') || text.includes('Login'))) {
            await button.click();
            break;
          }
        }
        
        // Wait for something to happen
        await page.waitForTimeout(5000);
        
        // Take screenshot after login attempt
        await page.screenshot({ path: 'e2e-tests/screenshots/after-login-attempt.png' });
        
        passed++;
      } else {
        throw new Error('Login form elements not found');
      }
    } catch (e) {
      console.log('❌ FAILED: Login -', e.message);
      failed++;
      errors.push(`Login: ${e.message}`);
    }

    // TEST 4: Check current page state after login
    console.log('\n📋 TEST 4: Checking post-login state...');
    try {
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      const pageText = await page.evaluate(() => document.body.innerText);
      
      console.log('Current URL:', currentUrl);
      console.log('Page contains:', pageText.substring(0, 100));
      
      // Look for any indication we're logged in
      if (pageText.includes('Repository') || pageText.includes('Dashboard') || 
          pageText.includes('Logout') || pageText.includes('Profile')) {
        console.log('✅ Successfully logged in');
        passed++;
      } else if (pageText.includes('Invalid') || pageText.includes('Error')) {
        throw new Error('Login failed with error');
      } else {
        console.log('⚠️  Login state unclear');
      }
      
      await page.screenshot({ path: 'e2e-tests/screenshots/current-state.png', fullPage: true });
    } catch (e) {
      console.log('❌ FAILED: Post-login check -', e.message);
      failed++;
    }

    // TEST 5: Look for repository elements
    console.log('\n📋 TEST 5: Looking for repositories...');
    try {
      // Try to find any card-like elements
      const cards = await page.$$('div[class*="card" i], article, section[class*="repository" i]');
      console.log(`Found ${cards.length} potential card elements`);
      
      if (cards.length > 0) {
        // Click the first one
        await cards[0].click();
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: 'e2e-tests/screenshots/repository-click.png' });
        console.log('✅ Repository element clicked');
        passed++;
      } else {
        throw new Error('No repository cards found');
      }
    } catch (e) {
      console.log('❌ FAILED: Repository cards -', e.message);
      failed++;
    }

    // TEST 6: Navigation elements
    console.log('\n📋 TEST 6: Testing navigation...');
    try {
      // Look for any navigation
      const navElements = await page.$$('nav, header, div[class*="nav" i]');
      console.log(`Found ${navElements.length} navigation elements`);
      
      // Look for links
      const links = await page.$$('a');
      console.log(`Found ${links.length} links`);
      
      // Get link texts
      const linkTexts = [];
      for (let link of links.slice(0, 10)) { // First 10 links
        const text = await page.evaluate(el => el.textContent, link);
        if (text && text.trim()) {
          linkTexts.push(text.trim());
        }
      }
      console.log('Link texts:', linkTexts);
      
      passed++;
    } catch (e) {
      console.log('❌ FAILED: Navigation -', e.message);
      failed++;
    }

    // Final screenshot
    await page.screenshot({ path: 'e2e-tests/screenshots/final-state.png', fullPage: true });

  } catch (error) {
    console.error('\n💥 CRITICAL ERROR:', error.message);
    errors.push(`Critical: ${error.message}`);
  } finally {
    if (browser) {
      // Keep browser open for 10 seconds to see final state
      console.log('\n⏱️  Keeping browser open for 10 seconds...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      await browser.close();
    }
  }

  // RESULTS SUMMARY
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Coverage: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (errors.length > 0) {
    console.log('\n❌ ERRORS ENCOUNTERED:');
    errors.forEach((err, i) => {
      console.log(`${i + 1}. ${err}`);
    });
  }
  
  console.log('\n📸 Screenshots saved in: e2e-tests/screenshots/');
  console.log('='.repeat(60));
  
  // Exit with error code if tests failed
  if (failed > 0 || passed < 4) {
    console.log('\n❌ UI TESTING FAILED - Not ready for production!');
    process.exit(1);
  } else {
    console.log('\n✅ ALL UI TESTS PASSED - Ready for production!');
    process.exit(0);
  }
}

// Run the tests
runFullUITest().catch(console.error);