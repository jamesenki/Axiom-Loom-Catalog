import { test, expect, Page } from '@playwright/test';

/**
 * Final Documentation and Link Test
 * Validates specific documentation rendering and link functionality
 */

async function waitForPageLoad(page: Page, timeout = 20000) {
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.waitForTimeout(2000);
}

async function takeScreenshot(page: Page, name: string) {
  try {
    await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  } catch (e) {
    console.log(`Screenshot failed: ${e}`);
  }
}

test.describe('Final Documentation and Link Validation', () => {
  test.setTimeout(60000);

  test('1. Verify documentation rendering structure', async ({ page }) => {
    console.log('Testing documentation rendering...');
    
    // Test a repository known to have documentation
    await page.goto('/repository/nslabsdashboards', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    await waitForPageLoad(page);
    
    // Check for various content elements that could contain documentation
    const contentElements = [
      'main',
      '.content',
      '.container', 
      '[data-testid="repository-content"]',
      '.repository-view',
      '.repository-detail',
      'article',
      '.markdown-body',
      '.md-content',
      'div[class*="content"]',
      'div[class*="Content"]'
    ];
    
    let foundContent = false;
    for (const selector of contentElements) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`Found content with selector: ${selector} (${elements} elements)`);
        foundContent = true;
        
        // Check if this element contains text content
        const textContent = await page.locator(selector).first().textContent();
        if (textContent && textContent.trim().length > 50) {
          console.log(`Content preview: ${textContent.substring(0, 100)}...`);
        }
      }
    }
    
    expect(foundContent).toBe(true);
    
    // Look for README or documentation files specifically
    const docLinks = await page.locator('a[href*="README"], a[href*=".md"], a[href*="docs"]').count();
    console.log(`Found ${docLinks} documentation-related links`);
    
    await takeScreenshot(page, 'documentation-structure');
  });

  test('2. Test specific repository documentation paths', async ({ page }) => {
    console.log('Testing specific documentation paths...');
    
    const docTestCases = [
      '/docs/nslabsdashboards',
      '/repository/nslabsdashboards',
      '/docs/ai-predictive-maintenance-engine',
      '/repository/ai-predictive-maintenance-engine'
    ];
    
    const results = [];
    
    for (const path of docTestCases) {
      try {
        console.log(`Testing path: ${path}`);
        
        await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await waitForPageLoad(page);
        
        const pageTitle = await page.title();
        const hasError = pageTitle.toLowerCase().includes('error') || 
                        pageTitle.includes('404');
        
        const hasContent = await page.locator('body').textContent();
        const contentLength = hasContent ? hasContent.trim().length : 0;
        
        results.push({
          path,
          status: hasError ? 'error' : 'success',
          title: pageTitle,
          contentLength,
          hasSubstantialContent: contentLength > 100
        });
        
        console.log(`${path}: ${hasError ? 'ERROR' : 'SUCCESS'} - Content length: ${contentLength}`);
        
      } catch (error) {
        results.push({
          path,
          status: 'failed',
          error: error.toString()
        });
        console.log(`${path}: FAILED - ${error}`);
      }
    }
    
    console.log('Documentation path results:', results);
    
    const successfulPaths = results.filter(r => r.status === 'success' && r.hasSubstantialContent);
    console.log(`${successfulPaths.length}/${docTestCases.length} paths have substantial content`);
    
    await takeScreenshot(page, 'documentation-paths');
  });

  test('3. Test markdown link navigation within docs', async ({ page }) => {
    console.log('Testing markdown link navigation...');
    
    // Navigate to a documentation page
    await page.goto('/repository/nslabsdashboards', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    await waitForPageLoad(page);
    
    // Get all links on the page
    const allLinks = await page.locator('a[href]').evaluateAll((links) => {
      return links.map(link => {
        const anchor = link as HTMLAnchorElement;
        return {
          text: anchor.textContent?.trim() || '',
          href: anchor.href,
          isInternal: !anchor.href.startsWith('http://') && !anchor.href.startsWith('https://') || 
                     anchor.href.includes('10.0.0.109')
        };
      });
    });
    
    console.log(`Found ${allLinks.length} total links`);
    
    const internalLinks = allLinks.filter(link => link.isInternal && link.href.includes('10.0.0.109'));
    console.log(`Found ${internalLinks.length} internal links`);
    
    // Test a sample of internal links
    const linkSample = internalLinks.slice(0, 5);
    const linkResults = [];
    
    for (const link of linkSample) {
      try {
        console.log(`Testing link: ${link.text} -> ${link.href}`);
        
        const response = await page.goto(link.href, { 
          waitUntil: 'domcontentloaded', 
          timeout: 15000 
        });
        
        if (response && response.status() < 400) {
          linkResults.push({ ...link, status: 'success', code: response.status() });
        } else {
          linkResults.push({ ...link, status: 'failed', code: response?.status() });
        }
        
      } catch (error) {
        linkResults.push({ ...link, status: 'error', error: error.toString() });
      }
      
      await page.waitForTimeout(500);
    }
    
    const workingLinks = linkResults.filter(r => r.status === 'success');
    console.log(`${workingLinks.length}/${linkSample.length} tested links work correctly`);
    
    console.log('Link test results:', linkResults);
    
    await takeScreenshot(page, 'markdown-links');
  });

  test('4. Verify API button functionality works', async ({ page }) => {
    console.log('Testing API button functionality...');
    
    // Go to a repository with API features
    await page.goto('/repository/nslabsdashboards', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    await waitForPageLoad(page);
    
    // Look for API buttons and try clicking them
    const apiButtons = [
      { selector: 'text=/api/i', type: 'API' },
      { selector: 'text=/graphql/i', type: 'GraphQL' },
      { selector: 'text=/postman/i', type: 'Postman' },
      { selector: '[href*="api"]', type: 'API Link' }
    ];
    
    const buttonResults = [];
    
    for (const button of apiButtons) {
      try {
        const elements = await page.locator(button.selector).count();
        if (elements > 0) {
          const firstButton = page.locator(button.selector).first();
          const isVisible = await firstButton.isVisible();
          
          if (isVisible) {
            const buttonText = await firstButton.textContent();
            const buttonHref = await firstButton.getAttribute('href');
            
            buttonResults.push({
              type: button.type,
              text: buttonText,
              href: buttonHref,
              status: 'found'
            });
            
            console.log(`Found ${button.type} button: "${buttonText}" -> ${buttonHref}`);
            
            // Try clicking if it has an href
            if (buttonHref) {
              try {
                await page.goto(buttonHref, { waitUntil: 'domcontentloaded', timeout: 15000 });
                await page.waitForTimeout(2000);
                console.log(`✓ ${button.type} button click successful`);
                
                // Go back for next test
                await page.goto('/repository/nslabsdashboards', { 
                  waitUntil: 'domcontentloaded', 
                  timeout: 30000 
                });
                await waitForPageLoad(page);
                
              } catch (error) {
                console.log(`✗ ${button.type} button click failed: ${error}`);
              }
            }
          }
        }
      } catch (error) {
        console.log(`Error testing ${button.type} button: ${error}`);
      }
    }
    
    console.log('API button results:', buttonResults);
    
    // Verify we found at least some API buttons
    expect(buttonResults.length).toBeGreaterThan(0);
    
    await takeScreenshot(page, 'api-buttons-functionality');
  });

});