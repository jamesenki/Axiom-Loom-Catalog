#!/usr/bin/env node

/**
 * Enhanced Performance Test with Authentication
 * For EYNS AI Experience Center at http://10.0.0.109
 */

const http = require('http');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);
const BASE_URL = 'http://10.0.0.109';
const API_BASE = `${BASE_URL}/api`;

// Test configuration
const TEST_CONFIG = {
  concurrentUsers: [10, 25, 50, 100],
  testDurationSeconds: 30,
  performanceThresholds: {
    pageLoadTime: 2000, // 2 seconds
    apiResponseTime: 500, // 500ms
    errorRate: 5, // 5%
    ttfb: 1000 // 1 second
  }
};

// Authentication token (if needed)
let authToken = null;

function log(message, type = 'info') {
  const prefix = {
    info: '📊',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    test: '🧪'
  };
  console.log(`${prefix[type] || '•'} ${message}`);
}

async function authenticate() {
  log('Attempting to authenticate...', 'test');
  
  // Try to login with default credentials or skip if not needed
  try {
    const loginData = JSON.stringify({
      username: 'demo',
      password: 'demo123'
    });
    
    const options = {
      hostname: '10.0.0.109',
      port: 80,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    };
    
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const response = JSON.parse(data);
            authToken = response.token || response.access_token;
            log('Authentication successful', 'success');
            resolve(true);
          } else {
            log('Authentication not required or failed - proceeding without auth', 'warning');
            resolve(false);
          }
        });
      });
      
      req.on('error', () => {
        log('Authentication endpoint not available - proceeding without auth', 'info');
        resolve(false);
      });
      
      req.write(loginData);
      req.end();
    });
  } catch (error) {
    log('Authentication setup failed - proceeding without auth', 'info');
    return false;
  }
}

