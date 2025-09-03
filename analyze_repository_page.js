const { chromium } = require('playwright');

async function analyzeRepositoryPage() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('Navigating to repository page...');
    await page.goto('http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine-architecture', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for the page to load completely
    await page.waitForTimeout(3000);

    // Take a screenshot first
    await page.screenshot({ path: 'repository-page-analysis.png', fullPage: true });

    // Get the page title and main content
    const title = await page.title();
    console.log('Page Title:', title);

    // Check if there's an error or loading state
    const errorMessage = await page.textContent('h1:has-text("Error Loading Repository")').catch(() => null);
    if (errorMessage) {
      console.log('ERROR: Page shows error message:', errorMessage);
      return;
    }

    // Extract the main heading
    const mainHeading = await page.textContent('h1').catch(() => 'No main heading found');
    console.log('Main Heading:', mainHeading);

    // Extract the description/marketing description
    const description = await page.textContent('p').catch(() => 'No description found');
    console.log('Description:', description);

    // Check for business value section
    const businessValueSection = await page.locator('text=Business Value').isVisible().catch(() => false);
    console.log('Business Value Section Present:', businessValueSection);

    // Check for pricing section  
    const pricingSection = await page.locator('text=Architecture Package Pricing').isVisible().catch(() => false);
    console.log('Pricing Section Present:', pricingSection);

    // Check for technical overview
    const techOverview = await page.locator('text=Technical Overview').isVisible().catch(() => false);
    console.log('Technical Overview Section Present:', techOverview);

    // Check for key benefits
    const keyBenefits = await page.locator('text=Key Benefits').isVisible().catch(() => false);
    console.log('Key Benefits Section Present:', keyBenefits);

    // Check for use cases
    const useCases = await page.locator('text=Use Cases').isVisible().catch(() => false);
    console.log('Use Cases Section Present:', useCases);

    // Check for action buttons
    const actionButtons = await page.locator('button, a[role="button"]').count();
    console.log('Number of Action Buttons:', actionButtons);

    // Get all button text
    const buttonTexts = await page.locator('button, a[role="button"]').allTextContents();
    console.log('Button Labels:', buttonTexts);

    // Check for API-related information
    const apiCount = await page.textContent('text=Total APIs').catch(() => null);
    console.log('API Count Display:', apiCount);

    // Performance metrics
    const performanceMetrics = await page.evaluate(() => {
      return {
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
      };
    });
    console.log('Performance Metrics:', performanceMetrics);

    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait a bit to catch any async errors
    await page.waitForTimeout(2000);

    console.log('Console Errors:', consoleErrors);

    // Check accessibility - basic checks
    const hasMainLandmark = await page.locator('main').isVisible().catch(() => false);
    const hasHeadings = await page.locator('h1, h2, h3').count();
    const hasImages = await page.locator('img').count();
    const imagesWithAlt = await page.locator('img[alt]').count();

    console.log('Accessibility Analysis:');
    console.log('- Has main landmark:', hasMainLandmark);
    console.log('- Number of headings:', hasHeadings);
    console.log('- Images total:', hasImages);
    console.log('- Images with alt text:', imagesWithAlt);

    // Extract all text content for content analysis
    const allText = await page.textContent('body');
    const wordCount = allText.split(/\s+/).length;
    console.log('Total Word Count:', wordCount);

    // Check for specific content quality indicators
    const hasBusinessLanguage = /business|value|ROI|market|customer|revenue|cost|benefit/i.test(allText);
    const hasTechnicalLanguage = /API|database|cloud|architecture|integration|service/i.test(allText);
    const hasCallToAction = /get started|try now|download|contact|explore|view/i.test(allText);

    console.log('Content Quality Indicators:');
    console.log('- Contains business language:', hasBusinessLanguage);
    console.log('- Contains technical language:', hasTechnicalLanguage);
    console.log('- Contains call-to-action language:', hasCallToAction);

  } catch (error) {
    console.error('Error analyzing page:', error.message);
  } finally {
    await browser.close();
  }
}

analyzeRepositoryPage();