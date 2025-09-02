import { test, expect } from '@playwright/test';

test('Simple hover test for blur effects', async ({ page }) => {
  console.log('=== SIMPLE HOVER TEST ===');
  
  // Navigate to the exact URL
  await page.goto('/docs/ai-predictive-maintenance-engine-architecture');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  console.log('Page loaded:', page.url());
  
  // 1. Take initial screenshot
  await page.screenshot({ path: 'hover-test-initial.png', fullPage: true });
  console.log('📸 Initial state captured');
  
  // 2. Find and test header navigation items
  const navItems = [
    'text="Home"',
    'text="Repositories"', 
    'text="APIs"',
    'text="Sync"'
  ];
  
  for (const navItem of navItems) {
    try {
      const element = page.locator(navItem);
      if (await element.count() > 0) {
        console.log(`Testing hover on: ${navItem}`);
        
        // Screenshot before hover
        await page.screenshot({ path: `before-hover-${navItem.replace(/[^a-zA-Z0-9]/g, '')}.png` });
        
        // Hover
        await element.hover();
        await page.waitForTimeout(1000);
        
        // Screenshot during hover
        await page.screenshot({ path: `during-hover-${navItem.replace(/[^a-zA-Z0-9]/g, '')}.png` });
        
        // Get computed styles during hover
        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            filter: computed.filter,
            backdropFilter: computed.backdropFilter,
            opacity: computed.opacity,
            transform: computed.transform,
            textShadow: computed.textShadow,
            boxShadow: computed.boxShadow
          };
        });
        
        console.log(`  Styles during hover:`, styles);
        
        // Move mouse away
        await page.mouse.move(0, 0);
        await page.waitForTimeout(500);
        
        // Screenshot after hover
        await page.screenshot({ path: `after-hover-${navItem.replace(/[^a-zA-Z0-9]/g, '')}.png` });
        
      }
    } catch (error) {
      console.log(`Error testing ${navItem}: ${error}`);
    }
  }
  
  // 3. Test search box hover
  try {
    const searchBox = page.locator('[placeholder*="Search"], input[type="search"], .search');
    if (await searchBox.count() > 0) {
      console.log('Testing search box hover');
      await searchBox.hover();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'search-hover.png' });
      
      const searchStyles = await searchBox.first().evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          filter: computed.filter,
          backdropFilter: computed.backdropFilter,
          opacity: computed.opacity,
          transform: computed.transform
        };
      });
      console.log('Search box styles:', searchStyles);
    }
  } catch (error) {
    console.log('Search box test error:', error);
  }
  
  // 4. Check for any CSS rules with blur
  const blurRules = await page.evaluate(() => {
    const rules: string[] = [];
    try {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const cssRules = Array.from(sheet.cssRules || []);
          for (const rule of cssRules) {
            const cssText = (rule as any).cssText || '';
            if (cssText.includes('blur') || cssText.includes('backdrop-filter')) {
              rules.push(cssText);
            }
          }
        } catch (e) {
          // Skip inaccessible stylesheets
        }
      }
    } catch (e) {
      console.log('Error accessing stylesheets');
    }
    return rules;
  });
  
  console.log(`Found ${blurRules.length} CSS rules with blur/backdrop-filter:`);
  blurRules.forEach((rule, i) => {
    console.log(`${i + 1}. ${rule}`);
  });
  
  // 5. Final screenshot
  await page.screenshot({ path: 'hover-test-final.png', fullPage: true });
  console.log('📸 Test complete');
});