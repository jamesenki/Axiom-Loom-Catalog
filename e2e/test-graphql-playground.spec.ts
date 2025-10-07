import { test, expect } from '@playwright/test';

test.describe('GraphQL Playground Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the water heater platform repository
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
  });

  test('should display GraphQL Playground button when schemas exist', async ({ page }) => {
    // Look for the GraphQL Playground button
    const graphqlButton = page.locator('button:has-text("GraphQL"), a:has-text("GraphQL")');
    
    await expect(graphqlButton).toBeVisible({ timeout: 10000 });
    
    // Verify button text mentions GraphQL
    const buttonText = await graphqlButton.textContent();
    expect(buttonText?.toLowerCase()).toContain('graphql');
  });

  test('should not show "No GraphQL Schemas Found" error', async ({ page }) => {
    // Wait for page to load completely
    await page.waitForTimeout(3000);
    
    // Look for any error messages about missing GraphQL schemas
    const errorMessage = page.locator('text=No GraphQL Schemas Found');
    await expect(errorMessage).not.toBeVisible();
  });

  test('should detect multiple GraphQL files via API', async ({ page }) => {
    // Test the backend API directly
    const response = await page.request.get('http://localhost:3001/api/detect-apis/appliances-co-water-heater-platform', {
      headers: { 'x-dev-mode': 'true' }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.apis?.graphql).toBeDefined();
    expect(Array.isArray(data.apis.graphql)).toBeTruthy();
    expect(data.apis.graphql.length).toBeGreaterThan(0);
    
    // Verify schema files are detected
    const schemaFiles = data.apis.graphql.map((schema: any) => schema.file);
    expect(schemaFiles).toContain('graphql/schema.graphql');
    expect(schemaFiles).toContain('graphql/queries.graphql');
    expect(schemaFiles).toContain('graphql/mutations.graphql');
  });

  test('should show GraphQL API type in repository apiTypes', async ({ page }) => {
    // Check that the repository metadata shows GraphQL as available
    const response = await page.request.get('http://localhost:3001/api/detect-apis/appliances-co-water-heater-platform', {
      headers: { 'x-dev-mode': 'true' }
    });
    
    const data = await response.json();
    expect(data.hasAnyApis).toBeTruthy();
    expect(data.recommendedButtons).toContain('graphql');
  });

  test('GraphQL button click should work properly', async ({ page }) => {
    const graphqlButton = page.locator('button:has-text("GraphQL"), a:has-text("GraphQL")').first();
    
    if (await graphqlButton.isVisible()) {
      // Click the button and verify it doesn't cause errors
      await graphqlButton.click();
      
      // Wait a moment for any navigation or modal
      await page.waitForTimeout(2000);
      
      // Verify we didn't get a generic error page
      const errorHeading = page.locator('h1:has-text("Error"), h1:has-text("404"), h1:has-text("Not Found")');
      await expect(errorHeading).not.toBeVisible();
    }
  });

  test('should detect schema types correctly', async ({ page }) => {
    // Test the backend API for correct schema type detection
    const response = await page.request.get('http://localhost:3001/api/detect-apis/appliances-co-water-heater-platform', {
      headers: { 'x-dev-mode': 'true' }
    });
    
    const data = await response.json();
    const graphqlApis = data.apis?.graphql || [];
    
    // Should have different types: schema, mutation, query
    const types = graphqlApis.map((api: any) => api.type);
    expect(types).toContain('schema');
    expect(types).toContain('mutation');
  });
});