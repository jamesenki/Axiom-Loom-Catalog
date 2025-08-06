const { chromium } = require('playwright');

(async () => {
  console.log('🔍 QA Agent: Starting comprehensive frontend testing...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let passed = 0;
  let failed = 0;
  const errors = [];
  
  // Capture console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('❌ Console error:', msg.text());
    }
  });
  
  // Capture network failures
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`❌ Network error: ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    console.log('\n1. Testing page load...');
    await page.goto('http://localhost', { waitUntil: 'networkidle' });
    
    // Check for title
    const title = await page.title();
    if (title.includes('EYNS AI Experience Center')) {
      console.log('✅ Page title correct');
      passed++;
    } else {
      console.log('❌ Page title incorrect:', title);
      failed++;
      errors.push('Incorrect page title');
    }
    
    // Check for React root element
    const rootElement = await page.locator('#root').first();
    const rootContent = await rootElement.innerHTML();
    if (rootContent.length > 100) {
      console.log('✅ React app mounted with content');
      passed++;
    } else {
      console.log('❌ React app not mounted or empty');
      failed++;
      errors.push('React app not mounted');
    }
    
    await page.waitForTimeout(3000);
    
    console.log('\n2. Testing login flow...');
    // Look for login elements
    const loginButton = page.locator('text=Login').first();
    if (await loginButton.isVisible()) {
      console.log('✅ Login button found');
      await loginButton.click();
      passed++;
    } else {
      console.log('❌ Login button not found');
      failed++;
      errors.push('Login button not found');
    }
    
    await page.waitForTimeout(2000);
    
    // Check if we're on login page or if there's a login form
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      console.log('✅ Login form visible');
      
      // Fill login form
      await emailInput.fill('admin@localhost');
      await passwordInput.fill('admin');
      
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();
      passed++;
      
      await page.waitForTimeout(3000);
      
      // Check if login was successful
      const logoutButton = page.locator('text=Logout').first();
      if (await logoutButton.isVisible()) {
        console.log('✅ Login successful - logout button visible');
        passed++;
      } else {
        console.log('❌ Login may have failed - no logout button');
        failed++;
        errors.push('Login failed');
      }
    } else {
      console.log('❌ Login form not visible');
      failed++;
      errors.push('Login form not visible');
    }
    
    console.log('\n3. Testing repository list...');
    // Look for repository cards or list
    await page.waitForTimeout(3000);
    const repoCards = page.locator('[data-testid="repository-card"]');
    const repoCount = await repoCards.count();
    
    if (repoCount > 0) {
      console.log(`✅ Found ${repoCount} repository cards`);
      passed++;
    } else {
      // Try alternative selectors
      const alternativeRepos = page.locator('text=repository').first();
      if (await alternativeRepos.isVisible()) {
        console.log('✅ Repository content found (alternative selector)');
        passed++;
      } else {
        console.log('❌ No repository content found');
        failed++;
        errors.push('No repository content');
      }
    }
    
    console.log('\n4. Testing navigation...');
    // Try to navigate to different sections
    const navLinks = page.locator('nav a');
    const navCount = await navLinks.count();
    
    if (navCount > 0) {
      console.log(`✅ Found ${navCount} navigation links`);
      passed++;
    } else {
      console.log('❌ No navigation links found');
      failed++;
      errors.push('No navigation links');
    }
    
    await page.waitForTimeout(2000);
    
  } catch (error) {
    console.log('❌ Test execution error:', error.message);
    failed++;
    errors.push(error.message);
  }
  
  console.log('\n=== QA TEST RESULTS ===');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (consoleErrors.length > 0) {
    console.log(`\n🚨 Console Errors Found: ${consoleErrors.length}`);
    consoleErrors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
    failed += consoleErrors.length;
  } else {
    console.log('✅ No console errors detected');
  }
  
  if (errors.length > 0) {
    console.log('\n🚨 Issues Found:');
    errors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
  }
  
  // Final verdict
  if (failed === 0) {
    console.log('\n🎉 VERDICT: ✅ Application is working - users see functional interface');
  } else {
    console.log('\n🚨 VERDICT: ❌ Still showing error page - more fixes needed');
  }
  
  await browser.close();
  process.exit(failed === 0 ? 0 : 1);
})();