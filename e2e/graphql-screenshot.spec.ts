import { test, expect } from '@playwright/test';

test('screenshot GraphQL page', async ({ page }) => {
  // Try direct URL to GraphQL playground
  await page.goto('http://localhost:3000/graphql/nslabsdashboards');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000); // Give it more time to load
  await page.screenshot({ path: 'graphql-direct-url.png', fullPage: true });
  
  // Also try the API explorer for nslabs to see if there's a GraphQL section
  await page.goto('http://localhost:3000/api-explorer/nslabsdashboards');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'nslabs-api-explorer.png', fullPage: true });
});