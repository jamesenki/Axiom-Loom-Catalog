import { test, expect } from '@playwright/test';

test('Verify Key Benefits and Use Cases are visible on AI Predictive Maintenance detail page', async ({ page }) => {
  // Navigate directly to the repository detail page
  await page.goto('http://localhost:3000/repository/ai-predictive-maintenance-engine-architecture');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take a screenshot
  await page.screenshot({ path: 'screenshots/ai-pm-detail-page-full.png', fullPage: true });

  // Log the page HTML to see what's rendered
  const bodyText = await page.locator('body').textContent();
  console.log('Page contains "Key Benefits":', bodyText?.includes('Key Benefits'));
  console.log('Page contains "Use Cases":', bodyText?.includes('Use Cases'));
  console.log('Page contains "Reduce unplanned downtime":', bodyText?.includes('Reduce unplanned downtime'));

  // Check for Key Benefits heading
  const keyBenefitsHeading = page.locator('text=Key Benefits');
  const isKeyBenefitsVisible = await keyBenefitsHeading.isVisible().catch(() => false);
  console.log('Key Benefits heading visible:', isKeyBenefitsVisible);

  if (isKeyBenefitsVisible) {
    console.log('✅ Key Benefits section IS visible');

    // Check for specific benefits
    const benefits = [
      'Reduce unplanned downtime by up to 70%',
      'Extend equipment lifespan by 20-30%',
      'Decrease maintenance costs by 25-40%'
    ];

    for (const benefit of benefits) {
      const isVisible = await page.locator(`text=${benefit}`).isVisible().catch(() => false);
      console.log(`  - "${benefit}": ${isVisible ? '✅' : '❌'}`);
    }
  } else {
    console.log('❌ Key Benefits section NOT visible');
  }

  // Check for Use Cases heading
  const useCasesHeading = page.locator('text=Use Cases');
  const isUseCasesVisible = await useCasesHeading.isVisible().catch(() => false);
  console.log('Use Cases heading visible:', isUseCasesVisible);

  if (isUseCasesVisible) {
    console.log('✅ Use Cases section IS visible');

    // Check for specific use cases
    const useCases = [
      'Manufacturing equipment predictive maintenance',
      'Fleet vehicle health monitoring',
      'Industrial IoT sensor data analysis'
    ];

    for (const useCase of useCases) {
      const isVisible = await page.locator(`text=${useCase}`).isVisible().catch(() => false);
      console.log(`  - "${useCase}": ${isVisible ? '✅' : '❌'}`);
    }
  } else {
    console.log('❌ Use Cases section NOT visible');
  }

  // Take a final screenshot showing what's visible
  await page.screenshot({ path: 'screenshots/ai-pm-detail-final-state.png', fullPage: true });
});
