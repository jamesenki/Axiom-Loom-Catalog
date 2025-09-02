const puppeteer = require('puppeteer');

async function testGraphQLSchemaLoading() {
  console.log('🔍 Testing GraphQL Schema Loading...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('🔴 Console Error:', msg.text());
    }
  });
  
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/')) {
      console.log(`📡 API Call: ${url.substring(url.indexOf('/api/'))} - Status: ${response.status()}`);
    }
  });
  
  try {
    // Navigate directly to GraphQL schema viewer for a repo with GraphQL files
    console.log('📍 Navigating to GraphQL schema viewer for nslabsdashboards...');
    await page.goto('http://10.0.0.109:3000/graphql/nslabsdashboards', { 
      waitUntil: 'networkidle0', 
      timeout: 30000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check what's displayed
    const pageContent = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const h3Elements = Array.from(document.querySelectorAll('h3'));
      const errorElements = Array.from(document.querySelectorAll('[class*="Error"], [class*="error"]'));
      const preElements = Array.from(document.querySelectorAll('pre'));
      
      return {
        title: h1?.textContent,
        schemaHeaders: h3Elements.map(el => el.textContent),
        hasErrors: errorElements.length > 0,
        errorMessages: errorElements.map(el => el.textContent),
        schemaCount: preElements.length,
        hasContent: preElements.some(pre => pre.textContent && pre.textContent.length > 50)
      };
    });
    
    console.log('\n📊 Page Analysis:');
    console.log('Title:', pageContent.title);
    console.log('Schema Headers:', pageContent.schemaHeaders);
    console.log('Has Errors:', pageContent.hasErrors);
    if (pageContent.hasErrors) {
      console.log('Error Messages:', pageContent.errorMessages);
    }
    console.log('Schema Count:', pageContent.schemaCount);
    console.log('Has Content:', pageContent.hasContent);
    
    await page.screenshot({ 
      path: 'test-graphql-schema-viewer.png',
      fullPage: true
    });
    console.log('\n📸 Screenshot saved: test-graphql-schema-viewer.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await browser.close();
  console.log('\n✅ Test complete!');
}

testGraphQLSchemaLoading();