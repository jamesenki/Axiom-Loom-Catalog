import { test, expect } from '@playwright/test';

test.describe('Test Current Mermaid State', () => {
  test('Check Mermaid rendering in api-10-diagrams.md', async ({ page }) => {
    // Navigate to future-mobility-consumer-platform docs
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
    await page.waitForLoadState('networkidle');
    
    console.log('1. On documentation page...');
    
    // Check current sidebar state
    const fileTreeSidebar = await page.locator('aside:has-text("Files")').count();
    const tocSidebar = await page.locator('aside:has-text("Table of Contents")').count();
    console.log('2. File tree sidebar count:', fileTreeSidebar);
    console.log('   TOC sidebar count:', tocSidebar);
    
    // Try to navigate to api-10-diagrams.md by clicking Architecture Diagrams link
    console.log('3. Looking for Architecture Diagrams link...');
    const archLink = await page.locator('a:has-text("Architecture Diagrams")').first();
    if (await archLink.isVisible()) {
      console.log('   Found Architecture Diagrams link');
      await archLink.click();
      await page.waitForTimeout(2000);
      
      // Check if we got an error
      const hasError = await page.locator('text="Error Loading Documentation"').count();
      console.log('4. Error count after clicking:', hasError);
      
      if (hasError > 0) {
        console.log('   Got error page, trying direct navigation...');
        // Try direct navigation to the file
        await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
        await page.waitForTimeout(1000);
        
        // Simulate direct file selection
        await page.evaluate(() => {
          const event = new CustomEvent('navigate-to-file', { 
            detail: 'docs/architecture/api-10-diagrams.md' 
          });
          window.dispatchEvent(event);
        });
        await page.waitForTimeout(2000);
      }
    }
    
    // Take screenshot of current state
    await page.screenshot({ path: 'test-results/current-mermaid-state.png', fullPage: true });
    
    // Check page content
    const pageContent = await page.content();
    const bodyText = await page.textContent('body');
    
    console.log('5. Page analysis:');
    console.log('   Has "[MERMAID:" markers:', pageContent.includes('[MERMAID:'));
    console.log('   Has "graph TB" text:', bodyText.includes('graph TB'));
    console.log('   Has "System Architecture":', bodyText.includes('System Architecture'));
    console.log('   SVG count:', await page.locator('svg').count());
    console.log('   Mermaid container count:', await page.locator('.mermaid-container').count());
    
    // Check if Mermaid script is loaded
    const mermaidScriptLoaded = await page.evaluate(() => {
      return typeof (window as any).mermaid !== 'undefined';
    });
    console.log('6. Mermaid library loaded:', mermaidScriptLoaded);
  });
});