import { test, expect } from '@playwright/test';

test.describe('API Explorer Current State', () => {
  test('check what API Explorer currently shows', async ({ page }) => {
    console.log('=== TESTING API EXPLORER CURRENT STATE ===');
    
    // Navigate to repository page
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('1. Looking for API Explorer button...');
    const apiExplorerButton = page.locator('button:has-text("API Explorer"), a:has-text("API Explorer")');
    await expect(apiExplorerButton).toBeVisible();
    
    // Take screenshot before clicking
    await page.screenshot({ path: 'test-results/before-api-explorer-click.png', fullPage: true });
    
    console.log('2. Clicking API Explorer button...');
    await apiExplorerButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Give time for API calls
    
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);
    
    // Take screenshot of API Explorer page
    await page.screenshot({ path: 'test-results/api-explorer-current-state.png', fullPage: true });
    
    console.log('3. Checking for API cards...');
    
    // Look for any mentions of axiom.json
    const axiomJsonMentions = await page.locator('text=axiom.json').count();
    console.log(`   "axiom.json" mentions: ${axiomJsonMentions}`);
    
    if (axiomJsonMentions > 0) {
      console.log('   ❌ ISSUE CONFIRMED: axiom.json is being displayed as API card title');
    }
    
    // Look for any API cards
    const apiCards = page.locator('[data-type], div[class*="card"]').filter({ hasText: /./ });
    const cardCount = await apiCards.count();
    console.log(`   Total potential API cards: ${cardCount}`);
    
    for (let i = 0; i < Math.min(cardCount, 5); i++) {
      const card = apiCards.nth(i);
      const cardText = await card.textContent();
      if (cardText && cardText.length > 10) { // Filter meaningful content
        console.log(`     Card ${i}: "${cardText.trim().substring(0, 100)}..."`);
      }
    }
    
    // Look for specific API types
    const hasGraphQL = await page.locator('text=GraphQL').isVisible();
    const hasOpenAPI = await page.locator('text=OpenAPI').isVisible();
    const hasSwagger = await page.locator('text=Swagger').isVisible();
    const hasREST = await page.locator('text=REST').isVisible();
    
    console.log(`   Has GraphQL: ${hasGraphQL}`);
    console.log(`   Has OpenAPI: ${hasOpenAPI}`);
    console.log(`   Has Swagger: ${hasSwagger}`);
    console.log(`   Has REST: ${hasREST}`);
    
    // Check if cards are clickable
    if (cardCount > 0) {
      console.log('4. Testing first card click...');
      const firstCard = apiCards.nth(0);
      const beforeClickUrl = page.url();
      
      try {
        await firstCard.click();
        await page.waitForTimeout(3000);
        const afterClickUrl = page.url();
        
        console.log(`     Before click: ${beforeClickUrl}`);
        console.log(`     After click: ${afterClickUrl}`);
        
        if (afterClickUrl === 'http://localhost:3000/' || afterClickUrl === 'http://localhost:3000') {
          console.log('     ❌ ISSUE CONFIRMED: Card click navigates to home page');
        } else if (afterClickUrl !== beforeClickUrl) {
          console.log('     ✅ Card click navigated successfully');
        } else {
          console.log('     ⚠️  Card click did not navigate');
        }
        
      } catch (error) {
        console.log(`     ❌ Error clicking card: ${error}`);
      }
    }
    
    console.log('=== END API EXPLORER TEST ===');
  });
});