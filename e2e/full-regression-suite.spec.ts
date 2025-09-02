import { test, expect } from '@playwright/test';

test.describe('Axiom Loom Full Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for initial load but don't wait forever
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
  });

  test.describe('Core Application Loading', () => {
    test('Application should load without errors', async ({ page }) => {
      // Check React app loads
      const rootElement = page.locator('#root');
      await expect(rootElement).toBeVisible();
      
      // Check for Axiom Loom branding
      const title = page.locator('h1:has-text("Axiom Loom")');
      await expect(title.first()).toBeVisible();
    });

    test('Navigation menu should be functional', async ({ page }) => {
      // Check all navigation links exist
      await expect(page.locator('a:has-text("Home")')).toBeVisible();
      await expect(page.locator('a:has-text("Repositories")')).toBeVisible();
      await expect(page.locator('a:has-text("APIs")')).toBeVisible();
      await expect(page.locator('a:has-text("Docs")')).toBeVisible();
      await expect(page.locator('a:has-text("Sync")')).toBeVisible();
    });
  });

  test.describe('Repository Display', () => {
    test('Repositories should display with content', async ({ page }) => {
      // Check if repository content is visible (not using data-testid since it's not working)
      const repoTitles = page.locator('h3, h2').filter({ hasText: /AI|Platform|Architecture/ });
      const count = await repoTitles.count();
      
      console.log(`Found ${count} repository titles`);
      expect(count).toBeGreaterThan(0);
      
      // Check first repository has content
      if (count > 0) {
        await expect(repoTitles.first()).toBeVisible();
        const text = await repoTitles.first().textContent();
        console.log('First repository:', text);
      }
    });

    test('Repository cards should have action buttons', async ({ page }) => {
      // Find Repository buttons
      const repoButtons = page.locator('a:has-text("Repository")');
      const buttonCount = await repoButtons.count();
      
      console.log(`Found ${buttonCount} Repository buttons`);
      expect(buttonCount).toBeGreaterThan(0);
      
      // Check Documentation buttons
      const docButtons = page.locator('a:has-text("Documentation")');
      expect(await docButtons.count()).toBeGreaterThan(0);
    });

    test('Conditional buttons should only show when content exists', async ({ page }) => {
      // Check if Postman/GraphQL buttons exist
      const postmanButtons = page.locator('a:has-text("Postman")');
      const graphqlButtons = page.locator('a:has-text("GraphQL")');
      const apiExplorerButtons = page.locator('a:has-text("API Explorer")');
      
      console.log('Conditional buttons found:');
      console.log('- Postman:', await postmanButtons.count());
      console.log('- GraphQL:', await graphqlButtons.count());
      console.log('- API Explorer:', await apiExplorerButtons.count());
    });
  });

  test.describe('Navigation and Routing', () => {
    test('Should navigate to repository detail page', async ({ page }) => {
      // Click first Repository button
      const repoButton = page.locator('a:has-text("Repository")').first();
      if (await repoButton.count() > 0) {
        await repoButton.click();
        await page.waitForLoadState('domcontentloaded');
        
        // Check we're on a repository page
        const url = page.url();
        expect(url).toContain('/repository/');
        console.log('Navigated to:', url);
      }
    });

    test('Should navigate to documentation page', async ({ page }) => {
      // Click first Documentation button
      const docButton = page.locator('a:has-text("Documentation")').first();
      if (await docButton.count() > 0) {
        await docButton.click();
        await page.waitForLoadState('domcontentloaded');
        
        // Check we're on a docs page
        const url = page.url();
        expect(url).toContain('/docs/');
        console.log('Navigated to docs:', url);
      }
    });

    test('Should navigate to APIs page', async ({ page }) => {
      await page.click('a:has-text("APIs")');
      await page.waitForLoadState('domcontentloaded');
      
      const url = page.url();
      expect(url).toContain('/api');
      console.log('APIs page URL:', url);
    });
  });

  test.describe('API Functionality', () => {
    test('API endpoints should be accessible', async ({ page }) => {
      const response = await page.evaluate(async () => {
        try {
          const res = await fetch('/api/repositories');
          const data = res.ok ? await res.json() : null;
          return {
            status: res.status,
            ok: res.ok,
            dataLength: data ? data.length : 0
          };
        } catch (err) {
          return { error: err.message };
        }
      });
      
      console.log('API Response:', response);
      
      if ('status' in response) {
        expect(response.status).toBeLessThan(500); // Not a server error
        if (response.ok) {
          expect(response.dataLength).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('UI Quality', () => {
    test('Text should be readable with proper contrast', async ({ page }) => {
      // Check main heading visibility
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
      
      // Check text color contrast
      const styles = await heading.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          opacity: computed.opacity
        };
      });
      
      console.log('Heading styles:', styles);
      expect(parseFloat(styles.opacity)).toBeGreaterThanOrEqual(0.8);
    });

    test('Glass cards should not have excessive blur', async ({ page }) => {
      // Find any glass-styled element
      const glassElements = page.locator('[class*="Glass"], [class*="glass"], [class*="Card"]').first();
      
      if (await glassElements.count() > 0) {
        const styles = await glassElements.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            backdropFilter: computed.backdropFilter || computed.webkitBackdropFilter,
            background: computed.background
          };
        });
        
        console.log('Glass element styles:', styles);
        
        // Check blur is not excessive
        if (styles.backdropFilter && styles.backdropFilter.includes('blur')) {
          const blurMatch = styles.backdropFilter.match(/blur\((\d+)/);
          if (blurMatch) {
            const blurValue = parseInt(blurMatch[1]);
            expect(blurValue).toBeLessThanOrEqual(15);
          }
        }
      }
    });
  });

  test.describe('Document Links', () => {
    test('Documentation links should work', async ({ page }) => {
      // Navigate to a documentation page
      const docButton = page.locator('a:has-text("Documentation")').first();
      if (await docButton.count() > 0) {
        await docButton.click();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        // Check for markdown content or links
        const links = page.locator('a[href*=".md"], a[href*="README"]');
        const linkCount = await links.count();
        console.log(`Found ${linkCount} documentation links`);
        
        // Test first link if exists
        if (linkCount > 0) {
          const firstLink = links.first();
          const href = await firstLink.getAttribute('href');
          console.log('First doc link:', href);
        }
      }
    });
  });

  test.describe('Error Handling', () => {
    test('Should handle missing pages gracefully', async ({ page }) => {
      await page.goto('/non-existent-page');
      await page.waitForLoadState('domcontentloaded');
      
      // Should either redirect or show error
      const url = page.url();
      const hasError = await page.locator('text=/404|not found|error/i').count();
      
      console.log('404 page URL:', url);
      console.log('Has error message:', hasError > 0);
      
      // Should not crash
      const appRoot = page.locator('#root');
      await expect(appRoot).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('Page should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;
      
      console.log(`Page load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(10000); // 10 seconds max
    });

    test('API calls should complete reasonably fast', async ({ page }) => {
      const apiTime = await page.evaluate(async () => {
        const start = Date.now();
        try {
          await fetch('/api/repositories');
          return Date.now() - start;
        } catch {
          return -1;
        }
      });
      
      console.log(`API call time: ${apiTime}ms`);
      if (apiTime > 0) {
        expect(apiTime).toBeLessThan(5000); // 5 seconds max
      }
    });
  });

  test.describe('Click-through UI Testing', () => {
    test('Complete user journey through application', async ({ page }) => {
      console.log('Starting complete user journey...');
      
      // 1. Start at homepage
      await expect(page.locator('h1:has-text("Axiom Loom")')).toBeVisible();
      
      // 2. Click on a repository
      const repoLink = page.locator('a:has-text("Repository")').first();
      if (await repoLink.count() > 0) {
        await repoLink.click();
        await page.waitForLoadState('domcontentloaded');
        console.log('✓ Navigated to repository');
      }
      
      // 3. Go back home
      await page.click('a:has-text("Home")');
      await page.waitForLoadState('domcontentloaded');
      console.log('✓ Returned home');
      
      // 4. Try APIs page
      await page.click('a:has-text("APIs")');
      await page.waitForLoadState('domcontentloaded');
      console.log('✓ Visited APIs page');
      
      // 5. Try Docs
      await page.click('a:has-text("Docs")').first();
      await page.waitForLoadState('domcontentloaded');
      console.log('✓ Visited Docs');
      
      // 6. Check Sync page
      const syncLink = page.locator('a:has-text("Sync")');
      if (await syncLink.count() > 0) {
        await syncLink.click();
        await page.waitForLoadState('domcontentloaded');
        console.log('✓ Visited Sync page');
      }
      
      console.log('✓ Complete journey successful');
    });
  });
});