import { test } from '@playwright/test';

test('Find correct selectors', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  // Try different selectors
  const selectors = [
    'article',
    'div[role="article"]',
    '[data-testid*="card"]',
    'div:has(> h3)',
    'div:has(button:has-text("Details"))',
    'main div div div'
  ];
  
  for (const selector of selectors) {
    const count = await page.locator(selector).count();
    console.log(`${selector}: ${count} elements`);
  }
  
  // Find the container with repo cards
  const repoContainer = page.locator('text=copilot-architecture-template').locator('..');
  const containerHtml = await repoContainer.innerHTML();
  console.log('Container with repo:', containerHtml.substring(0, 200));
  
  // Find buttons near repo text
  const detailsButtons = await page.locator('a:has-text("Details")').all();
  console.log(`Found ${detailsButtons.length} Details buttons`);
  
  if (detailsButtons.length > 0) {
    const parent = await detailsButtons[0].locator('../..').innerHTML();
    console.log('Card structure:', parent.substring(0, 300));
  }
});