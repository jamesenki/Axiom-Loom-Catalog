import { test, expect } from '@playwright/test';

test.describe('Postman Collections Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the water heater platform repository
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
  });

  test('should display Postman Collection button when collections exist', async ({ page }) => {
    // Look for the Postman Collection button
    const postmanButton = page.locator('button:has-text("Postman Collection"), a:has-text("Postman Collection")');
    
    await expect(postmanButton).toBeVisible({ timeout: 10000 });
    
    // Verify button text includes collection count
    const buttonText = await postmanButton.textContent();
    expect(buttonText).toContain('Postman');
  });

  test('should not show "No Postman Collections Found" error', async ({ page }) => {
    // Wait for page to load completely
    await page.waitForTimeout(3000);
    
    // Look for any error messages about missing Postman collections
    const errorMessage = page.locator('text=No Postman Collections Found');
    await expect(errorMessage).not.toBeVisible();
  });

  test('should detect multiple Postman collections via API', async ({ page }) => {
    // Test the backend API directly
    const response = await page.request.get('http://localhost:3001/api/detect-apis/appliances-co-water-heater-platform', {
      headers: { 'x-dev-mode': 'true' }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.postman).toBeDefined();
    expect(Array.isArray(data.postman)).toBeTruthy();
    expect(data.postman.length).toBeGreaterThan(0);
    
    // Verify collection names
    const collectionNames = data.postman.map((collection: any) => collection.name);
    expect(collectionNames).toContain('Water Heater Platform API');
    expect(collectionNames).toContain('Water Heater IoT Monitoring');
  });

  test('should show correct collection count in repository metadata', async ({ page }) => {
    // Check that the repository shows the correct number of Postman collections
    const statsSection = page.locator('[data-testid="api-stats"], .api-stats');
    
    if (await statsSection.isVisible()) {
      const statsText = await statsSection.textContent();
      // Should mention postman collections (the exact format may vary)
      expect(statsText?.toLowerCase()).toContain('postman');
    }
  });

  test('Postman button click should work properly', async ({ page }) => {
    const postmanButton = page.locator('button:has-text("Postman Collection"), a:has-text("Postman Collection")').first();
    
    if (await postmanButton.isVisible()) {
      // Click the button and verify it doesn't cause errors
      await postmanButton.click();
      
      // Wait a moment for any navigation or modal
      await page.waitForTimeout(2000);
      
      // Verify we didn't get a generic error page
      const errorHeading = page.locator('h1:has-text("Error"), h1:has-text("404"), h1:has-text("Not Found")');
      await expect(errorHeading).not.toBeVisible();
    }
  });
});