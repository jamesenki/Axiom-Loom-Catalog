import { test, expect, Page } from '@playwright/test';

/**
 * FOCUSED LINK VALIDATION TEST
 * 
 * This test focuses on identifying and fixing the key issues found in the comprehensive test:
 * 1. Debug why documentation is not loading properly
 * 2. Test critical navigation flows
 * 3. Identify authentication or permission issues
 */

const BASE_URL = 'http://localhost:3000';

async function waitForPageLoad(page: Page, timeout = 15000) {
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.waitForTimeout(2000);
}

async function capturePageState(page: Page, testName: string) {
  const currentUrl = page.url();
  const pageTitle = await page.title();
  
  // Check for common error indicators
  const hasError = await page.locator('text=/error|404|unauthorized|401|403|not found|failed|something went wrong/i').count() > 0;
  const hasContent = await page.locator('main, .content, article, body > div').count() > 0;
  
  // Capture console errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  const state = {
    testName,
    url: currentUrl,
    title: pageTitle,
    hasError,
    hasContent,
    timestamp: new Date().toISOString()
  };
  
  console.log(`📊 Page State - ${testName}:`);
  console.log(`  URL: ${state.url}`);
  console.log(`  Title: ${state.title}`);
  console.log(`  Has Error: ${state.hasError}`);
  console.log(`  Has Content: ${state.hasContent}`);
  
  // Take screenshot for evidence
  await page.screenshot({ 
    path: `test-results/focused-${testName.toLowerCase().replace(/\s+/g, '-')}.png`, 
    fullPage: true 
  });
  
  return state;
}

