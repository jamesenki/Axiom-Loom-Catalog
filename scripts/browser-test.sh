#!/bin/bash
# Real browser testing that actually checks if users can use the app

echo "=== BROWSER TESTING - WHAT USERS ACTUALLY SEE ==="

# Create test script
cat > /tmp/browser-test.js << 'EOF'
const { chromium } = require('playwright');

async function testUserExperience() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  const networkErrors = [];
  
  // Capture all errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(`Page error: ${err.message}`);
  });
  
  page.on('requestfailed', request => {
    networkErrors.push(`Failed: ${request.url()} - ${request.failure()?.errorText}`);
  });
  
  page.on('response', response => {
    if (response.status() >= 400) {
      networkErrors.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });
  
  // Load the app
  console.log('Loading application...');
  await page.goto('http://localhost', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Check content
  const content = await page.textContent('body');
  
  // Save screenshot
  await page.screenshot({ path: 'test-result.png', fullPage: true });
  
  // Analyze results
  const hasError = content.includes('Something went wrong') || content.includes('Oops!');
  const hasLogin = await page.isVisible('input[type="email"]').catch(() => false);
  const hasContent = content.length > 500;
  
  // Report
  console.log('\n=== TEST RESULTS ===');
  console.log(`Page loaded: ${hasContent ? 'YES' : 'NO'}`);
  console.log(`Error page shown: ${hasError ? 'YES' : 'NO'}`);
  console.log(`Login form visible: ${hasLogin ? 'YES' : 'NO'}`);
  console.log(`Console errors: ${errors.length}`);
  console.log(`Network errors: ${networkErrors.length}`);
  
  if (errors.length > 0) {
    console.log('\nConsole errors:');
    errors.forEach(e => console.log(`  - ${e}`));
  }
  
  if (networkErrors.length > 0) {
    console.log('\nNetwork errors:');
    networkErrors.forEach(e => console.log(`  - ${e}`));
  }
  
  if (hasError) {
    console.log('\nError page content:');
    console.log(content.substring(0, 500));
  }
  
  await browser.close();
  
  // Return exit code
  if (hasError || errors.length > 0) {
    console.log('\n❌ TEST FAILED - APP IS BROKEN');
    process.exit(1);
  } else if (!hasLogin && !hasContent) {
    console.log('\n❌ TEST FAILED - NO CONTENT LOADED');
    process.exit(1);
  } else {
    console.log('\n✅ TEST PASSED - APP IS WORKING');
    process.exit(0);
  }
}

testUserExperience().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
EOF

# Install playwright if needed
if ! npm list playwright | grep -q playwright; then
  echo "Installing Playwright..."
  npm install -D playwright
fi

# Run the test
echo "Running browser test..."
node /tmp/browser-test.js

TEST_RESULT=$?

if [ $TEST_RESULT -ne 0 ]; then
  echo ""
  echo "=== DEPLOYMENT FAILED BROWSER TEST ==="
  echo "The app is showing an error page or not loading properly."
  echo "Check test-result.png to see what users are seeing."
  echo ""
  echo "To debug:"
  echo "  1. Open http://localhost in browser"
  echo "  2. Open DevTools console"
  echo "  3. Check for red errors"
  echo "  4. Check Network tab for failed requests"
  exit 1
fi

echo "Browser test passed!"