const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Go to the actual repo you're looking at
  await page.goto('http://10.0.0.109:3000/api-explorer/ai-predictive-maintenance-engine-architecture');
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'actual-api-explorer.png', fullPage: true });
  
  // Get text colors from the actual API cards
  const analysis = await page.evaluate(() => {
    const results = {
      cardTitles: [],
      cardTexts: [],
      problems: []
    };
    
    // Get all h3 elements (card titles)
    document.querySelectorAll('h3').forEach(h3 => {
      const styles = window.getComputedStyle(h3);
      const text = h3.textContent;
      const color = styles.color;
      
      // Skip navigation items
      const skipItems = ['Navigation', 'Search', 'Demo', 'Help', 'Actions'];
      if (!skipItems.includes(text)) {
        results.cardTitles.push({ text, color });
        
        // Check if dark
        const match = color.match(/\d+/g);
        if (match) {
          const brightness = (parseInt(match[0]) * 0.299 + parseInt(match[1]) * 0.587 + parseInt(match[2]) * 0.114);
          if (brightness < 128) {
            results.problems.push(`DARK TITLE: "${text}" - ${color}`);
          }
        }
      }
    });
    
    // Get all p elements in cards
    document.querySelectorAll('div[class*="Card"] p, div[class*="card"] p').forEach(p => {
      const styles = window.getComputedStyle(p);
      const text = p.textContent?.substring(0, 50);
      const color = styles.color;
      
      if (text) {
        results.cardTexts.push({ text, color });
        
        // Check if dark
        const match = color.match(/\d+/g);
        if (match) {
          const brightness = (parseInt(match[0]) * 0.299 + parseInt(match[1]) * 0.587 + parseInt(match[2]) * 0.114);
          if (brightness < 128) {
            results.problems.push(`DARK TEXT: "${text}" - ${color}`);
          }
        }
      }
    });
    
    return results;
  });
  
  console.log('\n=== AI-PREDICTIVE-MAINTENANCE API EXPLORER ===');
  console.log('\nCARD TITLES:');
  analysis.cardTitles.forEach(item => {
    console.log(`"${item.text}" - Color: ${item.color}`);
  });
  
  console.log('\nCARD TEXTS:');
  analysis.cardTexts.forEach(item => {
    console.log(`"${item.text}" - Color: ${item.color}`);
  });
  
  if (analysis.problems.length > 0) {
    console.log('\n❌ PROBLEMS FOUND:');
    analysis.problems.forEach(p => console.log(p));
  } else {
    console.log('\n✓ All text is light colored');
  }
  
  await browser.close();
})();
