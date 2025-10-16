import { test, expect } from '@playwright/test';

test.describe('Use Cases Section - Simple Test', () => {
  test('Check what Use Cases are currently displayed', async ({ page }) => {
    console.log('=== CHECKING CURRENT USE CASES CONTENT ===');
    
    // Navigate to repository page
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/current-use-cases.png', fullPage: true });
    
    console.log('1. Looking for Use Cases section...');
    const useCasesSection = page.locator('h3:has-text("Use Cases & Applications")');
    await expect(useCasesSection).toBeVisible();
    console.log('✓ Use Cases section header found');
    
    // Find the use cases container and log what's inside
    console.log('2. Extracting current use cases content...');
    const useCasesCard = page.locator('h3:has-text("Use Cases & Applications")').locator('..');
    const textContent = await useCasesCard.textContent();
    console.log('Use Cases Card Content:');
    console.log(textContent);
    
    // Look for any text elements that might contain use cases
    const useCaseItems = page.locator('h3:has-text("Use Cases & Applications")').locator('..').locator('p, div, span').filter({ hasText: /.+/ });
    const count = await useCaseItems.count();
    console.log(`Found ${count} potential use case items`);
    
    for (let i = 0; i < count; i++) {
      const text = await useCaseItems.nth(i).textContent();
      if (text && text.trim().length > 10) { // Filter out short/empty text
        console.log(`  Item ${i}: "${text.trim()}"`);
      }
    }
    
    // Try to find specific text patterns
    const hasPropertyManagement = await page.locator('text=Property management').isVisible();
    const hasHotel = await page.locator('text=Hotels').isVisible();  
    const hasGenericPlatform = await page.locator('text=platform').isVisible();
    
    console.log(`Has "Property management": ${hasPropertyManagement}`);
    console.log(`Has "Hotels": ${hasHotel}`);
    console.log(`Has generic "platform": ${hasGenericPlatform}`);
    
    console.log('=== END USE CASES CHECK ===');
  });
});