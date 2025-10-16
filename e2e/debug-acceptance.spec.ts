import { test, expect } from '@playwright/test';

test.describe('Debug Acceptance Tests', () => {
  test('Check what is actually rendering', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'debug-homepage.png', fullPage: true });
    
    // Log all text content
    const allText = await page.textContent('body');
    console.log('Page text content:', allText);
    
    // Check for repository cards using various selectors
    const cards1 = await page.locator('.repository-card').count();
    console.log('Found .repository-card:', cards1);
    
    const cards2 = await page.locator('[class*="card"]').count();
    console.log('Found elements with "card" in class:', cards2);
    
    const cards3 = await page.locator('article').count();
    console.log('Found article elements:', cards3);
    
    // Check for specific repository names
    const fleetPlatform = await page.locator('text=future-mobility-fleet-platform').count();
    console.log('Found "future-mobility-fleet-platform":', fleetPlatform);
    
    // Check for buttons
    const buttons = await page.locator('button').count();
    console.log('Found buttons:', buttons);
    
    // Get all button texts
    const buttonTexts = await page.locator('button').allTextContents();
    console.log('Button texts:', buttonTexts);
  });
});