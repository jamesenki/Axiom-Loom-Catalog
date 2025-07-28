const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const dynamicApiRoutes = require('../dynamicApiDetection');

// Create test app
const app = express();
app.use('/api', dynamicApiRoutes);

// Mock file system
jest.mock('fs');
jest.mock('child_process');

const { execSync } = require('child_process');

describe('Dynamic API Detection Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    it('detects REST APIs in repository', async () => {
      const repoPath = path.join(__dirname, '../../../cloned-repositories/test-repo');
      
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockImplementation((dir) => {
        if (dir === repoPath) {
          return [
            { name: 'api', isDirectory: () => true, isFile: () => false },
            { name: 'README.md', isDirectory: () => false, isFile: () => true }
          ];
        }
        if (dir === path.join(repoPath, 'api')) {
          return [
            { name: 'openapi.yaml', isDirectory: () => false, isFile: () => true }
          ];
        }
        return [];
      });

      fs.readFileSync.mockImplementation((file) => {
        if (file.endsWith('openapi.yaml')) {
          return `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users`;
        }
        return '';
      });

      const response = await request(app)
        .get('/api/detect-apis/test-repo')
        .expect(200);

      expect(response.body).toMatchObject({
        repository: 'test-repo',
        hasAnyApis: true,
        apis: {
          rest: expect.arrayContaining([
            expect.objectContaining({
              file: 'api/openapi.yaml',
              title: 'Test API',
              version: '1.0.0'
            })
          ]),
          graphql: [],
          grpc: []
        },
        recommendedButtons: ['swagger', 'postman']
      });
    });

    it('detects GraphQL APIs in repository', async () => {
      const repoPath = path.join(__dirname, '../../../cloned-repositories/graphql-repo');
      
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockImplementation((dir) => {
        if (dir === repoPath) {
          return [
            { name: 'schema.graphql', isDirectory: () => false }
          ];
        }
        return [];
      });

      fs.readFileSync.mockImplementation((file) => {
        if (file.endsWith('schema.graphql')) {
          return `# User API Schema
type Query {
  users: [User!]!
}

type User {
  id: ID!
  name: String!
}`;
        }
        return '';
      });

      const response = await request(app)
        .get('/api/detect-apis/graphql-repo')
        .expect(200);

      expect(response.body).toMatchObject({
        repository: 'graphql-repo',
        hasAnyApis: true,
        apis: {
          rest: [],
          graphql: expect.arrayContaining([
            expect.objectContaining({
              file: 'schema.graphql',
              type: 'schema',
              description: 'User API Schema'
            })
          ]),
          grpc: []
        },
        recommendedButtons: ['graphql', 'postman']
      });
    });

    it('handles nslabsdashboards branch switching', async () => {
      const repoPath = path.join(__dirname, '../../../cloned-repositories/nslabsdashboards');
      
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([]);
      execSync.mockImplementation((cmd) => {
        if (cmd === 'git branch --show-current') {
          return 'main\n';
        }
        return '';
      });

      await request(app)
        .get('/api/detect-apis/nslabsdashboards')
        .expect(200);

      expect(execSync).toHaveBeenCalledWith(
        'git checkout james-update',
        expect.objectContaining({ cwd: repoPath })
      );
    });

    it('handles API detection errors gracefully', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const response = await request(app)
        .get('/api/detect-apis/test-repo')
        .expect(500);

      expect(response.body).toMatchObject({
        error: 'Failed to detect APIs',
        details: expect.any(String)
      });
    });
  });

  describe('GET /api/api-buttons/:repoName', () => {
    it('generates button configuration for REST APIs', async () => {
      const repoPath = path.join(__dirname, '../../../cloned-repositories/rest-repo');
      
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockImplementation((dir) => {
        if (dir === repoPath) {
          return [
            { name: 'api.yaml', isDirectory: () => false },
            { name: 'api-v2.yaml', isDirectory: () => false }
          ];
        }
        return [];
      });

      fs.readFileSync.mockImplementation((file) => {
        if (file.endsWith('.yaml')) {
          return 'openapi: 3.0.0\ninfo:\n  title: API';
        }
        return '';
      });

      const response = await request(app)
        .get('/api/api-buttons/rest-repo')
        .expect(200);

      expect(response.body).toMatchObject({
        repository: 'rest-repo',
        hasApis: true,
        buttons: expect.arrayContaining([
          expect.objectContaining({
            type: 'swagger',
            label: 'Swagger UI (2 APIs)',
            icon: '📋',
            color: 'green',
            url: '/swagger/rest-repo'
          }),
          expect.objectContaining({
            type: 'postman',
            label: 'Postman Collection (2 APIs)',
            icon: '📮',
            color: 'orange'
          })
        ]),
        summary: {
          rest: 2,
          graphql: 0,
          grpc: 0,
          total: 2
        }
      });
    });

    it('generates button configuration for mixed APIs', async () => {
      const repoPath = path.join(__dirname, '../../../cloned-repositories/mixed-repo');
      
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockImplementation((dir) => {
        if (dir === repoPath) {
          return [
            { name: 'api.yaml', isDirectory: () => false },
            { name: 'schema.graphql', isDirectory: () => false },
            { name: 'service.proto', isDirectory: () => false }
          ];
        }
        return [];
      });

      fs.readFileSync.mockImplementation((file) => {
        if (file.endsWith('.yaml')) {
          return 'openapi: 3.0.0';
        }
        if (file.endsWith('.graphql')) {
          return 'type Query { test: String }';
        }
        if (file.endsWith('.proto')) {
          return 'service TestService {}';
        }
        return '';
      });

      const response = await request(app)
        .get('/api/api-buttons/mixed-repo')
        .expect(200);

      expect(response.body.buttons).toHaveLength(4); // swagger, graphql, grpc, postman
      expect(response.body.summary.total).toBe(3);
    });
  });

  describe('GET /api/detect-apis', () => {
    it('detects APIs in all repositories', async () => {
      const baseDir = path.join(__dirname, '../../../cloned-repositories');
      
      fs.readdirSync.mockImplementation((dir) => {
        if (dir === baseDir) {
          return [
            { name: 'repo1', isDirectory: () => true },
            { name: 'repo2', isDirectory: () => true },
            { name: '.git', isDirectory: () => true }, // Should be ignored
            { name: 'file.txt', isDirectory: () => false } // Should be ignored
          ];
        }
        return [];
      });

      fs.readFileSync.mockReturnValue('');

      const response = await request(app)
        .get('/api/detect-apis')
        .expect(200);

      expect(response.body).toMatchObject({
        repositories: expect.arrayContaining([
          expect.objectContaining({ repository: 'repo1' }),
          expect.objectContaining({ repository: 'repo2' })
        ]),
        summary: expect.objectContaining({
          totalRepositories: 2,
          totalRestApis: 0,
          totalGraphqlSchemas: 0,
          totalGrpcServices: 0,
          repositoriesWithApis: 0,
          apiCoverage: 0
        })
      });
    });

    it('handles repository detection errors without failing entire batch', async () => {
      const baseDir = path.join(__dirname, '../../../cloned-repositories');
      
      fs.readdirSync.mockImplementation((dir) => {
        if (dir === baseDir) {
          return [
            { name: 'good-repo', isDirectory: () => true },
            { name: 'bad-repo', isDirectory: () => true }
          ];
        }
        if (dir.includes('bad-repo')) {
          throw new Error('Permission denied');
        }
        return [];
      });

      fs.readFileSync.mockReturnValue('');

      const response = await request(app)
        .get('/api/detect-apis')
        .expect(200);

      expect(response.body.repositories).toHaveLength(2);
      expect(response.body.repositories[1]).toMatchObject({
        repository: 'bad-repo',
        error: expect.any(String),
        hasAnyApis: false
      });
    });

    it('calculates correct summary statistics', async () => {
      const baseDir = path.join(__dirname, '../../../cloned-repositories');
      
      fs.readdirSync.mockImplementation((dir) => {
        if (dir === baseDir) {
          return [
            { name: 'rest-repo', isDirectory: () => true },
            { name: 'graphql-repo', isDirectory: () => true },
            { name: 'empty-repo', isDirectory: () => true }
          ];
        }
        if (dir.includes('rest-repo')) {
          return [{ name: 'api.yaml', isDirectory: () => false }];
        }
        if (dir.includes('graphql-repo')) {
          return [{ name: 'schema.graphql', isDirectory: () => false }];
        }
        return [];
      });

      fs.readFileSync.mockImplementation((file) => {
        if (file.endsWith('.yaml')) return 'openapi: 3.0.0';
        if (file.endsWith('.graphql')) return 'type Query { test: String }';
        return '';
      });

      const response = await request(app)
        .get('/api/detect-apis')
        .expect(200);

      expect(response.body.summary).toEqual({
        totalRepositories: 3,
        totalRestApis: 1,
        totalGraphqlSchemas: 1,
        totalGrpcServices: 0,
        repositoriesWithApis: 2,
        apiCoverage: 67 // 2/3 * 100 rounded
      });
    });
  });
});