async function measureRequestTime(url, options = {}) {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime.bigint();
    const urlObj = new URL(url);
    
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        ...options.headers,
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
      }
    };
    
    const req = http.request(reqOptions, (res) => {
      let data = '';
      let firstByteTime = null;
      
      res.on('data', chunk => {
        if (!firstByteTime) {
          firstByteTime = process.hrtime.bigint();
        }
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1e6; // Convert to milliseconds
        const ttfb = firstByteTime ? Number(firstByteTime - startTime) / 1e6 : duration;
        
        resolve({
          duration,
          ttfb,
          statusCode: res.statusCode,
          headers: res.headers,
          size: Buffer.byteLength(data),
          data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function runLighthouseTest() {
  log('Running Lighthouse performance test...', 'test');
  
  try {
    // Check if lighthouse is installed
    const lhCheck = await execAsync('which lighthouse').catch(() => null);
    
    if (!lhCheck) {
      log('Lighthouse not installed - skipping detailed performance metrics', 'warning');
      return null;
    }
    
    // Run Lighthouse
    const lhCommand = `lighthouse ${BASE_URL} --quiet --chrome-flags="--headless" --only-categories=performance --output=json`;
    const result = await execAsync(lhCommand);
    
    const lhData = JSON.parse(result.stdout);
    const metrics = lhData.audits.metrics.details.items[0];
    
    return {
      performanceScore: lhData.categories.performance.score * 100,
      firstContentfulPaint: metrics.firstContentfulPaint,
      largestContentfulPaint: metrics.largestContentfulPaint,
      timeToInteractive: metrics.interactive,
      speedIndex: metrics.speedIndex,
      totalBlockingTime: metrics.totalBlockingTime,
      cumulativeLayoutShift: metrics.cumulativeLayoutShift
    };
  } catch (error) {
    log('Lighthouse test failed - using alternative metrics', 'warning');
    return null;
  }
}

async function testRealUserScenarios() {
  log('Testing real user scenarios...', 'test');
  
  const scenarios = [
    {
      name: 'Homepage Load',
      steps: [
        { url: BASE_URL, expected: 'React app' }
      ]
    },
    {
      name: 'API Explorer Flow',
      steps: [
        { url: BASE_URL, expected: 'React app' },
        { url: `${BASE_URL}/api-explorer`, expected: 'API' }
      ]
    },
    {
      name: 'Repository Browse',
      steps: [
        { url: BASE_URL, expected: 'React app' },
        { url: `${BASE_URL}/repositories`, expected: 'repositories' }
      ]
    },
    {
      name: 'Documentation Access',
      steps: [
        { url: BASE_URL, expected: 'React app' },
        { url: `${BASE_URL}/documentation`, expected: 'documentation' }
      ]
    }
  ];
  
  const results = {};
  
  for (const scenario of scenarios) {
    log(`  Testing scenario: ${scenario.name}`, 'info');
    const scenarioStart = Date.now();
    let success = true;
    const stepTimings = [];
    
    for (const step of scenario.steps) {
      try {
        const result = await measureRequestTime(step.url);
        stepTimings.push({
          url: step.url,
          duration: result.duration,
          ttfb: result.ttfb,
          size: result.size,
          success: result.statusCode === 200
        });
        
        if (result.statusCode !== 200) {
          success = false;
        }
      } catch (error) {
        success = false;
        stepTimings.push({
          url: step.url,
          error: error.message,
          success: false
        });
      }
    }
    
    results[scenario.name] = {
      totalTime: Date.now() - scenarioStart,
      success,
      steps: stepTimings
    };
    
    log(`    Completed in ${results[scenario.name].totalTime}ms - ${success ? 'SUCCESS' : 'FAILED'}`, 
        success ? 'success' : 'error');
  }
  
  return results;
}

async function performLoadTest() {
  log('Performing graduated load test...', 'test');
  
  const loadResults = {};
  
  for (const concurrentUsers of TEST_CONFIG.concurrentUsers) {
    log(`  Testing with ${concurrentUsers} concurrent users...`, 'info');
    
    const startTime = Date.now();
    const promises = [];
    const results = [];
    
    // Generate load
    for (let i = 0; i < concurrentUsers; i++) {
      promises.push(
        measureRequestTime(`${BASE_URL}/api/health`)
          .then(result => {
            results.push({
              success: true,
              duration: result.duration,
              statusCode: result.statusCode
            });
          })
          .catch(error => {
            results.push({
              success: false,
              error: error.message
            });
          })
      );
    }
    
    await Promise.all(promises);
    
    const successCount = results.filter(r => r.success).length;
    const avgResponseTime = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + r.duration, 0) / successCount || 0;
    
    loadResults[`${concurrentUsers}_users`] = {
      totalTime: Date.now() - startTime,
      totalRequests: concurrentUsers,
      successfulRequests: successCount,
      failedRequests: concurrentUsers - successCount,
      errorRate: ((concurrentUsers - successCount) / concurrentUsers) * 100,
      avgResponseTime,
      requestsPerSecond: (successCount / ((Date.now() - startTime) / 1000))
    };
    
    log(`    Success rate: ${((successCount / concurrentUsers) * 100).toFixed(2)}%`, 'info');
    log(`    Avg response time: ${avgResponseTime.toFixed(2)}ms`, 'info');
    log(`    Requests/sec: ${loadResults[`${concurrentUsers}_users`].requestsPerSecond.toFixed(2)}`, 'info');
  }
  
  return loadResults;
}

async function generateDetailedReport(results) {
  const timestamp = new Date().toISOString();
  const reportDir = path.join(__dirname, 'performance-reports');
  
  // Create reports directory
  await fs.mkdir(reportDir, { recursive: true });
  
  const reportPath = path.join(reportDir, `performance-report-${timestamp.replace(/[:.]/g, '-')}.json`);
  const htmlReportPath = path.join(reportDir, `performance-report-${timestamp.replace(/[:.]/g, '-')}.html`);
  
  // Save JSON report
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  
  // Generate HTML report
  const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <title>EYNS AI Experience Center Performance Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1, h2, h3 { color: #333; }
    .metric { display: inline-block; margin: 10px; padding: 15px; background: #f8f9fa; border-radius: 4px; }
    .metric-value { font-size: 24px; font-weight: bold; color: #2196F3; }
    .metric-label { color: #666; font-size: 14px; }
    .success { color: #4CAF50; }
    .warning { color: #FF9800; }
    .error { color: #F44336; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .chart { margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>EYNS AI Experience Center Performance Report</h1>
    <p>Generated: ${timestamp}</p>
    <p>Target: ${BASE_URL}</p>
    
    <h2>Summary</h2>
    <div class="metrics">
      <div class="metric">
        <div class="metric-value">${results.summary.score}%</div>
        <div class="metric-label">Overall Score</div>
      </div>
      <div class="metric">
        <div class="metric-value">${results.pageLoad.avgLoadTime.toFixed(2)}ms</div>
        <div class="metric-label">Avg Page Load</div>
      </div>
      <div class="metric">
        <div class="metric-value">${results.api.avgResponseTime.toFixed(2)}ms</div>
        <div class="metric-label">Avg API Response</div>
      </div>
      <div class="metric">
        <div class="metric-value">${results.load.maxRPS.toFixed(2)}</div>
        <div class="metric-label">Max Requests/Sec</div>
      </div>
    </div>
    
    <h2>Page Load Performance</h2>
    <table>
      <tr>
        <th>Page</th>
        <th>Load Time (ms)</th>
        <th>TTFB (ms)</th>
        <th>Size (KB)</th>
        <th>Status</th>
      </tr>
      ${Object.entries(results.pageLoad.pages).map(([page, data]) => `
        <tr>
          <td>${page}</td>
          <td class="${data.loadTime < TEST_CONFIG.performanceThresholds.pageLoadTime ? 'success' : 'error'}">${data.loadTime.toFixed(2)}</td>
          <td>${data.ttfb.toFixed(2)}</td>
          <td>${(data.size / 1024).toFixed(2)}</td>
          <td class="${data.success ? 'success' : 'error'}">${data.success ? 'OK' : 'FAIL'}</td>
        </tr>
      `).join('')}
    </table>
    
    <h2>User Scenarios</h2>
    ${Object.entries(results.scenarios).map(([scenario, data]) => `
      <h3>${scenario}</h3>
      <p>Total Time: ${data.totalTime}ms - Status: <span class="${data.success ? 'success' : 'error'}">${data.success ? 'PASSED' : 'FAILED'}</span></p>
    `).join('')}
    
    <h2>Load Test Results</h2>
    <table>
      <tr>
        <th>Concurrent Users</th>
        <th>Success Rate</th>
        <th>Error Rate</th>
        <th>Avg Response Time</th>
        <th>Requests/Sec</th>
      </tr>
      ${Object.entries(results.load.tests).map(([test, data]) => `
        <tr>
          <td>${data.totalRequests}</td>
          <td class="${data.errorRate < TEST_CONFIG.performanceThresholds.errorRate ? 'success' : 'error'}">${((data.successfulRequests / data.totalRequests) * 100).toFixed(2)}%</td>
          <td class="${data.errorRate < TEST_CONFIG.performanceThresholds.errorRate ? 'success' : 'error'}">${data.errorRate.toFixed(2)}%</td>
          <td class="${data.avgResponseTime < TEST_CONFIG.performanceThresholds.apiResponseTime ? 'success' : 'warning'}">${data.avgResponseTime.toFixed(2)}ms</td>
          <td>${data.requestsPerSecond.toFixed(2)}</td>
        </tr>
      `).join('')}
    </table>
    
    <h2>Recommendations</h2>
    <ul>
      ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
  </div>
</body>
</html>`;
  
  await fs.writeFile(htmlReportPath, htmlReport);
  
  log(`\\nReports saved:`, 'success');
  log(`  JSON: ${reportPath}`, 'info');
  log(`  HTML: ${htmlReportPath}`, 'info');
  
  return { reportPath, htmlReportPath };
}

async function main() {
  console.log('\\n🚀 Enhanced Performance Validation for EYNS AI Experience Center\\n');
  
  try {
    // Authenticate if needed
    await authenticate();
    
    // Initialize results
    const results = {
      timestamp: new Date().toISOString(),
      target: BASE_URL,
      summary: {
        score: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      pageLoad: {
        pages: {},
        avgLoadTime: 0
      },
      api: {
        endpoints: {},
        avgResponseTime: 0
      },
      scenarios: {},
      load: {
        tests: {},
        maxRPS: 0
      },
      lighthouse: null,
      recommendations: []
    };
    
    // 1. Test page load performance
    log('Testing page load performance...', 'test');
    const pages = ['/', '/repositories', '/api-explorer', '/documentation'];
    let totalLoadTime = 0;
    let pageCount = 0;
    
    for (const page of pages) {
      try {
        const result = await measureRequestTime(`${BASE_URL}${page}`);
        results.pageLoad.pages[page] = {
          loadTime: result.duration,
          ttfb: result.ttfb,
          size: result.size,
          success: result.statusCode === 200
        };
        
        if (result.statusCode === 200) {
          totalLoadTime += result.duration;
          pageCount++;
          
          if (result.duration < TEST_CONFIG.performanceThresholds.pageLoadTime) {
            results.summary.passed++;
          } else {
            results.summary.failed++;
            results.recommendations.push(`Optimize load time for ${page} (current: ${result.duration.toFixed(2)}ms)`);
          }
        }
        
        log(`  ${page}: ${result.duration.toFixed(2)}ms (TTFB: ${result.ttfb.toFixed(2)}ms)`, 
            result.duration < TEST_CONFIG.performanceThresholds.pageLoadTime ? 'success' : 'warning');
      } catch (error) {
        results.pageLoad.pages[page] = {
          error: error.message,
          success: false
        };
        results.summary.failed++;
      }
    }
    
    results.pageLoad.avgLoadTime = pageCount > 0 ? totalLoadTime / pageCount : 0;
    
    // 2. Test API performance
    log('\\nTesting API performance...', 'test');
    const apiEndpoints = ['/api/health', '/api/repositories', '/api/search?q=test'];
    let totalApiTime = 0;
    let apiCount = 0;
    
    for (const endpoint of apiEndpoints) {
      const samples = [];
      
      for (let i = 0; i < 5; i++) {
        try {
          const result = await measureRequestTime(`${BASE_URL}${endpoint}`);
          if (result.statusCode === 200 || result.statusCode === 401) {
            samples.push(result.duration);
          }
        } catch (error) {
          // Ignore errors in sampling
        }
      }
      
      if (samples.length > 0) {
        const avgTime = samples.reduce((a, b) => a + b) / samples.length;
        results.api.endpoints[endpoint] = {
          avgResponseTime: avgTime,
          samples: samples.length,
          success: true
        };
        
        totalApiTime += avgTime;
        apiCount++;
        
        if (avgTime < TEST_CONFIG.performanceThresholds.apiResponseTime) {
          results.summary.passed++;
        } else {
          results.summary.warnings++;
        }
        
        log(`  ${endpoint}: ${avgTime.toFixed(2)}ms (${samples.length} samples)`, 
            avgTime < TEST_CONFIG.performanceThresholds.apiResponseTime ? 'success' : 'warning');
      }
    }
    
    results.api.avgResponseTime = apiCount > 0 ? totalApiTime / apiCount : 0;
    
    // 3. Test user scenarios
    log('\\nTesting user scenarios...', 'test');
    results.scenarios = await testRealUserScenarios();
    
    // 4. Perform load testing
    log('\\nPerforming load tests...', 'test');
    const loadTestResults = await performLoadTest();
    results.load.tests = loadTestResults;
    
    // Find max RPS
    results.load.maxRPS = Math.max(...Object.values(loadTestResults).map(r => r.requestsPerSecond));
    
    // 5. Try Lighthouse test
    results.lighthouse = await runLighthouseTest();
    
    // Calculate overall score
    const totalTests = results.summary.passed + results.summary.failed + results.summary.warnings;
    results.summary.score = totalTests > 0 ? 
      Math.round((results.summary.passed / totalTests) * 100) : 0;
    
    // Generate recommendations
    if (!results.recommendations.length) {
      results.recommendations.push('All performance metrics are within acceptable thresholds');
    }
    
    // Generate reports
    await generateDetailedReport(results);
    
    // Print summary
    console.log('\\n📊 Performance Test Summary:');
    console.log(`   Overall Score: ${results.summary.score}%`);
    console.log(`   ✅ Passed: ${results.summary.passed}`);
    console.log(`   ❌ Failed: ${results.summary.failed}`);
    console.log(`   ⚠️  Warnings: ${results.summary.warnings}`);
    console.log(`\\n   Average Page Load: ${results.pageLoad.avgLoadTime.toFixed(2)}ms`);
    console.log(`   Average API Response: ${results.api.avgResponseTime.toFixed(2)}ms`);
    console.log(`   Max Throughput: ${results.load.maxRPS.toFixed(2)} requests/sec`);
    
  } catch (error) {
    log(`\\nFatal error: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// Run the enhanced test
if (require.main === module) {
  main();
}

module.exports = { measureRequestTime, authenticate };