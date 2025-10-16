const { chromium } = require('playwright');

async function testStaticImages() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to vehicle-to-cloud-communications-architecture...');
  await page.goto('http://localhost:3000/docs/vehicle-to-cloud-communications-architecture', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  // Wait a bit for markdown to render
  await page.waitForTimeout(2000);
  
  // Find all images
  const images = await page.locator('img').all();
  console.log(`\nFound ${images.length} images on page\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = await img.getAttribute('src');
    
    const dimensions = await img.evaluate(el => ({
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      complete: el.complete,
      currentSrc: el.currentSrc
    }));
    
    console.log(`\nImage ${i + 1}:`);
    console.log(`  src: ${src}`);
    console.log(`  naturalWidth: ${dimensions.naturalWidth}`);
    console.log(`  naturalHeight: ${dimensions.naturalHeight}`);
    console.log(`  complete: ${dimensions.complete}`);
    
    if (dimensions.naturalWidth > 0) {
      console.log(`  ✅ IMAGE LOADED SUCCESSFULLY`);
      successCount++;
    } else {
      console.log(`  ❌ IMAGE FAILED TO LOAD`);
      failCount++;
      
      // Test the URL directly
      console.log(`  Testing URL directly...`);
      try {
        const response = await page.request.get(dimensions.currentSrc || src);
        console.log(`  HTTP Status: ${response.status()}`);
        console.log(`  Content-Type: ${response.headers()['content-type']}`);
      } catch (e) {
        console.log(`  Error fetching: ${e.message}`);
      }
    }
  }
  
  console.log(`\n========================================`);
  console.log(`Summary: ${successCount} loaded, ${failCount} failed`);
  console.log(`========================================\n`);
  
  // Take screenshot
  await page.screenshot({ path: 'static-images-test.png', fullPage: true });
  console.log('Screenshot saved as static-images-test.png');
  
  await browser.close();
}

testStaticImages().catch(console.error);
