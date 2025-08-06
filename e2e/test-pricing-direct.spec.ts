import { test, expect } from '@playwright/test';

test('Repository pricing is displayed via direct navigation', async ({ page }) => {
  // Navigate directly to a repository detail page
  await page.goto('http://localhost:3000/repository/ai-predictive-maintenance-engine-architecture');
  await page.waitForLoadState('networkidle');
  
  // Wait for detail page to load
  await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });
  
  // Check for pricing card
  const pricingCard = await page.locator('text="Architecture Package Pricing"');
  const isPricingVisible = await pricingCard.isVisible().catch(() => false);
  
  if (isPricingVisible) {
    console.log('✅ Pricing card found');
    
    // Check for price display
    const priceElement = await page.locator('h2').filter({ hasText: '$' }).first();
    if (await priceElement.isVisible()) {
      const priceText = await priceElement.textContent();
      console.log('💰 Package Price:', priceText);
    }
    
    // Check for tier badge
    const tierBadge = await page.locator('span, div').filter({ hasText: /Tier \d:/ }).first();
    if (await tierBadge.isVisible()) {
      const tierText = await tierBadge.textContent();
      console.log('🏆 Pricing Tier:', tierText);
    }
    
    // Check for value score
    const valueScore = await page.locator('text=/Value Score:.*\/100/');
    if (await valueScore.isVisible()) {
      const scoreText = await valueScore.textContent();
      console.log('📊', scoreText);
    }
  } else {
    console.log('❌ Pricing card not found - checking page structure');
    
    // Debug: Check what's on the page
    const pageTitle = await page.locator('h1').first().textContent();
    console.log('Page title:', pageTitle);
    
    const cards = await page.locator('[class*="Card"]').count();
    console.log('Number of cards on page:', cards);
  }
  
  // Take screenshot
  await page.screenshot({ 
    path: 'pricing-direct-test.png',
    fullPage: false 
  });
  
  console.log('📸 Screenshot saved as pricing-direct-test.png');
  
  // Assert pricing is visible (will fail if not, helping us debug)
  await expect(pricingCard).toBeVisible({ timeout: 5000 });
});