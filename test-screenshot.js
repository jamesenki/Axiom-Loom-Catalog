const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Go to homepage
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'homepage.png', fullPage: true });
  
  // Check what's on the page
  const title = await page.title();
  console.log('Page title:', title);
  
  const h1 = await page.textContent('h1');
  console.log('H1 text:', h1);
  
  // Look for repository cards
  const cards = await page.$$('[class*="Card"]');
  console.log('Found cards:', cards.length);
  
  // Get all visible text
  const visibleText = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const texts = [];
    elements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length > 0 && text.length < 100 && el.offsetParent !== null) {
        texts.push(text);
      }
    });
    return [...new Set(texts)].slice(0, 50);
  });
  console.log('Visible texts:', visibleText);
  
  await browser.close();
})();