import { test, expect } from '@playwright/test';

test.describe('Mermaid Children Test', () => {
  test('Check children type', async ({ page }) => {
    // Capture console logs
    const logs: string[] = [];
    
    await page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Children type') || text.includes('EnhancedMarkdownViewer passing')) {
        logs.push(text);
      }
    });
    
    // Navigate to the security architecture page
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform?path=docs/architecture/security.md');
    await page.waitForTimeout(2000);
    
    // Print relevant logs
    console.log('\n=== Children Type Logs ===');
    logs.forEach(log => console.log(log));
  });
});