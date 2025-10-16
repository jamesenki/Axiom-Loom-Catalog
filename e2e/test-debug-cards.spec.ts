import { test, expect } from '@playwright/test';

test.describe('Debug Repository Cards', () => {
  test('inspect card DOM structure and attributes', async ({ page }) => {
    console.log('=== DEBUGGING REPOSITORY CARD STRUCTURE ===');
    
    // Navigate to main repository list page
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(8000);
    
    console.log('1. Inspecting DOM structure...');
    
    // Look for the title element and inspect its parents
    const titleElement = page.locator('text="AI Predictive Maintenance Architecture"').first();
    
    // Get all parent elements and their attributes
    console.log('2. Checking parent elements...');
    
    // Check if title element exists
    const titleExists = await titleElement.count();
    console.log(`   Title element exists: ${titleExists > 0}`);
    
    if (titleExists > 0) {
      // Get the parent card structure
      const immediateParent = titleElement.locator('..');
      const grandParent = immediateParent.locator('..');
      const greatGrandParent = grandParent.locator('..');
      
      // Check for data-testid attributes at different levels
      const parentTestId = await immediateParent.getAttribute('data-testid');
      const grandParentTestId = await grandParent.getAttribute('data-testid');
      const greatGrandParentTestId = await greatGrandParent.getAttribute('data-testid');
      
      console.log(`   Immediate parent data-testid: ${parentTestId}`);
      console.log(`   Grandparent data-testid: ${grandParentTestId}`);
      console.log(`   Great-grandparent data-testid: ${greatGrandParentTestId}`);
      
      // Check for class names that might indicate card elements
      const parentClass = await immediateParent.getAttribute('class');
      const grandParentClass = await grandParent.getAttribute('class');
      const greatGrandParentClass = await greatGrandParent.getAttribute('class');
      
      console.log(`   Immediate parent class: ${parentClass}`);
      console.log(`   Grandparent class: ${grandParentClass}`);
      console.log(`   Great-grandparent class: ${greatGrandParentClass}`);
      
      // Try to find elements with data-testid="repository-card"
      const testIdElements = page.locator('[data-testid="repository-card"]');
      const testIdCount = await testIdElements.count();
      console.log(`   Elements with data-testid="repository-card": ${testIdCount}`);
      
      // Look for elements with "card" in their class names
      const cardClassElements = page.locator('[class*="card" i]');
      const cardClassCount = await cardClassElements.count();
      console.log(`   Elements with "card" in class: ${cardClassCount}`);
      
      // Look for InteractiveCard styled component class
      const interactiveCardElements = page.locator('[class*="InteractiveCard" i]');
      const interactiveCardCount = await interactiveCardElements.count();
      console.log(`   Elements with "InteractiveCard" in class: ${interactiveCardCount}`);
      
      // Try to find the actual clickable card container
      const cardContainers = page.locator('div').filter({ 
        has: page.locator('text="AI Predictive Maintenance Architecture"')
      });
      const containerCount = await cardContainers.count();
      console.log(`   Div containers with the title: ${containerCount}`);
      
      // Test if any of these containers have onDoubleClick
      if (containerCount > 0) {
        console.log('3. Testing different container levels for double-click...');
        
        for (let i = 0; i < Math.min(containerCount, 3); i++) {
          const container = cardContainers.nth(i);
          const containerClass = await container.getAttribute('class');
          const containerTestId = await container.getAttribute('data-testid');
          
          console.log(`   Container ${i}: class="${containerClass}", testid="${containerTestId}"`);
          
          // Test double-click on this container
          const initialUrl = page.url();
          try {
            await container.dblclick({ timeout: 2000 });
            await page.waitForTimeout(1000);
            const finalUrl = page.url();
            
            if (finalUrl !== initialUrl) {
              console.log(`   ✅ Container ${i} responds to double-click! Navigation to: ${finalUrl}`);
              await page.goBack();
              await page.waitForTimeout(1000);
            } else {
              console.log(`   ❌ Container ${i} does not respond to double-click`);
            }
          } catch (e) {
            console.log(`   ❌ Container ${i} double-click failed: ${e}`);
          }
        }
      }
    }
    
    console.log('=== END CARD STRUCTURE DEBUG ===');
  });
});