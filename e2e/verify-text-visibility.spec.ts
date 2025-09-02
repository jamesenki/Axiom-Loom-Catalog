import { test, expect } from '@playwright/test';

test('Verify text visibility on API Explorer page', async ({ page }) => {
  console.log('Navigating to API Explorer page...');
  
  // Navigate to the specific URL
  await page.goto('http://10.0.0.109:3000/api-explorer/cloudtwin-simulation-platform-architecture');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  
  // Take a full page screenshot
  await page.screenshot({ 
    path: 'text-visibility-check.png', 
    fullPage: true 
  });
  
  console.log('Screenshot taken: text-visibility-check.png');
  
  // Check for API cards and their visibility
  const apiCards = page.locator('[data-testid*="api-card"], .api-card, [class*="api"], [class*="card"]');
  const cardCount = await apiCards.count();
  console.log(`Found ${cardCount} potential API cards`);
  
  // Check for text elements
  const textElements = page.locator('h1, h2, h3, h4, h5, h6, p, span, div').filter({ hasText: /\w+/ });
  const textCount = await textElements.count();
  console.log(`Found ${textCount} text elements`);
  
  // Get computed styles for text elements
  for (let i = 0; i < Math.min(5, textCount); i++) {
    const element = textElements.nth(i);
    const text = await element.textContent();
    const color = await element.evaluate(el => window.getComputedStyle(el).color);
    const backgroundColor = await element.evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log(`Text: "${text?.slice(0, 50)}..." Color: ${color}, Background: ${backgroundColor}`);
  }
  
  // Take an additional screenshot with specific focus on API cards
  if (cardCount > 0) {
    await apiCards.first().screenshot({ path: 'api-card-detail.png' });
  }
});