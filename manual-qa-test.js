const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://10.0.0.109:3000';

async function runManualQA() {
  console.log('🔍 Starting Manual QA Testing...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  const report = {
    timestamp: new Date().toISOString(),
    graphqlIssues: [],
    grpcIssues: [],
    colorContrastIssues: [],
    workingFeatures: [],
    screenshots: []
  };

  try {
    // Test 1: Check Homepage
    console.log('📸 Testing Homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: 'manual-qa-homepage.png', fullPage: true });
    report.screenshots.push('manual-qa-homepage.png');
    
    // Test 2: Find and test specific repositories
    await testSpecificRepositories(page, report);
    
    // Test 3: Test Color Contrast Issues
    await testColorContrastIssues(page, report);
    
    // Generate final report
    generateFinalReport(report);
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await browser.close();
  }
}

async function testSpecificRepositories(page, report) {
  console.log('🧪 Testing specific repositories for GraphQL and gRPC...');
  
  // List of potential repository names that might have GraphQL/gRPC
  const testRepos = [
    'cloudtwin-simulation-platform-architecture',
    'diagnostic-as-code-platform-architecture', 
    'ai-predictive-maintenance-engine',
    'deploymaster-sdv-ota-platform',
    'ecosystem-platform-architecture'
  ];
  
  for (const repoName of testRepos) {
    try {
      console.log(`🔍 Testing repository: ${repoName}`);
      
      // Try to navigate directly to repository
      const repoUrl = `${BASE_URL}/repository/${repoName}`;
      await page.goto(repoUrl, { waitUntil: 'networkidle2', timeout: 20000 });
      
      const screenshotPath = `manual-qa-repo-${repoName}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      report.screenshots.push(screenshotPath);
      
      // Check for GraphQL button
      const graphqlButtons = await page.$$('button:has-text("GraphQL"), button:has-text("graphql"), [data-testid*="graphql"]');
      if (graphqlButtons.length > 0) {
        console.log(`✅ Found GraphQL button for ${repoName}`);
        
        // Click GraphQL button and test
        await graphqlButtons[0].click();
        await page.waitForTimeout(3000);
        
        const afterClickUrl = page.url();
        const graphqlScreenshot = `manual-qa-graphql-${repoName}.png`;
        await page.screenshot({ path: graphqlScreenshot, fullPage: true });
        report.screenshots.push(graphqlScreenshot);
        
        const pageContent = await page.content();
        
        if (pageContent.toLowerCase().includes('coming soon') || 
            pageContent.toLowerCase().includes('not available')) {
          report.graphqlIssues.push({
            repository: repoName,
            issue: 'GraphQL button shows "Coming Soon" message',
            url: afterClickUrl,
            screenshot: graphqlScreenshot
          });
          console.log(`❌ ${repoName}: GraphQL shows "Coming Soon"`);
        } else if (afterClickUrl.includes('graphql')) {
          report.workingFeatures.push({
            feature: `GraphQL for ${repoName}`,
            status: 'Working correctly',
            url: afterClickUrl
          });
          console.log(`✅ ${repoName}: GraphQL working at ${afterClickUrl}`);
        } else {
          report.graphqlIssues.push({
            repository: repoName,
            issue: 'GraphQL button does not lead to GraphQL playground',
            url: afterClickUrl,
            screenshot: graphqlScreenshot
          });
          console.log(`❌ ${repoName}: GraphQL doesn't work - ${afterClickUrl}`);
        }
        
        // Go back to repo page
        await page.goto(repoUrl, { waitUntil: 'networkidle2', timeout: 20000 });
      }
      
      // Check for gRPC button  
      const grpcButtons = await page.$$('button:has-text("gRPC"), button:has-text("GRPC"), button:has-text("grpc"), [data-testid*="grpc"]');
      if (grpcButtons.length > 0) {
        console.log(`✅ Found gRPC button for ${repoName}`);
        
        const beforeUrl = page.url();
        await grpcButtons[0].click();
        await page.waitForTimeout(3000);
        
        const afterClickUrl = page.url();
        const grpcScreenshot = `manual-qa-grpc-${repoName}.png`;
        await page.screenshot({ path: grpcScreenshot, fullPage: true });
        report.screenshots.push(grpcScreenshot);
        
        if (afterClickUrl === BASE_URL || afterClickUrl.endsWith('/')) {
          report.grpcIssues.push({
            repository: repoName,
            issue: 'gRPC button redirects to homepage instead of gRPC explorer',
            beforeUrl: beforeUrl,
            afterUrl: afterClickUrl,
            screenshot: grpcScreenshot
          });
          console.log(`❌ ${repoName}: gRPC redirects to home`);
        } else if (afterClickUrl.includes('grpc')) {
          report.workingFeatures.push({
            feature: `gRPC for ${repoName}`,
            status: 'Working correctly',
            url: afterClickUrl
          });
          console.log(`✅ ${repoName}: gRPC working at ${afterClickUrl}`);
        } else {
          report.grpcIssues.push({
            repository: repoName,
            issue: 'gRPC button does not lead to gRPC explorer',
            beforeUrl: beforeUrl,
            afterUrl: afterClickUrl,
            screenshot: grpcScreenshot
          });
          console.log(`❌ ${repoName}: gRPC doesn't work - ${afterClickUrl}`);
        }
      }
      
    } catch (error) {
      console.log(`⚠️ Could not test repository ${repoName}: ${error.message}`);
    }
  }
}

