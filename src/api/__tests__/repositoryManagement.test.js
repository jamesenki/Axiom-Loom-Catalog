const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const repositoryManagementRoutes = require('../repositoryManagement');

// Create test app
const app = express();
app.use(express.json());
app.use('/api', repositoryManagementRoutes);

// Mock dependencies
jest.mock('fs');
jest.mock('child_process');

const mockFs = fs;
const mockExecSync = execSync;

describe('Repository Management API', () => {
  const REPOS_CONFIG_FILE = path.join(__dirname, '../../../repositories.json');
  const CLONED_REPOS_PATH = path.join(__dirname, '../../../cloned-repositories');

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(JSON.stringify({ repositories: [] }));
    mockFs.writeFileSync.mockImplementation();
    mockFs.mkdirSync.mockImplementation();
  });

  describe('GET /api/verify-repository/:account/:repoName', () => {
    it('returns exists true for valid repository', async () => {
      mockExecSync.mockReturnValue(JSON.stringify({ name: 'test-repo' }));

      const response = await request(app)
        .get('/api/verify-repository/test-account/test-repo')
        .expect(200);

      expect(response.body).toEqual({
        exists: true,
        name: 'test-repo'
      });

      expect(mockExecSync).toHaveBeenCalledWith(
        'gh repo view test-account/test-repo --json name',
        { encoding: 'utf-8' }
      );
    });

    it('returns 404 for non-existent repository', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Could not resolve to a Repository');
      });

      const response = await request(app)
        .get('/api/verify-repository/test-account/non-existent')
        .expect(404);

      expect(response.body).toEqual({
        exists: false,
        error: 'Repository not found'
      });
    });

    it('handles GitHub CLI errors', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('gh: command not found');
      });

      const response = await request(app)
        .get('/api/verify-repository/test-account/test-repo')
        .expect(404);

      expect(response.body).toHaveProperty('exists', false);
    });
  });

  describe('POST /api/repositories/add', () => {
    it('adds new repository to configuration', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ repositories: [] }));

      const response = await request(app)
        .post('/api/repositories/add')
        .send({
          name: 'new-repo',
          account: 'test-account'
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Repository added successfully',
        repository: {
          name: 'new-repo',
          account: 'test-account'
        }
      });

      // Check that config was updated
      const writeCall = mockFs.writeFileSync.mock.calls[0];
      expect(writeCall[0]).toBe(REPOS_CONFIG_FILE);
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.repositories).toHaveLength(1);
      expect(writtenData.repositories[0]).toMatchObject({
        name: 'new-repo',
        account: 'test-account',
        status: 'pending_sync'
      });
    });

    it('returns 400 for missing parameters', async () => {
      const response = await request(app)
        .post('/api/repositories/add')
        .send({ name: 'test-repo' }) // Missing account
        .expect(400);

      expect(response.body).toEqual({
        error: 'Repository name and account are required'
      });
    });

    it('returns 409 for duplicate repository', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        repositories: [{
          name: 'existing-repo',
          account: 'test-account'
        }]
      }));

      const response = await request(app)
        .post('/api/repositories/add')
        .send({
          name: 'existing-repo',
          account: 'test-account'
        })
        .expect(409);

      expect(response.body).toEqual({
        error: 'Repository already exists in configuration'
      });
    });

    it('handles file system errors', async () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });

      const response = await request(app)
        .post('/api/repositories/add')
        .send({
          name: 'test-repo',
          account: 'test-account'
        })
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to add repository to configuration'
      });
    });
  });

  describe('POST /api/sync-repository/:repoName', () => {
    beforeEach(() => {
      mockFs.readFileSync.mockImplementation((path) => {
        if (path === REPOS_CONFIG_FILE) {
          return JSON.stringify({
            repositories: [{
              name: 'test-repo',
              account: 'test-account',
              status: 'pending_sync'
            }]
          });
        }
        return '';
      });
    });

    it('clones new repository', async () => {
      mockFs.existsSync.mockImplementation((path) => {
        if (path === REPOS_CONFIG_FILE) return true;
        if (path === CLONED_REPOS_PATH) return true;
        if (path.includes('test-repo')) return false; // Repo doesn't exist yet
        return true;
      });

      const response = await request(app)
        .post('/api/sync-repository/test-repo')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Repository test-repo synced successfully'
      });

      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('gh repo clone test-account/test-repo'),
        { stdio: 'inherit' }
      );
    });

    it('updates existing repository', async () => {
      mockFs.existsSync.mockReturnValue(true); // All paths exist

      const response = await request(app)
        .post('/api/sync-repository/test-repo')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Repository test-repo synced successfully'
      });

      expect(mockExecSync).toHaveBeenCalledWith(
        'git fetch --all',
        expect.objectContaining({ cwd: expect.stringContaining('test-repo') })
      );

      expect(mockExecSync).toHaveBeenCalledWith(
        'git pull origin main || git pull origin master',
        expect.objectContaining({ cwd: expect.stringContaining('test-repo') })
      );
    });

    it('returns 404 for unknown repository', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ repositories: [] }));

      const response = await request(app)
        .post('/api/sync-repository/unknown-repo')
        .expect(404);

      expect(response.body).toEqual({
        error: 'Repository not found in configuration'
      });
    });

    it('creates cloned repositories directory if needed', async () => {
      mockFs.existsSync.mockImplementation((path) => {
        if (path === REPOS_CONFIG_FILE) return true;
        if (path === CLONED_REPOS_PATH) return false; // Directory doesn't exist
        return false;
      });

      await request(app)
        .post('/api/sync-repository/test-repo')
        .expect(200);

      expect(mockFs.mkdirSync).toHaveBeenCalledWith(
        CLONED_REPOS_PATH,
        { recursive: true }
      );
    });

    it('updates repository status after sync', async () => {
      mockFs.existsSync.mockReturnValue(true);

      await request(app)
        .post('/api/sync-repository/test-repo')
        .expect(200);

      // Check that status was updated
      const writeCall = mockFs.writeFileSync.mock.calls[0];
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.repositories[0]).toMatchObject({
        name: 'test-repo',
        status: 'synced'
      });
      expect(writtenData.repositories[0].lastSynced).toBeDefined();
    });

    it('handles sync errors', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockExecSync.mockImplementation(() => {
        throw new Error('fatal: Authentication failed');
      });

      const response = await request(app)
        .post('/api/sync-repository/test-repo')
        .expect(500);

      expect(response.body).toMatchObject({
        error: 'Failed to sync repository',
        details: 'fatal: Authentication failed'
      });
    });
  });

  describe('GET /api/repositories/configured', () => {
    it('returns list of configured repositories', async () => {
      const mockRepos = [
        {
          name: 'repo1',
          account: 'test-account',
          status: 'synced',
          addedAt: '2025-01-01T00:00:00.000Z'
        },
        {
          name: 'repo2',
          account: 'test-account',
          status: 'pending_sync',
          addedAt: '2025-01-02T00:00:00.000Z'
        }
      ];

      mockFs.readFileSync.mockReturnValue(JSON.stringify({ repositories: mockRepos }));

      const response = await request(app)
        .get('/api/repositories/configured')
        .expect(200);

      expect(response.body).toEqual(mockRepos);
    });

    it('returns empty array when no repositories configured', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ repositories: [] }));

      const response = await request(app)
        .get('/api/repositories/configured')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('handles file read errors', async () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file');
      });

      const response = await request(app)
        .get('/api/repositories/configured')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to read configuration'
      });
    });
  });

  describe('Configuration file initialization', () => {
    it('creates config file if it does not exist', () => {
      // Clear module cache to test initialization
      jest.resetModules();
      
      mockFs.existsSync.mockReturnValue(false);
      mockFs.writeFileSync.mockImplementation();

      // Re-require the module to trigger initialization
      require('../repositoryManagement');

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('repositories.json'),
        JSON.stringify({ repositories: [] }, null, 2)
      );
    });
  });
});