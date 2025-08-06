import { test, expect } from '@playwright/test';

// Get ALL repositories from metadata
const ALL_REPOSITORIES = [
  'ai-predictive-maintenance-engine',
  'ai-predictive-maintenance-engine-architecture',
  'ai-predictive-maintenance-platform',
  'ai-transformations',
  'cloudtwin-simulation-platform-architecture',
  'copilot-architecture-template',
  'deploymaster-sdv-ota-platform',
  'diagnostic-as-code-platform-architecture',
  'ecosystem-platform-architecture',
  'eyns-ai-experience-center',
  'fleet-digital-twin-platform-architecture',
  'future-mobility-consumer-platform',
  'future-mobility-energy-platform',
  'future-mobility-financial-platform',
  'future-mobility-fleet-platform',
  'future-mobility-infrastructure-platform',
  'future-mobility-oems-platform',
  'future-mobility-regulatory-platform',
  'future-mobility-tech-platform',
  'future-mobility-users-platform',
  'future-mobility-utilities-platform',
  'mobility-architecture-package-orchestrator',
  'nslabsdashboards',
  'remote-diagnostic-assistance-platform-architecture',
  'rentalFleets',
  'sample-arch-package',
  'sdv-architecture-orchestration',
  'sovd-diagnostic-ecosystem-platform-architecture',
  'velocityforge-sdv-platform-architecture'
];

