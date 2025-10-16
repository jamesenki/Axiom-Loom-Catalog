import { test, expect } from '@playwright/test';

test.describe('Mermaid Final Test', () => {
  test('Check final rendering', async ({ page }) => {
    // Capture all console logs
    const logs: string[] = [];
    
    await page.on('console', msg => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    // Navigate to the security architecture page
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/security.md');
    await page.waitForTimeout(3000);
    
    // Filter for MermaidDiagram logs
    console.log('\n=== MermaidDiagram Render Logs ===');
    logs.filter(log => log.includes('MermaidDiagram rendering content:')).forEach(log => {
      console.log(log);
    });
    
    // Check what's in the DOM
    const mermaidContainers = await page.locator('.mermaid-container').all();
    console.log(`\nFound ${mermaidContainers.length} mermaid containers`);
    
    // Also check for error containers
    const errorContainers = await page.locator('.bg-red-50').all();
    console.log(`Found ${errorContainers.length} error containers`);
    
    for (let i = 0; i < errorContainers.length; i++) {
      const container = errorContainers[i];
      const errorText = await container.locator('.text-red-700').textContent();
      const errorDetail = await container.locator('.text-red-600').first().textContent();
      console.log(`\nError ${i + 1}:`);
      console.log(`- Title: ${errorText}`);
      console.log(`- Detail: ${errorDetail}`);
      
      // Get the source from details
      const hasDetails = await container.locator('details').count() > 0;
      if (hasDetails) {
        const sourceContent = await container.locator('details pre').textContent();
        console.log(`- Source content: "${sourceContent}"`);
      }
    }
  });
});