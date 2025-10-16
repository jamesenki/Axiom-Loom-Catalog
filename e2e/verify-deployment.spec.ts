import { test, expect } from '@playwright/test';

test.describe('Deployment Verification', () => {
  test('homepage loads and shows content', async ({ page }) => {
    // Go to the homepage
    await page.goto('http://localhost');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the title is correct
    await expect(page).toHaveTitle('EYNS AI Experience Center');
    
    // Check if the main content is visible
    const appContent = await page.locator('#root').textContent();
    console.log('App content:', appContent);
    
    // Take a screenshot
    await page.screenshot({ path: 'homepage-screenshot.png' });
    
    // Check for any console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
    
    // Check if key elements are present
    const header = await page.locator('header').isVisible().catch(() => false);
    console.log('Header visible:', header);
    
    // Check if there's actual content or just a blank page
    const bodyText = await page.locator('body').innerText();
    console.log('Body text length:', bodyText.length);
    expect(bodyText.length).toBeGreaterThan(0);
  });
  
  test('check for JavaScript errors and blank page', async ({ page }) => {
    const errors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Capture page errors
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('http://localhost');
    await page.waitForTimeout(3000); // Wait 3 seconds for any errors
    
    // Log all errors found
    if (errors.length > 0) {
      console.log('JavaScript errors found:');
      errors.forEach(err => console.log(' -', err));
    }
    
    // Check if the React app mounted
    const reactRoot = await page.locator('#root > *').count();
    console.log('React root children count:', reactRoot);
    expect(reactRoot).toBeGreaterThan(0);
  });
  
  test('API endpoints are accessible', async ({ page }) => {
    // Test the API health endpoint
    const apiResponse = await page.request.get('http://localhost:3001/api/health');
    console.log('API health status:', apiResponse.status());
    console.log('API health response:', await apiResponse.text());
    
    // Test repositories endpoint
    const reposResponse = await page.request.get('http://localhost:3001/api/repositories');
    console.log('Repositories API status:', reposResponse.status());
  });
});