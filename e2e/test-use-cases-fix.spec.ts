import { test, expect } from '@playwright/test';

test.describe('Use Cases Section - Fixed Test', () => {
  test('Use Cases should display real-world applications', async ({ page }) => {
    console.log('=== TESTING USE CASES SECTION FIX ===');
    
    // Navigate to repository page
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await page.screenshot({ path: 'test-results/use-cases-section.png', fullPage: true });
    
    console.log('1. Looking for Use Cases section...');
    const useCasesSection = page.locator('h3:has-text("Use Cases & Applications")');
    await expect(useCasesSection).toBeVisible();
    console.log('✓ Use Cases section header found');
    
    // Check if real-world use cases are displayed (not generic ones like "platform", "architecture")
    console.log('2. Checking for real-world use cases...');
    
    // These are the specific use cases we added
    const expectedUseCases = [
      'Property management companies monitoring 1000+ water heaters',
      'Hotels optimizing energy consumption',  
      'Senior living facilities ensuring reliable hot water',
      'University campus facilities managing dormitory',
      'Manufacturing plants with industrial water heating',
      'Healthcare facilities maintaining critical hot water',
      'Retail chains coordinating water heater maintenance',
      'Municipal buildings reducing energy costs'
    ];
    
    // Check that at least some real-world use cases are visible
    let foundUseCases = 0;
    for (const useCase of expectedUseCases) {
      const useCaseText = page.locator(`text*="${useCase}"`);
      if (await useCaseText.isVisible()) {
        foundUseCases++;
        console.log(`✓ Found real-world use case: "${useCase}"`);
      }
    }
    
    console.log(`Found ${foundUseCases} out of ${expectedUseCases.length} expected use cases`);
    
    // Should find at least 3 real-world use cases (to allow for partial matches)
    expect(foundUseCases).toBeGreaterThanOrEqual(3);
    
    // Verify we don't see generic/useless use cases like just "platform" or "architecture"
    console.log('3. Checking that generic use cases are not displayed...');
    const genericUseCase1 = page.locator('text="platform"').first();
    const genericUseCase2 = page.locator('text="architecture"').first();
    
    // These might exist elsewhere on the page, so we'll check that they're not the main use case content
    const useCasesCard = page.locator('h3:has-text("Use Cases & Applications")').locator('..');
    const hasOnlyGeneric = await useCasesCard.locator('text="platform"').isVisible() && 
                           await useCasesCard.locator('text="architecture"').isVisible();
    
    if (hasOnlyGeneric) {
      console.log('❌ Still showing generic use cases like "platform" and "architecture"');
      expect(hasOnlyGeneric).toBeFalsy();
    } else {
      console.log('✓ No generic-only use cases found in Use Cases section');
    }
    
    console.log('✅ USE CASES SECTION TEST PASSED!');
  });
});