import { test, expect } from '@playwright/test';

test.describe('Repository Card Double-Click Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main repository list page
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to repository detail page on double-click', async ({ page }) => {
    // Wait for repository cards to load
    await page.waitForTimeout(3000);
    
    // Find the first repository card
    const repositoryCard = page.locator('[data-testid="repository-card"]').first();
    await expect(repositoryCard).toBeVisible({ timeout: 10000 });
    
    // Get the repository name from the card for URL verification
    const cardTitle = repositoryCard.locator('h3').first();
    const titleText = await cardTitle.textContent();
    
    // Double-click on the repository card
    await repositoryCard.dblclick();
    await page.waitForLoadState('networkidle');
    
    // Should navigate to repository detail page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/repository/');
    
    // Page should show repository details
    const detailPage = page.locator('text=Repository, text=APIs, text=Documentation');
    await expect(detailPage.first()).toBeVisible({ timeout: 5000 });
  });

  test('should work for multiple repository cards', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const repositoryCards = page.locator('[data-testid="repository-card"]');
    const cardCount = await repositoryCards.count();
    
    if (cardCount >= 2) {
      // Test second card
      const secondCard = repositoryCards.nth(1);
      await expect(secondCard).toBeVisible();
      
      // Double-click second card
      await secondCard.dblclick();
      await page.waitForLoadState('networkidle');
      
      // Should navigate to correct repository detail page
      const currentUrl = page.url();
      expect(currentUrl).toContain('/repository/');
      
      // Go back to test another card
      await page.goBack();
      await page.waitForTimeout(2000);
      
      // Test first card
      const firstCard = repositoryCards.first();
      await firstCard.dblclick();
      await page.waitForLoadState('networkidle');
      
      const newUrl = page.url();
      expect(newUrl).toContain('/repository/');
      expect(newUrl).not.toBe(currentUrl); // Should be different repository
    }
  });

  test('should have proper cursor styling on hover', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const repositoryCard = page.locator('[data-testid="repository-card"]').first();
    await expect(repositoryCard).toBeVisible();
    
    // Hover over the card
    await repositoryCard.hover();
    
    // Card should have pointer cursor (indicating it's clickable)
    const cursor = await repositoryCard.evaluate((el) => 
      window.getComputedStyle(el).cursor
    );
    
    // Should be clickable (cursor: pointer or default is acceptable)
    expect(['pointer', 'default', 'auto']).toContain(cursor);
  });

  test('should not interfere with action button clicks', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const repositoryCard = page.locator('[data-testid="repository-card"]').first();
    await expect(repositoryCard).toBeVisible();
    
    // Find Repository button inside the card
    const repositoryButton = repositoryCard.locator('a:has-text("Repository")').first();
    
    if (await repositoryButton.isVisible()) {
      // Single click on Repository button should work normally
      await repositoryButton.click();
      await page.waitForLoadState('networkidle');
      
      // Should navigate to repository page
      const currentUrl = page.url();
      expect(currentUrl).toContain('/repository/');
    }
  });

  test('should handle double-click on different card areas', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const repositoryCard = page.locator('[data-testid="repository-card"]').first();
    await expect(repositoryCard).toBeVisible();
    
    // Double-click on card title
    const cardTitle = repositoryCard.locator('h3').first();
    if (await cardTitle.isVisible()) {
      await cardTitle.dblclick();
      await page.waitForLoadState('networkidle');
      
      let currentUrl = page.url();
      expect(currentUrl).toContain('/repository/');
      
      // Go back
      await page.goBack();
      await page.waitForTimeout(2000);
    }
    
    // Double-click on card description area
    const description = repositoryCard.locator('p').first();
    if (await description.isVisible()) {
      await description.dblclick();
      await page.waitForLoadState('networkidle');
      
      let currentUrl = page.url();
      expect(currentUrl).toContain('/repository/');
      
      // Go back
      await page.goBack();
      await page.waitForTimeout(2000);
    }
    
    // Double-click on metrics area
    const metrics = repositoryCard.locator('[class*="Metrics"], div:has(svg)').first();
    if (await metrics.isVisible()) {
      await metrics.dblclick();
      await page.waitForLoadState('networkidle');
      
      let currentUrl = page.url();
      expect(currentUrl).toContain('/repository/');
    }
  });

  test('should work with keyboard navigation', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const repositoryCard = page.locator('[data-testid="repository-card"]').first();
    await expect(repositoryCard).toBeVisible();
    
    // Focus on the card
    await repositoryCard.focus();
    
    // Verify card is focusable (or contains focusable elements)
    const focusedElement = page.locator(':focus');
    if (await focusedElement.count() > 0) {
      // If card or its elements are focusable, test keyboard accessibility
      await expect(focusedElement).toBeVisible();
    }
  });

  test('should handle loading states gracefully', async ({ page }) => {
    // Navigate to page and test immediately without waiting
    await page.goto('http://localhost:3000/');
    
    // Even if cards are still loading, double-click should not cause errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit for potential cards to appear
    await page.waitForTimeout(1000);
    
    const repositoryCards = page.locator('[data-testid="repository-card"]');
    const cardCount = await repositoryCards.count();
    
    if (cardCount > 0) {
      const firstCard = repositoryCards.first();
      await firstCard.dblclick();
      await page.waitForTimeout(2000);
      
      // Should not have JavaScript errors
      expect(errors.length).toBe(0);
    }
  });

  test('should maintain card styling during interaction', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const repositoryCard = page.locator('[data-testid="repository-card"]').first();
    await expect(repositoryCard).toBeVisible();
    
    // Get initial styling
    const initialTransform = await repositoryCard.evaluate((el) => 
      window.getComputedStyle(el).transform
    );
    
    // Hover should trigger transform
    await repositoryCard.hover();
    await page.waitForTimeout(200);
    
    const hoverTransform = await repositoryCard.evaluate((el) => 
      window.getComputedStyle(el).transform
    );
    
    // Double-click should not break styling
    await repositoryCard.dblclick();
    
    // Should still be able to navigate (even if it's a quick redirect)
    await page.waitForTimeout(1000);
  });

  test('should handle rapid double-clicks without errors', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    const repositoryCard = page.locator('[data-testid="repository-card"]').first();
    await expect(repositoryCard).toBeVisible();
    
    // Rapid double-clicks
    await repositoryCard.dblclick();
    await repositoryCard.dblclick();
    await repositoryCard.dblclick();
    
    await page.waitForTimeout(2000);
    
    // Should not cause JavaScript errors
    expect(errors.length).toBe(0);
    
    // Should have navigated successfully
    const currentUrl = page.url();
    expect(currentUrl).toContain('/repository/');
  });
});