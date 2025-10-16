import { test, expect } from '@playwright/test';

test.describe('Debug Use Cases Data', () => {
  test('debug use cases data and rendering', async ({ page }) => {
    console.log('=== DEBUGGING USE CASES DATA ===');
    
    // Navigate to repository page
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/debug-use-cases-data.png', fullPage: true });
    
    console.log('1. Checking repository data in browser...');
    
    // Execute JavaScript in browser to inspect the actual data
    const repositoryData = await page.evaluate(() => {
      // Try to find the repository data in React DevTools or window
      return {
        windowVars: Object.keys(window).filter(key => key.includes('repo') || key.includes('data')),
        // Check if React DevTools shows anything
        reactFiber: window.document.querySelector('[data-reactroot]') ? 'React root found' : 'No React root'
      };
    });
    
    console.log('Repository data in window:', repositoryData);
    
    console.log('2. Looking specifically at Use Cases section DOM...');
    
    // Find the exact Use Cases section and extract all its content
    const useCasesSection = page.locator('h3:has-text("Use Cases & Applications")').locator('..');
    const useCasesSectionHTML = await useCasesSection.innerHTML();
    console.log('Use Cases Section HTML:');
    console.log(useCasesSectionHTML);
    
    // Look for all text content within the grid that should contain use cases
    const gridSelector = 'h3:has-text("Use Cases & Applications") ~ div';
    const gridExists = await page.locator(gridSelector).isVisible();
    console.log(`Grid after Use Cases header exists: ${gridExists}`);
    
    if (gridExists) {
      const gridContent = await page.locator(gridSelector).textContent();
      console.log('Grid content:', gridContent);
      
      // Look for individual use case items (should be <Text> components with Zap icons)
      const useCaseItems = page.locator(gridSelector).locator('div').filter({ hasText: /.+/ });
      const count = await useCaseItems.count();
      console.log(`Found ${count} items in use cases grid`);
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const itemText = await useCaseItems.nth(i).textContent();
        console.log(`  Use case ${i}: "${itemText}"`);
      }
    }
    
    console.log('3. Looking for specific use case text anywhere on page...');
    
    const specificUseCases = [
      'Property management companies',
      'Hotels optimizing',
      'Senior living facilities', 
      'University campus',
      'Manufacturing plants',
      'Healthcare facilities'
    ];
    
    for (const useCase of specificUseCases) {
      const found = await page.locator(`text=${useCase}`).isVisible();
      console.log(`"${useCase}" found on page: ${found}`);
      
      if (found) {
        const element = page.locator(`text=${useCase}`);
        const parentText = await element.locator('..').textContent();
        console.log(`  Full text: "${parentText}"`);
      }
    }
    
    console.log('=== END USE CASES DEBUG ===');
  });
});