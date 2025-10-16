import { test, expect } from '@playwright/test';

test('Architecture Diagrams link should navigate to correct location', async ({ page }) => {
  // Navigate to future-mobility-consumer-platform docs
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForLoadState('networkidle');
  
  console.log('1. Looking for Architecture Diagrams link...');
  
  // Find the Architecture Diagrams link
  const architectureLink = await page.locator('a:has-text("Architecture Diagrams")').first();
  const linkHref = await architectureLink.getAttribute('href');
  
  console.log('2. Architecture Diagrams link href:', linkHref);
  
  // Click the link
  await architectureLink.click();
  await page.waitForTimeout(2000);
  
  // Check the current URL
  const currentUrl = page.url();
  console.log('3. Current URL after click:', currentUrl);
  
  // Verify we're on the architecture page, not api-specs
  expect(currentUrl).toContain('/architecture');
  expect(currentUrl).not.toContain('/api-specs');
  
  // Check if content loaded without error
  const hasError = await page.locator('text="Error Loading Documentation"').isVisible();
  console.log('4. Has error:', hasError);
  expect(hasError).toBe(false);
  
  // Check for architecture content
  const pageContent = await page.textContent('body');
  console.log('5. Page title includes "Architecture":', pageContent.includes('Architecture'));
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/architecture-link-fixed.png', fullPage: true });
});