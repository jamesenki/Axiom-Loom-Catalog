/**
 * Comprehensive test to verify what the browser actually sees
 * for vehicle-to-cloud-communications-architecture
 */

const { chromium } = require('playwright');

async function runTests() {
  console.log('🧪 Starting comprehensive browser-based tests...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    passed: [],
    failed: []
  };

  try {
    // Test 1: Repository card exists and has correct API buttons
    console.log('📋 Test 1: Repository Card and API Buttons');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const repoCard = page.locator('text=vehicle-to-cloud-communications-architecture').first();
    const cardExists = await repoCard.isVisible();

    if (cardExists) {
      console.log('  ✅ Repository card is visible');
      results.passed.push('Repository card visible');

      // Check for API buttons
      const asyncApiButton = page.locator('[data-testid="asyncapi-button"]');
      const grpcButton = page.locator('[data-testid="grpc-button"]');
      const swaggerButton = page.locator('[data-testid="swagger-button"]');

      const hasAsyncApi = await asyncApiButton.count() > 0;
      const hasGrpc = await grpcButton.count() > 0;
      const hasSwagger = await swaggerButton.count() > 0;

      console.log(`  AsyncAPI button present: ${hasAsyncApi}`);
      console.log(`  gRPC button present: ${hasGrpc} (should be false)`);
      console.log(`  Swagger button present: ${hasSwagger} (should be false)`);

      if (hasGrpc) {
        console.log('  ❌ FAIL: gRPC button should NOT be present');
        results.failed.push('gRPC button incorrectly showing');
      } else {
        console.log('  ✅ PASS: gRPC button correctly absent');
        results.passed.push('gRPC button correctly absent');
      }

      if (hasAsyncApi) {
        console.log('  ✅ PASS: AsyncAPI button present');
        results.passed.push('AsyncAPI button present');
      } else {
        console.log('  ❌ FAIL: AsyncAPI button should be present');
        results.failed.push('AsyncAPI button missing');
      }
    } else {
      console.log('  ❌ Repository card not visible');
      results.failed.push('Repository card not visible');
    }

    // Test 2: Navigate to documentation view
    console.log('\n📋 Test 2: Documentation View');
    await page.goto('http://localhost:3000/docs/vehicle-to-cloud-communications-architecture', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const docTitle = await page.locator('h1:has-text("Documentation")').first();
    const docVisible = await docTitle.isVisible().catch(() => false);

    if (docVisible) {
      console.log('  ✅ Documentation page loaded');
      results.passed.push('Documentation page loads');
    } else {
      console.log('  ❌ Documentation page did not load');
      results.failed.push('Documentation page failed to load');
    }

    // Test 3: Check what files are available in documentation view
    console.log('\n📋 Test 3: Available Documentation Files');

    // Look for README.md
    const readmeLink = page.locator('text=README.md').first();
    const hasReadme = await readmeLink.isVisible().catch(() => false);
    console.log(`  README.md visible: ${hasReadme}`);

    // Look for PROTOCOL_BUFFERS.md
    const protoDocsLink = page.locator('text=PROTOCOL_BUFFERS.md').first();
    const hasProtoDocs = await protoDocsLink.isVisible().catch(() => false);
    console.log(`  PROTOCOL_BUFFERS.md visible: ${hasProtoDocs}`);

    if (hasProtoDocs) {
      console.log('  ✅ PASS: PROTOCOL_BUFFERS.md is listed');
      results.passed.push('PROTOCOL_BUFFERS.md listed');
    } else {
      console.log('  ❌ FAIL: PROTOCOL_BUFFERS.md should be visible');
      results.failed.push('PROTOCOL_BUFFERS.md not listed');
    }

    // Test 4: Check README.md content and images
    console.log('\n📋 Test 4: README.md Content and Images');

    if (hasReadme) {
      await readmeLink.click();
      await page.waitForTimeout(2000);

      // Check for images in the README
      const images = await page.locator('img').all();
      console.log(`  Found ${images.length} images in README`);

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const src = await img.getAttribute('src');
          const isVisible = await img.isVisible();
          const naturalWidth = await img.evaluate(el => el.naturalWidth);

          console.log(`  Image ${i + 1}:`);
          console.log(`    src: ${src}`);
          console.log(`    visible: ${isVisible}`);
          console.log(`    loaded: ${naturalWidth > 0} (width: ${naturalWidth}px)`);

          if (naturalWidth > 0) {
            results.passed.push(`Image ${i + 1} loads correctly`);
          } else {
            console.log(`    ❌ Image not loaded!`);
            results.failed.push(`Image ${i + 1} failed to load`);
          }
        }
      } else {
        console.log('  ⚠️ No images found in README');
        results.failed.push('No images found in README');
      }
    }

    // Test 5: Check PROTOCOL_BUFFERS.md if it exists
    if (hasProtoDocs) {
      console.log('\n📋 Test 5: PROTOCOL_BUFFERS.md Content');

      await protoDocsLink.click();
      await page.waitForTimeout(2000);

      const content = await page.locator('article, .markdown-content, main').first().textContent();

      console.log(`  Content length: ${content?.length || 0} characters`);
      console.log(`  Contains "MQTT": ${content?.includes('MQTT') || false}`);
      console.log(`  Contains "Protocol Buffer": ${content?.includes('Protocol Buffer') || false}`);
      console.log(`  Contains "Message Definitions": ${content?.includes('Message Definitions') || false}`);

      if (content && content.length > 1000) {
        console.log('  ✅ PASS: PROTOCOL_BUFFERS.md has substantial content');
        results.passed.push('PROTOCOL_BUFFERS.md has content');
      } else {
        console.log('  ❌ FAIL: PROTOCOL_BUFFERS.md content is too short or missing');
        results.failed.push('PROTOCOL_BUFFERS.md content insufficient');
      }

      // Check for embedded images
      const protoImages = await page.locator('img').all();
      console.log(`  Found ${protoImages.length} images in PROTOCOL_BUFFERS.md`);

      if (protoImages.length > 0) {
        results.passed.push('PROTOCOL_BUFFERS.md has embedded images');
      } else {
        results.failed.push('PROTOCOL_BUFFERS.md has no images');
      }
    }

    // Test 6: Direct API endpoint tests
    console.log('\n📋 Test 6: Backend API Endpoint Tests');

    const apiTests = [
      {
        name: 'File tree includes docs folder',
        url: 'http://localhost:3001/api/repository/vehicle-to-cloud-communications-architecture/files',
        check: (data) => {
          const hasDocsFolder = data.some(item => item.name === 'docs' && item.type === 'directory');
          return hasDocsFolder;
        }
      },
      {
        name: 'PROTOCOL_BUFFERS.md is accessible',
        url: 'http://localhost:3001/api/repository/vehicle-to-cloud-communications-architecture/file?path=docs/PROTOCOL_BUFFERS.md',
        check: (data) => data && data.length > 1000
      },
      {
        name: 'PNG diagram is accessible',
        url: 'http://localhost:3001/api/repository/vehicle-to-cloud-communications-architecture/file?path=src/main/doc/puml/C4_Project_Architecture.png',
        check: (data) => data && data.length > 1000
      },
      {
        name: 'API detection shows AsyncAPI',
        url: 'http://localhost:3001/api/detect-apis/vehicle-to-cloud-communications-architecture',
        check: (data) => data?.apis?.asyncapi?.length > 0 && data?.apis?.grpc?.length === 0
      }
    ];

    for (const test of apiTests) {
      const response = await fetch(test.url);
      const contentType = response.headers.get('content-type');

      let data;
      if (contentType?.includes('json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const passed = test.check(data);

      if (passed) {
        console.log(`  ✅ ${test.name}`);
        results.passed.push(test.name);
      } else {
        console.log(`  ❌ ${test.name}`);
        results.failed.push(test.name);
      }
    }

    // Test 7: Screenshot for visual verification
    console.log('\n📋 Test 7: Taking Screenshots');

    await page.goto('http://localhost:3000/docs/vehicle-to-cloud-communications-architecture', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-vehicle-docs-screenshot.png', fullPage: true });
    console.log('  ✅ Screenshot saved: test-vehicle-docs-screenshot.png');

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-repository-list-screenshot.png', fullPage: true });
    console.log('  ✅ Screenshot saved: test-repository-list-screenshot.png');

  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    results.failed.push(`Test error: ${error.message}`);
  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log('\nPassed tests:');
  results.passed.forEach(test => console.log(`  ✅ ${test}`));
  console.log('\nFailed tests:');
  results.failed.forEach(test => console.log(`  ❌ ${test}`));
  console.log('='.repeat(60));

  process.exit(results.failed.length > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
