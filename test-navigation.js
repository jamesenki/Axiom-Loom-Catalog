const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('1. Navigating to homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Test clicking on a repository card
    console.log('2. Looking for repository cards...');
    const repoCard = await page.$('[data-testid="repository-card"]');
    if (repoCard) {
      console.log('Found repository card, clicking...');
      await repoCard.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Current URL after click:', page.url());
    }
    
    // Test navigation links
    console.log('3. Testing navigation links...');
    
    // Click on Sync link
    const syncLink = await page.$('a[href="/sync"]');
    if (syncLink) {
      console.log('Clicking Sync link...');
      await syncLink.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Current URL:', page.url());
    }
    
    // Go back to home
    const homeLink = await page.$('a[href="/"]');
    if (homeLink) {
      console.log('Clicking Home link...');
      await homeLink.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Current URL:', page.url());
    }
    
    // Test search
    console.log('4. Testing search button...');
    const searchButton = await page.$('button:has-text("Search"), button:has-text("⌘K")');
    if (searchButton) {
      console.log('Found search button');
    }
    
    console.log('Navigation test completed!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();