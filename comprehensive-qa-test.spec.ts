import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://10.0.0.109:3000';

interface TestResults {
  graphqlIssues: Array<{repository: string, issue: string, screenshot?: string}>;
  grpcIssues: Array<{repository: string, issue: string, screenshot?: string}>;
  colorContrastIssues: Array<{page: string, issue: string, screenshot?: string}>;
  workingFeatures: Array<{feature: string, status: string}>;
}

test.describe('Comprehensive QA Test Suite', () => {
  let results: TestResults;

  test.beforeEach(() => {
    results = {
      graphqlIssues: [],
      grpcIssues: [],
      colorContrastIssues: [],
      workingFeatures: []
    };
  });

  test('Complete GraphQL, gRPC, and Color Contrast Testing', async ({ page }) => {
    console.log('🔍 Starting comprehensive QA testing...');
    
    // Navigate to homepage
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ path: 'qa-test-homepage.png', fullPage: true });
    
    console.log('✅ Homepage loaded successfully');

    // Test 1: GraphQL Functionality
    await testGraphQLFunctionality(page, results);
    
    // Test 2: gRPC Functionality  
    await testGrpcFunctionality(page, results);
    
    // Test 3: Color Contrast Testing
    await testColorContrast(page, results);
    
    // Test 4: Document Navigation
    await testDocumentNavigation(page, results);
    
    // Generate comprehensive report
    await generateQAReport(results);
    
    console.log('🎯 QA Testing Complete - Check generated report');
  });
});

async function testGraphQLFunctionality(page: Page, results: TestResults) {
  console.log('🧪 Testing GraphQL functionality...');
  
  try {
    // Go back to homepage
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Look for repositories with GraphQL
    const repositoryCards = await page.locator('.repository-card, [data-testid*="repo"], .repo-card').all();
    
    for (let i = 0; i < Math.min(repositoryCards.length, 5); i++) {
      const card = repositoryCards[i];
      
      // Check if this repository has GraphQL button
      const graphqlButton = card.locator('button:has-text("GraphQL"), [data-testid*="graphql"], .graphql-button').first();
      
      if (await graphqlButton.isVisible()) {
        const repoName = await card.locator('h3, .repo-name, .repository-title').first().textContent() || `Repository ${i+1}`;
        
        console.log(`🔍 Found GraphQL button for ${repoName}`);
        
        // Click the repository first
        await card.click();
        await page.waitForLoadState('networkidle');
        
        // Then click GraphQL button
        const detailGraphqlButton = page.locator('button:has-text("GraphQL"), [data-testid*="graphql"], .graphql-button').first();
        
        if (await detailGraphqlButton.isVisible()) {
          await detailGraphqlButton.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
          
          // Take screenshot
          const screenshotPath = `graphql-test-${repoName.replace(/\s+/g, '-')}.png`;
          await page.screenshot({ path: screenshotPath, fullPage: true });
          
          // Check what we landed on
          const currentUrl = page.url();
          const pageContent = await page.content();
          
          // Check for "coming soon" or similar messages
          const comingSoonText = await page.locator('text="Coming Soon", text="coming soon", text="COMING SOON"').count();
          const hasGraphQLInterface = await page.locator('.graphiql, [data-testid="graphql-playground"], .graphql-playground').count();
          
          if (comingSoonText > 0) {
            results.graphqlIssues.push({
              repository: repoName,
              issue: `GraphQL button shows "Coming Soon" message instead of working playground`,
              screenshot: screenshotPath
            });
            console.log(`❌ ${repoName}: GraphQL shows "Coming Soon"`);
          } else if (hasGraphQLInterface === 0 && !currentUrl.includes('graphql')) {
            results.graphqlIssues.push({
              repository: repoName,
              issue: `GraphQL button does not lead to GraphQL playground - URL: ${currentUrl}`,
              screenshot: screenshotPath
            });
            console.log(`❌ ${repoName}: GraphQL button doesn't work - URL: ${currentUrl}`);
          } else {
            results.workingFeatures.push({
              feature: `GraphQL for ${repoName}`,
              status: 'Working correctly'
            });
            console.log(`✅ ${repoName}: GraphQL working`);
          }
        }
        
        // Go back to homepage
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
      }
    }
  } catch (error) {
    console.error('Error testing GraphQL:', error);
    results.graphqlIssues.push({
      repository: 'General',
      issue: `Error during GraphQL testing: ${error.message}`
    });
  }
}

