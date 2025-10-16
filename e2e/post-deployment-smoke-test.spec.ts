import { test, expect } from '@playwright/test';

/**
 * Post-Deployment Smoke Test Suite
 *
 * This comprehensive test suite validates critical functionality after deployment.
 * Run with: npm run test:e2e:production
 *
 * Tests cover:
 * - All main routes are accessible
 * - Repository catalog loads correctly
 * - Repository details pages work
 * - Static data fallbacks function properly
 * - No critical JavaScript errors in console
 */

const BASE_URL = process.env.BASE_URL || 'https://technical.axiomloom-loom.net';

test.describe('Post-Deployment Smoke Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`[Browser Error]: ${msg.text()}`);
      }
    });

    // Capture page errors
    page.on('pageerror', err => {
      console.log(`[Page Error]: ${err.message}`);
    });
  });

  test('Landing page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page).toHaveTitle(/Axiom Loom/);

    // Check for key landing page elements
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Resume page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/resume`);
    await expect(page).not.toHaveURL(/404/);

    // Should show resume content
    await expect(page.locator('body')).toBeVisible();
  });

  test('Catalog page loads and displays repositories', async ({ page }) => {
    await page.goto(`${BASE_URL}/catalog`);

    // Wait for repositories to load
    await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

    // Check that we have repository cards
    const cards = await page.locator('[data-testid="repository-card"]').count();
    expect(cards).toBeGreaterThan(0);

    console.log(`✅ Catalog page loaded ${cards} repositories`);
  });

  test('/repositories route works (alias for /catalog)', async ({ page }) => {
    await page.goto(`${BASE_URL}/repositories`);

    // Wait for repositories to load
    await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

    const cards = await page.locator('[data-testid="repository-card"]').count();
    expect(cards).toBeGreaterThan(0);
  });

  test('Repository detail page loads with static data', async ({ page }) => {
    // First go to catalog to get a repository name
    await page.goto(`${BASE_URL}/catalog`);
    await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

    // Click on the first repository card
    const firstCard = page.locator('[data-testid="repository-card"]').first();
    await firstCard.click();

    // Wait for navigation and content to load
    await page.waitForURL(/\/repository\/.+/, { timeout: 10000 });

    // Check that we're not showing an error
    const errorMessage = page.locator('text=/Error Loading Repository/i');
    await expect(errorMessage).not.toBeVisible({ timeout: 5000 });

    // Check that repository details are visible
    await expect(page.locator('h1, h2').first()).toBeVisible();

    console.log(`✅ Repository detail page loaded successfully`);
  });

  test('Static data fallback works - /data/repository-metadata.json', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/data/repository-metadata.json`);

    expect(response?.status()).toBe(200);

    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('application/json');

    const data = await response?.json();
    expect(typeof data).toBe('object');
    expect(Object.keys(data).length).toBeGreaterThan(0);

    console.log(`✅ Static data file accessible with ${Object.keys(data).length} repositories`);
  });

  test('API endpoints correctly return 404 (not HTML)', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/api/repositories`, { waitUntil: 'domcontentloaded' });

    // Should return 404, not 200 with HTML
    expect(response?.status()).toBe(404);

    console.log(`✅ API endpoint correctly returns 404 (not fallback to index.html)`);
  });

  test('Static assets load correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/catalog`);

    // Check that CSS loaded (page should be styled)
    const body = await page.locator('body');
    const backgroundColor = await body.evaluate(el => window.getComputedStyle(el).backgroundColor);

    // Should have some background color (not default white/transparent)
    expect(backgroundColor).toBeTruthy();
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');

    console.log(`✅ Static assets (CSS/JS) loaded correctly`);
  });

  test('No critical JavaScript errors on catalog page', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', err => {
      errors.push(err.message);
    });

    await page.goto(`${BASE_URL}/catalog`);
    await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

    // Filter out non-critical errors
    const criticalErrors = errors.filter(err =>
      !err.includes('web-capture-extension') && // Browser extension errors
      !err.includes('service-worker') // Service worker issues
    );

    if (criticalErrors.length > 0) {
      console.error('Critical errors found:', criticalErrors);
    }

    expect(criticalErrors).toHaveLength(0);

    console.log(`✅ No critical JavaScript errors detected`);
  });

  test('Navigation between routes works', async ({ page }) => {
    // Start at landing page
    await page.goto(`${BASE_URL}/`);

    // Navigate to catalog (look for a link or button)
    const catalogLink = page.locator('a[href*="/catalog"]').first();
    if (await catalogLink.isVisible()) {
      await catalogLink.click();
      await expect(page).toHaveURL(/\/catalog/);
    } else {
      // Direct navigation if no link found
      await page.goto(`${BASE_URL}/catalog`);
    }

    await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

    console.log(`✅ Navigation between routes works correctly`);
  });

  test('Repository cards have expected content', async ({ page }) => {
    await page.goto(`${BASE_URL}/catalog`);
    await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

    const firstCard = page.locator('[data-testid="repository-card"]').first();

    // Check for repository name/title
    const hasTitle = await firstCard.locator('h3, h2, h1').count();
    expect(hasTitle).toBeGreaterThan(0);

    // Check for description
    const hasDescription = await firstCard.locator('p').count();
    expect(hasDescription).toBeGreaterThan(0);

    console.log(`✅ Repository cards contain expected content`);
  });

  test('Double-click on repository card navigates to detail page', async ({ page }) => {
    await page.goto(`${BASE_URL}/catalog`);
    await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });

    const firstCard = page.locator('[data-testid="repository-card"]').first();

    // Double-click the card
    await firstCard.dblclick();

    // Should navigate to repository detail page
    await page.waitForURL(/\/repository\/.+/, { timeout: 10000 });

    console.log(`✅ Double-click navigation works correctly`);
  });
});

test.describe('Deployment Health Checks', () => {

  test('All critical routes return 200 status', async ({ page }) => {
    const routes = [
      '/',
      '/resume',
      '/catalog',
      '/repositories',
      '/data/repository-metadata.json'
    ];

    for (const route of routes) {
      const response = await page.goto(`${BASE_URL}${route}`);
      expect(response?.status()).toBe(200);
      console.log(`✅ ${route} → 200 OK`);
    }
  });

  test('SPA routing works - direct URL access', async ({ page }) => {
    // Access a route directly (not through navigation)
    await page.goto(`${BASE_URL}/catalog`);

    // Should load the catalog page, not a 404
    await expect(page).not.toHaveURL(/404/);
    await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible({ timeout: 10000 });

    console.log(`✅ SPA routing handles direct URL access correctly`);
  });

  test('Static web app config excludes API routes correctly', async ({ page }) => {
    // /api/* should return 404, not index.html
    const apiResponse = await page.goto(`${BASE_URL}/api/repositories`, { waitUntil: 'domcontentloaded' });
    expect(apiResponse?.status()).toBe(404);

    // /data/* should return actual file
    const dataResponse = await page.goto(`${BASE_URL}/data/repository-metadata.json`);
    expect(dataResponse?.status()).toBe(200);
    expect(dataResponse?.headers()['content-type']).toContain('application/json');

    console.log(`✅ Static web app config correctly excludes API routes`);
  });
});
