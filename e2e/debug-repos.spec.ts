import { test, expect } from '@playwright/test';

test.describe('Debug Repository Loading', () => {
  test('Check repository loading', async ({ page }) => {
    // Listen for console messages
    page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
    
    // Listen for network requests
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log('REQUEST:', request.method(), request.url());
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log('RESPONSE:', response.status(), response.url());
      }
    });
    
    // Navigate to the page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Wait a bit for everything to load
    await page.waitForTimeout(3000);
    
    // Check for repository cards using various selectors
    const cards1 = await page.locator('.repository-card').count();
    const cards2 = await page.locator('[class*="Card"]').count();
    const cards3 = await page.locator('div').filter({ hasText: /copilot-architecture-template/i }).count();
    const cards4 = await page.locator('[data-testid="repository-card"]').count();
    
    console.log('Repository cards found (.repository-card):', cards1);
    console.log('Cards found ([class*="Card"]):', cards2);
    console.log('Divs with repo text:', cards3);
    console.log('Cards with data-testid:', cards4);
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-repos.png', fullPage: true });
    
    // Check the page content
    const content = await page.content();
    console.log('Page contains "Add Repository":', content.includes('Add Repository'));
    console.log('Page contains "EYNS":', content.includes('EYNS'));
    
    // Check for specific elements
    const addRepoButton = await page.locator('button:has-text("Add Repository")').isVisible();
    console.log('Add Repository button visible:', addRepoButton);
    
    // Look for any error messages
    const errors = await page.locator('.error, [class*="error"]').count();
    console.log('Error elements found:', errors);
  });
});