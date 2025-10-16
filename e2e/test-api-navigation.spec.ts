import { test, expect } from '@playwright/test';

test.describe('Test API Navigation', () => {
  test('Check API-related navigation from repository cards', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('1. Testing API Explorer navigation...');
    // Find future-mobility-consumer-platform card
    const consumerCard = await page.locator('text="future-mobility-consumer-platform"').locator('..').locator('..');
    
    // Click APIs button
    const apisButton = await consumerCard.locator('text="APIs"');
    const apisHref = await apisButton.getAttribute('href');
    console.log('   APIs button href:', apisHref);
    
    await apisButton.click();
    await page.waitForTimeout(2000);
    
    let currentUrl = page.url();
    console.log('   Navigated to:', currentUrl);
    
    // Check if API explorer loaded
    const hasApiExplorer = await page.locator('text="API Explorer", text="API Documentation"').count();
    console.log('   API Explorer elements found:', hasApiExplorer);
    
    // Go back to homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('\n2. Testing Postman navigation...');
    const postmanButton = await consumerCard.locator('text="Postman"');
    const postmanHref = await postmanButton.getAttribute('href');
    console.log('   Postman button href:', postmanHref);
    
    await postmanButton.click();
    await page.waitForTimeout(2000);
    
    currentUrl = page.url();
    console.log('   Navigated to:', currentUrl);
    
    // Check if Postman view loaded
    const hasPostmanContent = await page.locator('text="Postman Collection", text="Collection"').count();
    console.log('   Postman elements found:', hasPostmanContent);
    
    // Take screenshot of current state
    await page.screenshot({ path: 'test-results/postman-view-current.png', fullPage: true });
    
    // Check for errors
    const errorCount = await page.locator('text="Error", text="404"').count();
    console.log('   Error messages:', errorCount);
  });
});