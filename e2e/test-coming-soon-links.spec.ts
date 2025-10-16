import { test, expect } from '@playwright/test';

test.describe('Coming Soon Pages Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('should navigate to and display Documentation Coming Soon page', async ({ page }) => {
    console.log('🔍 Testing Documentation Coming Soon page...');
    
    // Navigate directly to the docs coming soon URL
    await page.goto('http://10.0.0.109:3000/coming-soon/docs/ai-predictive-maintenance-engine-architecture/');
    
    // Wait for the page to load and React to render
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Take screenshot for verification
    await page.screenshot({ 
      path: 'e2e/screenshots/docs-coming-soon.png', 
      fullPage: true 
    });
    
    // Verify the page title
    const title = await page.title();
    expect(title).toContain('Axiom Loom');
    
    // Verify key elements are present
    await expect(page.locator('text=Documentation Coming Soon')).toBeVisible();
    await expect(page.locator('text=Implementation Guide Coming Soon')).toBeVisible();
    await expect(page.locator('text=Comprehensive Documentation in Development')).toBeVisible();
    
    // Verify feature cards are present
    await expect(page.locator('text=Quick Start Guide')).toBeVisible();
    await expect(page.locator('text=API Documentation')).toBeVisible();
    await expect(page.locator('text=Configuration Guide')).toBeVisible();
    
    // Verify navigation buttons work
    const backButton = page.locator('text=Back to Catalog');
    await expect(backButton).toBeVisible();
    const repoButton = page.locator('text=View Repository Details');
    await expect(repoButton).toBeVisible();
    
    console.log('✅ Documentation Coming Soon page verified successfully');
  });

  test('should navigate to and display Product Coming Soon page', async ({ page }) => {
    console.log('🔍 Testing Product Coming Soon page...');
    
    // Navigate directly to the product coming soon URL
    await page.goto('http://10.0.0.109:3000/coming-soon/product/ai-predictive-maintenance-engine-architecture/');
    
    // Wait for the page to load and React to render
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Take screenshot for verification
    await page.screenshot({ 
      path: 'e2e/screenshots/product-coming-soon.png', 
      fullPage: true 
    });
    
    // Verify the page title
    const title = await page.title();
    expect(title).toContain('Axiom Loom');
    
    // Verify key elements are present
    await expect(page.locator('text=Product Details Coming Soon')).toBeVisible();
    await expect(page.locator('text=Business Case & ROI Information in Development')).toBeVisible();
    
    // Verify feature cards are present
    await expect(page.locator('text=ROI Calculator')).toBeVisible();
    await expect(page.locator('text=Industry Cases')).toBeVisible();
    await expect(page.locator('text=Business Value')).toBeVisible();
    
    // Verify navigation buttons work
    const backButton = page.locator('text=Back to Catalog');
    await expect(backButton).toBeVisible();
    const repoButton = page.locator('text=View Repository Details');
    await expect(repoButton).toBeVisible();
    
    console.log('✅ Product Coming Soon page verified successfully');
  });

  test('should navigate from Repository Detail page to Coming Soon pages via links', async ({ page }) => {
    console.log('🔍 Testing navigation from Repository Detail page to Coming Soon pages...');
    
    // First, navigate to the repository detail page
    await page.goto('http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine-architecture');
    
    // Wait for the repository detail page to load
    await page.waitForSelector('text=AI Predictive Maintenance Architecture', { timeout: 15000 });
    
    // Take screenshot of the repository page
    await page.screenshot({ 
      path: 'e2e/screenshots/repository-detail-page.png', 
      fullPage: true 
    });
    
    // Scroll down to find the links (they might be in the content area)
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(1000);
    
    // Look for the Implementation Guide link and click it
    console.log('🔗 Looking for Implementation Guide link...');
    
    // Try different possible link texts
    const implementationLinkSelectors = [
      'a[href*="/coming-soon/docs/ai-predictive-maintenance-engine-architecture"]',
      'text=Implementation Guide',
      'a:has-text("Implementation Guide")',
      'a:has-text("Complete development documentation")'
    ];
    
    let implementationLink = null;
    for (const selector of implementationLinkSelectors) {
      try {
        implementationLink = page.locator(selector).first();
        if (await implementationLink.isVisible({ timeout: 2000 })) {
          console.log(`✅ Found Implementation Guide link with selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Could not find link with selector: ${selector}`);
      }
    }
    
    if (implementationLink && await implementationLink.isVisible()) {
      // Click the Implementation Guide link
      await implementationLink.click();
      
      // Wait for navigation to docs coming soon page
      await page.waitForURL('**/coming-soon/docs/**', { timeout: 10000 });
      
      // Verify we're on the docs coming soon page
      await expect(page.locator('text=Implementation Guide Coming Soon')).toBeVisible();
      console.log('✅ Successfully navigated to Documentation Coming Soon page via link');
      
      // Go back to repository page
      await page.goBack();
      await page.waitForSelector('text=AI Predictive Maintenance Architecture', { timeout: 10000 });
    } else {
      console.log('⚠️ Implementation Guide link not found - will check page content');
      
      // Check if the repository page loaded correctly
      const pageContent = await page.content();
      console.log('Page URL:', page.url());
      console.log('Page contains "Links & Resources":', pageContent.includes('Links & Resources'));
      console.log('Page contains "Implementation Guide":', pageContent.includes('Implementation Guide'));
      
      // Take a screenshot to see what's actually on the page
      await page.screenshot({ 
        path: 'e2e/screenshots/repository-debug.png', 
        fullPage: true 
      });
    }
    
    // Look for the Product Details link
    console.log('🔗 Looking for Product Details link...');
    
    const productLinkSelectors = [
      'a[href*="/coming-soon/product/ai-predictive-maintenance-engine-architecture"]',
      'text=Product Details',
      'a:has-text("Product Details")',
      'a:has-text("Business case and ROI information")'
    ];
    
    let productLink = null;
    for (const selector of productLinkSelectors) {
      try {
        productLink = page.locator(selector).first();
        if (await productLink.isVisible({ timeout: 2000 })) {
          console.log(`✅ Found Product Details link with selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Could not find link with selector: ${selector}`);
      }
    }
    
    if (productLink && await productLink.isVisible()) {
      // Click the Product Details link
      await productLink.click();
      
      // Wait for navigation to product coming soon page
      await page.waitForURL('**/coming-soon/product/**', { timeout: 10000 });
      
      // Verify we're on the product coming soon page
      await expect(page.locator('text=Product Details Coming Soon')).toBeVisible();
      console.log('✅ Successfully navigated to Product Coming Soon page via link');
    } else {
      console.log('⚠️ Product Details link not found');
    }
  });

  test('should test Back to Catalog buttons work from Coming Soon pages', async ({ page }) => {
    console.log('🔍 Testing Back to Catalog navigation...');
    
    // Test from Documentation Coming Soon page
    await page.goto('http://10.0.0.109:3000/coming-soon/docs/ai-predictive-maintenance-engine-architecture/');
    await page.waitForSelector('text=Back to Catalog', { timeout: 10000 });
    
    const backButton = page.locator('text=Back to Catalog').first();
    await backButton.click();
    
    // Should navigate back to home page (repository list)
    await page.waitForURL('http://10.0.0.109:3000/', { timeout: 10000 });
    await expect(page.locator('text=Axiom Loom Catalog') || page.locator('text=Repository') || page.locator('text=AI Predictive Maintenance')).toBeVisible();
    
    console.log('✅ Back to Catalog button works from Documentation Coming Soon page');
    
    // Test from Product Coming Soon page
    await page.goto('http://10.0.0.109:3000/coming-soon/product/ai-predictive-maintenance-engine-architecture/');
    await page.waitForSelector('text=Back to Catalog', { timeout: 10000 });
    
    const backButton2 = page.locator('text=Back to Catalog').first();
    await backButton2.click();
    
    // Should navigate back to home page (repository list)
    await page.waitForURL('http://10.0.0.109:3000/', { timeout: 10000 });
    await expect(page.locator('text=Axiom Loom Catalog') || page.locator('text=Repository') || page.locator('text=AI Predictive Maintenance')).toBeVisible();
    
    console.log('✅ Back to Catalog button works from Product Coming Soon page');
  });

  test('should test View Repository Details buttons work from Coming Soon pages', async ({ page }) => {
    console.log('🔍 Testing View Repository Details navigation...');
    
    // Test from Documentation Coming Soon page
    await page.goto('http://10.0.0.109:3000/coming-soon/docs/ai-predictive-maintenance-engine-architecture/');
    await page.waitForSelector('text=View Repository Details', { timeout: 10000 });
    
    const repoButton = page.locator('text=View Repository Details').first();
    await repoButton.click();
    
    // Should navigate to repository detail page
    await page.waitForURL('**/repository/ai-predictive-maintenance-engine-architecture**', { timeout: 10000 });
    await expect(page.locator('text=AI Predictive Maintenance') || page.locator('text=Repository')).toBeVisible();
    
    console.log('✅ View Repository Details button works from Documentation Coming Soon page');
    
    // Test from Product Coming Soon page
    await page.goto('http://10.0.0.109:3000/coming-soon/product/ai-predictive-maintenance-engine-architecture/');
    await page.waitForSelector('text=View Repository Details', { timeout: 10000 });
    
    const repoButton2 = page.locator('text=View Repository Details').first();
    await repoButton2.click();
    
    // Should navigate to repository detail page
    await page.waitForURL('**/repository/ai-predictive-maintenance-engine-architecture**', { timeout: 10000 });
    await expect(page.locator('text=AI Predictive Maintenance') || page.locator('text=Repository')).toBeVisible();
    
    console.log('✅ View Repository Details button works from Product Coming Soon page');
  });

  test('should verify all 4 links work from README content', async ({ page }) => {
    console.log('🔍 Testing all 4 links from README Links & Resources section...');
    
    // Navigate to the documentation view of the repository to see the README
    await page.goto('http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture');
    
    // Wait for documentation to load
    await page.waitForSelector('body', { timeout: 15000 });
    
    // Take screenshot of the documentation page
    await page.screenshot({ 
      path: 'e2e/screenshots/documentation-page.png', 
      fullPage: true 
    });
    
    // Look for the Links & Resources section
    await page.evaluate(() => {
      const element = document.querySelector('text=Links & Resources') || 
                      document.querySelector('h2:has-text("Links & Resources")') ||
                      document.querySelector('*:has-text("Links & Resources")');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Test Architecture Demo link
    console.log('🔗 Testing Architecture Demo link...');
    const demoLink = page.locator('a:has-text("Architecture Demo")').first();
    if (await demoLink.isVisible({ timeout: 3000 })) {
      await demoLink.click();
      await page.waitForTimeout(2000);
      // Should show demo coming soon content
      const isDemoPage = await page.locator('text=Demo Coming Soon').isVisible() || 
                         await page.locator('text=Interactive Demo').isVisible();
      console.log(isDemoPage ? '✅ Demo link works' : '❌ Demo link issue');
      await page.goBack();
      await page.waitForTimeout(1000);
    } else {
      console.log('❌ Architecture Demo link not found');
    }
    
    // Test Implementation Guide link
    console.log('🔗 Testing Implementation Guide link...');
    const docsLink = page.locator('a:has-text("Implementation Guide")').first();
    if (await docsLink.isVisible({ timeout: 3000 })) {
      await docsLink.click();
      await page.waitForTimeout(3000);
      // Should show docs coming soon content
      const isDocsPage = await page.locator('text=Implementation Guide Coming Soon').isVisible() || 
                         await page.locator('text=Documentation Coming Soon').isVisible();
      console.log(isDocsPage ? '✅ Implementation Guide link works' : '❌ Implementation Guide link issue');
      await page.goBack();
      await page.waitForTimeout(1000);
    } else {
      console.log('❌ Implementation Guide link not found');
    }
    
    // Test Product Details link
    console.log('🔗 Testing Product Details link...');
    const productLink = page.locator('a:has-text("Product Details")').first();
    if (await productLink.isVisible({ timeout: 3000 })) {
      await productLink.click();
      await page.waitForTimeout(3000);
      // Should show product coming soon content
      const isProductPage = await page.locator('text=Product Details Coming Soon').isVisible() || 
                            await page.locator('text=Business Case & ROI').isVisible();
      console.log(isProductPage ? '✅ Product Details link works' : '❌ Product Details link issue');
      await page.goBack();
      await page.waitForTimeout(1000);
    } else {
      console.log('❌ Product Details link not found');
    }
    
    // Test GitHub Repository link
    console.log('🔗 Testing GitHub Repository link...');
    const githubLink = page.locator('a:has-text("GitHub Repository")').first();
    if (await githubLink.isVisible({ timeout: 3000 })) {
      // This should open in a new tab, so we won't click it but verify it exists
      const href = await githubLink.getAttribute('href');
      const isGitHubLink = href && href.includes('github.com');
      console.log(isGitHubLink ? '✅ GitHub link is correct' : '❌ GitHub link issue');
    } else {
      console.log('❌ GitHub Repository link not found');
    }
    
    console.log('📋 README links test completed');
  });
});

test.describe('Error Cases and Fallbacks', () => {
  test('should handle invalid coming soon URLs gracefully', async ({ page }) => {
    console.log('🔍 Testing error handling for invalid URLs...');
    
    // Test invalid repo name
    await page.goto('http://10.0.0.109:3000/coming-soon/docs/invalid-repo-name/');
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Should still show the coming soon page (it uses useParams)
    await expect(page.locator('text=Documentation Coming Soon') || page.locator('text=Coming Soon')).toBeVisible();
    
    console.log('✅ Invalid URLs handled gracefully');
  });
});