import { test, expect } from '@playwright/test';

test('detect hover blur effects', async ({ page }) => {
  await page.goto('http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture');
  await page.waitForLoadState('networkidle');

  // Test hover on navigation elements
  console.log('Testing hover on navigation...');
  await page.locator('nav').first().hover();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'hover-nav.png' });

  // Test hover on sidebar elements  
  console.log('Testing hover on sidebar...');
  await page.locator('.DocumentationView_docContainer__1HcBJ').first().hover();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'hover-sidebar.png' });

  // Test hover on main content
  console.log('Testing hover on main content...');
  await page.locator('.EnhancedMarkdownViewer_markdownContent__7MPfW').first().hover();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'hover-content.png' });

  // Test hover on table of contents links
  console.log('Testing hover on TOC links...');
  await page.locator('text=Executive Summary').first().hover();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'hover-toc-link.png' });

  console.log('✅ Hover tests complete - check screenshots for any blur effects');
});