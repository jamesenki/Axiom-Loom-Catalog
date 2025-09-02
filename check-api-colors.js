const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://10.0.0.109:3000/api-explorer/cloudtwin-simulation-platform-architecture');
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'api-explorer-colors.png', fullPage: true });
  
  // Check specific elements
  const elements = await page.evaluate(() => {
    const results = [];
    
    // Check all card titles
    document.querySelectorAll('h3').forEach(el => {
      const styles = window.getComputedStyle(el);
      results.push({
        text: el.textContent?.substring(0, 30),
        color: styles.color,
        tag: 'h3 (card title)'
      });
    });
    
    // Check all paragraphs
    document.querySelectorAll('p').forEach(el => {
      const styles = window.getComputedStyle(el);
      if (el.textContent?.trim()) {
        results.push({
          text: el.textContent?.substring(0, 30),
          color: styles.color,
          tag: 'p (text)'
        });
      }
    });
    
    // Check filter buttons
    document.querySelectorAll('button').forEach(el => {
      const styles = window.getComputedStyle(el);
      results.push({
        text: el.textContent?.substring(0, 30),
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        tag: 'button'
      });
    });
    
    return results;
  });
  
  console.log('\n=== ACTUAL COLORS ON PAGE ===');
  elements.forEach(el => {
    if (el.text) {
      console.log(`${el.tag}: "${el.text}"`);
      console.log(`  Color: ${el.color}`);
      if (el.backgroundColor) {
        console.log(`  Background: ${el.backgroundColor}`);
      }
      
      // Check if it's dark on dark
      const colorMatch = el.color.match(/\d+/g);
      if (colorMatch) {
        const brightness = (parseInt(colorMatch[0]) * 0.299 + parseInt(colorMatch[1]) * 0.587 + parseInt(colorMatch[2]) * 0.114);
        if (brightness < 128) {
          console.log('  ⚠️ DARK TEXT DETECTED!');
        }
      }
    }
  });
  
  await browser.close();
})();