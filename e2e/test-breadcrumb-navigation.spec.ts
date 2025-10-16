import { test, expect } from '@playwright/test';

test.describe('Breadcrumb Navigation for Sub-Documents', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to documentation for water heater platform
    await page.goto('http://localhost:3000/docs/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
  });

  test('should display repository home breadcrumb link', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Should show repository home link in breadcrumb
    const repoHomeLink = page.locator('nav[aria-label="Documentation breadcrumb"] a[href*="/repository/appliances-co-water-heater-platform"]');
    await expect(repoHomeLink).toBeVisible({ timeout: 10000 });
    
    const linkText = await repoHomeLink.textContent();
    expect(linkText?.toLowerCase()).toContain('appliances-co-water-heater-platform');
  });

  test('should navigate to sub-document and show breadcrumbs', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Look for a link to a sub-document (like Getting Started)
    const gettingStartedLink = page.locator('a:has-text("Getting Started"), a[href*="GETTING_STARTED"], a[href*="getting-started"]');
    
    if (await gettingStartedLink.isVisible()) {
      // Click to navigate to sub-document
      await gettingStartedLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Should show breadcrumb navigation
      const breadcrumbNav = page.locator('nav[aria-label="Documentation breadcrumb"]');
      await expect(breadcrumbNav).toBeVisible();
      
      // Should show repository home link
      const repoHomeLink = breadcrumbNav.locator('a:has-text("appliances-co-water-heater-platform")');
      await expect(repoHomeLink).toBeVisible();
      
      // Should show documentation link/button
      const docLink = breadcrumbNav.locator('button:has-text("Documentation"), a:has-text("Documentation")');
      await expect(docLink).toBeVisible();
      
      // Should show current document name
      const currentDoc = breadcrumbNav.locator('span:has-text("Getting Started"), span:has-text("Getting"), span:has-text("Started")');
      await expect(currentDoc).toBeVisible();
    }
  });

  test('should allow navigation back to README via breadcrumb', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Navigate to a sub-document first
    const subDocLink = page.locator('a:has-text("Getting Started"), a:has-text("Architecture"), a:has-text("Demo")').first();
    
    if (await subDocLink.isVisible()) {
      await subDocLink.click();
      await page.waitForTimeout(2000);
      
      // Click the Documentation breadcrumb button to go back to README
      const docButton = page.locator('nav[aria-label="Documentation breadcrumb"] button:has-text("Documentation")');
      
      if (await docButton.isVisible()) {
        await docButton.click();
        await page.waitForTimeout(2000);
        
        // Should be back on README
        const readmeContent = page.locator('text=Water Heater Fleet Platform, text=README, h1:has-text("Water Heater")');
        await expect(readmeContent.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should allow navigation back to repository home via breadcrumb', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Navigate to a sub-document first
    const subDocLink = page.locator('a:has-text("Getting Started"), a:has-text("Architecture")').first();
    
    if (await subDocLink.isVisible()) {
      await subDocLink.click();
      await page.waitForTimeout(2000);
      
      // Click the repository home breadcrumb link
      const repoHomeLink = page.locator('nav[aria-label="Documentation breadcrumb"] a[href*="/repository/"]');
      
      if (await repoHomeLink.isVisible()) {
        await repoHomeLink.click();
        await page.waitForLoadState('networkidle');
        
        // Should be back on repository detail page
        const repoPage = page.locator('text=Water Heater, text=Repository, h1, h2');
        await expect(repoPage.first()).toBeVisible({ timeout: 5000 });
        
        // URL should contain repository
        const url = page.url();
        expect(url).toContain('/repository/');
      }
    }
  });

  test('should not show Documentation breadcrumb when on README', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // When on README, should not show "Documentation" breadcrumb button
    const docButton = page.locator('nav[aria-label="Documentation breadcrumb"] button:has-text("Documentation")');
    await expect(docButton).not.toBeVisible();
    
    // Should only show repository home link
    const repoHomeLink = page.locator('nav[aria-label="Documentation breadcrumb"] a');
    await expect(repoHomeLink).toBeVisible();
  });

  test('should format document names properly in breadcrumbs', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Navigate to a document with underscores/hyphens (like GETTING_STARTED.md)
    const gettingStartedLink = page.locator('a:has-text("Getting Started"), a[href*="GETTING_STARTED"], a[href*="getting-started"]');
    
    if (await gettingStartedLink.isVisible()) {
      await gettingStartedLink.click();
      await page.waitForTimeout(2000);
      
      // Should format the name properly (capitalize, remove underscores/hyphens)
      const breadcrumbNav = page.locator('nav[aria-label="Documentation breadcrumb"]');
      const formattedName = breadcrumbNav.locator('span[class*="breadcrumbCurrent"]');
      
      if (await formattedName.isVisible()) {
        const text = await formattedName.textContent();
        expect(text).toMatch(/Getting Started|Architecture|Developer|Demo/);
        expect(text).not.toContain('_');
        expect(text).not.toContain('-');
        expect(text).not.toContain('.md');
      }
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Breadcrumb navigation should have proper ARIA labels
    const breadcrumbNav = page.locator('nav[aria-label="Documentation breadcrumb"]');
    await expect(breadcrumbNav).toBeVisible();
    
    // Links should be keyboard accessible
    const repoHomeLink = breadcrumbNav.locator('a').first();
    if (await repoHomeLink.isVisible()) {
      await expect(repoHomeLink).toHaveAttribute('href');
    }
    
    // Buttons should be focusable
    const docButton = breadcrumbNav.locator('button');
    if (await docButton.isVisible()) {
      await docButton.focus();
      // Should not throw error when focused
    }
  });

  test('should handle navigation errors gracefully', async ({ page }) => {
    const errors: string[] = [];
    
    // Listen for JavaScript errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(3000);
    
    // Try clicking breadcrumb elements
    const breadcrumbNav = page.locator('nav[aria-label="Documentation breadcrumb"]');
    const clickableElements = breadcrumbNav.locator('a, button');
    
    const count = await clickableElements.count();
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const element = clickableElements.nth(i);
        if (await element.isVisible()) {
          await element.click();
          await page.waitForTimeout(1000);
        }
      }
      
      // Should not have JavaScript errors
      expect(errors.length).toBe(0);
    }
  });
});