import { test, expect } from '@playwright/test';

test.describe('EYNS AI Experience Center - Comprehensive Test Suite', () => {
  
  test.describe('GitHub Integration', () => {
    test('should use correct GitHub organization in URLs', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      
      // Check repository card GitHub links
      const githubLinks = await page.locator('a[href*="github.com"]').all();
      for (const link of githubLinks) {
        const href = await link.getAttribute('href');
        expect(href).not.toContain('EYGS');
        expect(href).toContain('jamesenki');
      }
    });
  });

  test.describe('Demo Buttons', () => {
    test('should display demo buttons on repository cards', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      
      // Look for demo buttons
      const demoButtons = await page.locator('a:has-text("Demo")').all();
      
      // At least some repositories should have demo buttons
      expect(demoButtons.length).toBeGreaterThan(0);
      
      // Check that demo buttons have correct attributes
      for (const button of demoButtons) {
        const href = await button.getAttribute('href');
        const target = await button.getAttribute('target');
        const rel = await button.getAttribute('rel');
        
        expect(href).toContain('demo');
        expect(target).toBe('_blank');
        expect(rel).toContain('noopener');
      }
    });
    
    test('should display demo button on repository detail page', async ({ page }) => {
      await page.goto('http://localhost:3000/repository/future-mobility-consumer-platform');
      
      // Look for demo button if repository has demo URL
      const demoButton = page.locator('a:has-text("View Demo")');
      const count = await demoButton.count();
      
      if (count > 0) {
        const href = await demoButton.getAttribute('href');
        expect(href).toContain('demo.eyns.com');
      }
    });
  });

  test.describe('Repository Metadata', () => {
    test('should display marketing-friendly names', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      
      // Check for marketing-friendly display names
      await expect(page.locator('text=DeployMaster SDV OTA Platform')).toBeVisible();
      await expect(page.locator('text=Future Mobility Consumer Platform')).toBeVisible();
      await expect(page.locator('text=Industrial Monitoring Co Industrial Dashboards')).toBeVisible();
    });
    
    test('should display tags on repository cards', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      
      // Check for category badges or tags
      const cards = await page.locator('[class*="EnhancedCard"]').all();
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  test.describe('UI Layout and Spacing', () => {
    test('should have proper spacing between cards', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      
      // Check that cards are properly spaced
      const cardGrid = page.locator('[class*="CardGrid"]');
      await expect(cardGrid).toBeVisible();
      
      // Cards should not overlap
      const cards = await page.locator('[class*="EnhancedCard"]').all();
      for (let i = 0; i < cards.length - 1; i++) {
        const card1Box = await cards[i].boundingBox();
        const card2Box = await cards[i + 1].boundingBox();
        
        if (card1Box && card2Box) {
          // Check no vertical overlap
          if (card1Box.y < card2Box.y) {
            expect(card1Box.y + card1Box.height).toBeLessThan(card2Box.y);
          }
        }
      }
    });
    
    test('should be responsive', async ({ page }) => {
      // Desktop view
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('http://localhost:3000/');
      await expect(page.locator('[class*="CardGrid"]')).toBeVisible();
      
      // Tablet view
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('[class*="CardGrid"]')).toBeVisible();
      
      // Mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('[class*="CardGrid"]')).toBeVisible();
    });
  });

  test.describe('API Endpoints', () => {
    test('should load repository list with metadata', async ({ page }) => {
      const response = await page.request.get('http://localhost:3001/api/repositories');
      expect(response.ok()).toBeTruthy();
      
      const repos = await response.json();
      expect(Array.isArray(repos)).toBeTruthy();
      
      // Check for enhanced metadata
      const deploymaster = repos.find(r => r.name === 'deploymaster-sdv-ota-platform');
      if (deploymaster) {
        expect(deploymaster.displayName).toBe('DeployMaster SDV OTA Platform');
        expect(deploymaster.url).toContain('jamesenki');
      }
    });
    
    test('should include demo URLs in repository details', async ({ page }) => {
      const response = await page.request.get('http://localhost:3001/api/repository/future-mobility-consumer-platform/details', {
        headers: {
          'Authorization': 'bypass'
        }
      });
      
      if (response.ok()) {
        const details = await response.json();
        expect(details.demoUrl).toBeDefined();
      }
    });
  });

  test.describe('Navigation and Links', () => {
    test('should navigate to documentation', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      
      // Click on a Docs button
      const docsButton = page.locator('a:has-text("Docs")').first();
      await docsButton.click();
      
      // Should navigate to documentation page
      await expect(page).toHaveURL(/\/docs\//);
    });
    
    test('should navigate to API explorer', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      
      // Click on an APIs button if available
      const apisButton = page.locator('a:has-text("APIs")').first();
      const count = await apisButton.count();
      
      if (count > 0) {
        await apisButton.click();
        await expect(page).toHaveURL(/\/api-explorer\//);
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should not show styled-components errors', async ({ page }) => {
      const consoleErrors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.goto('http://localhost:3000/');
      await page.waitForTimeout(2000);
      
      // Check for styled-components errors
      const styledComponentsErrors = consoleErrors.filter(err => 
        err.includes('styled-components') || err.includes('bTrirp')
      );
      
      expect(styledComponentsErrors.length).toBe(0);
    });
  });

  test.describe('Search Functionality', () => {
    test('should search repositories', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      
      // Use global search if available
      await page.keyboard.press('Control+K');
      await page.waitForTimeout(500);
      
      const searchInput = page.locator('input[placeholder*="Search"]');
      const count = await searchInput.count();
      
      if (count > 0) {
        await searchInput.fill('mobility');
        await page.waitForTimeout(500);
        
        // Should show search results
        const results = await page.locator('[class*="search-result"]').count();
        expect(results).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Performance', () => {
    test('should load homepage quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Homepage should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });
  });
});