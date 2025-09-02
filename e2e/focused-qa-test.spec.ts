import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://10.0.0.109:3000';

test.describe('Focused QA Test for Critical Issues', () => {
  test('Test GraphQL, gRPC, and Color Contrast Issues', async ({ page }) => {
    const report = {
      timestamp: new Date().toISOString(),
      issues: [],
      working: [],
      screenshots: []
    };

    console.log('🔍 Starting focused QA testing for critical issues...');
    
    // Step 1: Test Homepage and take screenshot
    console.log('📸 Testing Homepage...');
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'qa-homepage-test.png', fullPage: true });
    report.screenshots.push('qa-homepage-test.png');
    
    // Step 2: Test GraphQL functionality
    console.log('🧪 Testing GraphQL functionality...');
    await testGraphQLIssues(page, report);
    
    // Step 3: Test gRPC functionality
    console.log('🧪 Testing gRPC functionality...');
    await testGrpcIssues(page, report);
    
    // Step 4: Test Color Contrast
    console.log('🧪 Testing Color Contrast...');
    await testColorContrastIssues(page, report);
    
    // Generate final report
    await generateFinalReport(report);
    
    console.log('✅ Focused QA Testing Complete!');
  });
});

async function testGraphQLIssues(page: Page, report: any) {
  try {
    // Go to homepage
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Look for any repository with GraphQL support
    const repoCards = await page.locator('[data-testid*="repo"], .repository-card, .repo-card, a[href*="/repo"]').all();
    
    let testedGraphQL = false;
    
    for (let i = 0; i < Math.min(3, repoCards.length); i++) {
      try {
        const card = repoCards[i];
        await card.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Look for GraphQL button on repository detail page
        const graphqlButton = page.locator('button:has-text("GraphQL"), [data-testid*="graphql"], .graphql-button, button:has-text("graphql")').first();
        
        if (await graphqlButton.isVisible()) {
          testedGraphQL = true;
          const repoName = await page.title() || `Repository ${i+1}`;
          
          console.log(`🔍 Found GraphQL button for ${repoName}`);
          
          await graphqlButton.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(3000);
          
          const screenshotPath = `graphql-test-${i+1}.png`;
          await page.screenshot({ path: screenshotPath, fullPage: true });
          report.screenshots.push(screenshotPath);
          
          const currentUrl = page.url();
          const pageContent = await page.textContent('body');
          
          // Check for "Coming Soon" messages
          const hasComingSoon = pageContent?.toLowerCase().includes('coming soon') || 
                               pageContent?.toLowerCase().includes('not available') ||
                               pageContent?.toLowerCase().includes('under construction');
          
          // Check if it's a working GraphQL interface
          const hasGraphQLInterface = await page.locator('.graphiql, [data-testid="graphql-playground"], .graphql-editor, [class*="graphql"]').count() > 0;
          
          if (hasComingSoon) {
            report.issues.push({
              type: 'GraphQL',
              repository: repoName,
              issue: 'GraphQL button shows "Coming Soon" instead of working playground',
              url: currentUrl,
              screenshot: screenshotPath,
              severity: 'HIGH'
            });
            console.log(`❌ ${repoName}: GraphQL shows "Coming Soon"`);
          } else if (!hasGraphQLInterface && !currentUrl.includes('graphql')) {
            report.issues.push({
              type: 'GraphQL',
              repository: repoName,
              issue: 'GraphQL button does not lead to GraphQL playground',
              url: currentUrl,
              screenshot: screenshotPath,
              severity: 'HIGH'
            });
            console.log(`❌ ${repoName}: GraphQL button doesn't work`);
          } else {
            report.working.push({
              type: 'GraphQL',
              repository: repoName,
              status: 'Working correctly'
            });
            console.log(`✅ ${repoName}: GraphQL working`);
          }
          
          break; // Test only the first GraphQL repo we find
        }
        
        // Go back to homepage for next test
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
      } catch (error) {
        console.log(`⚠️ Error testing GraphQL for repository ${i+1}: ${error.message}`);
      }
    }
    
    if (!testedGraphQL) {
      report.issues.push({
        type: 'GraphQL',
        repository: 'General',
        issue: 'No GraphQL buttons found on any repository pages',
        severity: 'MEDIUM'
      });
      console.log('⚠️ No GraphQL buttons found to test');
    }
    
  } catch (error) {
    console.error('Error in GraphQL testing:', error);
    report.issues.push({
      type: 'GraphQL',
      repository: 'General',
      issue: `Error during GraphQL testing: ${error.message}`,
      severity: 'HIGH'
    });
  }
}

