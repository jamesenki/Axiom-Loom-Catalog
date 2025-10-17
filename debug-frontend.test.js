const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Opening page and capturing network traffic...');

  const requests = [];
  const responses = [];

  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType()
    });
  });

  page.on('response', response => {
    responses.push({
      url: response.url(),
      status: response.status()
    });
  });

  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  await page.goto('https://technical.axiomloom-loom.net', { waitUntil: 'networkidle' });

  console.log('\n=== PAGE URL ===');
  console.log(page.url());

  console.log('\n=== PAGE TITLE ===');
  console.log(await page.title());

  console.log('\n=== ALL NETWORK REQUESTS (first 20) ===');
  requests.slice(0, 20).forEach(req => {
    console.log(`${req.method} ${req.url} [${req.resourceType}]`);
  });

  console.log('\n=== API RESPONSES ===');
  const apiResponses = responses.filter(r => r.url.includes('/api/'));
  if (apiResponses.length === 0) {
    console.log('NO API CALLS DETECTED!');
  } else {
    apiResponses.forEach(res => {
      console.log(`${res.status} ${res.url}`);
    });
  }

  console.log('\n=== CONSOLE MESSAGES ===');
  consoleMessages.forEach(msg => {
    console.log(`[${msg.type}] ${msg.text}`);
  });

  console.log('\n=== PAGE CONTENT CHECK ===');
  const bodyText = await page.locator('body').textContent();
  console.log('Contains "Axiom Loom":', bodyText.includes('Axiom Loom'));
  console.log('Contains "James Simon":', bodyText.includes('James Simon'));
  console.log('Contains "Repository" or "Repositories":', /repositor(y|ies)/i.test(bodyText));

  console.log('\n=== CHECKING REACT ROOT ===');
  const rootContent = await page.locator('#root').innerHTML();
  console.log('Root element length:', rootContent.length);
  console.log('First 500 chars:', rootContent.substring(0, 500));

  console.log('\n=== CHECKING NAVIGATION ===');
  const navLinks = await page.locator('nav a, header a').all();
  console.log('Navigation links found:', navLinks.length);
  for (const link of navLinks.slice(0, 10)) {
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    console.log(`  "${text}" -> ${href}`);
  }

  await page.screenshot({ path: '/tmp/debug-screenshot.png', fullPage: true });
  console.log('\n Screenshot saved to /tmp/debug-screenshot.png');

  await browser.close();
})();
