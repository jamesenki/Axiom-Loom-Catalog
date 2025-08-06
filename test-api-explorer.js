const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('1. Navigating to homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Look for API Discovery Center section
    console.log('2. Looking for API Discovery Center...');
    const apiSection = await page.$eval('body', body => {
      return body.textContent.includes('API Discovery Center');
    });
    console.log('API Discovery Center found:', apiSection);
    
    // Click on a repository that has APIs
    console.log('3. Looking for repository with APIs...');
    const repoCards = await page.$$('[data-testid="repository-card"]');
    console.log(`Found ${repoCards.length} repository cards`);
    
    // Find a repository with APIs
    let clickedRepo = false;
    for (const card of repoCards) {
      const cardText = await page.evaluate(el => el.textContent, card);
      if (cardText && cardText.includes('APIs')) {
        console.log('Found repository with APIs, clicking...');
        await card.click();
        clickedRepo = true;
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Current URL:', page.url());
        break;
      }
    }
    
    if (!clickedRepo) {
      // Try clicking on the first card with high API count
      console.log('Looking for repository with high API count...');
      for (const card of repoCards) {
        const cardText = await page.evaluate(el => el.textContent, card);
        if (cardText && (cardText.includes('65') || cardText.includes('48') || cardText.includes('APIs'))) {
          console.log('Found repository with many APIs:', cardText.substring(0, 100));
          await card.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log('Current URL:', page.url());
          break;
        }
      }
    }
    
    // Check if we're on a repository detail page
    const currentUrl = page.url();
    if (currentUrl.includes('/repository/')) {
      console.log('4. On repository detail page, looking for API Explorer...');
      
      // Look for API-related elements
      const apiElements = await page.$$eval('[class*="api"], [data-testid*="api"]', elements => 
        elements.map(el => ({
          text: el.textContent.substring(0, 100),
          className: el.className
        }))
      );
      
      console.log('Found API-related elements:', apiElements.length);
      apiElements.forEach(el => console.log(' -', el.text));
      
      // Look for tabs or sections
      const tabs = await page.$$('[role="tab"], [class*="tab"]');
      console.log(`Found ${tabs.length} tabs`);
      
      for (const tab of tabs) {
        const tabText = await page.evaluate(el => el.textContent, tab);
        if (tabText && (tabText.includes('API') || tabText.includes('Explorer'))) {
          console.log(`Clicking tab: ${tabText}`);
          await tab.click();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    console.log('API Explorer test completed!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();