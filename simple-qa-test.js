const puppeteer = require('puppeteer');

const BASE_URL = 'http://10.0.0.109:3000';

async function testSpecificIssues() {
  console.log('🔍 Starting Simple QA Testing for User-Reported Issues...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  
  const findings = {
    graphqlIssues: [],
    grpcIssues: [], 
    contrastIssues: [],
    screenshots: []
  };

  try {
    // Step 1: Go to homepage and take screenshot
    console.log('📸 Loading homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: 'simple-qa-homepage.png', fullPage: true });
    findings.screenshots.push('simple-qa-homepage.png');
    console.log('✅ Homepage loaded and screenshot taken');
    
    // Step 2: Look for repositories and test GraphQL/gRPC
    console.log('🔍 Looking for repository links...');
    
    const repositoryLinks = await page.$$eval('a[href*="/repo"], a[href*="/repository"]', links => 
      links.slice(0, 5).map(link => ({
        href: link.href,
        text: link.textContent?.trim()
      }))
    );
    
    console.log(`Found ${repositoryLinks.length} repository links`);
    
    for (let i = 0; i < repositoryLinks.length; i++) {
      const repo = repositoryLinks[i];
      console.log(`\n🧪 Testing repository: ${repo.text}`);
      
      try {
        await page.goto(repo.href, { waitUntil: 'networkidle2', timeout: 20000 });
        
        const repoScreenshot = `simple-qa-repo-${i+1}.png`;
        await page.screenshot({ path: repoScreenshot, fullPage: true });
        findings.screenshots.push(repoScreenshot);
        
        // Look for GraphQL buttons using simple selectors
        const graphqlButtonsExist = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.some(btn => 
            btn.textContent?.toLowerCase().includes('graphql') ||
            btn.getAttribute('data-testid')?.includes('graphql')
          );
        });
        
        if (graphqlButtonsExist) {
          console.log('✅ Found GraphQL button');
          
          // Click GraphQL button
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const graphqlBtn = buttons.find(btn => 
              btn.textContent?.toLowerCase().includes('graphql')
            );
            if (graphqlBtn) graphqlBtn.click();
          });
          
          await page.waitForTimeout(3000);
          
          const afterClickUrl = page.url();
          const graphqlScreenshot = `simple-qa-graphql-${i+1}.png`;
          await page.screenshot({ path: graphqlScreenshot, fullPage: true });
          findings.screenshots.push(graphqlScreenshot);
          
          const pageText = await page.evaluate(() => document.body.textContent?.toLowerCase() || '');
          
          if (pageText.includes('coming soon') || pageText.includes('not available')) {
            findings.graphqlIssues.push({
              repository: repo.text,
              issue: 'GraphQL button shows "Coming Soon" message',
              screenshot: graphqlScreenshot,
              url: afterClickUrl
            });
            console.log('❌ GraphQL shows "Coming Soon"');
          } else if (!afterClickUrl.includes('graphql')) {
            findings.graphqlIssues.push({
              repository: repo.text,
              issue: 'GraphQL button does not lead to GraphQL playground',
              screenshot: graphqlScreenshot,
              url: afterClickUrl
            });
            console.log(`❌ GraphQL doesn't work - redirected to: ${afterClickUrl}`);
          } else {
            console.log(`✅ GraphQL appears to work - URL: ${afterClickUrl}`);
          }
          
          // Go back to repo page
          await page.goto(repo.href, { waitUntil: 'networkidle2', timeout: 20000 });
        }
        
        // Look for gRPC buttons
        const grpcButtonsExist = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.some(btn => 
            btn.textContent?.toLowerCase().includes('grpc') ||
            btn.getAttribute('data-testid')?.includes('grpc')
          );
        });
        
        if (grpcButtonsExist) {
          console.log('✅ Found gRPC button');
          
          const beforeUrl = page.url();
          
          // Click gRPC button
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const grpcBtn = buttons.find(btn => 
              btn.textContent?.toLowerCase().includes('grpc')
            );
            if (grpcBtn) grpcBtn.click();
          });
          
          await page.waitForTimeout(3000);
          
          const afterClickUrl = page.url();
          const grpcScreenshot = `simple-qa-grpc-${i+1}.png`;
          await page.screenshot({ path: grpcScreenshot, fullPage: true });
          findings.screenshots.push(grpcScreenshot);
          
          if (afterClickUrl === BASE_URL || afterClickUrl.endsWith('/')) {
            findings.grpcIssues.push({
              repository: repo.text,
              issue: 'gRPC button redirects back to homepage',
              beforeUrl: beforeUrl,
              afterUrl: afterClickUrl,
              screenshot: grpcScreenshot
            });
            console.log(`❌ gRPC redirects to home: ${beforeUrl} → ${afterClickUrl}`);
          } else if (!afterClickUrl.includes('grpc')) {
            findings.grpcIssues.push({
              repository: repo.text,
              issue: 'gRPC button does not lead to gRPC explorer',
              beforeUrl: beforeUrl,
              afterUrl: afterClickUrl,
              screenshot: grpcScreenshot
            });
            console.log(`❌ gRPC doesn't work: ${beforeUrl} → ${afterClickUrl}`);
          } else {
            console.log(`✅ gRPC appears to work - URL: ${afterClickUrl}`);
          }
        }
        
      } catch (error) {
        console.log(`⚠️ Error testing repository ${repo.text}: ${error.message}`);
      }
    }
    
    // Step 3: Test Color Contrast on API Explorer specifically
    console.log('\n🎨 Testing color contrast on API Explorer...');
    
    try {
      await page.goto(`${BASE_URL}/api-explorer`, { waitUntil: 'networkidle2', timeout: 20000 });
      
      const contrastScreenshot = 'simple-qa-contrast-api-explorer.png';
      await page.screenshot({ path: contrastScreenshot, fullPage: true });
      findings.screenshots.push(contrastScreenshot);
      
      // Check for dark text issues
      const contrastProblems = await page.evaluate(() => {
        const problems = [];
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(el => {
          const style = window.getComputedStyle(el);
          const text = el.textContent?.trim();
          
          if (text && text.length > 5) {
            const color = style.color;
            const bgColor = style.backgroundColor;
            
            // Look for specific problematic color combinations
            if (color.includes('rgb(64, 64, 64)') || color.includes('rgb(128, 128, 128)')) {
              problems.push({
                text: text.substring(0, 50),
                color: color,
                backgroundColor: bgColor,
                element: el.tagName
              });
            }
          }
        });
        
        return problems.slice(0, 5); // Return first 5 problems
      });
      
      if (contrastProblems.length > 0) {
        findings.contrastIssues.push({
          page: 'API Explorer',
          issue: `Found ${contrastProblems.length} elements with potential contrast issues`,
          problems: contrastProblems,
          screenshot: contrastScreenshot
        });
        console.log(`⚠️ Found ${contrastProblems.length} potential contrast issues`);
      } else {
        console.log('✅ No obvious contrast issues detected');
      }
    } catch (error) {
      console.log(`⚠️ Error testing API Explorer: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Critical error during testing:', error);
  } finally {
    await browser.close();
  }
  
  // Generate report
  console.log('\n🎯 SIMPLE QA TEST RESULTS');
  console.log('===========================');
  
  console.log(`\n📸 Screenshots taken: ${findings.screenshots.length}`);
  findings.screenshots.forEach((screenshot, i) => {
    console.log(`  ${i+1}. ${screenshot}`);
  });
  
  if (findings.graphqlIssues.length > 0) {
    console.log('\n🔴 GRAPHQL ISSUES CONFIRMED:');
    findings.graphqlIssues.forEach((issue, i) => {
      console.log(`  ${i+1}. Repository: ${issue.repository}`);
      console.log(`     Issue: ${issue.issue}`);
      console.log(`     URL: ${issue.url}`);
      console.log(`     Screenshot: ${issue.screenshot}`);
    });
  } else {
    console.log('\n✅ No GraphQL issues found (or no GraphQL buttons detected)');
  }
  
  if (findings.grpcIssues.length > 0) {
    console.log('\n🔴 GRPC ISSUES CONFIRMED:');
    findings.grpcIssues.forEach((issue, i) => {
      console.log(`  ${i+1}. Repository: ${issue.repository}`);
      console.log(`     Issue: ${issue.issue}`);
      console.log(`     Before URL: ${issue.beforeUrl}`);
      console.log(`     After URL: ${issue.afterUrl}`);
      console.log(`     Screenshot: ${issue.screenshot}`);
    });
  } else {
    console.log('\n✅ No gRPC issues found (or no gRPC buttons detected)');
  }
  
  if (findings.contrastIssues.length > 0) {
    console.log('\n🔴 COLOR CONTRAST ISSUES CONFIRMED:');
    findings.contrastIssues.forEach((issue, i) => {
      console.log(`  ${i+1}. Page: ${issue.page}`);
      console.log(`     Issue: ${issue.issue}`);
      console.log(`     Screenshot: ${issue.screenshot}`);
    });
  } else {
    console.log('\n✅ No color contrast issues detected');
  }
  
  console.log('\n🎯 FINAL VERDICT:');
  const totalIssues = findings.graphqlIssues.length + findings.grpcIssues.length + findings.contrastIssues.length;
  
  if (totalIssues > 0) {
    console.log(`❌ CONFIRMED: Found ${totalIssues} issues matching user complaints`);
    console.log('   User frustrations are VALID and need to be addressed');
  } else {
    console.log('🤔 No issues detected - may need deeper investigation or specific repo testing');
  }
  
  // Save JSON report
  const fs = require('fs');
  fs.writeFileSync('simple-qa-findings.json', JSON.stringify(findings, null, 2));
  console.log('\n📋 Detailed findings saved to: simple-qa-findings.json');
}

testSpecificIssues().catch(console.error);