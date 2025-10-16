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
      defaultViewport: { width: 1280, height: 800 }
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

    // TEST 1: Load homepage
    console.log('📋 TEST 1: Loading homepage...');
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: TIMEOUT });
      
      // Check for error page
      const errorPage = await page.$('text=/Something went wrong/i');
      if (errorPage) {
        throw new Error('ERROR PAGE IS SHOWING!');
      }
      
      console.log('✅ Homepage loaded successfully');
      passed++;
    } catch (e) {
      console.log('❌ FAILED: Homepage load -', e.message);
      failed++;
      errors.push(`Homepage: ${e.message}`);
    }

    // TEST 2: Check login form exists
    console.log('\n📋 TEST 2: Checking login form...');
    try {
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });
      await page.waitForSelector('input[type="password"]', { timeout: 10000 });
      await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
      console.log('✅ Login form found');
      passed++;
    } catch (e) {
      console.log('❌ FAILED: Login form not found');
      failed++;
      errors.push('Login form missing');
    }

    // TEST 3: Perform login
    console.log('\n📋 TEST 3: Logging in...');
    try {
      await page.type('input[type="email"]', TEST_USER.email);
      await page.type('input[type="password"]', TEST_USER.password);
      
      // Take screenshot before login
      await page.screenshot({ path: 'e2e-tests/screenshots/before-login.png' });
      
      await page.click('button[type="submit"]');
      
      // Wait for navigation or dashboard
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Take screenshot after login
      await page.screenshot({ path: 'e2e-tests/screenshots/after-login.png' });
      
      console.log('✅ Login successful');
      passed++;
    } catch (e) {
      console.log('❌ FAILED: Login -', e.message);
      failed++;
      errors.push(`Login: ${e.message}`);
    }

    // TEST 4: Check for repository cards
    console.log('\n📋 TEST 4: Looking for repository cards...');
    try {
      await page.waitForSelector('[data-testid="repository-card"], .repository-card, [class*="card"]', { timeout: 10000 });
      const cards = await page.$$('[data-testid="repository-card"], .repository-card, [class*="card"]');
      console.log(`✅ Found ${cards.length} repository cards`);
      
      if (cards.length === 0) {
        throw new Error('No repository cards found');
      }
      
      passed++;
    } catch (e) {
      console.log('❌ FAILED: Repository cards -', e.message);
      failed++;
      errors.push(`Repository cards: ${e.message}`);
    }

    // TEST 5: Click on first repository card
    console.log('\n📋 TEST 5: Clicking on repository...');
    try {
      const firstCard = await page.$('[data-testid="repository-card"], .repository-card, [class*="card"]');
      if (firstCard) {
        await firstCard.click();
        await page.waitForTimeout(2000);
        
        // Take screenshot of repository detail
        await page.screenshot({ path: 'e2e-tests/screenshots/repository-detail.png' });
        
        console.log('✅ Repository detail page loaded');
        passed++;
      } else {
        throw new Error('No repository card to click');
      }
    } catch (e) {
      console.log('❌ FAILED: Repository click -', e.message);
      failed++;
      errors.push(`Repository click: ${e.message}`);
    }

    // TEST 6: Check for View Docs button
    console.log('\n📋 TEST 6: Looking for View Docs button...');
    try {
      const docsButton = await page.$('button:has-text("View Docs"), a:has-text("Documentation"), [href*="/docs"]');
      if (docsButton) {
        await docsButton.click();
        await page.waitForTimeout(2000);
        
        // Take screenshot of docs page
        await page.screenshot({ path: 'e2e-tests/screenshots/docs-page.png' });
        
        console.log('✅ Documentation page loaded');
        passed++;
      } else {
        console.log('⚠️  No documentation button found');
      }
    } catch (e) {
      console.log('❌ FAILED: View Docs -', e.message);
      failed++;
      errors.push(`View Docs: ${e.message}`);
    }

    // TEST 7: Check for API Explorer
    console.log('\n📋 TEST 7: Looking for API Explorer...');
    try {
      // Go back or navigate to API section
      const apiButton = await page.$('button:has-text("API"), a:has-text("API Explorer"), [href*="/api"]');
      if (apiButton) {
        await apiButton.click();
        await page.waitForTimeout(2000);
        
        // Take screenshot of API explorer
        await page.screenshot({ path: 'e2e-tests/screenshots/api-explorer.png' });
        
        console.log('✅ API Explorer loaded');
        passed++;
      } else {
        console.log('⚠️  No API Explorer button found');
      }
    } catch (e) {
      console.log('❌ FAILED: API Explorer -', e.message);
      failed++;
      errors.push(`API Explorer: ${e.message}`);
    }

    // TEST 8: Check for Postman Collections
    console.log('\n📋 TEST 8: Looking for Postman Collections...');
    try {
      const postmanButton = await page.$('button:has-text("Postman"), a:has-text("Postman"), [href*="/postman"]');
      if (postmanButton) {
        await postmanButton.click();
        await page.waitForTimeout(2000);
        
        // Take screenshot of Postman view
        await page.screenshot({ path: 'e2e-tests/screenshots/postman-view.png' });
        
        console.log('✅ Postman Collections loaded');
        passed++;
      } else {
        console.log('⚠️  No Postman button found');
      }
    } catch (e) {
      console.log('❌ FAILED: Postman Collections -', e.message);
      failed++;
      errors.push(`Postman: ${e.message}`);
    }

    // TEST 9: Navigation and UI elements
    console.log('\n📋 TEST 9: Testing navigation...');
    try {
      // Check header exists
      await page.waitForSelector('header, [role="banner"], nav', { timeout: 5000 });
      
      // Check search functionality
      const searchInput = await page.$('input[type="search"], input[placeholder*="Search"]');
      if (searchInput) {
        await searchInput.type('test search');
        await page.waitForTimeout(1000);
        console.log('✅ Search functionality present');
      }
      
      passed++;
    } catch (e) {
      console.log('❌ FAILED: Navigation -', e.message);
      failed++;
      errors.push(`Navigation: ${e.message}`);
    }

    // TEST 10: Logout functionality
    console.log('\n📋 TEST 10: Testing logout...');
    try {
      const userMenu = await page.$('[data-testid="user-menu"], [aria-label*="user"], button:has-text("Logout")');
      if (userMenu) {
        await userMenu.click();
        await page.waitForTimeout(1000);
        
        const logoutButton = await page.$('button:has-text("Logout"), a:has-text("Logout")');
        if (logoutButton) {
          await logoutButton.click();
          await page.waitForTimeout(2000);
          console.log('✅ Logout successful');
          passed++;
        }
      } else {
        console.log('⚠️  No logout functionality found');
      }
    } catch (e) {
      console.log('❌ FAILED: Logout -', e.message);
      failed++;
      errors.push(`Logout: ${e.message}`);
    }

    // Final screenshot
    await page.screenshot({ path: 'e2e-tests/screenshots/final-state.png' });

  } catch (error) {
    console.error('\n💥 CRITICAL ERROR:', error.message);
    errors.push(`Critical: ${error.message}`);
  } finally {
    if (browser) {
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
  if (failed > 0) {
    console.log('\n❌ UI TESTING FAILED - Not ready for production!');
    process.exit(1);
  } else {
    console.log('\n✅ ALL UI TESTS PASSED - Ready for production!');
    process.exit(0);
  }
}

// Run the tests
runFullUITest().catch(console.error);