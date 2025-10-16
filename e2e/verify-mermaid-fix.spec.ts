import { test, expect } from '@playwright/test';

test.describe('Verify Mermaid Fix', () => {
  test('Check if Mermaid diagrams render correctly', async ({ page }) => {
    // Navigate to documentation
    await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
    await page.waitForTimeout(2000);
    
    // Click on Architecture Diagrams link
    const archLink = await page.locator('a:has-text("Architecture Diagrams")').first();
    await archLink.click();
    await page.waitForTimeout(3000);
    
    // Now click on API #10 Architecture link
    const api10Link = await page.locator('a:has-text("Architecture")').filter({ hasText: 'API #10' });
    if (await api10Link.count() > 0) {
      await api10Link.first().click();
    } else {
      // Try alternate selector
      await page.click('a[href*="api-10-diagrams"]').catch(() => {
        console.log('Could not find API #10 link');
      });
    }
    
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/mermaid-fix-verification.png', fullPage: true });
    
    // Check for Mermaid rendering
    const pageContent = await page.content();
    
    // Check that we don't have raw markers
    expect(pageContent).not.toContain('[MERMAID:');
    expect(pageContent).not.toContain('[PLANTUML:');
    
    // Check for SVG elements (Mermaid renders as SVG)
    const svgCount = await page.locator('svg').count();
    console.log(`Found ${svgCount} SVG elements`);
    
    // Check for Mermaid-specific elements
    const mermaidElements = await page.locator('[id^="mermaid"]').count();
    console.log(`Found ${mermaidElements} Mermaid-specific elements`);
    
    // We should have at least some SVGs if Mermaid is working
    expect(svgCount).toBeGreaterThan(0);
  });
});