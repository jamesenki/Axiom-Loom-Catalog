const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://10.0.0.109:3000/api-explorer/ai-predictive-maintenance-engine-architecture');
  await page.waitForTimeout(3000);
  
  // Inject a test to see what's actually being applied
  const analysis = await page.evaluate(() => {
    const title = Array.from(document.querySelectorAll('h3')).find(h3 => 
      h3.textContent.includes('AI Predictive Maintenance')
    );
    
    if (title) {
      // Get all computed styles
      const styles = window.getComputedStyle(title);
      
      // Check parent styles too
      let parent = title.parentElement;
      const parentStyles = [];
      while (parent && parent !== document.body) {
        const pStyles = window.getComputedStyle(parent);
        parentStyles.push({
          tag: parent.tagName,
          className: parent.className,
          color: pStyles.color,
          opacity: pStyles.opacity,
          filter: pStyles.filter
        });
        parent = parent.parentElement;
      }
      
      return {
        directStyles: {
          color: styles.color,
          opacity: styles.opacity,
          filter: styles.filter,
          WebkitTextFillColor: styles.WebkitTextFillColor,
          textShadow: styles.textShadow
        },
        parentStyles
      };
    }
    return null;
  });
  
  console.log('TITLE ANALYSIS:', JSON.stringify(analysis, null, 2));
  
  await browser.close();
})();
