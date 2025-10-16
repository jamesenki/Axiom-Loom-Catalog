const { chromium } = require('playwright');

async function testApiDocImages() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating directly to API documentation...');
  await page.goto('http://localhost:3000/docs/vehicle-to-cloud-communications-architecture/API_AND_PROTOCOL_REFERENCE.md', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.waitForTimeout(3000);

  // Wait for documentation content to load
  try {
    await page.waitForSelector('text=Vehicle-to-Cloud Communications', { timeout: 10000 });
    console.log('✅ Documentation loaded');
  } catch (e) {
    console.log('❌ Documentation did not load');
  }

  // Find all images in the documentation
  const images = await page.locator('img').all();
  console.log(`\nFound ${images.length} images in document`);

  // Expected images from API_AND_PROTOCOL_REFERENCE.md
  const expectedImages = [
    'C4_Project_Architecture.png',
    'Lifecycle.png',
    'HighandLow.png',
    'mqtt_client_message_life_cycle.png'
  ];

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const dimensions = await img.evaluate(el => ({
      src: el.src,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      complete: el.complete,
      alt: el.alt
    }));

    const imageFileName = dimensions.src.split('/').pop();
    const isExpected = expectedImages.some(expected => dimensions.src.includes(expected));

    if (dimensions.naturalWidth > 0 && dimensions.naturalHeight > 0) {
      console.log(`\n✅ Image ${i + 1} LOADED SUCCESSFULLY:`);
      console.log(`   File: ${imageFileName}`);
      console.log(`   Alt: ${dimensions.alt}`);
      console.log(`   Dimensions: ${dimensions.naturalWidth} x ${dimensions.naturalHeight}`);
      console.log(`   URL: ${dimensions.src}`);
      if (isExpected) successCount++;
    } else {
      console.log(`\n❌ Image ${i + 1} FAILED TO LOAD:`);
      console.log(`   File: ${imageFileName}`);
      console.log(`   Alt: ${dimensions.alt}`);
      console.log(`   naturalWidth: ${dimensions.naturalWidth}`);
      console.log(`   URL: ${dimensions.src}`);
      if (isExpected) failureCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`SUMMARY:`);
  console.log(`  Expected images that loaded: ${successCount}/${expectedImages.length}`);
  console.log(`  Expected images that failed: ${failureCount}/${expectedImages.length}`);
  console.log('='.repeat(60));

  // Take screenshot
  await page.screenshot({ path: 'api-doc-images-test.png', fullPage: true });
  console.log('\nScreenshot saved as api-doc-images-test.png');

  await browser.close();

  if (failureCount > 0) {
    console.log('\n❌ TEST FAILED: Some images did not load');
    process.exit(1);
  } else {
    console.log('\n✅ TEST PASSED: All expected images loaded successfully');
  }
}

testApiDocImages().catch(console.error);
