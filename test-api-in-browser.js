const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Set up request interception to log API calls
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/') && url.includes('api-explorer/all')) {
      console.log(`\nAPI Response from ${url}:`);
      console.log('Status:', response.status());
      try {
        const json = await response.json();
        console.log('Response:', JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('Response body:', await response.text());
      }
    }
  });
  
  console.log('Navigating to API Explorer...');
  await page.goto('http://localhost:3000/api-explorer/all?type=grpc', { waitUntil: 'networkidle' });
  
  // Wait for content
  await page.waitForTimeout(3000);
  
  // Check what's displayed
  const content = await page.textContent('body');
  
  if (content.includes('0 gRPC APIs Found')) {
    console.log('\n❌ No gRPC APIs found\!');
  } else if (content.includes('gRPC APIs Found')) {
    const match = content.match(/(\d+) gRPC APIs Found/);
    if (match) {
      console.log(`\n✓ Found ${match[1]} gRPC APIs`);
    }
  }
  
  // Try clicking on "All Types" to see all APIs
  console.log('\nClicking "All Types" filter...');
  await page.click('text="All Types"');
  await page.waitForTimeout(2000);
  
  // Check total count
  const totalMatch = content.match(/(\d+) Total APIs Found/);
  if (totalMatch) {
    console.log(`\nTotal APIs found: ${totalMatch[1]}`);
  }
  
  await browser.close();
})();
