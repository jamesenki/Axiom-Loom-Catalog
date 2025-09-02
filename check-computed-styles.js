const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://10.0.0.109:3000/api-explorer/ai-predictive-maintenance-engine-architecture');
  await page.waitForTimeout(3000);
  
  // Get the computed styles of the actual title
  const titleInfo = await page.evaluate(() => {
    // Find the first API card title
    const title = Array.from(document.querySelectorAll('h3')).find(h3 => 
      h3.textContent.includes('AI Predictive Maintenance')
    );
    
    if (title) {
      const styles = window.getComputedStyle(title);
      const parent = title.parentElement;
      const parentStyles = parent ? window.getComputedStyle(parent) : null;
      
      return {
        found: true,
        text: title.textContent,
        color: styles.color,
        className: title.className,
        parentClassName: parent?.className,
        parentColor: parentStyles?.color,
        allClasses: title.classList.toString(),
        computedStyles: {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          opacity: styles.opacity,
          filter: styles.filter
        }
      };
    }
    return { found: false };
  });
  
  console.log('TITLE INFO:', JSON.stringify(titleInfo, null, 2));
  
  await browser.close();
})();
