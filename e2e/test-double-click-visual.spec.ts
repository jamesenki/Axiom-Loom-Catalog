import { test, expect } from '@playwright/test';

test.describe('Repository Card Double-Click Visual Test', () => {
  test('find cards visually and test double-click functionality', async ({ page }) => {
    console.log('=== TESTING REPOSITORY CARD DOUBLE-CLICK VISUAL ===');
    
    // Navigate to main repository list page
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(8000); // Give plenty of time for loading
    
    console.log('1. Page loaded, looking for cards visually...');
    
    // Take screenshot to see what's on the page
    await page.screenshot({ path: 'test-results/cards-visual-test.png', fullPage: true });
    
    // Look for cards by finding text that should be in repository cards
    const cardTitles = [
      'AI Predictive Maintenance Architecture',
      'Water Heater Fleet Platform', 
      'Axiom Loom IoT Core'
    ];
    
    for (const title of cardTitles) {
      console.log(`2. Testing double-click on "${title}" card...`);
      
      // Find the card by its title text
      const titleElement = page.locator(`text="${title}"`);
      const titleCount = await titleElement.count();
      console.log(`   Found ${titleCount} elements with title "${title}"`);
      
      if (titleCount > 0) {
        // Get the parent card element (likely a div containing the title)
        const cardElement = titleElement.locator('..').locator('..'); // Go up to card container
        
        const initialUrl = page.url();
        console.log(`   Initial URL: ${initialUrl}`);
        
        // Test double-click on the card area
        await cardElement.dblclick();
        await page.waitForTimeout(3000); // Wait for navigation
        
        const finalUrl = page.url();
        console.log(`   Final URL: ${finalUrl}`);
        
        const navigationOccurred = finalUrl !== initialUrl && finalUrl.includes('/repository/');
        console.log(`   Navigation occurred: ${navigationOccurred}`);
        
        if (navigationOccurred) {
          console.log(`✅ DOUBLE-CLICK WORKING for "${title}"!`);
          await page.screenshot({ path: `test-results/double-click-${title.replace(/[^a-zA-Z0-9]/g, '-')}.png`, fullPage: true });
          
          // Go back to test the next card
          await page.goBack();
          await page.waitForTimeout(2000);
        } else {
          console.log(`❌ Double-click failed for "${title}"`);
          
          // Try clicking on different parts of the card
          console.log(`   Trying alternative selectors...`);
          
          // Try clicking on the title itself
          await titleElement.first().dblclick();
          await page.waitForTimeout(2000);
          
          const altFinalUrl = page.url();
          const altNavigation = altFinalUrl !== initialUrl && altFinalUrl.includes('/repository/');
          console.log(`   Title double-click navigation: ${altNavigation}`);
          
          if (altNavigation) {
            console.log(`✅ TITLE DOUBLE-CLICK WORKING for "${title}"!`);
            await page.goBack();
            await page.waitForTimeout(2000);
          }
        }
      }
    }
    
    console.log('=== END VISUAL DOUBLE-CLICK TEST ===');
  });
});