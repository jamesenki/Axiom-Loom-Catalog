import { test, expect } from '@playwright/test';

test.describe('Final Deployment Test', () => {
  test('Verify deployed application works', async ({ page }) => {
    // Override baseURL for this test to use deployed version
    await page.goto('http://localhost/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if we're on login page
    const isLoginPage = await page.locator('text=Local Authentication').isVisible();
    if (isLoginPage) {
      console.log('Login required - logging in as admin');
      // Clear and fill email
      const emailInput = page.locator('input[name="email"]');
      await emailInput.clear();
      await emailInput.fill('admin@localhost');
      
      // Fill password
      await page.fill('input[name="password"]', 'admin');
      
      // Click login
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/deployed-app.png', fullPage: true });
    
    // Check title
    const title = await page.title();
    expect(title).toContain('EYNS');
    
    // Check repository cards are visible
    const repoCards = await page.locator('[data-testid="repository-card"]').count();
    console.log(`Repository cards found: ${repoCards}`);
    expect(repoCards).toBeGreaterThan(0);
    
    // Check navigation is visible
    const navVisible = await page.locator('nav').isVisible();
    expect(navVisible).toBe(true);
    
    // Check no error messages
    const errorText = await page.textContent('body');
    expect(errorText).not.toContain('styled-components');
    expect(errorText).not.toContain('bTrirp');
    expect(errorText).not.toContain('Error Loading');
    
    // Click on a repository card
    await page.locator('[data-testid="repository-card"]').first().click();
    await page.waitForTimeout(2000);
    
    // Verify navigation worked
    const urlAfterClick = page.url();
    console.log('URL after clicking card:', urlAfterClick);
    expect(urlAfterClick).toContain('/repository/');
    
    // No errors on detail page
    const detailPageText = await page.textContent('body');
    expect(detailPageText).not.toContain('Error');
    
    console.log('✅ DEPLOYED APPLICATION IS WORKING!');
  });
});