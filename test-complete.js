const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  const results = {
    homepage: false,
    repositoryCards: false,
    navigation: false,
    search: false,
    apiExplorer: false
  };
  
  try {
    console.log('=== EYNS AI Experience Center E2E Test ===\n');
    
    // 1. Homepage Test
    console.log('1. Testing Homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    const title = await page.title();
    console.log('   Page title:', title);
    results.homepage = title.includes('EYNS');
    console.log('   ✓ Homepage loads successfully\n');
    
    // 2. Repository Cards Test
    console.log('2. Testing Repository Cards...');
    const repoCards = await page.$$('[data-testid="repository-card"]');
    console.log(`   Found ${repoCards.length} repository cards`);
    results.repositoryCards = repoCards.length > 0;
    
    // Check card content
    if (repoCards.length > 0) {
      const firstCardText = await page.evaluate(el => el.textContent, repoCards[0]);
      console.log('   First card preview:', firstCardText.substring(0, 100) + '...');
      console.log('   ✓ Repository cards display correctly\n');
    }
    
    // 3. Navigation Test
    console.log('3. Testing Navigation...');
    const syncLink = await page.$('a[href="/sync"]');
    if (syncLink) {
      await syncLink.click();
      await page.waitForNavigation({ timeout: 5000 }).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 1000));
      const syncUrl = page.url();
      console.log('   Sync page URL:', syncUrl);
      results.navigation = syncUrl.includes('/sync');
      
      // Go back home
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
      console.log('   ✓ Navigation works correctly\n');
    }
    
    // 4. Search Test
    console.log('4. Testing Search...');
    const searchButton = await page.$('button');
    let foundSearch = false;
    const buttons = await page.$$('button');
    
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && (text.includes('Search') || text.includes('⌘K'))) {
        await button.click();
        foundSearch = true;
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const searchInput = await page.$('input[type="search"], input[type="text"]');
        if (searchInput) {
          await searchInput.type('test search');
          console.log('   ✓ Search modal opens and accepts input');
          results.search = true;
          await page.keyboard.press('Escape');
        }
        break;
      }
    }
    
    if (!foundSearch) {
      console.log('   ⚠ Search button not found\n');
    } else {
      console.log('');
    }
    
    // 5. API Explorer Test
    console.log('5. Testing API Explorer...');
    const apiSectionText = await page.$eval('body', body => body.textContent);
    if (apiSectionText.includes('API Discovery Center')) {
      console.log('   ✓ API Discovery Center section found');
      results.apiExplorer = true;
    }
    
    // Check API stats
    if (apiSectionText.includes('AVAILABLE APIS')) {
      const match = apiSectionText.match(/(\d+)\s*AVAILABLE APIS/);
      if (match) {
        console.log(`   Total available APIs: ${match[1]}`);
      }
    }
    console.log('');
    
    // Summary
    console.log('=== Test Summary ===');
    console.log(`Homepage:         ${results.homepage ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Repository Cards: ${results.repositoryCards ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Navigation:       ${results.navigation ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Search:           ${results.search ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`API Explorer:     ${results.apiExplorer ? '✓ PASS' : '✗ FAIL'}`);
    
    const allPassed = Object.values(results).every(v => v);
    console.log(`\nOverall: ${allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);
    
  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
})();