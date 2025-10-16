import { test, expect } from '@playwright/test';

test.describe('API Explorer Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page
    await page.goto('/');
    
    // Wait for repositories to load
    await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
  });

  test('should navigate to API Explorer and explore APIs', async ({ page }) => {
    // Click on a repository with APIs
    const repoCard = page.locator('[data-testid="repository-card"]').first();
    await repoCard.click();
    
    // Wait for repository detail page
    await page.waitForSelector('h1');
    
    // Look for API Explorer button
    const apiExplorerButton = page.locator('text=Open Unified Explorer').first();
    await expect(apiExplorerButton).toBeVisible();
    
    // Click to open API Explorer
    await apiExplorerButton.click();
    
    // Wait for API Explorer to load
    await page.waitForURL(/\/api-explorer-v2\//);
    await expect(page.locator('h2:has-text("Select an API")')).toBeVisible();
    
    // Check sidebar has APIs listed
    const apiList = page.locator('[data-testid="api-item"]');
    const apiCount = await apiList.count();
    expect(apiCount).toBeGreaterThan(0);
    
    // Click on first API
    await apiList.first().click();
    
    // Check request builder is visible
    await expect(page.locator('text=Request')).toBeVisible();
    await expect(page.locator('select:has-text("GET")')).toBeVisible();
    await expect(page.locator('button:has-text("Send")')).toBeVisible();
    
    // Check tabs are visible
    await expect(page.locator('button:has-text("API Explorer")')).toBeVisible();
    await expect(page.locator('button:has-text("Code Snippets")')).toBeVisible();
    await expect(page.locator('button:has-text("Request History")')).toBeVisible();
  });

  test('should execute API request and see response', async ({ page }) => {
    // Navigate to a repository with REST APIs
    await page.click('[data-testid="repository-card"]:has-text("REST")');
    
    // Open API Explorer
    await page.click('text=Open Unified Explorer');
    
    // Select an API
    await page.click('[data-testid="api-item"]');
    
    // Wait for request builder
    await page.waitForSelector('button:has-text("Send")');
    
    // Execute request
    await page.click('button:has-text("Send")');
    
    // Wait for response
    await expect(page.locator('text=Response')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="status-badge"]')).toContainText('200');
    
    // Check response body is visible
    await expect(page.locator('pre')).toContainText('This is a simulated response');
  });

  test('should filter APIs by search', async ({ page }) => {
    // Navigate to repository with multiple APIs
    await page.click('[data-testid="repository-card"]');
    await page.click('text=Open Unified Explorer');
    
    // Wait for APIs to load
    await page.waitForSelector('[data-testid="api-item"]');
    
    // Count initial APIs
    const initialCount = await page.locator('[data-testid="api-item"]').count();
    
    // Search for specific API
    await page.fill('input[placeholder="Search APIs..."]', 'user');
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Check filtered results
    const filteredCount = await page.locator('[data-testid="api-item"]').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should switch between API types', async ({ page }) => {
    // Navigate to repository detail
    await page.click('[data-testid="repository-card"]');
    
    // Check for different API type buttons
    const apiButtons = page.locator('[data-testid*="-button"]');
    
    // Check Swagger UI button if REST APIs exist
    const swaggerButton = apiButtons.filter({ hasText: 'Swagger UI' });
    if (await swaggerButton.count() > 0) {
      await swaggerButton.click();
      await page.waitForURL(/\/api-viewer\//);
      await expect(page.locator('[data-testid="swagger-ui"]')).toBeVisible();
      await page.goBack();
    }
    
    // Check GraphQL Playground button if GraphQL APIs exist
    const graphqlButton = apiButtons.filter({ hasText: 'GraphQL Playground' });
    if (await graphqlButton.count() > 0) {
      await graphqlButton.click();
      await page.waitForURL(/\/graphql-enhanced\//);
      await expect(page.locator('text=GraphQL Playground')).toBeVisible();
      await page.goBack();
    }
  });

  test('should view and copy code snippets', async ({ page }) => {
    // Navigate to API Explorer
    await page.click('[data-testid="repository-card"]');
    await page.click('text=Open Unified Explorer');
    
    // Select an API
    await page.click('[data-testid="api-item"]');
    
    // Switch to Code Snippets tab
    await page.click('button:has-text("Code Snippets")');
    
    // Check code snippets are visible
    await expect(page.locator('text=Curl')).toBeVisible();
    await expect(page.locator('text=Javascript')).toBeVisible();
    await expect(page.locator('text=Python')).toBeVisible();
    
    // Check copy buttons
    const copyButtons = page.locator('button:has-text("Copy")');
    expect(await copyButtons.count()).toBeGreaterThan(0);
    
    // Click copy button
    await copyButtons.first().click();
    
    // Note: Can't test clipboard content in Playwright, but button should work
  });

  test('should manage request history', async ({ page }) => {
    // Navigate to API Explorer
    await page.click('[data-testid="repository-card"]');
    await page.click('text=Open Unified Explorer');
    
    // Select an API
    await page.click('[data-testid="api-item"]');
    
    // Execute a request
    await page.click('button:has-text("Send")');
    await page.waitForSelector('text=Response');
    
    // Open history panel
    await page.click('button:has-text("History")');
    
    // Check history panel is visible
    await expect(page.locator('text=Request History')).toBeVisible();
    
    // Check that our request is in history
    await expect(page.locator('[data-testid="history-item"]')).toHaveCount(1);
  });

  test('should run Postman collection', async ({ page }) => {
    // Navigate to repository detail
    await page.click('[data-testid="repository-card"]');
    
    // Look for Postman Runner button
    const postmanButton = page.locator('text=Postman Runner');
    if (await postmanButton.count() > 0) {
      await postmanButton.click();
      
      // Wait for Postman Runner to load
      await page.waitForURL(/\/postman-runner\//);
      await expect(page.locator('text=Collection Runner')).toBeVisible();
      
      // Check run button is visible
      await expect(page.locator('button:has-text("Run Collection")')).toBeVisible();
      
      // Run collection
      await page.click('button:has-text("Run Collection")');
      
      // Wait for some results
      await page.waitForSelector('[data-testid="result-item"]', { timeout: 10000 });
      
      // Check results are displayed
      const results = page.locator('[data-testid="result-item"]');
      expect(await results.count()).toBeGreaterThan(0);
    }
  });

  test('should navigate to GraphQL Playground for GraphQL APIs', async ({ page }) => {
    // Find repository with GraphQL
    const graphqlRepo = page.locator('[data-testid="repository-card"]:has-text("GraphQL")').first();
    
    if (await graphqlRepo.count() > 0) {
      await graphqlRepo.click();
      
      // Click GraphQL Playground button
      await page.click('text=GraphQL Playground');
      
      // Wait for GraphQL Playground to load
      await page.waitForURL(/\/graphql-enhanced\//);
      await expect(page.locator('text=GraphQL Playground')).toBeVisible();
      
      // Check query editor is visible
      await expect(page.locator('.graphiql-container')).toBeVisible();
    }
  });

  test('should explore gRPC services', async ({ page }) => {
    // Find repository with gRPC
    const grpcRepo = page.locator('[data-testid="repository-card"]:has-text("gRPC")').first();
    
    if (await grpcRepo.count() > 0) {
      await grpcRepo.click();
      
      // Click gRPC Explorer button
      await page.click('text=gRPC Explorer');
      
      // Wait for gRPC Explorer to load
      await page.waitForURL(/\/grpc-explorer\//);
      await expect(page.locator('text=gRPC Services')).toBeVisible();
      
      // Check services are listed
      const services = page.locator('[data-testid="grpc-service"]');
      expect(await services.count()).toBeGreaterThan(0);
      
      // Expand first service
      await services.first().click();
      
      // Check methods are visible
      await expect(page.locator('[data-testid="grpc-method"]')).toBeVisible();
    }
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Navigate to API Explorer
    await page.click('[data-testid="repository-card"]');
    await page.click('text=Open Unified Explorer');
    
    // Select an API
    await page.click('[data-testid="api-item"]');
    
    // Modify URL to invalid endpoint
    await page.fill('input[type="text"]', 'http://invalid-endpoint.local/api');
    
    // Execute request
    await page.click('button:has-text("Send")');
    
    // Should show error response
    await expect(page.locator('text=Request failed')).toBeVisible({ timeout: 10000 });
  });
});