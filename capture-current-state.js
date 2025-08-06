const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Take screenshot
  await page.screenshot({ path: 'current-state.png', fullPage: true });
  console.log('Screenshot saved as current-state.png');
  
  // Check for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Console error:', msg.text());
    }
  });
  
  // Try to click on first repository card
  try {
    const firstCard = await page.locator('[data-testid="repository-card"]').first();
    const cardText = await firstCard.textContent();
    console.log('First card text:', cardText);
    
    // Check if Explore button exists
    const exploreButton = await firstCard.locator('text="Explore"').first();
    const hasExplore = await exploreButton.isVisible();
    console.log('Has Explore button:', hasExplore);
    
    if (hasExplore) {
      const href = await exploreButton.getAttribute('href');
      console.log('Explore button href:', href);
    }
  } catch (e) {
    console.error('Error checking card:', e.message);
  }
  
  await browser.close();
})();