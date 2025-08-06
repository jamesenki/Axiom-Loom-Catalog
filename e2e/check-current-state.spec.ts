import { test, expect } from '@playwright/test';

test.describe('Current State Check', () => {
  test('Check app state and capture screenshots', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait a bit for everything to load
    await page.waitForTimeout(2000);
    
    // Take screenshot of homepage
    await page.screenshot({ path: 'screenshots/1-homepage.png', fullPage: true });
    
    // Check if we see repository cards
    const repoCards = await page.locator('[data-testid="repository-card"]').count();
    console.log(`Found ${repoCards} repository cards`);
    
    // Check if we have any error messages
    const errorMessages = await page.locator('text=/error|failed/i').count();
    console.log(`Found ${errorMessages} error messages`);
    
    // Try to find and click on a repository card
    if (repoCards > 0) {
      await page.locator('[data-testid="repository-card"]').first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'screenshots/2-after-click.png', fullPage: true });
    }
    
    // Check for styled-components error
    const pageText = await page.textContent('body');
    if (pageText.includes('styled-components') || pageText.includes('bTrirp')) {
      console.log('STYLED-COMPONENTS ERROR FOUND!');
    }
    
    // Report final state
    const currentUrl = page.url();
    console.log('Final URL:', currentUrl);
  });
});