const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://10.0.0.109:3000/api-explorer/ai-predictive-maintenance-engine-architecture');
  await page.waitForTimeout(3000);
  
  // Force override ALL h3 elements to white
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      h3, .sc-eknHtZ, [class*="CardTitle"] {
        color: rgb(255, 255, 255) \!important;
        opacity: 1 \!important;
        filter: none \!important;
      }
      
      p, [class*="Card"] p {
        color: rgb(224, 224, 230) \!important;
        opacity: 1 \!important;
      }
      
      div[class*="Card"] * {
        color: rgb(255, 255, 255) \!important;
        opacity: 1 \!important;
      }
    `;
    document.head.appendChild(style);
  });
  
  await page.screenshot({ path: 'forced-override.png' });
  console.log('Screenshot with forced white styles saved');
  
  await browser.close();
})();
