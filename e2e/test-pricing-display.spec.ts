import { test, expect } from '@playwright/test';

test('Repository pricing is displayed on detail page', async ({ page }) => {
  // Navigate to home
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Click on a repository with good pricing (AI Maintenance Architecture)
  const repoCard = await page.locator('text="AI Maintenance Architecture"').first();
  await expect(repoCard).toBeVisible();
  await repoCard.click();
  
  // Wait for detail page to load
  await page.waitForSelector('h1', { state: 'visible' });
  
  // Check for pricing card
  const pricingCard = await page.locator('text="Architecture Package Pricing"');
  await expect(pricingCard).toBeVisible();
  
  // Check for price display
  const priceElement = await page.locator('h2:has-text("$")').first();
  await expect(priceElement).toBeVisible();
  
  const priceText = await priceElement.textContent();
  console.log('💰 Package Price:', priceText);
  
  // Check for tier badge
  const tierBadge = await page.locator('text=/Tier \\d:/');
  await expect(tierBadge).toBeVisible();
  
  const tierText = await tierBadge.textContent();
  console.log('🏆 Pricing Tier:', tierText);
  
  // Check for licensing info
  const licensingText = await page.locator('text="Perpetual License"');
  await expect(licensingText).toBeVisible();
  
  // Check for support info
  const supportText = await page.locator('text="90 days"');
  await expect(supportText).toBeVisible();
  
  // Check for customization badge
  const customizationBadge = await page.locator('text="Customization Available"');
  await expect(customizationBadge).toBeVisible();
  
  // Take screenshot
  await page.screenshot({ 
    path: 'pricing-display-test.png',
    fullPage: false 
  });
  
  console.log('✅ Pricing information displayed correctly on repository detail page');
  console.log('📸 Screenshot saved as pricing-display-test.png');
});