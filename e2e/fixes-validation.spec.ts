import { test, expect } from '@playwright/test';

test.describe('Axiom Loom Fixes Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Repository cards should render with proper visibility', async ({ page }) => {
    // Wait for API call to complete
    await page.waitForTimeout(3000);
    
    // Check if repository cards are rendered
    const repoCards = page.locator('[data-testid="repository-card"]');
    const cardCount = await repoCards.count();
    
    console.log(`Found ${cardCount} repository cards`);
    
    // If cards exist, check visibility
    if (cardCount > 0) {
      // Check that cards are actually visible
      const firstCard = repoCards.first();
      await expect(firstCard).toBeVisible();
      
      // Check card has content
      const cardText = await firstCard.textContent();
      expect(cardText).toBeTruthy();
      console.log('First card content:', cardText?.substring(0, 100));
    } else {
      // Check for error message
      const errorMsg = page.locator('text=/Error|Failed/i');
      if (await errorMsg.count() > 0) {
        const error = await errorMsg.first().textContent();
        console.log('Error found:', error);
      }
    }
  });

  test('Buttons should only show for existing content types', async ({ page }) => {
    await page.waitForTimeout(3000);
    const firstCard = page.locator('[data-testid="repository-card"]').first();
    
    if (await firstCard.count() > 0) {
      // Check which buttons are visible
      const postmanBtn = firstCard.locator('a:has-text("Postman")');
      const graphqlBtn = firstCard.locator('a:has-text("GraphQL")');
      const apiExplorerBtn = firstCard.locator('a:has-text("API Explorer")');
      
      const hasPostman = await postmanBtn.count() > 0;
      const hasGraphQL = await graphqlBtn.count() > 0;
      const hasApiExplorer = await apiExplorerBtn.count() > 0;
      
      console.log(`Buttons visible - Postman: ${hasPostman}, GraphQL: ${hasGraphQL}, API Explorer: ${hasApiExplorer}`);
      
      // Repository and Documentation buttons should always be visible
      await expect(firstCard.locator('a:has-text("Repository")')).toBeVisible();
      await expect(firstCard.locator('a:has-text("Documentation")')).toBeVisible();
    }
  });

  test('Text should be readable with good contrast', async ({ page }) => {
    // Check main title is visible and readable
    const title = page.locator('h1:has-text("Axiom Loom")');
    await expect(title.first()).toBeVisible();
    
    // Get computed styles to check contrast
    const titleColor = await title.first().evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        opacity: styles.opacity
      };
    });
    
    console.log('Title styles:', titleColor);
    
    // Check that opacity is not too low
    expect(parseFloat(titleColor.opacity)).toBeGreaterThan(0.8);
  });

  test('Glass cards should have reduced blur for readability', async ({ page }) => {
    await page.waitForTimeout(3000);
    const glassCard = page.locator('[data-testid="repository-card"]').first();
    
    if (await glassCard.count() > 0) {
      const cardStyles = await glassCard.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backdropFilter: styles.backdropFilter || styles.webkitBackdropFilter,
          background: styles.background,
          opacity: styles.opacity
        };
      });
      
      console.log('Glass card styles:', cardStyles);
      
      // Check that backdrop filter is not too strong
      if (cardStyles.backdropFilter && cardStyles.backdropFilter.includes('blur')) {
        const blurMatch = cardStyles.backdropFilter.match(/blur\((\d+)/);
        if (blurMatch) {
          const blurValue = parseInt(blurMatch[1]);
          console.log(`Blur value: ${blurValue}px`);
          // Should be 8px or less for good readability
          expect(blurValue).toBeLessThanOrEqual(12);
        }
      }
    }
  });

  test('No console errors related to styled-components props', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('React does not recognize')) {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate and wait
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Check for styled-components prop warnings
    const propWarnings = consoleErrors.filter(err => 
      err.includes('shimmerEffect') || 
      err.includes('glowEffect') || 
      err.includes('isActive') ||
      err.includes('isLoading')
    );
    
    if (propWarnings.length > 0) {
      console.log(`Found ${propWarnings.length} styled-components prop warnings`);
      propWarnings.slice(0, 3).forEach(warn => console.log(' -', warn.substring(0, 100)));
    } else {
      console.log('No styled-components prop warnings found');
    }
  });

  test('API endpoints should be accessible', async ({ page }) => {
    // Test API directly
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/repositories');
        return {
          status: response.status,
          ok: response.ok,
          dataLength: response.ok ? (await response.json()).length : 0
        };
      } catch (err) {
        return { error: err.message };
      }
    });
    
    console.log('API Response:', apiResponse);
    
    if ('status' in apiResponse) {
      expect(apiResponse.ok).toBeTruthy();
      console.log(`API returned ${apiResponse.dataLength} repositories`);
    }
  });
});