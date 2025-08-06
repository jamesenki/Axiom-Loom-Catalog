#!/usr/bin/env node

/**
 * Deployment Verification Script for EYNS AI Experience Center
 * Checks if the application is properly deployed at http://10.0.0.109
 */

const http = require('http');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const BASE_URL = 'http://10.0.0.109';

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

async function getPageContent(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          content: data,
          size: Buffer.byteLength(data)
        });
      });
    }).on('error', reject);
  });
}

async function checkDeployment() {
  console.log('\n🔍 EYNS AI Experience Center Deployment Verification\n');
  
  try {
    // 1. Check homepage content
    log('Checking homepage content...', 'test');
    const homepage = await getPageContent(BASE_URL);
    
    log(`Status: ${homepage.statusCode}`, 'info');
    log(`Size: ${homepage.size} bytes`, 'info');
    log(`Content-Type: ${homepage.headers['content-type']}`, 'info');
    
    // Check if it's the React app
    if (homepage.content.includes('root') || homepage.content.includes('React')) {
      log('React application detected', 'success');
    } else if (homepage.content.includes('nginx')) {
      log('Nginx default page detected - application may not be deployed', 'error');
    } else {
      log('Unknown content type', 'warning');
    }
    
    // Show first 500 chars of content
    console.log('\nFirst 500 characters of homepage:');
    console.log('---');
    console.log(homepage.content.substring(0, 500));
    console.log('---\n');
    
    // 2. Check API endpoints
    log('Checking API endpoints...', 'test');
    const apiEndpoints = [
      '/api/health',
      '/api/repositories',
      '/api/analytics/metrics'
    ];
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await getPageContent(`${BASE_URL}${endpoint}`);
        log(`${endpoint}: ${response.statusCode} - ${response.size} bytes`, 
            response.statusCode === 200 ? 'success' : 'error');
        
        // Try to parse JSON response
        if (response.headers['content-type']?.includes('json')) {
          try {
            const json = JSON.parse(response.content);
            console.log(`  Response: ${JSON.stringify(json).substring(0, 100)}...`);
          } catch (e) {
            console.log(`  Invalid JSON response`);
          }
        }
      } catch (error) {
        log(`${endpoint}: Failed - ${error.message}`, 'error');
      }
    }
    
    // 3. Check static assets
    log('\nChecking static assets...', 'test');
    const assets = [
      '/static/js/main.js',
      '/static/css/main.css',
      '/index.html',
      '/favicon.ico',
      '/service-worker.js'
    ];
    
    for (const asset of assets) {
      try {
        const response = await getPageContent(`${BASE_URL}${asset}`);
        log(`${asset}: ${response.statusCode} - ${response.size} bytes`, 
            response.statusCode === 200 ? 'success' : 'warning');
      } catch (error) {
        log(`${asset}: Failed - ${error.message}`, 'error');
      }
    }
    
    // 4. Check server headers
    log('\nChecking server configuration...', 'test');
    console.log('Server headers:');
    Object.entries(homepage.headers).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    // 5. Check with curl for more details
    log('\nPerforming detailed curl check...', 'test');
    const curlResult = await execAsync(`curl -I "${BASE_URL}"`);
    console.log('HTTP Headers:');
    console.log(curlResult.stdout);
    
    // 6. Port scan to check what's running
    log('Checking open ports on server...', 'test');
    const commonPorts = [80, 3000, 3001, 8080, 443];
    
    for (const port of commonPorts) {
      const portCheckResult = await execAsync(`nc -zv -w 1 10.0.0.109 ${port} 2>&1`).catch(e => ({ stdout: e.message }));
      if (portCheckResult.stdout.includes('succeeded') || portCheckResult.stdout.includes('open')) {
        log(`Port ${port}: OPEN`, 'success');
      } else {
        log(`Port ${port}: CLOSED`, 'info');
      }
    }
    
    // Summary
    console.log('\n📋 DEPLOYMENT SUMMARY:');
    if (homepage.size < 1000 && !homepage.content.includes('root')) {
      log('The application does not appear to be properly deployed', 'error');
      log('You may be seeing a default nginx page or proxy error', 'warning');
      console.log('\nRecommended actions:');
      console.log('1. Check if the React build files are in the correct location');
      console.log('2. Verify nginx configuration points to the build directory');
      console.log('3. Check if the Node.js backend server is running on port 3001');
      console.log('4. Review nginx error logs for any issues');
    } else {
      log('Application appears to be deployed', 'success');
    }
    
  } catch (error) {
    log(`Deployment check failed: ${error.message}`, 'error');
    console.error(error);
  }
}

// Run the check
checkDeployment();