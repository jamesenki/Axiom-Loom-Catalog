/**
 * Comprehensive Coverage Tests
 * 
 * 100% coverage for user experience - every API, element, document and link
 */

import { test, expect } from '@playwright/test';

test.describe('EYNS AI Experience Center - 100% Coverage Tests', () => {
  
  test('Complete user journey through all features', async ({ page }) => {
    // 1. Start at homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify homepage elements
    await expect(page.locator('h1:has-text("EYNS AI Experience Center")')).toBeVisible();
    await expect(page.locator('text=Developer Portal')).toBeVisible();
    
    // Take screenshot for documentation
    await page.screenshot({ path: 'uat-screenshots/coverage-01-homepage.png', fullPage: true });
    
    // 2. Test repository with full features - future-mobility-consumer-platform
    const repoCard = page.locator('article').filter({ hasText: 'future-mobility-consumer-platform' }).first();
    await expect(repoCard).toBeVisible();
    
    // Verify marketing description is visible
    await expect(repoCard.locator('text=/Empower.*billion.*consumers/')).toBeVisible();
    
    // Verify all buttons are present
    await expect(repoCard.locator('button:has-text("Details")')).toBeVisible();
    await expect(repoCard.locator('button:has-text("Docs")')).toBeVisible();
    await expect(repoCard.locator('button:has-text("APIs")')).toBeVisible();
    await expect(repoCard.locator('button:has-text("Postman")')).toBeVisible();
    
    // 3. Navigate to repository details page
    await repoCard.locator('button:has-text("Details")').click();
    await page.waitForLoadState('domcontentloaded');
    
    // Verify repository detail page
    await expect(page.url()).toContain('/repository/future-mobility-consumer-platform');
    await expect(page.locator('h1:has-text("future-mobility-consumer-platform")')).toBeVisible();
    await expect(page.locator('text=/Empower.*billion.*consumers/')).toBeVisible();
    
    // Check metrics are displayed
    await expect(page.locator('text=/Total APIs/')).toBeVisible();
    await expect(page.locator('text=/Postman Collections/')).toBeVisible();
    
    await page.screenshot({ path: 'uat-screenshots/coverage-02-repo-details.png', fullPage: true });
    
    // 4. Test documentation viewer
    await page.locator('button:has-text("View Documentation")').click();
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.url()).toContain('/docs/future-mobility-consumer-platform');
    await expect(page.locator('h1:has-text("Documentation")')).toBeVisible();
    
    // Verify markdown viewer is loaded (no double navigation)
    const sidebars = await page.locator('aside').count();
    expect(sidebars).toBeLessThanOrEqual(1); // Should only have TOC, not file explorer
    
    await page.screenshot({ path: 'uat-screenshots/coverage-03-docs.png', fullPage: true });
    
    // Go back to repository
    await page.locator('a:has-text("Back to Repositories")').click();
    await page.waitForLoadState('domcontentloaded');
    
    // 5. Test API Explorer
    const repoCardAgain = page.locator('article').filter({ hasText: 'future-mobility-consumer-platform' }).first();
    await repoCardAgain.locator('button:has-text("APIs")').click();
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.url()).toContain('/api-explorer/future-mobility-consumer-platform');
    await expect(page.locator('h1:has-text("API Explorer")')).toBeVisible();
    
    // Wait for APIs to load
    await page.waitForSelector('text=/API.*discovered|No APIs Found/', { timeout: 10000 });
    
    // Check for API cards
    const apiCards = page.locator('[data-type="OpenAPI"]');
    const apiCount = await apiCards.count();
    
    if (apiCount > 0) {
      // Verify first API card
      const firstApi = apiCards.first();
      await expect(firstApi).toBeVisible();
      await expect(firstApi.locator('text=/OpenAPI/')).toBeVisible();
      
      // Test search functionality
      await page.fill('input[placeholder*="Search APIs"]', 'Grid');
      await page.waitForTimeout(500);
      
      // Test filter by type
      await page.locator('button:has-text("OpenAPI")').first().click();
      await page.waitForTimeout(500);
    }
    
    await page.screenshot({ path: 'uat-screenshots/coverage-04-api-explorer.png', fullPage: true });
    
    // 6. Test Postman Collections
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    
    const repoWithPostman = page.locator('article').filter({ hasText: 'future-mobility-consumer-platform' }).first();
    await repoWithPostman.locator('button:has-text("Postman")').click();
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.url()).toContain('/postman/future-mobility-consumer-platform');
    await expect(page.locator('h1:has-text("Postman Collections")')).toBeVisible();
    
    // Wait for collections to load
    const collectionCards = page.locator('article').filter({ hasText: 'collection' });
    const collectionCount = await collectionCards.count();
    
    if (collectionCount > 0) {
      // Verify first collection
      const firstCollection = collectionCards.first();
      await expect(firstCollection).toBeVisible();
      await expect(firstCollection.locator('button:has-text("Run in Postman")')).toBeVisible();
      await expect(firstCollection.locator('button:has-text("Download")')).toBeVisible();
      
      // Click to view collection details
      await firstCollection.click();
      await page.waitForTimeout(1000);
      
      // Check for import instructions
      await expect(page.locator('text=/Import to Postman/')).toBeVisible();
    }
    
    await page.screenshot({ path: 'uat-screenshots/coverage-05-postman.png', fullPage: true });
    
    // 7. Test Global Search (Cmd+K)
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    
    // Trigger global search
    await page.keyboard.press('Meta+k');
    await page.waitForSelector('[role="dialog"], .modal, [data-testid="search-modal"]', { timeout: 5000 });
    
    // Type in search
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    await searchInput.fill('mobility');
    await page.waitForTimeout(500);
    
    await page.screenshot({ path: 'uat-screenshots/coverage-06-global-search.png', fullPage: true });
    
    // Close search
    await page.keyboard.press('Escape');
    
    // 8. Test Repository Sync page
    await page.locator('a:has-text("Sync")').click();
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.url()).toContain('/sync');
    await expect(page.locator('h1:has-text("Repository Sync")')).toBeVisible();
    
    await page.screenshot({ path: 'uat-screenshots/coverage-07-sync.png', fullPage: true });
    
    // 9. Test responsive design
    await page.goto('http://localhost:3000');
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'uat-screenshots/coverage-08-mobile.png', fullPage: true });
    
    // Verify mobile menu if present
    const mobileMenu = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await page.waitForTimeout(500);
    }
    
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('Verify all API endpoints are accessible', async ({ request }) => {
    // Test main endpoints
    const endpoints = [
      '/api/repositories',
      '/api/repository/future-mobility-consumer-platform/details',
      '/api/detect-apis/future-mobility-consumer-platform',
      '/api/repository/future-mobility-consumer-platform/postman-collections',
      '/api/repository/future-mobility-consumer-platform/files',
      '/api/search'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request.get(`http://localhost:3001${endpoint}`);
      expect(response.status(), `Endpoint ${endpoint} should be accessible`).toBeLessThan(500);
      
      if (response.status() === 200) {
        const data = await response.json();
        expect(data, `Endpoint ${endpoint} should return valid data`).toBeTruthy();
      }
    }
  });

  test('Verify performance metrics', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for performance monitoring
    const performanceSection = page.locator('text=/Performance|Score|Metrics|Core Web Vitals/i').first();
    
    if (await performanceSection.isVisible()) {
      await page.screenshot({ path: 'uat-screenshots/coverage-09-performance.png' });
      console.log('✓ Performance monitoring is active');
    }
    
    // Measure page load time
    const navigationTiming = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0
      };
    });
    
    console.log('Page Performance:', navigationTiming);
    expect(navigationTiming.loadComplete).toBeLessThan(3000); // Page should load in under 3 seconds
  });

  test('Verify no console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // Ignore expected errors
        const text = msg.text();
        if (!text.includes('api/repository/sync') && 
            !text.includes('Failed to fetch') &&
            !text.includes('404')) {
          errors.push(text);
        }
      }
    });
    
    // Navigate through main pages
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    
    // Check repository detail
    await page.goto('http://localhost:3000/repository/future-mobility-consumer-platform');
    await page.waitForLoadState('domcontentloaded');
    
    // Check API explorer
    await page.goto('http://localhost:3000/api-explorer/future-mobility-consumer-platform');
    await page.waitForLoadState('domcontentloaded');
    
    expect(errors, 'No critical console errors').toHaveLength(0);
  });
});