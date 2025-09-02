import { test, expect } from '@playwright/test';

test.describe('Verify Actual Colors and Styles', () => {
  test('capture actual computed styles and colors', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    
    // Capture actual computed styles from the page
    const actualStyles = await page.evaluate(() => {
      const results = {
        header: {},
        cards: [],
        buttons: [],
        backgrounds: [],
        text: []
      };
      
      // Check header styles
      const header = document.querySelector('header');
      if (header) {
        const styles = window.getComputedStyle(header);
        results.header = {
          backgroundColor: styles.backgroundColor,
          backdropFilter: styles.backdropFilter || styles.webkitBackdropFilter,
          borderBottom: styles.borderBottom,
          boxShadow: styles.boxShadow
        };
      }
      
      // Check card styles (glass cards)
      const cards = document.querySelectorAll('[class*="Card"], [class*="card"]');
      cards.forEach((card, i) => {
        if (i < 3) { // First 3 cards
          const styles = window.getComputedStyle(card);
          results.cards.push({
            className: card.className,
            backgroundColor: styles.backgroundColor,
            backdropFilter: styles.backdropFilter || styles.webkitBackdropFilter,
            border: styles.border,
            boxShadow: styles.boxShadow
          });
        }
      });
      
      // Check button styles
      const buttons = document.querySelectorAll('button, a[class*="Button"], a[class*="button"]');
      buttons.forEach((btn, i) => {
        if (i < 5) { // First 5 buttons
          const styles = window.getComputedStyle(btn);
          results.buttons.push({
            text: btn.textContent?.trim(),
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            border: styles.border,
            backdropFilter: styles.backdropFilter || styles.webkitBackdropFilter
          });
        }
      });
      
      // Check any cyan/green/bright colors
      const allElements = document.querySelectorAll('*');
      const colorMap = new Map();
      
      allElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        
        // Track unique colors
        if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'rgb(0, 0, 0)') {
          if (!colorMap.has(color)) {
            colorMap.set(color, []);
          }
          colorMap.get(color).push(el.tagName);
        }
        
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          if (!colorMap.has(bgColor)) {
            colorMap.set(bgColor, []);
          }
          colorMap.get(bgColor).push(el.tagName + ' (bg)');
        }
      });
      
      // Find any bright/problematic colors
      const problematicColors = [];
      colorMap.forEach((elements, color) => {
        // Check for bright cyan, green, etc
        if (color.includes('255') || // Very bright colors
            color.includes('250') ||
            color.includes('(6,') || // RGB values starting with very low numbers
            color.includes('(80,') ||
            color.match(/rgb\(\d+,\s*2[4-5]\d,/) || // High green values
            color.match(/#[0-9a-f]*ff/i)) { // Hex with FF (very bright)
          problematicColors.push({
            color,
            elements: elements.slice(0, 3),
            count: elements.length
          });
        }
      });
      
      results.problematicColors = problematicColors;
      results.totalColors = colorMap.size;
      
      return results;
    });
    
    // Log all findings
    console.log('\n=== ACTUAL STYLES FOUND ===\n');
    
    console.log('HEADER:', JSON.stringify(actualStyles.header, null, 2));
    
    console.log('\nCARDS:');
    actualStyles.cards.forEach((card, i) => {
      console.log(`Card ${i + 1}:`, JSON.stringify(card, null, 2));
    });
    
    console.log('\nBUTTONS:');
    actualStyles.buttons.forEach(btn => {
      console.log(`"${btn.text}":`, JSON.stringify(btn, null, 2));
    });
    
    console.log('\nPROBLEMATIC COLORS FOUND:');
    if (actualStyles.problematicColors.length > 0) {
      actualStyles.problematicColors.forEach(({ color, elements, count }) => {
        console.log(`  ${color} - used ${count} times in: ${elements.join(', ')}`);
      });
    } else {
      console.log('  None found');
    }
    
    console.log(`\nTotal unique colors on page: ${actualStyles.totalColors}`);
    
    // Take screenshots
    await page.screenshot({ 
      path: 'color-test-full-page.png',
      fullPage: true 
    });
    
    // Focus on a card to see its styles
    const firstCard = page.locator('[class*="Card"], [class*="card"]').first();
    if (await firstCard.count() > 0) {
      await firstCard.screenshot({ 
        path: 'color-test-card.png' 
      });
    }
    
    // Navigate to a repo detail page to check documentation colors
    const repoLink = page.locator('a[href^="/repo/"]').first();
    if (await repoLink.count() > 0) {
      await repoLink.click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: 'color-test-repo-detail.png',
        fullPage: true 
      });
      
      // Check for documentation view
      const docsBtn = page.locator('a:has-text("Documentation"), button:has-text("Documentation")').first();
      if (await docsBtn.count() > 0) {
        await docsBtn.click();
        await page.waitForTimeout(2000);
        
        await page.screenshot({ 
          path: 'color-test-documentation.png',
          fullPage: true 
        });
        
        // Get documentation area styles
        const docStyles = await page.evaluate(() => {
          const docArea = document.querySelector('[class*="Documentation"], [class*="markdown"], main');
          if (docArea) {
            const styles = window.getComputedStyle(docArea);
            return {
              color: styles.color,
              backgroundColor: styles.backgroundColor,
              backdropFilter: styles.backdropFilter || styles.webkitBackdropFilter
            };
          }
          return null;
        });
        
        console.log('\nDOCUMENTATION AREA STYLES:', JSON.stringify(docStyles, null, 2));
      }
    }
    
    console.log('\n=== SCREENSHOTS SAVED ===');
    console.log('- color-test-full-page.png');
    console.log('- color-test-card.png');
    console.log('- color-test-repo-detail.png');
    console.log('- color-test-documentation.png');
  });
});