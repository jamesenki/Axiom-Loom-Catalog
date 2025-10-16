const { chromium } = require('playwright');
const fs = require('fs');

async function testApplication() {
  console.log('=== CRITICAL QA TESTING: What Users Actually See ===\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Track console errors
  const consoleErrors = [];
  const networkErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log(`❌ CONSOLE ERROR: ${msg.text()}`);
    }
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      networkErrors.push(`${response.status()} ${response.url()}`);
      console.log(`❌ NETWORK ERROR: ${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log('🌐 Navigating to http://localhost...');
    await page.goto('http://localhost', { waitUntil: 'networkidle' });
    
    // Take screenshot of what users see
    await page.screenshot({ path: 'user-experience-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved: user-experience-screenshot.png');
    
    // Check page title
    const title = await page.title();
    console.log(`📋 Page Title: "${title}"`);
    
    // Check if root element has content
    const rootContent = await page.locator('#root').innerHTML();
    console.log(`📝 Root Element Content Length: ${rootContent.length} characters`);
    
    if (rootContent.length < 100) {
      console.log('❌ CRITICAL: Root element appears to be empty or minimal!');
      console.log('Root content:', rootContent.substring(0, 200));
    }
    
    // Check for error boundaries or error messages
    const errorElements = await page.locator('text=Oops! Something went wrong').count();
    const errorBoundary = await page.locator('[data-testid="error-boundary"]').count();
    
    console.log(`🚨 "Oops! Something went wrong" messages found: ${errorElements}`);
    console.log(`🚨 Error boundary elements found: ${errorBoundary}`);
    
    // Wait a bit for any dynamic content
    await page.waitForTimeout(3000);
    
    // Check for loading states
    const loadingElements = await page.locator('text=Loading').count();
    console.log(`⏳ Loading elements still present: ${loadingElements}`);
    
    // Try to find main navigation or key UI elements
    const navElements = await page.locator('nav').count();
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    
    console.log(`🧭 Navigation elements: ${navElements}`);
    console.log(`🔘 Button elements: ${buttons}`);
    console.log(`🔗 Link elements: ${links}`);
    
    // Test login flow if login page exists
    console.log('\n🔐 Testing login flow...');
    try {
      await page.goto('http://localhost/login', { waitUntil: 'networkidle' });
      const loginForm = await page.locator('form').count();
      console.log(`📝 Login forms found: ${loginForm}`);
      
      if (loginForm > 0) {
        // Try to login
        const emailInput = await page.locator('input[type="email"]').count();
        const passwordInput = await page.locator('input[type="password"]').count();
        const submitButton = await page.locator('button[type="submit"]').count();
        
        console.log(`📧 Email inputs: ${emailInput}`);
        console.log(`🔒 Password inputs: ${passwordInput}`);
        console.log(`🚀 Submit buttons: ${submitButton}`);
        
        if (emailInput > 0 && passwordInput > 0 && submitButton > 0) {
          console.log('🧪 Attempting login...');
          await page.fill('input[type="email"]', 'admin@localhost');
          await page.fill('input[type="password"]', 'admin');
          await page.click('button[type="submit"]');
          await page.waitForTimeout(2000);
          
          // Check if redirected or logged in
          const currentUrl = page.url();
          console.log(`🔄 Post-login URL: ${currentUrl}`);
        }
      }
    } catch (loginError) {
      console.log(`❌ Login test error: ${loginError.message}`);
    }
    
    // Final screenshot after all tests
    await page.screenshot({ path: 'final-state-screenshot.png', fullPage: true });
    
  } catch (error) {
    console.log(`❌ CRITICAL ERROR: ${error.message}`);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  }
  
  console.log('\n=== SUMMARY ===');
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log(`Network Errors: ${networkErrors.length}`);
  
  if (consoleErrors.length > 0) {
    console.log('\n❌ CONSOLE ERRORS:');
    consoleErrors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (networkErrors.length > 0) {
    console.log('\n❌ NETWORK ERRORS:');
    networkErrors.forEach(error => console.log(`  - ${error}`));
  }
  
  await browser.close();
}

testApplication().catch(console.error);