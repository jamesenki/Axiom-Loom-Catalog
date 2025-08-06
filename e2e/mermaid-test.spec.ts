import { test, expect } from '@playwright/test';

test.describe('Mermaid Diagram Rendering', () => {
  test('Security Architecture Mermaid diagram renders correctly', async ({ page }) => {
    // Navigate to the security architecture page
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
    await page.waitForTimeout(1000);
    
    // Click on the security architecture link
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/security.md');
    await page.waitForTimeout(2000);
    
    // Check if Mermaid diagrams are present
    const mermaidContainers = await page.locator('.mermaid-container').count();
    console.log(`Found ${mermaidContainers} Mermaid containers`);
    
    // Check for SVG elements (rendered diagrams)
    const svgElements = await page.locator('.mermaid-container svg').count();
    console.log(`Found ${svgElements} SVG elements`);
    
    // Check for any error messages
    const errorMessages = await page.locator('text=/Failed to render Mermaid diagram/').count();
    console.log(`Found ${errorMessages} error messages`);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'mermaid-test-screenshot.png', fullPage: true });
    
    // Check the actual content
    const pageContent = await page.content();
    
    // Look for raw Mermaid code that should have been rendered
    const hasRawMermaidCode = pageContent.includes('graph LR');
    const hasSubgraph = pageContent.includes('subgraph');
    
    console.log('Has raw Mermaid code:', hasRawMermaidCode);
    console.log('Has subgraph:', hasSubgraph);
    
    // Check if the specific elements from the diagram are present
    const hasWAF = await page.locator('text=/Web Application Firewall/').count() > 0;
    const hasAAD = await page.locator('text=/Azure AD B2C/').count() > 0;
    
    console.log('Has WAF text:', hasWAF);
    console.log('Has AAD text:', hasAAD);
    
    // Assertions
    expect(mermaidContainers).toBeGreaterThan(0);
    expect(svgElements).toBeGreaterThan(0);
    expect(errorMessages).toBe(0);
    
    // The raw code should not be visible if properly rendered
    expect(hasRawMermaidCode).toBe(false);
  });
});