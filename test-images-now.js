const { chromium } = require('playwright');

async function testImages() {
  console.log('🔍 Testing image rendering in documentation...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console messages
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  // Listen for failed requests
  page.on('requestfailed', request => {
    console.log('❌ Failed request:', request.url());
  });

  try {
    // Navigate to documentation
    console.log('Navigating to documentation page...');
    await page.goto('http://localhost:3000/docs/vehicle-to-cloud-communications-architecture', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForTimeout(3000);

    // Find all images
    const images = await page.locator('img').all();
    console.log(`\n📸 Found ${images.length} images on page\n`);

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      const isVisible = await img.isVisible();

      console.log(`Image ${i + 1}:`);
      console.log(`  Alt: ${alt}`);
      console.log(`  Src: ${src}`);
      console.log(`  Visible: ${isVisible}`);

      // Try to get the natural dimensions
      try {
        const dimensions = await img.evaluate(el => ({
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
          complete: el.complete,
          currentSrc: el.currentSrc
        }));

        console.log(`  Loaded: ${dimensions.complete}`);
        console.log(`  Natural size: ${dimensions.naturalWidth}x${dimensions.naturalHeight}`);

        if (dimensions.naturalWidth === 0) {
          console.log(`  ❌ IMAGE FAILED TO LOAD`);

          // Try to fetch the image directly
          const response = await page.goto(src, { waitUntil: 'networkidle', timeout: 5000 }).catch(e => null);
          if (response) {
            console.log(`  Direct fetch status: ${response.status()}`);
            console.log(`  Content-Type: ${response.headers()['content-type']}`);
          }
        } else {
          console.log(`  ✅ IMAGE LOADED SUCCESSFULLY`);
        }
      } catch (e) {
        console.log(`  Error checking image: ${e.message}`);
      }

      console.log('');
    }

    // Take screenshot
    await page.screenshot({ path: 'test-images-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved: test-images-screenshot.png\n');

    // Check network tab for image requests
    console.log('Waiting 5 seconds to monitor network...');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await browser.close();
  }
}

testImages().catch(console.error);
