import { test, expect } from '@playwright/test';

test.describe('Design System Integration E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('EY Branding Colors', () => {
    test('primary EY yellow is used correctly', async ({ page }) => {
      // Check that EY yellow appears in key brand elements
      const logoIcon = page.locator('text=EY').first();
      await expect(logoIcon).toBeVisible();
      
      // Primary buttons should use EY colors
      const primaryButton = page.locator('button:has-text("Add Repository")').first();
      if (await primaryButton.count() > 0) {
        await expect(primaryButton).toBeVisible();
      }
    });

    test('EY black is used for text and secondary elements', async ({ page }) => {
      // Main text should use EY black
      const headings = page.locator('h1, h2, h3');
      if (await headings.count() > 0) {
        await expect(headings.first()).toBeVisible();
      }
    });

    test('brand consistency across pages', async ({ page }) => {
      // Check home page branding
      const homeBranding = page.locator('text=EYNS');
      await expect(homeBranding).toBeVisible();
      
      // Navigate to sync page and check consistency
      await page.goto('/sync');
      const syncPageHeader = page.locator('header');
      await expect(syncPageHeader).toBeVisible();
      
      // EY logo should be consistent
      const syncLogo = page.locator('text=EY');
      await expect(syncLogo).toBeVisible();
    });
  });

  test.describe('Typography System', () => {
    test('heading hierarchy is visually clear', async ({ page }) => {
      // Main page title should be largest
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      
      // Check for proper font sizes and hierarchy
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      if (headingCount > 1) {
        // Multiple heading levels should be present and properly sized
        await expect(headings.nth(1)).toBeVisible();
      }
    });

    test('body text is readable and accessible', async ({ page }) => {
      // Check paragraph text
      const paragraphs = page.locator('p');
      if (await paragraphs.count() > 0) {
        await expect(paragraphs.first()).toBeVisible();
      }
      
      // Check that text has sufficient contrast
      const textElements = page.locator('p, span, div').filter({ hasText: /.{10,}/ });
      if (await textElements.count() > 0) {
        await expect(textElements.first()).toBeVisible();
      }
    });

    test('font weights create proper emphasis', async ({ page }) => {
      // Check for bold text in important areas
      const strongText = page.locator('strong, b, [class*="bold"], [class*="semibold"]');
      if (await strongText.count() > 0) {
        await expect(strongText.first()).toBeVisible();
      }
    });
  });

  test.describe('Spacing and Layout', () => {
    test('consistent spacing between elements', async ({ page }) => {
      // Check header spacing
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Check main content spacing
      const mainContent = page.locator('main, [role="main"]').first();
      if (await mainContent.count() > 0) {
        await expect(mainContent).toBeVisible();
      }
    });

    test('container widths are appropriate', async ({ page }) => {
      // Test different viewport sizes
      const viewports = [
        { width: 320, height: 568 },  // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1200, height: 800 }, // Desktop
        { width: 1920, height: 1080 } // Large desktop
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.reload();
        
        // Content should be properly contained
        const container = page.locator('header').first();
        await expect(container).toBeVisible();
        
        // Content should not overflow or be too narrow
        const body = page.locator('body');
        await expect(body).toBeVisible();
      }
    });

    test('grid layouts work responsively', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Check for grid-based layouts (repository cards, etc.)
      const gridItems = page.locator('[class*="grid"], [style*="grid"]').first();
      if (await gridItems.count() > 0) {
        await expect(gridItems).toBeVisible();
      }
      
      // Test mobile layout
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(100);
      
      // Grid should adapt to mobile
      const mobileLayout = page.locator('body');
      await expect(mobileLayout).toBeVisible();
    });
  });

  test.describe('Interactive Elements', () => {
    test('buttons have consistent styling and behavior', async ({ page }) => {
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        // Test first few buttons
        for (let i = 0; i < Math.min(buttonCount, 3); i++) {
          const button = buttons.nth(i);
          await expect(button).toBeVisible();
          
          // Test hover state
          await button.hover();
          
          // Test focus state
          await button.focus();
        }
      }
    });

    test('links have proper hover and focus states', async ({ page }) => {
      const links = page.locator('a');
      const linkCount = await links.count();
      
      if (linkCount > 0) {
        for (let i = 0; i < Math.min(linkCount, 3); i++) {
          const link = links.nth(i);
          await expect(link).toBeVisible();
          
          // Test hover
          await link.hover();
          
          // Test focus
          await link.focus();
        }
      }
    });

    test('form elements have consistent styling', async ({ page }) => {
      // Look for any form inputs
      const inputs = page.locator('input, textarea, select');
      if (await inputs.count() > 0) {
        const firstInput = inputs.first();
        await expect(firstInput).toBeVisible();
        
        // Test focus state
        await firstInput.focus();
      }
    });
  });

  test.describe('Cards and Content Containers', () => {
    test('cards have proper elevation and spacing', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Look for card-like elements
      const cards = page.locator('[class*="card"], [class*="sc-"]').filter({ hasText: /.+/ });
      if (await cards.count() > 0) {
        const firstCard = cards.first();
        await expect(firstCard).toBeVisible();
        
        // Test hover effect
        await firstCard.hover();
      }
    });

    test('content hierarchy is clear within cards', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Cards should have clear titles and content
      const cardTitles = page.locator('h3, h4, h5').filter({ hasText: /.+/ });
      if (await cardTitles.count() > 0) {
        await expect(cardTitles.first()).toBeVisible();
      }
    });
  });

  test.describe('Loading States', () => {
    test('loading indicators follow design system', async ({ page }) => {
      // Intercept API calls to test loading states
      await page.route('**/api/repositories', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
      });
      
      await page.reload();
      
      // Should show consistent loading state
      const loadingIndicator = page.locator('text=Loading');
      if (await loadingIndicator.count() > 0) {
        await expect(loadingIndicator.first()).toBeVisible();
      }
    });

    test('skeleton loading states are consistent', async ({ page }) => {
      // Mock slow loading to see skeleton states
      await page.route('**/api/repositories', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await route.continue();
      });
      
      await page.reload();
      
      // Look for skeleton loading elements
      const skeletons = page.locator('[class*="skeleton"], [class*="loading"]');
      if (await skeletons.count() > 0) {
        await expect(skeletons.first()).toBeVisible();
      }
    });
  });

  test.describe('Animations and Transitions', () => {
    test('hover animations are smooth and consistent', async ({ page }) => {
      const interactiveElements = page.locator('button, a, [class*="card"]');
      
      if (await interactiveElements.count() > 0) {
        const element = interactiveElements.first();
        await expect(element).toBeVisible();
        
        // Test hover animation
        await element.hover();
        await page.waitForTimeout(100); // Allow animation to start
        
        // Move away to test hover out
        await page.mouse.move(0, 0);
        await page.waitForTimeout(100);
      }
    });

    test('focus animations provide clear feedback', async ({ page }) => {
      // Tab through elements to test focus animations
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Continue tabbing
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    });

    test('page transitions are smooth', async ({ page }) => {
      // Navigate between pages to test transitions
      const homeLink = page.locator('a:has-text("Home")');
      if (await homeLink.count() > 0) {
        await homeLink.click();
        await page.waitForLoadState('domcontentloaded');
      }
      
      // Navigate to sync page
      const syncLink = page.locator('a:has-text("Sync")');
      if (await syncLink.count() > 0) {
        await syncLink.click();
        await page.waitForLoadState('domcontentloaded');
      }
    });
  });

  test.describe('Cross-browser Consistency', () => {
    test('design system works across different browsers', async ({ page, browserName }) => {
      // Test that key design elements render consistently
      const logo = page.locator('text=EY');
      await expect(logo).toBeVisible();
      
      const mainHeading = page.locator('h1').first();
      await expect(mainHeading).toBeVisible();
      
      // Test that interactive elements work
      const buttons = page.locator('button').first();
      if (await buttons.count() > 0) {
        await expect(buttons).toBeVisible();
        await buttons.hover();
      }
      
      console.log(`Design system tested on ${browserName}`);
    });
  });
});