async function testColorContrastIssues(page, report) {
  console.log('🎨 Testing Color Contrast Issues...');
  
  const pagesToTest = [
    { name: 'API Explorer', url: `${BASE_URL}/api-explorer` },
    { name: 'APIs', url: `${BASE_URL}/apis` },
    { name: 'All APIs', url: `${BASE_URL}/api` }
  ];
  
  for (const pageInfo of pagesToTest) {
    try {
      await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 20000 });
      
      const screenshotPath = `manual-qa-contrast-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      report.screenshots.push(screenshotPath);
      
      // Check for specific color contrast issues
      const contrastIssues = await page.evaluate(() => {
        const issues = [];
        const textElements = document.querySelectorAll('*');
        
        textElements.forEach((el) => {
          const computed = window.getComputedStyle(el);
          const text = el.textContent?.trim();
          
          if (text && text.length > 5) {
            const color = computed.color;
            const backgroundColor = computed.backgroundColor || computed.background;
            
            // Look for dark gray text (problematic)
            if (color && (color.includes('rgb(64, 64, 64)') || 
                         color.includes('rgb(128, 128, 128)') ||
                         color.includes('#404040') ||
                         color.includes('#808080'))) {
              issues.push({
                element: el.tagName,
                text: text.substring(0, 50),
                color: color,
                backgroundColor: backgroundColor,
                className: el.className
              });
            }
          }
        });
        
        return issues;
      });
      
      if (contrastIssues.length > 0) {
        report.colorContrastIssues.push({
          page: pageInfo.name,
          issue: `Found ${contrastIssues.length} potential dark text on dark background issues`,
          details: contrastIssues.slice(0, 3),
          screenshot: screenshotPath
        });
        console.log(`⚠️ ${pageInfo.name}: Found ${contrastIssues.length} contrast issues`);
      } else {
        report.workingFeatures.push({
          feature: `Color contrast on ${pageInfo.name}`,
          status: 'No obvious contrast issues detected'
        });
        console.log(`✅ ${pageInfo.name}: Color contrast looks good`);
      }
      
    } catch (error) {
      console.log(`⚠️ Could not test ${pageInfo.name}: ${error.message}`);
    }
  }
}

function generateFinalReport(report) {
  console.log('\n🎯 MANUAL QA TEST RESULTS');
  console.log('===========================');
  console.log(`⏰ Test completed at: ${report.timestamp}`);
  console.log(`✅ Working features: ${report.workingFeatures.length}`);
  console.log(`❌ GraphQL issues: ${report.graphqlIssues.length}`);
  console.log(`❌ gRPC issues: ${report.grpcIssues.length}`);
  console.log(`❌ Color contrast issues: ${report.colorContrastIssues.length}`);
  console.log(`📸 Screenshots taken: ${report.screenshots.length}`);
  
  if (report.graphqlIssues.length > 0) {
    console.log('\n🔴 GRAPHQL ISSUES:');
    report.graphqlIssues.forEach((issue, i) => {
      console.log(`  ${i+1}. ${issue.repository}: ${issue.issue}`);
      console.log(`     URL: ${issue.url}`);
      console.log(`     Screenshot: ${issue.screenshot}`);
    });
  }
  
  if (report.grpcIssues.length > 0) {
    console.log('\n🔴 GRPC ISSUES:');
    report.grpcIssues.forEach((issue, i) => {
      console.log(`  ${i+1}. ${issue.repository}: ${issue.issue}`);
      if (issue.beforeUrl && issue.afterUrl) {
        console.log(`     Navigation: ${issue.beforeUrl} → ${issue.afterUrl}`);
      }
      console.log(`     Screenshot: ${issue.screenshot}`);
    });
  }
  
  if (report.colorContrastIssues.length > 0) {
    console.log('\n🔴 COLOR CONTRAST ISSUES:');
    report.colorContrastIssues.forEach((issue, i) => {
      console.log(`  ${i+1}. ${issue.page}: ${issue.issue}`);
      console.log(`     Screenshot: ${issue.screenshot}`);
    });
  }
  
  if (report.workingFeatures.length > 0) {
    console.log('\n🟢 WORKING FEATURES:');
    report.workingFeatures.forEach((feature, i) => {
      console.log(`  ${i+1}. ${feature.feature}: ${feature.status}`);
      if (feature.url) console.log(`     URL: ${feature.url}`);
    });
  }
  
  // Save JSON report
  fs.writeFileSync('manual-qa-report.json', JSON.stringify(report, null, 2));
  console.log('\n📋 Detailed report saved to: manual-qa-report.json');
  
  console.log('\n🎯 SUMMARY:');
  if (report.graphqlIssues.length > 0 || report.grpcIssues.length > 0 || report.colorContrastIssues.length > 0) {
    console.log('❌ ISSUES CONFIRMED - User complaints are valid!');
  } else {
    console.log('✅ No major issues found - Need further investigation');
  }
}

// Run the test
runManualQA().catch(console.error);