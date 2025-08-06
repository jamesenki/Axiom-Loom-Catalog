import { test } from '@playwright/test';

test('Debug page structure', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  // Find actual card structure
  const cards = await page.locator('[class*="Card"]').all();
  console.log(`Found ${cards.length} cards`);
  
  // Check first card structure
  if (cards.length > 0) {
    const firstCard = cards[0];
    const html = await firstCard.innerHTML();
    console.log('First card HTML:', html.substring(0, 500));
    
    // Find buttons in card
    const buttons = await firstCard.locator('button, a[role="button"], a[href]').all();
    console.log(`Found ${buttons.length} buttons/links in first card`);
    
    for (const button of buttons) {
      const text = await button.textContent();
      const href = await button.getAttribute('href');
      console.log(`Button: "${text}", href: ${href}`);
    }
  }
  
  // Check repository detail page
  await page.goto('http://localhost:3000/repository/nslabsdashboards');
  await page.waitForTimeout(2000);
  
  const detailContent = await page.locator('body').textContent();
  console.log('Detail page content:', detailContent?.substring(0, 500));
});