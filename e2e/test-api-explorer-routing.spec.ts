import { test, expect } from '@playwright/test';

test.describe('API Explorer Card Click Routing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to API Explorer for water heater platform
    await page.goto('http://localhost:3000/api-explorer/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
  });

  test('should not redirect to home page when clicking API cards', async ({ page }) => {
    // Wait for API cards to load
    await page.waitForTimeout(3000);
    
    // Look for API cards
    const apiCards = page.locator('[data-type], .api-card, [class*="APICard"]');
    
    if (await apiCards.count() > 0) {
      const firstCard = apiCards.first();
      
      // Get current URL before clicking
      const initialUrl = page.url();
      
      // Click the first API card
      await firstCard.click();
      
      // Wait for navigation
      await page.waitForTimeout(2000);
      
      // Should not redirect to home page
      const currentUrl = page.url();
      expect(currentUrl).not.toBe('http://localhost:3000/');
      expect(currentUrl).not.toBe('http://localhost:3000');
      expect(currentUrl).not.toBe(initialUrl); // Should navigate somewhere
    }
  });

  test('should navigate to correct API viewer based on type', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Test OpenAPI/Swagger navigation
    const openApiCard = page.locator('[data-type="OpenAPI"], [datatype="OpenAPI"]').first();
    if (await openApiCard.isVisible()) {
      await openApiCard.click();
      await page.waitForTimeout(2000);
      
      // Should navigate to swagger route
      const url = page.url();
      expect(url).toContain('/swagger');
      expect(url).not.toContain('localhost:3000/');
      expect(url).not.toContain('localhost:3000');
    }
  });

  test('should handle GraphQL card clicks correctly', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Test GraphQL navigation
    const graphqlCard = page.locator('[data-type="GraphQL"], [datatype="GraphQL"]').first();
    if (await graphqlCard.isVisible()) {
      await graphqlCard.click();
      await page.waitForTimeout(2000);
      
      // Should navigate to GraphQL route
      const url = page.url();
      expect(url).toContain('/graphql');
      expect(url).not.toBe('http://localhost:3000/');
    }
  });

  test('should include file parameter in navigation URL', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const apiCards = page.locator('[data-type], .api-card, [class*="APICard"]');
    
    if (await apiCards.count() > 0) {
      const firstCard = apiCards.first();
      await firstCard.click();
      await page.waitForTimeout(2000);
      
      // Should include file parameter
      const url = page.url();
      expect(url).toContain('file=');
    }
  });

  test('should not cause JavaScript errors when clicking cards', async ({ page }) => {
    const errors: string[] = [];
    
    // Listen for JavaScript errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.waitForTimeout(3000);
    
    const apiCards = page.locator('[data-type], .api-card, [class*="APICard"]');
    
    if (await apiCards.count() > 0) {
      const firstCard = apiCards.first();
      await firstCard.click();
      await page.waitForTimeout(2000);
      
      // Should not have JavaScript errors
      expect(errors.length).toBe(0);
    }
  });

  test('should display API cards with correct types', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Should show API cards with proper types
    const openApiCards = page.locator('text=OpenAPI');
    const graphqlCards = page.locator('text=GraphQL');
    
    // At least one type should be visible
    const hasOpenApi = await openApiCards.count() > 0;
    const hasGraphQL = await graphqlCards.count() > 0;
    
    expect(hasOpenApi || hasGraphQL).toBeTruthy();
  });

  test('API cards should be clickable and have proper cursor', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const apiCards = page.locator('[data-type], .api-card, [class*="APICard"]');
    
    if (await apiCards.count() > 0) {
      const firstCard = apiCards.first();
      
      // Should be visible and clickable
      await expect(firstCard).toBeVisible();
      
      // Should have cursor pointer style (indicates clickable)
      const cursor = await firstCard.evaluate(el => window.getComputedStyle(el).cursor);
      expect(cursor).toBe('pointer');
    }
  });

  test('should handle API detection correctly', async ({ page }) => {
    // Verify that the API detection is working and not showing axiom.json
    const response = await page.request.get('http://localhost:3001/api/detect-apis/appliances-co-water-heater-platform', {
      headers: { 'x-dev-mode': 'true' }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    const restApis = data.apis?.rest || [];
    
    // Should not detect axiom.json as an API
    const hasAxiomJson = restApis.some((api: any) => api.file?.includes('axiom.json'));
    expect(hasAxiomJson).toBeFalsy();
    
    // Should detect actual API files
    expect(data.hasAnyApis).toBeTruthy();
  });
});