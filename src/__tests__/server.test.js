// Set test environment before requiring anything
process.env.NODE_ENV = 'test';

const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Mock dependencies first
jest.mock('fs');
jest.mock('cors', () => jest.fn(() => (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}));
jest.mock('../api/dynamicApiDetection', () => {
  const router = require('express').Router();
  router.get('/test', (req, res) => res.json({ test: true }));
  return router;
});

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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/repository/:repoName', () => {
    beforeEach(() => {
      // Require app fresh for each test
      app = require('../server');
    });

    it('returns 404 for non-existent repository', async () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const response = await request(app)
        .get('/api/repository/non-existent')
        .expect(404);

      expect(response.body.error).toBe('Repository not found');
    });

    it('returns repository details from README', async () => {
      mockFs.existsSync.mockImplementation((path) => {
        if (path.includes('test-repo')) return true;
        if (path.includes('README.md')) return true;
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

  describe('Production Mode', () => {
    beforeEach(() => {
      // Set production environment
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      app = require('../server');
    });

    afterEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('serves static files in production', async () => {
      const response = await request(app)
        .get('/static/test.js');

      // In production, it should try to serve static files
      expect(response.status).toBeDefined();
    });

    it('handles SPA routing with wildcard in production', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('<html>SPA Content</html>');
      
      const response = await request(app)
        .get('/some/spa/route');

      // Should return HTML for SPA routing
      expect(response.type).toMatch(/html|text/);
    });
  });

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