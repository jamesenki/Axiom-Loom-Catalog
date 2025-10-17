const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Step 1: Navigating to https://technical.axiomloom-loom.net');
  await page.goto('https://technical.axiomloom-loom.net', { waitUntil: 'networkidle' });

  console.log('Step 2: Taking screenshot of initial page load');
  await page.screenshot({ path: '/tmp/frontend-loaded.png', fullPage: true });
  console.log('Screenshot saved to /tmp/frontend-loaded.png');

  console.log('\nStep 3: Checking console for errors');
  const consoleMessages = [];
  const consoleErrors = [];

  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ type: msg.type(), text });
    if (msg.type() === 'error') {
      consoleErrors.push(text);
      console.log('  [CONSOLE ERROR]:', text);
    }
  });

  // Wait a bit for any console messages
  await page.waitForTimeout(3000);

  console.log('\nStep 4: Checking Network tab for API calls');
  const apiCalls = [];

  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/')) {
      apiCalls.push({
        url,
        status: response.status(),
        statusText: response.statusText()
      });
      console.log(`  API Call: ${response.status()} ${url}`);
    }
  });

  // Trigger a refresh to capture API calls
  console.log('\nStep 5: Refreshing page to capture API calls');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('\nStep 6: Checking for repository cards');
  const repoCards = await page.locator('[class*="repository"], [class*="card"], article, .repo-card').count();
  console.log(`  Found ${repoCards} potential repository elements`);

  // Check for specific content
  const hasContent = await page.locator('text=/cloudtwin|deploymaster|diagnostic/i').count();
  console.log(`  Found ${hasContent} elements with repository names`);

  console.log('\nStep 7: Taking final screenshot');
  await page.screenshot({ path: '/tmp/frontend-final.png', fullPage: true });
  console.log('Screenshot saved to /tmp/frontend-final.png');

  // Summary Report
  console.log('\n========================================');
  console.log('VERIFICATION REPORT');
  console.log('========================================');
  console.log(`Page loaded: YES`);
  console.log(`Console errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Errors found:');
    consoleErrors.forEach(err => console.log(`  - ${err}`));
  }
  console.log(`API calls made: ${apiCalls.length}`);
  if (apiCalls.length > 0) {
    apiCalls.forEach(call => {
      console.log(`  - ${call.status} ${call.url}`);
    });
  }
  console.log(`Repository content visible: ${hasContent > 0 ? 'YES' : 'NO'}`);
  console.log('========================================');

  const success = consoleErrors.length === 0 && apiCalls.some(c => c.status === 200) && hasContent > 0;
  console.log(`\nOVERALL STATUS: ${success ? 'SUCCESS ✓' : 'NEEDS ATTENTION ✗'}`);

  await browser.close();
  process.exit(success ? 0 : 1);
})();
