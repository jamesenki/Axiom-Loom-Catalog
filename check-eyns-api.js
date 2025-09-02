const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://10.0.0.109:3000/api-explorer/eyns-ai-experience-center');
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'eyns-api-explorer.png', fullPage: true });
  
  // Get ALL text from API cards
  const cardTexts = await page.evaluate(() => {
    const results = [];
    
    // Find all API cards
    const cards = document.querySelectorAll('div[class*="Card"]');
    
    cards.forEach(card => {
      const title = card.querySelector('h3');
      const texts = card.querySelectorAll('p');
      
      if (title) {
        const titleStyle = window.getComputedStyle(title);
        results.push({
          element: 'CARD TITLE',
          text: title.textContent,
          color: titleStyle.color
        });
      }
      
      texts.forEach(p => {
        const style = window.getComputedStyle(p);
        results.push({
          element: 'CARD TEXT',
          text: p.textContent?.substring(0, 50),
          color: style.color
        });
      });
    });
    
    return results;
  });
  
  console.log('\n=== EYNS-AI-EXPERIENCE-CENTER API EXPLORER ===');
  cardTexts.forEach(item => {
    console.log(`${item.element}: "${item.text}"`);
    console.log(`  Color: ${item.color}`);
    
    // Check if dark
    const match = item.color.match(/\d+/g);
    if (match) {
      const brightness = (parseInt(match[0]) * 0.299 + parseInt(match[1]) * 0.587 + parseInt(match[2]) * 0.114);
      if (brightness < 128) {
        console.log('  ❌ DARK TEXT!');
      } else {
        console.log('  ✓ Light text');
      }
    }
  });
  
  await browser.close();
})();