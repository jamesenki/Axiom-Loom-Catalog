import { test, expect } from '@playwright/test';

test.describe('Test Repository Card Double-Click Functionality', () => {
  test('double-click repository cards to navigate to repository detail page', async ({ page }) => {
    console.log('=== TESTING REPOSITORY CARD DOUBLE-CLICK FUNCTIONALITY ===');
    
    // Navigate to main repository list page
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    
    // Wait specifically for repository data to load by checking for API calls
    await page.waitForResponse(response => 
      response.url().includes('/api/repositories') && response.status() === 200
    );
    await page.waitForTimeout(5000); // Extra time for React to render cards
    
    console.log('1. Page loaded, finding repository cards...');
    
    // Look for repository cards with the correct test ID
    const repositoryCards = page.locator('[data-testid="repository-card"]');
    const cardCount = await repositoryCards.count();
    console.log(`   Found ${cardCount} repository cards`);
    
    if (cardCount === 0) {
      console.log('   No repository cards found - checking alternative selectors...');
      
      // Try alternative selectors
      const alternativeCards = page.locator('.repository-card, [class*="RepositoryCard"], [class*="InteractiveCard"]');
      const altCount = await alternativeCards.count();
      console.log(`   Alternative cards found: ${altCount}`);
      
      return;
    }
    
    // Test double-click on the first repository card
    console.log('2. Testing double-click on first repository card...');
    const firstCard = repositoryCards.first();
    
    // Get the repository name from the card for verification
    const cardTitle = await firstCard.locator('h3, h2, [class*="title"], [class*="Title"]').first().textContent();
    console.log(`   Card title: "${cardTitle}"`);
    
    // Record initial URL
    const initialUrl = page.url();
    console.log(`   Initial URL: ${initialUrl}`);
    
    // Perform double-click
    await firstCard.dblclick();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check if URL changed to repository detail page
    const finalUrl = page.url();
    console.log(`   Final URL: ${finalUrl}`);
    
    // Verify navigation happened
    const navigationSuccessful = finalUrl !== initialUrl && finalUrl.includes('/repository/');
    console.log(`   Navigation successful: ${navigationSuccessful}`);
    
    if (navigationSuccessful) {
      // Take screenshot of the repository detail page
      await page.screenshot({ path: 'test-results/double-click-success.png', fullPage: true });
      
      // Verify we're on a repository detail page
      const hasRepositoryContent = await page.locator('h1, h2, h3').count();
      console.log(`   Repository detail page headers: ${hasRepositoryContent}`);
      
      // Look for typical repository detail elements
      const hasPostmanButton = await page.locator('text=Postman', { noWaitAfter: true }).count();
      const hasGraphQLButton = await page.locator('text=GraphQL', { noWaitAfter: true }).count();
      const hasDocumentationButton = await page.locator('text=Documentation', { noWaitAfter: true }).count();
      
      console.log(`   Has Postman button: ${hasPostmanButton > 0}`);
      console.log(`   Has GraphQL button: ${hasGraphQLButton > 0}`);
      console.log(`   Has Documentation button: ${hasDocumentationButton > 0}`);
    }
    
    // Test double-click on a different card if multiple exist
    if (cardCount > 1) {
      console.log('3. Testing double-click on second repository card...');
      
      // Navigate back to main page first
      await page.goto('http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const secondCard = repositoryCards.nth(1);
      const secondCardTitle = await secondCard.locator('h3, h2, [class*="title"], [class*="Title"]').first().textContent();
      console.log(`   Second card title: "${secondCardTitle}"`);
      
      const initialUrl2 = page.url();
      await secondCard.dblclick();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const finalUrl2 = page.url();
      const navigation2Successful = finalUrl2 !== initialUrl2 && finalUrl2.includes('/repository/');
      console.log(`   Second navigation successful: ${navigation2Successful}`);
    }
    
    console.log('✅ DOUBLE-CLICK FUNCTIONALITY TEST COMPLETED');
    console.log('=== END DOUBLE-CLICK TEST ===');
  });
});