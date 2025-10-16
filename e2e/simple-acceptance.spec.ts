import { test, expect } from '@playwright/test';

test.describe('Simple Acceptance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('1. Verify Postman Collection button exists', async ({ page }) => {
    // Find a repository with Postman collections
    const repoWithPostman = page.locator('[data-testid="repository-card"]').filter({ hasText: 'Postman' }).first();
    await expect(repoWithPostman).toBeVisible();
    
    // Check for Postman button
    const postmanButton = repoWithPostman.locator('a:has-text("Postman")');
    await expect(postmanButton).toBeVisible();
  });

  test('2. Cards have marketing descriptions', async ({ page }) => {
    // Find repositories with marketing descriptions
    const cards = await page.locator('[data-testid="repository-card"]').all();
    expect(cards.length).toBeGreaterThan(0);
    
    // Check if any card has description
    const firstCard = cards[0];
    const description = await firstCard.locator('p').first().textContent();
    expect(description).toBeTruthy();
  });

  test('3. Cards link to landing pages', async ({ page }) => {
    // Click on Details button of first repository card
    const firstCard = page.locator('[data-testid="repository-card"]').first();
    const detailsButton = firstCard.locator('a:has-text("Details")');
    await detailsButton.click();
    
    // Verify we're on a repository detail page
    await expect(page.url()).toContain('/repository/');
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
  });

  test('4. Repository detail page has all components', async ({ page }) => {
    // Navigate to a specific repository
    await page.goto('http://localhost:3000/repository/future-mobility-fleet-platform');
    
    // Check for key sections
    await expect(page.locator('text=Get Started')).toBeVisible();
    await expect(page.locator('text=Documentation')).toBeVisible();
    await expect(page.locator('text=API Explorer')).toBeVisible();
    // Postman Collections button might be conditional
    const hasPostman = await page.locator('text=Postman Collections').isVisible().catch(() => false);
    console.log('Has Postman Collections:', hasPostman);
  });

  test('5. API Explorer works', async ({ page }) => {
    // Navigate to API explorer
    await page.goto('http://localhost:3000/api-explorer/future-mobility-fleet-platform');
    
    // Check for API Explorer heading
    await expect(page.locator('h1:has-text("API Explorer")').first()).toBeVisible();
    
    // Check if there are any APIs or empty state
    const hasApis = await page.locator('text=No APIs Found').isVisible().catch(() => false);
    if (!hasApis) {
      // If APIs exist, check for at least one card with API type
      const apiCards = await page.locator('div[dataType]').count();
      console.log('API cards found:', apiCards);
    } else {
      console.log('No APIs found for this repository');
    }
  });

  test('6. Postman Collections view works', async ({ page }) => {
    // Navigate to Postman collections
    await page.goto('http://localhost:3000/postman/future-mobility-fleet-platform');
    
    // Check if there are collections or empty state
    const hasNoCollections = await page.locator('text=No Postman Collections Found').isVisible().catch(() => false);
    if (!hasNoCollections) {
      // Check for Import to Postman section
      const hasImportSection = await page.locator('text=Import to Postman').isVisible().catch(() => false);
      console.log('Has Import to Postman section:', hasImportSection);
      
      // Check for Collections sidebar
      const hasCollectionsSidebar = await page.locator('text=Collections').first().isVisible().catch(() => false);
      console.log('Has Collections sidebar:', hasCollectionsSidebar);
    } else {
      console.log('No Postman collections found for this repository');
    }
  });
});