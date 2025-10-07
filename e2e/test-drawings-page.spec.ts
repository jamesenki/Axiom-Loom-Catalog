import { test, expect } from '@playwright/test';

test.describe('Test Drawings Page Directly', () => {
  test('navigate directly to DRAWINGS.md and check for Mermaid', async ({ page }) => {
    console.log('=== TESTING DRAWINGS.MD DIRECTLY ===');
    
    // Navigate directly to the DRAWINGS.md file
    await page.goto('http://localhost:3000/docs/appliances-co-water-heater-platform/DRAWINGS.md');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Extra time for Mermaid loading
    
    console.log('1. Page loaded, checking content...');
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/drawings-page-direct.png', fullPage: true });
    
    // Check if Mermaid elements exist
    console.log('2. Looking for Mermaid elements...');
    const mermaidContainers = page.locator('.mermaid, [class*="mermaid"], .mermaid-container');
    const mermaidCount = await mermaidContainers.count();
    console.log(`   Mermaid containers: ${mermaidCount}`);
    
    // Check for SVG elements (rendered diagrams)
    const svgElements = page.locator('svg');
    const svgCount = await svgElements.count();
    console.log(`   SVG elements: ${svgCount}`);
    
    // Check for zoom controls
    const zoomControls = page.locator('button:has(svg[class*="zoom"]), button[title*="zoom" i]');
    const zoomCount = await zoomControls.count();
    console.log(`   Zoom controls: ${zoomCount}`);
    
    // Check for code blocks (unrendered Mermaid)
    const codeBlocks = page.locator('pre code, code');
    const codeCount = await codeBlocks.count();
    console.log(`   Code blocks: ${codeCount}`);
    
    // Look for specific Mermaid syntax in unrendered form (should be false if diagrams are rendered)
    const mermaidCodeBlocks = page.locator('pre code:has-text("graph TB"), code:has-text("graph TB")');
    const unrenderedMermaidCount = await mermaidCodeBlocks.count();
    console.log(`   Unrendered Mermaid code blocks: ${unrenderedMermaidCount}`);
    
    // Check for error messages
    const errorElements = page.locator('[class*="error"], .bg-red-50, [class*="text-red"]');
    const errorCount = await errorElements.count();
    console.log(`   Error elements: ${errorCount}`);
    
    if (errorCount > 0) {
      for (let i = 0; i < Math.min(errorCount, 3); i++) {
        const error = errorElements.nth(i);
        const errorText = await error.textContent();
        console.log(`     Error ${i + 1}: "${errorText}"`);
      }
    }
    
    // Check if page contains expected drawing content
    const hasDrawingsTitle = await page.locator('text=Architecture Drawings').isVisible();
    const hasSystemArchitecture = await page.locator('text=High-Level System Architecture').isVisible();
    console.log(`   Has "Architecture Drawings": ${hasDrawingsTitle}`);
    console.log(`   Has "High-Level System Architecture": ${hasSystemArchitecture}`);
    
    // SUCCESS CRITERIA:
    // - Mermaid containers > 0 (diagrams found)  
    // - SVG elements > 0 (diagrams rendered)
    // - Zoom controls > 0 (MermaidDiagram components loaded)
    // - Has expected drawing content
    const success = mermaidCount > 0 && svgCount > 0 && zoomCount > 0 && (hasDrawingsTitle || hasSystemArchitecture);
    console.log(`✅ DRAWINGS.MD MERMAID TEST: ${success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   Summary: ${mermaidCount} diagrams, ${svgCount} SVGs, ${zoomCount} zoom controls`);
    console.log('=== END DRAWINGS TEST ===');
  });
});