const puppeteer = require('puppeteer');

async function testHeaderOverlay() {
  console.log('🔍 Testing header overlay fix...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    console.log('📸 Testing homepage...');
    await page.goto('http://10.0.0.109:3000', { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({ 
      path: 'header-overlay-fixed.png',
      fullPage: false
    });
    
    // Check if content is visible below header
    const contentPosition = await page.evaluate(() => {
      const firstHeading = document.querySelector('h1');
      const header = document.querySelector('header');
      
      if (firstHeading && header) {
        const headingRect = firstHeading.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        
        return {
          headerBottom: headerRect.bottom,
          headingTop: headingRect.top,
          headingText: firstHeading.textContent,
          isOverlapping: headingRect.top < headerRect.bottom,
          clearance: headingRect.top - headerRect.bottom
        };
      }
      return null;
    });
    
    console.log('\n📊 Header Analysis:');
    if (contentPosition) {
      console.log(`Header bottom: ${contentPosition.headerBottom}px`);
      console.log(`Content top: ${contentPosition.headingTop}px`);
      console.log(`Clearance: ${contentPosition.clearance}px`);
      console.log(`Is overlapping: ${contentPosition.isOverlapping ? '❌ YES' : '✅ NO'}`);
      console.log(`First heading: "${contentPosition.headingText}"`);
    }
    
    console.log('\n📸 Screenshot saved: header-overlay-fixed.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await browser.close();
  console.log('\n✅ Test complete!');
}

testHeaderOverlay();