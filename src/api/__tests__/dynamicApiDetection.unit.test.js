const request = require('supertest');
const express = require('express');
const dynamicApiRoutes = require('../dynamicApiDetection');

// Create test app
const app = express();
app.use('/api', dynamicApiRoutes);

// Mock the entire fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  statSync: jest.fn()
}));

// Mock child_process
jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

const fs = require('fs');
const { execSync } = require('child_process');

describe('Dynamic API Detection Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue([]);
    fs.readFileSync.mockReturnValue('');
    fs.statSync.mockReturnValue({ isDirectory: () => false, isFile: () => true });
    execSync.mockReturnValue('');
  });

  describe('GET /api/detect-apis/:repoName', () => {
    it('returns 404 for non-existent repository', async () => {
      fs.existsSync.mockReturnValue(false);

      const response = await request(app)
        .get('/api/detect-apis/non-existent-repo')
        .expect(404);

      expect(response.body).toEqual({
        error: 'Repository not found: non-existent-repo'
      });
    });

    it('returns empty API list for repository without APIs', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([]);

      const response = await request(app)
        .get('/api/detect-apis/test-repo')
        .expect(200);

      expect(response.body).toMatchObject({
        repository: 'test-repo',
        hasAnyApis: false,
        apis: {
          rest: [],
          graphql: [],
          grpc: []
        }
      });
    });

    it('handles nslabsdashboards branch switching', async () => {
      fs.existsSync.mockReturnValue(true);
      execSync.mockImplementation((cmd) => {
        if (cmd === 'git branch --show-current') {
          return 'main\n';
        }
        return '';
      });

      await request(app)
        .get('/api/detect-apis/nslabsdashboards')
        .expect(200);

      // Should attempt to switch branch
      expect(execSync).toHaveBeenCalledWith(
        'git checkout james-update',
        expect.any(Object)
      );
    });
  });

  describe('GET /api/api-count', () => {
    it('returns total API count', async () => {
      fs.existsSync.mockReturnValue(true);
      
      const response = await request(app)
        .get('/api/api-count')
        .expect(200);

      expect(response.body).toHaveProperty('count');
      expect(typeof response.body.count).toBe('number');
    });
  });
});