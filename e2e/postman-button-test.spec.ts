import { test, expect } from '@playwright/test';

test.describe('Postman Button Visibility Tests', () => {
  test('All repos with Postman collections show Postman button', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Wait for cards to load
    await page.waitForSelector('[class*="card"]', { timeout: 10000 });
    
    // Expected repos with Postman collections
    const reposWithPostman = [
      'future-mobility-consumer-platform',
      'future-mobility-fleet-platform', 
      'future-mobility-oems-platform',
      'future-mobility-regulatory-platform',
      'future-mobility-tech-platform',
      'future-mobility-utilities-platform',
      'nslabsdashboards',
      'rentalFleets',
      'sovd-diagnostic-ecosystem-platform-architecture'
    ];
    
    // Check each repo has a Postman button
    for (const repo of reposWithPostman) {
      console.log(`Checking ${repo} for Postman button...`);
      
      // Find the card containing this repo name
      const card = page.locator(`[class*="card"]`).filter({ hasText: repo });
      
      // Check if Postman button exists within this card
      const postmanButton = card.locator('text=Postman');
      const buttonCount = await postmanButton.count();
      
      console.log(`${repo}: Found ${buttonCount} Postman button(s)`);
      expect(buttonCount).toBeGreaterThan(0);
    }
  });
});