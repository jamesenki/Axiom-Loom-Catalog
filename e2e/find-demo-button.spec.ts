import { test, expect } from '@playwright/test';

test('Find Demo button location', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Find all elements with Demo text
  const demoElements = await page.locator('*:has-text("Demo")').all();
  
  console.log(`\nFound ${demoElements.length} elements with "Demo" text:\n`);
  
  for (let i = 0; i < demoElements.length; i++) {
    const elem = demoElements[i];
    const tagName = await elem.evaluate(el => el.tagName);
    const className = await elem.getAttribute('class') || 'no-class';
    const text = await elem.textContent();
    const parent = await elem.evaluate(el => el.parentElement?.tagName);
    const grandparent = await elem.evaluate(el => el.parentElement?.parentElement?.tagName);
    
    console.log(`${i + 1}. <${tagName}> class="${className.substring(0, 50)}..." parent:<${parent}> grandparent:<${grandparent}>`);
    console.log(`   Text: "${text?.substring(0, 100)}"`);
    
    // Check if it's a navigation button
    if (tagName === 'A' || tagName === 'BUTTON') {
      const href = await elem.getAttribute('href');
      console.log(`   -> This is a ${tagName} element${href ? ` with href="${href}"` : ''}`);
      
      // Get its exact location in the DOM
      const selector = await elem.evaluate(el => {
        const path = [];
        let current = el;
        while (current && current !== document.body) {
          const tag = current.tagName.toLowerCase();
          const id = current.id ? `#${current.id}` : '';
          const classes = current.className ? `.${current.className.split(' ').filter(c => c).join('.')}` : '';
          path.unshift(`${tag}${id}${classes.substring(0, 30)}`);
          current = current.parentElement;
        }
        return path.join(' > ');
      });
      console.log(`   DOM Path: ${selector}`);
    }
  }
  
  // Also check specifically in the nav
  const navDemo = await page.locator('nav *:has-text("Demo")').first();
  if (await navDemo.count() > 0) {
    console.log('\n🔴 FOUND DEMO IN NAV!');
    const navHTML = await navDemo.evaluate(el => el.outerHTML);
    console.log('Nav Demo HTML:', navHTML);
  }
});