async function testGrpcFunctionality(page: Page, results: TestResults) {
  console.log('🧪 Testing gRPC functionality...');
  
  try {
    // Go back to homepage
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const repositoryCards = await page.locator('.repository-card, [data-testid*="repo"], .repo-card').all();
    
    for (let i = 0; i < Math.min(repositoryCards.length, 5); i++) {
      const card = repositoryCards[i];
      
      // Check if this repository has gRPC button
      const grpcButton = card.locator('button:has-text("gRPC"), button:has-text("GRPC"), [data-testid*="grpc"], .grpc-button').first();
      
      if (await grpcButton.isVisible()) {
        const repoName = await card.locator('h3, .repo-name, .repository-title').first().textContent() || `Repository ${i+1}`;
        
        console.log(`🔍 Found gRPC button for ${repoName}`);
        
        // Click the repository first
        await card.click();
        await page.waitForLoadState('networkidle');
        
        // Then click gRPC button
        const detailGrpcButton = page.locator('button:has-text("gRPC"), button:has-text("GRPC"), [data-testid*="grpc"], .grpc-button').first();
        
        if (await detailGrpcButton.isVisible()) {
          const beforeUrl = page.url();
          await detailGrpcButton.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
          
          const afterUrl = page.url();
          
          // Take screenshot
          const screenshotPath = `grpc-test-${repoName.replace(/\s+/g, '-')}.png`;
          await page.screenshot({ path: screenshotPath, fullPage: true });
          
          // Check if we got redirected back to home
          if (afterUrl === BASE_URL || afterUrl.endsWith('/')) {
            results.grpcIssues.push({
              repository: repoName,
              issue: `gRPC button redirects back to homepage instead of gRPC explorer`,
              screenshot: screenshotPath
            });
            console.log(`❌ ${repoName}: gRPC redirects to home`);
          } else if (!afterUrl.includes('grpc')) {
            results.grpcIssues.push({
              repository: repoName,
              issue: `gRPC button does not lead to gRPC explorer - URL: ${afterUrl}`,
              screenshot: screenshotPath
            });
            console.log(`❌ ${repoName}: gRPC doesn't work - URL: ${afterUrl}`);
          } else {
            results.workingFeatures.push({
              feature: `gRPC for ${repoName}`,
              status: 'Working correctly'
            });
            console.log(`✅ ${repoName}: gRPC working`);
          }
        }
        
        // Go back to homepage
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
      }
    }
  } catch (error) {
    console.error('Error testing gRPC:', error);
    results.grpcIssues.push({
      repository: 'General',
      issue: `Error during gRPC testing: ${error.message}`
    });
  }
}

