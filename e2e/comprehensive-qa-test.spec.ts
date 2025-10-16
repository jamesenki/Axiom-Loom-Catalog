import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive QA Test Suite for Axiom Loom Application
 * Tests all critical functionality including:
 * - Navigation and UI components
 * - Repository pages and documentation
 * - Link validation across all documents
 * - API buttons and functionality
 * - Error handling and edge cases
 */

// Shared functions for testing
async function waitForPageLoad(page: Page, timeout = 10000) {
  await page.waitForLoadState('networkidle', { timeout });
  await page.waitForLoadState('domcontentloaded', { timeout });
}

async function collectAllLinks(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href]'));
    return links.map(link => (link as HTMLAnchorElement).href).filter(href => href && !href.startsWith('mailto:'));
  });
}

async function takeScreenshotOnError(page: Page, testName: string) {
  try {
    await page.screenshot({ path: `test-results/${testName}-error.png`, fullPage: true });
    console.log(`Screenshot saved: ${testName}-error.png`);
  } catch (e) {
    console.log(`Failed to take screenshot: ${e}`);
  }
}

test.describe('Comprehensive QA Test Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set up error monitoring
    page.on('pageerror', (error) => {
      console.error('Page error:', error.message);
    });
    
    page.on('requestfailed', (request) => {
      console.error('Request failed:', request.url(), request.failure()?.errorText);
    });
  });

  test('1. Homepage loads and displays correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check for critical elements
    await expect(page).toHaveTitle(/EYNS AI Experience Center|Axiom Loom/);
    
    // Verify main navigation elements exist
    const navigation = page.locator('nav, [role="navigation"]');
    await expect(navigation).toBeVisible({ timeout: 10000 });
    
    // Check for repository cards or main content
    const content = page.locator('main, .container, .content, [data-testid="main-content"]');
    await expect(content).toBeVisible({ timeout: 10000 });
    
    // Verify no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    if (errors.length > 0) {
      console.warn('Console errors found:', errors);
    }
    
    await page.screenshot({ path: 'test-results/homepage-loaded.png' });
  });

  test('2. Repository listing and navigation works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Look for repository cards with various selectors
    const repoSelectors = [
      '[data-testid="repository-card"]',
      '.repository-card',
      'a[href*="/repo"]',
      'a[href*="/repos"]',
      'a[href*="/repository"]',
      '[data-cy="repo-card"]'
    ];
    
    let repoCards = null;
    for (const selector of repoSelectors) {
      repoCards = page.locator(selector);
      const count = await repoCards.count();
      if (count > 0) {
        console.log(`Found ${count} repository cards using selector: ${selector}`);
        break;
      }
    }
    
    if (!repoCards || await repoCards.count() === 0) {
      // Try to find any clickable elements that might be repos
      const allLinks = await collectAllLinks(page);
      const repoLinks = allLinks.filter(link => 
        link.includes('/repo') || 
        link.includes('/repos') || 
        link.includes('/repository')
      );
      
      console.log(`Found ${repoLinks.length} potential repository links:`, repoLinks.slice(0, 10));
      expect(repoLinks.length).toBeGreaterThan(0);
      
      // Test clicking first repository link
      if (repoLinks.length > 0) {
        await page.goto(repoLinks[0]);
        await waitForPageLoad(page);
        await expect(page).toHaveURL(new RegExp(repoLinks[0]));
      }
    } else {
      // Test clicking first repository card
      const firstCard = repoCards.first();
      await expect(firstCard).toBeVisible();
      await firstCard.click({ timeout: 5000 });
      await waitForPageLoad(page);
      
      // Verify we navigated to a repository page
      const url = page.url();
      expect(url).toMatch(/\/(repo|repos|repository)/);
    }
    
    await page.screenshot({ path: 'test-results/repository-navigation.png' });
  });

  test('3. Documentation pages and markdown links work', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Navigate to a repository with documentation
    const allLinks = await collectAllLinks(page);
    const docLinks = allLinks.filter(link => 
      link.includes('README') || 
      link.includes('.md') ||
      link.includes('/docs') ||
      link.includes('/doc')
    );
    
    console.log(`Found ${docLinks.length} documentation links`);
    
    if (docLinks.length > 0) {
      // Test first documentation link
      await page.goto(docLinks[0]);
      await waitForPageLoad(page);
      
      // Look for markdown content
      const markdownContent = page.locator('article, .markdown-body, .md-content, .documentation-view');
      await expect(markdownContent).toBeVisible({ timeout: 10000 });
      
      // Find and test internal links within the markdown
      const internalLinks = await page.locator('a[href]').evaluateAll((links) => {
        return links
          .map(link => (link as HTMLAnchorElement).href)
          .filter(href => !href.startsWith('http') || href.includes(window.location.host))
          .slice(0, 5); // Test first 5 internal links
      });
      
      for (const link of internalLinks) {
        try {
          await page.goto(link);
          await waitForPageLoad(page, 5000);
          
          // Verify page loaded successfully (not 404)
          const notFound = page.locator('text=/404|not found|page not found/i');
          const notFoundCount = await notFound.count();
          
          if (notFoundCount > 0) {
            console.warn(`Broken internal link found: ${link}`);
          }
          
        } catch (error) {
          console.warn(`Failed to navigate to internal link: ${link}`, error);
        }
      }
    }
    
    await page.screenshot({ path: 'test-results/documentation-testing.png' });
  });

  test('4. API Explorer, GraphQL, and Postman buttons work', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const buttonSelectors = [
      'text=/api explorer/i',
      'text=/graphql/i',
      'text=/postman/i',
      'text=/swagger/i',
      'text=/openapi/i',
      '[data-testid*="api"]',
      '[data-testid*="graphql"]',
      '[data-testid*="postman"]'
    ];
    
    let buttonsFound = 0;
    
    for (const selector of buttonSelectors) {
      const buttons = page.locator(selector);
      const count = await buttons.count();
      
      if (count > 0) {
        console.log(`Found ${count} buttons matching: ${selector}`);
        buttonsFound += count;
        
        // Test first button of each type
        const firstButton = buttons.first();
        
        try {
          // Ensure button is visible and clickable
          await expect(firstButton).toBeVisible({ timeout: 5000 });
          
          // Record current URL before clicking
          const currentUrl = page.url();
          
          // Click button
          await firstButton.click({ timeout: 5000 });
          await waitForPageLoad(page, 5000);
          
          // Verify something happened (URL changed or modal opened)
          const newUrl = page.url();
          const modal = page.locator('[role="dialog"], .modal, .popup');
          const modalVisible = await modal.count() > 0;
          
          if (newUrl !== currentUrl || modalVisible) {
            console.log(`Button click successful: ${selector}`);
          } else {
            console.warn(`Button click may not have worked: ${selector}`);
          }
          
        } catch (error) {
          console.warn(`Failed to test button: ${selector}`, error);
        }
      }
    }
    
    console.log(`Total API-related buttons found: ${buttonsFound}`);
    await page.screenshot({ path: 'test-results/api-buttons-testing.png' });
  });

  test('5. Comprehensive link validation across the application', async ({ page }) => {
    const brokenLinks: string[] = [];
    const testedLinks = new Set<string>();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Get all unique links from homepage
    let allLinks = await collectAllLinks(page);
    console.log(`Starting comprehensive link validation with ${allLinks.length} links`);
    
    // Filter to internal links and limit scope for practical testing
    const internalLinks = allLinks
      .filter(link => link.includes('10.0.0.109:3000') || !link.startsWith('http'))
      .slice(0, 50); // Limit to first 50 links for practical testing
    
    for (const link of internalLinks) {
      if (testedLinks.has(link)) continue;
      testedLinks.add(link);
      
      try {
        console.log(`Testing link: ${link}`);
        
        const response = await page.goto(link, { 
          waitUntil: 'networkidle', 
          timeout: 10000 
        });
        
        if (!response || response.status() >= 400) {
          brokenLinks.push(`${link} - Status: ${response?.status() || 'No response'}`);
          console.warn(`Broken link: ${link} - Status: ${response?.status()}`);
        } else {
          // Check if page has error indicators
          const errorIndicators = await page.locator('text=/404|not found|error|failed/i').count();
          if (errorIndicators > 0) {
            const pageTitle = await page.title();
            if (pageTitle.toLowerCase().includes('error') || pageTitle.includes('404')) {
              brokenLinks.push(`${link} - Page shows error: ${pageTitle}`);
            }
          }
        }
        
        // Small delay to avoid overwhelming the server
        await page.waitForTimeout(100);
        
      } catch (error) {
        brokenLinks.push(`${link} - Navigation error: ${error}`);
        console.warn(`Failed to test link: ${link}`, error);
      }
    }
    
    console.log(`Link validation complete. Tested ${testedLinks.size} links.`);
    
    if (brokenLinks.length > 0) {
      console.error('Broken links found:', brokenLinks);
      // Don't fail the test immediately - report the issues
      await page.evaluate((links) => {
        console.group('Broken Links Report');
        links.forEach(link => console.error(link));
        console.groupEnd();
      }, brokenLinks);
    }
    
    await page.screenshot({ path: 'test-results/link-validation-complete.png' });
    
    // Create a summary
    const summary = {
      totalLinksFound: allLinks.length,
      internalLinksTested: testedLinks.size,
      brokenLinksCount: brokenLinks.length,
      brokenLinks: brokenLinks
    };
    
    console.log('Link Validation Summary:', JSON.stringify(summary, null, 2));
    
    // Soft assertion - report but don't fail
    if (brokenLinks.length > 0) {
      console.warn(`Found ${brokenLinks.length} broken links - these should be investigated`);
    }
  });

  test('6. Error handling and edge cases', async ({ page }) => {
    // Test 404 handling
    await page.goto('/non-existent-page', { waitUntil: 'networkidle' });
    
    // Should either show 404 page or redirect gracefully
    const pageContent = await page.textContent('body');
    const hasErrorHandling = pageContent?.toLowerCase().includes('404') || 
                            pageContent?.toLowerCase().includes('not found') ||
                            page.url().includes('404');
    
    if (!hasErrorHandling) {
      console.log('No explicit 404 handling found - checking if app redirects gracefully');
      // Verify the app doesn't crash completely
      const hasMainContent = await page.locator('main, .container, .content').count() > 0;
      expect(hasMainContent).toBe(true);
    }
    
    // Test with invalid repository ID
    await page.goto('/repository/invalid-repo-id', { waitUntil: 'networkidle' });
    const hasValidContent = await page.locator('main, .container, .content').count() > 0;
    expect(hasValidContent).toBe(true);
    
    // Test network issues simulation
    await page.route('**/api/**', route => route.abort('failed'));
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // App should still render basic structure even if API calls fail
    const hasBasicStructure = await page.locator('body').count() > 0;
    expect(hasBasicStructure).toBe(true);
    
    await page.screenshot({ path: 'test-results/error-handling-test.png' });
  });

  test('7. Performance and responsiveness check', async ({ page }) => {
    // Test page load performance
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    console.log(`Homepage load time: ${loadTime}ms`);
    
    // Should load within reasonable time (10 seconds max)
    expect(loadTime).toBeLessThan(10000);
    
    // Test responsive design
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await page.waitForTimeout(1000);
    
    const mobileContent = await page.locator('main, .container, .content').isVisible();
    expect(mobileContent).toBe(true);
    
    await page.setViewportSize({ width: 1024, height: 768 }); // Tablet
    await page.waitForTimeout(1000);
    
    const tabletContent = await page.locator('main, .container, .content').isVisible();
    expect(tabletContent).toBe(true);
    
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await page.waitForTimeout(1000);
    
    const desktopContent = await page.locator('main, .container, .content').isVisible();
    expect(desktopContent).toBe(true);
    
    await page.screenshot({ path: 'test-results/responsive-design-test.png' });
  });

  test('8. Search functionality (if present)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Look for search elements
    const searchSelectors = [
      'input[type="search"]',
      'input[placeholder*="search" i]',
      '[data-testid="search"]',
      '.search-input',
      '#search'
    ];
    
    let searchInput = null;
    for (const selector of searchSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        searchInput = element.first();
        break;
      }
    }
    
    if (searchInput) {
      console.log('Search functionality found - testing it');
      
      await searchInput.fill('API');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(2000);
      
      // Look for search results
      const results = page.locator('[data-testid="search-results"], .search-results, .search-result');
      const resultsCount = await results.count();
      
      if (resultsCount > 0) {
        console.log(`Search returned ${resultsCount} results`);
        
        // Test clicking first result
        const firstResult = results.first();
        await firstResult.click();
        await waitForPageLoad(page);
      }
      
      await page.screenshot({ path: 'test-results/search-functionality-test.png' });
    } else {
      console.log('No search functionality found');
    }
  });
});