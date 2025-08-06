const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('Browser:', msg.text()));
  
  console.log('1. Going to main docs page...');
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForTimeout(3000);
  
  // Click on Architecture Diagrams link
  console.log('2. Looking for Architecture Diagrams link...');
  const archDiagramsLink = await page.$('a:has-text("Architecture Diagrams")');
  
  if (archDiagramsLink) {
    console.log('3. Found Architecture Diagrams link, clicking...');
    await archDiagramsLink.click();
    await page.waitForTimeout(3000);
    
    console.log('4. Current URL after click:', page.url());
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/after-arch-diagrams-click.png', fullPage: true });
    
    // Check if we got to a new page or got an error
    const pageText = await page.textContent('body');
    if (pageText.includes('Error Loading') || pageText.includes('404')) {
      console.log('5. ERROR: Navigation resulted in error page');
      
      // Try to find api-10-diagrams.md link on the error page
      console.log('6. Since ./docs/api-specs failed, the file might be at ./docs/architecture/api-10-diagrams.md');
    } else {
      console.log('5. Page loaded successfully');
      
      // Look for links to api-10
      const api10Links = await page.$$eval('a', links => 
        links.filter(l => l.textContent && l.textContent.includes('10'))
          .map(l => ({ text: l.textContent, href: l.getAttribute('href') }))
      );
      console.log('6. Links containing "10":', api10Links);
    }
  } else {
    console.log('ERROR: Could not find Architecture Diagrams link');
  }
  
  await browser.close();
})();