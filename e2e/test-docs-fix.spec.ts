import { test, expect } from '@playwright/test';

test('VERIFY DOCUMENTATION FIX ON http://10.0.0.109:3000/docs', async ({ page }) => {
  console.log('\n🔍 Testing EXACT URL you provided: http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture\n');
  
  // Go to the EXACT problematic documentation page
  await page.goto('http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture');
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'docs-page-fixed.png',
    fullPage: true 
  });
  
  // Check for blur effects
  const blurElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const blurry = [];
    
    elements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const filter = styles.filter || '';
      const backdropFilter = styles.backdropFilter || styles.webkitBackdropFilter || '';
      
      if (filter.includes('blur') || backdropFilter.includes('blur')) {
        const blurMatch = (filter + backdropFilter).match(/blur\((\d+)/);
        if (blurMatch && parseInt(blurMatch[1]) > 0) {
          blurry.push({
            tag: el.tagName,
            class: el.className,
            blur: blurMatch[0],
            value: parseInt(blurMatch[1])
          });
        }
      }
    });
    
    return blurry;
  });
  
  console.log('🔍 BLUR CHECK:');
  if (blurElements.length === 0) {
    console.log('✅ NO BLUR FOUND - FIXED!');
  } else {
    console.log(`❌ STILL HAS ${blurElements.length} ELEMENTS WITH BLUR:`);
    blurElements.forEach(el => {
      console.log(`  - ${el.tag}.${el.class}: ${el.blur}`);
    });
  }
  
  // Check colors being used
  const colors = await page.evaluate(() => {
    const colorMap = {};
    const elements = document.querySelectorAll('*');
    
    elements.forEach(el => {
      const color = window.getComputedStyle(el).color;
      if (color && color !== 'rgba(0, 0, 0, 0)') {
        colorMap[color] = (colorMap[color] || 0) + 1;
      }
    });
    
    return Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([color, count]) => ({ color, count }));
  });
  
  console.log('\n🎨 TOP COLORS ON DOCUMENTATION PAGE:');
  colors.forEach(({ color, count }) => {
    // Check if it's the old cyan
    if (color === 'rgb(6, 182, 212)') {
      console.log(`  ❌ OLD CYAN STILL PRESENT: ${color} (${count} uses)`);
    } 
    // Check if it's the new yellow
    else if (color === 'rgb(251, 191, 36)') {
      console.log(`  ✅ NEW YELLOW FOUND: ${color} (${count} uses)`);
    }
    else {
      console.log(`  - ${color} (${count} uses)`);
    }
  });
  
  // Check for any aqua/green colors
  const hasAquaGreen = colors.some(({ color }) => {
    return color.includes('182, 212') || // Old cyan
           color.includes('86, 102') ||  // Dark cyan
           color.includes('78, 59');     // Dark emerald
  });
  
  console.log('\n📊 FINAL ANALYSIS:');
  console.log('  Blur effects:', blurElements.length === 0 ? '✅ REMOVED' : `❌ STILL PRESENT (${blurElements.length} elements)`);
  console.log('  Aqua/Green colors:', hasAquaGreen ? '❌ STILL PRESENT' : '✅ REMOVED');
  console.log('\n📸 Screenshot saved: docs-page-fixed.png');
  
  // VERIFY the fix
  expect(blurElements.length).toBe(0);
});