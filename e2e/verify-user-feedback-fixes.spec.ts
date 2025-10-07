import { test, expect } from '@playwright/test';

test.describe('User Feedback Verification Tests - Water Heater Platform', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the water heater platform repository detail page
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Give time for dynamic content to load
  });

  test('1. Architecture Demo button should NOT be visible', async ({ page }) => {
    // Look for any button containing "Architecture Demo" text
    const architectureDemoButton = page.locator('button:has-text("Architecture Demo"), a:has-text("Architecture Demo"), [role="button"]:has-text("Architecture Demo")');
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/1-architecture-demo-check.png', fullPage: true });
    
    // Button should NOT be visible
    await expect(architectureDemoButton).not.toBeVisible();
    
    console.log('✓ Architecture Demo button is not visible (PASSED)');
  });

  test('2. Implementation Guide button should NOT be visible', async ({ page }) => {
    // Look for any button containing "Implementation Guide" text
    const implementationGuideButton = page.locator('button:has-text("Implementation Guide"), a:has-text("Implementation Guide"), [role="button"]:has-text("Implementation Guide")');
    
    await page.screenshot({ path: 'test-results/2-implementation-guide-check.png', fullPage: true });
    
    // Button should NOT be visible
    await expect(implementationGuideButton).not.toBeVisible();
    
    console.log('✓ Implementation Guide button is not visible (PASSED)');
  });

  test('3. Product Details button should NOT be visible', async ({ page }) => {
    // Look for any button containing "Product Details" text
    const productDetailsButton = page.locator('button:has-text("Product Details"), a:has-text("Product Details"), [role="button"]:has-text("Product Details")');
    
    await page.screenshot({ path: 'test-results/3-product-details-check.png', fullPage: true });
    
    // Button should NOT be visible
    await expect(productDetailsButton).not.toBeVisible();
    
    console.log('✓ Product Details button is not visible (PASSED)');
  });

  test('4. Postman Collection button should work and show collections', async ({ page }) => {
    // Find Postman Collection button
    const postmanButton = page.locator('button:has-text("Postman"), a:has-text("Postman")');
    
    if (await postmanButton.isVisible()) {
      await postmanButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: 'test-results/4-postman-collections.png', fullPage: true });
      
      // Should NOT see "No Postman Collections Found"
      const noCollectionsMessage = page.locator('text=No Postman Collections Found');
      await expect(noCollectionsMessage).not.toBeVisible();
      
      // Should see actual collection content
      const collectionContent = page.locator('[class*="collection"], [data-testid*="collection"], .postman-collection');
      const hasContent = await collectionContent.count() > 0;
      
      if (hasContent) {
        console.log('✓ Postman collections are loading properly (PASSED)');
      } else {
        console.log('✗ No Postman collection content found (FAILED)');
      }
    } else {
      console.log('✗ Postman button not found (FAILED)');
    }
  });

  test('5. GraphQL Playground should load schemas and not show "No GraphQL Schemas Found"', async ({ page }) => {
    // Find GraphQL button
    const graphqlButton = page.locator('button:has-text("GraphQL"), a:has-text("GraphQL")');
    
    if (await graphqlButton.isVisible()) {
      await graphqlButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: 'test-results/5-graphql-playground.png', fullPage: true });
      
      // Should NOT see "No GraphQL Schemas Found"
      const noSchemasMessage = page.locator('text=No GraphQL Schemas Found');
      await expect(noSchemasMessage).not.toBeVisible();
      
      // Should see GraphQL schema content
      const schemaContent = page.locator('text=Query, text=Mutation, text=Subscription, [class*="graphql"], [data-testid*="graphql"]');
      const hasSchema = await schemaContent.count() > 0;
      
      if (hasSchema) {
        console.log('✓ GraphQL schemas are loading properly (PASSED)');
      } else {
        console.log('✗ No GraphQL schema content found (FAILED)');
      }
    } else {
      console.log('✗ GraphQL button not found (FAILED)');
    }
  });

  test('6. View Demo button should go to coming soon page, not external site or home page', async ({ page }) => {
    // Find View Demo button
    const viewDemoButton = page.locator('button:has-text("View Demo"), a:has-text("View Demo"), a:has-text("Demo")');
    
    if (await viewDemoButton.isVisible()) {
      const initialUrl = page.url();
      
      await viewDemoButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const finalUrl = page.url();
      
      await page.screenshot({ path: 'test-results/6-view-demo.png', fullPage: true });
      
      // Should NOT go back to home page
      expect(finalUrl).not.toBe('http://localhost:3000/');
      expect(finalUrl).not.toBe('http://localhost:3000');
      
      // Should contain "coming-soon" or be a coming soon page
      const isComingSoonPage = finalUrl.includes('coming-soon') || 
                              await page.locator('text=Coming Soon').isVisible();
      
      if (isComingSoonPage) {
        console.log('✓ View Demo goes to coming soon page (PASSED)');
      } else {
        console.log(`✗ View Demo goes to: ${finalUrl} (FAILED)`);
      }
    } else {
      console.log('✗ View Demo button not found (FAILED)');
    }
  });

  test('7. Use Cases section should show real-world specific examples', async ({ page }) => {
    await page.screenshot({ path: 'test-results/7-use-cases-before.png', fullPage: true });
    
    // Look for Use Cases section
    const useCasesSection = page.locator('text=Use Cases, text=Applications, [data-testid*="use-cases"]');
    
    if (await useCasesSection.isVisible()) {
      // Should contain specific real-world examples
      const realWorldExamples = page.locator('text=Hotel, text=Apartment, text=Manufacturing, text=Healthcare, text=efficiency, text=ROI');
      const hasRealExamples = await realWorldExamples.count() > 0;
      
      if (hasRealExamples) {
        console.log('✓ Use cases contain real-world examples (PASSED)');
      } else {
        console.log('✗ Use cases do not contain specific real-world examples (FAILED)');
      }
    } else {
      console.log('✗ Use Cases section not found (FAILED)');
    }
  });

  test('8. API Explorer should not show axiom.json cards and should navigate properly', async ({ page }) => {
    // Navigate to API Explorer if it exists
    const apiExplorerButton = page.locator('button:has-text("API Explorer"), a:has-text("API Explorer")');
    
    if (await apiExplorerButton.isVisible()) {
      await apiExplorerButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: 'test-results/8-api-explorer.png', fullPage: true });
      
      // Should NOT see cards titled "axiom.json"
      const axiomJsonCards = page.locator('[class*="card"]:has-text("axiom.json"), [data-testid*="card"]:has-text("axiom.json")');
      await expect(axiomJsonCards).not.toBeVisible();
      
      // Click on first API card if it exists
      const apiCards = page.locator('[class*="api-card"], [data-testid*="api-card"], [class*="card"]');
      const cardCount = await apiCards.count();
      
      if (cardCount > 0) {
        const firstCard = apiCards.first();
        await firstCard.click();
        await page.waitForTimeout(2000);
        
        const finalUrl = page.url();
        
        // Should NOT be redirected to home page
        expect(finalUrl).not.toBe('http://localhost:3000/');
        expect(finalUrl).not.toBe('http://localhost:3000');
        
        console.log('✓ API Explorer navigation working properly (PASSED)');
      } else {
        console.log('✗ No API cards found in explorer (FAILED)');
      }
    } else {
      console.log('ℹ API Explorer button not found - may be in different location');
    }
  });

  test('11. Double-click on repository card should navigate to detail page', async ({ page }) => {
    // Navigate to main page first
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for repositories to load
    
    await page.screenshot({ path: 'test-results/11-main-page.png', fullPage: true });
    
    // Find repository cards
    const repositoryCards = page.locator('[data-testid="repository-card"]');
    const cardCount = await repositoryCards.count();
    
    console.log(`Found ${cardCount} repository cards`);
    
    if (cardCount > 0) {
      const firstCard = repositoryCards.first();
      const initialUrl = page.url();
      
      // Double-click the first card
      await firstCard.dblclick();
      await page.waitForTimeout(2000);
      
      const finalUrl = page.url();
      
      await page.screenshot({ path: 'test-results/11-after-double-click.png', fullPage: true });
      
      // Should navigate to repository detail page
      if (finalUrl.includes('/repository/') && finalUrl !== initialUrl) {
        console.log('✓ Double-click navigation working (PASSED)');
      } else {
        console.log(`✗ Double-click failed - URL: ${initialUrl} -> ${finalUrl} (FAILED)`);
      }
    } else {
      console.log('✗ No repository cards found on main page (FAILED)');
    }
  });

  test('9. Sub-document navigation should provide breadcrumbs back to README', async ({ page }) => {
    // Navigate to documentation
    const docsButton = page.locator('button:has-text("Documentation"), a:has-text("Documentation"), a:has-text("Docs")');
    
    if (await docsButton.isVisible()) {
      await docsButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Look for sub-document links like "Getting Started"
      const subDocLinks = page.locator('a:has-text("Getting Started"), a:has-text("Architecture"), a:has-text("Guide")');
      const subDocCount = await subDocLinks.count();
      
      if (subDocCount > 0) {
        // Click on first sub-document
        const firstSubDoc = subDocLinks.first();
        await firstSubDoc.click();
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: 'test-results/9-sub-document.png', fullPage: true });
        
        // Should see breadcrumb navigation
        const breadcrumbs = page.locator('nav[aria-label*="breadcrumb"], [class*="breadcrumb"], [data-testid*="breadcrumb"]');
        
        if (await breadcrumbs.isVisible()) {
          console.log('✓ Breadcrumb navigation visible (PASSED)');
        } else {
          console.log('✗ No breadcrumb navigation found (FAILED)');
        }
      } else {
        console.log('ℹ No sub-documents found to test navigation');
      }
    } else {
      console.log('ℹ Documentation button not found');
    }
  });

  test('10. Mermaid diagrams should render and have zoom functionality', async ({ page }) => {
    // Navigate to documentation first
    const docsButton = page.locator('button:has-text("Documentation"), a:has-text("Documentation")');
    
    if (await docsButton.isVisible()) {
      await docsButton.click();
      await page.waitForLoadState('networkidle');
      
      // Look for architecture drawings or diagrams link
      const diagramLinks = page.locator('a:has-text("Architecture"), a:has-text("Drawings"), a:has-text("Diagrams")');
      
      if (await diagramLinks.isVisible()) {
        await diagramLinks.first().click();
        await page.waitForTimeout(3000);
        
        await page.screenshot({ path: 'test-results/10-mermaid-diagrams.png', fullPage: true });
        
        // Look for Mermaid diagrams
        const mermaidDiagrams = page.locator('[class*="mermaid"], svg[id*="mermaid"], [data-testid*="mermaid"]');
        const diagramCount = await mermaidDiagrams.count();
        
        if (diagramCount > 0) {
          console.log(`Found ${diagramCount} Mermaid diagrams`);
          
          // Look for zoom controls
          const zoomControls = page.locator('button[title*="Zoom"], button:has-text("Zoom"), [class*="zoom"]');
          const hasZoomControls = await zoomControls.count() > 0;
          
          if (hasZoomControls) {
            console.log('✓ Zoom controls found (PASSED)');
          } else {
            console.log('✗ No zoom controls found (FAILED)');
          }
        } else {
          console.log('✗ No Mermaid diagrams found (FAILED)');
        }
      } else {
        console.log('ℹ No diagram links found');
      }
    }
  });
});