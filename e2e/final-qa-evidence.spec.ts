import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://10.0.0.109:3000';

test.describe('Final QA Evidence Collection', () => {
  test('Collect evidence for user-reported issues', async ({ page }) => {
    console.log('🔍 Starting Evidence Collection for User Issues...');
    
    const issues = {
      graphql: [],
      grpc: [],
      contrast: [],
      evidence: []
    };

    // Set longer timeout for this test
    test.setTimeout(120000);
    
    try {
      // Step 1: Load homepage with extended timeout
      console.log('📸 Loading homepage...');
      await page.goto(BASE_URL, { 
        waitUntil: 'domcontentloaded', 
        timeout: 45000 
      });
      
      await page.waitForTimeout(3000); // Wait for React to load
      
      await page.screenshot({ 
        path: 'final-qa-homepage.png', 
        fullPage: true 
      });
      issues.evidence.push('final-qa-homepage.png');
      console.log('✅ Homepage screenshot taken');

      // Step 2: Look for any repositories with API features
      const repoElements = await page.locator('a[href*="/repo"], [data-testid*="repo"], .repo-card, .repository-card').all();
      console.log(`Found ${repoElements.length} repository elements`);
      
      if (repoElements.length > 0) {
        // Click on first repository
        const firstRepo = repoElements[0];
        await firstRepo.click();
        await page.waitForTimeout(5000);
        
        const repoScreenshot = 'final-qa-repository-detail.png';
        await page.screenshot({ path: repoScreenshot, fullPage: true });
        issues.evidence.push(repoScreenshot);
        console.log('✅ Repository detail screenshot taken');
        
        // Look for API-related buttons
        const allButtons = await page.locator('button').allTextContents();
        console.log('Buttons found:', allButtons.filter(text => text?.trim()));
        
        // Test GraphQL buttons
        const graphqlButtons = await page.locator('button:has-text("GraphQL"), button:has-text("graphql")').count();
        if (graphqlButtons > 0) {
          console.log('🎯 Found GraphQL button - testing...');
          
          await page.locator('button:has-text("GraphQL"), button:has-text("graphql")').first().click();
          await page.waitForTimeout(3000);
          
          const graphqlScreenshot = 'final-qa-graphql-result.png';
          await page.screenshot({ path: graphqlScreenshot, fullPage: true });
          issues.evidence.push(graphqlScreenshot);
          
          const currentUrl = page.url();
          const pageContent = await page.textContent('body');
          
          if (pageContent?.toLowerCase().includes('coming soon')) {
            issues.graphql.push({
              issue: 'GraphQL button shows "Coming Soon"',
              screenshot: graphqlScreenshot,
              url: currentUrl
            });
            console.log('❌ CONFIRMED: GraphQL shows "Coming Soon"');
          } else if (!currentUrl.includes('graphql')) {
            issues.graphql.push({
              issue: 'GraphQL button does not navigate to GraphQL playground',
              screenshot: graphqlScreenshot,
              url: currentUrl
            });
            console.log('❌ CONFIRMED: GraphQL navigation issue');
          }
        }
        
        // Go back and test gRPC
        await page.goBack();
        await page.waitForTimeout(2000);
        
        const grpcButtons = await page.locator('button:has-text("gRPC"), button:has-text("grpc")').count();
        if (grpcButtons > 0) {
          console.log('🎯 Found gRPC button - testing...');
          
          const beforeUrl = page.url();
          await page.locator('button:has-text("gRPC"), button:has-text("grpc")').first().click();
          await page.waitForTimeout(3000);
          
          const afterUrl = page.url();
          const grpcScreenshot = 'final-qa-grpc-result.png';
          await page.screenshot({ path: grpcScreenshot, fullPage: true });
          issues.evidence.push(grpcScreenshot);
          
          if (afterUrl === BASE_URL || afterUrl.includes('/#')) {
            issues.grpc.push({
              issue: 'gRPC button redirects to homepage',
              screenshot: grpcScreenshot,
              beforeUrl: beforeUrl,
              afterUrl: afterUrl
            });
            console.log('❌ CONFIRMED: gRPC redirects to home');
          }
        }
      }

      // Step 3: Test color contrast on specific pages
      const pagesToTest = [
        { name: 'API Explorer', url: '/api-explorer' },
        { name: 'APIs', url: '/apis' },
        { name: 'Docs', url: '/docs' }
      ];

      for (const pageTest of pagesToTest) {
        try {
          console.log(`🎨 Testing ${pageTest.name}...`);
          await page.goto(BASE_URL + pageTest.url, { 
            waitUntil: 'domcontentloaded', 
            timeout: 30000 
          });
          await page.waitForTimeout(2000);
          
          const contrastScreenshot = `final-qa-contrast-${pageTest.name.toLowerCase()}.png`;
          await page.screenshot({ path: contrastScreenshot, fullPage: true });
          issues.evidence.push(contrastScreenshot);
          
          // Check for color contrast issues
          const contrastIssues = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            const problems = [];
            
            elements.forEach(el => {
              const style = window.getComputedStyle(el);
              const text = el.textContent?.trim();
              
              if (text && text.length > 5) {
                const color = style.color;
                const bgColor = style.backgroundColor;
                
                // Check for dark text colors that might be hard to read
                if (color.includes('rgba(128, 128, 128') || 
                    color.includes('rgb(128, 128, 128)') ||
                    color.includes('rgba(64, 64, 64') ||
                    color.includes('rgb(64, 64, 64)')) {
                  problems.push({
                    text: text.substring(0, 30),
                    color: color,
                    element: el.tagName + '.' + el.className
                  });
                }
              }
            });
            
            return problems.slice(0, 3);
          });
          
          if (contrastIssues.length > 0) {
            issues.contrast.push({
              page: pageTest.name,
              problems: contrastIssues,
              screenshot: contrastScreenshot
            });
            console.log(`⚠️ Found ${contrastIssues.length} potential contrast issues on ${pageTest.name}`);
          }
          
        } catch (error) {
          console.log(`⚠️ Could not test ${pageTest.name}: ${error.message}`);
        }
      }

    } catch (error) {
      console.error('Error during testing:', error);
    }

    // Generate final report
    console.log('\n🎯 FINAL QA EVIDENCE REPORT');
    console.log('=============================');
    console.log(`📸 Screenshots collected: ${issues.evidence.length}`);
    console.log(`❌ GraphQL issues found: ${issues.graphql.length}`);
    console.log(`❌ gRPC issues found: ${issues.grpc.length}`);
    console.log(`⚠️ Contrast issues found: ${issues.contrast.length}`);

    console.log('\n📸 EVIDENCE SCREENSHOTS:');
    issues.evidence.forEach((screenshot, i) => {
      console.log(`  ${i+1}. ${screenshot}`);
    });

    if (issues.graphql.length > 0) {
      console.log('\n❌ GRAPHQL ISSUES CONFIRMED:');
      issues.graphql.forEach((issue, i) => {
        console.log(`  ${i+1}. Issue: ${issue.issue}`);
        console.log(`     URL: ${issue.url}`);
        console.log(`     Evidence: ${issue.screenshot}`);
      });
    }

    if (issues.grpc.length > 0) {
      console.log('\n❌ GRPC ISSUES CONFIRMED:');
      issues.grpc.forEach((issue, i) => {
        console.log(`  ${i+1}. Issue: ${issue.issue}`);
        console.log(`     Before: ${issue.beforeUrl}`);
        console.log(`     After: ${issue.afterUrl}`);
        console.log(`     Evidence: ${issue.screenshot}`);
      });
    }

    if (issues.contrast.length > 0) {
      console.log('\n⚠️ COLOR CONTRAST ISSUES:');
      issues.contrast.forEach((issue, i) => {
        console.log(`  ${i+1}. Page: ${issue.page}`);
        console.log(`     Problems: ${issue.problems.length} elements`);
        console.log(`     Evidence: ${issue.screenshot}`);
      });
    }

    console.log('\n🎯 VERDICT:');
    const totalIssues = issues.graphql.length + issues.grpc.length + issues.contrast.length;
    if (totalIssues > 0) {
      console.log(`❌ USER COMPLAINTS CONFIRMED: ${totalIssues} issues found`);
      console.log('   The user\'s frustrations are VALID and need immediate attention!');
    } else {
      console.log('✅ No major issues detected in current testing');
      console.log('   May need specific repository testing or different testing approach');
    }

    // Save evidence file
    const fs = require('fs');
    fs.writeFileSync('final-qa-evidence.json', JSON.stringify(issues, null, 2));
    console.log('\n📋 Evidence saved to: final-qa-evidence.json');
  });
});