async function testGrpcIssues(page: Page, report: any) {
  try {
    // Go to homepage
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const repoCards = await page.locator('[data-testid*="repo"], .repository-card, .repo-card, a[href*="/repo"]').all();
    
    let testedGrpc = false;
    
    for (let i = 0; i < Math.min(3, repoCards.length); i++) {
      try {
        const card = repoCards[i];
        await card.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Look for gRPC button on repository detail page
        const grpcButton = page.locator('button:has-text("gRPC"), button:has-text("GRPC"), [data-testid*="grpc"], .grpc-button, button:has-text("grpc")').first();
        
        if (await grpcButton.isVisible()) {
          testedGrpc = true;
          const repoName = await page.title() || `Repository ${i+1}`;
          
          console.log(`🔍 Found gRPC button for ${repoName}`);
          
          const beforeUrl = page.url();
          await grpcButton.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(3000);
          
          const afterUrl = page.url();
          const screenshotPath = `grpc-test-${i+1}.png`;
          await page.screenshot({ path: screenshotPath, fullPage: true });
          report.screenshots.push(screenshotPath);
          
          // Check if redirected back to home
          if (afterUrl === BASE_URL || afterUrl.endsWith('/') || afterUrl === beforeUrl.replace(/\/repo.*$/, '/')) {
            report.issues.push({
              type: 'gRPC',
              repository: repoName,
              issue: 'gRPC button redirects back to homepage instead of gRPC explorer',
              beforeUrl: beforeUrl,
              afterUrl: afterUrl,
              screenshot: screenshotPath,
              severity: 'HIGH'
            });
            console.log(`❌ ${repoName}: gRPC redirects to home (${beforeUrl} → ${afterUrl})`);
          } else if (!afterUrl.includes('grpc')) {
            report.issues.push({
              type: 'gRPC',
              repository: repoName,
              issue: 'gRPC button does not lead to gRPC explorer',
              beforeUrl: beforeUrl,
              afterUrl: afterUrl,
              screenshot: screenshotPath,
              severity: 'HIGH'
            });
            console.log(`❌ ${repoName}: gRPC doesn't work (${beforeUrl} → ${afterUrl})`);
          } else {
            report.working.push({
              type: 'gRPC',
              repository: repoName,
              status: 'Working correctly',
              url: afterUrl
            });
            console.log(`✅ ${repoName}: gRPC working (${afterUrl})`);
          }
          
          break; // Test only the first gRPC repo we find
        }
        
        // Go back to homepage for next test
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
      } catch (error) {
        console.log(`⚠️ Error testing gRPC for repository ${i+1}: ${error.message}`);
      }
    }
    
    if (!testedGrpc) {
      report.issues.push({
        type: 'gRPC',
        repository: 'General',
        issue: 'No gRPC buttons found on any repository pages',
        severity: 'MEDIUM'
      });
      console.log('⚠️ No gRPC buttons found to test');
    }
    
  } catch (error) {
    console.error('Error in gRPC testing:', error);
    report.issues.push({
      type: 'gRPC',
      repository: 'General',
      issue: `Error during gRPC testing: ${error.message}`,
      severity: 'HIGH'
    });
  }
}

