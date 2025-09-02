const { chromium } = require('playwright');
const fs = require('fs');

async function testApiExplorerVisibility() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to API Explorer...');
    await page.goto('http://10.0.0.109:3000/api-explorer/eyns-api-gateway');
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Wait for any loading indicators to disappear
    try {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (e) {
      console.log('Network not idle, continuing anyway');
    }
    
    // Take a screenshot
    const screenshot = await page.screenshot({ 
      path: 'api-explorer-visibility-check.png',
      fullPage: true 
    });
    
    // Get text content and styles of key elements
    const cardTitles = await page.$$eval('.card h3, .card h2, .card-title, h1, h2, h3, h4', elements => 
      elements.map(el => ({
        text: el.textContent.trim(),
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }))
    );
    
    const cardDescriptions = await page.$$eval('.card p, .card-description, .description, p', elements => 
      elements.map(el => ({
        text: el.textContent.trim().substring(0, 100),
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }))
    );
    
    const filePaths = await page.$$eval('code, .file-path, .path', elements => 
      elements.map(el => ({
        text: el.textContent.trim(),
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }))
    );
    
    console.log('\n=== VISIBILITY ANALYSIS ===\n');
    
    console.log('CARD TITLES:');
    cardTitles.forEach((item, i) => {
      if (item.text) {
        console.log(`${i + 1}. "${item.text}" - Color: ${item.color}`);
      }
    });
    
    console.log('\nCARD DESCRIPTIONS:');
    cardDescriptions.forEach((item, i) => {
      if (item.text && item.text.length > 10) {
        console.log(`${i + 1}. "${item.text}..." - Color: ${item.color}`);
      }
    });
    
    console.log('\nFILE PATHS/CODE:');
    filePaths.forEach((item, i) => {
      if (item.text) {
        console.log(`${i + 1}. "${item.text}" - Color: ${item.color}`);
      }
    });
    
    // Check for dark backgrounds
    const darkBackgrounds = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const darkElements = [];
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        
        // Check if background is dark (rgb values < 100)
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          const match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (match) {
            const [r, g, b] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
            if (r < 100 && g < 100 && b < 100) {
              darkElements.push({
                tag: el.tagName,
                classes: el.className,
                backgroundColor: bg
              });
            }
          }
        }
      });
      
      return darkElements;
    });
    
    console.log('\nDARK BACKGROUND ELEMENTS:');
    darkBackgrounds.slice(0, 10).forEach((item, i) => {
      console.log(`${i + 1}. ${item.tag}.${item.classes} - Background: ${item.backgroundColor}`);
    });
    
    console.log(`\nScreenshot saved as: api-explorer-visibility-check.png`);
    
  } catch (error) {
    console.error('Error during test:', error);
    
    // Try to take a screenshot anyway
    try {
      await page.screenshot({ path: 'api-explorer-error.png' });
      console.log('Error screenshot saved as: api-explorer-error.png');
    } catch (e) {
      console.log('Could not take error screenshot');
    }
  } finally {
    await browser.close();
  }
}

testApiExplorerVisibility();