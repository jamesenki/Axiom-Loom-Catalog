const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Testing EYNS AI Experience Center...\n');
  
  // Test 1: Homepage
  console.log('1. Testing homepage...');
  await page.goto('http://localhost:3000');
  const title = await page.title();
  console.log(`   ✓ Title: ${title}`);
  
  // Check for error messages
  const errorText = await page.textContent('body');
  if (errorText.includes('Error Loading Repositories')) {
    console.log('   ✗ ERROR: Still getting "Error Loading Repositories"');
    console.log('   The API fix did not work!');
  } else {
    console.log('   ✓ No error messages found');
  }
  
  // Test 2: Check if repositories are displayed
  console.log('\n2. Checking for repositories...');
  await page.waitForTimeout(2000); // Give time for data to load
  
  const repoCards = await page.locator('[data-testid="repository-card"], .repository-card, [class*="Card"]').count();
  if (repoCards > 0) {
    console.log(`   ✓ Found ${repoCards} repository cards`);
  } else {
    console.log('   ✗ No repository cards found');
    
    // Try to find any text mentioning repositories
    const bodyText = await page.textContent('body');
    if (bodyText.includes('ai-predictive-maintenance')) {
      console.log('   ✓ Repository names found in text');
    } else {
      console.log('   ✗ No repository data visible');
    }
  }
  
  // Test 3: Navigate to repositories page
  console.log('\n3. Testing repositories page...');
  await page.goto('http://localhost:3000/repositories');
  await page.waitForTimeout(2000);
  
  const reposPageText = await page.textContent('body');
  if (reposPageText.includes('Error Loading Repositories')) {
    console.log('   ✗ ERROR: Repositories page shows error');
  } else if (reposPageText.includes('ai-') || reposPageText.includes('cloudtwin')) {
    console.log('   ✓ Repository data visible on repositories page');
  } else {
    console.log('   ? Cannot determine if repositories are loading');
  }
  
  // Test 4: Check console errors
  console.log('\n4. Checking for console errors...');
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  await page.reload();
  await page.waitForTimeout(2000);
  
  if (errors.length > 0) {
    console.log(`   ✗ Found ${errors.length} console errors:`);
    errors.slice(0, 3).forEach(e => console.log(`     - ${e.substring(0, 100)}`));
  } else {
    console.log('   ✓ No console errors');
  }
  
  // Test 5: Check API calls
  console.log('\n5. Monitoring API calls...');
  const apiCalls = [];
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      apiCalls.push(request.url());
    }
  });
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  if (apiCalls.length > 0) {
    console.log(`   ✓ Made ${apiCalls.length} API calls:`);
    apiCalls.forEach(url => console.log(`     - ${url}`));
  } else {
    console.log('   ✗ No API calls detected - THIS IS THE PROBLEM!');
  }
  
  // Summary
  console.log('\n=== SUMMARY ===');
  if (errorText.includes('Error Loading Repositories')) {
    console.log('❌ APP IS STILL BROKEN - API calls not working');
    console.log('The frontend is not calling the backend API correctly.');
    console.log('Need to check if REACT_APP_API_URL is being used in production build.');
  } else if (repoCards > 0) {
    console.log('✅ APP IS WORKING - Repositories are loading!');
  } else {
    console.log('⚠️ APP STATUS UNCLEAR - Need manual verification');
  }
  
  await browser.close();
})();