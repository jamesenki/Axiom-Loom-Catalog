const { chromium } = require('playwright');

async function performanceAnalysis() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable request/response tracking
  const requests = [];
  const responses = [];
  
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      size: request.postData()?.length || 0,
      timestamp: Date.now()
    });
  });

  page.on('response', response => {
    responses.push({
      url: response.url(),
      status: response.status(),
      size: response.headers()['content-length'] || 0,
      timestamp: Date.now()
    });
  });

  try {
    console.log('=== PERFORMANCE ANALYSIS ===\n');
    
    const startTime = Date.now();
    await page.goto('http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine-architecture', {
      waitUntil: 'networkidle'
    });
    const loadTime = Date.now() - startTime;

    // Core Web Vitals measurement
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            }
            if (entry.name === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
          });
          
          // Get CLS
          const cls = entries
            .filter(entry => entry.entryType === 'layout-shift' && !entry.hadRecentInput)
            .reduce((sum, entry) => sum + entry.value, 0);
          
          vitals.cls = cls;
          
          resolve(vitals);
        }).observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 3000);
      });
    });

    // Resource timing
    const resourceMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return {
        totalResources: resources.length,
        totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        slowestResource: resources.reduce((slowest, r) => 
          r.duration > (slowest?.duration || 0) ? r : slowest, null
        ),
        scripts: resources.filter(r => r.initiatorType === 'script').length,
        stylesheets: resources.filter(r => r.initiatorType === 'css').length,
        images: resources.filter(r => r.initiatorType === 'img').length,
        xhr: resources.filter(r => r.initiatorType === 'xmlhttprequest').length
      };
    });

    console.log('CORE WEB VITALS:');
    console.log(`- First Contentful Paint (FCP): ${webVitals.fcp?.toFixed(2) || 'N/A'}ms`);
    console.log(`- Largest Contentful Paint (LCP): ${webVitals.lcp?.toFixed(2) || 'N/A'}ms`);
    console.log(`- Cumulative Layout Shift (CLS): ${webVitals.cls?.toFixed(4) || 'N/A'}`);
    console.log(`- Total Load Time: ${loadTime}ms\n`);

    console.log('RESOURCE ANALYSIS:');
    console.log(`- Total Resources: ${resourceMetrics.totalResources}`);
    console.log(`- Total Transfer Size: ${(resourceMetrics.totalSize / 1024).toFixed(2)}KB`);
    console.log(`- Scripts: ${resourceMetrics.scripts}`);
    console.log(`- Stylesheets: ${resourceMetrics.stylesheets}`);
    console.log(`- Images: ${resourceMetrics.images}`);
    console.log(`- XHR Requests: ${resourceMetrics.xhr}`);
    if (resourceMetrics.slowestResource) {
      console.log(`- Slowest Resource: ${resourceMetrics.slowestResource.name.substring(0, 50)}... (${resourceMetrics.slowestResource.duration.toFixed(2)}ms)\n`);
    }

    console.log('NETWORK REQUESTS:');
    console.log(`- Total Requests: ${requests.length}`);
    
    // API requests
    const apiRequests = responses.filter(r => r.url.includes('/api/'));
    console.log(`- API Requests: ${apiRequests.length}`);
    apiRequests.forEach(req => {
      console.log(`  • ${req.url} - ${req.status} (${req.size || 'unknown'} bytes)`);
    });

    // Failed requests
    const failedRequests = responses.filter(r => r.status >= 400);
    if (failedRequests.length > 0) {
      console.log('\nFAILED REQUESTS:');
      failedRequests.forEach(req => {
        console.log(`  ❌ ${req.url} - ${req.status}`);
      });
    }

    // Content analysis
    const contentMetrics = await page.evaluate(() => {
      const body = document.body;
      const text = body.innerText;
      const links = document.querySelectorAll('a[href]');
      const buttons = document.querySelectorAll('button, [role="button"]');
      const images = document.querySelectorAll('img');
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      return {
        textLength: text.length,
        wordCount: text.split(/\s+/).length,
        linkCount: links.length,
        buttonCount: buttons.length,
        imageCount: images.length,
        headingCount: headings.length,
        hasMainContent: !!document.querySelector('main'),
        hasSkipLink: !!document.querySelector('[href="#main"], [href="#content"]')
      };
    });

    console.log('\nCONTENT ANALYSIS:');
    console.log(`- Text Length: ${contentMetrics.textLength} characters`);
    console.log(`- Word Count: ${contentMetrics.wordCount} words`);
    console.log(`- Links: ${contentMetrics.linkCount}`);
    console.log(`- Interactive Elements: ${contentMetrics.buttonCount}`);
    console.log(`- Images: ${contentMetrics.imageCount}`);
    console.log(`- Headings: ${contentMetrics.headingCount}`);
    console.log(`- Has Main Landmark: ${contentMetrics.hasMainContent}`);
    console.log(`- Has Skip Link: ${contentMetrics.hasSkipLink}\n`);

    // UX/UI Analysis
    const uiMetrics = await page.evaluate(() => {
      const sections = document.querySelectorAll('section, .section, [class*="section"], .card, [class*="card"]');
      const forms = document.querySelectorAll('form');
      const inputs = document.querySelectorAll('input, textarea, select');
      const videos = document.querySelectorAll('video');
      const iframes = document.querySelectorAll('iframe');
      
      // Check for loading states
      const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"], .skeleton');
      
      // Check for error states
      const errorElements = document.querySelectorAll('[class*="error"], .alert-error, [role="alert"]');
      
      return {
        sectionCount: sections.length,
        formCount: forms.length,
        inputCount: inputs.length,
        videoCount: videos.length,
        iframeCount: iframes.length,
        loadingStates: loadingElements.length,
        errorStates: errorElements.length
      };
    });

    console.log('UI/UX ELEMENTS:');
    console.log(`- Content Sections: ${uiMetrics.sectionCount}`);
    console.log(`- Forms: ${uiMetrics.formCount}`);
    console.log(`- Input Elements: ${uiMetrics.inputCount}`);
    console.log(`- Videos: ${uiMetrics.videoCount}`);
    console.log(`- Embedded Content (iframes): ${uiMetrics.iframeCount}`);
    console.log(`- Loading State Elements: ${uiMetrics.loadingStates}`);
    console.log(`- Error State Elements: ${uiMetrics.errorStates}\n`);

    // Performance scoring
    let performanceScore = 100;
    
    if (loadTime > 3000) performanceScore -= 30; // Slow load
    if (loadTime > 5000) performanceScore -= 30; // Very slow load
    if (webVitals.fcp > 2500) performanceScore -= 20; // Poor FCP
    if (webVitals.lcp > 2500) performanceScore -= 20; // Poor LCP
    if (webVitals.cls > 0.1) performanceScore -= 15; // Poor CLS
    if (resourceMetrics.totalSize > 1024 * 1024) performanceScore -= 10; // Large payload
    if (failedRequests.length > 0) performanceScore -= 25; // Failed requests

    console.log('PERFORMANCE SCORE:');
    console.log(`- Overall Score: ${Math.max(0, performanceScore)}/100`);
    
    if (performanceScore >= 90) console.log('- Rating: EXCELLENT 🟢');
    else if (performanceScore >= 70) console.log('- Rating: GOOD 🟡');
    else if (performanceScore >= 50) console.log('- Rating: NEEDS IMPROVEMENT 🟠');
    else console.log('- Rating: POOR 🔴');

  } catch (error) {
    console.error('Performance analysis failed:', error.message);
  } finally {
    await browser.close();
  }
}

performanceAnalysis();