const { chromium } = require('playwright');

async function testFixedReadmeLinks() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('=== TESTING FIXED README LINKS ===');
    console.log('1. Navigating to AI Predictive Maintenance documentation page');
    await page.goto('http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow content to fully render
    
    console.log('2. Taking screenshot of documentation page');
    await page.screenshot({ path: 'readme-fixed-test.png', fullPage: true });
    
    console.log('3. Analyzing README content for links');
    const bodyText = await page.locator('body').textContent();
    
    // Check if README content is displayed
    const hasReadmeContent = bodyText.includes('AI Predictive Maintenance Architecture Package') || 
                             bodyText.includes('Axiom AI Maintenance');
    
    if (!hasReadmeContent) {
      throw new Error('README content is not displayed on the documentation page');
    }
    
    console.log('✓ README content is displayed correctly');
    
    // Look for any remaining links in the README content
    console.log('4. Searching for links in the README content');
    
    // Get all links on the page
    const links = await page.locator('a').all();
    const linkInfo = [];
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      if (href && text && text.trim()) {
        linkInfo.push({ href, text: text.trim() });
      }
    }
    
    console.log('Found links:', linkInfo.length);
    
    // Filter for links that are in the README content area (not navigation)
    const readmeLinks = linkInfo.filter(link => 
      link.text.includes('GitHub Repository') ||
      link.text.includes('Architecture Demo') ||
      link.text.includes('Implementation Guide') ||
      link.text.includes('Product Details') ||
      link.href.includes('/demo/') ||
      link.href.includes('/coming-soon/')
    );
    
    console.log('README-related links found:', readmeLinks);
    
    // Test each README-related link
    console.log('5. Testing README links functionality');
    let brokenLinks = [];
    let workingLinks = [];
    
    for (const linkInfo of readmeLinks) {
      console.log(`Testing link: "${linkInfo.text}" -> ${linkInfo.href}`);
      
      try {
        if (linkInfo.href.startsWith('http://') || linkInfo.href.startsWith('https://')) {
          // External link - test with fetch
          const response = await page.request.get(linkInfo.href);
          if (response.status() >= 400) {
            brokenLinks.push({ ...linkInfo, error: `HTTP ${response.status()}` });
          } else {
            workingLinks.push(linkInfo);
          }
        } else if (linkInfo.href.startsWith('/')) {
          // Internal link - test with navigation
          const testPage = await context.newPage();
          try {
            const response = await testPage.goto(`http://10.0.0.109:3000${linkInfo.href}`);
            await testPage.waitForTimeout(1000);
            
            const testPageTitle = await testPage.title();
            const testPageUrl = testPage.url();
            
            // Check if we got redirected to home (which indicates broken link)
            if (testPageUrl === 'http://10.0.0.109:3000/' && linkInfo.href !== '/') {
              brokenLinks.push({ ...linkInfo, error: 'Redirected to home page' });
            } else if (response && response.status() >= 400) {
              brokenLinks.push({ ...linkInfo, error: `HTTP ${response.status()}` });
            } else {
              workingLinks.push({ ...linkInfo, finalUrl: testPageUrl, title: testPageTitle });
            }
          } finally {
            await testPage.close();
          }
        }
      } catch (error) {
        brokenLinks.push({ ...linkInfo, error: error.message });
      }
    }
    
    console.log('\n=== LINK TEST RESULTS ===');
    console.log(`Working links: ${workingLinks.length}`);
    console.log(`Broken links: ${brokenLinks.length}`);
    
    if (workingLinks.length > 0) {
      console.log('\n✓ WORKING LINKS:');
      workingLinks.forEach(link => {
        console.log(`  - "${link.text}" -> ${link.href}`);
        if (link.finalUrl) {
          console.log(`    Final URL: ${link.finalUrl}`);
          console.log(`    Page Title: ${link.title}`);
        }
      });
    }
    
    if (brokenLinks.length > 0) {
      console.log('\n✗ BROKEN LINKS:');
      brokenLinks.forEach(link => {
        console.log(`  - "${link.text}" -> ${link.href}`);
        console.log(`    Error: ${link.error}`);
      });
      
      console.log('\n⚠️ THERE ARE STILL BROKEN LINKS IN THE README');
    } else {
      console.log('\n✓ ALL README LINKS ARE WORKING CORRECTLY');
      
      // Check that problematic links have been removed
      const hasDemoLinks = readmeLinks.some(link => link.href.includes('/demo/'));
      const hasComingSoonLinks = readmeLinks.some(link => link.href.includes('/coming-soon/'));
      
      if (hasDemoLinks) {
        console.log('⚠️ WARNING: Still found /demo/ links in README');
      }
      if (hasComingSoonLinks) {
        console.log('⚠️ WARNING: Still found /coming-soon/ links in README');
      }
      
      if (!hasDemoLinks && !hasComingSoonLinks) {
        console.log('✓ CONFIRMED: No more /demo/ or /coming-soon/ links in README');
      }
    }
    
    console.log('\n6. Checking that README content looks correct');
    
    // Verify that the README still contains the expected content structure
    const hasLinksSection = bodyText.includes('Links & Resources');
    const hasQuickStart = bodyText.includes('Quick Start Implementation');
    const hasGitHubLink = bodyText.includes('GitHub Repository');
    
    console.log(`✓ Has "Links & Resources" section: ${hasLinksSection}`);
    console.log(`✓ Has "Quick Start Implementation" section: ${hasQuickStart}`);
    console.log(`✓ Has GitHub Repository link: ${hasGitHubLink}`);
    
    const missingDemoLink = !bodyText.includes('Architecture Demo') || !bodyText.includes('/demo/');
    const missingComingSoonLinks = !bodyText.includes('Implementation Guide') || !bodyText.includes('Product Details') || 
                                   !bodyText.includes('/coming-soon/');
    
    console.log(`✓ Removed broken Architecture Demo link: ${missingDemoLink}`);
    console.log(`✓ Removed Coming Soon placeholder links: ${missingComingSoonLinks}`);
    
    if (brokenLinks.length === 0 && missingDemoLink && missingComingSoonLinks) {
      console.log('\n🎉 SUCCESS: README has been fixed!');
      console.log('- All broken links removed');
      console.log('- Only working links remain');
      console.log('- Content structure preserved');
    }
    
  } catch (error) {
    console.error('Error during test:', error.message);
    await page.screenshot({ path: 'readme-test-error.png', fullPage: true });
    console.log('Error screenshot saved as: readme-test-error.png');
  } finally {
    await browser.close();
  }
}

testFixedReadmeLinks();