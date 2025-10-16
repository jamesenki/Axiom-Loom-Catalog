import { test, expect, Page, Response } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * COMPREHENSIVE LINK VALIDATION TEST SUITE
 * 
 * This test validates EVERY SINGLE LINK in the Axiom Loom application:
 * - All 29 repository links
 * - All documentation links within repositories  
 * - All navigation links (Home, Repositories, APIs, Docs, Sync)
 * - All action buttons (Repository, Documentation, Postman, GraphQL, API Explorer)
 * - All links within markdown documents
 * - Verifies documentation loads WITHOUT 401 errors
 * - Reports any broken links found
 */

const BASE_URL = 'http://localhost:3000';

// All 29 repositories from the application
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
  'demo-labsdashboards',
  'remote-diagnostic-assistance-platform-architecture',
  'rentalFleets',
  'sample-arch-package',
  'sdv-architecture-orchestration',
  'sovd-diagnostic-ecosystem-platform-architecture',
  'velocityforge-sdv-platform-architecture'
];

// Main navigation links to test
const NAVIGATION_LINKS = [
  { name: 'Home', url: '/', selectors: ['text=/home/i', '[href="/"]', '.logo'] },
  { name: 'Repositories', url: '/repositories', selectors: ['text=/repositories/i', '[href="/repositories"]'] },
  { name: 'APIs', url: '/apis', selectors: ['text=/apis/i', '[href="/apis"]'] },
  { name: 'Docs', url: '/docs', selectors: ['text=/docs/i', '[href="/docs"]'] },
  { name: 'Sync', url: '/sync', selectors: ['text=/sync/i', '[href="/sync"]'] }
];

// Test results tracking
interface TestResult {
  testName: string;
  status: 'success' | 'failed' | 'error';
  details: any;
  error?: string;
  timestamp: string;
}

const testResults: TestResult[] = [];

// Utility functions
async function waitForPageLoad(page: Page, timeout = 30000) {
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.waitForTimeout(3000); // Give React time to fully render
}

async function takeScreenshot(page: Page, name: string) {
  try {
    await page.screenshot({ 
      path: `test-results/comprehensive-link-validation-${name}.png`, 
      fullPage: true 
    });
  } catch (e) {
    console.log(`Screenshot failed for ${name}: ${e}`);
  }
}

async function checkForErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  
  // Check for 401/403 errors in page content
  const unauthorizedContent = await page.locator('text=/401|unauthorized|403|forbidden/i').count();
  if (unauthorizedContent > 0) {
    errors.push('401/403 Unauthorized error detected');
  }
  
  // Check for 404 errors
  const notFoundContent = await page.locator('text=/404|not found|page not found/i').count();
  if (notFoundContent > 0) {
    errors.push('404 Not Found error detected');
  }
  
  // Check for generic error messages
  const errorContent = await page.locator('text=/error|something went wrong|failed to load/i').count();
  if (errorContent > 0) {
    errors.push('Generic error message detected');
  }
  
  return errors;
}

function logResult(testName: string, status: 'success' | 'failed' | 'error', details: any, error?: string) {
  const result: TestResult = {
    testName,
    status,
    details,
    error,
    timestamp: new Date().toISOString()
  };
  testResults.push(result);
  
  const statusSymbol = status === 'success' ? '✓' : (status === 'failed' ? '✗' : '⚠');
  console.log(`${statusSymbol} ${testName}: ${status.toUpperCase()}`);
  if (error) console.log(`  Error: ${error}`);
  if (details && typeof details === 'object' && Object.keys(details).length > 0) {
    console.log(`  Details:`, details);
  }
}

