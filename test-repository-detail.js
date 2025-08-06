const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Monitor console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });
  
  // Monitor network failures
  page.on('requestfailed', request => {
    console.log('❌ Request failed:', request.url(), request.failure().errorText);
  });
  
  console.log('Testing repository detail page...\n');
  
  // Test the exact URL that's failing
  const url = 'http://127.0.0.1:3000/repository/ai-predictive-maintenance-engine-architecture';
  console.log('Navigating to:', url);
  
  await page.goto(url);
  await page.waitForTimeout(3000);
  
  // Check for error messages
  const bodyText = await page.textContent('body');
  
  if (bodyText.includes('Error Loading Repository')) {
    console.log('\n❌ FOUND ERROR: "Error Loading Repository"');
    console.log('Failed to fetch repository details\n');
    
    // Try to get more info
    const errorElement = await page.locator('text=Error Loading Repository').first();
    if (await errorElement.isVisible()) {
      const errorContainer = await errorElement.locator('..').textContent();
      console.log('Full error context:', errorContainer);
    }
  } else {
    console.log('✅ No error message found');
    
    // Check if repository data is displayed
    if (bodyText.includes('AI Maintenance Architecture') || bodyText.includes('predictive maintenance')) {
      console.log('✅ Repository content is displayed');
    } else {
      console.log('⚠️ Repository content may not be loading');
    }
  }
  
  // Check API call directly
  console.log('\n📡 Testing API directly...');
  const apiResponse = await page.request.get('http://localhost:3001/api/repository/ai-predictive-maintenance-engine-architecture/details');
  console.log('API Response Status:', apiResponse.status());
  
  if (apiResponse.ok()) {
    const data = await apiResponse.json();
    console.log('✅ API returned data:', {
      name: data.name,
      hasDescription: !!data.description,
      hasReadme: !!data.readme
    });
  } else {
    const error = await apiResponse.text();
    console.log('❌ API Error:', error);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'repository-detail-test.png' });
  console.log('\n📸 Screenshot saved as repository-detail-test.png');
  
  await browser.close();
})();