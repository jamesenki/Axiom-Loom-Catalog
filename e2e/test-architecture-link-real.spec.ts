import { test, expect } from '@playwright/test';

test('Architecture Diagrams link navigation - full user flow', async ({ page }) => {
  console.log('1. Navigating to homepage...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('2. Clicking on future-mobility-consumer-platform Docs button...');
  const consumerCard = await page.locator('text="future-mobility-consumer-platform"').locator('..').locator('..');
  const docsButton = await consumerCard.locator('text="Docs"');
  await docsButton.click();
  
  await page.waitForTimeout(2000);
  console.log('3. Current URL:', page.url());
  
  console.log('4. Looking for Architecture Diagrams link...');
  const architectureLink = await page.locator('a:has-text("Architecture Diagrams")').first();
  const linkHref = await architectureLink.getAttribute('href');
  console.log('5. Link href attribute:', linkHref);
  
  // Listen for network requests
  page.on('request', request => {
    if (request.url().includes('/api/repository/') && request.url().includes('/file')) {
      console.log('API Request:', request.url());
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/repository/') && response.url().includes('/file')) {
      console.log('API Response:', response.status(), response.url());
    }
  });
  
  console.log('6. Clicking Architecture Diagrams link...');
  await architectureLink.click();
  
  await page.waitForTimeout(3000);
  
  // Check for error
  const hasError = await page.locator('text="Error Loading Documentation"').count() > 0;
  console.log('7. Has error:', hasError);
  
  if (hasError) {
    const errorText = await page.locator('text="Error Loading Documentation"').locator('..').textContent();
    console.log('8. Error details:', errorText);
  } else {
    const content = await page.textContent('body');
    console.log('8. Page loaded successfully, contains "Architecture Overview":', content.includes('Architecture Overview'));
  }
  
  await page.screenshot({ path: 'test-results/architecture-link-real-test.png', fullPage: true });
  
  // Check server logs
  console.log('\n9. Checking server logs...');
  const logs = await page.evaluate(() => {
    return fetch('http://localhost:3001/api/repository/future-mobility-consumer-platform/file?path=test')
      .then(() => 'Server is responding')
      .catch(() => 'Server not responding');
  });
  console.log('Server status:', logs);
});