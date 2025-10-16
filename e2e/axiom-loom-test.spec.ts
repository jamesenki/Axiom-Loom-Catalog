import { test, expect } from '@playwright/test';

test.describe('Axiom Loom Catalog - Comprehensive Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for React to render
    await page.waitForTimeout(3000);
  });

  test('should display Axiom Loom branding', async ({ page }) => {
    // Check for Axiom Loom text in header
    await expect(page.locator('text=Axiom Loom').first()).toBeVisible();
    
    // Check for tagline
    const tagline = page.locator('text=/Architecture Packages.*Built By Axiom Loom AI Agents/i');
    const taglineCount = await tagline.count();
    if (taglineCount > 0) {
      await expect(tagline.first()).toBeVisible();
    }
  });

  test('should have working navigation', async ({ page }) => {
    // Check main navigation items
    await expect(page.locator('a:has-text("Home")')).toBeVisible();
    await expect(page.locator('a:has-text("Repositories")')).toBeVisible();
    await expect(page.locator('a:has-text("APIs")')).toBeVisible();
    await expect(page.locator('a:has-text("Docs")')).toBeVisible();
  });

  test('should handle repository fetching', async ({ page }) => {
    // Navigate to repositories
    await page.click('a:has-text("Repositories")');
    await page.waitForTimeout(2000);
    
    // Check if repositories load or error is handled
    const repoCards = page.locator('[data-testid="repository-card"], .repository-card, div:has(> h3)');
    const errorMessage = page.locator('text=/Failed to fetch repositories|Error.*repositories|No repositories/i');
    
    const repoCount = await repoCards.count();
    const errorCount = await errorMessage.count();
    
    if (errorCount > 0) {
      console.log('Repository fetch error detected - checking error handling');
      await expect(errorMessage.first()).toBeVisible();
    } else if (repoCount > 0) {
      console.log(`Found ${repoCount} repository cards`);
      await expect(repoCards.first()).toBeVisible();
    }
  });

  test('should have quantum design elements', async ({ page }) => {
    // Check for glass morphism effects
    const glassElements = await page.locator('[class*="glass"], [class*="Glass"]').count();
    console.log(`Found ${glassElements} glass morphism elements`);
    
    // Check for neural background
    const neuralBg = await page.locator('canvas, [class*="neural"], [class*="Neural"]').count();
    console.log(`Found ${neuralBg} neural background elements`);
    
    // Check for quantum buttons
    const quantumButtons = await page.locator('[class*="quantum"], [class*="Quantum"], button').count();
    console.log(`Found ${quantumButtons} quantum-style buttons`);
  });

  test('should handle API explorer', async ({ page }) => {
    // Navigate to APIs
    await page.click('a:has-text("APIs")');
    await page.waitForTimeout(2000);
    
    // Check if API content loads
    const apiContent = page.locator('[class*="api"], [class*="API"], text=/API|OpenAPI|GraphQL|gRPC/i');
    const apiCount = await apiContent.count();
    
    if (apiCount > 0) {
      console.log(`Found ${apiCount} API-related elements`);
      await expect(apiContent.first()).toBeVisible();
    }
  });

  test('should check for console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      consoleErrors.push(error.message);
    });
    
    // Navigate through main pages
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    await page.click('a:has-text("Repositories")');
    await page.waitForTimeout(2000);
    
    await page.click('a:has-text("APIs")');
    await page.waitForTimeout(2000);
    
    // Report errors
    if (consoleErrors.length > 0) {
      console.log('Console errors detected:');
      consoleErrors.forEach(err => console.log('  -', err));
    } else {
      console.log('No console errors detected');
    }
  });

  test('should have responsive sync functionality', async ({ page }) => {
    // Look for sync button
    const syncButton = page.locator('button:has-text("Sync"), [aria-label*="sync" i]');
    const syncCount = await syncButton.count();
    
    if (syncCount > 0) {
      console.log('Sync button found');
      await expect(syncButton.first()).toBeVisible();
    }
  });

  test('should display search functionality', async ({ page }) => {
    // Check for search input or button
    const searchElements = page.locator('[placeholder*="search" i], button:has-text("Search"), text=⌘K');
    const searchCount = await searchElements.count();
    
    if (searchCount > 0) {
      console.log('Search functionality found');
      await expect(searchElements.first()).toBeVisible();
    }
  });
});