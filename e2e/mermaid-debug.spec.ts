import { test, expect } from '@playwright/test';

test.describe('Mermaid Debug', () => {
  test('Debug Mermaid rendering issue', async ({ page }) => {
    // Navigate to the security architecture page
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/security.md');
    await page.waitForTimeout(3000);
    
    // Check all mermaid-related elements
    const mermaidContainers = await page.locator('.mermaid-container').all();
    console.log(`Found ${mermaidContainers.length} mermaid containers`);
    
    for (let i = 0; i < mermaidContainers.length; i++) {
      console.log(`\n=== Container ${i + 1} ===`);
      
      const container = mermaidContainers[i];
      const innerHTML = await container.innerHTML();
      console.log('Inner HTML:', innerHTML);
      
      // Check for SVG
      const svg = await container.locator('svg').count();
      console.log('SVG count:', svg);
      
      // Check for error messages
      const hasError = innerHTML.includes('Failed to render');
      console.log('Has error:', hasError);
      
      // Check parent element
      const parent = await container.locator('..').first();
      const parentHTML = await parent.innerHTML();
      console.log('Parent HTML (first 300 chars):', parentHTML.substring(0, 300));
    }
    
    // Check if the Mermaid code is being processed
    const pageContent = await page.content();
    const hasMermaidCodeBlock = pageContent.includes('```mermaid');
    const hasMermaidMarker = pageContent.includes('[MERMAID:');
    const hasGraphLR = pageContent.includes('graph LR');
    
    console.log('\n=== Content Checks ===');
    console.log('Has mermaid code block:', hasMermaidCodeBlock);
    console.log('Has mermaid marker:', hasMermaidMarker);
    console.log('Has graph LR:', hasGraphLR);
    
    // Check the actual markdown content being rendered
    const markdownContent = await page.locator('.enhancedMarkdownViewer').first().textContent();
    console.log('\n=== Markdown Content (first 500 chars) ===');
    console.log(markdownContent?.substring(0, 500));
    
    // Try to find any Mermaid diagram components
    const mermaidDiagramComponents = await page.locator('[class*="MermaidDiagram"]').count();
    console.log('\nMermaid diagram components:', mermaidDiagramComponents);
    
    // Check for any pre/code blocks that might contain mermaid
    const preBlocks = await page.locator('pre').all();
    console.log(`\nFound ${preBlocks.length} pre blocks`);
    for (let i = 0; i < Math.min(preBlocks.length, 3); i++) {
      const content = await preBlocks[i].textContent();
      if (content?.includes('graph') || content?.includes('subgraph')) {
        console.log(`Pre block ${i + 1} contains diagram code:`, content.substring(0, 100));
      }
    }
    
    await page.screenshot({ path: 'mermaid-debug.png', fullPage: true });
  });
});