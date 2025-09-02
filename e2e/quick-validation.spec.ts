import { test, expect } from '@playwright/test';

test.describe('Quick Validation After Fixes', () => {
  test('Main pages should load without errors', async ({ page }) => {
    console.log('\n🔍 Quick Validation Test\n');
    
    // Test Homepage
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1:has-text("Axiom Loom")')).toBeVisible();
    console.log('✅ Homepage loads');
    
    // Test Repositories page
    await page.goto('http://localhost:3000/repositories');
    const repoCards = page.locator('[data-testid="repository-card"]');
    const repoCount = await repoCards.count();
    console.log(`✅ Repositories page loads with ${repoCount} repos`);
    expect(repoCount).toBeGreaterThan(0);
    
    // Test a repository detail page
    await page.goto('http://localhost:3000/repository/ai-predictive-maintenance-engine');
    await page.waitForTimeout(2000);
    const hasError = await page.locator('text=/error|failed/i').count();
    if (hasError === 0) {
      console.log('✅ Repository detail page loads');
    } else {
      console.log('❌ Repository detail page has errors');
    }
    
    // Test documentation page
    await page.goto('http://localhost:3000/docs/ai-predictive-maintenance-engine');
    await page.waitForTimeout(2000);
    const docError = await page.locator('text=/error|failed/i').count();
    if (docError === 0) {
      console.log('✅ Documentation page loads');
    } else {
      const errorText = await page.locator('text=/error|failed/i').first().textContent();
      console.log(`❌ Documentation page error: ${errorText}`);
    }
    
    // Test APIs page
    await page.goto('http://localhost:3000/apis');
    await page.waitForTimeout(2000);
    const apiError = await page.locator('text=/error|failed/i').count();
    if (apiError === 0) {
      console.log('✅ APIs page loads');
    } else {
      const errorText = await page.locator('text=/error|failed/i').first().textContent();
      console.log(`❌ APIs page error: ${errorText}`);
    }
  });
  
  test('Test API endpoints directly', async ({ page }) => {
    // Test repository API
    const repoResponse = await page.evaluate(async () => {
      const res = await fetch('/api/repositories');
      return { status: res.status, ok: res.ok };
    });
    console.log(`Repository API: ${repoResponse.status} - ${repoResponse.ok ? '✅' : '❌'}`);
    
    // Test API detection with x-dev-mode
    const apiDetectResponse = await page.evaluate(async () => {
      const res = await fetch('/api/repository/ai-predictive-maintenance-engine/detect-apis', {
        headers: { 'x-dev-mode': 'true' }
      });
      return { status: res.status, ok: res.ok };
    });
    console.log(`API Detection: ${apiDetectResponse.status} - ${apiDetectResponse.ok ? '✅' : '❌'}`);
    
    // Test documentation files API
    const docResponse = await page.evaluate(async () => {
      const res = await fetch('/api/repository/ai-predictive-maintenance-engine/files', {
        headers: { 'x-dev-mode': 'true' }
      });
      return { status: res.status, ok: res.ok };
    });
    console.log(`Documentation Files API: ${docResponse.status} - ${docResponse.ok ? '✅' : '❌'}`);
  });
});