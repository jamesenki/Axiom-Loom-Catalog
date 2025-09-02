import { test, expect } from '@playwright/test';

test.describe('Yellow Element Analysis', () => {
  const baseURL = 'http://10.0.0.109:3000';

  test('Identify specific yellow elements', async ({ page }) => {
    console.log('🔍 ANALYZING YELLOW COLOR ELEMENTS');
    console.log('==================================================');
    
    await page.goto(baseURL, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Take screenshot for reference
    await page.screenshot({ 
      path: 'test-results/yellow-analysis-screenshot.png', 
      fullPage: true 
    });

    const yellowAnalysis = await page.evaluate(() => {
      const results = {
        totalElements: 0,
        yellowElements: [],
        detailedAnalysis: []
      };

      const allElements = document.querySelectorAll('*');
      results.totalElements = allElements.length;

      for (let element of allElements) {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        const borderColor = styles.borderColor;
        
        // Check for any yellow-related colors
        const hasYellowColor = color.includes('yellow') || color.includes('255, 255, 0') || 
                              color.includes('#ffff00') || color.includes('rgb(255, 255, 0)');
        const hasYellowBackground = backgroundColor.includes('yellow') || backgroundColor.includes('255, 255, 0') ||
                                   backgroundColor.includes('#ffff00') || backgroundColor.includes('rgb(255, 255, 0)');
        const hasYellowBorder = borderColor.includes('yellow') || borderColor.includes('255, 255, 0') ||
                               borderColor.includes('#ffff00') || borderColor.includes('rgb(255, 255, 0)');

        if (hasYellowColor || hasYellowBackground || hasYellowBorder) {
          const elementInfo = {
            tagName: element.tagName,
            id: element.id || 'no-id',
            className: element.className || 'no-class',
            textContent: element.textContent ? element.textContent.substring(0, 50) + '...' : 'no-text',
            styles: {
              color: color,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              display: styles.display,
              position: styles.position,
              visibility: styles.visibility,
              opacity: styles.opacity
            },
            yellowType: []
          };

          if (hasYellowColor) elementInfo.yellowType.push('text-color');
          if (hasYellowBackground) elementInfo.yellowType.push('background');
          if (hasYellowBorder) elementInfo.yellowType.push('border');

          // Get element path for easier identification
          let path = element.tagName;
          if (element.id) path += '#' + element.id;
          if (element.className) path += '.' + element.className.split(' ')[0];
          elementInfo.cssPath = path;

          // Check if element is actually visible
          const rect = element.getBoundingClientRect();
          elementInfo.isVisible = rect.width > 0 && rect.height > 0 && 
                                 styles.visibility !== 'hidden' && 
                                 styles.display !== 'none' &&
                                 parseFloat(styles.opacity) > 0;

          results.yellowElements.push(elementInfo);
          
          // Add to detailed analysis if visible
          if (elementInfo.isVisible) {
            results.detailedAnalysis.push({
              element: path,
              yellowType: elementInfo.yellowType,
              styles: elementInfo.styles,
              recommendation: 'Change to dark theme colors'
            });
          }
        }
      }

      return results;
    });

    console.log('📊 YELLOW ELEMENT ANALYSIS RESULTS:');
    console.log(`Total elements scanned: ${yellowAnalysis.totalElements}`);
    console.log(`Yellow elements found: ${yellowAnalysis.yellowElements.length}`);
    console.log(`Visible yellow elements: ${yellowAnalysis.detailedAnalysis.length}`);

    if (yellowAnalysis.yellowElements.length > 0) {
      console.log('\n🚨 YELLOW ELEMENTS DETECTED:');
      console.log('==================================================');
      
      yellowAnalysis.yellowElements.slice(0, 10).forEach((element, index) => {
        console.log(`\n${index + 1}. ${element.cssPath}`);
        console.log(`   Tag: ${element.tagName}`);
        console.log(`   ID: ${element.id}`);
        console.log(`   Class: ${element.className}`);
        console.log(`   Text: ${element.textContent}`);
        console.log(`   Yellow Type: ${element.yellowType.join(', ')}`);
        console.log(`   Visible: ${element.isVisible ? 'YES' : 'NO'}`);
        console.log(`   Color: ${element.styles.color}`);
        console.log(`   Background: ${element.styles.backgroundColor}`);
        console.log(`   Border: ${element.styles.borderColor}`);
      });

      if (yellowAnalysis.yellowElements.length > 10) {
        console.log(`\n... and ${yellowAnalysis.yellowElements.length - 10} more elements`);
      }

      console.log('\n🛠️  CSS FIXES NEEDED:');
      console.log('==================================================');
      const uniqueClasses = new Set();
      const uniqueIds = new Set();
      
      yellowAnalysis.detailedAnalysis.forEach(element => {
        if (element.element.includes('.')) {
          const className = element.element.split('.')[1];
          if (className && className !== 'no-class') {
            uniqueClasses.add(className);
          }
        }
        if (element.element.includes('#')) {
          const id = element.element.split('#')[1];
          if (id && id !== 'no-id') {
            uniqueIds.add(id);
          }
        }
      });

      console.log('Classes that need dark theme fixes:');
      uniqueClasses.forEach(className => {
        console.log(`  .${className} { color: #cbd5e1; background-color: transparent; }`);
      });

      console.log('IDs that need dark theme fixes:');
      uniqueIds.forEach(id => {
        console.log(`  #${id} { color: #cbd5e1; background-color: transparent; }`);
      });
    }

    console.log('\n📋 SUMMARY:');
    console.log(`- Total yellow elements: ${yellowAnalysis.yellowElements.length}`);
    console.log(`- Visible yellow elements: ${yellowAnalysis.detailedAnalysis.length}`);
    console.log(`- Dark theme compliance: ${yellowAnalysis.yellowElements.length === 0 ? 'PERFECT ✅' : 'NEEDS FIXES ❌'}`);

    return yellowAnalysis;
  });
});