const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testSpecificCard() {
  let browser, page;
  const screenshotsDir = path.join(__dirname, 'screenshots');
  
  // Ensure screenshots directory exists
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  try {
    console.log('🚀 Starting browser for specific card test...');
    browser = await chromium.launch({ headless: false, slowMo: 1000 }); // Visible browser with delay
    page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1200, height: 800 });
    
    console.log('📍 Step 1: Navigate to http://10.0.0.109:3000/');
    await page.goto('http://10.0.0.109:3000/', { waitUntil: 'networkidle' });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking initial screenshot...');
    await page.screenshot({ path: path.join(screenshotsDir, '01-homepage-detailed.png'), fullPage: true });
    
    console.log('🔍 Step 2: Looking for AI Predictive Maintenance card more specifically...');
    
    // Try multiple approaches to find the card
    let cardFound = false;
    let docButtonFound = false;
    
    // Approach 1: Look for cards containing "Predictive Maintenance" text
    const cardElements = await page.$$('div');
    console.log(`Found ${cardElements.length} div elements to search through...`);
    
    for (let i = 0; i < cardElements.length; i++) {
      try {
        const text = await cardElements[i].textContent();
        if (text && text.includes('AI Predictive Maintenance')) {
          console.log(`✅ Found card with matching text at index ${i}`);
          console.log(`Card text preview: "${text.substring(0, 200)}..."`);
          cardFound = true;
          
          // Look for Documentation button within this card
          const docButtons = await cardElements[i].$$('text=Documentation');
          if (docButtons.length > 0) {
            console.log('✅ Found Documentation button in this card!');
            docButtonFound = true;
            
            console.log('📱 Clicking Documentation button...');
            await docButtons[0].click();
            break;
          } else {
            // Try other button selectors
            const allButtons = await cardElements[i].$$('button, a');
            console.log(`Found ${allButtons.length} buttons/links in this card`);
            
            for (const btn of allButtons) {
              const btnText = await btn.textContent();
              console.log(`Button text: "${btnText}"`);
              if (btnText && btnText.includes('Documentation')) {
                console.log('✅ Found Documentation button!');
                docButtonFound = true;
                await btn.click();
                break;
              }
            }
            
            if (docButtonFound) break;
          }
        }
      } catch (e) {
        // Skip elements that can't be accessed
        continue;
      }
    }
    
    if (!cardFound) {
      console.log('❌ Could not find AI Predictive Maintenance card');
      // Let's try a different approach - look at the page structure
      console.log('🔍 Analyzing page structure...');
      
      const pageContent = await page.content();
      if (pageContent.includes('AI Predictive Maintenance')) {
        console.log('✅ Text "AI Predictive Maintenance" found in page HTML');
        
        // Try clicking by text directly
        try {
          await page.click('text="Documentation"', { timeout: 5000 });
          console.log('✅ Clicked Documentation button using text selector');
          docButtonFound = true;
        } catch (e) {
          console.log('❌ Could not click Documentation button using text selector');
        }
      }
    }
    
    if (!docButtonFound) {
      console.log('❌ Could not find or click Documentation button');
      await page.screenshot({ path: path.join(screenshotsDir, '02-no-doc-button-found.png'), fullPage: true });
      return;
    }
    
    console.log('⏳ Waiting for navigation after clicking Documentation button...');
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    console.log(`🌐 Current URL after click: ${currentUrl}`);
    
    console.log('📸 Step 3: Taking screenshot of documentation page...');
    await page.screenshot({ path: path.join(screenshotsDir, '03-documentation-page.png'), fullPage: true });
    
    // Check if we're on the expected URL
    const expectedUrl = 'http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture';
    const urlMatch = currentUrl === expectedUrl || currentUrl.includes('ai-predictive-maintenance-engine-architecture');
    
    if (urlMatch) {
      console.log('✅ Successfully navigated to expected documentation URL');
    } else {
      console.log(`⚠️  Expected URL pattern: *ai-predictive-maintenance-engine-architecture*`);
      console.log(`⚠️  Actual URL: ${currentUrl}`);
    }
    
    console.log('🔍 Step 4: Analyzing page content for README...');
    
    // Get all text content
    const bodyText = await page.$eval('body', body => body.textContent);
    console.log(`Total page text length: ${bodyText.length} characters`);
    console.log(`Page content preview: "${bodyText.substring(0, 500)}..."`);
    
    // Look for specific README indicators
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', headings => 
      headings.map(h => ({ tag: h.tagName, text: h.textContent.trim() }))
    );
    
    console.log(`Found ${headings.length} headings:`);
    headings.forEach((heading, i) => {
      console.log(`  ${i + 1}. ${heading.tag}: "${heading.text}"`);
    });
    
    // Look for code blocks
    const codeBlocks = await page.$$eval('pre, code', blocks => 
      blocks.map(block => block.textContent.trim().substring(0, 100))
    );
    
    if (codeBlocks.length > 0) {
      console.log(`Found ${codeBlocks.length} code blocks:`);
      codeBlocks.slice(0, 3).forEach((code, i) => {
        console.log(`  ${i + 1}. "${code}..."`);
      });
    }
    
    // Look for lists
    const lists = await page.$$eval('ul, ol', lists => 
      lists.map(list => list.textContent.trim().substring(0, 100))
    );
    
    if (lists.length > 0) {
      console.log(`Found ${lists.length} lists:`);
      lists.slice(0, 3).forEach((list, i) => {
        console.log(`  ${i + 1}. "${list}..."`);
      });
    }
    
    console.log('🔗 Step 5: Finding and testing links...');
    
    // Get all links
    const links = await page.$$eval('a[href]', links => 
      links.map(link => ({
        text: link.textContent.trim(),
        href: link.href,
        isExternal: link.href.startsWith('http') && !link.href.includes('10.0.0.109:3000')
      })).filter(link => link.text.length > 0)
    );
    
    console.log(`Found ${links.length} links with text:`);
    links.forEach((link, index) => {
      console.log(`  ${index + 1}. "${link.text}" -> ${link.href} ${link.isExternal ? '(external)' : '(internal)'}`);
    });
    
    // Test first few internal links
    const internalLinks = links.filter(link => !link.isExternal).slice(0, 3);
    
    for (let i = 0; i < internalLinks.length; i++) {
      const link = internalLinks[i];
      try {
        console.log(`🧪 Testing internal link ${i + 1}: "${link.text}" -> ${link.href}`);
        
        // Click the link
        await page.click(`a[href="${link.href}"]`);
        await page.waitForTimeout(3000);
        await page.waitForLoadState('networkidle');
        
        const newUrl = page.url();
        console.log(`✅ Link test successful. Navigated to: ${newUrl}`);
        
        // Take screenshot of the result
        await page.screenshot({ 
          path: path.join(screenshotsDir, `04-link-${i + 1}-${link.text.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30)}.png`), 
          fullPage: true 
        });
        
        // Check if content loaded
        const linkPageText = await page.$eval('body', body => body.textContent);
        if (linkPageText.length > 100) {
          console.log(`✅ Content loaded (${linkPageText.length} characters)`);
        } else {
          console.log(`⚠️  Very little content loaded (${linkPageText.length} characters)`);
        }
        
        // Go back for next test
        await page.goBack();
        await page.waitForTimeout(2000);
        
      } catch (error) {
        console.log(`❌ Link test failed: "${link.text}" -> ${link.href} (Error: ${error.message})`);
      }
    }
    
    console.log('\n📋 COMPREHENSIVE REPORT:');
    console.log('========================');
    console.log(`1. Homepage Navigation: ✅ SUCCESS`);
    console.log(`2. AI Predictive Maintenance Card Found: ${cardFound ? '✅ YES' : '❌ NO'}`);
    console.log(`3. Documentation Button Clicked: ${docButtonFound ? '✅ YES' : '❌ NO'}`);
    console.log(`4. Correct URL Navigation: ${urlMatch ? '✅ YES' : '❌ NO'}`);
    console.log(`5. Current URL: ${currentUrl}`);
    console.log(`6. Page Content Length: ${bodyText.length} characters`);
    console.log(`7. Headings Found: ${headings.length}`);
    console.log(`8. Code Blocks Found: ${codeBlocks.length}`);
    console.log(`9. Lists Found: ${lists.length}`);
    console.log(`10. Total Links Found: ${links.length}`);
    console.log(`11. Internal Links Tested: ${internalLinks.length}`);
    
    // Final screenshot
    await page.screenshot({ path: path.join(screenshotsDir, '05-final-state.png'), fullPage: true });
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    if (page) {
      await page.screenshot({ path: path.join(screenshotsDir, 'error-screenshot.png'), fullPage: true });
    }
  } finally {
    if (browser) {
      console.log('🔄 Keeping browser open for 10 seconds for manual inspection...');
      await page.waitForTimeout(10000);
      await browser.close();
    }
  }
}

testSpecificCard();