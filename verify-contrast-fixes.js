const puppeteer = require('puppeteer');

async function verifyContrastFixes() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const criticalPages = [
    { 
      name: 'homepage',
      url: 'http://10.0.0.109:3000/',
      description: 'Homepage with repository cards'
    },
    { 
      name: 'api-explorer-ai-predictive',
      url: 'http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine/api-explorer',
      description: 'API Explorer page - should have WHITE text on dark cards'
    },
    { 
      name: 'api-explorer-architecture',
      url: 'http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine-architecture/api-explorer',
      description: 'API Explorer Architecture - should have WHITE text'
    },
    { 
      name: 'repository-detail',
      url: 'http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine',
      description: 'Repository detail page'
    },
    { 
      name: 'all-apis',
      url: 'http://10.0.0.109:3000/apis',
      description: 'All APIs list page'
    }
  ];
  
  console.log('🔍 Verifying contrast fixes on critical pages...\n');
  
  for (let page_info of criticalPages) {
    console.log(`\n📸 ${page_info.description}`);
    console.log(`   URL: ${page_info.url}`);
    
    await page.goto(page_info.url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    
    // Check text visibility
    const textVisibility = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="Card"], [class*="card"]');
      const results = [];
      
      cards.forEach((card, index) => {
        if (index < 3) { // Check first 3 cards
          const title = card.querySelector('h3, h2, [class*="Title"]');
          const desc = card.querySelector('p, [class*="Description"]');
          
          if (title) {
            const titleStyle = window.getComputedStyle(title);
            results.push({
              element: 'title',
              text: title.textContent?.substring(0, 30),
              color: titleStyle.color,
              opacity: titleStyle.opacity
            });
          }
          
          if (desc) {
            const descStyle = window.getComputedStyle(desc);
            results.push({
              element: 'description',
              text: desc.textContent?.substring(0, 30),
              color: descStyle.color,
              opacity: descStyle.opacity
            });
          }
        }
      });
      
      return results;
    });
    
    await page.screenshot({ 
      path: `verified-${page_info.name}.png`,
      fullPage: true 
    });
    
    console.log(`   ✅ Screenshot saved: verified-${page_info.name}.png`);
    
    // Print text visibility results
    if (textVisibility.length > 0) {
      console.log('   Text visibility check:');
      textVisibility.forEach(item => {
        const isWhite = item.color.includes('255, 255, 255');
        const isBlack = item.color.includes('0, 0, 0');
        const visibility = isWhite ? '✅ WHITE' : isBlack ? '✅ BLACK' : `⚠️  ${item.color}`;
        console.log(`     ${item.element}: ${visibility} (opacity: ${item.opacity})`);
      });
    }
  }
  
  await browser.close();
  console.log('\n✅ Verification complete!');
}

verifyContrastFixes().catch(console.error);