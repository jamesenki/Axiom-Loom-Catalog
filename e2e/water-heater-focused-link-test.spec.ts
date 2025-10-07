import { test, expect } from '@playwright/test';

test.describe('Water Heater Platform - Focused Link Analysis', () => {
  test('Detailed button and link analysis', async ({ page }) => {
    console.log('\n=== DETAILED WATER HEATER PLATFORM LINK ANALYSIS ===');
    
    // Navigate to the repository page
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform', { 
      waitUntil: 'networkidle' 
    });

    // Take main page screenshot
    await page.screenshot({ 
      path: 'e2e/screenshots/water-heater-detailed-analysis.png',
      fullPage: true 
    });

    console.log('\n--- TESTING MAIN ACTION BUTTONS ---');
    
    // Test each button individually with specific selectors
    const buttonTests = [
      { selector: 'button:has-text("Architecture Demo")', name: 'Architecture Demo' },
      { selector: 'button:has-text("Implementation Guide")', name: 'Implementation Guide' },
      { selector: 'button:has-text("Product Details")', name: 'Product Details' },
      { selector: 'button:has-text("Documentation")', name: 'Documentation' },
      { selector: 'button:has-text("API Explorer")', name: 'API Explorer' },
      { selector: 'button:has-text("Postman Collections")', name: 'Postman Collections' },
      { selector: 'button:has-text("GraphQL Playground")', name: 'GraphQL Playground' },
      { selector: 'button:has-text("View Demo")', name: 'View Demo' },
      { selector: 'button:has-text("View on GitHub")', name: 'View on GitHub' }
    ];

    const buttonResults: Array<{
      name: string;
      exists: boolean;
      clickable: boolean;
      destination?: string;
      error?: string;
    }> = [];

    for (const buttonTest of buttonTests) {
      try {
        console.log(`Testing button: ${buttonTest.name}`);
        
        const button = page.locator(buttonTest.selector);
        const exists = await button.count() > 0;
        
        if (exists) {
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          
          console.log(`  ✓ Button exists and is visible: ${isVisible}, enabled: ${isEnabled}`);
          
          if (isVisible && isEnabled) {
            // Try to click and see what happens
            const originalUrl = page.url();
            
            // Open in new page to test destination
            const newPagePromise = page.context().waitForEvent('page');
            
            try {
              await button.click({ timeout: 3000 });
              
              // Wait a bit to see if navigation occurs
              await page.waitForTimeout(2000);
              
              const newUrl = page.url();
              if (newUrl !== originalUrl) {
                console.log(`  ✓ Button navigated to: ${newUrl}`);
                buttonResults.push({
                  name: buttonTest.name,
                  exists: true,
                  clickable: true,
                  destination: newUrl
                });
                
                // Take screenshot of destination
                await page.screenshot({ 
                  path: `e2e/screenshots/water-heater-button-${buttonTest.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-destination.png`,
                  fullPage: true 
                });
                
                // Go back to original page
                await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform', { 
                  waitUntil: 'networkidle' 
                });
              } else {
                console.log(`  ! Button clicked but no navigation occurred`);
                buttonResults.push({
                  name: buttonTest.name,
                  exists: true,
                  clickable: false,
                  error: 'No navigation occurred'
                });
              }
            } catch (clickError) {
              console.log(`  ❌ Button click failed: ${clickError}`);
              buttonResults.push({
                name: buttonTest.name,
                exists: true,
                clickable: false,
                error: `Click failed: ${clickError}`
              });
            }
          } else {
            buttonResults.push({
              name: buttonTest.name,
              exists: true,
              clickable: false,
              error: `Not visible (${isVisible}) or not enabled (${isEnabled})`
            });
          }
        } else {
          console.log(`  ❌ Button not found`);
          buttonResults.push({
            name: buttonTest.name,
            exists: false,
            clickable: false,
            error: 'Button not found'
          });
        }
      } catch (error) {
        console.log(`  ❌ Error testing button ${buttonTest.name}: ${error}`);
        buttonResults.push({
          name: buttonTest.name,
          exists: false,
          clickable: false,
          error: `Error: ${error}`
        });
      }
      
      await page.waitForTimeout(1000); // Delay between tests
    }

    console.log('\n--- BUTTON TEST RESULTS SUMMARY ---');
    buttonResults.forEach(result => {
      const status = result.clickable ? '✅ WORKING' : result.exists ? '⚠️  EXISTS BUT NOT CLICKABLE' : '❌ NOT FOUND';
      console.log(`${status} - ${result.name}`);
      if (result.destination) {
        console.log(`    Destination: ${result.destination}`);
      }
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });

    console.log('\n--- TESTING DOCUMENT LINKS ---');
    
    // Navigate to documentation to test internal links
    await page.goto('http://localhost:3000/docs/appliances-co-water-heater-platform/README.md', { 
      waitUntil: 'networkidle' 
    });

    const docLinks = await page.locator('a').all();
    console.log(`Found ${docLinks.length} links in documentation`);

    // Test first few document links
    for (let i = 0; i < Math.min(5, docLinks.length); i++) {
      const link = docLinks[i];
      try {
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        
        if (href && text) {
          console.log(`Doc Link ${i + 1}: "${text.trim()}" -> ${href}`);
          
          // Test the link
          const newPage = await page.context().newPage();
          try {
            const response = await newPage.goto(href.startsWith('http') ? href : `http://localhost:3000${href}`, {
              waitUntil: 'networkidle',
              timeout: 5000
            });
            
            console.log(`  Status: ${response?.status()}`);
            if (response?.status() === 200) {
              await newPage.screenshot({ 
                path: `e2e/screenshots/water-heater-doc-link-${i}-success.png`,
                fullPage: true 
              });
            }
          } catch (error) {
            console.log(`  Error: ${error}`);
            await newPage.screenshot({ 
              path: `e2e/screenshots/water-heater-doc-link-${i}-error.png`,
              fullPage: true 
            });
          }
          
          await newPage.close();
        }
      } catch (error) {
        console.log(`Error testing doc link ${i + 1}: ${error}`);
      }
    }

    // Assert that at least some buttons should exist
    const existingButtons = buttonResults.filter(r => r.exists);
    expect(existingButtons.length).toBeGreaterThan(3);
  });

  test('Compare with working repository patterns', async ({ page }) => {
    console.log('\n=== COMPARING WITH WORKING AI PREDICTIVE MAINTENANCE ===');
    
    // Test working repository
    await page.goto('http://localhost:3000/docs/ai-predictive-maintenance-engine-architecture', { 
      waitUntil: 'networkidle' 
    });

    await page.screenshot({ 
      path: 'e2e/screenshots/comparison-working-ai-predictive.png',
      fullPage: true 
    });

    const workingButtons = await page.locator('button').all();
    const workingLinks = await page.locator('a').all();

    console.log(`Working repo has ${workingButtons.length} buttons and ${workingLinks.length} links`);

    // Test a few buttons from working repo
    for (let i = 0; i < Math.min(3, workingButtons.length); i++) {
      const button = workingButtons[i];
      const text = await button.textContent();
      const isClickable = await button.isEnabled() && await button.isVisible();
      console.log(`Working repo button ${i + 1}: "${text?.trim()}" - Clickable: ${isClickable}`);
    }

    // Now test water heater repo
    console.log('\n--- NOW TESTING WATER HEATER FOR COMPARISON ---');
    
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform', { 
      waitUntil: 'networkidle' 
    });

    const waterHeaterButtons = await page.locator('button').all();
    const waterHeaterLinks = await page.locator('a').all();

    console.log(`Water heater repo has ${waterHeaterButtons.length} buttons and ${waterHeaterLinks.length} links`);

    // Test buttons from water heater repo
    for (let i = 0; i < Math.min(3, waterHeaterButtons.length); i++) {
      const button = waterHeaterButtons[i];
      const text = await button.textContent();
      const isClickable = await button.isEnabled() && await button.isVisible();
      console.log(`Water heater button ${i + 1}: "${text?.trim()}" - Clickable: ${isClickable}`);
    }

    console.log('\n--- STRUCTURAL COMPARISON ---');
    console.log(`Working repo: ${workingButtons.length} buttons, ${workingLinks.length} links`);
    console.log(`Water heater: ${waterHeaterButtons.length} buttons, ${waterHeaterLinks.length} links`);

    expect(waterHeaterButtons.length).toBeGreaterThan(0);
  });
});