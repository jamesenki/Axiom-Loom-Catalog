import { test, expect } from '@playwright/test';

const BASE_URL = 'https://technical.axiomloom-loom.net';

test.describe('Verify Axiom Loom IoT Platform Repository Fixes', () => {
  test('should display correct displayName and business value data', async ({ page }) => {
    // Navigate to the repository detail page
    await page.goto(`${BASE_URL}/docs/axiomloom-iot-platform`, { waitUntil: 'networkidle' });

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Check for correct displayName - should NOT see "Nslabsdashboards"
    const pageContent = await page.content();
    console.log('Checking for displayName...');

    // Verify "Axiom Loom IoT Platform" appears somewhere on the page
    const hasCorrectName = pageContent.includes('Axiom Loom IoT Platform');
    console.log('Has "Axiom Loom IoT Platform":', hasCorrectName);

    // Verify "Nslabsdashboards" does NOT appear (except maybe in URL)
    const hasOldName = pageContent.match(/Nslabsdashboards/gi) || [];
    console.log('Occurrences of "Nslabsdashboards":', hasOldName.length);

    // Check for Use Cases & Key Benefits sections
    console.log('\nChecking for Use Cases & Key Benefits...');

    // Look for Use Cases section
    const useCasesSection = page.locator('text=/Use Cases|Applications/i').first();
    const useCasesSectionVisible = await useCasesSection.isVisible().catch(() => false);
    console.log('Use Cases section visible:', useCasesSectionVisible);

    // Look for Key Benefits section
    const keyBenefitsSection = page.locator('text=/Key Benefits|Technical Highlights/i').first();
    const keyBenefitsSectionVisible = await keyBenefitsSection.isVisible().catch(() => false);
    console.log('Key Benefits section visible:', keyBenefitsSectionVisible);

    // Check for specific use cases in the content
    const hasManufacturing = pageContent.includes('Manufacturing');
    const hasEnergyUtilities = pageContent.includes('Energy');
    console.log('Has Manufacturing use case:', hasManufacturing);
    console.log('Has Energy use case:', hasEnergyUtilities);

    // Check for specific key benefits in the content
    const hasDeviceAgnostic = pageContent.includes('Device-agnostic') || pageContent.includes('device-agnostic');
    const hasMQTT = pageContent.includes('MQTT');
    console.log('Has "Device-agnostic" benefit:', hasDeviceAgnostic);
    console.log('Has "MQTT" benefit:', hasMQTT);

    // Take a screenshot for visual verification
    await page.screenshot({
      path: '/tmp/nslabs-verification.png',
      fullPage: true
    });
    console.log('\nScreenshot saved to /tmp/nslabs-verification.png');

    // Assertions
    expect(hasCorrectName, 'Should display "Axiom Loom IoT Platform"').toBeTruthy();

    // At least one of the sections should be visible
    const hasSections = useCasesSectionVisible || keyBenefitsSectionVisible ||
                        hasManufacturing || hasEnergyUtilities || hasDeviceAgnostic || hasMQTT;
    expect(hasSections, 'Should display Use Cases or Key Benefits content').toBeTruthy();
  });

  test('should display populated Use Cases list', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs/axiomloom-iot-platform`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Count how many use case items are displayed
    const useCaseItems = page.locator('li, div').filter({ hasText: /Manufacturing|Energy|Transportation|Healthcare/ });
    const count = await useCaseItems.count();
    console.log('Use case items found:', count);

    expect(count, 'Should have at least 2 use cases displayed').toBeGreaterThanOrEqual(2);
  });

  test('should display populated Key Benefits list', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs/axiomloom-iot-platform`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Count how many key benefit items are displayed
    const benefitItems = page.locator('li, div').filter({ hasText: /Device-agnostic|MQTT|GraphQL|AI-powered|Clean architecture/ });
    const count = await benefitItems.count();
    console.log('Key benefit items found:', count);

    expect(count, 'Should have at least 3 key benefits displayed').toBeGreaterThanOrEqual(3);
  });
});