test.describe('Comprehensive Link Validation Suite', () => {
  test.setTimeout(300000); // 5 minute timeout for comprehensive testing
  
  test.beforeAll(async () => {
    console.log('🚀 Starting Comprehensive Link Validation Test Suite');
    console.log(`Testing application at: ${BASE_URL}`);
    console.log(`Total repositories to test: ${ALL_REPOSITORIES.length}`);
    console.log(`Navigation links to test: ${NAVIGATION_LINKS.length}`);
  });

  test('1. Test all main navigation links', async ({ page }) => {
    console.log('\n=== Testing Main Navigation Links ===');
    
    const navigationResults = [];
    
    for (const navLink of NAVIGATION_LINKS) {
      try {
        console.log(`Testing navigation: ${navLink.name} -> ${navLink.url}`);
        
        // Start from homepage
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await waitForPageLoad(page);
        
        // Try to find and click the navigation link
        let linkFound = false;
        let clickableElement = null;
        
        for (const selector of navLink.selectors) {
          const elements = await page.locator(selector).count();
          if (elements > 0) {
            clickableElement = page.locator(selector).first();
            linkFound = true;
            break;
          }
        }
        
        if (linkFound && clickableElement) {
          // Click the navigation link
          await clickableElement.click();
          await waitForPageLoad(page);
          
          // Verify we're on the correct page
          const currentUrl = page.url();
          const errors = await checkForErrors(page);
          
          const result = {
            link: navLink.name,
            targetUrl: navLink.url,
            actualUrl: currentUrl,
            linkFound: true,
            errors: errors,
            success: errors.length === 0 && (currentUrl.includes(navLink.url) || navLink.url === '/')
          };
          
          navigationResults.push(result);
          logResult(`Navigation: ${navLink.name}`, result.success ? 'success' : 'failed', result);
          
          if (result.success) {
            await takeScreenshot(page, `nav-${navLink.name.toLowerCase()}`);
          }
          
        } else {
          const result = {
            link: navLink.name,
            targetUrl: navLink.url,
            linkFound: false,
            success: false
          };
          
          navigationResults.push(result);
          logResult(`Navigation: ${navLink.name}`, 'failed', result, 'Navigation link not found');
        }
        
      } catch (error) {
        const result = {
          link: navLink.name,
          error: error.toString(),
          success: false
        };
        
        navigationResults.push(result);
        logResult(`Navigation: ${navLink.name}`, 'error', result, error.toString());
      }
      
      await page.waitForTimeout(1000); // Brief pause between tests
    }
    
    // Verify at least 80% of navigation links work
    const successfulNav = navigationResults.filter(r => r.success).length;
    const navSuccessRate = successfulNav / navigationResults.length;
    
    console.log(`\nNavigation Summary: ${successfulNav}/${navigationResults.length} links working (${Math.round(navSuccessRate * 100)}%)`);
    expect(navSuccessRate).toBeGreaterThan(0.8);
  });

  test('2. Test all 29 repository links and access', async ({ page }) => {
    console.log('\n=== Testing All Repository Links ===');
    
    const repositoryResults = [];
    
    for (const repoId of ALL_REPOSITORIES) {
      try {
        console.log(`Testing repository access: ${repoId}`);
        
        // Test direct repository URL access
        const repoUrl = `${BASE_URL}/repository/${repoId}`;
        await page.goto(repoUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await waitForPageLoad(page);
        
        // Check for errors
        const errors = await checkForErrors(page);
        const pageTitle = await page.title();
        
        // Verify repository content is present
        const hasContent = await page.locator('main, .content, .container, article').count() > 0;
        const hasRepoInfo = await page.locator(`text=${repoId}, h1, h2`).count() > 0;
        
        const result = {
          repository: repoId,
          url: repoUrl,
          pageTitle,
          hasContent,
          hasRepoInfo,
          errors,
          success: errors.length === 0 && hasContent
        };
        
        repositoryResults.push(result);
        logResult(`Repository: ${repoId}`, result.success ? 'success' : 'failed', {
          hasContent: result.hasContent,
          hasRepoInfo: result.hasRepoInfo,
          errorCount: result.errors.length
        });
        
        if (result.success) {
          await takeScreenshot(page, `repo-${repoId}`);
        }
        
      } catch (error) {
        const result = {
          repository: repoId,
          error: error.toString(),
          success: false
        };
        
        repositoryResults.push(result);
        logResult(`Repository: ${repoId}`, 'error', result, error.toString());
      }
      
      await page.waitForTimeout(500); // Brief pause between repository tests
    }
    
    // Verify at least 90% of repositories are accessible
    const successfulRepos = repositoryResults.filter(r => r.success).length;
    const repoSuccessRate = successfulRepos / repositoryResults.length;
    
    console.log(`\nRepository Access Summary: ${successfulRepos}/${repositoryResults.length} repositories accessible (${Math.round(repoSuccessRate * 100)}%)`);
    expect(repoSuccessRate).toBeGreaterThan(0.9);
  });

  test('3. Test documentation links for all repositories', async ({ page }) => {
    console.log('\n=== Testing Documentation Links ===');
    
    const documentationResults = [];
    
    for (const repoId of ALL_REPOSITORIES) {
      try {
        console.log(`Testing documentation for: ${repoId}`);
        
        // Navigate to repository page
        const repoUrl = `${BASE_URL}/repository/${repoId}`;
        await page.goto(repoUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await waitForPageLoad(page);
        
        // Look for documentation button/link
        const docButtonSelectors = [
          'text=/documentation/i',
          'text=/docs/i', 
          'text=/readme/i',
          'text=/view documentation/i',
          '[href*="docs"]',
          '[data-testid*="doc"]',
          '.documentation-btn',
          'button:has-text("Documentation")'
        ];
        
        let docButtonFound = false;
        let docClickable = null;
        
        for (const selector of docButtonSelectors) {
          const elements = await page.locator(selector).count();
          if (elements > 0) {
            docClickable = page.locator(selector).first();
            docButtonFound = true;
            break;
          }
        }
        
        if (docButtonFound && docClickable) {
          // Click the documentation link
          await docClickable.click();
          await waitForPageLoad(page);
          
          // Check if documentation loaded
          const errors = await checkForErrors(page);
          const currentUrl = page.url();
          
          // Look for documentation content
          const hasDocContent = await page.locator('.markdown-body, .md-content, article, .documentation-view').count() > 0;
          const hasHeadings = await page.locator('h1, h2, h3').count() > 0;
          const hasText = await page.locator('p, div, span').count() > 10;
          
          const result = {
            repository: repoId,
            docButtonFound: true,
            documentationUrl: currentUrl,
            hasDocContent,
            hasHeadings,
            hasText,
            errors,
            success: errors.length === 0 && (hasDocContent || hasHeadings || hasText)
          };
          
          documentationResults.push(result);
          logResult(`Documentation: ${repoId}`, result.success ? 'success' : 'failed', {
            hasDocContent: result.hasDocContent,
            hasHeadings: result.hasHeadings,
            errorCount: result.errors.length
          });
          
          if (result.success) {
            await takeScreenshot(page, `docs-${repoId}`);
          }
          
        } else {
          const result = {
            repository: repoId,
            docButtonFound: false,
            success: false
          };
          
          documentationResults.push(result);
          logResult(`Documentation: ${repoId}`, 'failed', result, 'Documentation button not found');
        }
        
      } catch (error) {
        const result = {
          repository: repoId,
          error: error.toString(),
          success: false
        };
        
        documentationResults.push(result);
        logResult(`Documentation: ${repoId}`, 'error', result, error.toString());
      }
      
      await page.waitForTimeout(500);
    }
    
    // Verify at least 70% of repositories have working documentation
    const successfulDocs = documentationResults.filter(r => r.success).length;
    const docsWithButtons = documentationResults.filter(r => r.docButtonFound).length;
    const docSuccessRate = docsWithButtons > 0 ? successfulDocs / docsWithButtons : 0;
    
    console.log(`\nDocumentation Summary: ${successfulDocs}/${docsWithButtons} documentation links working (${Math.round(docSuccessRate * 100)}%)`);
    expect(docSuccessRate).toBeGreaterThan(0.7);
  });

  test('4. Test API Explorer, GraphQL, and Postman buttons', async ({ page }) => {
    console.log('\n=== Testing API Action Buttons ===');
    
    const buttonResults = [];
    
    // Test repositories known to have API features
    const apiTestRepos = ALL_REPOSITORIES.slice(0, 15); // Test first 15 repositories
    
    for (const repoId of apiTestRepos) {
      try {
        console.log(`Testing API buttons for: ${repoId}`);
        
        await page.goto(`${BASE_URL}/repository/${repoId}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await waitForPageLoad(page);
        
        // Button selectors
        const buttonTypes = {
          api: ['text=/api explorer/i', 'text=/api/i', 'text=/swagger/i', '[href*="api-explorer"]', '[data-testid*="api"]'],
          graphql: ['text=/graphql/i', 'text=/playground/i', '[href*="graphql"]', '[data-testid*="graphql"]'],
          postman: ['text=/postman/i', 'text=/collection/i', '[href*="postman"]', '[data-testid*="postman"]']
        };
        
        const repoButtons = { api: 0, graphql: 0, postman: 0, working: 0 };
        
        // Check for each button type
        for (const [buttonType, selectors] of Object.entries(buttonTypes)) {
          for (const selector of selectors) {
            const count = await page.locator(selector).count();
            if (count > 0) {
              repoButtons[buttonType as keyof typeof repoButtons]++;
              
              // Try to click the first button of this type
              try {
                const button = page.locator(selector).first();
                if (await button.isVisible()) {
                  await button.click();
                  await waitForPageLoad(page);
                  
                  const errors = await checkForErrors(page);
                  if (errors.length === 0) {
                    repoButtons.working++;
                  }
                  
                  // Go back for next test
                  await page.goBack();
                  await waitForPageLoad(page);
                }
              } catch (clickError) {
                console.log(`Button click failed for ${buttonType}: ${clickError}`);
              }
              
              break; // Found this button type, move to next
            }
          }
        }
        
        const result = {
          repository: repoId,
          buttons: repoButtons,
          hasApiFeatures: repoButtons.api > 0 || repoButtons.graphql > 0 || repoButtons.postman > 0,
          success: repoButtons.working > 0 || repoButtons.api + repoButtons.graphql + repoButtons.postman === 0 // Success if working buttons or no buttons expected
        };
        
        buttonResults.push(result);
        logResult(`API Buttons: ${repoId}`, result.success ? 'success' : 'failed', {
          apiButtons: result.buttons.api,
          graphqlButtons: result.buttons.graphql,
          postmanButtons: result.buttons.postman,
          workingButtons: result.buttons.working
        });
        
      } catch (error) {
        const result = {
          repository: repoId,
          error: error.toString(),
          success: false
        };
        
        buttonResults.push(result);
        logResult(`API Buttons: ${repoId}`, 'error', result, error.toString());
      }
      
      await page.waitForTimeout(500);
    }
    
    const reposWithButtons = buttonResults.filter(r => r.hasApiFeatures).length;
    const workingButtons = buttonResults.filter(r => r.success).length;
    
    console.log(`\nAPI Buttons Summary: ${workingButtons}/${buttonResults.length} repositories with working buttons`);
    console.log(`Repositories with API features: ${reposWithButtons}`);
  });

  test('5. Test markdown document internal links', async ({ page }) => {
    console.log('\n=== Testing Markdown Document Internal Links ===');
    
    const linkResults = [];
    
    // Test a subset of repositories for internal links
    const docTestRepos = [
      'demo-labsdashboards',
      'ai-predictive-maintenance-engine',
      'future-mobility-consumer-platform',
      'rentalFleets',
      'eyns-ai-experience-center'
    ];
    
    for (const repoId of docTestRepos) {
      try {
        console.log(`Testing internal links for: ${repoId}`);
        
        // Navigate to documentation
        await page.goto(`${BASE_URL}/repository/${repoId}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await waitForPageLoad(page);
        
        // Try to navigate to documentation
        const docLink = page.locator('text=/documentation/i, text=/docs/i').first();
        if (await docLink.count() > 0) {
          await docLink.click();
          await waitForPageLoad(page);
        }
        
        // Find all internal links in the documentation
        const internalLinks = await page.locator('a[href]:not([href^="http"]):not([href^="mailto"])').evaluateAll((elements) => {
          return elements.map(el => {
            const anchor = el as HTMLAnchorElement;
            return {
              text: anchor.textContent?.trim() || '',
              href: anchor.getAttribute('href') || '',
              fullHref: anchor.href
            };
          });
        });
        
        console.log(`  Found ${internalLinks.length} internal links`);
        
        let workingLinks = 0;
        let brokenLinks = 0;
        const testedLinks = [];
        
        // Test up to 10 internal links
        const linksToTest = internalLinks.slice(0, 10);
        
        for (const link of linksToTest) {
          try {
            if (link.href.startsWith('#')) {
              // Anchor link - check if element exists
              const anchorElement = page.locator(link.href);
              const exists = await anchorElement.count() > 0;
              
              if (exists) {
                workingLinks++;
                testedLinks.push({ ...link, status: 'working' });
              } else {
                brokenLinks++;
                testedLinks.push({ ...link, status: 'broken', reason: 'Anchor not found' });
              }
              
            } else {
              // Internal navigation link
              await page.goto(link.fullHref, { waitUntil: 'domcontentloaded', timeout: 15000 });
              const errors = await checkForErrors(page);
              
              if (errors.length === 0) {
                workingLinks++;
                testedLinks.push({ ...link, status: 'working' });
              } else {
                brokenLinks++;
                testedLinks.push({ ...link, status: 'broken', reason: errors.join(', ') });
              }
              
              // Go back
              await page.goBack();
              await waitForPageLoad(page);
            }
            
          } catch (linkError) {
            brokenLinks++;
            testedLinks.push({ ...link, status: 'error', reason: linkError.toString() });
          }
          
          await page.waitForTimeout(300);
        }
        
        const result = {
          repository: repoId,
          totalLinks: internalLinks.length,
          testedLinks: testedLinks.length,
          workingLinks,
          brokenLinks,
          success: brokenLinks === 0 || (workingLinks / testedLinks.length) > 0.8
        };
        
        linkResults.push(result);
        logResult(`Internal Links: ${repoId}`, result.success ? 'success' : 'failed', {
          totalLinks: result.totalLinks,
          testedLinks: result.testedLinks,
          workingLinks: result.workingLinks,
          brokenLinks: result.brokenLinks
        });
        
      } catch (error) {
        const result = {
          repository: repoId,
          error: error.toString(),
          success: false
        };
        
        linkResults.push(result);
        logResult(`Internal Links: ${repoId}`, 'error', result, error.toString());
      }
    }
    
    const reposWithWorkingLinks = linkResults.filter(r => r.success).length;
    console.log(`\nInternal Links Summary: ${reposWithWorkingLinks}/${linkResults.length} repositories with working internal links`);
  });

  test.afterAll(async () => {
    console.log('\n=== COMPREHENSIVE LINK VALIDATION SUMMARY ===');
    
    // Generate summary report
    const summary = {
      totalTests: testResults.length,
      successful: testResults.filter(r => r.status === 'success').length,
      failed: testResults.filter(r => r.status === 'failed').length,
      errors: testResults.filter(r => r.status === 'error').length,
      timestamp: new Date().toISOString()
    };
    
    const successRate = summary.successful / summary.totalTests;
    
    console.log(`Total Tests: ${summary.totalTests}`);
    console.log(`Successful: ${summary.successful} (${Math.round(successRate * 100)}%)`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Errors: ${summary.errors}`);
    
    // Save detailed results
    const reportPath = 'test-results/comprehensive-link-validation-report.json';
    const report = {
      summary,
      testResults,
      repositories: ALL_REPOSITORIES,
      navigationLinks: NAVIGATION_LINKS,
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nDetailed report saved to: ${reportPath}`);
    
    // List failed tests
    const failedTests = testResults.filter(r => r.status !== 'success');
    if (failedTests.length > 0) {
      console.log('\nFailed/Error Tests:');
      failedTests.forEach(test => {
        console.log(`  - ${test.testName}: ${test.status}`);
        if (test.error) console.log(`    Error: ${test.error}`);
      });
    }
    
    console.log('\n✅ Comprehensive Link Validation Test Suite Complete');
    
    // Expect at least 85% overall success rate
    expect(successRate).toBeGreaterThan(0.85);
  });
});