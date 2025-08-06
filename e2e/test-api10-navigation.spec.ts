import { test, expect } from '@playwright/test';

test.describe('Test API #10 Navigation', () => {
  test('Navigate to API #10 architecture diagrams', async ({ page }) => {
    // Navigate to future-mobility-consumer-platform docs
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
    await page.waitForLoadState('networkidle');
    
    // Click Architecture Diagrams to get to api-specs page
    console.log('1. Clicking Architecture Diagrams...');
    await page.click('a:has-text("Architecture Diagrams")');
    await page.waitForTimeout(2000);
    
    // Now we should be on the API specifications page
    // Look for API #10 Architecture link
    console.log('2. Looking for API #10 Architecture link...');
    const api10Section = await page.locator('text="API #10: Grid Services Settlement API"').locator('..');
    
    // Find the Architecture link in this section
    const architectureLink = await api10Section.locator('a:has-text("Architecture")').first();
    
    if (await architectureLink.isVisible()) {
      console.log('3. Found API #10 Architecture link, clicking...');
      const href = await architectureLink.getAttribute('href');
      console.log('   Link href:', href);
      
      await architectureLink.click();
      await page.waitForTimeout(3000);
      
      // Take screenshot
      await page.screenshot({ path: 'test-results/api10-diagrams-page.png', fullPage: true });
      
      // Check current state
      const currentUrl = page.url();
      console.log('4. Current URL:', currentUrl);
      
      // Check for error
      const hasError = await page.locator('text="Error Loading Documentation"').count();
      console.log('5. Error count:', hasError);
      
      // Check page content
      const bodyText = await page.textContent('body');
      console.log('6. Page contains:');
      console.log('   - "System Architecture":', bodyText.includes('System Architecture'));
      console.log('   - "Data Flow Architecture":', bodyText.includes('Data Flow Architecture'));
      console.log('   - "graph TB":', bodyText.includes('graph TB'));
      console.log('   - "[MERMAID:":', bodyText.includes('[MERMAID:'));
      
      // Check for Mermaid elements
      const svgCount = await page.locator('svg').count();
      const mermaidDivs = await page.locator('div[id^="mermaid"]').count();
      console.log('7. SVG count:', svgCount);
      console.log('   Mermaid divs:', mermaidDivs);
      
      // Check if Mermaid library is loaded
      const mermaidLoaded = await page.evaluate(() => {
        return typeof (window as any).mermaid !== 'undefined';
      });
      console.log('8. Mermaid library loaded:', mermaidLoaded);
    } else {
      console.log('3. API #10 Architecture link not found');
    }
  });
});