const { chromium } = require('playwright');

async function testApiData() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Intercept API calls
  page.on('response', async response => {
    if (response.url().includes('/api/repositories')) {
      const data = await response.json();
      const repo = Array.isArray(data) 
        ? data.find(r => r.id === 'vehicle-to-cloud-communications-architecture')
        : data;
      
      if (repo) {
        console.log('\n📡 API Response for vehicle-to-cloud:');
        console.log('  apiCount:', repo.metrics?.apiCount);
        console.log('  hasOpenAPI:', repo.apiTypes?.hasOpenAPI);
        console.log('  hasGrpc:', repo.apiTypes?.hasGrpc);
        console.log('  hasAsyncAPI:', repo.apiTypes?.hasAsyncAPI);
      }
    }
  });
  
  console.log('Navigating to repository detail page...');
  await page.goto('http://localhost:3000/repository/vehicle-to-cloud-communications-architecture', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  await page.waitForTimeout(2000);
  
  await browser.close();
}

testApiData().catch(console.error);
