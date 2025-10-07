const puppeteer = require('puppeteer');

async function testGraphQLButton() {
  console.log('🔍 Testing GraphQL button visibility...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    // Test a repository that HAS GraphQL files
    console.log('📸 Testing repository WITH GraphQL (demo-labsdashboards)...');
    await page.goto('http://10.0.0.109:3000/repository/demo-labsdashboards', { 
      waitUntil: 'networkidle0', 
      timeout: 30000 
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check for GraphQL button
    const hasGraphQLButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(btn => btn.textContent?.toLowerCase().includes('graphql'));
    });
    
    console.log(`  GraphQL button present: ${hasGraphQLButton ? '✅ YES' : '❌ NO'}`);
    
    await page.screenshot({ 
      path: 'test-graphql-with.png',
      fullPage: false
    });
    
    // Test a repository that likely has NO GraphQL files
    console.log('\n📸 Testing repository WITHOUT GraphQL (rentalFleets)...');
    await page.goto('http://10.0.0.109:3000/repository/rentalFleets', { 
      waitUntil: 'networkidle0', 
      timeout: 30000 
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const hasGraphQLButton2 = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(btn => btn.textContent?.toLowerCase().includes('graphql'));
    });
    
    console.log(`  GraphQL button present: ${hasGraphQLButton2 ? '✅ YES' : '❌ NO'}`);
    
    await page.screenshot({ 
      path: 'test-graphql-without.png',
      fullPage: false
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await browser.close();
  console.log('\n✅ Test complete!');
}

testGraphQLButton();