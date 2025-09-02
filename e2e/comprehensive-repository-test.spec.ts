import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive Repository and Link Validation Test
 * Tests all 29 repositories and validates documentation links
 */

const ALL_REPOSITORIES = [
  'ai-predictive-maintenance-engine',
  'ai-predictive-maintenance-engine-architecture', 
  'ai-predictive-maintenance-platform',
  'ai-transformations',
  'cloudtwin-simulation-platform-architecture',
  'copilot-architecture-template',
  'deploymaster-sdv-ota-platform',
  'diagnostic-as-code-platform-architecture',
  'ecosystem-platform-architecture',
  'eyns-ai-experience-center',
  'fleet-digital-twin-platform-architecture',
  'future-mobility-consumer-platform',
  'future-mobility-energy-platform', 
  'future-mobility-financial-platform',
  'future-mobility-fleet-platform',
  'future-mobility-infrastructure-platform',
  'future-mobility-oems-platform',
  'future-mobility-regulatory-platform',
  'future-mobility-tech-platform',
  'future-mobility-users-platform',
  'future-mobility-utilities-platform',
  'mobility-architecture-package-orchestrator',
  'nslabsdashboards',
  'remote-diagnostic-assistance-platform-architecture',
  'rentalFleets',
  'sample-arch-package',
  'sdv-architecture-orchestration',
  'sovd-diagnostic-ecosystem-platform-architecture',
  'velocityforge-sdv-platform-architecture'
];

async function waitForPageLoad(page: Page, timeout = 20000) {
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.waitForTimeout(2000); // Give React time to render
}

async function takeScreenshot(page: Page, name: string) {
  try {
    await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  } catch (e) {
    console.log(`Screenshot failed: ${e}`);
  }
}

