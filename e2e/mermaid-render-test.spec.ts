import { test, expect } from '@playwright/test';

test.describe('Mermaid Render Test', () => {
  test('Check if MermaidDiagram renders', async ({ page }) => {
    // Capture all console logs
    const logs: string[] = [];
    await page.on('console', msg => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    // Navigate to the security architecture page
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/security.md');
    await page.waitForTimeout(3000);
    
    // Filter and print MermaidDiagram logs
    console.log('\n=== MermaidDiagram Logs ===');
    logs.filter(log => log.includes('MermaidDiagram')).forEach(log => console.log(log));
    
    // Check if Mermaid containers exist
    const mermaidContainers = await page.locator('.mermaid-container').all();
    console.log(`\nFound ${mermaidContainers.length} mermaid containers`);
    
    // Check if SVG is rendered
    for (let i = 0; i < mermaidContainers.length; i++) {
      const container = mermaidContainers[i];
      const svgCount = await container.locator('svg').count();
      const innerHTML = await container.innerHTML();
      
      console.log(`\nContainer ${i + 1}:`);
      console.log(`- Has SVG: ${svgCount > 0}`);
      console.log(`- Inner HTML length: ${innerHTML.length}`);
      console.log(`- Content preview: ${innerHTML.substring(0, 100)}...`);
      
      // Check if it has error message
      const errorDiv = await container.locator('..').locator('.bg-red-50').count();
      if (errorDiv > 0) {
        const errorText = await container.locator('..').locator('.bg-red-50').textContent();
        console.log(`- ERROR: ${errorText}`);
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'mermaid-render-test.png', fullPage: true });
  });
});