async function testColorContrastIssues(page: Page, report: any) {
  const pagesToTest = [
    { name: 'Homepage', url: BASE_URL },
    { name: 'API Explorer', url: `${BASE_URL}/api-explorer` },
    { name: 'All APIs', url: `${BASE_URL}/apis` },
    { name: 'Repositories', url: `${BASE_URL}/repositories` }
  ];
  
  for (const pageInfo of pagesToTest) {
    try {
      console.log(`🎨 Testing color contrast on ${pageInfo.name}...`);
      
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const screenshotPath = `color-contrast-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      report.screenshots.push(screenshotPath);
      
      // Check for specific color contrast issues
      const contrastCheck = await page.evaluate(() => {
        const issues = [];
        const elements = document.querySelectorAll('*');
        
        elements.forEach((el) => {
          const computed = window.getComputedStyle(el);
          const text = el.textContent?.trim();
          
          if (text && text.length > 10) {
            const color = computed.color;
            const backgroundColor = computed.backgroundColor;
            const className = el.className;
            const tagName = el.tagName;
            
            // Check for dark text on dark background patterns
            if (color && backgroundColor) {
              // Look for specific problematic patterns
              if (color.includes('rgb(64, 64, 64)') || color.includes('rgb(128, 128, 128)')) {
                if (backgroundColor.includes('rgb(30') || backgroundColor.includes('rgb(40') || backgroundColor.includes('rgb(50')) {
                  issues.push({
                    element: `${tagName}.${className}`,
                    text: text.substring(0, 50),
                    color: color,
                    backgroundColor: backgroundColor,
                    problem: 'Dark gray text on dark background'
                  });
                }
              }
              
              // Check for any gray text (potential readability issue)
              if (color.includes('128, 128, 128') || color.includes('64, 64, 64') || color.includes('96, 96, 96')) {
                issues.push({
                  element: `${tagName}.${className}`,
                  text: text.substring(0, 50),
                  color: color,
                  backgroundColor: backgroundColor,
                  problem: 'Gray text may be hard to read'
                });
              }
            }
          }
        });
        
        return issues;
      });
      
      if (contrastCheck.length > 0) {
        report.issues.push({
          type: 'Color Contrast',
          page: pageInfo.name,
          issue: `Found ${contrastCheck.length} potential readability issues`,
          details: contrastCheck.slice(0, 5), // Show first 5 issues
          screenshot: screenshotPath,
          severity: 'MEDIUM'
        });
        console.log(`⚠️ ${pageInfo.name}: Found ${contrastCheck.length} contrast issues`);
      } else {
        report.working.push({
          type: 'Color Contrast',
          page: pageInfo.name,
          status: 'No obvious contrast issues detected'
        });
        console.log(`✅ ${pageInfo.name}: Color contrast looks good`);
      }
      
    } catch (error) {
      console.error(`Error testing ${pageInfo.name}:`, error);
      report.issues.push({
        type: 'Color Contrast',
        page: pageInfo.name,
        issue: `Error during testing: ${error.message}`,
        severity: 'LOW'
      });
    }
  }
}

async function generateFinalReport(report: any) {
  console.log('\n🎯 FOCUSED QA TEST RESULTS');
  console.log('===========================');
  console.log(`⏰ Test completed at: ${report.timestamp}`);
  console.log(`✅ Working features: ${report.working.length}`);
  console.log(`❌ Issues found: ${report.issues.length}`);
  console.log(`📸 Screenshots taken: ${report.screenshots.length}`);
  
  // Categorize issues by severity
  const highIssues = report.issues.filter(i => i.severity === 'HIGH');
  const mediumIssues = report.issues.filter(i => i.severity === 'MEDIUM');
  const lowIssues = report.issues.filter(i => i.severity === 'LOW');
  
  if (highIssues.length > 0) {
    console.log('\n🔴 HIGH PRIORITY ISSUES:');
    highIssues.forEach((issue, i) => {
      console.log(`  ${i+1}. [${issue.type}] ${issue.repository || issue.page}: ${issue.issue}`);
      if (issue.screenshot) console.log(`     Screenshot: ${issue.screenshot}`);
      if (issue.beforeUrl && issue.afterUrl) {
        console.log(`     Navigation: ${issue.beforeUrl} → ${issue.afterUrl}`);
      }
    });
  }
  
  if (mediumIssues.length > 0) {
    console.log('\n🟡 MEDIUM PRIORITY ISSUES:');
    mediumIssues.forEach((issue, i) => {
      console.log(`  ${i+1}. [${issue.type}] ${issue.repository || issue.page}: ${issue.issue}`);
      if (issue.screenshot) console.log(`     Screenshot: ${issue.screenshot}`);
    });
  }
  
  if (report.working.length > 0) {
    console.log('\n🟢 WORKING FEATURES:');
    report.working.forEach((feature, i) => {
      console.log(`  ${i+1}. [${feature.type}] ${feature.repository || feature.page}: ${feature.status}`);
    });
  }
  
  console.log('\n📄 Screenshots saved:');
  report.screenshots.forEach((screenshot, i) => {
    console.log(`  ${i+1}. ${screenshot}`);
  });
  
  // Save detailed JSON report
  const fs = require('fs');
  fs.writeFileSync('focused-qa-report.json', JSON.stringify(report, null, 2));
  console.log('\n📋 Detailed report saved to: focused-qa-report.json');
  
  // Summary for user
  console.log('\n🎯 SUMMARY FOR USER:');
  if (highIssues.length > 0) {
    console.log(`❌ CRITICAL: Found ${highIssues.length} high-priority issues that need immediate attention`);
    console.log(`   - GraphQL issues: ${highIssues.filter(i => i.type === 'GraphQL').length}`);
    console.log(`   - gRPC issues: ${highIssues.filter(i => i.type === 'gRPC').length}`);
  }
  if (mediumIssues.length > 0) {
    console.log(`⚠️  MODERATE: Found ${mediumIssues.length} medium-priority issues`);
    console.log(`   - Color contrast issues: ${mediumIssues.filter(i => i.type === 'Color Contrast').length}`);
  }
  if (report.working.length > 0) {
    console.log(`✅ WORKING: ${report.working.length} features are working correctly`);
  }
}