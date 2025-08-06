import { test, expect } from '@playwright/test';

test.describe('Check Navigation Flow', () => {
  test('Test repository to documentation navigation', async ({ page }) => {
    // Go to homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Click on future-mobility-consumer-platform repository
    console.log('1. Clicking on future-mobility-consumer-platform...');
    await page.click('text="future-mobility-consumer-platform"');
    await page.waitForTimeout(2000);
    
    // Take screenshot of repository detail page
    await page.screenshot({ path: 'test-results/nav-repo-detail.png', fullPage: true });
    
    // Check if we're on the repository detail page
    const url = page.url();
    console.log('2. Current URL:', url);
    
    // Look for documentation link
    const docsButton = await page.locator('button:has-text("Docs"), a:has-text("Docs")').first();
    if (await docsButton.isVisible()) {
      console.log('3. Found Docs button, clicking...');
      await docsButton.click();
      await page.waitForTimeout(2000);
      
      // Take screenshot of documentation page
      await page.screenshot({ path: 'test-results/nav-documentation.png', fullPage: true });
      
      // Check current state
      const newUrl = page.url();
      console.log('4. Documentation URL:', newUrl);
      
      // Check for error messages
      const hasError = await page.locator('text="Error Loading Documentation"').isVisible();
      console.log('5. Has error:', hasError);
      
      // Check for content
      const headings = await page.locator('h1, h2, h3').allTextContents();
      console.log('6. Found headings:', headings.slice(0, 5));
      
      // Check for sidebar
      const hasSidebar = await page.locator('aside').count();
      console.log('7. Sidebar count:', hasSidebar);
      
      // Check for Mermaid content
      const pageContent = await page.content();
      const hasMermaidMarkers = pageContent.includes('[MERMAID:');
      console.log('8. Has Mermaid markers:', hasMermaidMarkers);
      
      // Check for SVG elements
      const svgCount = await page.locator('svg').count();
      console.log('9. SVG count:', svgCount);
    } else {
      console.log('3. No Docs button found');
    }
  });
});