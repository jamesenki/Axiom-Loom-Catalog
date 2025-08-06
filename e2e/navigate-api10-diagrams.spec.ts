import { test, expect } from '@playwright/test';

test('Navigate to API #10 Diagrams and Check Mermaid', async ({ page }) => {
  // Navigate to api-specs page
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForLoadState('networkidle');
  
  console.log('1. Clicking Architecture Diagrams...');
  await page.click('a:has-text("Architecture Diagrams")');
  await page.waitForTimeout(2000);
  
  console.log('2. Finding API #10 Architecture link...');
  // Find the specific architecture link for API #10
  const api10ArchLink = await page.locator('a[href="architecture/api-10-diagrams.md"]').first();
  
  console.log('3. Clicking API #10 Architecture link...');
  await api10ArchLink.click();
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/api10-mermaid-current.png', fullPage: true });
  
  // Check current state
  console.log('4. Current URL:', page.url());
  
  // Check for error
  const hasError = await page.locator('text="Error Loading Documentation"').isVisible();
  console.log('5. Has error:', hasError);
  
  if (!hasError) {
    // Analyze page content
    const pageContent = await page.content();
    const bodyText = await page.textContent('body');
    
    console.log('6. Content analysis:');
    console.log('   - Title contains "API #10":', bodyText.includes('API #10') || bodyText.includes('API 10'));
    console.log('   - Has "System Architecture":', bodyText.includes('System Architecture'));
    console.log('   - Has "Data Flow Architecture":', bodyText.includes('Data Flow Architecture'));
    console.log('   - Has "graph TB":', bodyText.includes('graph TB'));
    console.log('   - Has "[MERMAID:" markers:', pageContent.includes('[MERMAID:'));
    console.log('   - Has "sequenceDiagram":', bodyText.includes('sequenceDiagram'));
    
    // Check rendering
    const svgCount = await page.locator('svg').count();
    const mermaidContainers = await page.locator('.mermaid-container').count();
    const codeBlocks = await page.locator('pre code').count();
    
    console.log('7. Rendering elements:');
    console.log('   - SVG count:', svgCount);
    console.log('   - Mermaid containers:', mermaidContainers);
    console.log('   - Code blocks:', codeBlocks);
    
    // Check if we see raw Mermaid code in code blocks
    const codeBlocksContent = await page.locator('pre code').allTextContents();
    const hasMermaidInCode = codeBlocksContent.some(content => 
      content.includes('graph') || content.includes('sequenceDiagram')
    );
    console.log('   - Mermaid code in code blocks:', hasMermaidInCode);
    
    // Check Mermaid library
    const mermaidLoaded = await page.evaluate(() => {
      return {
        mermaidDefined: typeof (window as any).mermaid !== 'undefined',
        mermaidVersion: (window as any).mermaid?.version || 'not loaded'
      };
    });
    console.log('8. Mermaid library:', mermaidLoaded);
  }
});