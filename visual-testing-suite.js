const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const BASE_URL = 'http://10.0.0.109:3000';
const SCREENSHOT_DIR = './visual-test-screenshots';

// Test areas to capture
const TEST_AREAS = [
  { name: 'homepage', path: '/', description: 'Main homepage' },
  { name: 'repositories', path: '/repositories', description: 'Repositories list' },
  { name: 'apis', path: '/apis', description: 'APIs overview' },
  { name: 'docs', path: '/docs', description: 'Documentation hub' },
  { name: 'ai-predictive-repo', path: '/repository/ai-predictive-maintenance-engine', description: 'AI Predictive Maintenance repo' },
  { name: 'ai-predictive-docs', path: '/repository/ai-predictive-maintenance-engine/docs', description: 'AI Predictive docs' },
  { name: 'ai-predictive-api', path: '/repository/ai-predictive-maintenance-engine/api-explorer', description: 'AI Predictive API Explorer' },
  { name: 'ai-predictive-postman', path: '/repository/ai-predictive-maintenance-engine/postman', description: 'AI Predictive Postman' },
  { name: 'future-mobility-repo', path: '/repository/future-mobility-fleet-platform', description: 'Future Mobility repo' },
  { name: 'future-mobility-docs', path: '/repository/future-mobility-fleet-platform/docs', description: 'Future Mobility docs' },
  { name: 'future-mobility-graphql', path: '/repository/future-mobility-fleet-platform/graphql', description: 'Future Mobility GraphQL' },
  { name: 'rental-fleets-repo', path: '/repository/rentalFleets', description: 'Rental Fleets repo' },
  { name: 'rental-fleets-docs', path: '/repository/rentalFleets/docs', description: 'Rental Fleets docs' },
  { name: 'rental-fleets-api', path: '/repository/rentalFleets/api-explorer', description: 'Rental Fleets API Explorer' },
  { name: 'sdv-platform-repo', path: '/repository/velocityforge-sdv-platform-architecture', description: 'SDV Platform repo' },
  { name: 'sdv-platform-docs', path: '/repository/velocityforge-sdv-platform-architecture/docs', description: 'SDV Platform docs' },
  { name: 'ecosystem-repo', path: '/repository/ecosystem-platform-architecture', description: 'Ecosystem Platform repo' },
  { name: 'ecosystem-docs', path: '/repository/ecosystem-platform-architecture/docs', description: 'Ecosystem Platform docs' }
];

