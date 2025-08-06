import { test, expect } from '@playwright/test';

test.describe('Mermaid Content Test', () => {
  test('Check what content is being processed', async ({ page }) => {
    // Add console logging
    await page.on('console', msg => {
      if (msg.text().includes('Mermaid') || msg.text().includes('mermaid')) {
        console.log(`[${msg.type()}] ${msg.text()}`);
      }
    });
    
    // Navigate to the security architecture page
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/security.md');
    await page.waitForTimeout(2000);
    
    // Get the raw markdown content from the server
    const apiResponse = await page.request.get('http://localhost:3000/api/repository/future-mobility-consumer-platform/file?path=docs%2Farchitecture%2Fsecurity.md');
    const rawContent = await apiResponse.text();
    
    console.log('\n=== Raw Markdown Content (first 1000 chars) ===');
    console.log(rawContent.substring(0, 1000));
    
    // Check if content has mermaid blocks
    const hasMermaidBlock = rawContent.includes('```mermaid');
    console.log('\nHas mermaid code block:', hasMermaidBlock);
    
    // Extract the mermaid content
    const mermaidMatch = rawContent.match(/```mermaid\n([\s\S]*?)```/);
    if (mermaidMatch) {
      console.log('\n=== Extracted Mermaid Content ===');
      console.log(mermaidMatch[1]);
    }
    
    // Check what's in the DOM
    const preElements = await page.locator('pre').all();
    console.log(`\n=== Found ${preElements.length} pre elements ===`);
    
    for (let i = 0; i < preElements.length; i++) {
      const text = await preElements[i].textContent();
      if (text?.includes('graph') || text?.includes('subgraph')) {
        console.log(`Pre element ${i}:`, text.substring(0, 200));
      }
    }
    
    // Check for code blocks
    const codeElements = await page.locator('code').all();
    console.log(`\n=== Found ${codeElements.length} code elements ===`);
    
    for (let i = 0; i < Math.min(codeElements.length, 5); i++) {
      const className = await codeElements[i].getAttribute('class');
      const text = await codeElements[i].textContent();
      if (className?.includes('mermaid') || text?.includes('graph')) {
        console.log(`Code element ${i} (class: ${className}):`, text?.substring(0, 100));
      }
    }
    
    // Check the actual HTML structure
    const bodyHTML = await page.locator('body').innerHTML();
    const hasMermaidMarker = bodyHTML.includes('[MERMAID:');
    const hasCodeBlockMermaid = bodyHTML.includes('language-mermaid');
    
    console.log('\n=== HTML Structure Checks ===');
    console.log('Has MERMAID marker:', hasMermaidMarker);
    console.log('Has language-mermaid class:', hasCodeBlockMermaid);
    
    // Look for any elements with mermaid in their class
    const mermaidElements = await page.locator('[class*="mermaid"]').all();
    console.log(`\nFound ${mermaidElements.length} elements with 'mermaid' in class`);
    
    for (let i = 0; i < Math.min(mermaidElements.length, 3); i++) {
      const className = await mermaidElements[i].getAttribute('class');
      const tagName = await mermaidElements[i].evaluate(el => el.tagName);
      console.log(`Element ${i}: <${tagName}> class="${className}"`);
    }
    
    await page.screenshot({ path: 'mermaid-content-test.png', fullPage: true });
  });
});