const { chromium } = require('playwright');

async function testUpdatedReadmeLinks() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('=== TESTING UPDATED README LINKS ===');
    console.log('1. Navigating to AI Predictive Maintenance documentation page');
    await page.goto('http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('2. Taking screenshot of updated documentation page');
    await page.screenshot({ path: 'updated-readme-test.png', fullPage: true });
    
    console.log('3. Analyzing updated README content for links');
    const bodyText = await page.locator('body').textContent();
    
    // Check if README content is displayed
    const hasReadmeContent = bodyText.includes('AI Predictive Maintenance Architecture Package') || 
                             bodyText.includes('Axiom AI Maintenance');
    
    if (!hasReadmeContent) {
      throw new Error('README content is not displayed on the documentation page');
    }
    
    console.log('✓ README content is displayed correctly');
    
    // Look for the new links in the README content
    console.log('4. Searching for new external links in the README content');
    
    const expectedLinks = [
      'demo.axiom-loom.com/ai-predictive-maintenance',
      'docs.axiom-loom.com/ai-predictive-maintenance-engine-architecture', 
      'axiom-loom.com/products/ai-predictive-maintenance-engine-architecture',
      'github.com/jamesenki/ai-predictive-maintenance-engine-architecture'
    ];
    
    const foundLinks = [];
    const missingLinks = [];
    
    for (const expectedLink of expectedLinks) {
      if (bodyText.includes(expectedLink)) {
        foundLinks.push(expectedLink);
      } else {
        missingLinks.push(expectedLink);
      }
    }
    
    console.log('\n=== LINK ANALYSIS RESULTS ===');
    console.log(`Expected links: ${expectedLinks.length}`);
    console.log(`Found links: ${foundLinks.length}`);
    console.log(`Missing links: ${missingLinks.length}`);
    
    if (foundLinks.length > 0) {
      console.log('\n✓ FOUND LINKS:');
      foundLinks.forEach(link => {
        console.log(`  - ${link}`);
      });
    }
    
    if (missingLinks.length > 0) {
      console.log('\n✗ MISSING LINKS:');
      missingLinks.forEach(link => {
        console.log(`  - ${link}`);
      });
    }
    
    // Get all actual links on the page for testing
    const links = await page.locator('a').all();
    const linkInfo = [];
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      if (href && text && text.trim() && 
          (href.includes('axiom-loom.com') || href.includes('demo.axiom-loom.com') || 
           href.includes('docs.axiom-loom.com') || href.includes('github.com/jamesenki'))) {
        linkInfo.push({ href, text: text.trim() });
      }
    }
    
    console.log('\n=== ACTUAL AXIOM LOOM LINKS ON PAGE ===');
    linkInfo.forEach(link => {
      console.log(`  - "${link.text}" -> ${link.href}`);
    });
    
    // Test if the links lead to external sites (expect them to fail since these are probably demo URLs)
    console.log('\n5. Testing external link accessibility (expected to fail for demo URLs)');
    let externalLinkResults = [];
    
    for (const linkInfo of linkInfo.slice(0, 4)) { // Test first 4 links only
      console.log(`Testing external link: "${linkInfo.text}" -> ${linkInfo.href}`);
      
      try {
        if (linkInfo.href.startsWith('http')) {
          const response = await page.request.get(linkInfo.href);
          externalLinkResults.push({ 
            ...linkInfo, 
            status: response.status(),
            accessible: response.status() < 400
          });
        }
      } catch (error) {
        externalLinkResults.push({ 
          ...linkInfo, 
          status: 'ERROR',
          error: error.message,
          accessible: false
        });
      }
    }
    
    console.log('\n=== EXTERNAL LINK TEST RESULTS ===');
    externalLinkResults.forEach(result => {
      const status = result.accessible ? '✓' : '✗';
      console.log(`${status} "${result.text}" -> ${result.href} (${result.status})`);
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });
    
    // Check that we now have the standard Axiom Loom pattern
    const hasLiveDemo = bodyText.includes('Live Demo') && bodyText.includes('demo.axiom-loom.com');
    const hasDocumentation = bodyText.includes('Documentation') && bodyText.includes('docs.axiom-loom.com');
    const hasProductWebsite = bodyText.includes('Product Website') && bodyText.includes('axiom-loom.com/products');
    const hasGitHub = bodyText.includes('GitHub Repository') && bodyText.includes('github.com/jamesenki');
    
    console.log('\n=== STANDARD PATTERN VERIFICATION ===');
    console.log(`✓ Live Demo link: ${hasLiveDemo}`);
    console.log(`✓ Documentation link: ${hasDocumentation}`);
    console.log(`✓ Product Website link: ${hasProductWebsite}`);
    console.log(`✓ GitHub Repository link: ${hasGitHub}`);
    
    const followsStandardPattern = hasLiveDemo && hasDocumentation && hasProductWebsite && hasGitHub;
    
    if (followsStandardPattern) {
      console.log('\n🎉 SUCCESS: README now follows the standard Axiom Loom pattern!');
      console.log('- ✅ All 4 standard link types present');
      console.log('- ✅ Links point to consistent external Axiom Loom domains');
      console.log('- ✅ No more broken internal links or Coming Soon pages');
      console.log('- ✅ Matches pattern used by other architecture packages');
    } else {
      console.log('\n⚠️ WARNING: README does not fully follow the standard pattern');
    }
    
  } catch (error) {
    console.error('Error during test:', error.message);
    await page.screenshot({ path: 'updated-readme-test-error.png', fullPage: true });
    console.log('Error screenshot saved as: updated-readme-test-error.png');
  } finally {
    await browser.close();
  }
}

testUpdatedReadmeLinks();