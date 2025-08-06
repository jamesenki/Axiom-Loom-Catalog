import { test, expect } from '@playwright/test';

test('screenshot current state', async ({ page }) => {
  // Take homepage screenshot
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Wait for content to load
  await page.screenshot({ path: 'current-homepage.png', fullPage: true });
  
  // Look for any visible APIs button 
  const apisButtons = page.locator('a:has-text("APIs")');
  const buttonCount = await apisButtons.count();
  console.log(`Found ${buttonCount} APIs buttons`);
  
  if (buttonCount > 0) {
    await apisButtons.first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'current-apis-page.png', fullPage: true });
    
    // Look for GraphQL link
    const graphqlLinks = page.locator('text=GraphQL');
    const graphqlCount = await graphqlLinks.count();
    console.log(`Found ${graphqlCount} GraphQL links`);
    
    if (graphqlCount > 0) {
      await graphqlLinks.first().click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'current-graphql-page.png', fullPage: true });
    }
  }
  
  // Test documentation - go to a direct URL
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'current-docs-page.png', fullPage: true });
});