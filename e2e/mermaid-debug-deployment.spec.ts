import { test, expect } from '@playwright/test';

test.describe('Mermaid Deployment Debug', () => {
  test('Debug deployment.md rendering', async ({ page }) => {
    // Capture console logs
    const logs: string[] = [];
    await page.on('console', msg => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    // Navigate to deployment.md
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/deployment.md');
    await page.waitForTimeout(3000);
    
    // Get the raw content from API
    const apiResponse = await page.request.get('http://localhost:3000/api/repository/future-mobility-consumer-platform/file?path=docs%2Farchitecture%2Fdeployment.md');
    const rawContent = await apiResponse.text();
    
    console.log('\n=== Raw Content Check ===');
    console.log('Has mermaid code block:', rawContent.includes('```mermaid'));
    console.log('First 300 chars:', rawContent.substring(0, 300));
    
    // Check for any pre elements
    const preElements = await page.locator('pre').all();
    console.log(`\nFound ${preElements.length} pre elements`);
    
    // Check for mermaid containers
    const mermaidContainers = await page.locator('.mermaid-container').all();
    console.log(`Found ${mermaidContainers.length} mermaid containers`);
    
    // Check for error containers
    const errorContainers = await page.locator('.bg-red-50').all();
    console.log(`Found ${errorContainers.length} error containers`);
    
    // Check if page loaded correctly
    const h1 = await page.locator('h1').textContent();
    console.log(`\nPage H1: ${h1}`);
    
    // Check the markdown viewer
    const markdownViewer = await page.locator('.enhancedMarkdownViewer').count();
    console.log(`Enhanced markdown viewer present: ${markdownViewer > 0}`);
    
    // Take screenshot
    await page.screenshot({ path: 'deployment-debug.png', fullPage: true });
  });
});