import { test, expect } from '@playwright/test';

test.describe('Mermaid Console Errors', () => {
  test('Check console errors for Mermaid rendering', async ({ page }) => {
    // Collect console messages
    const consoleMessages: string[] = [];
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      consoleErrors.push(error.message);
    });
    
    // Navigate to the security architecture page
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/security.md');
    await page.waitForTimeout(3000);
    
    // Print all console messages
    console.log('\n=== Console Messages ===');
    consoleMessages.forEach(msg => console.log(msg));
    
    console.log('\n=== Console Errors ===');
    consoleErrors.forEach(err => console.log(err));
    
    // Check the page content
    const pageHTML = await page.content();
    
    // Check if Mermaid script is loaded
    const hasMermaidScript = await page.evaluate(() => {
      return typeof (window as any).mermaid !== 'undefined';
    });
    
    console.log('\nMermaid script loaded:', hasMermaidScript);
    
    // Check if mermaidAPI is available
    const hasMermaidAPI = await page.evaluate(() => {
      const mermaid = (window as any).mermaid;
      return mermaid && typeof mermaid.mermaidAPI !== 'undefined';
    });
    
    console.log('MermaidAPI available:', hasMermaidAPI);
    
    // Try to manually render a simple diagram
    if (hasMermaidAPI) {
      try {
        const renderResult = await page.evaluate(() => {
          const mermaid = (window as any).mermaid;
          const testDiagram = 'graph TD\n  A[Test] --> B[Diagram]';
          try {
            const result = mermaid.mermaidAPI.render('test-diagram', testDiagram);
            return { success: true, result };
          } catch (err) {
            return { success: false, error: err.message };
          }
        });
        console.log('Manual render test:', renderResult);
      } catch (err) {
        console.log('Manual render error:', err);
      }
    }
    
    // Check for specific elements
    const mermaidContainer = await page.locator('.mermaid-container').first();
    const innerHTML = await mermaidContainer.innerHTML();
    console.log('\nMermaid container HTML:', innerHTML.substring(0, 200));
    
    // Take screenshot
    await page.screenshot({ path: 'mermaid-console-test.png', fullPage: true });
  });
});