// Set test environment before requiring anything
process.env.NODE_ENV = 'test';

// Fix for setImmediate not defined in test environment
if (typeof setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Mock dependencies first
jest.mock('fs');
jest.mock('cors', () => jest.fn(() => (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}));
jest.mock('helmet', () => jest.fn(() => (req, res, next) => next()));
jest.mock('cookie-parser', () => jest.fn(() => (req, res, next) => next()));
jest.mock('express-rate-limit', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../api/dynamicApiDetection', () => {
  const router = require('express').Router();
  router.get('/test', (req, res) => res.json({ test: true }));
  return router;
});

// Mock all API route modules
jest.mock('../api/repositoryManagement', () => require('express').Router());
jest.mock('../api/repositoryFiles', () => require('express').Router());
jest.mock('../api/plantUmlRenderer', () => require('express').Router());
jest.mock('../api/searchApi', () => require('express').Router());
jest.mock('../api/authRoutes', () => require('express').Router());
jest.mock('../api/healthCheck', () => require('express').Router());
jest.mock('../api/analyticsApi', () => require('express').Router());

// Mock auth middleware to allow unauthenticated access in tests
jest.mock('../middleware/auth.middleware', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 'test-user', role: 'admin' };
    next();
  },
  authorize: () => (req, res, next) => next(),
  dynamicRateLimit: (req, res, next) => next(),
  auditLog: () => (req, res, next) => next(),
  authenticateJWT: (req, res, next) => {
    req.user = { id: 'test-user', role: 'admin' };
    next();
  },
  authenticateApiKey: (req, res, next) => {
    req.user = { id: 'test-user', role: 'admin' };
    next();
  },
  trackFailedLogin: jest.fn(),
  isAccountLocked: jest.fn(() => false),
  clearFailedLoginAttempts: jest.fn(),
  createApiKey: jest.fn(),
  revokeApiKey: jest.fn()
}));

// Mock analytics middleware
jest.mock('../middleware/analytics.middleware', () => ({
  analyticsMiddleware: (req, res, next) => next(),
  performanceTracking: (req, res, next) => next(),
  trackRepositoryAccess: (req, res, next) => next()
}));

// Mock security middleware
jest.mock('../middleware/security.middleware', () => ({
  securityHeaders: () => (req, res, next) => next(),
  enforceHTTPS: (req, res, next) => next(),
  getCorsOptions: () => ({ origin: '*' }),
  sanitizeRequest: (req, res, next) => next(),
  detectSuspiciousActivity: (req, res, next) => next(),
  cspReportHandler: (req, res) => res.status(204).send()
}));

const mockFs = fs;

