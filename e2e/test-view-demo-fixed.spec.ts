import { test, expect } from '@playwright/test';

test.describe('View Demo Button - Fixed Test', () => {
  test('View Demo button should navigate to demo coming soon page', async ({ page }) => {
    console.log('=== TESTING VIEW DEMO NAVIGATION FIX ===');
    
    // Navigate to repository page
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('1. Looking for View Demo button...');
    const viewDemoButton = page.locator('a[href*="/coming-soon/demo/"]');
    await expect(viewDemoButton).toBeVisible();
    
    const href = await viewDemoButton.getAttribute('href');
    console.log(`   Button href: ${href}`);
    
    // Get initial URL
    const initialUrl = page.url();
    console.log(`   Initial URL: ${initialUrl}`);
    
    // Click the View Demo button
    console.log('2. Clicking View Demo button...');
    await viewDemoButton.click();
    await page.waitForTimeout(3000);
    
    // Check if navigation happened
    const finalUrl = page.url();
    console.log(`   Final URL: ${finalUrl}`);
    
    // Should navigate to demo coming soon page
    expect(finalUrl).toContain('/coming-soon/demo/appliances-co-water-heater-platform');
    
    // Check page content
    console.log('3. Verifying page content...');
    await expect(page.locator('h1:has-text("Live Demo Coming Soon")')).toBeVisible();
    await expect(page.locator('text=Interactive Platform Preview in Development')).toBeVisible();
    await expect(page.locator('text=Interactive Demo in Development')).toBeVisible();
    
    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/view-demo-fixed.png', fullPage: true });
    
    console.log('✅ VIEW DEMO NAVIGATION TEST PASSED!');
  });
  
  test('Direct navigation to demo coming soon page works', async ({ page }) => {
    console.log('=== TESTING DIRECT DEMO NAVIGATION ===');
    
    // Navigate directly to demo coming soon page
    await page.goto('http://localhost:3000/coming-soon/demo/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check page content
    await expect(page.locator('h1:has-text("Live Demo Coming Soon")')).toBeVisible();
    await expect(page.locator('text=Interactive Platform Preview in Development')).toBeVisible();
    
    // Check specific demo features
    await expect(page.locator('text=Interactive Dashboard')).toBeVisible();
    await expect(page.locator('text=Predictive Analytics')).toBeVisible();
    await expect(page.locator('text=Live Simulation')).toBeVisible();
    
    console.log('✅ DIRECT DEMO NAVIGATION TEST PASSED!');
  });
});