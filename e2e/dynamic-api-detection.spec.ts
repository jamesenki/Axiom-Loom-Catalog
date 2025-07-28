import { test, expect } from '@playwright/test';

test.describe('Dynamic API Detection E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('/');
  });

  test('displays repository list on home page', async ({ page }) => {
    // Wait for repositories to load
    await page.waitForSelector('text=Repositories', { timeout: 10000 });
    
    // Check that repository cards are displayed
    const repoCards = page.locator('.repository-card');
    await expect(repoCards.first()).toBeVisible();
  });

  test('navigates to repository detail view', async ({ page }) => {
    // Navigate to repositories page
    await page.goto('/repositories');
    
    // Click on a repository (assuming at least one exists)
    const firstRepo = page.locator('.repository-card').first();
    await firstRepo.click();
    
    // Verify we're on the repository detail page
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Available API Tools')).toBeVisible();
  });

  test('shows dynamic API buttons for repositories with APIs', async ({ page }) => {
    // Navigate directly to a known repository with APIs
    await page.goto('/repository/future-mobility-oems-platform');
    
    // Wait for API detection to complete
    await page.waitForSelector('text=Available API Tools');
    
    // Check for Swagger UI button (should exist for REST APIs)
    const swaggerButton = page.locator('button:has-text("Swagger UI")');
    await expect(swaggerButton).toBeVisible();
    
    // Check for Postman button
    const postmanButton = page.locator('button:has-text("Postman Collection")');
    await expect(postmanButton).toBeVisible();
  });

  test('shows GraphQL Playground for nslabsdashboards', async ({ page }) => {
    // Navigate to nslabsdashboards repository
    await page.goto('/repository/nslabsdashboards');
    
    // Wait for API detection
    await page.waitForSelector('text=Available API Tools');
    
    // Check for GraphQL Playground button
    const graphqlButton = page.locator('button:has-text("GraphQL Playground")');
    await expect(graphqlButton).toBeVisible();
    await expect(graphqlButton).toContainText('schemas');
  });

  test('shows no API message for repositories without APIs', async ({ page }) => {
    // Create a mock repository without APIs
    await page.route('**/api/api-buttons/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          repository: 'docs-repo',
          hasApis: false,
          buttons: [],
          summary: { rest: 0, graphql: 0, grpc: 0, total: 0 }
        })
      });
    });
    
    await page.goto('/repository/docs-repo');
    
    // Should show no APIs message
    await expect(page.locator('text=No API specifications found')).toBeVisible();
  });

  test('handles API detection errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/api-buttons/**', async route => {
      await route.abort('failed');
    });
    
    await page.goto('/repository/test-repo');
    
    // Should show error message
    await expect(page.locator('text=Failed to detect APIs')).toBeVisible();
  });

  test('navigates to documentation links', async ({ page }) => {
    await page.goto('/repository/test-repo');
    
    // Check documentation section exists
    await expect(page.locator('text=Documentation')).toBeVisible();
    
    // Check for documentation links
    const viewDocsLink = page.locator('a:has-text("View Documentation")');
    await expect(viewDocsLink).toBeVisible();
    await expect(viewDocsLink).toHaveAttribute('href', '/repository/test-repo/docs');
    
    const readmeLink = page.locator('a:has-text("README.md")');
    await expect(readmeLink).toBeVisible();
    await expect(readmeLink).toHaveAttribute('href', '/repository/test-repo/readme');
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/repository/test-repo');
    
    // All elements should still be visible
    await expect(page.locator('text=Available API Tools')).toBeVisible();
    await expect(page.locator('text=Documentation')).toBeVisible();
  });

  test('back navigation works correctly', async ({ page }) => {
    // Navigate to repository detail
    await page.goto('/repository/test-repo');
    
    // Click back button
    const backButton = page.locator('a:has-text("Back to Repositories")');
    await backButton.click();
    
    // Should be back on repositories page
    await expect(page).toHaveURL('/repositories');
  });

  test('API button click navigates to correct URL', async ({ page }) => {
    // Mock successful API detection
    await page.route('**/api/api-buttons/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          repository: 'test-repo',
          hasApis: true,
          buttons: [{
            type: 'swagger',
            label: 'Swagger UI (5 APIs)',
            icon: '📋',
            color: 'green',
            url: '/swagger/test-repo',
            description: 'Explore REST/OpenAPI specifications'
          }],
          summary: { rest: 5, graphql: 0, grpc: 0, total: 5 }
        })
      });
    });
    
    await page.goto('/repository/test-repo');
    
    // Wait for button to appear
    const swaggerButton = page.locator('button:has-text("Swagger UI")');
    await swaggerButton.waitFor();
    
    // Click should navigate
    await swaggerButton.click();
    await expect(page).toHaveURL('/swagger/test-repo');
  });
});

test.describe('Repository List E2E Tests', () => {
  test('displays loading state initially', async ({ page }) => {
    // Intercept and delay the API response
    await page.route('**/api/repositories', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    await page.goto('/repositories');
    
    // Should show loading state
    await expect(page.locator('text=Loading repositories...')).toBeVisible();
  });

  test('filters repositories by search term', async ({ page }) => {
    await page.goto('/repositories');
    
    // Type in search box (if implemented)
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('mobility');
      
      // Only mobility-related repos should be visible
      await expect(page.locator('text=future-mobility')).toBeVisible();
    }
  });

  test('accessibility - focus states are visible', async ({ page }) => {
    await page.goto('/repository/test-repo');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Check that focused element has visible outline
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});

test.describe('Performance Tests', () => {
  test('page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/repository/test-repo');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 2 seconds as per specification
    expect(loadTime).toBeLessThan(2000);
  });

  test('API detection completes quickly', async ({ page }) => {
    await page.goto('/repository/test-repo');
    
    const startTime = Date.now();
    
    // Wait for API buttons to appear
    await page.waitForSelector('[data-testid="dynamic-api-buttons"]', { 
      state: 'visible',
      timeout: 5000 
    });
    
    const detectionTime = Date.now() - startTime;
    
    // Should complete within reasonable time
    expect(detectionTime).toBeLessThan(3000);
  });
});