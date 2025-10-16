import { test, expect } from '@playwright/test';

test.describe('Mermaid Error Test', () => {
  test('Check for Mermaid errors', async ({ page }) => {
    // Capture all console logs
    const logs: string[] = [];
    const errors: string[] = [];
    
    await page.on('console', msg => {
      const text = msg.text();
      logs.push(`[${msg.type()}] ${text}`);
      if (msg.type() === 'error') {
        errors.push(text);
      }
    });
    
    await page.on('pageerror', error => {
      errors.push(`PAGE ERROR: ${error.message}`);
    });
    
    // Navigate to the security architecture page
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/security.md');
    await page.waitForTimeout(3000);
    
    // Print all errors
    console.log('\n=== All Errors ===');
    errors.forEach(err => console.log(err));
    
    // Filter logs for Mermaid-related messages
    console.log('\n=== Mermaid-related Logs ===');
    logs.filter(log => 
      log.toLowerCase().includes('mermaid') || 
      log.includes('rendering') ||
      log.includes('MermaidDiagram')
    ).forEach(log => console.log(log));
    
    // Check if error divs exist
    const errorDivs = await page.locator('.bg-red-50').all();
    console.log(`\n=== Found ${errorDivs.length} error divs ===`);
    
    for (let i = 0; i < errorDivs.length; i++) {
      const errorText = await errorDivs[i].textContent();
      console.log(`Error ${i + 1}: ${errorText}`);
      
      // Check if it has details
      const details = await errorDivs[i].locator('details').count();
      if (details > 0) {
        const sourceCode = await errorDivs[i].locator('pre').textContent();
        console.log(`Source code: ${sourceCode?.substring(0, 100)}...`);
      }
    }
    
    // Check network for mermaid CDN
    const cdnLoaded = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some(s => s.src.includes('mermaid'));
    });
    console.log(`\nMermaid CDN script tag exists: ${cdnLoaded}`);
    
    // Check if mermaid is defined
    const mermaidDefined = await page.evaluate(() => {
      return typeof (window as any).mermaid !== 'undefined';
    });
    console.log(`Mermaid global object defined: ${mermaidDefined}`);
    
    await page.screenshot({ path: 'mermaid-error-test.png', fullPage: true });
  });
});