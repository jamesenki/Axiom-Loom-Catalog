const puppeteer = require('puppeteer');

const tests = [
  {
    name: "Home page loads",
    url: "http://localhost:3002",
    check: async (page) => {
      try {
        await page.waitForSelector('body', { timeout: 5000 });
        const title = await page.title();
        return title.includes('EYNS');
      } catch {
        return false;
      }
    }
  },
  {
    name: "No console errors",
    url: "http://localhost:3002",
    check: async (page) => {
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      await page.goto('http://localhost:3002', { waitUntil: 'networkidle0' });
      return errors.length === 0;
    }
  },
  {
    name: "Repository cards display",
    url: "http://localhost:3002",
    check: async (page) => {
      try {
        await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
        const cards = await page.$$('[data-testid="repository-card"]');
        return cards.length > 0;
      } catch {
        return false;
      }
    }
  },
  {
    name: "Navigation works",
    url: "http://localhost:3002",
    check: async (page) => {
      try {
        await page.waitForSelector('nav a[href="/apis"]', { timeout: 5000 });
        await page.click('nav a[href="/apis"]');
        await page.waitForTimeout(2000);
        const url = page.url();
        return url.includes('/apis');
      } catch {
        return false;
      }
    }
  },
  {
    name: "API Explorer loads",
    url: "http://localhost:3002/apis",
    check: async (page) => {
      try {
        await page.waitForSelector('h1', { timeout: 5000 });
        const text = await page.$eval('h1', el => el.textContent);
        return text.includes('API');
      } catch {
        return false;
      }
    }
  },
  {
    name: "Search functionality",
    url: "http://localhost:3002",
    check: async (page) => {
      try {
        await page.waitForSelector('input[type="search"]', { timeout: 5000 });
        return true;
      } catch {
        return false;
      }
    }
  }
];

async function runTests() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  console.log('🧪 Testing Dev Server at http://localhost:3002\n');
  console.log('=' .repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const page = await browser.newPage();
    
    try {
      await page.goto(test.url, { waitUntil: 'networkidle0', timeout: 30000 });
      const result = await test.check(page);
      
      if (result) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
      failed++;
    }
    
    await page.close();
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log(`\n📊 Results: ${passed}/${tests.length} tests passed (${Math.round(passed/tests.length * 100)}%)`);
  
  if (failed > 0) {
    console.log(`\n❌ ${failed} tests failed`);
  }
  
  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);