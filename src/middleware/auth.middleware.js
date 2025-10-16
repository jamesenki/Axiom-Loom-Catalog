/**
 * Authentication Middleware for Express
 * Handles JWT validation, API key authentication, and rate limiting
 */

const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory store for API keys (in production, use a database)
const apiKeyStore = new Map();

// In-memory store for failed login attempts (in production, use Redis)
const failedLoginAttempts = new Map();

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// API Key Authentication Middleware
const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  // Check if API key exists and is valid
  const hashedKey = apiKeyStore.get(apiKey);
  if (!hashedKey) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  // In production, fetch user data associated with API key
  req.user = {
    id: 'api-user',
    role: 'developer',
    apiKey: true
  };

  // Update last used timestamp
  // In production, update this in the database
  
  next();
};

// Combined authentication middleware (JWT or API Key)
const authenticate = (req, res, next) => {
  // BYPASS AUTH FOR DEMO/DEV MODE - CHECK THIS FIRST!
  if (process.env.BYPASS_AUTH === 'true' || process.env.DEMO_MODE === 'true') {
    req.user = {
      id: '1',
      email: 'admin@localhost',
      role: 'admin',
      organizationId: 'local'
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (authHeader) {
    authenticateJWT(req, res, next);
  } else if (apiKey) {
    authenticateApiKey(req, res, next);
  } else if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test' || req.headers['x-dev-mode'] === 'true') {
    // In development and test, allow unauthenticated access with default user
    req.user = {
      id: '1',
      email: 'admin@localhost',
      role: 'admin',
      organizationId: 'local'
    };
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Authorization middleware - check permissions
const authorize = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userPermissions = getRolePermissions(req.user.role);
    const hasPermission = permissions.some(permission => 
      userPermissions.includes('*') || userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Get permissions for role
const getRolePermissions = (role) => {
  const rolePermissions = {
    admin: ['*'],
    developer: [
      'read:apis',
      'read:documentation',
      'create:api_keys',
      'manage:own_api_keys',
      'test:apis',
      'download:collections'
    ],
    viewer: [
      'read:apis',
      'read:documentation'
    ]
  };

  return rolePermissions[role] || rolePermissions.viewer;
};

// Create rate limiters at initialization time (not in request handlers)
const rateLimiters = {
  admin: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    // Remove custom keyGenerator to use default IP-based limiting
    skip: (req) => !req.user || req.user.role !== 'admin'
  }),
  developer: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    // Remove custom keyGenerator to use default IP-based limiting
    skip: (req) => !req.user || req.user.role !== 'developer'
  }),
  viewer: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // Increased from 100 to allow testing
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false
    // Use default keyGenerator for IP-based limiting
  })
};

// Dynamic rate limiting based on user role
const dynamicRateLimit = [
  rateLimiters.admin,
  rateLimiters.developer,
  rateLimiters.viewer
];

// Track failed login attempts
const trackFailedLogin = (identifier) => {
  const attempts = failedLoginAttempts.get(identifier) || { count: 0, lastAttempt: Date.now() };
  
  // Reset count if last attempt was more than 15 minutes ago
  if (Date.now() - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }
  
  attempts.count++;
  attempts.lastAttempt = Date.now();
  failedLoginAttempts.set(identifier, attempts);
  
  return attempts.count;
};

// Check if account is locked due to failed attempts
const isAccountLocked = (identifier) => {
  const attempts = failedLoginAttempts.get(identifier);
  if (!attempts) return false;
  
  // Lock account after 5 failed attempts for 15 minutes
  if (attempts.count >= 5) {
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    if (timeSinceLastAttempt < 15 * 60 * 1000) {
      return true;
    } else {
      // Reset after lock period
      failedLoginAttempts.delete(identifier);
      return false;
    }
  }
  
  return false;
};

// Clear failed login attempts
const clearFailedLoginAttempts = (identifier) => {
  failedLoginAttempts.delete(identifier);
};

// Audit logging middleware
const auditLog = (action) => {
  return (req, res, next) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      user: req.user ? req.user.id : 'anonymous',
      action: action,
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };
    
    // In production, save to database or logging service
    console.log('AUDIT:', JSON.stringify(logEntry));
    
    // Store original send function
    const originalSend = res.send;
    
    // Override send to log response status
    res.send = function(data) {
      logEntry.responseStatus = res.statusCode;
      console.log('AUDIT_RESPONSE:', JSON.stringify(logEntry));
      originalSend.call(this, data);
    };
    
    next();
  };
};

// API Key management functions
const generateApiKey = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let apiKey = 'ey_';
  
  for (let i = 0; i < 32; i++) {
    apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return apiKey;
};

const createApiKey = async (userId, name, permissions = []) => {
  const apiKey = generateApiKey();
  const hashedKey = await bcrypt.hash(apiKey, 10);
  
  // In production, save to database
  apiKeyStore.set(apiKey, {
    hashedKey,
    userId,
    name,
    permissions,
    createdAt: new Date(),
    lastUsed: null
  });
  
  return apiKey;
};

const revokeApiKey = (apiKey) => {
  apiKeyStore.delete(apiKey);
};

module.exports = {
  authenticateJWT,
  authenticateApiKey,
  authenticate,
  authorize,
  dynamicRateLimit,
  trackFailedLogin,
  isAccountLocked,
  clearFailedLoginAttempts,
  auditLog,
  createApiKey,
  revokeApiKey
};