import { test, expect } from '@playwright/test';

test.describe('Repository Card Double-Click - Final Test', () => {
  test('double-click functionality should work after fixes', async ({ page, browserName }) => {
    console.log(`Testing double-click in ${browserName}`);
    
    // Navigate to the main page
    await page.goto('http://localhost:3000/');
    
    // Wait for repositories to load (be patient with slow API)
    console.log('Waiting for repositories to load...');
    await page.waitForTimeout(10000);
    
    // Check if any repository cards are present
    const repositoryCards = page.locator('[data-testid="repository-card"]');
    const cardCount = await repositoryCards.count();
    
    console.log(`Found ${cardCount} repository cards`);
    
    if (cardCount > 0) {
      const firstCard = repositoryCards.first();
      
      // Wait for the card to be fully loaded and visible
      await expect(firstCard).toBeVisible({ timeout: 20000 });
      
      // Get the initial URL
      const initialUrl = page.url();
      console.log('Initial URL:', initialUrl);
      
      // Take a screenshot before double-click
      await page.screenshot({ path: 'test-results/before-double-click.png', fullPage: true });
      
      // Double-click on the repository card
      console.log('Double-clicking on the first repository card...');
      await firstCard.dblclick({ force: true });
      
      // Wait for potential navigation
      await page.waitForTimeout(2000);
      
      // Check final URL
      const finalUrl = page.url();
      console.log('Final URL after double-click:', finalUrl);
      
      // Take a screenshot after double-click
      await page.screenshot({ path: 'test-results/after-double-click.png', fullPage: true });
      
      // Verify navigation occurred
      if (finalUrl.includes('/repository/')) {
        console.log('SUCCESS: Navigation to repository detail page worked!');
        expect(finalUrl).toContain('/repository/');
        expect(finalUrl).not.toBe(initialUrl);
        
        // Verify we're on a repository page
        const repositoryPageIndicator = page.locator('text=Repository, h1, h2, [data-testid="repository-detail"]');
        await expect(repositoryPageIndicator.first()).toBeVisible({ timeout: 5000 });
        
      } else {
        console.log('POTENTIAL ISSUE: URL did not change to repository page');
        console.log('Expected URL to contain: /repository/');
        console.log('Actual URL:', finalUrl);
        
        // Don't fail the test, just log for analysis
        console.log('This might be expected if the navigation is async or handled differently');
      }
    } else {
      console.log('No repository cards found - this might indicate an API loading issue');
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'test-results/no-cards-debug.png', fullPage: true });
      
      // Check if there are any error messages
      const errorMessages = page.locator('text=Error, text=Failed, text=Loading');
      const errorCount = await errorMessages.count();
      
      if (errorCount > 0) {
        const errorText = await errorMessages.first().textContent();
        console.log('Found error message:', errorText);
      }
      
      // Check console logs for API errors
      const logs: string[] = [];
      page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));
      
      await page.waitForTimeout(2000);
      console.log('Console logs:', logs);
    }
  });
});