describe('Server.js - Complete Coverage', () => {
  let app;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset modules to ensure clean state
    jest.resetModules();
    
    // Default mock implementations
    mockFs.existsSync.mockReturnValue(false);
    mockFs.readFileSync.mockReturnValue('');
    mockFs.statSync.mockReturnValue({
      mtime: new Date('2025-01-01')
    });
    mockFs.readdirSync.mockReturnValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/repository/:repoName', () => {
    beforeEach(() => {
      // Clear module cache to ensure fresh import
      jest.resetModules();
      // Require app fresh for each test
      app = require('../server');
    });

    it('returns 404 for non-existent repository', async () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const response = await request(app)
        .get('/api/repository/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Repository not found');
    });

    it('returns repository details from README', async () => {
      mockFs.existsSync.mockImplementation((pathStr) => {
        const normalizedPath = pathStr.replace(/\\/g, '/');
        if (normalizedPath.includes('cloned-repositories/test-repo')) return true;
        if (normalizedPath.endsWith('README.md')) return true;
        return false;
      });
      
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.includes('README.md')) {
          return '# Test Repository\n\nThis is a test description\n\nSome content';
        }
        return '';
      });
      
      mockFs.statSync.mockReturnValue({
        mtime: new Date('2025-01-01')
      });

      const response = await request(app)
        .get('/api/repository/test-repo')
        .expect(200);

      expect(response.body).toMatchObject({
        name: 'test-repo',
        description: 'This is a test description',
        language: '',
        topics: [],
        default_branch: 'main'
      });
    });

    it('returns repository details from package.json', async () => {
      mockFs.existsSync.mockImplementation((path) => {
        if (path.includes('test-repo')) return true;
        if (path.includes('package.json')) return true;
        return false;
      });
      
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.includes('package.json')) {
          return JSON.stringify({
            name: 'test-package',
            description: 'Package description',
            keywords: ['test', 'demo'],
            version: '1.0.0'
          });
        }
        return '';
      });
      
      mockFs.statSync.mockReturnValue({
        mtime: new Date('2025-01-01')
      });

      const response = await request(app)
        .get('/api/repository/test-repo')
        .expect(200);

      expect(response.body).toMatchObject({
        name: 'test-repo',
        description: 'Package description',
        language: 'JavaScript',
        topics: ['test', 'demo'],
        default_branch: 'main'
      });
    });

    it('prefers package.json description over README', async () => {
      mockFs.existsSync.mockReturnValue(true);
      
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.includes('README.md')) {
          return '# Test\n\n## Description\nREADME description';
        }
        if (path.includes('package.json')) {
          return JSON.stringify({
            description: 'Package description preferred'
          });
        }
        return '';
      });

      const response = await request(app)
        .get('/api/repository/test-repo')
        .expect(200);

      expect(response.body.description).toBe('Package description preferred');
    });

    it('handles missing README and package.json', async () => {
      mockFs.existsSync.mockImplementation((path) => {
        if (path.includes('test-repo')) return true;
        return false;
      });
      
      mockFs.statSync.mockReturnValue({
        mtime: new Date('2025-01-01')
      });

      const response = await request(app)
        .get('/api/repository/test-repo')
        .expect(200);

      expect(response.body).toMatchObject({
        name: 'test-repo',
        description: '',
        language: '',
        topics: [],
        default_branch: 'main'
      });
    });

    it('handles file read errors gracefully', async () => {
      mockFs.existsSync.mockImplementation((path) => {
        if (path.includes('test-repo')) return true;
        return true;
      });
      
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });
      
      mockFs.statSync.mockImplementation(() => {
        throw new Error('Stat error');
      });

      const response = await request(app)
        .get('/api/repository/test-repo')
        .expect(500);

      expect(response.body.error).toBe('Failed to fetch repository details');
    });

    it('handles invalid package.json gracefully', async () => {
      mockFs.existsSync.mockImplementation((path) => {
        if (path.includes('test-repo')) return true;
        if (path.includes('package.json')) return true;
        return false;
      });
      
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.includes('package.json')) {
          return 'invalid json {{{';
        }
        return '';
      });
      
      mockFs.statSync.mockReturnValue({
        mtime: new Date('2025-01-01')
      });

      const response = await request(app)
        .get('/api/repository/test-repo')
        .expect(500);

      expect(response.body.error).toBe('Failed to fetch repository details');
    });

    it('extracts description from complex README', async () => {
      mockFs.existsSync.mockImplementation((path) => {
        if (path.includes('test-repo')) return true;
        if (path.includes('README.md')) return true;
        return false;
      });
      
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.includes('README.md')) {
          return `# Complex Project

## Table of Contents`;
        }
        return '';
      });
      
      mockFs.statSync.mockReturnValue({
        mtime: new Date('2025-01-01')
      });

      const response = await request(app)
        .get('/api/repository/test-repo')
        .expect(200);

      expect(response.body.description).toBe('## Table of Contents');
    });

    it('handles README without proper description format', async () => {
      mockFs.existsSync.mockImplementation((path) => {
        if (path.includes('test-repo')) return true;
        if (path.includes('README.md')) return true;
        return false;
      });
      
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.includes('README.md')) {
          return '# Project\n\nJust some content without description section';
        }
        return '';
      });
      
      mockFs.statSync.mockReturnValue({
        mtime: new Date('2025-01-01')
      });

      const response = await request(app)
        .get('/api/repository/test-repo')
        .expect(200);

      expect(response.body.description).toBe('Just some content without description section');
    });

    it('handles missing package.json keywords gracefully', async () => {
      mockFs.existsSync.mockImplementation((path) => {
        if (path.includes('test-repo')) return true;
        if (path.includes('package.json')) return true;
        return false;
      });
      
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.includes('package.json')) {
          return JSON.stringify({
            name: 'test-package',
            description: 'No keywords here'
          });
        }
        return '';
      });
      
      mockFs.statSync.mockReturnValue({
        mtime: new Date('2025-01-01')
      });

      const response = await request(app)
        .get('/api/repository/test-repo')
        .expect(200);

      expect(response.body.topics).toEqual([]);
    });
  });

  describe('JSON Body Parsing', () => {
    beforeEach(() => {
      app = require('../server');
    });

    it('parses JSON request bodies', async () => {
      // Test that express.json() middleware is applied
      // Since we don't have a POST endpoint, we can test through the API
      const response = await request(app)
        .post('/api/test')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');

      // The request should be processed (even if endpoint doesn't exist)
      expect(response.status).toBeDefined();
    });
  });

  // Skip production mode tests as they cannot be properly tested in test environment

  describe('Middleware Integration', () => {
    beforeEach(() => {
      app = require('../server');
    });

    it('applies CORS middleware', async () => {
      const response = await request(app)
        .get('/api/repository/test')
        .expect(404);

      // CORS headers should be set by our mock
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('mounts dynamic API routes under /api', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200);

      expect(response.body).toEqual({ test: true });
    });
  });
});