const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function takeQuickScreenshots() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const pages = [
    { name: 'homepage', url: 'http://10.0.0.109:3000/' },
    { name: 'apis', url: 'http://10.0.0.109:3000/apis' },
    { name: 'postman', url: 'http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine/postman' }
  ];
  
  for (let p of pages) {
    console.log(`Taking screenshot of ${p.name}...`);
    await page.goto(p.url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: `test-${p.name}.png`, fullPage: true });
    console.log(`Saved test-${p.name}.png`);
  }
  
  await browser.close();
  console.log('Done!');
}

takeQuickScreenshots().catch(console.error);