// Color contrast calculation
function getContrastRatio(rgb1, rgb2) {
  const luminance = (rgb) => {
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

async function analyzeReadability(page, screenshotPath) {
  const issues = [];
  
  try {
    // Analyze text elements for contrast
    const textElements = await page.evaluate(() => {
      const elements = [];
      const allText = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, div, button, li, td, th');
      
      for (let elem of allText) {
        const text = elem.textContent?.trim();
        if (!text || text.length === 0) continue;
        
        const styles = window.getComputedStyle(elem);
        const bgColor = styles.backgroundColor;
        const color = styles.color;
        const fontSize = styles.fontSize;
        const opacity = styles.opacity;
        
        // Get bounding box
        const rect = elem.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        
        elements.push({
          tag: elem.tagName.toLowerCase(),
          text: text.substring(0, 50),
          color,
          bgColor,
          fontSize,
          opacity,
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
        });
      }
      
      return elements;
    });
    
    // Check for contrast issues
    for (let elem of textElements) {
      // Parse colors
      const parseRgb = (str) => {
        const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
      };
      
      const textRgb = parseRgb(elem.color);
      const bgRgb = parseRgb(elem.bgColor);
      
      if (textRgb && bgRgb) {
        const contrast = getContrastRatio(textRgb, bgRgb);
        
        // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
        const minContrast = parseInt(elem.fontSize) >= 18 ? 3 : 4.5;
        
        if (contrast < minContrast) {
          issues.push({
            type: 'LOW_CONTRAST',
            element: elem.tag,
            text: elem.text,
            contrast: contrast.toFixed(2),
            required: minContrast,
            color: elem.color,
            bgColor: elem.bgColor
          });
        }
      }
      
      // Check for opacity issues
      if (parseFloat(elem.opacity) < 0.8) {
        issues.push({
          type: 'LOW_OPACITY',
          element: elem.tag,
          text: elem.text,
          opacity: elem.opacity
        });
      }
    }
    
    // Check for blur effects
    const blurredElements = await page.evaluate(() => {
      const elements = [];
      const all = document.querySelectorAll('*');
      
      for (let elem of all) {
        const styles = window.getComputedStyle(elem);
        const filter = styles.filter;
        const textShadow = styles.textShadow;
        
        if (filter && filter !== 'none' && filter.includes('blur')) {
          elements.push({
            tag: elem.tagName.toLowerCase(),
            filter,
            text: elem.textContent?.substring(0, 50)
          });
        }
        
        if (textShadow && textShadow !== 'none' && textShadow.includes('blur')) {
          elements.push({
            tag: elem.tagName.toLowerCase(),
            textShadow,
            text: elem.textContent?.substring(0, 50)
          });
        }
      }
      
      return elements;
    });
    
    for (let elem of blurredElements) {
      issues.push({
        type: 'BLUR_EFFECT',
        element: elem.tag,
        text: elem.text,
        filter: elem.filter,
        textShadow: elem.textShadow
      });
    }
    
  } catch (error) {
    console.error('Error analyzing readability:', error);
  }
  
  return issues;
}

async function runVisualTests() {
  console.log('🎯 Starting Comprehensive Visual Testing Suite');
  console.log('='.repeat(60));
  
  // Create screenshot directory
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalTests: TEST_AREAS.length,
    passed: 0,
    failed: 0,
    issues: [],
    results: []
  };
  
  for (let area of TEST_AREAS) {
    console.log(`\\n📸 Testing: ${area.description} (${area.path})`);
    console.log('-'.repeat(50));
    
    try {
      // Navigate to page
      const url = `${BASE_URL}${area.path}`;
      console.log(`   Navigating to: ${url}`);
      
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot
      const screenshotPath = path.join(SCREENSHOT_DIR, `${area.name}.png`);
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      console.log(`   ✅ Screenshot saved: ${screenshotPath}`);
      
      // Analyze readability
      console.log('   🔍 Analyzing readability...');
      const issues = await analyzeReadability(page, screenshotPath);
      
      // Check console errors
      const consoleErrors = await page.evaluate(() => {
        return window.__consoleErrors || [];
      });
      
      // Inject console error tracking
      await page.evaluateOnNewDocument(() => {
        window.__consoleErrors = [];
        const originalError = console.error;
        console.error = (...args) => {
          window.__consoleErrors.push(args.join(' '));
          originalError.apply(console, args);
        };
      });
      
      // Create result
      const result = {
        area: area.name,
        description: area.description,
        path: area.path,
        screenshot: screenshotPath,
        issues: issues,
        consoleErrors: consoleErrors,
        status: issues.length === 0 ? 'PASS' : 'FAIL'
      };
      
      // Print issues
      if (issues.length > 0) {
        console.log(`   ⚠️  Found ${issues.length} readability issues:`);
        for (let issue of issues.slice(0, 5)) {
          if (issue.type === 'LOW_CONTRAST') {
            console.log(`      - Low contrast (${issue.contrast}:1, need ${issue.required}:1): "${issue.text}"`);
          } else if (issue.type === 'LOW_OPACITY') {
            console.log(`      - Low opacity (${issue.opacity}): "${issue.text}"`);
          } else if (issue.type === 'BLUR_EFFECT') {
            console.log(`      - Blur effect detected: "${issue.text}"`);
          }
        }
        if (issues.length > 5) {
          console.log(`      ... and ${issues.length - 5} more issues`);
        }
        report.failed++;
      } else {
        console.log('   ✅ No readability issues found');
        report.passed++;
      }
      
      report.results.push(result);
      report.issues = report.issues.concat(issues.map(i => ({ ...i, area: area.name })));
      
    } catch (error) {
      console.error(`   ❌ Error testing ${area.name}:`, error.message);
      report.results.push({
        area: area.name,
        description: area.description,
        path: area.path,
        error: error.message,
        status: 'ERROR'
      });
      report.failed++;
    }
  }
  
  await browser.close();
  
  // Generate report
  console.log('\\n' + '='.repeat(60));
  console.log('📊 VISUAL TESTING REPORT');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${report.totalTests}`);
  console.log(`Passed: ${report.passed} ✅`);
  console.log(`Failed: ${report.failed} ❌`);
  console.log(`Total Issues: ${report.issues.length}`);
  
  // Save detailed report
  const reportPath = path.join(SCREENSHOT_DIR, 'visual-test-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`\\n📄 Detailed report saved to: ${reportPath}`);
  
  // Print summary of main issues
  if (report.issues.length > 0) {
    console.log('\\n🔴 CRITICAL ISSUES TO FIX:');
    console.log('-'.repeat(60));
    
    // Group issues by type
    const issuesByType = {};
    for (let issue of report.issues) {
      if (!issuesByType[issue.type]) {
        issuesByType[issue.type] = [];
      }
      issuesByType[issue.type].push(issue);
    }
    
    for (let [type, issues] of Object.entries(issuesByType)) {
      console.log(`\\n${type}: ${issues.length} occurrences`);
      for (let issue of issues.slice(0, 3)) {
        console.log(`  - [${issue.area}] ${issue.text || 'N/A'}`);
        if (issue.type === 'LOW_CONTRAST') {
          console.log(`    Current: ${issue.contrast}:1, Required: ${issue.required}:1`);
        }
      }
    }
  } else {
    console.log('\\n✅ ALL VISUAL TESTS PASSED - No readability issues detected!');
  }
  
  console.log('\\n🎉 Visual testing complete!');
  console.log(`View screenshots in: ${SCREENSHOT_DIR}/`);
}

// Run the tests
runVisualTests().catch(console.error);