import { test, expect } from '@playwright/test';

test.describe('Debug Predictive Maintenance Repository Links', () => {
  test('should test Implementation Guide and Product Details links behavior', async ({ page }) => {
    console.log('Starting debug test for predictive maintenance repository links...');
    
    // Enable console logging to capture any JavaScript errors
    page.on('console', (msg) => {
      console.log(`CONSOLE ${msg.type()}: ${msg.text()}`);
    });

    // Capture any page errors
    page.on('pageerror', (error) => {
      console.error(`PAGE ERROR: ${error.message}`);
    });

    // Navigate to the repository page
    const targetUrl = 'http://localhost:3000/repository/ai-predictive-maintenance-engine-architecture';
    console.log(`Navigating to: ${targetUrl}`);
    
    await page.goto(targetUrl);
    
    // Wait for the page to load and take initial screenshot
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'debug-screenshots/predictive-maintenance-initial.png',
      fullPage: true 
    });
    
    console.log('Page loaded, looking for target links...');
    
    // Look for the "Implementation Guide" link
    console.log('Searching for Implementation Guide link...');
    const implementationGuideLinks = await page.locator('a').filter({ hasText: /implementation guide/i }).all();
    console.log(`Found ${implementationGuideLinks.length} Implementation Guide links`);
    
    for (let i = 0; i < implementationGuideLinks.length; i++) {
      const link = implementationGuideLinks[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      console.log(`Implementation Guide Link ${i + 1}: "${text}" -> "${href}"`);
    }
    
    // Look for the "Product Details" link
    console.log('Searching for Product Details link...');
    const productDetailsLinks = await page.locator('a').filter({ hasText: /product details/i }).all();
    console.log(`Found ${productDetailsLinks.length} Product Details links`);
    
    for (let i = 0; i < productDetailsLinks.length; i++) {
      const link = productDetailsLinks[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      console.log(`Product Details Link ${i + 1}: "${text}" -> "${href}"`);
    }
    
    // Test Implementation Guide link if found
    if (implementationGuideLinks.length > 0) {
      console.log('Testing Implementation Guide link...');
      const implementationLink = implementationGuideLinks[0];
      const href = await implementationLink.getAttribute('href');
      
      console.log(`Clicking Implementation Guide link with href: ${href}`);
      await implementationLink.click();
      
      // Wait for navigation or error
      await page.waitForLoadState('networkidle');
      
      // Check current URL after click
      const currentUrl = page.url();
      console.log(`After Implementation Guide click, current URL: ${currentUrl}`);
      
      // Take screenshot of what loaded
      await page.screenshot({ 
        path: 'debug-screenshots/implementation-guide-result.png',
        fullPage: true 
      });
      
      // Check for 404 error or any error messages on the page
      const errorElements = await page.locator('h1, h2, h3, .error, [class*="error"], [class*="404"]').all();
      for (const element of errorElements) {
        const text = await element.textContent();
        if (text && (text.includes('404') || text.includes('Not Found') || text.includes('Error'))) {
          console.log(`ERROR FOUND: ${text}`);
        }
      }
      
      // Check for any error text in the page body
      const bodyText = await page.locator('body').textContent();
      if (bodyText?.includes('404') || bodyText?.includes('Not Found')) {
        console.log('404 ERROR DETECTED in page body');
      }
      
      // Go back to the repository page for the next test
      await page.goto(targetUrl);
      await page.waitForLoadState('networkidle');
    }
    
    // Test Product Details link if found
    if (productDetailsLinks.length > 0) {
      console.log('Testing Product Details link...');
      const productLink = productDetailsLinks[0];
      const href = await productLink.getAttribute('href');
      
      console.log(`Clicking Product Details link with href: ${href}`);
      await productLink.click();
      
      // Wait for navigation or error
      await page.waitForLoadState('networkidle');
      
      // Check current URL after click
      const currentUrl = page.url();
      console.log(`After Product Details click, current URL: ${currentUrl}`);
      
      // Take screenshot of what loaded
      await page.screenshot({ 
        path: 'debug-screenshots/product-details-result.png',
        fullPage: true 
      });
      
      // Check for 404 error or any error messages on the page
      const errorElements = await page.locator('h1, h2, h3, .error, [class*="error"], [class*="404"]').all();
      for (const element of errorElements) {
        const text = await element.textContent();
        if (text && (text.includes('404') || text.includes('Not Found') || text.includes('Error'))) {
          console.log(`ERROR FOUND: ${text}`);
        }
      }
      
      // Check for any error text in the page body
      const bodyText = await page.locator('body').textContent();
      if (bodyText?.includes('404') || bodyText?.includes('Not Found')) {
        console.log('404 ERROR DETECTED in page body');
      }
    }
    
    // Also search for all links on the page to get a complete picture
    console.log('Getting all links on the page for context...');
    const allLinks = await page.locator('a[href]').all();
    console.log(`Total links found on page: ${allLinks.length}`);
    
    for (let i = 0; i < Math.min(allLinks.length, 20); i++) { // Limit to first 20 to avoid spam
      const link = allLinks[i];
      const href = await link.getAttribute('href');
      const text = (await link.textContent())?.trim();
      if (text && text.length > 0) {
        console.log(`Link ${i + 1}: "${text}" -> "${href}"`);
      }
    }
    
    console.log('Debug test completed.');
  });
});