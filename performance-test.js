#!/usr/bin/env node

/**
 * EYNS AI Experience Center Performance Validation Tests
 * Tests deployed instance at http://10.0.0.109
 * 
 * Requirements tested:
 * 1. Page Load Performance (FCP, LCP, TTI, < 2s load time)
 * 2. API Performance (response times, concurrent handling, rate limiting)
 * 3. Resource Optimization (bundle sizes, compression, caching)
 * 4. Stress Testing (concurrent users, error rates, resource consumption)
 * 5. Network Performance (LAN perspective, latency, bandwidth)
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

// Configuration
const BASE_URL = 'http://10.0.0.109';
const API_BASE = `${BASE_URL}/api`;
const CONCURRENT_USERS = 50;
const TEST_DURATION_SECONDS = 30;

// Test results storage
const results = {
  timestamp: new Date().toISOString(),
  summary: {
    passed: 0,
    failed: 0,
    warnings: 0
  },
  pageLoadPerformance: {},
  apiPerformance: {},
  resourceOptimization: {},
  stressTest: {},
  networkPerformance: {}
};

// Utility functions
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

async function measureRequestTime(url, options = {}) {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime.bigint();
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1e6; // Convert to milliseconds
        resolve({
          duration,
          statusCode: res.statusCode,
          headers: res.headers,
          size: Buffer.byteLength(data)
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runCommand(command) {
  try {
    const { stdout, stderr } = await execAsync(command);
    return { stdout, stderr, success: true };
  } catch (error) {
    return { stdout: '', stderr: error.message, success: false, error };
  }
}

// Test 1: Page Load Performance
async function testPageLoadPerformance() {
  log('Testing Page Load Performance...', 'test');
  const metrics = {};
  
  try {
    // Use curl to measure basic load times
    const curlCmd = `curl -w "time_namelookup:  %{time_namelookup}s\ntime_connect:  %{time_connect}s\ntime_appconnect:  %{time_appconnect}s\ntime_pretransfer:  %{time_pretransfer}s\ntime_redirect:  %{time_redirect}s\ntime_starttransfer:  %{time_starttransfer}s\ntime_total:  %{time_total}s\nsize_download: %{size_download} bytes\nspeed_download: %{speed_download} bytes/sec\n" -o /dev/null -s "${BASE_URL}"`;
    
    const { stdout } = await runCommand(curlCmd);
    
    // Parse curl timing data
    const timingData = {};
    stdout.split('\n').forEach(line => {
      const match = line.match(/(.+):\s*([\d.]+)/);
      if (match) {
        timingData[match[1].trim()] = parseFloat(match[2]);
      }
    });
    
    // Calculate metrics
    metrics.dnsLookup = timingData.time_namelookup * 1000;
    metrics.tcpConnection = (timingData.time_connect - timingData.time_namelookup) * 1000;
    metrics.ttfb = timingData.time_starttransfer * 1000; // Time to First Byte
    metrics.totalLoadTime = timingData.time_total * 1000;
    metrics.downloadSize = parseInt(timingData.size_download) || 0;
    
    // Estimate FCP and LCP (would need real browser for accurate measurement)
    metrics.estimatedFCP = metrics.ttfb + 100; // Rough estimate
    metrics.estimatedLCP = metrics.totalLoadTime * 0.8; // Rough estimate
    metrics.estimatedTTI = metrics.totalLoadTime * 0.9; // Rough estimate
    
    // Check requirements
    const loadTimeRequirement = metrics.totalLoadTime < 2000;
    metrics.meetsLoadTimeRequirement = loadTimeRequirement;
    
    if (loadTimeRequirement) {
      results.summary.passed++;
      log(`Load time: ${metrics.totalLoadTime.toFixed(2)}ms (< 2000ms requirement)`, 'success');
    } else {
      results.summary.failed++;
      log(`Load time: ${metrics.totalLoadTime.toFixed(2)}ms (> 2000ms requirement)`, 'error');
    }
    
    // Test multiple pages
    const pages = ['/', '/repositories', '/api-explorer', '/documentation'];
    metrics.pageMetrics = {};
    
    for (const page of pages) {
      try {
        const pageResult = await measureRequestTime(`${BASE_URL}${page}`);
        metrics.pageMetrics[page] = {
          loadTime: pageResult.duration,
          statusCode: pageResult.statusCode,
          size: pageResult.size
        };
        log(`  ${page}: ${pageResult.duration.toFixed(2)}ms, ${pageResult.size} bytes`, 'info');
      } catch (error) {
        metrics.pageMetrics[page] = { error: error.message };
      }
    }
    
  } catch (error) {
    log(`Page load performance test failed: ${error.message}`, 'error');
    results.summary.failed++;
  }
  
  results.pageLoadPerformance = metrics;
}

// Test 2: API Performance
async function testAPIPerformance() {
  log('Testing API Performance...', 'test');
  const metrics = {
    endpoints: {},
    concurrentRequests: {},
    rateLimiting: {}
  };
  
  try {
    // Test individual API endpoints
    const endpoints = [
      '/api/health',
      '/api/repositories',
      '/api/search?q=test'
    ];
    
    for (const endpoint of endpoints) {
      const samples = [];
      
      // Take 10 samples for each endpoint
      for (let i = 0; i < 10; i++) {
        try {
          const result = await measureRequestTime(`${BASE_URL}${endpoint}`);
          samples.push(result.duration);
        } catch (error) {
          samples.push(-1);
        }
      }
      
      const validSamples = samples.filter(s => s > 0);
      if (validSamples.length > 0) {
        metrics.endpoints[endpoint] = {
          avgResponseTime: validSamples.reduce((a, b) => a + b) / validSamples.length,
          minResponseTime: Math.min(...validSamples),
          maxResponseTime: Math.max(...validSamples),
          successRate: (validSamples.length / samples.length) * 100
        };
        
        log(`  ${endpoint}: avg ${metrics.endpoints[endpoint].avgResponseTime.toFixed(2)}ms`, 'info');
      }
    }
    
    // Test concurrent request handling
    log('  Testing concurrent request handling...', 'info');
    const concurrentTests = [10, 25, 50];
    
    for (const concurrent of concurrentTests) {
      const startTime = Date.now();
      const promises = [];
      
      for (let i = 0; i < concurrent; i++) {
        promises.push(measureRequestTime(`${BASE_URL}/api/health`));
      }
      
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const totalTime = Date.now() - startTime;
      
      metrics.concurrentRequests[`${concurrent}_requests`] = {
        totalTime,
        successfulRequests: successful,
        failedRequests: concurrent - successful,
        avgTimePerRequest: totalTime / concurrent
      };
      
      log(`    ${concurrent} concurrent: ${successful}/${concurrent} successful in ${totalTime}ms`, 'info');
    }
    
    // Test rate limiting
    log('  Testing rate limiting...', 'info');
    const rateLimitPromises = [];
    for (let i = 0; i < 100; i++) {
      rateLimitPromises.push(measureRequestTime(`${BASE_URL}/api/health`));
    }
    
    const rateLimitResults = await Promise.allSettled(rateLimitPromises);
    const rateLimited = rateLimitResults.filter(r => 
      r.status === 'fulfilled' && r.value.statusCode === 429
    ).length;
    
    metrics.rateLimiting = {
      totalRequests: 100,
      rateLimitedRequests: rateLimited,
      isRateLimitingActive: rateLimited > 0
    };
    
    if (metrics.rateLimiting.isRateLimitingActive) {
      log(`  Rate limiting active: ${rateLimited}/100 requests limited`, 'success');
      results.summary.passed++;
    } else {
      log(`  Rate limiting not detected`, 'warning');
      results.summary.warnings++;
    }
    
  } catch (error) {
    log(`API performance test failed: ${error.message}`, 'error');
    results.summary.failed++;
  }
  
  results.apiPerformance = metrics;
}

// Test 3: Resource Optimization
async function testResourceOptimization() {
  log('Testing Resource Optimization...', 'test');
  const metrics = {
    compression: {},
    caching: {},
    bundleSizes: {}
  };
  
  try {
    // Test compression
    const compressionResult = await measureRequestTime(BASE_URL, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    
    metrics.compression = {
      supportsCompression: compressionResult.headers['content-encoding'] !== undefined,
      encoding: compressionResult.headers['content-encoding'] || 'none',
      compressedSize: compressionResult.size
    };
    
    if (metrics.compression.supportsCompression) {
      log(`  Compression enabled: ${metrics.compression.encoding}`, 'success');
      results.summary.passed++;
    } else {
      log(`  Compression not enabled`, 'warning');
      results.summary.warnings++;
    }
    
    // Test caching headers
    const cacheableResources = [
      '/static/js/main.js',
      '/static/css/main.css',
      '/favicon.ico'
    ];
    
    metrics.caching.resources = {};
    
    for (const resource of cacheableResources) {
      try {
        const result = await measureRequestTime(`${BASE_URL}${resource}`);
        const cacheControl = result.headers['cache-control'];
        const etag = result.headers['etag'];
        
        metrics.caching.resources[resource] = {
          hasCacheControl: !!cacheControl,
          cacheControl: cacheControl || 'none',
          hasEtag: !!etag,
          maxAge: cacheControl ? parseInt(cacheControl.match(/max-age=(\\d+)/)?.[1] || 0) : 0
        };
        
        if (metrics.caching.resources[resource].hasCacheControl) {
          log(`  ${resource}: Cache-Control present (max-age=${metrics.caching.resources[resource].maxAge})`, 'info');
        }
      } catch (error) {
        metrics.caching.resources[resource] = { error: error.message };
      }
    }
    
    // Estimate bundle sizes
    const mainPageResult = await measureRequestTime(BASE_URL);
    metrics.bundleSizes.initialPageSize = mainPageResult.size;
    
    log(`  Initial page size: ${(mainPageResult.size / 1024).toFixed(2)} KB`, 'info');
    
    if (mainPageResult.size < 500 * 1024) { // Less than 500KB
      log(`  Page size is optimized (< 500KB)`, 'success');
      results.summary.passed++;
    } else {
      log(`  Page size could be optimized (> 500KB)`, 'warning');
      results.summary.warnings++;
    }
    
  } catch (error) {
    log(`Resource optimization test failed: ${error.message}`, 'error');
    results.summary.failed++;
  }
  
  results.resourceOptimization = metrics;
}

// Test 4: Stress Testing
async function testStressTest() {
  log('Running Stress Tests...', 'test');
  const metrics = {
    loadTest: {},
    errorRates: {},
    performanceDegradation: {}
  };
  
  try {
    // Use Apache Bench for load testing if available
    const abAvailable = (await runCommand('which ab')).success;
    
    if (abAvailable) {
      log('  Using Apache Bench for load testing...', 'info');
      
      // Run load test
      const abCommand = `ab -n 1000 -c ${CONCURRENT_USERS} -t ${TEST_DURATION_SECONDS} "${BASE_URL}/api/health"`;
      const abResult = await runCommand(abCommand);
      
      if (abResult.success) {
        // Parse AB output
        const output = abResult.stdout;
        
        metrics.loadTest = {
          totalRequests: parseInt(output.match(/Complete requests:\s*(\d+)/)?.[1] || 0),
          failedRequests: parseInt(output.match(/Failed requests:\s*(\d+)/)?.[1] || 0),
          requestsPerSecond: parseFloat(output.match(/Requests per second:\s*([\d.]+)/)?.[1] || 0),
          timePerRequest: parseFloat(output.match(/Time per request:\s*([\d.]+).*\[ms\]/)?.[1] || 0),
          transferRate: parseFloat(output.match(/Transfer rate:\s*([\d.]+)/)?.[1] || 0)
        };
        
        metrics.errorRates = {
          errorRate: (metrics.loadTest.failedRequests / metrics.loadTest.totalRequests) * 100,
          successRate: ((metrics.loadTest.totalRequests - metrics.loadTest.failedRequests) / metrics.loadTest.totalRequests) * 100
        };
        
        log(`  Requests per second: ${metrics.loadTest.requestsPerSecond}`, 'info');
        log(`  Average response time: ${metrics.loadTest.timePerRequest}ms`, 'info');
        log(`  Error rate: ${metrics.errorRates.errorRate.toFixed(2)}%`, 'info');
        
        if (metrics.errorRates.errorRate < 1) {
          log(`  Low error rate under load`, 'success');
          results.summary.passed++;
        } else if (metrics.errorRates.errorRate < 5) {
          log(`  Moderate error rate under load`, 'warning');
          results.summary.warnings++;
        } else {
          log(`  High error rate under load`, 'error');
          results.summary.failed++;
        }
      }
    } else {
      // Fallback to custom stress test
      log('  Running custom stress test...', 'info');
      
      const baselineResponse = await measureRequestTime(`${BASE_URL}/api/health`);
      const baselineTime = baselineResponse.duration;
      
      // Generate load
      const loadPromises = [];
      for (let i = 0; i < 100; i++) {
        loadPromises.push(measureRequestTime(`${BASE_URL}/api/health`));
      }
      
      const loadResults = await Promise.allSettled(loadPromises);
      const successfulRequests = loadResults.filter(r => r.status === 'fulfilled');
      const avgLoadTime = successfulRequests.reduce((sum, r) => sum + r.value.duration, 0) / successfulRequests.length;
      
      metrics.performanceDegradation = {
        baselineResponseTime: baselineTime,
        loadResponseTime: avgLoadTime,
        degradation: ((avgLoadTime - baselineTime) / baselineTime) * 100
      };
      
      log(`  Performance degradation: ${metrics.performanceDegradation.degradation.toFixed(2)}%`, 'info');
      
      if (metrics.performanceDegradation.degradation < 50) {
        log(`  Acceptable performance under load`, 'success');
        results.summary.passed++;
      } else {
        log(`  Significant performance degradation under load`, 'warning');
        results.summary.warnings++;
      }
    }
    
  } catch (error) {
    log(`Stress test failed: ${error.message}`, 'error');
    results.summary.failed++;
  }
  
  results.stressTest = metrics;
}

// Test 5: Network Performance
async function testNetworkPerformance() {
  log('Testing Network Performance...', 'test');
  const metrics = {
    latency: {},
    bandwidth: {},
    connectivity: {}
  };
  
  try {
    // Test latency with ping (if available)
    const pingAvailable = (await runCommand('which ping')).success;
    
    if (pingAvailable) {
      const pingCommand = `ping -c 10 10.0.0.109`;
      const pingResult = await runCommand(pingCommand);
      
      if (pingResult.success) {
        const output = pingResult.stdout;
        const avgLatency = parseFloat(output.match(/avg.*=\s*[\d.]+\/*([\d.]+)/)?.[1] || 0);
        const packetLoss = parseFloat(output.match(/([\d.]+)% packet loss/)?.[1] || 0);
        
        metrics.latency = {
          avgLatency,
          packetLoss,
          isLowLatency: avgLatency < 10 // Less than 10ms for LAN
        };
        
        log(`  Average latency: ${avgLatency}ms`, 'info');
        log(`  Packet loss: ${packetLoss}%`, 'info');
        
        if (metrics.latency.isLowLatency && packetLoss === 0) {
          log(`  Excellent LAN performance`, 'success');
          results.summary.passed++;
        } else if (packetLoss > 0) {
          log(`  Network packet loss detected`, 'warning');
          results.summary.warnings++;
        }
      }
    }
    
    // Test bandwidth by downloading a larger resource
    const bandwidthTest = await measureRequestTime(`${BASE_URL}`);
    const downloadTime = bandwidthTest.duration / 1000; // Convert to seconds
    const downloadSize = bandwidthTest.size / 1024 / 1024; // Convert to MB
    const bandwidth = (downloadSize / downloadTime) * 8; // Mbps
    
    metrics.bandwidth = {
      downloadSize: downloadSize,
      downloadTime: downloadTime,
      estimatedBandwidth: bandwidth,
      unit: 'Mbps'
    };
    
    log(`  Estimated bandwidth: ${bandwidth.toFixed(2)} Mbps`, 'info');
    
    // Test multiple connection types
    const connectionTests = [
      { name: 'HTTP/1.1', url: BASE_URL },
      { name: 'Keep-Alive', url: BASE_URL, headers: { 'Connection': 'keep-alive' } },
      { name: 'Close', url: BASE_URL, headers: { 'Connection': 'close' } }
    ];
    
    metrics.connectivity = {};
    
    for (const test of connectionTests) {
      try {
        const result = await measureRequestTime(test.url, { headers: test.headers || {} });
        metrics.connectivity[test.name] = {
          responseTime: result.duration,
          success: true
        };
        log(`  ${test.name}: ${result.duration.toFixed(2)}ms`, 'info');
      } catch (error) {
        metrics.connectivity[test.name] = {
          success: false,
          error: error.message
        };
      }
    }
    
  } catch (error) {
    log(`Network performance test failed: ${error.message}`, 'error');
    results.summary.failed++;
  }
  
  results.networkPerformance = metrics;
}

// Generate comprehensive report
async function generateReport() {
  log('\\nGenerating Performance Report...', 'info');
  
  const reportPath = path.join(__dirname, `performance-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  const readableReportPath = path.join(__dirname, `performance-report-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`);
  
  // Save JSON report
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  
  // Generate readable report
  let readableReport = `
EYNS AI Experience Center Performance Validation Report
======================================================
Generated: ${results.timestamp}
Target: ${BASE_URL}

SUMMARY
-------
✅ Passed: ${results.summary.passed}
❌ Failed: ${results.summary.failed}
⚠️  Warnings: ${results.summary.warnings}

1. PAGE LOAD PERFORMANCE
------------------------
`;

  if (results.pageLoadPerformance.totalLoadTime) {
    readableReport += `
Total Load Time: ${results.pageLoadPerformance.totalLoadTime.toFixed(2)}ms
Estimated FCP: ${results.pageLoadPerformance.estimatedFCP.toFixed(2)}ms
Estimated LCP: ${results.pageLoadPerformance.estimatedLCP.toFixed(2)}ms
Estimated TTI: ${results.pageLoadPerformance.estimatedTTI.toFixed(2)}ms
Meets < 2s Requirement: ${results.pageLoadPerformance.meetsLoadTimeRequirement ? 'YES' : 'NO'}

Page Load Times:`;
    
    for (const [page, metrics] of Object.entries(results.pageLoadPerformance.pageMetrics || {})) {
      if (!metrics.error) {
        readableReport += `
  ${page}: ${metrics.loadTime.toFixed(2)}ms (${metrics.size} bytes)`;
      }
    }
  }

  readableReport += `

2. API PERFORMANCE
------------------
`;

  for (const [endpoint, metrics] of Object.entries(results.apiPerformance.endpoints || {})) {
    readableReport += `
${endpoint}:
  Average Response Time: ${metrics.avgResponseTime.toFixed(2)}ms
  Min/Max: ${metrics.minResponseTime.toFixed(2)}ms / ${metrics.maxResponseTime.toFixed(2)}ms
  Success Rate: ${metrics.successRate.toFixed(2)}%`;
  }

  if (results.apiPerformance.rateLimiting) {
    readableReport += `

Rate Limiting: ${results.apiPerformance.rateLimiting.isRateLimitingActive ? 'ACTIVE' : 'NOT DETECTED'}`;
  }

  readableReport += `

3. RESOURCE OPTIMIZATION
------------------------
Compression: ${results.resourceOptimization.compression?.supportsCompression ? 'ENABLED' : 'DISABLED'}
Initial Page Size: ${((results.resourceOptimization.bundleSizes?.initialPageSize || 0) / 1024).toFixed(2)} KB
`;

  readableReport += `

4. STRESS TEST RESULTS
----------------------`;

  if (results.stressTest.loadTest?.requestsPerSecond) {
    readableReport += `
Requests per Second: ${results.stressTest.loadTest.requestsPerSecond}
Average Response Time: ${results.stressTest.loadTest.timePerRequest}ms
Error Rate: ${results.stressTest.errorRates?.errorRate.toFixed(2)}%`;
  } else if (results.stressTest.performanceDegradation) {
    readableReport += `
Performance Degradation Under Load: ${results.stressTest.performanceDegradation.degradation.toFixed(2)}%`;
  }

  readableReport += `

5. NETWORK PERFORMANCE
----------------------`;

  if (results.networkPerformance.latency?.avgLatency) {
    readableReport += `
Average Latency: ${results.networkPerformance.latency.avgLatency}ms
Packet Loss: ${results.networkPerformance.latency.packetLoss}%`;
  }

  if (results.networkPerformance.bandwidth?.estimatedBandwidth) {
    readableReport += `
Estimated Bandwidth: ${results.networkPerformance.bandwidth.estimatedBandwidth.toFixed(2)} Mbps`;
  }

  readableReport += `

RECOMMENDATIONS
---------------`;

  // Generate recommendations based on results
  const recommendations = [];
  
  if (results.pageLoadPerformance.totalLoadTime > 2000) {
    recommendations.push('- Optimize page load time to meet < 2 second requirement');
  }
  
  if (!results.resourceOptimization.compression?.supportsCompression) {
    recommendations.push('- Enable compression (gzip/brotli) for better performance');
  }
  
  if (results.stressTest.errorRates?.errorRate > 5) {
    recommendations.push('- Improve error handling under high load conditions');
  }
  
  if (!results.apiPerformance.rateLimiting?.isRateLimitingActive) {
    recommendations.push('- Consider implementing rate limiting for API protection');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('- All performance metrics are within acceptable ranges');
  }
  
  readableReport += '\\n' + recommendations.join('\\n');
  
  // Save readable report
  await fs.writeFile(readableReportPath, readableReport);
  
  log(`\\nReports saved:`, 'success');
  log(`  JSON: ${reportPath}`, 'info');
  log(`  Text: ${readableReportPath}`, 'info');
}

// Main execution
async function main() {
  console.log('\\n🚀 EYNS AI Experience Center Performance Validation\\n');
  
  try {
    // Check if target is reachable
    log(`Checking connectivity to ${BASE_URL}...`, 'info');
    const healthCheck = await measureRequestTime(`${BASE_URL}/api/health`).catch(() => null);
    
    if (!healthCheck || healthCheck.statusCode !== 200) {
      log(`Cannot reach ${BASE_URL}. Is the server running?`, 'error');
      process.exit(1);
    }
    
    log('Server is reachable. Starting performance tests...\\n', 'success');
    
    // Run all tests
    await testPageLoadPerformance();
    console.log('');
    
    await testAPIPerformance();
    console.log('');
    
    await testResourceOptimization();
    console.log('');
    
    await testStressTest();
    console.log('');
    
    await testNetworkPerformance();
    console.log('');
    
    // Generate report
    await generateReport();
    
    // Final summary
    console.log('\\n📊 Test Summary:');
    console.log(`   ✅ Passed: ${results.summary.passed}`);
    console.log(`   ❌ Failed: ${results.summary.failed}`);
    console.log(`   ⚠️  Warnings: ${results.summary.warnings}`);
    
    // Exit with appropriate code
    process.exit(results.summary.failed > 0 ? 1 : 0);
    
  } catch (error) {
    log(`\\nFatal error: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  main();
}

module.exports = { measureRequestTime, runCommand };