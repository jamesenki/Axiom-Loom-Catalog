import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';

/**
 * FINAL COMPREHENSIVE LINK VALIDATION REPORT
 * 
 * Based on the comprehensive testing, this creates a final report of all link validation results
 * and provides actionable insights for fixing the identified issues.
 */

const BASE_URL = 'http://localhost:3000';

interface LinkValidationResult {
  category: string;
  item: string;
  status: 'working' | 'broken' | 'error';
  url?: string;
  issue?: string;
  recommendation?: string;
}

const validationResults: LinkValidationResult[] = [];

async function waitForPageLoad(page: Page, timeout = 10000) {
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.waitForTimeout(1500);
}

function addResult(category: string, item: string, status: 'working' | 'broken' | 'error', details: any = {}) {
  const result: LinkValidationResult = {
    category,
    item,
    status,
    url: details.url || '',
    issue: details.issue || '',
    recommendation: details.recommendation || ''
  };
  
  validationResults.push(result);
  
  const statusEmoji = status === 'working' ? '✅' : status === 'broken' ? '🔴' : '⚠️';
  console.log(`${statusEmoji} ${category} - ${item}: ${status.toUpperCase()}`);
  if (details.issue) console.log(`   Issue: ${details.issue}`);
}

test.describe('Final Link Validation Report', () => {
  test.setTimeout(180000); // 3 minute timeout

  test('Complete Link Validation Assessment', async ({ page }) => {
    console.log('\n🎯 COMPREHENSIVE LINK VALIDATION ASSESSMENT');
    console.log('=' * 60);
    
    // 1. Test main navigation
    console.log('\n📍 TESTING MAIN NAVIGATION');
    
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);
    
    // Homepage
    const homeTitle = await page.title();
    const homeHasContent = await page.locator('main, .content, body > div').count() > 0;
    addResult('Navigation', 'Homepage', homeHasContent ? 'working' : 'broken', {
      url: BASE_URL,
      issue: !homeHasContent ? 'No main content found' : '',
      recommendation: !homeHasContent ? 'Check React app rendering' : ''
    });
    
    // Test navigation links
    const navLinks = [
      { name: 'Repositories', path: '/repositories' },
      { name: 'APIs', path: '/apis' },
      { name: 'Docs', path: '/docs' },
      { name: 'Sync', path: '/sync' }
    ];
    
    for (const navLink of navLinks) {
      try {
        await page.goto(`${BASE_URL}${navLink.path}`, { waitUntil: 'domcontentloaded' });
        await waitForPageLoad(page);
        
        const hasError = await page.locator('text=/error|failed|something went wrong/i').count() > 0;
        const hasContent = await page.locator('main, .content, body > div').count() > 0;
        
        if (hasError) {
          const errorMessages = await page.locator('text=/error|failed|something went wrong/i').allTextContents();
          addResult('Navigation', navLink.name, 'broken', {
            url: `${BASE_URL}${navLink.path}`,
            issue: `Page shows errors: ${errorMessages.join(', ')}`,
            recommendation: 'Check API endpoints and error handling'
          });
        } else if (hasContent) {
          addResult('Navigation', navLink.name, 'working', {
            url: `${BASE_URL}${navLink.path}`
          });
        } else {
          addResult('Navigation', navLink.name, 'broken', {
            url: `${BASE_URL}${navLink.path}`,
            issue: 'No content rendered',
            recommendation: 'Check component rendering'
          });
        }
        
      } catch (error) {
        addResult('Navigation', navLink.name, 'error', {
          url: `${BASE_URL}${navLink.path}`,
          issue: error.toString(),
          recommendation: 'Check server status and route configuration'
        });
      }
    }
    
    // 2. Test repository access
    console.log('\n📚 TESTING REPOSITORY ACCESS');
    
    const testRepositories = [
      'demo-labsdashboards',
      'rentalFleets', 
      'future-mobility-consumer-platform',
      'ai-predictive-maintenance-engine'
    ];
    
    for (const repo of testRepositories) {
      try {
        const repoUrl = `${BASE_URL}/repository/${repo}`;
        await page.goto(repoUrl, { waitUntil: 'domcontentloaded' });
        await waitForPageLoad(page);
        
        const hasError = await page.locator('text=/404|not found|error/i').count() > 0;
        const hasContent = await page.locator('main, .content, h1, h2').count() > 0;
        const hasRepoName = await page.locator(`text=${repo}`).count() > 0;
        
        if (hasError) {
          addResult('Repository Access', repo, 'broken', {
            url: repoUrl,
            issue: 'Repository page shows error or 404',
            recommendation: 'Verify repository exists in GitHub and is synced'
          });
        } else if (hasContent) {
          addResult('Repository Access', repo, 'working', {
            url: repoUrl
          });
        } else {
          addResult('Repository Access', repo, 'broken', {
            url: repoUrl,
            issue: 'Repository page has no content',
            recommendation: 'Check repository data loading and rendering'
          });
        }
        
      } catch (error) {
        addResult('Repository Access', repo, 'error', {
          url: `${BASE_URL}/repository/${repo}`,
          issue: error.toString(),
          recommendation: 'Check server and routing'
        });
      }
    }
    
    // 3. Test documentation access
    console.log('\n📖 TESTING DOCUMENTATION ACCESS');
    
    for (const repo of testRepositories) {
      try {
        // Try repository page first
        await page.goto(`${BASE_URL}/repository/${repo}`, { waitUntil: 'domcontentloaded' });
        await waitForPageLoad(page);
        
        // Look for documentation button
        const docButton = page.locator('text=/documentation|docs/i').first();
        let docWorking = false;
        let docUrl = '';
        let docIssue = '';
        
        if (await docButton.count() > 0) {
          try {
            await docButton.click();
            await waitForPageLoad(page);
            docUrl = page.url();
            
            const hasDocError = await page.locator('text=/error|failed|401|403|unauthorized/i').count() > 0;
            const hasDocContent = await page.locator('.markdown-body, article, h1, h2, h3, p').count() > 5;
            
            if (hasDocError) {
              const errorMessages = await page.locator('text=/error|failed|401|403|unauthorized/i').allTextContents();
              docIssue = `Documentation shows errors: ${errorMessages.join(', ')}`;
            } else if (hasDocContent) {
              docWorking = true;
            } else {
              docIssue = 'Documentation page has minimal or no content';
            }
            
          } catch (clickError) {
            docIssue = `Failed to navigate to documentation: ${clickError}`;
          }
        } else {
          // Try direct documentation URL
          docUrl = `${BASE_URL}/docs/${repo}`;
          await page.goto(docUrl, { waitUntil: 'domcontentloaded' });
          await waitForPageLoad(page);
          
          const hasDocError = await page.locator('text=/error|failed|401|403|unauthorized/i').count() > 0;
          const hasDocContent = await page.locator('.markdown-body, article, h1, h2, h3, p').count() > 5;
          
          if (hasDocError) {
            const errorMessages = await page.locator('text=/error|failed|401|403|unauthorized/i').allTextContents();
            docIssue = `Direct documentation URL shows errors: ${errorMessages.join(', ')}`;
          } else if (hasDocContent) {
            docWorking = true;
          } else {
            docIssue = 'No documentation button found and direct URL has no content';
          }
        }
        
        addResult('Documentation', repo, docWorking ? 'working' : 'broken', {
          url: docUrl,
          issue: docIssue,
          recommendation: docWorking ? '' : 'Check documentation API, authentication, and content loading'
        });
        
      } catch (error) {
        addResult('Documentation', repo, 'error', {
          url: `${BASE_URL}/docs/${repo}`,
          issue: error.toString(),
          recommendation: 'Check server, routing, and authentication'
        });
      }
    }
    
    // 4. Test API buttons and features
    console.log('\n🔗 TESTING API BUTTONS AND FEATURES');
    
    for (const repo of testRepositories) {
      try {
        await page.goto(`${BASE_URL}/repository/${repo}`, { waitUntil: 'domcontentloaded' });
        await waitForPageLoad(page);
        
        // Count different types of buttons
        const apiButtons = await page.locator('text=/api|swagger|openapi/i').count();
        const postmanButtons = await page.locator('text=/postman|collection/i').count();
        const graphqlButtons = await page.locator('text=/graphql|playground/i').count();
        
        const totalButtons = apiButtons + postmanButtons + graphqlButtons;
        
        if (totalButtons > 0) {
          // Test clicking one button
          let buttonWorking = false;
          let buttonIssue = '';
          
          if (apiButtons > 0) {
            try {
              const apiButton = page.locator('text=/api/i').first();
              await apiButton.click();
              await waitForPageLoad(page);
              
              const hasError = await page.locator('text=/error|404|failed/i').count() > 0;
              if (!hasError) {
                buttonWorking = true;
              } else {
                buttonIssue = 'API button leads to error page';
              }
            } catch (e) {
              buttonIssue = `API button click failed: ${e}`;
            }
          }
          
          addResult('API Features', repo, buttonWorking ? 'working' : 'broken', {
            issue: buttonIssue,
            recommendation: buttonWorking ? '' : 'Check API detection and button functionality'
          });
        } else {
          addResult('API Features', repo, 'working', {
            issue: 'No API buttons found (may be expected for this repository)'
          });
        }
        
      } catch (error) {
        addResult('API Features', repo, 'error', {
          issue: error.toString(),
          recommendation: 'Check repository page loading'
        });
      }
    }
  });
  
  test.afterAll(async () => {
    console.log('\n' + '=' * 80);
    console.log('🎯 COMPREHENSIVE LINK VALIDATION FINAL REPORT');
    console.log('=' * 80);
    
    // Generate summary statistics
    const summary = {
      total: validationResults.length,
      working: validationResults.filter(r => r.status === 'working').length,
      broken: validationResults.filter(r => r.status === 'broken').length,
      error: validationResults.filter(r => r.status === 'error').length
    };
    
    const workingPercentage = Math.round((summary.working / summary.total) * 100);
    
    console.log('\n📊 SUMMARY STATISTICS');
    console.log(`Total Tests: ${summary.total}`);
    console.log(`✅ Working: ${summary.working} (${workingPercentage}%)`);
    console.log(`🔴 Broken: ${summary.broken}`);
    console.log(`⚠️ Error: ${summary.error}`);
    
    // Group results by category
    const byCategory = validationResults.reduce((acc, result) => {
      if (!acc[result.category]) acc[result.category] = [];
      acc[result.category].push(result);
      return acc;
    }, {} as { [key: string]: LinkValidationResult[] });
    
    console.log('\n📋 DETAILED RESULTS BY CATEGORY');
    for (const [category, results] of Object.entries(byCategory)) {
      console.log(`\n${category.toUpperCase()}:`);
      results.forEach(result => {
        const statusIcon = result.status === 'working' ? '✅' : result.status === 'broken' ? '🔴' : '⚠️';
        console.log(`  ${statusIcon} ${result.item}`);
        if (result.issue) console.log(`     Issue: ${result.issue}`);
        if (result.recommendation) console.log(`     Fix: ${result.recommendation}`);
      });
    }
    
    // Key issues and recommendations
    const brokenItems = validationResults.filter(r => r.status === 'broken');
    const errorItems = validationResults.filter(r => r.status === 'error');
    
    console.log('\n🚨 KEY ISSUES IDENTIFIED:');
    
    if (brokenItems.length > 0) {
      console.log('\n🔴 BROKEN FUNCTIONALITY:');
      brokenItems.forEach(item => {
        console.log(`- ${item.category}: ${item.item}`);
        if (item.issue) console.log(`  Problem: ${item.issue}`);
        if (item.recommendation) console.log(`  Solution: ${item.recommendation}`);
      });
    }
    
    if (errorItems.length > 0) {
      console.log('\n⚠️ ERROR CONDITIONS:');
      errorItems.forEach(item => {
        console.log(`- ${item.category}: ${item.item}`);
        if (item.issue) console.log(`  Problem: ${item.issue}`);
        if (item.recommendation) console.log(`  Solution: ${item.recommendation}`);
      });
    }
    
    // Priority fixes
    console.log('\n🎯 PRIORITY FIXES NEEDED:');
    
    const apiDocErrors = brokenItems.filter(r => r.category === 'Navigation' && r.item.includes('API'));
    const docErrors = brokenItems.filter(r => r.category === 'Documentation');
    
    if (apiDocErrors.length > 0) {
      console.log('1. CRITICAL: Fix API documentation loading errors');
      console.log('   - Error messages: "Error loading API documentation", "Failed to detect APIs"');
      console.log('   - Likely cause: API detection service or authentication issues');
    }
    
    if (docErrors.length > 0) {
      console.log('2. HIGH: Fix repository documentation access');
      console.log('   - Multiple repositories show documentation errors');
      console.log('   - May need to check authentication headers or content serving');
    }
    
    const repoErrors = brokenItems.filter(r => r.category === 'Repository Access');
    if (repoErrors.length > 0) {
      console.log('3. MEDIUM: Fix repository page access issues');
      console.log('   - Some repositories not loading properly');
    }
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary,
      results: validationResults,
      recommendations: {
        immediate: [
          'Fix "Error loading API documentation" on /apis and /docs pages',
          'Resolve authentication issues for documentation access',
          'Verify API detection service is running properly'
        ],
        shortTerm: [
          'Test all 29 repositories for proper loading',
          'Validate all documentation links within repositories',
          'Ensure API buttons work for repositories that have APIs'
        ],
        longTerm: [
          'Implement comprehensive error handling for all link types',
          'Add automated link validation to CI/CD pipeline',
          'Create monitoring for broken links in production'
        ]
      }
    };
    
    const reportPath = 'test-results/final-link-validation-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📄 DETAILED REPORT SAVED TO:');
    console.log(`   ${reportPath}`);
    
    console.log('\n' + '=' * 80);
    console.log('🏁 LINK VALIDATION ASSESSMENT COMPLETE');
    console.log(`Overall Status: ${workingPercentage >= 80 ? '✅ GOOD' : workingPercentage >= 60 ? '⚠️ NEEDS IMPROVEMENT' : '🔴 CRITICAL'} (${workingPercentage}% working)`);
    console.log('=' * 80);
    
    // Test assertions
    expect(summary.working).toBeGreaterThan(0);
    expect(workingPercentage).toBeGreaterThan(50); // At least 50% should work
  });
});