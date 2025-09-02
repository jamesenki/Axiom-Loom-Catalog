import { test, expect } from '@playwright/test';

test('API Explorer text visibility check', async ({ page }) => {
  // Navigate to API Explorer for a repo with APIs
  await page.goto('http://10.0.0.109:3000/api-explorer/cloudtwin-simulation-platform-architecture');
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'api-explorer-text-check.png',
    fullPage: true 
  });
  
  // Check if error state
  const errorHeading = await page.locator('h1:has-text("Error")').count();
  if (errorHeading > 0) {
    console.log('ERROR STATE DETECTED');
    const errorText = await page.locator('h1').textContent();
    console.log('Error heading:', errorText);
    return;
  }
  
  // Check for API cards
  const apiCards = await page.locator('[data-testid="api-card"], div[class*="APICard"]').count();
  console.log(`Found ${apiCards} API cards`);
  
  if (apiCards > 0) {
    // Get first card's text color
    const firstCard = page.locator('[data-testid="api-card"], div[class*="APICard"]').first();
    
    // Check title color
    const titleElement = await firstCard.locator('h3, [class*="CardTitle"]').first();
    const titleColor = await titleElement.evaluate(el => 
      window.getComputedStyle(el).color
    );
    console.log('Card title color:', titleColor);
    
    // Check description color if exists
    const descElement = await firstCard.locator('p, [class*="CardDescription"]').first();
    if (await descElement.count() > 0) {
      const descColor = await descElement.evaluate(el => 
        window.getComputedStyle(el).color
      );
      console.log('Card description color:', descColor);
    }
    
    // Check any text in card content
    const contentText = await firstCard.locator('[class*="CardContent"]').first();
    if (await contentText.count() > 0) {
      const contentColor = await contentText.evaluate(el => 
        window.getComputedStyle(el).color
      );
      console.log('Card content color:', contentColor);
    }
  }
  
  // Check page header text
  const pageHeader = await page.locator('h1').first();
  const headerColor = await pageHeader.evaluate(el => 
    window.getComputedStyle(el).color
  );
  console.log('Page header color:', headerColor);
  
  // Report findings
  console.log('\n=== TEXT VISIBILITY REPORT ===');
  console.log('White = rgb(255, 255, 255)');
  console.log('Current colors detected above');
  console.log('Screenshot saved as api-explorer-text-check.png');
});