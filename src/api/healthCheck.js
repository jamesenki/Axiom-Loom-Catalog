/**
 * Health Check API
 * 
 * Provides health status endpoints for monitoring the application
 */

const express = require('express');
const router = express.Router();
const os = require('os');
const fs = require('fs').promises;
const path = require('path');

// Health check status
const STATUS = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy'
};

// Component health checks
const componentChecks = {
  database: async () => {
    // Check database connectivity
    try {
      // Simulate database check - in production, actually ping the database
      const dbPath = path.join(__dirname, '../../repositories.json');
      await fs.access(dbPath);
      return { status: STATUS.HEALTHY, message: 'Database accessible' };
    } catch (error) {
      return { status: STATUS.UNHEALTHY, message: 'Database connection failed', error: error.message };
    }
  },

  cache: async () => {
    // Check cache service
    try {
      const cachePath = path.join(__dirname, '../../cache');
      await fs.access(cachePath);
      const stats = await fs.stat(cachePath);
      return { 
        status: STATUS.HEALTHY, 
        message: 'Cache directory accessible',
        details: { 
          size: stats.size,
          modified: stats.mtime 
        }
      };
    } catch (error) {
      return { status: STATUS.DEGRADED, message: 'Cache not available', error: error.message };
    }
  },

  repositories: async () => {
    // Check repository access
    try {
      const repoPath = path.join(__dirname, '../../cloned-repositories');
      await fs.access(repoPath);
      const repos = await fs.readdir(repoPath);
      return { 
        status: STATUS.HEALTHY, 
        message: 'Repository directory accessible',
        details: { count: repos.length }
      };
    } catch (error) {
      return { status: STATUS.UNHEALTHY, message: 'Repository access failed', error: error.message };
    }
  },

  api: async () => {
    // Check API responsiveness
    try {
      // Simple self-check
      return { 
        status: STATUS.HEALTHY, 
        message: 'API responsive',
        details: { 
          uptime: process.uptime(),
          pid: process.pid 
        }
      };
    } catch (error) {
      return { status: STATUS.UNHEALTHY, message: 'API check failed', error: error.message };
    }
  }
};

// System metrics
const getSystemMetrics = () => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePercent = (usedMem / totalMem) * 100;

  return {
    cpu: {
      cores: os.cpus().length,
      model: os.cpus()[0]?.model,
      loadAverage: os.loadavg()
    },
    memory: {
      total: totalMem,
      free: freeMem,
      used: usedMem,
      usagePercent: memUsagePercent.toFixed(2)
    },
    system: {
      platform: os.platform(),
      release: os.release(),
      uptime: os.uptime(),
      hostname: os.hostname()
    },
    process: {
      uptime: process.uptime(),
      pid: process.pid,
      version: process.version,
      memoryUsage: process.memoryUsage()
    }
  };
};

// Basic health check
router.get('/health', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Run all component checks
    const checkPromises = Object.entries(componentChecks).map(async ([name, check]) => {
      const startCheck = Date.now();
      const result = await check();
      const duration = Date.now() - startCheck;
      return { name, ...result, duration };
    });

    const results = await Promise.all(checkPromises);
    
    // Determine overall status
    const hasUnhealthy = results.some(r => r.status === STATUS.UNHEALTHY);
    const hasDegraded = results.some(r => r.status === STATUS.DEGRADED);
    
    let overallStatus = STATUS.HEALTHY;
    if (hasUnhealthy) overallStatus = STATUS.UNHEALTHY;
    else if (hasDegraded) overallStatus = STATUS.DEGRADED;

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      checks: results
    };

    // Set appropriate status code
    const statusCode = overallStatus === STATUS.HEALTHY ? 200 : 
                      overallStatus === STATUS.DEGRADED ? 200 : 503;

    res.status(statusCode).json(response);
  } catch (error) {
    res.status(503).json({
      status: STATUS.UNHEALTHY,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      error: error.message
    });
  }
});

// Detailed health check with metrics
router.get('/health/detailed', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Run component checks
    const checkPromises = Object.entries(componentChecks).map(async ([name, check]) => {
      const startCheck = Date.now();
      const result = await check();
      const duration = Date.now() - startCheck;
      return { name, ...result, duration };
    });

    const results = await Promise.all(checkPromises);
    const metrics = getSystemMetrics();
    
    // Determine overall status
    const hasUnhealthy = results.some(r => r.status === STATUS.UNHEALTHY);
    const hasDegraded = results.some(r => r.status === STATUS.DEGRADED);
    
    let overallStatus = STATUS.HEALTHY;
    if (hasUnhealthy) overallStatus = STATUS.UNHEALTHY;
    else if (hasDegraded) overallStatus = STATUS.DEGRADED;

    // Check system thresholds
    if (metrics.memory.usagePercent > 90) {
      overallStatus = STATUS.DEGRADED;
    }

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      checks: results,
      metrics
    };

    const statusCode = overallStatus === STATUS.HEALTHY ? 200 : 
                      overallStatus === STATUS.DEGRADED ? 200 : 503;

    res.status(statusCode).json(response);
  } catch (error) {
    res.status(503).json({
      status: STATUS.UNHEALTHY,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      error: error.message
    });
  }
});

// Liveness probe (for Kubernetes)
router.get('/health/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

// Readiness probe (for Kubernetes)
router.get('/health/ready', async (req, res) => {
  try {
    // Quick check of critical components
    const dbCheck = await componentChecks.database();
    const apiCheck = await componentChecks.api();
    
    const isReady = dbCheck.status !== STATUS.UNHEALTHY && 
                   apiCheck.status !== STATUS.UNHEALTHY;

    if (isReady) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        reason: 'Component checks failed'
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Metrics endpoint (Prometheus format)
router.get('/metrics', (req, res) => {
  const metrics = getSystemMetrics();
  
  // Format metrics in Prometheus exposition format
  const promMetrics = [
    `# HELP app_info Application information`,
    `# TYPE app_info gauge`,
    `app_info{version="${process.env.npm_package_version || '0.1.0'}",node_version="${process.version}"} 1`,
    
    `# HELP process_uptime_seconds Process uptime in seconds`,
    `# TYPE process_uptime_seconds gauge`,
    `process_uptime_seconds ${metrics.process.uptime}`,
    
    `# HELP process_memory_usage_bytes Process memory usage in bytes`,
    `# TYPE process_memory_usage_bytes gauge`,
    `process_memory_usage_bytes{type="rss"} ${metrics.process.memoryUsage.rss}`,
    `process_memory_usage_bytes{type="heap_total"} ${metrics.process.memoryUsage.heapTotal}`,
    `process_memory_usage_bytes{type="heap_used"} ${metrics.process.memoryUsage.heapUsed}`,
    
    `# HELP system_memory_usage_percent System memory usage percentage`,
    `# TYPE system_memory_usage_percent gauge`,
    `system_memory_usage_percent ${metrics.memory.usagePercent}`,
    
    `# HELP system_load_average System load average`,
    `# TYPE system_load_average gauge`,
    `system_load_average{interval="1m"} ${metrics.cpu.loadAverage[0]}`,
    `system_load_average{interval="5m"} ${metrics.cpu.loadAverage[1]}`,
    `system_load_average{interval="15m"} ${metrics.cpu.loadAverage[2]}`,
  ].join('\n');

  res.set('Content-Type', 'text/plain; version=0.0.4');
  res.send(promMetrics);
});

module.exports = router;