const { chromium } = require('playwright');

async function analyzeContent() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // First, get the API data
    const apiResponse = await fetch('http://10.0.0.109:3000/api/repository/ai-predictive-maintenance-engine-architecture/details');
    const apiData = await apiResponse.json();
    
    console.log('=== CONTENT ANALYSIS REPORT ===\n');
    
    // Navigate to the page
    await page.goto('http://10.0.0.109:3000/repository/ai-predictive-maintenance-engine-architecture', {
      waitUntil: 'networkidle'
    });

    // Extract all text content from the page
    const pageContent = await page.evaluate(() => {
      const extractText = (element) => {
        if (element.nodeType === Node.TEXT_NODE) {
          return element.textContent.trim();
        }
        
        let text = '';
        for (const child of element.childNodes) {
          text += extractText(child) + ' ';
        }
        return text.trim();
      };
      
      return {
        title: document.querySelector('h1')?.textContent?.trim() || '',
        description: document.querySelector('p')?.textContent?.trim() || '',
        allText: extractText(document.body),
        sections: Array.from(document.querySelectorAll('h2, h3')).map(h => h.textContent?.trim()),
        buttons: Array.from(document.querySelectorAll('button, a[role="button"]')).map(b => b.textContent?.trim()),
        badges: Array.from(document.querySelectorAll('[class*="badge"]')).map(b => b.textContent?.trim()),
        metrics: Array.from(document.querySelectorAll('[class*="metric"]')).map(m => m.textContent?.trim())
      };
    });

    console.log('PAGE CONTENT vs API DATA COMPARISON:\n');
    
    console.log('1. TITLE/HEADING:');
    console.log(`   Page: "${pageContent.title}"`);
    console.log(`   API:  "${apiData.displayName}"`);
    console.log(`   Match: ${pageContent.title === apiData.displayName ? '✓' : '✗'}\n`);
    
    console.log('2. DESCRIPTION:');
    console.log(`   Page: "${pageContent.description}"`);
    console.log(`   API:  "${apiData.description}"`);
    console.log(`   Match: ${pageContent.description === apiData.description ? '✓' : '✗'}\n`);
    
    console.log('3. SECTIONS DISPLAYED:');
    pageContent.sections.forEach(section => {
      console.log(`   • ${section}`);
    });
    
    console.log('\n4. BUSINESS VALUE COMMUNICATION:');
    
    // Check if key business information is displayed
    const hasBusinessValue = pageContent.allText.toLowerCase().includes('business value');
    const hasPricing = pageContent.allText.includes('$400,000');
    const hasROI = pageContent.allText.toLowerCase().includes('roi') || pageContent.allText.toLowerCase().includes('return');
    const hasTargetMarket = pageContent.allText.toLowerCase().includes('market') || pageContent.allText.toLowerCase().includes('enterprise');
    
    console.log(`   Business Value Section: ${hasBusinessValue ? '✓' : '✗'}`);
    console.log(`   Pricing Display: ${hasPricing ? '✓' : '✗'} (${hasPricing ? '$400,000 shown' : 'pricing not visible'})`);
    console.log(`   ROI Information: ${hasROI ? '✓' : '✗'}`);
    console.log(`   Target Market: ${hasTargetMarket ? '✓' : '✗'}`);
    
    console.log('\n5. TECHNICAL INFORMATION:');
    
    // Check technical details
    const hasAPICount = pageContent.allText.includes('API') || pageContent.allText.includes('api');
    const hasPostmanInfo = pageContent.allText.toLowerCase().includes('postman');
    const hasArchitecture = pageContent.allText.toLowerCase().includes('architecture');
    
    console.log(`   API Information: ${hasAPICount ? '✓' : '✗'}`);
    console.log(`   Postman Collections: ${hasPostmanInfo ? '✓' : '✗'}`);
    console.log(`   Architecture Details: ${hasArchitecture ? '✓' : '✗'}`);
    
    console.log('\n6. AVAILABLE vs DISPLAYED API DATA:');
    console.log('   API Response includes:');
    console.log(`   • ${apiData.metrics.apiCount} APIs (displayed: ${pageContent.allText.includes(apiData.metrics.apiCount.toString()) ? '✓' : '✗'})`);
    console.log(`   • ${apiData.metrics.postmanCollections} Postman Collections (displayed: ${pageContent.allText.includes(apiData.metrics.postmanCollections.toString()) ? '✓' : '✗'})`);
    console.log(`   • Demo URL: ${apiData.demoUrl ? '✓' : '✗'} (displayed: ${pageContent.allText.includes('demo') ? '✓' : '✗'})`);
    console.log(`   • GitHub URL: ${apiData.url ? '✓' : '✗'} (displayed: ${pageContent.allText.toLowerCase().includes('github') ? '✓' : '✗'})`);
    
    console.log('\n7. README CONTENT UTILIZATION:');
    const readmeLength = apiData.readme?.length || 0;
    console.log(`   README available: ${readmeLength > 0 ? '✓' : '✗'} (${readmeLength} characters)`);
    
    if (apiData.readme) {
      const readmeWords = apiData.readme.split(/\s+/).length;
      const pageWords = pageContent.allText.split(/\s+/).length;
      console.log(`   README content: ${readmeWords} words`);
      console.log(`   Page content: ${pageWords} words`);
      console.log(`   Content utilization: ${((pageWords / readmeWords) * 100).toFixed(1)}%`);
      
      // Check if README sections are utilized
      const readmeHasBusinessBenefits = apiData.readme.includes('Business Benefits');
      const readmeHasSpecs = apiData.readme.includes('Technical Specifications');
      const readmeHasPricing = apiData.readme.includes('Pricing');
      
      console.log(`   README has business benefits: ${readmeHasBusinessBenefits ? '✓' : '✗'}`);
      console.log(`   README has tech specs: ${readmeHasSpecs ? '✓' : '✗'}`);
      console.log(`   README has pricing: ${readmeHasPricing ? '✓' : '✗'}`);
    }
    
    console.log('\n8. CALL-TO-ACTION ANALYSIS:');
    console.log('   Available Actions:');
    pageContent.buttons.forEach(button => {
      if (button && button.trim()) {
        console.log(`   • "${button}"`);
      }
    });
    
    console.log('\n9. CONTENT GAP ANALYSIS:');
    const gaps = [];
    
    if (!pageContent.allText.includes('reduce') && !pageContent.allText.includes('cost')) {
      gaps.push('Missing cost reduction/business benefits messaging');
    }
    
    if (!pageContent.allText.includes('70%') && apiData.readme?.includes('70%')) {
      gaps.push('Missing key statistics (70% downtime reduction)');
    }
    
    if (!pageContent.allText.includes('demo') && apiData.demoUrl) {
      gaps.push('Demo link not prominently displayed');
    }
    
    if (pageContent.metrics.length === 0 && apiData.metrics.apiCount > 0) {
      gaps.push('API/technical metrics not displayed');
    }
    
    if (gaps.length === 0) {
      console.log('   No major content gaps identified ✓');
    } else {
      gaps.forEach(gap => console.log(`   ⚠️  ${gap}`));
    }
    
    console.log('\n10. VALUE PROPOSITION CLARITY:');
    const valueWords = ['reduce', 'increase', 'improve', 'save', 'optimize', 'prevent', 'boost', 'enhance'];
    const foundValueWords = valueWords.filter(word => pageContent.allText.toLowerCase().includes(word));
    console.log(`   Value-oriented language: ${foundValueWords.length}/${valueWords.length} key words found`);
    console.log(`   Found: ${foundValueWords.join(', ') || 'none'}`);

  } catch (error) {
    console.error('Content analysis failed:', error.message);
  } finally {
    await browser.close();
  }
}

analyzeContent();