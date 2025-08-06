/**
 * Chaos Engineering Tests - QA Agent Implementation
 * Tests system resilience under adverse conditions
 */

import { test, expect, Page } from '@playwright/test';

class ChaosTests {
  static async runChaosScenarios(page: Page) {
    const scenarios = [
      this.randomAPIFailures,
      this.slowNetworkResponses,
      this.corruptedData,
      this.clockSkew,
      this.resourceExhaustion,
    ];

    for (const scenario of scenarios) {
      console.log(`Running chaos scenario: ${scenario.name}`);
      await scenario(page);
    }
  }

  static async randomAPIFailures(page: Page) {
    // Randomly fail 30% of API calls
    await page.route('**/api/**', (route) => {
      if (Math.random() < 0.3) {
        route.fulfill({ 
          status: 500, 
          body: JSON.stringify({ error: 'Chaos Engineering: Random failure' })
        });
      } else {
        route.continue();
      }
    });

    // App should gracefully handle failures
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Should show error states, not crash
    const errorStates = await page.locator('[data-testid="error-state"]').count();
    const whiteScreen = await page.locator('body').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor === 'rgb(255, 255, 255)' && 
             el.textContent?.trim() === '';
    });
    
    expect(whiteScreen).toBe(false);
  }

  static async slowNetworkResponses(page: Page) {
    // Add random delays to responses
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 5000));
      await route.continue();
    });

    // App should show loading states and not freeze
    await page.goto('/');
    
    // Should show loading indicators
    const loadingIndicator = await page.locator('[data-testid="loading"]').first();
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 });
    
    // UI should remain responsive
    const button = await page.locator('button').first();
    if (await button.isVisible()) {
      await button.click({ timeout: 100 });
    }
  }

  static async corruptedData(page: Page) {
    // Return malformed JSON randomly
    await page.route('**/api/**', (route) => {
      const corrupt = Math.random() < 0.3;
      if (corrupt) {
        route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: '{"data": "corrupted"' // Missing closing brace
        });
      } else {
        route.continue();
      }
    });

    // App should handle parse errors gracefully
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Should not show white screen of death
    const hasContent = await page.locator('body').evaluate((el) => {
      return el.textContent?.trim().length > 0;
    });
    expect(hasContent).toBe(true);
  }

  static async clockSkew(page: Page) {
    // Simulate clock skew
    await page.addInitScript(() => {
      const originalDate = Date;
      const skew = 1000 * 60 * 60 * 24 * 365; // 1 year
      
      window.Date = new Proxy(Date, {
        construct(target, args) {
          if (args.length === 0) {
            return new originalDate(originalDate.now() + skew);
          }
          return new originalDate(...args);
        }
      });
      
      window.Date.now = () => originalDate.now() + skew;
    });

    await page.goto('/');
    
    // App should handle time differences
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));
    await page.waitForTimeout(2000);
    
    expect(errors).toHaveLength(0);
  }

  static async resourceExhaustion(page: Page) {
    // Simulate memory pressure
    await page.addInitScript(() => {
      const arrays = [];
      const exhaust = () => {
        try {
          // Allocate 10MB chunks
          arrays.push(new Array(10 * 1024 * 1024 / 8));
          if (arrays.length < 50) { // Max 500MB
            setTimeout(exhaust, 100);
          }
        } catch (e) {
          console.log('Memory exhaustion reached');
        }
      };
      setTimeout(exhaust, 1000);
    });

    await page.goto('/');
    
    // App should remain functional under memory pressure
    await page.waitForTimeout(3000);
    const isResponsive = await page.evaluate(() => {
      return document.readyState === 'complete';
    });
    
    expect(isResponsive).toBe(true);
  }
}

// Individual chaos test cases
test.describe('Chaos Engineering Tests', () => {
  test('handles random API failures gracefully', async ({ page }) => {
    await ChaosTests.randomAPIFailures(page);
  });

  test('remains responsive under slow network', async ({ page }) => {
    await ChaosTests.slowNetworkResponses(page);
  });

  test('handles corrupted API responses', async ({ page }) => {
    await ChaosTests.corruptedData(page);
  });

  test('works with clock skew', async ({ page }) => {
    await ChaosTests.clockSkew(page);
  });

  test('survives resource exhaustion', async ({ page }) => {
    await ChaosTests.resourceExhaustion(page);
  });

  test('handles concurrent failures', async ({ page }) => {
    // Combine multiple chaos scenarios
    await page.route('**/api/**', (route) => {
      const scenario = Math.random();
      
      if (scenario < 0.2) {
        // Fail
        route.fulfill({ status: 500 });
      } else if (scenario < 0.4) {
        // Slow
        setTimeout(() => route.continue(), 3000);
      } else if (scenario < 0.5) {
        // Corrupt
        route.fulfill({
          status: 200,
          body: '{"invalid json'
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/');
    await page.waitForTimeout(5000);
    
    // Should still have a functioning UI
    const hasUI = await page.locator('[data-testid="app-container"], #root, .App').count();
    expect(hasUI).toBeGreaterThan(0);
  });
});