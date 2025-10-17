/**
 * Security Middleware for Express
 * Implements security headers, HTTPS enforcement, and CORS
 */

const helmet = require('helmet');

// Content Security Policy configuration
const getCSPDirectives = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for React in development
      "'unsafe-eval'", // Required for React DevTools
      "https://cdn.jsdelivr.net", // For external libraries
      "https://unpkg.com",
      isDevelopment && "http://localhost:*"
    ].filter(Boolean),
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for styled-components
      "https://fonts.googleapis.com",
      "https://cdn.jsdelivr.net"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "blob:",
      "https:",
      isDevelopment && "http://localhost:*"
    ].filter(Boolean),
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    connectSrc: [
      "'self'",
      "https://api.axiom-loom.ai", // Axiom Loom API endpoints
      "https://login.axiom-loom.ai", // Axiom Loom SSO
      isDevelopment && "http://localhost:*",
      isDevelopment && "ws://localhost:*" // WebSocket for hot reload
    ].filter(Boolean),
    mediaSrc: ["'self'"],
    objectSrc: ["'none'"],
    childSrc: ["'self'"],
    frameSrc: ["'self'", "https://login.axiom-loom.ai"], // For SSO iframe
    workerSrc: ["'self'", "blob:"],
    formAction: ["'self'"],
    baseUri: ["'self'"],
    manifestSrc: ["'self'"],
    upgradeInsecureRequests: !isDevelopment ? [] : null
  };
};

// Security headers middleware
const securityHeaders = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: getCSPDirectives()
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'deny' },
    permittedCrossDomainPolicies: false,
    hidePoweredBy: true,
    crossOriginEmbedderPolicy: false, // Set to false to allow embedding of external resources
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  });
};

// HTTPS enforcement middleware
const enforceHTTPS = (req, res, next) => {
  // Skip in development, test environments, and when BYPASS_AUTH is enabled
  if (process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test' ||
      process.env.BYPASS_AUTH === 'true') {
    return next();
  }

  // Check if request is already HTTPS
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }

  // Redirect to HTTPS
  res.redirect(301, `https://${req.hostname}${req.url}`);
};

// Enhanced CORS configuration
const getCorsOptions = () => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://10.0.0.109:3000',
    'http://10.0.0.109:3001',
    'http://0.0.0.0:3000',
    'http://0.0.0.0:3001',
    'https://axiom-loom.ai',
    process.env.FRONTEND_URL,
    process.env.PUBLIC_URL
  ].filter(Boolean);
  
  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-Key',
      'X-Requested-With',
      'Accept',
      'Origin',
      'x-dev-mode'
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Page-Count',
      'X-Current-Page',
      'X-Rate-Limit-Remaining'
    ],
    maxAge: 86400 // 24 hours
  };
};

// Request sanitization middleware
const sanitizeRequest = (req, res, next) => {
  // Remove any potentially dangerous characters from common fields
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // Basic XSS prevention
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, ''); // Remove event handlers with quotes
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };
  
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  
  next();
};

// Security event logging
const logSecurityEvent = (eventType, details) => {
  const event = {
    timestamp: new Date().toISOString(),
    type: eventType,
    details: details,
    severity: getSeverity(eventType)
  };
  
  // In production, send to security monitoring service
  console.error('SECURITY_EVENT:', JSON.stringify(event));
  
  // You could also emit events for real-time monitoring
  // eventEmitter.emit('security-event', event);
};

// Get severity level for security events
const getSeverity = (eventType) => {
  const severityMap = {
    'unauthorized_access': 'high',
    'invalid_token': 'medium',
    'rate_limit_exceeded': 'low',
    'suspicious_request': 'high',
    'cors_violation': 'medium',
    'csp_violation': 'medium',
    'sql_injection_attempt': 'critical',
    'xss_attempt': 'high'
  };
  
  return severityMap[eventType] || 'low';
};

// Detect suspicious requests
const detectSuspiciousActivity = (req, res, next) => {
  const suspicious = [];
  
  // Check for SQL injection patterns
  const sqlInjectionPattern = /(\b(union|select|insert|update|delete|drop|create)\b)|(-{2})|(\b(or|and)\b\s*\d+\s*=\s*\d+)/i;
  const checkString = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.params);
  
  if (sqlInjectionPattern.test(checkString)) {
    suspicious.push('Potential SQL injection attempt');
  }
  
  // Check for path traversal in all possible URL properties
  // Note: req.originalUrl contains the raw URL before any normalization
  const rawUrl = req.originalUrl || req.url || '';
  if (rawUrl.includes('../') || rawUrl.includes('..\\')) {
    suspicious.push('Path traversal attempt');
  }
  
  // Check for unusual user agents
  const userAgent = req.get('user-agent') || '';
  if (userAgent.includes('sqlmap') || userAgent.includes('nikto') || userAgent.includes('scanner')) {
    suspicious.push('Suspicious user agent detected');
  }
  
  if (suspicious.length > 0) {
    logSecurityEvent('suspicious_request', {
      ip: req.ip,
      method: req.method,
      path: req.path,
      reasons: suspicious,
      headers: req.headers
    });
    
    // You might want to block the request
    // return res.status(403).json({ error: 'Forbidden' });
  }
  
  next();
};

// CSP violation reporting endpoint
const cspReportHandler = (req, res) => {
  if (req.body && req.body['csp-report']) {
    logSecurityEvent('csp_violation', {
      report: req.body['csp-report'],
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  }
  res.status(204).end();
};

module.exports = {
  securityHeaders,
  enforceHTTPS,
  getCorsOptions,
  sanitizeRequest,
  detectSuspiciousActivity,
  cspReportHandler,
  logSecurityEvent
};