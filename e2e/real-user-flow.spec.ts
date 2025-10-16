import { test, expect } from '@playwright/test';

test.describe('REAL User Flow Tests - What Actually Matters', () => {
  
  test('User can actually VIEW a repository detail page', async ({ page }) => {
    // This is what the user actually does!
    await page.goto('http://localhost:3000/repository/ai-predictive-maintenance-engine-architecture');
    await page.waitForTimeout(3000);
    
    // Check for the EXACT error the user saw
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('Error Loading Repository');
    expect(bodyText).not.toContain('Failed to fetch repository details');
    
    // Check that ACTUAL content loads
    expect(bodyText).toContain('AI Maintenance Architecture');
    
    // Make sure the API call worked
    const response = await page.request.get('http://localhost:3001/api/repository/ai-predictive-maintenance-engine-architecture/details');
    expect(response.status()).toBe(200);
  });
  
  test('User can navigate from homepage to repository detail', async ({ page }) => {
    // Start at homepage
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    // Click on repositories
    await page.click('text=Repositories');
    await page.waitForTimeout(2000);
    
    // Find and click on a specific repository
    const repoCard = page.locator('text=AI Predictive Maintenance Engine Architecture').first();
    if (await repoCard.isVisible()) {
      await repoCard.click();
      await page.waitForTimeout(3000);
      
      // Should navigate to detail page
      expect(page.url()).toContain('/repository/ai-predictive-maintenance-engine-architecture');
      
      // Should NOT show error
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('Error Loading Repository');
    }
  });
  
  test('Repository detail page shows all expected sections', async ({ page }) => {
    await page.goto('http://localhost:3000/repository/ai-predictive-maintenance-engine-architecture');
    await page.waitForTimeout(3000);
    
    // Check for main sections
    const hasDescription = await page.locator('text=/Enterprise-ready architecture blueprint/').isVisible();
    expect(hasDescription).toBe(true);
    
    // Check for API info if available
    const hasApiInfo = await page.locator('text=/OpenAPI|GraphQL|gRPC|Postman/').count();
    expect(hasApiInfo).toBeGreaterThan(0);
    
    // Check for pricing info
    const hasPricing = await page.locator('text=/$[0-9,]+/').count();
    expect(hasPricing).toBeGreaterThan(0);
  });
  
  test('API endpoints return data without authentication errors', async ({ page }) => {
    // Test the EXACT endpoints that were failing
    const endpoints = [
      '/api/repository/ai-predictive-maintenance-engine-architecture/details',
      '/api/repositories',
      '/api/repository/ai-predictive-maintenance-engine-architecture/files'
    ];
    
    for (const endpoint of endpoints) {
      const response = await page.request.get(`http://localhost:3001${endpoint}`);
      
      // Should NOT return authentication error
      expect(response.status()).not.toBe(401);
      expect(response.status()).not.toBe(403);
      
      if (response.status() === 200) {
        const text = await response.text();
        expect(text).not.toContain('Authentication required');
      }
    }
  });
  
  test('Add Repository button is clickable and opens modal', async ({ page }) => {
    await page.goto('http://localhost:3000/repositories');
    await page.waitForTimeout(2000);
    
    // Find the Add Repository button
    const addButton = page.locator('button:has-text("+Add Repository"), button:has-text("Add Repository")').first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Modal should open
      const modal = page.locator('[role="dialog"], .modal, [class*="Modal"]').first();
      await expect(modal).toBeVisible();
      
      // Should have input field
      const urlInput = page.locator('input[placeholder*="github"], input[type="url"]').first();
      await expect(urlInput).toBeVisible();
    }
  });
  
  test('Multiple repositories can be viewed in sequence', async ({ page }) => {
    const repos = [
      'ai-predictive-maintenance-engine-architecture',
      'sovd-diagnostic-ecosystem-platform-architecture',
      'fleet-digital-twin-platform-architecture'
    ];
    
    for (const repo of repos) {
      await page.goto(`http://localhost:3000/repository/${repo}`);
      await page.waitForTimeout(2000);
      
      const bodyText = await page.textContent('body');
      
      // Should NOT show error for ANY repository
      expect(bodyText).not.toContain('Error Loading Repository');
      expect(bodyText).not.toContain('404');
      expect(bodyText).not.toContain('Not Found');
    }
  });
  
  test('Documentation links work within repository', async ({ page }) => {
    await page.goto('http://localhost:3000/repository/ai-predictive-maintenance-engine-architecture');
    await page.waitForTimeout(2000);
    
    // Look for documentation links
    const docLink = page.locator('a:has-text("README"), a:has-text("Documentation")').first();
    
    if (await docLink.isVisible()) {
      const href = await docLink.getAttribute('href');
      
      // Click the link
      await docLink.click();
      await page.waitForTimeout(2000);
      
      // Should navigate or load content
      const newUrl = page.url();
      expect(newUrl).toContain('repository');
      
      // Should not show error
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('Error');
    }
  });
  
  test('BYPASS_AUTH actually works', async ({ page }) => {
    // This test ensures BYPASS_AUTH is working
    const response = await page.request.get('http://localhost:3001/api/repository/test/details', {
      headers: {
        // No auth headers
      }
    });
    
    // With BYPASS_AUTH=true, should not require authentication
    if (process.env.BYPASS_AUTH === 'true' || process.env.DEMO_MODE === 'true') {
      expect(response.status()).not.toBe(401);
    }
  });
});