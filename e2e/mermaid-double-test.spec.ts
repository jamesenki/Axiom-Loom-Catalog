import { test, expect } from '@playwright/test';

test.describe('Mermaid Double Test', () => {
  test('Check for multiple code blocks', async ({ page }) => {
    // Capture all console logs
    const logs: string[] = [];
    
    await page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Code block detected') || text.includes('MermaidDiagram')) {
        logs.push(text);
      }
    });
    
    // Navigate to the security architecture page
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/security.md');
    await page.waitForTimeout(2000);
    
    // Print all code block detection logs
    console.log('\n=== All Code Block Detections ===');
    let mermaidCount = 0;
    logs.forEach(log => {
      console.log(log);
      if (log.includes('language: mermaid')) {
        mermaidCount++;
      }
    });
    
    console.log(`\nTotal mermaid code blocks detected: ${mermaidCount}`);
    
    // Check actual code elements in DOM
    const codeElements = await page.locator('code').all();
    console.log(`\nTotal code elements in DOM: ${codeElements.length}`);
    
    const preElements = await page.locator('pre').all();
    console.log(`Total pre elements in DOM: ${preElements.length}`);
    
    // Look for the specific mermaid content
    for (let i = 0; i < preElements.length; i++) {
      const text = await preElements[i].textContent();
      if (text?.includes('graph') || text?.includes('subgraph')) {
        console.log(`\nPre element ${i}:`);
        console.log(`- First 50 chars: ${text.substring(0, 50)}`);
        console.log(`- Length: ${text.length}`);
        console.log(`- Starts with 'graph LR': ${text.trim().startsWith('graph LR')}`);
        console.log(`- Starts with 'subgraph': ${text.trim().startsWith('subgraph')}`);
      }
    }
  });
});