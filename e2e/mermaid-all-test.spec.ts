import { test, expect } from '@playwright/test';

test.describe('Mermaid All Documents Test', () => {
  test('Test deployment.md Mermaid diagram', async ({ page }) => {
    // Navigate to deployment.md
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/deployment.md');
    await page.waitForTimeout(2000);
    
    // Check for mermaid containers
    const mermaidContainers = await page.locator('.mermaid-container').all();
    console.log(`Deployment.md: Found ${mermaidContainers.length} mermaid containers`);
    
    // Check if SVGs are rendered
    for (let i = 0; i < mermaidContainers.length; i++) {
      const container = mermaidContainers[i];
      const svgCount = await container.locator('svg').count();
      expect(svgCount).toBeGreaterThan(0);
      console.log(`Container ${i + 1}: Has SVG rendered`);
    }
  });
  
  test('Test technical-design.md Mermaid diagram', async ({ page }) => {
    // Navigate to technical-design.md
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/technical-design.md');
    await page.waitForTimeout(2000);
    
    // Check for mermaid containers
    const mermaidContainers = await page.locator('.mermaid-container').all();
    console.log(`Technical-design.md: Found ${mermaidContainers.length} mermaid containers`);
    
    // Check if SVGs are rendered
    for (let i = 0; i < mermaidContainers.length; i++) {
      const container = mermaidContainers[i];
      const svgCount = await container.locator('svg').count();
      expect(svgCount).toBeGreaterThan(0);
      console.log(`Container ${i + 1}: Has SVG rendered`);
    }
  });
});