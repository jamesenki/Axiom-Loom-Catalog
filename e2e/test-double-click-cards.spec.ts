import { test, expect } from '@playwright/test';

test.describe('Test Repository Card Double-Click', () => {
  test('find repository cards and test double-click functionality', async ({ page }) => {
    console.log('=== TESTING REPOSITORY CARD DOUBLE-CLICK ===');
    
    // Navigate to main repository list page
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Extra time for loading
    
    console.log('1. Page loaded, searching for repository cards...');
    
    // Look for various types of cards/repository elements
    const cardSelectors = [
      '[class*="card"]',
      '[class*="repository"]', 
      '[data-testid*="card"]',
      '[data-testid*="repository"]',
      '.glass-card',
      '.repository-item',
      '.repo-card'
    ];
    
    let totalCards = 0;
    for (const selector of cardSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      console.log(`   ${selector}: ${count} elements`);
      totalCards += count;
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/repository-cards-main.png', fullPage: true });
    
    // Look for clickable elements that might be repository items
    const clickableElements = page.locator('a, button, [role="button"], [onclick], [class*="clickable"]');
    const clickableCount = await clickableElements.count();
    console.log(`   Total clickable elements: ${clickableCount}`);
    
    // Look for text indicating repositories
    const hasRepoText = await page.locator('text=repository', { noWaitAfter: true }).count();
    const hasAxiomText = await page.locator('text=axiom', { noWaitAfter: true }).count(); 
    const hasFleetText = await page.locator('text=fleet', { noWaitAfter: true }).count();
    
    console.log(`   Elements containing "repository": ${hasRepoText}`);
    console.log(`   Elements containing "axiom": ${hasAxiomText}`);  
    console.log(`   Elements containing "fleet": ${hasFleetText}`);
    
    // Check current URL and title
    console.log(`   Current URL: ${page.url()}`);
    const title = await page.title();
    console.log(`   Page title: "${title}"`);
    
    // Look for specific content
    const hasHeaderText = await page.locator('h1, h2, h3').count();
    console.log(`   Headers found: ${hasHeaderText}`);
    
    if (hasHeaderText > 0) {
      for (let i = 0; i < Math.min(hasHeaderText, 5); i++) {
        const headerText = await page.locator('h1, h2, h3').nth(i).textContent();
        console.log(`     Header ${i + 1}: "${headerText}"`);
      }
    }
    
    console.log('=== END CARD SEARCH TEST ===');
  });
});