const { chromium } = require('playwright');

async function testAPIButtons() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to repository detail page...');
  await page.goto('http://localhost:3000/repository/vehicle-to-cloud-communications-architecture', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  await page.waitForTimeout(2000);
  
  // Check for API Explorer button
  const apiButton = await page.locator('button:has-text("API Explorer"), a:has-text("API Explorer")').count();
  console.log(`API Explorer buttons found: ${apiButton}`);
  
  // Check for GraphQL button
  const graphqlButton = await page.locator('button:has-text("GraphQL"), a:has-text("GraphQL")').count();
  console.log(`GraphQL buttons found: ${graphqlButton}`);
  
  // Check for gRPC button
  const grpcButton = await page.locator('button:has-text("gRPC"), a:has-text("gRPC")').count();
  console.log(`gRPC buttons found: ${grpcButton}`);
  
  // Check for AsyncAPI button (should be present)
  const asyncapiButton = await page.locator('button:has-text("AsyncAPI"), a:has-text("AsyncAPI")').count();
  console.log(`AsyncAPI buttons found: ${asyncapiButton}`);
  
  // Take screenshot
  await page.screenshot({ path: 'api-buttons-check.png', fullPage: true });
  console.log('\nScreenshot saved as api-buttons-check.png');
  
  await browser.close();
}

testAPIButtons().catch(console.error);
