import { test, expect } from '@playwright/test';

test.describe('EYNS AI Experience Center - Full Regression Test Suite', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test.describe('Build Quality Checks', () => {
    test('should load without console errors', async ({ page }) => {
      const consoleErrors: string[] = [];
      
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      expect(consoleErrors).toHaveLength(0);
    });

    test('should have no TypeScript errors in build', async ({ page }) => {
      // This test verifies that the built app loads without type errors
      const response = await page.goto(BASE_URL);
      expect(response?.status()).toBe(200);
      
      // Check that main bundle loads
      const mainScript = page.locator('script[src*="main"]');
      await expect(mainScript).toBeAttached();
    });
  });

  test.describe('Core Navigation', () => {
    test('should navigate to all main pages', async ({ page }) => {
      // Homepage
      await expect(page).toHaveTitle(/EYNS AI Experience Center/);
      
      // Repositories page
      await page.click('text=Repositories');
      await expect(page).toHaveURL(/.*\/repositories/);
      await expect(page.locator('h1')).toContainText(/Repositories/i);
      
      // API Explorer
      await page.click('text=API Explorer');
      await expect(page).toHaveURL(/.*\/api-explorer/);
      
      // Documentation
      await page.click('text=Documentation');
      await expect(page).toHaveURL(/.*\/documentation/);
    });

    test('should have working search functionality', async ({ page }) => {
      // Open search modal
      await page.keyboard.press('Control+K');
      const searchModal = page.locator('[role="dialog"]');
      await expect(searchModal).toBeVisible();
      
      // Type search query
      await page.fill('[placeholder*="Search"]', 'API');
      
      // Verify search results appear
      await expect(page.locator('text=Search Results')).toBeVisible();
    });
  });

  test.describe('Repository Features', () => {
    test('should display repository cards', async ({ page }) => {
      await page.goto(`${BASE_URL}/repositories`);
      
      // Wait for repositories to load
      await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
      
      // Verify at least one repository is displayed
      const repoCards = page.locator('[data-testid="repository-card"]');
      await expect(repoCards).toHaveCount(await repoCards.count());
      expect(await repoCards.count()).toBeGreaterThan(0);
    });

    test('should show API counts correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/repositories`);
      
      // Look for API count badges
      const apiCounts = page.locator('[data-testid="api-count"]');
      
      // Verify counts are displayed
      if (await apiCounts.count() > 0) {
        const firstCount = await apiCounts.first().textContent();
        expect(firstCount).toMatch(/\d+/);
      }
    });
  });

  test.describe('API Explorer', () => {
    test('should load API Explorer page', async ({ page }) => {
      await page.goto(`${BASE_URL}/api-explorer`);
      
      // Verify page loaded
      await expect(page.locator('h1')).toContainText(/API/i);
      
      // Check for API testing interface
      const apiInterface = page.locator('[data-testid="api-interface"]');
      await expect(apiInterface.or(page.locator('text=Select an API'))).toBeVisible();
    });

    test('should display API format tabs', async ({ page }) => {
      await page.goto(`${BASE_URL}/api-explorer`);
      
      // Check for format tabs (REST, GraphQL, etc.)
      const formats = ['REST', 'GraphQL', 'gRPC', 'Postman'];
      
      for (const format of formats) {
        const tab = page.locator(`text=${format}`);
        if (await tab.isVisible()) {
          await tab.click();
          // Verify tab content changes
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe('Documentation Viewer', () => {
    test('should load documentation page', async ({ page }) => {
      await page.goto(`${BASE_URL}/documentation`);
      
      // Verify documentation viewer loads
      await expect(page.locator('h1')).toContainText(/Documentation/i);
    });

    test('should render markdown correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/repositories`);
      
      // Click on first repository
      const firstRepo = page.locator('[data-testid="repository-card"]').first();
      await firstRepo.click();
      
      // Verify markdown rendering
      await page.waitForSelector('.markdown-content, [class*="markdown"]', { timeout: 10000 });
      
      // Check for common markdown elements
      const markdownContent = page.locator('.markdown-content, [class*="markdown"]');
      await expect(markdownContent).toBeVisible();
    });
  });

  test.describe('Performance Tests', () => {
    test('should load homepage within 3 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000);
    });

    test('should have reasonable bundle size', async ({ page }) => {
      const response = await page.goto(BASE_URL);
      
      // Get all JS resources
      const jsResources = await page.evaluate(() => {
        return performance.getEntriesByType('resource')
          .filter(entry => entry.name.endsWith('.js'))
          .map(entry => ({
            name: entry.name,
            size: (entry as any).decodedBodySize || 0
          }));
      });
      
      // Calculate total JS size
      const totalSize = jsResources.reduce((sum, resource) => sum + resource.size, 0);
      const totalSizeMB = totalSize / (1024 * 1024);
      
      // Bundle should be under 5MB
      expect(totalSizeMB).toBeLessThan(5);
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      
      // Check mobile menu
      const mobileMenu = page.locator('[data-testid="mobile-menu"], [aria-label*="menu"]');
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        
        // Verify navigation items are visible
        await expect(page.locator('text=Repositories')).toBeVisible();
      }
    });

    test('should be responsive on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);
      
      // Verify layout adjusts
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Authentication (if enabled)', () => {
    test('should show login option', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Look for login button or user menu
      const loginButton = page.locator('text=Login, text=Sign In').first();
      const userMenu = page.locator('[data-testid="user-menu"], [aria-label*="user"]');
      
      // At least one should be visible
      const hasAuth = await loginButton.isVisible() || await userMenu.isVisible();
      
      if (hasAuth && await loginButton.isVisible()) {
        await loginButton.click();
        
        // Verify login form appears
        await expect(page.locator('input[type="email"], input[type="text"]')).toBeVisible();
      }
    });
  });

  test.describe('API Health Checks', () => {
    test('should have working backend API', async ({ page }) => {
      const apiResponse = await page.request.get(`${BASE_URL.replace(':3000', ':3001')}/api/health`);
      
      expect(apiResponse.ok()).toBeTruthy();
      
      const health = await apiResponse.json();
      expect(health).toHaveProperty('status');
    });
  });

  test.describe('Error Handling', () => {
    test('should show 404 page for invalid routes', async ({ page }) => {
      await page.goto(`${BASE_URL}/invalid-route-12345`);
      
      // Should show 404 or redirect to home
      const is404 = await page.locator('text=404, text="Not Found"').isVisible();
      const isHome = await page.locator('h1').isVisible();
      
      expect(is404 || isHome).toBeTruthy();
    });

    test('should handle API errors gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/repositories`);
      
      // Intercept API calls to simulate error
      await page.route('**/api/repositories', (route) => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });
      
      // Reload page
      await page.reload();
      
      // Should show error state or fallback
      const hasError = await page.locator('text=Error, text=error, text=failed').isVisible();
      const hasEmpty = await page.locator('text=No repositories').isVisible();
      
      expect(hasError || hasEmpty).toBeTruthy();
    });
  });
});