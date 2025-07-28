/**
 * Additional tests for server.js to achieve 100% coverage
 */

const path = require('path');
const fs = require('fs');

// Mock all dependencies before requiring server
jest.mock('express', () => {
  const mockApp = {
    use: jest.fn(),
    get: jest.fn(),
    listen: jest.fn((port, cb) => cb && cb())
  };
  const express = jest.fn(() => mockApp);
  express.json = jest.fn(() => 'json-middleware');
  express.static = jest.fn(() => 'static-middleware');
  return express;
});

jest.mock('cors', () => jest.fn(() => 'cors-middleware'));
jest.mock('fs');
jest.mock('../api/dynamicApiDetection', () => 'mock-api-routes');

// Mock console.log to prevent output during tests
const originalConsoleLog = console.log;
console.log = jest.fn();

describe('server.js - Complete Coverage', () => {
  let mockApp;
  let express;
  let cors;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset modules to ensure clean state
    jest.resetModules();
    
    // Get mocked modules
    express = require('express');
    cors = require('cors');
    mockApp = express();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  const requireServer = () => {
    return require('../server');
  };

  it('sets up middleware correctly', () => {
    requireServer();

    expect(cors).toHaveBeenCalled();
    expect(mockApp.use).toHaveBeenCalledWith('cors-middleware');
    expect(express.json).toHaveBeenCalled();
    expect(mockApp.use).toHaveBeenCalledWith('json-middleware');
    expect(mockApp.use).toHaveBeenCalledWith('/api', 'mock-api-routes');
  });

  it('sets up repository details endpoint', () => {
    requireServer();

    const getCall = mockApp.get.mock.calls.find(
      call => call[0] === '/api/repository/:repoName'
    );
    expect(getCall).toBeDefined();
  });

  it('handles repository not found', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    mockExistsSync.mockReturnValue(false);

    requireServer();

    const handler = mockApp.get.mock.calls.find(
      call => call[0] === '/api/repository/:repoName'
    )[1];

    const req = { params: { repoName: 'non-existent' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Repository not found' });
  });

  it('returns repository details with README description', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReadFileSync = fs.readFileSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;

    mockExistsSync.mockImplementation((path: string) => {
      if (path.includes('test-repo')) return true;
      if (path.includes('README.md')) return true;
      if (path.includes('package.json')) return false;
      return false;
    });

    mockReadFileSync.mockImplementation((path: string) => {
      if (path.includes('README.md')) {
        return '# Test Repository\n\nThis is a test description.';
      }
      return '';
    });

    mockStatSync.mockReturnValue({
      mtime: new Date('2025-01-15T10:00:00Z')
    });

    requireServer();

    const handler = mockApp.get.mock.calls.find(
      call => call[0] === '/api/repository/:repoName'
    )[1];

    const req = { params: { repoName: 'test-repo' } };
    const res = { json: jest.fn() };

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      name: 'test-repo',
      description: 'This is a test description.',
      language: '',
      topics: [],
      updated_at: new Date('2025-01-15T10:00:00Z'),
      default_branch: 'main',
      stargazers_count: 0,
      forks_count: 0
    });
  });

  it('returns repository details with package.json info', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReadFileSync = fs.readFileSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;

    mockExistsSync.mockImplementation((path: string) => {
      if (path.includes('js-repo')) return true;
      if (path.includes('README.md')) return false;
      if (path.includes('package.json')) return true;
      return false;
    });

    mockReadFileSync.mockImplementation((path: string) => {
      if (path.includes('package.json')) {
        return JSON.stringify({
          description: 'Package description',
          keywords: ['test', 'javascript']
        });
      }
      return '';
    });

    mockStatSync.mockReturnValue({
      mtime: new Date('2025-01-10T08:00:00Z')
    });

    requireServer();

    const handler = mockApp.get.mock.calls.find(
      call => call[0] === '/api/repository/:repoName'
    )[1];

    const req = { params: { repoName: 'js-repo' } };
    const res = { json: jest.fn() };

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      name: 'js-repo',
      description: 'Package description',
      language: 'JavaScript',
      topics: ['test', 'javascript'],
      updated_at: new Date('2025-01-10T08:00:00Z'),
      default_branch: 'main',
      stargazers_count: 0,
      forks_count: 0
    });
  });

  it('handles errors when fetching repository details', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;

    mockExistsSync.mockReturnValue(true);
    mockStatSync.mockImplementation(() => {
      throw new Error('Permission denied');
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    requireServer();

    const handler = mockApp.get.mock.calls.find(
      call => call[0] === '/api/repository/:repoName'
    )[1];

    const req = { params: { repoName: 'error-repo' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    handler(req, res);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching repository details:',
      expect.any(Error)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Failed to fetch repository details' 
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles README without description section', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReadFileSync = fs.readFileSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;

    mockExistsSync.mockImplementation((path: string) => {
      if (path.includes('no-desc-repo')) return true;
      if (path.includes('README.md')) return true;
      return false;
    });

    mockReadFileSync.mockImplementation((path: string) => {
      if (path.includes('README.md')) {
        return '# Title Only\nNo description here';
      }
      return '';
    });

    mockStatSync.mockReturnValue({ mtime: new Date() });

    requireServer();

    const handler = mockApp.get.mock.calls.find(
      call => call[0] === '/api/repository/:repoName'
    )[1];

    const req = { params: { repoName: 'no-desc-repo' } };
    const res = { json: jest.fn() };

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        description: ''
      })
    );
  });

  it('sets up static files in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    requireServer();

    expect(express.static).toHaveBeenCalledWith(
      expect.stringContaining('build')
    );
    expect(mockApp.use).toHaveBeenCalledWith('static-middleware');

    // Check wildcard route for SPA
    const wildcardRoute = mockApp.get.mock.calls.find(
      call => call[0] === '*'
    );
    expect(wildcardRoute).toBeDefined();

    process.env.NODE_ENV = originalEnv;
  });

  it('handles production wildcard route', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    requireServer();

    const handler = mockApp.get.mock.calls.find(
      call => call[0] === '*'
    )[1];

    const req = {};
    const res = {
      sendFile: jest.fn()
    };

    handler(req, res);

    expect(res.sendFile).toHaveBeenCalledWith(
      expect.stringContaining('index.html')
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('starts server on correct port', () => {
    requireServer();

    expect(mockApp.listen).toHaveBeenCalledWith(3001, expect.any(Function));
    expect(console.log).toHaveBeenCalledWith(
      'EYNS AI Experience Center backend running on port 3001'
    );
  });

  it('uses PORT from environment variable', () => {
    const originalPort = process.env.PORT;
    process.env.PORT = '4000';

    requireServer();

    expect(mockApp.listen).toHaveBeenCalledWith(4000, expect.any(Function));

    process.env.PORT = originalPort;
  });

  it('handles package.json without keywords', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReadFileSync = fs.readFileSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;

    mockExistsSync.mockImplementation((path: string) => {
      if (path.includes('no-keywords')) return true;
      if (path.includes('package.json')) return true;
      return false;
    });

    mockReadFileSync.mockImplementation((path: string) => {
      if (path.includes('package.json')) {
        return JSON.stringify({
          description: 'No keywords package'
        });
      }
      return '';
    });

    mockStatSync.mockReturnValue({ mtime: new Date() });

    requireServer();

    const handler = mockApp.get.mock.calls.find(
      call => call[0] === '/api/repository/:repoName'
    )[1];

    const req = { params: { repoName: 'no-keywords' } };
    const res = { json: jest.fn() };

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        topics: []
      })
    );
  });
});