import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Final Validation - 100% Working Documents', () => {
  test.setTimeout(120000);

  test('Validate key documents and links work correctly', async ({ page }) => {
    const results = {
      passed: [],
      failed: []
    };

    // Test cases from user's specific complaints
    const criticalTests = [
      {
        name: 'Architecture diagram from future-mobility-consumer-platform',
        steps: async () => {
          await page.goto(`${BASE_URL}/docs/future-mobility-consumer-platform`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(3000);
          
          // Look for architecture files in sidebar
          const archFiles = await page.locator('text=/api-.*-diagrams\\.md/').all();
          console.log(`Found ${archFiles.length} architecture diagram files`);
          
          if (archFiles.length > 0) {
            // Click the first one
            await archFiles[0].click();
            await page.waitForTimeout(2000);
            
            // Check for error
            const hasError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                            await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
            
            if (hasError) {
              await page.screenshot({ path: 'test-results/FAILED-architecture-diagram.png', fullPage: true });
              return { success: false, error: 'Shows 404 error' };
            }
            
            // Check content loaded
            const hasContent = await page.locator('h1, h2, h3').first().isVisible({ timeout: 3000 });
            if (!hasContent) {
              return { success: false, error: 'No content visible' };
            }
            
            await page.screenshot({ path: 'test-results/SUCCESS-architecture-diagram.png', fullPage: true });
            return { success: true };
          } else {
            return { success: false, error: 'No architecture files found in sidebar' };
          }
        }
      },
      {
        name: 'GraphQL page for demo-labsdashboards',
        steps: async () => {
          await page.goto(`${BASE_URL}/graphql/demo-labsdashboards`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(3000);
          
          // Check page loaded
          const hasGraphQL = await page.locator('h1, h2').filter({ hasText: /graphql/i }).first().isVisible({ timeout: 3000 });
          
          await page.screenshot({ path: 'test-results/graphql-page.png', fullPage: true });
          
          if (!hasGraphQL) {
            return { success: false, error: 'GraphQL page not loading' };
          }
          
          return { success: true };
        }
      },
      {
        name: 'Postman collection page',
        steps: async () => {
          await page.goto(`${BASE_URL}/postman/future-mobility-consumer-platform`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(3000);
          
          // Check no broken postman.com links
          const brokenLinks = await page.locator('a[href*="app.getpostman.com"]').count();
          
          if (brokenLinks > 0) {
            return { success: false, error: `Found ${brokenLinks} links to app.getpostman.com` };
          }
          
          // Check "Get Collection" button exists
          const getCollectionBtn = await page.locator('button:has-text("Get Collection")').isVisible();
          
          if (!getCollectionBtn) {
            return { success: false, error: 'Get Collection button missing' };
          }
          
          await page.screenshot({ path: 'test-results/postman-page.png', fullPage: true });
          return { success: true };
        }
      },
      {
        name: 'Documentation sidebar shows files',
        steps: async () => {
          await page.goto(`${BASE_URL}/docs/rentalFleets`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(3000);
          
          // Check sidebar exists
          const sidebar = await page.locator('[class*="docSidebar"]').isVisible();
          if (!sidebar) {
            return { success: false, error: 'No sidebar visible' };
          }
          
          // Check Files header
          const filesHeader = await page.locator('text="📁 Files"').isVisible();
          if (!filesHeader) {
            return { success: false, error: 'No Files header in sidebar' };
          }
          
          // Count markdown files
          const mdFiles = await page.locator('[class*="fileTreeItem"]').filter({ hasText: /\.md$/ }).count();
          
          if (mdFiles === 0) {
            return { success: false, error: 'No markdown files visible in sidebar' };
          }
          
          await page.screenshot({ path: 'test-results/sidebar-with-files.png', fullPage: true });
          return { success: true, info: `${mdFiles} markdown files visible` };
        }
      },
      {
        name: 'Click and load multiple documents',
        steps: async () => {
          await page.goto(`${BASE_URL}/docs/smartpath`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(3000);
          
          // Get all visible markdown files
          const mdFiles = await page.locator('[class*="fileTreeItem"]').filter({ hasText: /\.md$/ }).all();
          const filesToTest = mdFiles.slice(0, 3); // Test first 3
          
          let successCount = 0;
          const errors = [];
          
          for (let i = 0; i < filesToTest.length; i++) {
            const fileName = await filesToTest[i].textContent();
            console.log(`Testing file: ${fileName}`);
            
            await filesToTest[i].click();
            await page.waitForTimeout(1500);
            
            const hasError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                            await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
            
            if (hasError) {
              errors.push(fileName);
            } else {
              successCount++;
            }
          }
          
          if (errors.length > 0) {
            return { success: false, error: `${errors.length} files failed: ${errors.join(', ')}` };
          }
          
          return { success: true, info: `All ${successCount} files loaded successfully` };
        }
      }
    ];

    // Run all tests
    for (const test of criticalTests) {
      console.log(`\n🧪 Testing: ${test.name}`);
      try {
        const result = await test.steps();
        if (result.success) {
          console.log(`   ✅ PASSED${result.info ? ': ' + result.info : ''}`);
          results.passed.push(test.name);
        } else {
          console.log(`   ❌ FAILED: ${result.error}`);
          results.failed.push({ name: test.name, error: result.error });
        }
      } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        results.failed.push({ name: test.name, error: error.message });
      }
    }

    // Final report
    console.log('\n' + '='.repeat(70));
    console.log('📊 FINAL VALIDATION RESULTS');
    console.log('='.repeat(70));
    console.log(`✅ Passed: ${results.passed.length}/${criticalTests.length}`);
    console.log(`❌ Failed: ${results.failed.length}/${criticalTests.length}`);
    
    if (results.failed.length > 0) {
      console.log('\nFailed tests:');
      results.failed.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
    }
    
    const successRate = (results.passed.length / criticalTests.length * 100).toFixed(0);
    console.log(`\nSuccess Rate: ${successRate}%`);
    
    if (successRate === '100') {
      console.log('\n🎉 100% PASS RATE ACHIEVED!');
    }
    
    // Fail if not 100%
    expect(results.failed.length).toBe(0);
  });
});