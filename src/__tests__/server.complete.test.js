/**
 * Complete test coverage for server.js
 */

const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Mock all dependencies before requiring anything else
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

// Store original values
const originalEnv = process.env.NODE_ENV;
const originalPort = process.env.PORT;
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Server.js - Complete Coverage', () => {
  let app;
  let server;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    jest.resetModules();
    
    // Reset environment
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    
    // Mock console
    console.log = jest.fn();
    console.error = jest.fn();
    
    // Default mock implementations
    fs.existsSync = jest.fn().mockReturnValue(true);
    fs.readFileSync = jest.fn().mockReturnValue('{}');
    fs.statSync = jest.fn().mockReturnValue({ mtime: new Date() });
  });

  afterEach(() => {
    // Restore environment
    process.env.NODE_ENV = originalEnv;
    if (originalPort) {
      process.env.PORT = originalPort;
    } else {
      delete process.env.PORT;
    }
    
    // Restore console
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    
    // Close server if running
    if (server && server.listening) {
      server.close();
    }
  });

  describe('Server Initialization', () => {
    it('starts server on default port 3001', () => {
      app = require('../server');
      
      expect(console.log).toHaveBeenCalledWith(
        'EYNS AI Experience Center backend running on port 3001'
      );
    });

    it('uses PORT environment variable when set', () => {
      process.env.PORT = '4000';
      jest.resetModules();
      
      app = require('../server');
      
      expect(console.log).toHaveBeenCalledWith(
        'EYNS AI Experience Center backend running on port 4000'
      );
    });
  });

  describe('GET /api/repository/:repoName', () => {
    beforeEach(() => {
      app = require('../server');
    });

    it('returns 404 for non-existent repository', async () => {
      fs.existsSync.mockReturnValue(false);

      const response = await request(app)
        .get('/api/repository/non-existent')
        .expect(404);

      expect(response.body).toEqual({
        error: 'Repository not found'
      });
    });

    it('returns repository details with README description', async () => {
      fs.existsSync.mockImplementation((path) => {
        return path.includes('test-repo') || path.includes('README.md');
      });
      
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('README.md')) {
          return '# Test Repository\n\nThis is a test description.';
        }
        return '{}';
      });
      
      fs.statSync.mockReturnValue({
        mtime: new Date('2025-01-15T10:00:00Z')
      });

      const response = await request(app)
        .get('/api/repository/test-repo')
        .expect(200);
      
      expect(response.body).toMatchObject({
        name: 'test-repo',
        description: 'This is a test description.',
        language: '',
        topics: [],
        updated_at: '2025-01-15T10:00:00.000Z',
        default_branch: 'main',
        stargazers_count: 0,
        forks_count: 0
      });
    });

    it('extracts description from package.json', async () => {
      fs.existsSync.mockImplementation((path) => {
        if (path.includes('js-repo')) return true;
        if (path.includes('README.md')) return false;
        if (path.includes('package.json')) return true;
        return false;
      });
      
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('package.json')) {
          return JSON.stringify({
            description: 'Package description',
            keywords: ['test', 'javascript']
          });
        }
        return '{}';
      });
      
      fs.statSync.mockReturnValue({
        mtime: new Date('2025-01-10T08:00:00Z')
      });

      const response = await request(app)
        .get('/api/repository/js-repo')
        .expect(200);
      
      expect(response.body).toMatchObject({
        name: 'js-repo',
        description: 'Package description',
        language: 'JavaScript',
        topics: ['test', 'javascript']
      });
    });

    it('handles invalid package.json gracefully', async () => {
      fs.existsSync.mockImplementation((path) => {
        return path.includes('invalid-repo') || path.includes('package.json');
      });
      
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('package.json')) {
          return 'invalid json';
        }
        return '{}';
      });
      
      fs.statSync.mockReturnValue({ mtime: new Date() });

      const response = await request(app)
        .get('/api/repository/invalid-repo')
        .expect(500);
      
      expect(response.body.error).toBe('Failed to fetch repository details');
    });

    it('handles errors gracefully', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.statSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const response = await request(app)
        .get('/api/repository/error-repo')
        .expect(500);
      
      expect(response.body).toEqual({ 
        error: 'Failed to fetch repository details' 
      });
      
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching repository details:',
        expect.any(Error)
      );
    });

    it('handles README without description', async () => {
      fs.existsSync.mockImplementation((path) => {
        return path.includes('no-desc') || path.includes('README.md');
      });
      
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('README.md')) {
          return '# Title Only\nNo description here';
        }
        return '{}';
      });
      
      fs.statSync.mockReturnValue({ mtime: new Date() });

      const response = await request(app)
        .get('/api/repository/no-desc')
        .expect(200);
      
      expect(response.body.description).toBe('');
    });

    it('handles package.json without description', async () => {
      fs.existsSync.mockImplementation((path) => {
        return path.includes('no-desc-pkg') || path.includes('package.json');
      });
      
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('package.json')) {
          return JSON.stringify({ name: 'test' });
        }
        return '{}';
      });
      
      fs.statSync.mockReturnValue({ mtime: new Date() });

      const response = await request(app)
        .get('/api/repository/no-desc-pkg')
        .expect(200);
      
      expect(response.body.description).toBe('');
    });

    it('handles missing keywords in package.json', async () => {
      fs.existsSync.mockImplementation((path) => {
        return path.includes('no-keywords') || path.includes('package.json');
      });
      
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('package.json')) {
          return JSON.stringify({
            description: 'No keywords package'
          });
        }
        return '{}';
      });
      
      fs.statSync.mockReturnValue({ mtime: new Date() });

      const response = await request(app)
        .get('/api/repository/no-keywords')
        .expect(200);
      
      expect(response.body.topics).toEqual([]);
    });

    it('prefers package.json description over README', async () => {
      fs.existsSync.mockImplementation((path) => {
        return path.includes('both-repo') || path.includes('README.md') || path.includes('package.json');
      });
      
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('README.md')) {
          return '# Both Repo\n\nREADME description';
        }
        if (path.includes('package.json')) {
          return JSON.stringify({
            description: 'Package.json description'
          });
        }
        return '{}';
      });
      
      fs.statSync.mockReturnValue({ mtime: new Date() });

      const response = await request(app)
        .get('/api/repository/both-repo')
        .expect(200);
      
      expect(response.body.description).toBe('Package.json description');
    });

    it('extracts description from complex README', async () => {
      fs.existsSync.mockImplementation((path) => {
        return path.includes('complex-readme') || path.includes('README.md');
      });
      
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('README.md')) {
          return `# Complex Repository

This is the main description that should be extracted.

## Features
- Feature 1
- Feature 2`;
        }
        return '{}';
      });
      
      fs.statSync.mockReturnValue({ mtime: new Date() });

      const response = await request(app)
        .get('/api/repository/complex-readme')
        .expect(200);
      
      expect(response.body.description).toBe('This is the main description that should be extracted.');
    });
  });

  describe('Production Mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
    });

    it('serves static files in production', () => {
      const express = require('express');
      const mockStatic = jest.fn(() => 'static-middleware');
      express.static = mockStatic;
      
      app = require('../server');
      
      expect(mockStatic).toHaveBeenCalledWith(
        expect.stringContaining('build')
      );
    });

    it('handles SPA routing in production', () => {
      // Mock express to capture route handlers
      let wildcardHandler;
      const mockApp = {
        use: jest.fn(),
        get: jest.fn((path, handler) => {
          if (path === '*') {
            wildcardHandler = handler;
          }
        }),
        listen: jest.fn((port, cb) => {
          if (cb) cb();
        })
      };
      
      jest.doMock('express', () => {
        const exp = jest.fn(() => mockApp);
        exp.json = jest.fn(() => 'json-middleware');
        exp.static = jest.fn(() => 'static-middleware');
        exp.Router = jest.fn(() => require('express').Router());
        return exp;
      });
      
      app = require('../server');
      
      // Verify wildcard route was registered
      expect(mockApp.get).toHaveBeenCalledWith('*', expect.any(Function));
      
      // Test the wildcard handler
      const mockRes = {
        sendFile: jest.fn()
      };
      
      wildcardHandler({}, mockRes);
      
      expect(mockRes.sendFile).toHaveBeenCalledWith(
        expect.stringContaining('index.html')
      );
    });
  });

  describe('Middleware Integration', () => {
    beforeEach(() => {
      app = require('../server');
    });

    it('applies CORS middleware', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200);
      
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('mounts dynamic API routes under /api', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200);
      
      expect(response.body).toEqual({ test: true });
    });

    it('parses JSON request bodies', async () => {
      app.post('/api/echo', (req, res) => {
        res.json(req.body);
      });

      const response = await request(app)
        .post('/api/echo')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json')
        .expect(200);
      
      expect(response.body).toEqual({ test: 'data' });
    });
  });

  describe('Error Scenarios', () => {
    beforeEach(() => {
      app = require('../server');
    });

    it('handles file read errors in package.json parsing', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Read error');
      });
      fs.statSync.mockReturnValue({ mtime: new Date() });

      const response = await request(app)
        .get('/api/repository/read-error')
        .expect(500);
      
      expect(response.body.error).toBe('Failed to fetch repository details');
    });

    it('handles stat errors', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.statSync.mockImplementation(() => {
        throw new Error('Stat error');
      });

      const response = await request(app)
        .get('/api/repository/stat-error')
        .expect(500);
      
      expect(response.body.error).toBe('Failed to fetch repository details');
    });
  });

  describe('Module Exports', () => {
    it('exports the Express app', () => {
      app = require('../server');
      expect(app).toBeDefined();
      expect(typeof app.listen).toBe('function');
      expect(typeof app.use).toBe('function');
    });
  });
});