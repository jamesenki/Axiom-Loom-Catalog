import { test, expect, Page } from '@playwright/test';

// QA Test Suite for Water Heater Platform Repository
test.describe('Water Heater Platform Repository - Comprehensive QA Analysis', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    // Enable console logging to capture any JavaScript errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('BROWSER ERROR:', msg.text());
      }
    });
  });

  test('Navigate to water heater platform repository URLs', async () => {
    console.log('\n=== Testing URL Patterns ===');
    
    // Test Pattern 1: /repository/appliances-co-water-heater-platform
    console.log('Testing URL pattern 1: /repository/appliances-co-water-heater-platform');
    try {
      await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform', { 
        waitUntil: 'networkidle',
        timeout: 10000 
      });
      
      await page.screenshot({ 
        path: 'e2e/screenshots/water-heater-repository-url-pattern.png',
        fullPage: true 
      });
      
      const title = await page.title();
      const url = page.url();
      const pageContent = await page.textContent('body');
      
      console.log(`URL Pattern 1 - Title: ${title}`);
      console.log(`URL Pattern 1 - Final URL: ${url}`);
      console.log(`URL Pattern 1 - Contains "water heater": ${pageContent?.toLowerCase().includes('water heater')}`);
      
      expect(page.url()).toContain('appliances-co-water-heater-platform');
    } catch (error) {
      console.log('URL Pattern 1 failed:', error);
      await page.screenshot({ 
        path: 'e2e/screenshots/water-heater-repository-url-error.png',
        fullPage: true 
      });
    }

    // Test Pattern 2: /docs/appliances-co-water-heater-platform
    console.log('Testing URL pattern 2: /docs/appliances-co-water-heater-platform');
    try {
      await page.goto('http://localhost:3000/docs/appliances-co-water-heater-platform', { 
        waitUntil: 'networkidle',
        timeout: 10000 
      });
      
      await page.screenshot({ 
        path: 'e2e/screenshots/water-heater-docs-url-pattern.png',
        fullPage: true 
      });
      
      const title = await page.title();
      const url = page.url();
      const pageContent = await page.textContent('body');
      
      console.log(`URL Pattern 2 - Title: ${title}`);
      console.log(`URL Pattern 2 - Final URL: ${url}`);
      console.log(`URL Pattern 2 - Contains "water heater": ${pageContent?.toLowerCase().includes('water heater')}`);
      
    } catch (error) {
      console.log('URL Pattern 2 failed:', error);
      await page.screenshot({ 
        path: 'e2e/screenshots/water-heater-docs-url-error.png',
        fullPage: true 
      });
    }
  });

  test('Comprehensive link testing on repository page', async () => {
    console.log('\n=== Testing All Links on Repository Page ===');
    
    // Navigate to the working URL pattern
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform', { 
      waitUntil: 'networkidle' 
    });

    // Take screenshot of main page
    await page.screenshot({ 
      path: 'e2e/screenshots/water-heater-main-page.png',
      fullPage: true 
    });

    // Find all links on the page
    const allLinks = await page.locator('a').all();
    console.log(`Found ${allLinks.length} links on the page`);

    const linkResults: Array<{
      text: string;
      href: string;
      status: 'working' | 'broken' | 'redirect';
      finalUrl?: string;
      error?: string;
    }> = [];

    // Test each link
    for (let i = 0; i < allLinks.length; i++) {
      const link = allLinks[i];
      try {
        const linkText = (await link.textContent())?.trim() || '';
        const href = await link.getAttribute('href') || '';
        
        if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) {
          continue; // Skip email and phone links
        }

        console.log(`Testing link ${i + 1}: "${linkText}" -> ${href}`);

        // Open link in new page to test
        const newPage = await page.context().newPage();
        try {
          const response = await newPage.goto(href.startsWith('http') ? href : `http://localhost:3000${href}`, {
            waitUntil: 'networkidle',
            timeout: 5000
          });

          const finalUrl = newPage.url();
          const statusCode = response?.status();

          if (statusCode === 200) {
            linkResults.push({
              text: linkText,
              href: href,
              status: finalUrl !== (href.startsWith('http') ? href : `http://localhost:3000${href}`) ? 'redirect' : 'working',
              finalUrl: finalUrl
            });
          } else {
            linkResults.push({
              text: linkText,
              href: href,
              status: 'broken',
              error: `HTTP ${statusCode}`
            });
          }

          // Take screenshot if it's a documentation or important link
          if (linkText.toLowerCase().includes('doc') || 
              linkText.toLowerCase().includes('demo') || 
              linkText.toLowerCase().includes('api') ||
              linkText.toLowerCase().includes('architecture')) {
            await newPage.screenshot({ 
              path: `e2e/screenshots/water-heater-link-${i}-${linkText.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`,
              fullPage: true 
            });
          }

        } catch (error) {
          linkResults.push({
            text: linkText,
            href: href,
            status: 'broken',
            error: error instanceof Error ? error.message : String(error)
          });

          // Take screenshot of error page
          try {
            await newPage.screenshot({ 
              path: `e2e/screenshots/water-heater-error-${i}-${linkText.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`,
              fullPage: true 
            });
          } catch (screenshotError) {
            console.log('Could not take error screenshot:', screenshotError);
          }
        }

        await newPage.close();
        
        // Add delay to avoid overwhelming the server
        await page.waitForTimeout(1000);

      } catch (error) {
        console.log(`Error testing link ${i + 1}:`, error);
      }
    }

    // Output comprehensive link analysis
    console.log('\n=== LINK ANALYSIS RESULTS ===');
    console.log('Working Links:');
    linkResults.filter(r => r.status === 'working').forEach(r => {
      console.log(`✅ "${r.text}" -> ${r.href}`);
    });

    console.log('\nRedirecting Links:');
    linkResults.filter(r => r.status === 'redirect').forEach(r => {
      console.log(`🔄 "${r.text}" -> ${r.href} redirects to ${r.finalUrl}`);
    });

    console.log('\nBroken Links:');
    linkResults.filter(r => r.status === 'broken').forEach(r => {
      console.log(`❌ "${r.text}" -> ${r.href} (${r.error})`);
    });

    // Write detailed results to file for reference
    const detailedReport = JSON.stringify(linkResults, null, 2);
    console.log('\n=== DETAILED LINK REPORT ===');
    console.log(detailedReport);

    // Expect that we have at least some working links
    const workingLinks = linkResults.filter(r => r.status === 'working');
    expect(workingLinks.length).toBeGreaterThan(0);
  });

  test('Test documentation file access and rendering', async () => {
    console.log('\n=== Testing Documentation Files ===');
    
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform', { 
      waitUntil: 'networkidle' 
    });

    // Common documentation file names to test
    const docFiles = [
      'README.md',
      'getting-started.md', 
      'architecture.md',
      'developer-guide.md',
      'api-documentation.md',
      'GETTING_STARTED.md',
      'ARCHITECTURE.md',
      'DEVELOPER_GUIDE.md',
      'API_DOCUMENTATION.md'
    ];

    const docResults: Array<{
      filename: string;
      accessible: boolean;
      content: string;
      error?: string;
    }> = [];

    for (const docFile of docFiles) {
      try {
        console.log(`Testing documentation file: ${docFile}`);
        
        const docUrl = `http://localhost:3000/docs/appliances-co-water-heater-platform/${docFile}`;
        const response = await page.goto(docUrl, { 
          waitUntil: 'networkidle',
          timeout: 5000 
        });

        if (response?.status() === 200) {
          const content = await page.textContent('body');
          docResults.push({
            filename: docFile,
            accessible: true,
            content: content?.substring(0, 200) + '...' || ''
          });

          await page.screenshot({ 
            path: `e2e/screenshots/water-heater-doc-${docFile.replace('.', '-')}.png`,
            fullPage: true 
          });
        } else {
          docResults.push({
            filename: docFile,
            accessible: false,
            content: '',
            error: `HTTP ${response?.status()}`
          });
        }

      } catch (error) {
        docResults.push({
          filename: docFile,
          accessible: false,
          content: '',
          error: error instanceof Error ? error.message : String(error)
        });
      }

      await page.waitForTimeout(500);
    }

    console.log('\n=== DOCUMENTATION FILE RESULTS ===');
    docResults.forEach(result => {
      if (result.accessible) {
        console.log(`✅ ${result.filename} - Content preview: ${result.content.substring(0, 100)}...`);
      } else {
        console.log(`❌ ${result.filename} - Error: ${result.error}`);
      }
    });

    const accessibleDocs = docResults.filter(r => r.accessible);
    console.log(`\nTotal accessible documentation files: ${accessibleDocs.length}/${docResults.length}`);
  });

  test('Compare with working ai-predictive-maintenance repository', async () => {
    console.log('\n=== Comparing with Working Repository ===');
    
    // Test the working repository first
    console.log('Testing working repository: ai-predictive-maintenance-engine-architecture');
    await page.goto('http://localhost:3000/docs/ai-predictive-maintenance-engine-architecture', { 
      waitUntil: 'networkidle' 
    });

    await page.screenshot({ 
      path: 'e2e/screenshots/working-ai-predictive-maintenance.png',
      fullPage: true 
    });

    const workingContent = await page.textContent('body');
    const workingLinks = await page.locator('a').all();
    
    console.log(`Working repository has ${workingLinks.length} links`);
    console.log(`Working repository content length: ${workingContent?.length}`);

    // Test a few key links from working repository
    const workingLinkResults: Array<{
      text: string;
      href: string;
      works: boolean;
    }> = [];

    for (let i = 0; i < Math.min(5, workingLinks.length); i++) {
      const link = workingLinks[i];
      const linkText = (await link.textContent())?.trim() || '';
      const href = await link.getAttribute('href') || '';

      if (href && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        try {
          const newPage = await page.context().newPage();
          const response = await newPage.goto(href.startsWith('http') ? href : `http://localhost:3000${href}`, {
            waitUntil: 'networkidle',
            timeout: 3000
          });

          workingLinkResults.push({
            text: linkText,
            href: href,
            works: response?.status() === 200
          });

          await newPage.close();
        } catch (error) {
          workingLinkResults.push({
            text: linkText,
            href: href,
            works: false
          });
        }
      }
    }

    console.log('\n=== Working Repository Link Analysis ===');
    workingLinkResults.forEach(result => {
      console.log(`${result.works ? '✅' : '❌'} "${result.text}" -> ${result.href}`);
    });

    // Now compare with water heater repository
    console.log('\n=== Comparison Summary ===');
    console.log(`Working repository (ai-predictive-maintenance): ${workingLinkResults.filter(r => r.works).length}/${workingLinkResults.length} links working`);
    
    // This comparison helps identify patterns in what works vs what doesn't
    expect(workingLinkResults.length).toBeGreaterThan(0);
  });
});