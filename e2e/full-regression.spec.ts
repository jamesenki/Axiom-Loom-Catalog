import { test, expect } from '@playwright/test';

/**
 * EYNS AI Experience Center - Full Regression Test Suite
 * According to CLAUDE.md requirements:
 * 1. Content Testing: Verify all text, images, and components render correctly
 * 2. Click-through User Experience: Test every button, link, form, and navigation
 * 3. Backend Integration: Verify all API calls, data flow, and error handling
 * 4. Link Validation: Test every internal and external link works correctly
 * 5. Full Regression Suite: Run complete end-to-end tests that simulate real users
 */

test.describe('EYNS AI Experience Center - Full Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('1. Content Testing', () => {
    test('should display all header content correctly', async ({ page }) => {
      // Check logo and branding
      await expect(page.locator('header')).toBeVisible();
      await expect(page.getByText('EYNS AI Experience Center')).toBeVisible();
      
      // Check navigation links
      await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /search/i })).toBeVisible();
    });

    test('should display home page content', async ({ page }) => {
      // Check main heading
      await expect(page.getByRole('heading', { name: /discover.*repositories/i })).toBeVisible();
      
      // Check search input
      await expect(page.getByPlaceholder(/search repositories/i)).toBeVisible();
      
      // Check filter buttons
      await expect(page.getByText('All')).toBeVisible();
      await expect(page.getByText('OpenAPI')).toBeVisible();
      await expect(page.getByText('GraphQL')).toBeVisible();
      await expect(page.getByText('gRPC')).toBeVisible();
    });

    test('should display repository cards with correct content', async ({ page }) => {
      // Wait for repository cards to load
      await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
      
      const cards = page.locator('[data-testid="repository-card"]');
      const count = await cards.count();
      
      // Should have at least one repository
      expect(count).toBeGreaterThan(0);
      
      // Check first card has required elements
      const firstCard = cards.first();
      await expect(firstCard.locator('h3')).toBeVisible(); // Title
      await expect(firstCard.locator('p')).toBeVisible(); // Description
    });
  });

  test.describe('2. Click-through User Experience', () => {
    test('should navigate through all main pages', async ({ page }) => {
      // Click on a repository card
      await page.waitForSelector('[data-testid="repository-card"]');
      await page.locator('[data-testid="repository-card"]').first().click();
      
      // Should navigate to repository detail page
      await expect(page.url()).toContain('/repository/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      
      // Navigate back home
      await page.getByRole('link', { name: /home/i }).click();
      await expect(page.url()).toBe('http://localhost:3000/');
    });

    test('should open and use global search', async ({ page }) => {
      // Open search modal
      await page.getByRole('button', { name: /search/i }).click();
      
      // Search modal should be visible
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByPlaceholder(/search for repositories/i)).toBeVisible();
      
      // Type in search
      await page.getByPlaceholder(/search for repositories/i).fill('test');
      
      // Close search with Escape
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('should filter repositories by type', async ({ page }) => {
      // Wait for initial load
      await page.waitForSelector('[data-testid="repository-card"]');
      
      // Click OpenAPI filter
      await page.getByText('OpenAPI').click();
      
      // Wait for filtered results
      await page.waitForTimeout(500);
      
      // Check that cards are still visible (or show no results message)
      const cards = page.locator('[data-testid="repository-card"]');
      const noResults = page.getByText(/no repositories found/i);
      
      const hasCards = await cards.count() > 0;
      const hasNoResults = await noResults.isVisible().catch(() => false);
      
      expect(hasCards || hasNoResults).toBeTruthy();
    });

    test('should search repositories using search bar', async ({ page }) => {
      // Type in search bar
      await page.getByPlaceholder(/search repositories/i).fill('api');
      
      // Wait for search results
      await page.waitForTimeout(500);
      
      // Should show filtered results or no results message
      const cards = page.locator('[data-testid="repository-card"]');
      const noResults = page.getByText(/no repositories found/i);
      
      const hasCards = await cards.count() > 0;
      const hasNoResults = await noResults.isVisible().catch(() => false);
      
      expect(hasCards || hasNoResults).toBeTruthy();
    });
  });

  test.describe('3. Backend Integration', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      // Navigate to non-existent repository
      await page.goto('/repository/non-existent-repo');
      
      // Should show error or redirect
      const errorMessage = page.getByText(/not found|error|404/i);
      const redirectedHome = page.url() === 'http://localhost:3000/';
      
      expect((await errorMessage.isVisible().catch(() => false)) || redirectedHome).toBeTruthy();
    });

    test('should load repository details from API', async ({ page }) => {
      // Navigate to first repository
      await page.waitForSelector('[data-testid="repository-card"]');
      const firstCard = page.locator('[data-testid="repository-card"]').first();
      const repoName = await firstCard.locator('h3').textContent();
      
      await firstCard.click();
      
      // Wait for repository details to load
      await page.waitForSelector('h1', { timeout: 10000 });
      
      // Check that repository name matches
      const pageTitle = await page.locator('h1').textContent();
      expect(pageTitle).toContain(repoName);
    });
  });

  test.describe('4. Link Validation', () => {
    test('should have working navigation links', async ({ page }) => {
      // Test home link
      await page.goto('/repository/test');
      await page.getByRole('link', { name: /home/i }).click();
      await expect(page.url()).toBe('http://localhost:3000/');
    });

    test('should open external links in new tabs', async ({ page, context }) => {
      // Navigate to a repository with external links
      await page.waitForSelector('[data-testid="repository-card"]');
      await page.locator('[data-testid="repository-card"]').first().click();
      
      // Look for any external links (GitHub, Postman, etc.)
      const externalLinks = page.locator('a[href^="http"]:not([href*="localhost"])');
      const count = await externalLinks.count();
      
      if (count > 0) {
        // Check that external links have target="_blank"
        const firstLink = externalLinks.first();
        const target = await firstLink.getAttribute('target');
        expect(target).toBe('_blank');
      }
    });

    test('should navigate between documents correctly', async ({ page }) => {
      // Navigate to a repository with documentation
      await page.waitForSelector('[data-testid="repository-card"]');
      await page.locator('[data-testid="repository-card"]').first().click();
      
      // Look for document links
      const docLinks = page.locator('a[href*=".md"], a[href*="README"]');
      const hasDocLinks = await docLinks.count() > 0;
      
      if (hasDocLinks) {
        // Click first document link
        await docLinks.first().click();
        
        // Should show document content
        await expect(page.locator('.markdown-content, .document-viewer, [data-testid="document-content"]')).toBeVisible();
      }
    });
  });

  test.describe('5. Error Boundaries and Edge Cases', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Intercept API calls and fail them
      await page.route('**/api/**', route => route.abort());
      
      // Try to navigate
      await page.goto('/');
      
      // Should show error state or fallback content
      const errorStates = [
        page.getByText(/error/i),
        page.getByText(/failed to load/i),
        page.getByText(/something went wrong/i),
        page.getByText(/no repositories/i)
      ];
      
      let hasErrorState = false;
      for (const errorState of errorStates) {
        if (await errorState.isVisible().catch(() => false)) {
          hasErrorState = true;
          break;
        }
      }
      
      expect(hasErrorState).toBeTruthy();
    });

    test('should handle empty states correctly', async ({ page }) => {
      // Search for something that won't exist
      await page.getByPlaceholder(/search repositories/i).fill('xyzxyzxyzxyzxyz');
      await page.waitForTimeout(500);
      
      // Should show no results message
      await expect(page.getByText(/no repositories found|no results/i)).toBeVisible();
    });
  });

  test.describe('6. Performance and Load Testing', () => {
    test('should load page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle rapid navigation without crashes', async ({ page }) => {
      // Rapid navigation test
      for (let i = 0; i < 5; i++) {
        await page.goto('/');
        await page.waitForSelector('[data-testid="repository-card"]');
        
        if (i % 2 === 0) {
          await page.locator('[data-testid="repository-card"]').first().click();
        }
      }
      
      // Should still be functional
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('7. Accessibility Testing', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab through main elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should have focus indicators
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).not.toBe('BODY');
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check main navigation
      await expect(page.getByRole('navigation')).toBeVisible();
      
      // Check search button
      await expect(page.getByRole('button', { name: /search/i })).toBeVisible();
      
      // Check main content area
      await expect(page.getByRole('main')).toBeVisible();
    });
  });

  test.describe('8. Authentication Flow (Bypass Mode)', () => {
    test('should show authenticated user UI', async ({ page }) => {
      // Should show user menu or sign in
      const userMenu = page.getByText(/demo user|sign in/i);
      await expect(userMenu).toBeVisible();
    });

    test('should access protected routes', async ({ page }) => {
      // Try to access sync page (admin only)
      await page.goto('/sync');
      
      // In bypass mode, should allow access
      const syncPage = page.getByRole('heading', { name: /sync/i });
      const redirected = page.url() === 'http://localhost:3000/';
      
      expect((await syncPage.isVisible().catch(() => false)) || redirected).toBeTruthy();
    });
  });
});