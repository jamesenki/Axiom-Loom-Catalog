import { test, expect } from '@playwright/test';

test.describe('AI Predictive Maintenance - Business Value Display', () => {
  test('should display Key Benefits and Use Cases on repository detail page', async ({ page }) => {
    // Navigate to the repository list
    await page.goto('http://localhost:3000');

    // Wait for repositories to load
    await page.waitForSelector('text=AI Predictive Maintenance Architecture', { timeout: 10000 });

    // Click on the AI Predictive Maintenance Architecture repository card
    await page.click('text=AI Predictive Maintenance Architecture');

    // Wait for the detail page to load
    await page.waitForURL('**/repository/ai-predictive-maintenance-engine-architecture**');

    // Wait for the page content to load
    await page.waitForSelector('h1', { timeout: 5000 });

    // Take a screenshot to see what we're looking at
    await page.screenshot({ path: 'screenshots/ai-predictive-maintenance-detail-page.png', fullPage: true });

    // Check for Key Benefits section
    const keyBenefitsHeading = page.locator('text=Key Benefits');
    await expect(keyBenefitsHeading).toBeVisible({ timeout: 5000 });

    // Check for specific key benefits
    await expect(page.locator('text=Reduce unplanned downtime by up to 70%')).toBeVisible();
    await expect(page.locator('text=Extend equipment lifespan by 20-30%')).toBeVisible();
    await expect(page.locator('text=Decrease maintenance costs by 25-40%')).toBeVisible();

    // Check for Use Cases section
    const useCasesHeading = page.locator('text=Use Cases & Applications');
    await expect(useCasesHeading).toBeVisible({ timeout: 5000 });

    // Check for specific use cases
    await expect(page.locator('text=Manufacturing equipment predictive maintenance')).toBeVisible();
    await expect(page.locator('text=Fleet vehicle health monitoring')).toBeVisible();
    await expect(page.locator('text=Industrial IoT sensor data analysis')).toBeVisible();

    console.log('✅ All Key Benefits and Use Cases are visible on the page!');
  });

  test('should fetch businessValue from API', async ({ page }) => {
    // Set up API response interception
    let businessValueReceived = false;

    page.on('response', async (response) => {
      if (response.url().includes('/api/repository/ai-predictive-maintenance-engine-architecture/details')) {
        const data = await response.json();
        console.log('API Response received');
        console.log('businessValue exists:', !!data.businessValue);
        console.log('keyBenefits count:', data.businessValue?.keyBenefits?.length || 0);
        console.log('useCases count:', data.businessValue?.useCases?.length || 0);

        if (data.businessValue && data.businessValue.keyBenefits && data.businessValue.useCases) {
          businessValueReceived = true;
          console.log('✅ businessValue data confirmed in API response');
        }
      }
    });

    // Navigate to the detail page directly
    await page.goto('http://localhost:3000/repository/ai-predictive-maintenance-engine-architecture');

    // Wait a bit for the API call
    await page.waitForTimeout(2000);

    // Verify the API returned businessValue
    expect(businessValueReceived).toBe(true);
  });
});
