import { test, expect } from '@playwright/test';

test('screenshot GraphQL page', async ({ page }) => {
  // Try direct URL to GraphQL playground
  await page.goto('http://localhost:3000/graphql/demo-labsdashboards');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000); // Give it more time to load
  await page.screenshot({ path: 'graphql-direct-url.png', fullPage: true });
  
  // Also try the API explorer for demo-labs to see if there's a GraphQL section
  await page.goto('http://localhost:3000/api-explorer/demo-labsdashboards');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'demo-labs-api-explorer.png', fullPage: true });
});