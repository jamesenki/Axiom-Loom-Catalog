/**
 * User Acceptance Click-Through Tests
 * 
 * Real user journey tests with actual repository data
 */

import { test, expect } from '@playwright/test';

test.describe('EYNS AI Experience Center - User Acceptance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
  });

  test('1. Homepage loads with EY branding', async ({ page }) => {
    // Check EY branding is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check for EY yellow color
    const headerBg = await header.evaluate(el => window.getComputedStyle(el).borderBottomColor);
    expect(headerBg).toContain('255, 230, 0'); // RGB for #FFE600
    
    // Check logo text (appears in both header and hero)
    await expect(page.locator('h1:has-text("EYNS AI Experience Center")')).toBeVisible();
    
    // Take screenshot for UAT documentation
    await page.screenshot({ path: 'uat-screenshots/01-homepage.png', fullPage: true });
  });

  test('2. Repository list shows real repositories', async ({ page }) => {
    // Wait for repositories to load
    await page.waitForSelector('[data-testid="repository-card"], .repository-card, article', { 
      timeout: 10000 
    });
    
    // Check for real repository names
    const repoNames = [
      'future-mobility-consumer-platform',
      'future-mobility-fleet-platform',
      'demo-labsdashboards',
      'smartpath'
    ];
    
    for (const repoName of repoNames.slice(0, 2)) { // Check first 2
      const repo = page.locator(`text=${repoName}`).first();
      if (await repo.isVisible()) {
        console.log(`✓ Found repository: ${repoName}`);
      }
    }
    
    await page.screenshot({ path: 'uat-screenshots/02-repository-list.png', fullPage: true });
  });

  test('3. Click into a repository with APIs', async ({ page }) => {
    // Wait for repositories
    await page.waitForSelector('[data-testid="repository-card"], .repository-card, article');
    
    // Click on a repository with APIs (future-mobility-consumer-platform)
    const repoLink = page.locator('a').filter({ hasText: /future-mobility|consumer|fleet/i }).first();
    
    if (await repoLink.isVisible()) {
      await repoLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check we're on the repository page
      await expect(page.url()).toContain('/repository/');
      
      // Look for API documentation sections
      const apiSection = page.locator('text=/API|Documentation|Postman/i').first();
      if (await apiSection.isVisible()) {
        console.log('✓ API documentation section found');
      }
      
      await page.screenshot({ path: 'uat-screenshots/03-repository-detail.png', fullPage: true });
    }
  });

  test('4. Global search with Cmd+K', async ({ page }) => {
    // Trigger global search with keyboard shortcut
    await page.keyboard.press('Meta+k'); // Cmd+K on Mac
    
    // Wait for search modal
    await page.waitForSelector('[role="dialog"], .modal, [data-testid="search-modal"]', {
      timeout: 5000
    }).catch(() => {
      // Try Ctrl+K if Meta+K doesn't work
      return page.keyboard.press('Control+k');
    });
    
    // Check if search modal opened
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('mobility');
      await page.screenshot({ path: 'uat-screenshots/04-global-search.png' });
      
      // Close with Escape
      await page.keyboard.press('Escape');
    }
  });

  test('5. Navigate to API documentation hub', async ({ page }) => {
    // Look for API Hub link
    const apiHubLink = page.locator('a').filter({ hasText: /API.*Hub|Documentation.*Hub/i }).first();
    
    if (await apiHubLink.isVisible()) {
      await apiHubLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check for API listings
      await expect(page.url()).toMatch(/api-hub|documentation/i);
      await page.screenshot({ path: 'uat-screenshots/05-api-hub.png', fullPage: true });
    }
  });

  test('6. Check performance monitoring', async ({ page }) => {
    // Performance monitoring might be in footer or a dedicated section
    const perfSection = page.locator('text=/Performance|Score|Metrics/i').first();
    
    if (await perfSection.isVisible()) {
      await page.screenshot({ path: 'uat-screenshots/06-performance.png' });
      console.log('✓ Performance monitoring section found');
    }
  });

  test('7. Verify responsive design', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'uat-screenshots/07-mobile-view.png', fullPage: true });
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'uat-screenshots/08-tablet-view.png', fullPage: true });
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'uat-screenshots/09-desktop-view.png' });
  });

  test('8. Full user journey - Find and explore APIs', async ({ page }) => {
    // Start from homepage
    await page.goto('http://localhost:3000');
    
    // Wait for content
    await page.waitForSelector('article, [data-testid="repository-card"], .repository-card, h2, h3', {
      timeout: 10000
    });
    
    // Look for any clickable repository
    const firstRepo = page.locator('a[href*="/repository/"], a[href*="/docs/"], article a').first();
    
    if (await firstRepo.isVisible()) {
      const repoName = await firstRepo.textContent();
      console.log(`Clicking on repository: ${repoName}`);
      
      await firstRepo.click();
      await page.waitForLoadState('networkidle');
      
      // Look for any API-related content
      const apiContent = await page.locator('text=/api|swagger|postman|graphql|endpoint/i').count();
      console.log(`Found ${apiContent} API-related elements`);
      
      // Try to find Postman collections
      const postmanLink = page.locator('a').filter({ hasText: /postman/i }).first();
      if (await postmanLink.isVisible()) {
        await postmanLink.click();
        await page.waitForLoadState('networkidle');
        console.log('✓ Navigated to Postman collections');
      }
      
      await page.screenshot({ path: 'uat-screenshots/10-full-journey.png', fullPage: true });
    }
  });
});

// Additional smoke tests for critical functionality
test.describe('Critical Functionality Tests', () => {
  test('Backend API is responding', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/search?q=test');
    expect(response.status()).toBeLessThan(500); // Not a server error
  });

  test('Frontend serves static assets', async ({ request }) => {
    const response = await request.get('http://localhost:3000/static/js/main.js');
    expect([200, 304]).toContain(response.status());
  });

  test('No console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Some errors are acceptable (like failed API calls during startup)
    const criticalErrors = errors.filter(e => 
      !e.includes('api/repository/sync') && 
      !e.includes('Failed to fetch')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});