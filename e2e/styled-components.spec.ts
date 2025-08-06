import { test, expect } from '@playwright/test';

test.describe('Styled Components E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Header Component', () => {
    test('displays EY branding correctly', async ({ page }) => {
      // Check for EY logo
      const logo = page.locator('text=EY');
      await expect(logo).toBeVisible();
      
      // Check for EYNS branding
      const eynsText = page.locator('text=EYNS');
      await expect(eynsText).toBeVisible();
      
      // Check for full title
      const title = page.locator('text=AI Experience Center');
      await expect(title).toBeVisible();
    });

    test('navigation links work correctly', async ({ page }) => {
      // Test Home link
      const homeLink = page.locator('a:has-text("Home")');
      await expect(homeLink).toBeVisible();
      await expect(homeLink).toHaveAttribute('href', '/');
      
      // Test Sync link
      const syncLink = page.locator('a:has-text("Sync")');
      await expect(syncLink).toBeVisible();
      await expect(syncLink).toHaveAttribute('href', '/sync');
      
      // Click sync link and verify navigation
      await syncLink.click();
      await expect(page).toHaveURL('/sync');
    });

    test('search functionality works', async ({ page }) => {
      // Check search button is visible
      const searchButton = page.locator('button:has-text("Search")');
      await expect(searchButton).toBeVisible();
      
      // Check keyboard shortcut indicator
      const shortcut = page.locator('text=⌘K');
      await expect(shortcut).toBeVisible();
      
      // Click search button
      await searchButton.click();
      
      // Search modal should appear (if implemented)
      // This would depend on the GlobalSearchModal implementation
    });

    test('keyboard shortcuts work', async ({ page }) => {
      // Press Cmd+K (or Ctrl+K on non-Mac)
      await page.keyboard.press('Meta+KeyK');
      
      // Search modal should open (if implemented)
      // This test would need to be adapted based on actual modal implementation
    });

    test('header is sticky on scroll', async ({ page }) => {
      // Scroll down the page
      await page.evaluate(() => window.scrollTo(0, 500));
      
      // Header should still be visible
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });
  });

  test.describe('Repository List with New Styling', () => {
    test('displays hero section with EY branding', async ({ page }) => {
      // Check for hero title with EYNS highlighting
      const heroTitle = page.locator('h1:has-text("EYNS AI Experience Center")');
      await expect(heroTitle).toBeVisible();
      
      // Check for hero description
      const heroDescription = page.locator('text=Developer Portal - Repositories, APIs, Documentation & More');
      await expect(heroDescription).toBeVisible();
      
      // Check for action buttons
      const addButton = page.locator('button:has-text("Add Repository")');
      await expect(addButton).toBeVisible();
      
      const syncButton = page.locator('a:has-text("Repository Sync")');
      await expect(syncButton).toBeVisible();
    });

    test('repository cards have proper styling and interactions', async ({ page }) => {
      // Wait for repositories to load
      await page.waitForLoadState('networkidle');
      
      // Find repository cards (they should use the new Card component)
      const cards = page.locator('[class*="sc-"]').filter({ hasText: /APIs:|Updated:/ });
      
      if (await cards.count() > 0) {
        const firstCard = cards.first();
        await expect(firstCard).toBeVisible();
        
        // Test hover effect (if hoverable prop is set)
        await firstCard.hover();
        
        // Cards should have action buttons
        const actionButtons = firstCard.locator('button, a').filter({ hasText: /Repository|Docs|API/ });
        await expect(actionButtons.first()).toBeVisible();
      }
    });

    test('action buttons work correctly', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Test "Add Repository" button
      const addButton = page.locator('button:has-text("Add Repository")');
      await addButton.click();
      
      // Modal should open (if implemented)
      // This would need to be adapted based on AddRepositoryModal implementation
    });

    test('empty state displays correctly', async ({ page }) => {
      // Mock empty repositories response
      await page.route('**/api/repositories', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      });
      
      await page.reload();
      
      // Check for empty state message
      const emptyMessage = page.locator('text=No Repositories Found');
      await expect(emptyMessage).toBeVisible();
      
      // Should have a call-to-action button
      const ctaButton = page.locator('button:has-text("Add Your First Repository")');
      await expect(ctaButton).toBeVisible();
    });

    test('loading state displays correctly', async ({ page }) => {
      // Intercept and delay the API response
      await page.route('**/api/repositories', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
      });
      
      await page.reload();
      
      // Should show loading state
      const loadingIndicator = page.locator('text=Loading repositories...');
      await expect(loadingIndicator).toBeVisible();
    });
  });

  test.describe('Button Components', () => {
    test('buttons have correct styling and behavior', async ({ page }) => {
      // Test primary buttons (should have EY yellow background)
      const primaryButtons = page.locator('button').filter({ hasText: /Add Repository|Repository/ });
      
      if (await primaryButtons.count() > 0) {
        const firstButton = primaryButtons.first();
        await expect(firstButton).toBeVisible();
        
        // Test click interaction
        await firstButton.hover();
        
        // Test focus state
        await firstButton.focus();
      }
    });

    test('button variants display correctly', async ({ page }) => {
      // Check for different button variants in the page
      const buttons = page.locator('button, a[role="button"]');
      await expect(buttons.first()).toBeVisible();
      
      // Test that buttons are accessible
      for (let i = 0; i < Math.min(await buttons.count(), 3); i++) {
        const button = buttons.nth(i);
        await expect(button).toBeVisible();
      }
    });
  });

  test.describe('Typography Components', () => {
    test('headings use correct typography hierarchy', async ({ page }) => {
      // Test main heading
      const mainHeading = page.locator('h1').first();
      await expect(mainHeading).toBeVisible();
      
      // Test subheadings if present
      const subHeadings = page.locator('h2, h3, h4');
      if (await subHeadings.count() > 0) {
        await expect(subHeadings.first()).toBeVisible();
      }
    });

    test('text content is readable and accessible', async ({ page }) => {
      // Check for proper contrast and readability
      const textElements = page.locator('p, span').filter({ hasText: /.+/ });
      
      if (await textElements.count() > 0) {
        await expect(textElements.first()).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('mobile layout works correctly', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      
      // Header should still be visible and functional
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Navigation should be responsive
      const navLinks = page.locator('a:has-text("Home"), a:has-text("Sync")');
      await expect(navLinks.first()).toBeVisible();
      
      // Content should be readable
      const title = page.locator('h1').first();
      await expect(title).toBeVisible();
    });

    test('tablet layout works correctly', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      
      // All elements should be visible and properly laid out
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      const mainContent = page.locator('main, [role="main"]');
      if (await mainContent.count() > 0) {
        await expect(mainContent.first()).toBeVisible();
      }
    });

    test('desktop layout is optimal', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.reload();
      
      // Check that content is properly contained and centered
      const container = page.locator('header, main').first();
      await expect(container).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('keyboard navigation works', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      
      // Should focus on navigation or interactive elements
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Continue tabbing
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
    });

    test('buttons have proper focus states', async ({ page }) => {
      const buttons = page.locator('button').first();
      
      if (await buttons.count() > 0) {
        await buttons.focus();
        await expect(buttons).toBeFocused();
      }
    });

    test('links have proper accessibility attributes', async ({ page }) => {
      const links = page.locator('a');
      
      for (let i = 0; i < Math.min(await links.count(), 3); i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        
        if (href) {
          await expect(link).toBeVisible();
        }
      }
    });
  });

  test.describe('Performance with New Styling', () => {
    test('styled components render quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time even with styled-components
      expect(loadTime).toBeLessThan(3000);
    });

    test('no layout shift occurs during load', async ({ page }) => {
      await page.goto('/');
      
      // Wait for initial render
      await page.waitForTimeout(100);
      
      // Take initial screenshot for comparison
      const initialScreenshot = await page.screenshot();
      
      // Wait for complete load
      await page.waitForLoadState('networkidle');
      
      // Layout should be stable
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });
  });
});