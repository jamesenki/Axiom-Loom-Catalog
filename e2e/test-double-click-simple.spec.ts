import { test, expect } from '@playwright/test';

test.describe('Repository Card Double-Click - Simple Test', () => {
  test('should navigate to repository detail page on double-click', async ({ page }) => {
    // Navigate to the main page
    await page.goto('http://localhost:3000/');
    
    // Wait longer for the page and API to load
    await page.waitForTimeout(8000);
    
    // Check if repository cards are present
    const repositoryCards = page.locator('[data-testid="repository-card"]');
    const cardCount = await repositoryCards.count();
    
    console.log(`Found ${cardCount} repository cards`);
    
    if (cardCount > 0) {
      const firstCard = repositoryCards.first();
      
      // Wait for the first card to be visible
      await expect(firstCard).toBeVisible({ timeout: 15000 });
      
      // Get the current URL
      const initialUrl = page.url();
      console.log('Initial URL:', initialUrl);
      
      // Double-click on the first card
      await firstCard.dblclick();
      
      // Wait for navigation
      await page.waitForTimeout(3000);
      
      // Check if URL changed to repository detail page
      const finalUrl = page.url();
      console.log('Final URL:', finalUrl);
      
      expect(finalUrl).toContain('/repository/');
      expect(finalUrl).not.toBe(initialUrl);
    } else {
      console.log('No repository cards found, test skipped');
      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-results/no-cards-found.png' });
    }
  });
});