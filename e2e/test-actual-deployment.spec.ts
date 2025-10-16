import { test, expect } from '@playwright/test';

test('Test ACTUAL deployment on 10.0.0.109:3000', async ({ page }) => {
  console.log('\n🔍 Testing ACTUAL deployment at http://10.0.0.109:3000\n');
  
  // Go to the ACTUAL deployed URL
  await page.goto('http://10.0.0.109:3000');
  await page.waitForTimeout(3000);
  
  // Take a screenshot of what's actually deployed
  await page.screenshot({ 
    path: 'actual-deployment-10.0.0.109.png',
    fullPage: true 
  });
  
  // Get the actual colors being used
  const actualColors = await page.evaluate(() => {
    const results = {
      links: [],
      buttons: [],
      headerColors: []
    };
    
    // Check all links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      const color = window.getComputedStyle(link).color;
      if (color && !results.links.includes(color)) {
        results.links.push(color);
      }
    });
    
    // Check header
    const header = document.querySelector('header');
    if (header) {
      const styles = window.getComputedStyle(header);
      results.headerColors.push({
        bg: styles.backgroundColor,
        blur: styles.backdropFilter || styles.webkitBackdropFilter
      });
    }
    
    // Check any element with cyan/blue colors
    const allElements = document.querySelectorAll('*');
    const colorCount = {};
    allElements.forEach(el => {
      const color = window.getComputedStyle(el).color;
      if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'rgb(0, 0, 0)') {
        colorCount[color] = (colorCount[color] || 0) + 1;
      }
    });
    
    // Sort by usage count
    results.topColors = Object.entries(colorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([color, count]) => `${color} (${count} uses)`);
    
    return results;
  });
  
  console.log('🎨 ACTUAL COLORS ON http://10.0.0.109:3000:');
  console.log('\nLink colors:', actualColors.links);
  console.log('\nHeader:', actualColors.headerColors);
  console.log('\nTop 10 most used colors:');
  actualColors.topColors.forEach(color => console.log(`  - ${color}`));
  
  // Check if old dark colors are still there
  const hasOldDarkCyan = actualColors.topColors.some(c => c.includes('rgb(6, 86, 102)'));
  const hasNewBrightCyan = actualColors.topColors.some(c => c.includes('rgb(6, 182, 212)'));
  const hasNewBrightBlue = actualColors.topColors.some(c => c.includes('rgb(96, 165, 250)'));
  
  console.log('\n📊 Color Analysis:');
  if (hasOldDarkCyan) {
    console.log('❌ OLD DARK CYAN still present: rgb(6, 86, 102) = #065666');
  }
  if (hasNewBrightCyan) {
    console.log('✅ NEW BRIGHT CYAN found: rgb(6, 182, 212) = #06b6d4');
  }
  if (hasNewBrightBlue) {
    console.log('✅ NEW BRIGHT BLUE found: rgb(96, 165, 250) = #60a5fa');
  }
  
  if (!hasNewBrightCyan && !hasNewBrightBlue) {
    console.log('⚠️ WARNING: New colors NOT found on deployment!');
    console.log('The deployment may be serving an old cached version.');
  }
  
  console.log('\n📸 Screenshot saved: actual-deployment-10.0.0.109.png');
  
  // Also check what JavaScript is actually being served
  const response = await page.evaluate(async () => {
    try {
      const res = await fetch('/static/js/main.e4785428.js');
      const text = await res.text();
      
      // Check for color values in the JS
      const hasOldCyan = text.includes('#065666');
      const hasNewCyan = text.includes('#06b6d4');
      
      return {
        hasOldCyan,
        hasNewCyan,
        fileSize: text.length
      };
    } catch (e) {
      return { error: e.message };
    }
  });
  
  console.log('\n📦 JavaScript bundle check:');
  console.log('  Old cyan (#065666) in bundle:', response.hasOldCyan ? '❌ YES' : '✅ NO');
  console.log('  New cyan (#06b6d4) in bundle:', response.hasNewCyan ? '✅ YES' : '❌ NO');
  console.log('  Bundle size:', response.fileSize, 'bytes');
});