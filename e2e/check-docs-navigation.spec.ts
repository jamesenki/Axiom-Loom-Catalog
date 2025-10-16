import { test, expect } from '@playwright/test';

test.describe('Check Documentation Navigation', () => {
  test('Test docs button navigation for different repositories', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Test future-mobility-consumer-platform docs button
    console.log('1. Testing future-mobility-consumer-platform docs...');
    const consumerCard = await page.locator('text="future-mobility-consumer-platform"').locator('..').locator('..');
    const consumerDocsBtn = await consumerCard.locator('text="Docs"');
    
    // Get the href or onclick handler
    const consumerDocsHref = await consumerDocsBtn.getAttribute('href');
    console.log('   Docs button href:', consumerDocsHref);
    
    await consumerDocsBtn.click();
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    console.log('   Navigated to:', currentUrl);
    console.log('   Expected: /docs/future-mobility-consumer-platform');
    console.log('   Match:', currentUrl.includes('future-mobility-consumer-platform'));
    
    // Check what repository docs we're actually viewing
    const h1Text = await page.locator('h1').textContent();
    console.log('   Page heading:', h1Text);
    
    // Go back to homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Test another repository
    console.log('\n2. Testing copilot-architecture-template docs...');
    const copilotCard = await page.locator('text="copilot-architecture-template"').locator('..').locator('..');
    const copilotDocsBtn = await copilotCard.locator('text="Docs"');
    
    const copilotDocsHref = await copilotDocsBtn.getAttribute('href');
    console.log('   Docs button href:', copilotDocsHref);
    
    await copilotDocsBtn.click();
    await page.waitForTimeout(2000);
    
    const copilotUrl = page.url();
    console.log('   Navigated to:', copilotUrl);
    
    // Check what repository docs we're viewing
    const copilotH1Text = await page.locator('h1').textContent();
    console.log('   Page heading:', copilotH1Text);
  });
});