test.describe('Focused Link Validation & Debugging', () => {
  test.setTimeout(120000); // 2 minute timeout

  test('1. Debug homepage and basic navigation', async ({ page }) => {
    console.log('\n🔍 Testing Homepage and Basic Navigation');
    
    // Test homepage
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);
    const homeState = await capturePageState(page, 'Homepage');
    
    expect(homeState.hasContent).toBe(true);
    expect(homeState.hasError).toBe(false);
    
    // Test repositories page
    const reposLink = page.locator('text=/repositories/i, [href="/repositories"]').first();
    if (await reposLink.count() > 0) {
      await reposLink.click();
      await waitForPageLoad(page);
      const reposState = await capturePageState(page, 'Repositories Page');
      
      // Verify repositories are listed
      const repoCards = await page.locator('[data-testid*="repo"], .repository-card, .repo-card, div:has-text("demo-labsdashboards")').count();
      console.log(`  Found ${repoCards} repository elements`);
      
      expect(reposState.hasContent).toBe(true);
    }
  });

  test('2. Test specific repository access and buttons', async ({ page }) => {
    console.log('\n🔍 Testing Repository Access');
    
    // Test demo-labsdashboards - known working repository
    const testRepo = 'demo-labsdashboards';
    const repoUrl = `${BASE_URL}/repository/${testRepo}`;
    
    await page.goto(repoUrl, { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);
    const repoState = await capturePageState(page, `Repository ${testRepo}`);
    
    // Look for common UI elements on repository page
    const hasTitle = await page.locator('h1, h2').count() > 0;
    const hasDescription = await page.locator('p, div[class*="description"]').count() > 0;
    const hasButtons = await page.locator('button, a[class*="button"], .btn').count() > 0;
    
    console.log(`  Has Title: ${hasTitle}`);
    console.log(`  Has Description: ${hasDescription}`);
    console.log(`  Has Buttons: ${hasButtons}`);
    
    // Look for specific action buttons
    const buttons = {
      documentation: await page.locator('text=/documentation|docs|readme/i').count(),
      api: await page.locator('text=/api|swagger|openapi/i').count(),
      postman: await page.locator('text=/postman|collection/i').count(),
      graphql: await page.locator('text=/graphql|playground/i').count()
    };
    
    console.log(`  Button counts:`, buttons);
    
    expect(repoState.hasContent).toBe(true);
  });

  test('3. Test documentation loading with debugging', async ({ page }) => {
    console.log('\n🔍 Testing Documentation Loading');
    
    const testRepo = 'demo-labsdashboards';
    await page.goto(`${BASE_URL}/repository/${testRepo}`, { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);
    
    // Try to find and click documentation link
    const docSelectors = [
      'text=/documentation/i',
      'text=/docs/i',
      'text=/readme/i',
      'text=/view documentation/i',
      'button:has-text("Documentation")',
      'a:has-text("Documentation")',
      '[href*="docs"]'
    ];
    
    let docLinkFound = false;
    let documentationUrl = '';
    
    for (const selector of docSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`  Found documentation link with selector: ${selector}`);
        docLinkFound = true;
        
        try {
          const docLink = page.locator(selector).first();
          await docLink.click();
          await waitForPageLoad(page);
          
          documentationUrl = page.url();
          const docState = await capturePageState(page, `Documentation ${testRepo}`);
          
          // Check what's actually on the documentation page
          const contentTypes = {
            markdown: await page.locator('.markdown-body, .md-content').count(),
            headings: await page.locator('h1, h2, h3, h4, h5, h6').count(),
            paragraphs: await page.locator('p').count(),
            lists: await page.locator('ul, ol').count(),
            codeBlocks: await page.locator('pre, code').count()
          };
          
          console.log(`  Documentation URL: ${documentationUrl}`);
          console.log(`  Content analysis:`, contentTypes);
          
          // Check for specific error messages or loading states
          const errorMessages = await page.locator('text=/loading|error|unauthorized|401|403|not found|failed to load/i').allTextContents();
          if (errorMessages.length > 0) {
            console.log(`  ⚠️ Error messages found:`, errorMessages);
          }
          
          break;
        } catch (error) {
          console.log(`  ❌ Failed to click documentation link: ${error}`);
        }
      }
    }
    
    if (!docLinkFound) {
      console.log(`  ⚠️ No documentation link found for ${testRepo}`);
      
      // Try direct documentation URL
      const directDocUrl = `${BASE_URL}/docs/${testRepo}`;
      console.log(`  Trying direct documentation URL: ${directDocUrl}`);
      
      await page.goto(directDocUrl, { waitUntil: 'domcontentloaded' });
      await waitForPageLoad(page);
      const directDocState = await capturePageState(page, `Direct Docs ${testRepo}`);
      
      documentationUrl = directDocUrl;
    }
    
    console.log(`  Final documentation test result: ${docLinkFound ? 'SUCCESS' : 'FAILED'}`);
  });

  test('4. Test API pages and error handling', async ({ page }) => {
    console.log('\n🔍 Testing API Pages');
    
    // Test APIs page
    await page.goto(`${BASE_URL}/apis`, { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);
    const apisState = await capturePageState(page, 'APIs Page');
    
    // Test Docs page
    await page.goto(`${BASE_URL}/docs`, { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);
    const docsState = await capturePageState(page, 'Docs Page');
    
    // Check what's actually causing the "Generic error message detected"
    const errorElements = await page.locator('text=/error|failed|something went wrong/i').allTextContents();
    if (errorElements.length > 0) {
      console.log(`  Error messages on docs page:`, errorElements);
    }
    
    // Test specific API endpoints
    const apiEndpoints = [
      '/api/repositories',
      '/api/health',
      '/api/status'
    ];
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await page.request.get(`${BASE_URL}${endpoint}`);
        console.log(`  ${endpoint}: ${response.status()}`);
      } catch (error) {
        console.log(`  ${endpoint}: ERROR - ${error}`);
      }
    }
  });

  test('5. Test authentication and headers', async ({ page }) => {
    console.log('\n🔍 Testing Authentication and Headers');
    
    // Set development headers that might be required
    await page.setExtraHTTPHeaders({
      'x-dev-mode': 'true',
      'Authorization': 'Bearer dev-token'
    });
    
    // Test repository with headers
    const testRepo = 'demo-labsdashboards';
    await page.goto(`${BASE_URL}/repository/${testRepo}`, { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);
    
    // Now try documentation with headers
    const docUrl = `${BASE_URL}/docs/${testRepo}`;
    await page.goto(docUrl, { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);
    const docWithHeadersState = await capturePageState(page, 'Docs With Headers');
    
    // Check if headers helped with loading
    const hasDocContent = await page.locator('.markdown-body, .md-content, article').count() > 0;
    const hasError = await page.locator('text=/401|403|unauthorized|error/i').count() > 0;
    
    console.log(`  Documentation loaded with headers: ${hasDocContent > 0}`);
    console.log(`  Still has errors: ${hasError > 0}`);
    
    if (hasDocContent > 0) {
      console.log('  ✅ Headers resolved the documentation loading issue!');
    }
  });

  test.afterAll(async () => {
    console.log('\n📋 FOCUSED TEST SUMMARY');
    console.log('Check the test-results/ directory for screenshots and detailed analysis');
    console.log('Key findings will help identify the root causes of link validation issues');
  });
});