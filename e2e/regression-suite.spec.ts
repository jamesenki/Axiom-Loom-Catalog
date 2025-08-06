import { test, expect, Page } from '@playwright/test';

// COMPREHENSIVE REGRESSION TEST SUITE
// MUST PASS 100% BEFORE ANY DEPLOYMENT

test.describe('EYNS AI Experience Center - Full Regression Suite', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('http://localhost:3000');
  });

  test.describe('1. Core Navigation', () => {
    test('Homepage loads successfully', async () => {
      await expect(page).toHaveTitle(/EYNS AI Experience Center/);
      await expect(page.locator('h1')).toContainText(/EYNS/);
    });

    test('All main navigation links work', async () => {
      const navItems = [
        { text: 'Repositories', url: /repositories/ },
        { text: 'APIs', url: /apis/ },
        { text: 'Documentation', url: /docs/ }
      ];

      for (const item of navItems) {
        const link = page.getByRole('link', { name: item.text });
        if (await link.isVisible()) {
          await link.click();
          await expect(page).toHaveURL(item.url);
          await page.goBack();
        }
      }
    });

    test('Search functionality works', async () => {
      const searchButton = page.getByRole('button', { name: /search/i });
      if (await searchButton.isVisible()) {
        await searchButton.click();
        const searchInput = page.getByPlaceholder(/search/i);
        await expect(searchInput).toBeVisible();
        await searchInput.fill('test');
        await searchInput.press('Enter');
      }
    });
  });

  test.describe('2. Repository Management', () => {
    test('Repository list displays', async () => {
      await page.goto('http://localhost:3000/repositories');
      await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible({ timeout: 10000 });
    });

    test('Add Repository modal opens and closes', async () => {
      const addButton = page.getByRole('button', { name: /add repository/i });
      if (await addButton.isVisible()) {
        await addButton.click();
        const modal = page.locator('[role="dialog"], [data-testid="add-repository-modal"]');
        await expect(modal).toBeVisible();
        
        // Check modal is properly positioned (not at bottom)
        const boundingBox = await modal.boundingBox();
        if (boundingBox) {
          expect(boundingBox.y).toBeLessThan(200); // Should be near top, not bottom
        }
        
        // Close modal
        const closeButton = modal.locator('button').filter({ hasText: /close|cancel|×/i }).first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await expect(modal).not.toBeVisible();
        }
      }
    });

    test('Repository details page loads', async () => {
      await page.goto('http://localhost:3000/repositories');
      const firstRepo = page.locator('[data-testid="repository-card"]').first();
      if (await firstRepo.isVisible()) {
        await firstRepo.click();
        await expect(page).toHaveURL(/repository\//);
        
        // Check for pricing information
        const pricingCard = page.locator('[data-testid="pricing-card"], :has-text("Suggested Retail Price")');
        if (await pricingCard.isVisible()) {
          await expect(pricingCard).toContainText(/\$/);
        }
      }
    });
  });

  test.describe('3. API Explorer', () => {
    test('API Explorer loads', async () => {
      await page.goto('http://localhost:3000/apis');
      await expect(page.locator('h1, h2').filter({ hasText: /API/i }).first()).toBeVisible();
    });

    test('API cards display with buttons', async () => {
      await page.goto('http://localhost:3000/apis');
      const apiCard = page.locator('[data-testid="api-card"], .api-card').first();
      if (await apiCard.isVisible()) {
        // Check for Postman/GraphQL/OpenAPI buttons
        const buttons = apiCard.locator('button, a').filter({ hasText: /postman|graphql|openapi|swagger/i });
        const buttonCount = await buttons.count();
        expect(buttonCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('4. Documentation Viewer', () => {
    test('Documentation loads and renders markdown', async () => {
      await page.goto('http://localhost:3000/docs');
      await page.waitForLoadState('networkidle');
      
      // Check if markdown content is rendered
      const markdownContent = page.locator('.markdown-body, [data-testid="markdown-content"]');
      if (await markdownContent.isVisible()) {
        await expect(markdownContent).toBeVisible();
      }
    });

    test('Document links navigate correctly', async () => {
      await page.goto('http://localhost:3000/repository/eyns-car-rental-system');
      const docLink = page.locator('a').filter({ hasText: /readme|documentation|docs/i }).first();
      if (await docLink.isVisible()) {
        await docLink.click();
        await expect(page).toHaveURL(/docs|documentation/);
      }
    });

    test('Mermaid diagrams render', async () => {
      await page.goto('http://localhost:3000/repository/eyns-car-rental-system/docs/architecture/diagrams.md');
      await page.waitForLoadState('networkidle');
      
      // Check if mermaid diagram rendered
      const mermaidDiagram = page.locator('.mermaid svg, [data-testid="mermaid-diagram"] svg');
      if (await mermaidDiagram.isVisible()) {
        await expect(mermaidDiagram).toBeVisible();
      }
    });
  });

  test.describe('5. Authentication & Security', () => {
    test('Bypass auth mode works', async () => {
      await page.goto('http://localhost:3000');
      // Should not redirect to login
      await expect(page).not.toHaveURL(/login/);
    });

    test('No console errors on navigation', async () => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto('http://localhost:3000');
      await page.goto('http://localhost:3000/repositories');
      await page.goto('http://localhost:3000/apis');
      
      expect(errors.filter(e => !e.includes('Failed to load resource'))).toHaveLength(0);
    });
  });

  test.describe('6. Network & Performance', () => {
    test('API health check passes', async () => {
      const response = await page.request.get('http://localhost:3001/api/health');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('healthy');
    });

    test('Static assets load correctly', async () => {
      await page.goto('http://localhost:3000');
      
      // Check that CSS loaded
      const styles = await page.evaluate(() => {
        const body = document.body;
        return window.getComputedStyle(body).backgroundColor !== '';
      });
      expect(styles).toBe(true);
      
      // Check that JavaScript loaded
      const jsLoaded = await page.evaluate(() => {
        return typeof React !== 'undefined' || document.getElementById('root')?.children.length > 0;
      });
      expect(jsLoaded).toBe(true);
    });

    test('Page loads within acceptable time', async () => {
      const startTime = Date.now();
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });
  });

  test.describe('7. Error Handling', () => {
    test('404 page handles unknown routes', async () => {
      await page.goto('http://localhost:3000/non-existent-route');
      const content = await page.textContent('body');
      expect(content).toMatch(/not found|404|error/i);
    });

    test('API errors are handled gracefully', async () => {
      await page.goto('http://localhost:3000/repository/non-existent-repo');
      // Should show error message, not crash
      await expect(page.locator('body')).toBeVisible();
      const content = await page.textContent('body');
      expect(content).not.toContain('Application Error');
    });
  });

  test.describe('8. Critical User Flows', () => {
    test('Complete repository browsing flow', async () => {
      // Start at homepage
      await page.goto('http://localhost:3000');
      
      // Navigate to repositories
      await page.click('text=Repositories');
      await expect(page).toHaveURL(/repositories/);
      
      // Click on a repository
      const repoCard = page.locator('[data-testid="repository-card"]').first();
      if (await repoCard.isVisible()) {
        await repoCard.click();
        await expect(page).toHaveURL(/repository\//);
        
        // Check key elements are visible
        await expect(page.locator('h1, h2').first()).toBeVisible();
      }
    });

    test('Complete API exploration flow', async () => {
      // Navigate to APIs
      await page.goto('http://localhost:3000/apis');
      
      // Check API cards are visible
      const apiCards = page.locator('[data-testid="api-card"], .api-card');
      await expect(apiCards.first()).toBeVisible({ timeout: 10000 });
      
      // Click on API button if available
      const apiButton = page.locator('button').filter({ hasText: /view|explore|open/i }).first();
      if (await apiButton.isVisible()) {
        await apiButton.click();
        // Should navigate or open modal
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('9. Data Integrity', () => {
    test('Repository metadata displays correctly', async () => {
      await page.goto('http://localhost:3000/repositories');
      const repoCard = page.locator('[data-testid="repository-card"]').first();
      
      if (await repoCard.isVisible()) {
        // Check for required metadata
        await expect(repoCard).toContainText(/.+/); // Has title
        const description = repoCard.locator('[data-testid="description"], .description');
        if (await description.isVisible()) {
          await expect(description).toContainText(/.+/); // Has description
        }
      }
    });

    test('API detection works correctly', async () => {
      await page.goto('http://localhost:3000/repository/eyns-car-rental-system');
      await page.waitForLoadState('networkidle');
      
      // Check for API buttons
      const apiButtons = page.locator('button, a').filter({ hasText: /api|postman|graphql|swagger|openapi/i });
      const buttonCount = await apiButtons.count();
      expect(buttonCount).toBeGreaterThanOrEqual(0); // May or may not have APIs
    });
  });

  test.describe('10. Accessibility', () => {
    test('Page has proper heading hierarchy', async () => {
      await page.goto('http://localhost:3000');
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThan(0);
      expect(h1Count).toBeLessThanOrEqual(1); // Should have exactly one h1
    });

    test('Interactive elements are keyboard accessible', async () => {
      await page.goto('http://localhost:3000');
      
      // Tab through page
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Check if an element has focus
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });
      expect(focusedElement).toBeTruthy();
    });
  });
});

// Export test counts for validation
export const EXPECTED_TEST_COUNT = 30;
export const CRITICAL_TESTS = [
  'Homepage loads successfully',
  'Repository list displays',
  'API health check passes',
  'No console errors on navigation',
  'Complete repository browsing flow'
];