async function testColorContrast(page: Page, results: TestResults) {
  console.log('🧪 Testing color contrast...');
  
  const pagesToTest = [
    { name: 'Homepage', url: BASE_URL },
    { name: 'API Explorer', url: `${BASE_URL}/api-explorer` },
    { name: 'All APIs', url: `${BASE_URL}/apis` }
  ];
  
  for (const pageInfo of pagesToTest) {
    try {
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const screenshotPath = `color-contrast-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      
      // Check for dark text on dark backgrounds (common contrast issues)
      const styles = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const issues = [];
        
        elements.forEach((el) => {
          const computed = window.getComputedStyle(el);
          const color = computed.color;
          const backgroundColor = computed.backgroundColor;
          const text = el.textContent?.trim();
          
          // Check if element has text and visible styling
          if (text && text.length > 5) {
            // Parse RGB values for contrast checking
            const colorMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            const bgColorMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            
            if (colorMatch && bgColorMatch) {
              const [, r1, g1, b1] = colorMatch.map(Number);
              const [, r2, g2, b2] = bgColorMatch.map(Number);
              
              // Simple contrast ratio check (simplified)
              const textLightness = (r1 + g1 + b1) / 3;
              const bgLightness = (r2 + g2 + b2) / 3;
              
              // Flag if both are dark (under 128) or both are light (over 128)
              if ((textLightness < 128 && bgLightness < 128) || 
                  (Math.abs(textLightness - bgLightness) < 50)) {
                issues.push({
                  element: el.tagName,
                  text: text.substring(0, 50),
                  color: color,
                  backgroundColor: backgroundColor,
                  selector: el.className || el.id || el.tagName
                });
              }
            }
          }
        });
        
        return issues;
      });
      
      if (styles.length > 0) {
        results.colorContrastIssues.push({
          page: pageInfo.name,
          issue: `Found ${styles.length} potential contrast issues: ${styles.map(s => s.text.substring(0, 30)).join(', ')}`,
          screenshot: screenshotPath
        });
        console.log(`❌ ${pageInfo.name}: Found ${styles.length} contrast issues`);
      } else {
        results.workingFeatures.push({
          feature: `Color contrast on ${pageInfo.name}`,
          status: 'Good contrast detected'
        });
        console.log(`✅ ${pageInfo.name}: Good color contrast`);
      }
      
    } catch (error) {
      console.error(`Error testing ${pageInfo.name}:`, error);
      results.colorContrastIssues.push({
        page: pageInfo.name,
        issue: `Error during testing: ${error.message}`
      });
    }
  }
}

async function testDocumentNavigation(page: Page, results: TestResults) {
  console.log('🧪 Testing document navigation...');
  
  try {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Find a repository and navigate to documentation
    const repositoryCards = await page.locator('.repository-card, [data-testid*="repo"], .repo-card').first();
    
    if (await repositoryCards.isVisible()) {
      await repositoryCards.click();
      await page.waitForLoadState('networkidle');
      
      // Look for documentation links
      const docLinks = await page.locator('a[href*=".md"], button:has-text("README"), button:has-text("Documentation")').all();
      
      if (docLinks.length > 0) {
        await docLinks[0].click();
        await page.waitForLoadState('networkidle');
        
        const screenshotPath = 'document-navigation-test.png';
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        // Check if text is readable
        const bodyStyles = await page.evaluate(() => {
          const body = document.body;
          const computed = window.getComputedStyle(body);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor
          };
        });
        
        results.workingFeatures.push({
          feature: 'Document Navigation',
          status: `Working - Text color: ${bodyStyles.color}, Background: ${bodyStyles.backgroundColor}`
        });
        console.log(`✅ Document navigation working`);
      }
    }
  } catch (error) {
    console.error('Error testing document navigation:', error);
  }
}

async function generateQAReport(results: TestResults) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      graphqlIssuesCount: results.graphqlIssues.length,
      grpcIssuesCount: results.grpcIssues.length,
      colorContrastIssuesCount: results.colorContrastIssues.length,
      workingFeaturesCount: results.workingFeatures.length
    },
    details: results
  };
  
  console.log('\n🎯 COMPREHENSIVE QA TEST REPORT');
  console.log('================================');
  console.log(`✅ Working Features: ${results.workingFeatures.length}`);
  console.log(`❌ GraphQL Issues: ${results.graphqlIssues.length}`);
  console.log(`❌ gRPC Issues: ${results.grpcIssues.length}`);
  console.log(`❌ Color Contrast Issues: ${results.colorContrastIssues.length}`);
  
  if (results.graphqlIssues.length > 0) {
    console.log('\n🔴 GRAPHQL ISSUES:');
    results.graphqlIssues.forEach((issue, i) => {
      console.log(`  ${i+1}. ${issue.repository}: ${issue.issue}`);
      if (issue.screenshot) console.log(`     Screenshot: ${issue.screenshot}`);
    });
  }
  
  if (results.grpcIssues.length > 0) {
    console.log('\n🔴 GRPC ISSUES:');
    results.grpcIssues.forEach((issue, i) => {
      console.log(`  ${i+1}. ${issue.repository}: ${issue.issue}`);
      if (issue.screenshot) console.log(`     Screenshot: ${issue.screenshot}`);
    });
  }
  
  if (results.colorContrastIssues.length > 0) {
    console.log('\n🔴 COLOR CONTRAST ISSUES:');
    results.colorContrastIssues.forEach((issue, i) => {
      console.log(`  ${i+1}. ${issue.page}: ${issue.issue}`);
      if (issue.screenshot) console.log(`     Screenshot: ${issue.screenshot}`);
    });
  }
  
  if (results.workingFeatures.length > 0) {
    console.log('\n🟢 WORKING FEATURES:');
    results.workingFeatures.forEach((feature, i) => {
      console.log(`  ${i+1}. ${feature.feature}: ${feature.status}`);
    });
  }
  
  // Write detailed JSON report
  const fs = require('fs');
  fs.writeFileSync('qa-test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to: qa-test-report.json');
}