import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('Verify CONTRIBUTING.md link behavior in rentalFleets', async ({ page }) => {
  // Navigate to rentalFleets docs
  await page.goto(`${BASE_URL}/docs/rentalFleets`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  console.log('\nChecking for CONTRIBUTING.md link in README content...');
  
  // Look for the CONTRIBUTING.md link in the main content (not sidebar)
  const contributingLinkInContent = page.locator('main a[href*="CONTRIBUTING.md"]').first();
  const hasLinkInContent = await contributingLinkInContent.isVisible({ timeout: 2000 });
  
  console.log(`CONTRIBUTING.md link in README content: ${hasLinkInContent}`);
  
  if (hasLinkInContent) {
    console.log('Found link in content - clicking it...');
    
    // Click the link
    await contributingLinkInContent.click();
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/contributing-link-clicked.png', fullPage: true });
    
    // Check for error
    const hasError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                    await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
    
    if (hasError) {
      console.log('❌ Shows 404 error - this is the issue user reported!');
      console.log('\nTHE PROBLEM:');
      console.log('1. README.md contains a link to CONTRIBUTING.md');
      console.log('2. CONTRIBUTING.md file does not exist');
      console.log('3. When user clicks the link, they get a 404 error');
      console.log('\nTHE FIX:');
      console.log('Either:');
      console.log('a) Create the CONTRIBUTING.md file in rentalFleets repo, OR');
      console.log('b) Remove the link from README.md, OR');
      console.log('c) Handle broken internal links gracefully in the UI');
    } else {
      console.log('✅ No error shown');
    }
  } else {
    console.log('No CONTRIBUTING.md link found in content');
  }
  
  // Check sidebar to confirm CONTRIBUTING.md is NOT there
  console.log('\nConfirming CONTRIBUTING.md is NOT in sidebar...');
  const sidebarContributing = page.locator('[class*="docSidebar"] text="CONTRIBUTING.md"');
  const inSidebar = await sidebarContributing.isVisible({ timeout: 1000 });
  console.log(`CONTRIBUTING.md in sidebar: ${inSidebar}`);
  
  if (!inSidebar) {
    console.log('✅ CORRECT: File tree sidebar does NOT show non-existent CONTRIBUTING.md');
  }
});