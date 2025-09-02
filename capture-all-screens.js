const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function captureAllScreens() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const screens = [
    { name: '01-homepage', url: 'http://10.0.0.109:3000/' },
    { name: '02-repositories', url: 'http://10.0.0.109:3000/repositories' },
    { name: '03-apis', url: 'http://10.0.0.109:3000/apis' },
    { name: '04-docs', url: 'http://10.0.0.109:3000/docs' },
    { name: '05-api-explorer', url: 'http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine/api-explorer' },
    { name: '06-repo-detail', url: 'http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine' },
    { name: '07-postman-view', url: 'http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine/postman' },
    { name: '08-docs-view', url: 'http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine/docs' },
    { name: '09-graphql', url: 'http://10.0.0.109:3000/repository/future-mobility-fleet-platform/graphql' },
    { name: '10-all-apis', url: 'http://10.0.0.109:3000/apis' },
  ];
  
  console.log('Capturing all screens to identify contrast issues...\n');
  
  for (let screen of screens) {
    console.log(`📸 Capturing ${screen.name}...`);
    await page.goto(screen.url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    
    // Get text colors on page
    const textColors = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, h4, p, span, div, a');
      const colors = new Set();
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bg = style.backgroundColor;
        if (color) colors.add(`text: ${color}, bg: ${bg}`);
      });
      return Array.from(colors).slice(0, 10);
    });
    
    await page.screenshot({ path: `contrast-check-${screen.name}.png`, fullPage: true });
    
    console.log(`   Saved: contrast-check-${screen.name}.png`);
    console.log('   Sample colors found:');
    textColors.slice(0, 3).forEach(c => console.log(`     ${c}`));
    console.log('');
  }
  
  await browser.close();
  console.log('✅ All screenshots captured!');
}

captureAllScreens().catch(console.error);