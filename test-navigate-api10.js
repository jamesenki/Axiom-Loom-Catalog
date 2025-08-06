const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (!msg.text().includes('styled-components') && !msg.text().includes('React Router')) {
      console.log('Browser:', msg.text());
    }
  });
  
  console.log('1. Going to main docs page...');
  await page.goto('http://localhost:3000/docs/future-mobility-consumer-platform');
  await page.waitForTimeout(3000);
  
  // First click on Architecture Diagrams to get to api-specs index
  console.log('2. Clicking Architecture Diagrams link...');
  const archLink = await page.$('a:has-text("Architecture Diagrams")');
  if (archLink) {
    await archLink.click();
    await page.waitForTimeout(2000);
  }
  
  // Check if we're on an error page - if so, the link structure is broken
  const bodyText = await page.textContent('body');
  if (bodyText.includes('404') || bodyText.includes('Error Loading')) {
    console.log('3. Got error trying to navigate to api-specs. Let me try direct navigation...');
    
    // Since the navigation is broken, let's simulate the correct navigation
    console.log('4. Triggering navigation to architecture/api-10-diagrams.md directly...');
    await page.evaluate(() => {
      // Find the EnhancedMarkdownViewer's onNavigate function and call it
      const links = document.querySelectorAll('a');
      for (const link of links) {
        if (link.textContent && link.textContent.includes('Architecture Diagrams')) {
          // Create a click event that will trigger the navigation
          const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          
          // Change the href temporarily to what it should navigate to
          link.setAttribute('href', 'docs/architecture/api-10-diagrams.md');
          link.dispatchEvent(event);
          break;
        }
      }
    });
    
    // Or try direct navigation via the component
    await page.evaluate(() => {
      // Trigger navigation directly if the above doesn't work
      window.dispatchEvent(new CustomEvent('navigate-to-file', { 
        detail: 'docs/architecture/api-10-diagrams.md' 
      }));
    });
  } else {
    console.log('3. Successfully loaded a page, looking for API #10 link...');
    
    // Look for API #10 Architecture link
    const api10Link = await page.$('a[href*="api-10-diagrams"]');
    if (api10Link) {
      console.log('4. Found API #10 architecture link, clicking...');
      await api10Link.click();
    }
  }
  
  // Wait for content to load
  await page.waitForTimeout(5000);
  
  // Take final screenshot
  await page.screenshot({ path: 'test-results/api10-final.png', fullPage: true });
  
  // Check final state
  const finalUrl = page.url();
  const finalContent = await page.content();
  
  console.log('5. Final URL:', finalUrl);
  console.log('6. Page has SVG elements:', (await page.$$('svg')).length);
  console.log('7. Page has Mermaid containers:', (await page.$$('.mermaid-container')).length);
  
  // Check if Mermaid content is visible
  if (finalContent.includes('[MERMAID:')) {
    console.log('8. ERROR: Still see MERMAID markers!');
  } else if ((await page.$$('svg')).length > 0) {
    console.log('8. SUCCESS: Mermaid diagrams appear to be rendered!');
  }
  
  // Check for specific diagram content
  const hasExpectedContent = await page.evaluate(() => {
    const text = document.body.textContent || '';
    return {
      hasSystemArch: text.includes('System Architecture'),
      hasDataFlow: text.includes('Data Flow Architecture'),
      hasClientApps: text.includes('Client Applications'),
      hasAPIGateway: text.includes('API Gateway')
    };
  });
  
  console.log('9. Content checks:', hasExpectedContent);
  
  await browser.close();
})();