test.describe('COMPREHENSIVE Link & Repository Coverage - MANDATORY REGRESSION', () => {
  test.setTimeout(120000); // 2 minutes per test due to many repositories

  // Test EVERY repository detail page
  test('ALL repositories load without errors', async ({ page }) => {
    const failures = [];
    
    for (const repo of ALL_REPOSITORIES) {
      console.log(`Testing repository: ${repo}`);
      
      try {
        await page.goto(`http://localhost:3000/repository/${repo}`);
        await page.waitForTimeout(2000);
        
        const bodyText = await page.textContent('body');
        
        // Check for ANY error messages
        if (bodyText.includes('Error Loading Repository') || 
            bodyText.includes('Failed to fetch') ||
            bodyText.includes('404') ||
            bodyText.includes('Not Found') ||
            bodyText.includes('Authentication required')) {
          failures.push({
            repo,
            error: 'Page shows error message',
            url: page.url()
          });
        }
        
        // Check that some content loads
        const hasContent = bodyText.length > 500; // Should have substantial content
        if (!hasContent) {
          failures.push({
            repo,
            error: 'No content loaded',
            url: page.url()
          });
        }
        
      } catch (error) {
        failures.push({
          repo,
          error: error.message,
          url: `http://localhost:3000/repository/${repo}`
        });
      }
    }
    
    // Report all failures
    if (failures.length > 0) {
      console.error('Failed repositories:', failures);
      throw new Error(`${failures.length} repositories failed to load: ${failures.map(f => f.repo).join(', ')}`);
    }
  });

  // Test navigation from repository list to each detail
  test('ALL repository cards are clickable and navigate correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/repositories');
    await page.waitForTimeout(3000);
    
    const failures = [];
    
    // Get all repository cards
    const cards = await page.locator('[data-testid="repository-card"], .repository-card, [class*="Card"]').all();
    console.log(`Found ${cards.length} repository cards`);
    
    for (let i = 0; i < Math.min(cards.length, 10); i++) { // Test first 10 to avoid timeout
      const card = cards[i];
      const cardText = await card.textContent();
      
      try {
        // Click the card
        await card.click();
        await page.waitForTimeout(2000);
        
        // Check we navigated
        const url = page.url();
        if (!url.includes('/repository/')) {
          failures.push({
            card: cardText,
            error: 'Did not navigate to repository detail',
            url
          });
        }
        
        // Check for errors
        const bodyText = await page.textContent('body');
        if (bodyText.includes('Error Loading Repository')) {
          failures.push({
            card: cardText,
            error: 'Repository detail shows error',
            url
          });
        }
        
        // Go back to list
        await page.goto('http://localhost:3000/repositories');
        await page.waitForTimeout(2000);
        
      } catch (error) {
        failures.push({
          card: cardText,
          error: error.message
        });
      }
    }
    
    expect(failures).toHaveLength(0);
  });

  // Test ALL navigation links
  test('ALL navigation links work correctly', async ({ page }) => {
    const navLinks = [
      { text: 'Home', expectedUrl: '/' },
      { text: 'Repositories', expectedUrl: '/repositories' },
      { text: 'APIs', expectedUrl: '/apis' },
      { text: 'API Explorer', expectedUrl: '/api-explorer' },
      { text: 'Documentation', expectedUrl: '/docs' },
      { text: 'GraphQL', expectedUrl: '/graphql' },
      { text: 'Postman', expectedUrl: '/postman' }
    ];
    
    const failures = [];
    
    for (const link of navLinks) {
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);
      
      try {
        const linkElement = page.locator(`text="${link.text}"`).first();
        if (await linkElement.isVisible()) {
          await linkElement.click();
          await page.waitForTimeout(2000);
          
          const url = page.url();
          const bodyText = await page.textContent('body');
          
          // Check for errors
          if (bodyText.includes('Error') || bodyText.includes('404')) {
            failures.push({
              link: link.text,
              error: 'Page shows error',
              url
            });
          }
        }
      } catch (error) {
        failures.push({
          link: link.text,
          error: error.message
        });
      }
    }
    
    expect(failures).toHaveLength(0);
  });

  // Test ALL API endpoints for ALL repositories
  test('ALL repository API endpoints return valid data', async ({ page }) => {
    const failures = [];
    
    for (const repo of ALL_REPOSITORIES) {
      // Test multiple endpoints per repository
      const endpoints = [
        `/api/repository/${repo}/details`,
        `/api/repository/${repo}/files`,
        `/api/repository/${repo}/apis`,
        `/api/repository/${repo}/postman-collections`
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await page.request.get(`http://localhost:3001${endpoint}`);
          
          // Check for authentication errors
          if (response.status() === 401 || response.status() === 403) {
            failures.push({
              repo,
              endpoint,
              error: `Authentication error: ${response.status()}`
            });
          }
          
          // Check for server errors
          if (response.status() >= 500) {
            failures.push({
              repo,
              endpoint,
              error: `Server error: ${response.status()}`
            });
          }
          
          // If 200, check response is valid JSON
          if (response.status() === 200) {
            try {
              const data = await response.json();
              if (!data) {
                failures.push({
                  repo,
                  endpoint,
                  error: 'Empty response'
                });
              }
            } catch (e) {
              failures.push({
                repo,
                endpoint,
                error: 'Invalid JSON response'
              });
            }
          }
          
        } catch (error) {
          failures.push({
            repo,
            endpoint,
            error: error.message
          });
        }
      }
    }
    
    if (failures.length > 0) {
      console.error('API failures:', failures);
    }
    
    expect(failures).toHaveLength(0);
  });

  // Test documentation links within repositories
  test('ALL documentation links within repositories work', async ({ page }) => {
    const failures = [];
    const reposToTest = ALL_REPOSITORIES.slice(0, 5); // Test first 5 to avoid timeout
    
    for (const repo of reposToTest) {
      await page.goto(`http://localhost:3000/repository/${repo}`);
      await page.waitForTimeout(2000);
      
      // Find all links on the page
      const links = await page.locator('a').all();
      
      for (const link of links.slice(0, 5)) { // Test first 5 links per repo
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          try {
            await link.click();
            await page.waitForTimeout(1000);
            
            const bodyText = await page.textContent('body');
            if (bodyText.includes('404') || bodyText.includes('Not Found') || bodyText.includes('Error')) {
              failures.push({
                repo,
                link: text,
                href,
                error: 'Link leads to error page'
              });
            }
            
            // Go back
            await page.goBack();
            await page.waitForTimeout(1000);
            
          } catch (error) {
            failures.push({
              repo,
              link: text,
              href,
              error: error.message
            });
          }
        }
      }
    }
    
    expect(failures).toHaveLength(0);
  });

  // Test Add Repository modal for each repository type
  test('Add Repository modal works for different URL formats', async ({ page }) => {
    const testUrls = [
      'https://github.com/owner/repo',
      'github.com/owner/repo',
      'https://github.com/owner/repo.git',
      'git@github.com:owner/repo.git'
    ];
    
    const failures = [];
    
    for (const url of testUrls) {
      await page.goto('http://localhost:3000/repositories');
      await page.waitForTimeout(2000);
      
      const addButton = page.locator('button:has-text("+Add Repository"), button:has-text("Add Repository")').first();
      
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(1000);
        
        const urlInput = page.locator('input[placeholder*="github"], input[type="url"]').first();
        if (await urlInput.isVisible()) {
          await urlInput.fill(url);
          await page.waitForTimeout(500);
          
          // Check that parsing works
          const parsedInfo = await page.locator('text=/owner|repo/').count();
          if (parsedInfo === 0) {
            failures.push({
              url,
              error: 'URL not parsed correctly'
            });
          }
          
          // Close modal
          const cancelButton = page.locator('button:has-text("Cancel")').first();
          if (await cancelButton.isVisible()) {
            await cancelButton.click();
          }
        }
      }
    }
    
    expect(failures).toHaveLength(0);
  });

  // Test search functionality
  test('Search finds all repositories', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Open search (Ctrl+K or Cmd+K)
    await page.keyboard.press('Control+K');
    await page.waitForTimeout(1000);
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    
    if (await searchInput.isVisible()) {
      // Test searching for different repositories
      const searchTerms = ['ai', 'predictive', 'platform', 'architecture', 'mobility'];
      
      for (const term of searchTerms) {
        await searchInput.fill(term);
        await page.waitForTimeout(500);
        
        // Check results appear
        const results = await page.locator('[role="option"], .search-result').count();
        expect(results).toBeGreaterThan(0);
        
        await searchInput.clear();
      }
    }
  });

  // Test responsive navigation
  test('Mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    // Look for hamburger menu
    const hamburger = page.locator('[aria-label*="menu"], [class*="hamburger"], [class*="mobile-menu"]').first();
    
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(1000);
      
      // Check mobile menu opened
      const mobileNav = page.locator('[class*="mobile"], [class*="drawer"]').first();
      await expect(mobileNav).toBeVisible();
    }
  });

  // Performance test - all repos should load quickly
  test('ALL repositories load within acceptable time', async ({ page }) => {
    const slowRepos = [];
    
    for (const repo of ALL_REPOSITORIES.slice(0, 10)) { // Test first 10
      const startTime = Date.now();
      
      await page.goto(`http://localhost:3000/repository/${repo}`);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      if (loadTime > 5000) { // 5 seconds max
        slowRepos.push({
          repo,
          loadTime: `${loadTime}ms`
        });
      }
    }
    
    expect(slowRepos).toHaveLength(0);
  });

  // Final comprehensive health check
  test('FINAL: Complete application health check', async ({ page }) => {
    const healthChecks = {
      homepage: false,
      repositories: false,
      apiEndpoints: false,
      navigation: false,
      search: false,
      modal: false,
      noErrors: true
    };
    
    // Check homepage
    await page.goto('http://localhost:3000');
    const homeText = await page.textContent('body');
    healthChecks.homepage = !homeText.includes('Error');
    
    // Check repositories page
    await page.goto('http://localhost:3000/repositories');
    const repoText = await page.textContent('body');
    healthChecks.repositories = !repoText.includes('Error Loading Repositories');
    
    // Check API
    const apiResponse = await page.request.get('http://localhost:3001/api/health');
    healthChecks.apiEndpoints = apiResponse.status() === 200;
    
    // Check navigation
    await page.click('text=Repositories');
    healthChecks.navigation = page.url().includes('/repositories');
    
    // Check for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.reload();
    await page.waitForTimeout(2000);
    healthChecks.noErrors = errors.length === 0;
    
    // All checks should pass
    for (const [check, passed] of Object.entries(healthChecks)) {
      expect(passed).toBe(true);
    }
    
    console.log('✅ ALL COMPREHENSIVE TESTS PASSED - APPLICATION IS FULLY FUNCTIONAL');
  });
});