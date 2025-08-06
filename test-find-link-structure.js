const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('1. Going to main docs page...');
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForTimeout(3000);
  
  // Get all links on the page
  const allLinks = await page.$$eval('a', links => 
    links.map(link => ({
      text: (link.textContent || '').trim().substring(0, 50),
      href: link.getAttribute('href'),
      fullText: link.textContent
    }))
  );
  
  console.log('\n2. All links found on page:');
  allLinks.forEach((link, i) => {
    if (link.href && !link.href.startsWith('#')) {
      console.log(`${i}: "${link.text}" -> ${link.href}`);
    }
  });
  
  // Look for any link containing "api" and "10" 
  const api10Links = allLinks.filter(l => 
    l.fullText && (
      l.fullText.toLowerCase().includes('api') && 
      l.fullText.includes('10')
    )
  );
  
  console.log('\n3. Links with "api" and "10":', api10Links);
  
  // Look for links to docs folders
  const docLinks = allLinks.filter(l => 
    l.href && (
      l.href.includes('docs/') || 
      l.href.includes('.md')
    )
  );
  
  console.log('\n4. Links to docs:', docLinks);
  
  await browser.close();
})();