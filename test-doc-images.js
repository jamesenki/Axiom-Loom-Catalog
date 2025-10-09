const { chromium } = require('playwright');

async function testDocImages() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to API and Protocol Reference...');
  await page.goto('http://localhost:3000/docs/vehicle-to-cloud-communications-architecture/API_AND_PROTOCOL_REFERENCE', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  await page.waitForTimeout(2000);
  
  // Find all images
  const images = await page.locator('img').all();
  console.log(`\nFound ${images.length} images in document\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = await img.getAttribute('src');
    
    const dimensions = await img.evaluate(el => ({
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      complete: el.complete
    }));
    
    console.log(`Image ${i + 1}:`);
    console.log(`  src: ${src}`);
    console.log(`  naturalWidth: ${dimensions.naturalWidth}`);
    console.log(`  naturalHeight: ${dimensions.naturalHeight}`);
    
    if (dimensions.naturalWidth > 0) {
      console.log(`  ✅ LOADED`);
      successCount++;
    } else {
      console.log(`  ❌ FAILED TO LOAD`);
      failCount++;
    }
    console.log('');
  }
  
  console.log(`========================================`);
  console.log(`Summary: ${successCount} loaded, ${failCount} failed`);
  console.log(`========================================\n`);
  
  // Scroll to first image
  if (images.length > 0) {
    await images[0].scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'doc-images-test.png', fullPage: true });
  console.log('Screenshot saved as doc-images-test.png');
  
  await browser.close();
}

testDocImages().catch(console.error);
