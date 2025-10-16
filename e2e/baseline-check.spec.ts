import { test, expect } from '@playwright/test';

test.describe('Baseline Check - Current State', () => {
  test('Check homepage and basic navigation', async ({ page }) => {
    console.log('1. Testing homepage...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take homepage screenshot
    await page.screenshot({ path: 'test-results/baseline-homepage.png', fullPage: true });
    
    // Check if homepage loads
    const title = await page.title();
    console.log('   Page title:', title);
    
    // Check if repositories are displayed
    const repoCards = await page.locator('[data-testid="repository-card"]').count();
    console.log('   Repository cards found:', repoCards);
    
    // Click on first repository
    if (repoCards > 0) {
      console.log('2. Testing repository detail page...');
      await page.locator('[data-testid="repository-card"]').first().click();
      await page.waitForTimeout(2000);
      
      // Take repository page screenshot
      await page.screenshot({ path: 'test-results/baseline-repo-detail.png', fullPage: true });
      
      // Check current URL
      console.log('   Current URL:', page.url());
      
      // Check for API/documentation links
      const apiLinks = await page.locator('a[href*="api"]').count();
      console.log('   API-related links found:', apiLinks);
      
      // Check for documentation section
      const docsLink = await page.locator('a:has-text("Documentation")').first();
      if (await docsLink.isVisible()) {
        console.log('3. Testing documentation page...');
        await docsLink.click();
        await page.waitForTimeout(2000);
        
        // Take documentation screenshot
        await page.screenshot({ path: 'test-results/baseline-documentation.png', fullPage: true });
        
        // Check for errors
        const errorText = await page.locator('text="Error"').count();
        console.log('   Error messages found:', errorText);
        
        // Check for content
        const hasContent = await page.locator('h1, h2, h3').count();
        console.log('   Headings found:', hasContent);
      }
    }
    
    console.log('4. Summary of current state completed.');
  });
});