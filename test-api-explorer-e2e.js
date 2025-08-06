const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Running E2E test for API Explorer fix...\n');
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  try {
    // Test 1: Direct navigation to /api-explorer/all?type=grpc
    console.log('Test 1: Direct navigation to /api-explorer/all?type=grpc');
    await page.goto('http://localhost:3000/api-explorer/all?type=grpc', { waitUntil: 'networkidle' });
    
    const url = page.url();
    if (url.includes('/api-explorer/all?type=grpc')) {
      console.log('✓ URL is correct');
    } else {
      console.log('✗ URL is incorrect:', url);
    }
    
    // Check if API Explorer page loaded
    const pageContent = await page.textContent('body');
    if (pageContent.includes('API Explorer')) {
      console.log('✓ API Explorer page loaded');
    } else {
      console.log('✗ API Explorer page did not load');
    }
    
    // Check for 404 error
    if (!pageContent.includes('404') && !pageContent.includes('Page not found')) {
      console.log('✓ No 404 error');
    } else {
      console.log('✗ Got 404 error');
    }
    
    // Test 2: Navigate from API Discovery Dashboard
    console.log('\nTest 2: Navigation from API Discovery Dashboard');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Try to find and click API Discovery link
    const apiDiscoveryLink = await page.$('text="API Discovery"');
    if (apiDiscoveryLink) {
      await apiDiscoveryLink.click();
      await page.waitForTimeout(2000);
      
      // Look for gRPC explore button
      const grpcButton = await page.$('text="Explore gRPC Services"');
      if (grpcButton) {
        await grpcButton.click();
        await page.waitForTimeout(2000);
        
        const newUrl = page.url();
        if (newUrl.includes('/api-explorer/all?type=grpc')) {
          console.log('✓ Navigation to API Explorer successful');
        } else {
          console.log('✗ Navigation failed, URL:', newUrl);
        }
      } else {
        console.log('✗ Could not find Explore gRPC Services button');
      }
    } else {
      console.log('✗ Could not find API Discovery link');
    }
    
    // Check for console errors
    if (errors.length === 0) {
      console.log('\n✓ No console errors');
    } else {
      console.log('\n✗ Console errors found:');
      errors.forEach(err => console.log('  -', err));
    }
    
    console.log('\nE2E test completed!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();