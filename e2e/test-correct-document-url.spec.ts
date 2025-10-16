import { test, expect } from '@playwright/test';

test('Test correct document URL patterns', async ({ page }) => {
  console.log('=== TESTING DOCUMENT URL PATTERNS ===');
  
  // First test the main homepage
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'homepage.png', fullPage: true });
  console.log('✅ Homepage loads');
  
  // Test repositories page  
  await page.goto('/repositories');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'repositories-page.png', fullPage: true });
  console.log('✅ Repositories page loads');
  
  // Find the AI predictive maintenance architecture repository
  const repoLink = page.locator('text="ai-predictive-maintenance-engine-architecture"').first();
  if (await repoLink.count() > 0) {
    console.log('Found AI maintenance architecture repo link');
    await repoLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'repo-detail-page.png', fullPage: true });
    console.log('✅ Repository detail page loads');
    console.log('Current URL:', page.url());
    
    // Look for document links
    const docLinks = await page.locator('a[href*="docs"], a[href*="documents"]').all();
    console.log(`Found ${docLinks.length} potential document links`);
    
    for (let i = 0; i < Math.min(docLinks.length, 5); i++) {
      const link = docLinks[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      console.log(`Document link ${i + 1}: "${text?.trim()}" -> ${href}`);
    }
    
    // Try to find a specific document link
    const architectureLink = page.locator('a[href*="architecture"], text="Architecture"').first();
    if (await architectureLink.count() > 0) {
      console.log('Found architecture link, clicking...');
      await architectureLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'architecture-document.png', fullPage: true });
      console.log('✅ Architecture document loads');
      console.log('Document URL:', page.url());
    }
  }
  
  // Also try direct navigation patterns that might work
  const urlsToTest = [
    '/repository/ai-predictive-maintenance-engine-architecture',
    '/repos/ai-predictive-maintenance-engine-architecture', 
    '/ai-predictive-maintenance-engine-architecture',
    '/documents/ai-predictive-maintenance-engine-architecture',
    '/repository/ai-predictive-maintenance-engine-architecture/docs'
  ];
  
  for (const url of urlsToTest) {
    console.log(`Testing URL: ${url}`);
    try {
      await page.goto(url);
      await page.waitForTimeout(1000);
      
      // Check if we get a 404 or if page loads
      const title = await page.title();
      const hasError = await page.locator('text="404", text="Not Found", text="Error"').count();
      
      if (hasError === 0 && title !== 'Not Found') {
        console.log(`✅ URL works: ${url} (title: ${title})`);
        await page.screenshot({ path: `working-url-${url.replace(/[^a-zA-Z0-9]/g, '-')}.png`, fullPage: true });
      } else {
        console.log(`❌ URL fails: ${url}`);
      }
    } catch (error) {
      console.log(`❌ URL error: ${url} - ${error}`);
    }
  }
});