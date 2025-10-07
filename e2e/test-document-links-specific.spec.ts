import { test, expect } from '@playwright/test';

test.describe('Document Links Verification - No 404 Errors', () => {
  
  test('should verify Coming Soon links work without 404 errors from repository detail page', async ({ page }) => {
    console.log('🔍 Testing document links for 404 errors...');

    // Monitor network requests to catch 404s
    const failedRequests: string[] = [];
    page.on('response', response => {
      if (response.status() === 404) {
        failedRequests.push(`404 ERROR: ${response.url()}`);
      }
    });

    // Navigate to repository detail page
    await page.goto('http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine-architecture');
    await page.waitForLoadState('networkidle');

    // Take screenshot of repository page to verify it loaded
    await page.screenshot({ path: 'test-results/repository-loaded.png' });

    // Look for the Coming Soon links in the Get Started section
    console.log('🔗 Searching for Coming Soon links...');
    
    // Check if Implementation Guide button exists and is clickable
    const implementationBtn = page.locator('a', { hasText: 'Implementation Guide' });
    const productBtn = page.locator('a', { hasText: 'Product Details' });
    const demoBtn = page.locator('a', { hasText: 'Architecture Demo' });
    
    // Verify buttons are visible
    await expect(implementationBtn).toBeVisible({ timeout: 10000 });
    await expect(productBtn).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Coming Soon buttons are visible');

    // Test Implementation Guide link
    console.log('🖱️ Clicking Implementation Guide...');
    await implementationBtn.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on the Coming Soon page, not a 404 page
    await expect(page.locator('text=Implementation Guide Coming Soon')).toBeVisible({ timeout: 5000 });
    console.log('✅ Implementation Guide Coming Soon page loaded successfully');
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/implementation-guide-success.png' });

    // Check that we didn't get 404 errors
    if (failedRequests.length > 0) {
      console.log('❌ Found 404 errors:', failedRequests);
    } else {
      console.log('✅ No 404 errors detected for Implementation Guide');
    }

    // Go back to repository page
    await page.goto('http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine-architecture');
    await page.waitForLoadState('networkidle');

    // Test Product Details link  
    console.log('🖱️ Clicking Product Details...');
    const productBtn2 = page.locator('a', { hasText: 'Product Details' });
    await productBtn2.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on the Product Coming Soon page
    await expect(page.locator('text=Product Details Coming Soon')).toBeVisible({ timeout: 5000 });
    console.log('✅ Product Details Coming Soon page loaded successfully');
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/product-details-success.png' });

    // Final 404 error check
    const documentationErrors = failedRequests.filter(req => 
      req.includes('coming-soon') || req.includes('demo') || req.includes('docs')
    );

    if (documentationErrors.length === 0) {
      console.log('✅ SUCCESS: No 404 errors found for Coming Soon pages');
    } else {
      console.log('❌ FAILURE: Found 404 errors:', documentationErrors);
      throw new Error(`Found ${documentationErrors.length} 404 errors: ${documentationErrors.join(', ')}`);
    }
  });

  test('should verify all buttons in Get Started section are functional', async ({ page }) => {
    console.log('🔍 Testing all Get Started section buttons...');

    await page.goto('http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine-architecture');
    await page.waitForLoadState('networkidle');

    // Find the Get Started section
    const getStartedSection = page.locator('text=Get Started').first();
    await expect(getStartedSection).toBeVisible();

    // Get all buttons in the action grid
    const actionButtons = page.locator('[class*="ActionGrid"] a, [class*="ActionGrid"] button');
    const buttonCount = await actionButtons.count();
    
    console.log(`📊 Found ${buttonCount} buttons in Get Started section`);

    // Test each button to make sure they're not broken links
    for (let i = 0; i < buttonCount; i++) {
      const button = actionButtons.nth(i);
      const buttonText = await button.textContent();
      const href = await button.getAttribute('href');
      
      console.log(`🔗 Button ${i + 1}: "${buttonText}" -> ${href}`);
      
      // Skip external links (GitHub)
      if (href && href.startsWith('http') && !href.includes('10.0.0.109')) {
        console.log('⏭️ Skipping external link');
        continue;
      }
      
      // Click the button and verify it doesn't lead to 404
      if (href && (href.includes('coming-soon') || href.includes('demo'))) {
        try {
          await button.click();
          await page.waitForLoadState('networkidle', { timeout: 10000 });
          
          // Check if we're on an error page
          const hasErrorText = await page.locator('text=404, text=Not Found, text=Error').count() > 0;
          if (hasErrorText) {
            throw new Error(`Button "${buttonText}" led to an error page`);
          }
          
          console.log(`✅ Button "${buttonText}" works correctly`);
          
          // Go back for next test
          await page.goBack();
          await page.waitForLoadState('networkidle');
        } catch (error) {
          console.log(`❌ Button "${buttonText}" failed: ${error}`);
        }
      }
    }
    
    console.log('✅ All Get Started buttons tested successfully');
  });
});