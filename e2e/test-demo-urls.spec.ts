import { test, expect } from '@playwright/test';

test.describe('Demo URLs Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the water heater platform repository
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to coming soon page when clicking View Demo', async ({ page }) => {
    // Look for the specific View Demo button (not Architecture Demo)
    const demoButton = page.locator('a:has-text("View Demo")').first();
    
    if (await demoButton.isVisible()) {
      // Click the demo button
      await demoButton.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Should navigate to a coming soon page, not get "site cannot be reached"
      const currentUrl = page.url();
      expect(currentUrl).toContain('coming-soon');
      
      // Should not show browser error pages
      const browserError = page.locator('text=This site can\'t be reached, text=ERR_NAME_NOT_RESOLVED, text=DNS_PROBE_FINISHED_NXDOMAIN');
      await expect(browserError).not.toBeVisible();
      
      // Should show a proper coming soon page
      const comingSoonContent = page.locator('text=Coming Soon, text=Under Development, text=Demo');
      await expect(comingSoonContent.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should have correct demo URL in repository metadata', async ({ page }) => {
    // Test that the demo URL is correctly configured to use coming-soon pages
    const response = await page.request.get('http://localhost:3001/api/repositories');
    expect(response.ok()).toBeTruthy();
    
    const repositories = await response.json();
    const waterHeaterRepo = repositories.find((repo: any) => repo.id === 'appliances-co-water-heater-platform');
    
    expect(waterHeaterRepo).toBeDefined();
    expect(waterHeaterRepo.demoUrl).toBe('/coming-soon/demo/appliances-co-water-heater-platform');
    expect(waterHeaterRepo.demoUrl).not.toContain('demo.axiom-loom.com');
  });

  test('should have correct demo URL in axiom.json', async ({ page }) => {
    // Read the axiom.json file to verify URLs are local
    const response = await page.request.get('http://localhost:3001/api/repository/appliances-co-water-heater-platform/file?path=axiom.json');
    expect(response.ok()).toBeTruthy();
    
    const axiomData = await response.json();
    expect(axiomData.urls?.demo).toBe('/coming-soon/demo/appliances-co-water-heater-platform');
    expect(axiomData.urls?.demo).not.toContain('demo.axiom-loom.com');
  });

  test('should not navigate to external unreachable domains', async ({ page }) => {
    // Look for any buttons or links that might still point to external demo domains
    const externalLinks = page.locator('a[href*="demo.axiom-loom.com"], button[onclick*="demo.axiom-loom.com"]');
    
    // Should not find any external demo links
    await expect(externalLinks).not.toBeVisible();
  });

  test('demo button should work without DNS errors', async ({ page }) => {
    const demoButton = page.locator('a:has-text("View Demo")').first();
    
    if (await demoButton.isVisible()) {
      // Set up a response handler to catch network errors
      let networkError = false;
      page.on('response', response => {
        if (response.status() >= 400) {
          console.log(`Network error: ${response.status()} ${response.url()}`);
          if (response.url().includes('demo.axiom-loom.com')) {
            networkError = true;
          }
        }
      });
      
      // Click the button
      await demoButton.click();
      await page.waitForTimeout(3000);
      
      // Should not have network errors to external demo domains
      expect(networkError).toBeFalsy();
    }
  });

  test('coming soon page should be accessible', async ({ page }) => {
    // Directly navigate to the coming soon page URL
    await page.goto('http://localhost:3000/coming-soon/demo/appliances-co-water-heater-platform');
    
    // Should load successfully without errors
    await page.waitForLoadState('networkidle');
    
    // Should not show 404 or error pages
    const errorIndicators = page.locator('h1:has-text("404"), h1:has-text("Not Found"), h1:has-text("Error")');
    await expect(errorIndicators).not.toBeVisible();
    
    // Should show some content indicating this is a demo page
    const pageContent = await page.textContent('body');
    expect(pageContent?.toLowerCase()).toMatch(/(coming soon|demo|under development|water heater)/);
  });
});