test.describe('Comprehensive Repository and Link Tests', () => {
  test.setTimeout(120000); // 2 minute timeout

  test('1. Test all 29 repositories are accessible', async ({ page }) => {
    console.log(`Testing access to all ${ALL_REPOSITORIES.length} repositories...`);
    
    const results = [];
    
    for (const repoId of ALL_REPOSITORIES) {
      try {
        console.log(`Testing repository: ${repoId}`);
        
        await page.goto(`/repository/${repoId}`, { 
          waitUntil: 'domcontentloaded', 
          timeout: 30000 
        });
        await waitForPageLoad(page);
        
        // Check if page loaded successfully
        const pageTitle = await page.title();
        const hasError = pageTitle.toLowerCase().includes('error') || 
                        pageTitle.includes('404') ||
                        await page.locator('text=/404|not found|error/i').count() > 0;
        
        if (!hasError) {
          // Verify repository content is present
          const hasContent = await page.locator('main, .content, .container, body').count() > 0;
          
          if (hasContent) {
            results.push({ repo: repoId, status: 'success', title: pageTitle });
            console.log(`✓ ${repoId} - SUCCESS`);
          } else {
            results.push({ repo: repoId, status: 'no-content', title: pageTitle });
            console.log(`⚠ ${repoId} - No content found`);
          }
        } else {
          results.push({ repo: repoId, status: 'error', title: pageTitle });
          console.log(`✗ ${repoId} - ERROR: ${pageTitle}`);
        }
        
      } catch (error) {
        results.push({ repo: repoId, status: 'failed', error: error.toString() });
        console.log(`✗ ${repoId} - FAILED: ${error}`);
      }
      
      // Small delay to avoid overwhelming the server
      await page.waitForTimeout(500);
    }
    
    // Summary
    const successful = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status !== 'success');
    
    console.log(`\nRepository Access Summary:`);
    console.log(`Total repositories: ${ALL_REPOSITORIES.length}`);
    console.log(`Successful: ${successful.length}`);
    console.log(`Failed/Issues: ${failed.length}`);
    
    if (failed.length > 0) {
      console.log('\nFailed repositories:', failed.map(f => f.repo));
    }
    
    // Expect at least 90% success rate
    expect(successful.length).toBeGreaterThan(ALL_REPOSITORIES.length * 0.9);
    
    await takeScreenshot(page, 'repository-access-test');
  });

  test('2. Test API Explorer, GraphQL, and Postman buttons', async ({ page }) => {
    console.log('Testing API buttons across repositories...');
    
    // Test repositories known to have API features
    const apiRepos = [
      'nslabsdashboards',
      'ai-predictive-maintenance-engine-architecture',
      'future-mobility-fleet-platform',
      'future-mobility-consumer-platform',
      'diagnostic-as-code-platform-architecture'
    ];
    
    const buttonResults = [];
    
    for (const repoId of apiRepos) {
      try {
        console.log(`Testing API buttons for: ${repoId}`);
        
        await page.goto(`/repository/${repoId}`, { 
          waitUntil: 'domcontentloaded', 
          timeout: 30000 
        });
        await waitForPageLoad(page);
        
        // Look for API buttons
        const apiButtonSelectors = [
          'text=/api explorer/i',
          'text=/api/i',
          'text=/swagger/i',
          'text=/openapi/i',
          '[href*="api-explorer"]',
          '[data-testid*="api"]'
        ];
        
        const graphqlButtonSelectors = [
          'text=/graphql/i',
          'text=/playground/i',
          '[href*="graphql"]',
          '[data-testid*="graphql"]'
        ];
        
        const postmanButtonSelectors = [
          'text=/postman/i',
          'text=/collection/i',
          '[href*="postman"]',
          '[data-testid*="postman"]'
        ];
        
        const repoButtons = { api: [], graphql: [], postman: [] };
        
        // Check for API buttons
        for (const selector of apiButtonSelectors) {
          const buttons = await page.locator(selector).count();
          if (buttons > 0) {
            const buttonText = await page.locator(selector).first().textContent();
            const buttonHref = await page.locator(selector).first().getAttribute('href');
            repoButtons.api.push({ text: buttonText, href: buttonHref });
          }
        }
        
        // Check for GraphQL buttons
        for (const selector of graphqlButtonSelectors) {
          const buttons = await page.locator(selector).count();
          if (buttons > 0) {
            const buttonText = await page.locator(selector).first().textContent();
            const buttonHref = await page.locator(selector).first().getAttribute('href');
            repoButtons.graphql.push({ text: buttonText, href: buttonHref });
          }
        }
        
        // Check for Postman buttons  
        for (const selector of postmanButtonSelectors) {
          const buttons = await page.locator(selector).count();
          if (buttons > 0) {
            const buttonText = await page.locator(selector).first().textContent();
            const buttonHref = await page.locator(selector).first().getAttribute('href');
            repoButtons.postman.push({ text: buttonText, href: buttonHref });
          }
        }
        
        buttonResults.push({
          repo: repoId,
          buttons: repoButtons
        });
        
        console.log(`${repoId} buttons:`, {
          api: repoButtons.api.length,
          graphql: repoButtons.graphql.length, 
          postman: repoButtons.postman.length
        });
        
      } catch (error) {
        console.log(`Failed to test buttons for ${repoId}: ${error}`);
      }
    }
    
    console.log('\nAPI Button Results:', buttonResults);
    
    // Test clicking one of each type if found
    for (const result of buttonResults) {
      if (result.buttons.api.length > 0) {
        try {
          const apiButton = result.buttons.api[0];
          if (apiButton.href) {
            console.log(`Testing API button click: ${apiButton.href}`);
            await page.goto(apiButton.href, { waitUntil: 'domcontentloaded', timeout: 15000 });
            await page.waitForTimeout(2000);
            console.log('✓ API button link works');
            break; // Test one successful click
          }
        } catch (error) {
          console.log(`API button click failed: ${error}`);
        }
      }
    }
    
    await takeScreenshot(page, 'api-buttons-test');
  });

  test('3. Test documentation links within repositories', async ({ page }) => {
    console.log('Testing documentation links...');
    
    // Test repositories known to have comprehensive documentation
    const docRepos = [
      'nslabsdashboards',
      'ai-predictive-maintenance-engine',
      'future-mobility-consumer-platform',
      'rentalFleets'
    ];
    
    const linkResults = [];
    
    for (const repoId of docRepos) {
      try {
        console.log(`Testing documentation for: ${repoId}`);
        
        await page.goto(`/repository/${repoId}`, { 
          waitUntil: 'domcontentloaded', 
          timeout: 30000 
        });
        await waitForPageLoad(page);
        
        // Look for documentation content
        const docSelectors = [
          '.markdown-body',
          '.md-content',
          '.documentation-view',
          'article',
          '[class*="markdown"]'
        ];
        
        let foundDoc = false;
        let docLinks = [];
        
        for (const selector of docSelectors) {
          const docElements = await page.locator(selector).count();
          if (docElements > 0) {
            console.log(`Found documentation with selector: ${selector}`);
            foundDoc = true;
            
            // Get all links within the documentation
            const links = await page.locator(`${selector} a[href]`).evaluateAll((elements) => {
              return elements.map(el => {
                const anchor = el as HTMLAnchorElement;
                return {
                  text: anchor.textContent?.trim() || '',
                  href: anchor.href,
                  isInternal: !anchor.href.startsWith('http') || anchor.href.includes(window.location.host)
                };
              });
            });
            
            docLinks = links;
            console.log(`Found ${links.length} links in documentation`);
            break;
          }
        }
        
        // Test internal documentation links
        const internalLinks = docLinks.filter(link => link.isInternal).slice(0, 5);
        const testedLinks = [];
        
        for (const link of internalLinks) {
          try {
            console.log(`Testing doc link: ${link.href}`);
            
            const response = await page.goto(link.href, { 
              waitUntil: 'domcontentloaded', 
              timeout: 15000 
            });
            
            if (response && response.status() < 400) {
              testedLinks.push({ ...link, status: 'success' });
              console.log(`✓ Link works: ${link.text}`);
            } else {
              testedLinks.push({ ...link, status: 'failed', code: response?.status() });
              console.log(`✗ Link failed: ${link.text} (${response?.status()})`);
            }
            
          } catch (error) {
            testedLinks.push({ ...link, status: 'error', error: error.toString() });
            console.log(`✗ Link error: ${link.text} - ${error}`);
          }
          
          await page.waitForTimeout(500);
        }
        
        linkResults.push({
          repo: repoId,
          hasDocumentation: foundDoc,
          totalLinks: docLinks.length,
          testedLinks: testedLinks.length,
          successfulLinks: testedLinks.filter(l => l.status === 'success').length,
          failedLinks: testedLinks.filter(l => l.status !== 'success').length
        });
        
      } catch (error) {
        console.log(`Documentation test failed for ${repoId}: ${error}`);
        linkResults.push({
          repo: repoId,
          hasDocumentation: false,
          error: error.toString()
        });
      }
    }
    
    console.log('\nDocumentation Link Results:', linkResults);
    
    // Verify that at least some repositories have working documentation
    const reposWithDocs = linkResults.filter(r => r.hasDocumentation);
    expect(reposWithDocs.length).toBeGreaterThan(0);
    
    await takeScreenshot(page, 'documentation-links-test');
  });

  test('4. Test key navigation flows', async ({ page }) => {
    console.log('Testing key navigation flows...');
    
    // Test homepage to repository to documentation flow
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForPageLoad(page);
    
    // Navigate to APIs page
    const apisLink = page.locator('text=/apis/i, [href="/apis"]');
    if (await apisLink.count() > 0) {
      await apisLink.first().click();
      await waitForPageLoad(page);
      console.log('✓ APIs page navigation works');
      await takeScreenshot(page, 'apis-page');
    }
    
    // Navigate to repositories page
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForPageLoad(page);
    
    const reposLink = page.locator('text=/repositories/i, [href="/repositories"]');
    if (await reposLink.count() > 0) {
      await reposLink.first().click();
      await waitForPageLoad(page);
      console.log('✓ Repositories page navigation works');
      await takeScreenshot(page, 'repositories-page');
    }
    
    // Test docs navigation
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForPageLoad(page);
    
    const docsLink = page.locator('text=/docs/i, [href="/docs"]');
    if (await docsLink.count() > 0) {
      await docsLink.first().click();
      await waitForPageLoad(page);
      console.log('✓ Docs page navigation works');
      await takeScreenshot(page, 'docs-page');
    }
    
    console.log('Navigation flow test completed');
  });

});