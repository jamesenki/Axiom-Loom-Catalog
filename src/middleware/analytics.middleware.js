/**
 * Analytics Middleware
 * 
 * Tracks API usage and performance metrics
 */

const analyticsQueue = [];
let flushTimer = null;

// Analytics event structure
const createAnalyticsEvent = (req, res, responseTime) => {
  return {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    responseTime,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id,
    sessionId: req.sessionID,
    query: req.query,
    params: req.params,
    referrer: req.headers.referer || req.headers.referrer,
    contentLength: res.get('content-length'),
    repository: extractRepository(req.path),
    apiType: detectApiType(req.path)
  };
};

// Extract repository name from path
const extractRepository = (path) => {
  const match = path.match(/\/api\/repositories\/([^\/]+)/);
  return match ? match[1] : null;
};

// Detect API type from path
const detectApiType = (path) => {
  if (path.includes('/graphql')) return 'graphql';
  if (path.includes('/grpc')) return 'grpc';
  if (path.includes('/postman')) return 'postman';
  if (path.includes('/swagger') || path.includes('/openapi')) return 'openapi';
  return 'rest';
};

// Flush analytics queue
const flushAnalytics = async () => {
  if (analyticsQueue.length === 0) return;

  const events = [...analyticsQueue];
  analyticsQueue.length = 0;

  try {
    // In production, send to analytics endpoint
    if (process.env.ANALYTICS_ENDPOINT) {
      const response = await fetch(process.env.ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.ANALYTICS_API_KEY
        },
        body: JSON.stringify({
          events,
          source: 'backend',
          environment: process.env.NODE_ENV
        })
      });

      if (!response.ok) {
        console.error('Failed to send analytics:', response.statusText);
      }
    } else if (process.env.NODE_ENV === 'development') {
      // Log to console in development
      console.log('Analytics Events:', events);
    }
  } catch (error) {
    console.error('Error sending analytics:', error);
  }
};

// Start flush timer
const startFlushTimer = () => {
  if (flushTimer) return;
  
  flushTimer = setInterval(() => {
    flushAnalytics();
  }, 30000); // Flush every 30 seconds
};

// Analytics middleware
const analyticsMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Start flush timer on first request
  if (!flushTimer) {
    startFlushTimer();
  }

  // Capture response
  const originalSend = res.send;
  const originalJson = res.json;

  res.send = function(data) {
    res.send = originalSend;
    res.send(data);
    trackRequest();
  };

  res.json = function(data) {
    res.json = originalJson;
    res.json(data);
    trackRequest();
  };

  const trackRequest = () => {
    const responseTime = Date.now() - startTime;
    const event = createAnalyticsEvent(req, res, responseTime);
    
    // Add to queue
    analyticsQueue.push(event);

    // Flush if queue is getting large
    if (analyticsQueue.length >= 100) {
      flushAnalytics();
    }

    // Track slow requests
    if (responseTime > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${responseTime}ms`);
    }
  };

  next();
};

// API usage statistics middleware
const apiUsageStats = () => {
  const stats = {
    totalRequests: 0,
    requestsByMethod: {},
    requestsByPath: {},
    requestsByStatus: {},
    averageResponseTime: 0,
    totalResponseTime: 0
  };

  return (req, res, next) => {
    const startTime = Date.now();

    // Increment counters
    stats.totalRequests++;
    stats.requestsByMethod[req.method] = (stats.requestsByMethod[req.method] || 0) + 1;
    stats.requestsByPath[req.path] = (stats.requestsByPath[req.path] || 0) + 1;

    // Capture response
    const originalSend = res.send;
    const originalJson = res.json;

    const captureResponse = () => {
      const responseTime = Date.now() - startTime;
      stats.totalResponseTime += responseTime;
      stats.averageResponseTime = stats.totalResponseTime / stats.totalRequests;
      stats.requestsByStatus[res.statusCode] = (stats.requestsByStatus[res.statusCode] || 0) + 1;
    };

    res.send = function(data) {
      res.send = originalSend;
      res.send(data);
      captureResponse();
    };

    res.json = function(data) {
      res.json = originalJson;
      res.json(data);
      captureResponse();
    };

    // Attach stats to request for access in routes
    req.apiStats = stats;

    next();
  };
};

// Performance tracking middleware
const performanceTracking = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  
  // Set the performance header before the response is sent
  const originalSend = res.send;
  res.send = function(data) {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    // Set performance header before sending response
    res.set('X-Response-Time', `${duration.toFixed(2)}ms`);
    
    // Log slow requests
    if (duration > 500) {
      console.log(`Performance Warning: ${req.method} ${req.path} took ${duration.toFixed(2)}ms`);
    }
    
    // Call original send
    return originalSend.call(this, data);
  };
  
  // Also handle res.json
  const originalJson = res.json;
  res.json = function(data) {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    // Set performance header before sending response
    res.set('X-Response-Time', `${duration.toFixed(2)}ms`);
    
    // Log slow requests
    if (duration > 500) {
      console.log(`Performance Warning: ${req.method} ${req.path} took ${duration.toFixed(2)}ms`);
    }
    
    // Call original json
    return originalJson.call(this, data);
  };
  
  next();
};

// Repository access tracking
const trackRepositoryAccess = (req, res, next) => {
  const repository = extractRepository(req.path);
  
  if (repository) {
    const event = {
      type: 'repository_access',
      repository,
      action: req.method,
      path: req.path,
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    };
    
    analyticsQueue.push(event);
  }
  
  next();
};

// Export middleware and utilities
module.exports = {
  analyticsMiddleware,
  apiUsageStats,
  performanceTracking,
  trackRepositoryAccess,
  flushAnalytics,
  getAnalyticsQueue: () => [...analyticsQueue]
};