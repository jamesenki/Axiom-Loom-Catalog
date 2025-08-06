const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to the future-mobility-tech-platform
  await page.goto('http://localhost:3000/docs/future-mobility-tech-platform');
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'emoji-fixed.png', fullPage: true });
  
  // Check for broken emoji pattern
  const pageContent = await page.content();
  const hasBrokenEmoji = pageContent.includes('ðŸ');
  console.log('Has broken emoji pattern:', hasBrokenEmoji);
  
  // Look for actual emojis
  const hasTarget = pageContent.includes('🎯');
  const hasRocket = pageContent.includes('🚀');
  console.log('Has target emoji:', hasTarget);
  console.log('Has rocket emoji:', hasRocket);
  
  await browser.close();
})();