import { test } from '@playwright/test';

test('Log what data the browser receives from API', async ({ page }) => {
  let apiData: any = null;

  // Intercept the API call and log what data is received
  page.on('response', async (response) => {
    if (response.url().includes('/api/repository/ai-predictive-maintenance-engine-architecture/details')) {
      const data = await response.json();
      apiData = data;

      console.log('\n========== API RESPONSE DATA ==========');
      console.log('displayName:', data.displayName);
      console.log('\nbusinessValue exists:', !!data.businessValue);
      console.log('businessValue:', JSON.stringify(data.businessValue, null, 2));
      console.log('=======================================\n');
    }
  });

  // Navigate to the page
  await page.goto('http://localhost:3000/repository/ai-predictive-maintenance-engine-architecture');

  // Wait for the API call to complete
  await page.waitForLoadState('networkidle');

  // Wait a bit for React to process the data
  await page.waitForTimeout(2000);

  // Take a screenshot
  await page.screenshot({ path: 'screenshots/current-state.png', fullPage: true });

  console.log('\n========== FINAL CHECK ==========');
  console.log('API data received:', !!apiData);
  if (apiData && apiData.businessValue) {
    console.log('keyBenefits count:', apiData.businessValue.keyBenefits?.length || 0);
    console.log('useCases count:', apiData.businessValue.useCases?.length || 0);
  }
  console.log('==================================\n');
});
