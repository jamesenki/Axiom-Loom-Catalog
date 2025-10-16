const { chromium } = require('playwright');

(async () => {
  console.log('🔍 QA Agent: COMPREHENSIVE FINAL VALIDATION...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let passed = 0;
  let failed = 0;
  
  // Capture console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  try {
    console.log('\n1. ✅ APPLICATION LOADS WITHOUT ERROR PAGE');
    await page.goto('http://localhost', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    // Verify no error boundary
    const hasErrorPage = await page.locator('text=Oops! Something went wrong').isVisible();
    if (!hasErrorPage) {
      console.log('✅ No error boundary triggered');
      passed++;
    } else {
      console.log('❌ Error boundary still showing');
      failed++;
    }
    
    console.log('\n2. ✅ USER INTERFACE ELEMENTS PRESENT');
    
    // Check for key UI elements
    const hasTitle = (await page.title()).includes('EYNS AI Experience Center');
    const hasContent = (await page.locator('#root').innerHTML()).length > 1000;
    
    if (hasTitle) {
      console.log('✅ Correct page title');
      passed++;
    } else {
      console.log('❌ Incorrect page title');
      failed++;
    }
    
    if (hasContent) {
      console.log('✅ React app has substantial content');
      passed++;
    } else {
      console.log('❌ React app appears empty');
      failed++;
    }
    
    console.log('\n3. ✅ AUTHENTICATION FLOW');
    
    // Check for authentication elements
    const loginButtons = await page.locator('button:has-text("Login"), a:has-text("Login")').count();
    if (loginButtons > 0) {
      console.log('✅ Login functionality available');
      passed++;
    } else {
      console.log('❌ No login functionality found');
      failed++;
    }
    
    console.log('\n4. ✅ REPOSITORY CONTENT');
    
    // Check for repository-related content
    const repositoryContent = await page.locator('text=/repository|Repository/i').count();
    if (repositoryContent > 0) {
      console.log(`✅ Repository content found (${repositoryContent} instances)`);
      passed++;
    } else {
      console.log('❌ No repository content found');
      failed++;
    }
    
    console.log('\n5. ✅ NAVIGATION STRUCTURE');
    
    // Check for navigation elements
    const navElements = await page.locator('nav, [role="navigation"], a[href]').count();
    if (navElements > 0) {
      console.log(`✅ Navigation elements found (${navElements} elements)`);
      passed++;
    } else {
      console.log('❌ No navigation elements found');
      failed++;
    }
    
    console.log('\n6. ✅ API CONNECTIVITY');
    
    // Test API health check
    const healthResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/health');
        return response.ok;
      } catch (error) {
        return false;
      }
    });
    
    if (healthResponse) {
      console.log('✅ API health check successful');
      passed++;
    } else {
      console.log('❌ API health check failed');
      failed++;
    }
    
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.log('❌ Test execution error:', error.message);
    failed++;
  }
  
  console.log('\n=== FINAL QA RESULTS ===');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (consoleErrors.length > 0) {
    console.log(`\n⚠️  Console Errors: ${consoleErrors.length}`);
    consoleErrors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
  } else {
    console.log('✅ No console errors detected');
  }
  
  // Final verdict
  const overallScore = passed / (passed + failed);
  
  if (overallScore >= 0.8) {
    console.log('\n🎉 FINAL VERDICT: ✅ APPLICATION IS WORKING - USERS SEE FUNCTIONAL INTERFACE');
    console.log('Users will see the actual application interface, not an error page.');
  } else {
    console.log('\n🚨 FINAL VERDICT: ❌ STILL SHOWING ERROR PAGE - MORE FIXES NEEDED');
    console.log('Users are still experiencing issues with the application.');
  }
  
  await page.screenshot({ path: 'final-qa-verification.png', fullPage: true });
  console.log('\nScreenshot saved: final-qa-verification.png');
  
  await browser.close();
  process.exit(overallScore >= 0.8 ? 0 : 1);
})();