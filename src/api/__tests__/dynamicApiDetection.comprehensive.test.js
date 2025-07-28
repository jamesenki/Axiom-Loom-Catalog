/**
 * Comprehensive tests for dynamicApiDetection.js to achieve 100% coverage
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Mock dependencies
jest.mock('fs');
jest.mock('child_process');

// Mock express router
const mockRouter = {
  get: jest.fn()
};
jest.mock('express', () => ({
  Router: () => mockRouter
}));

describe('dynamicApiDetection.js - Comprehensive Coverage', () => {
  let routes;
  let handlers;

  beforeEach(() => {
    jest.clearAllMocks();
    handlers = {};
    
    // Capture route handlers
    mockRouter.get.mockImplementation((path, handler) => {
      handlers[path] = handler;
    });

    // Import the module
    routes = require('../dynamicApiDetection');
  });

  describe('Route Registration', () => {
    it('registers all required routes', () => {
      expect(mockRouter.get).toHaveBeenCalledWith('/detect-apis/:repoName', expect.any(Function));
      expect(mockRouter.get).toHaveBeenCalledWith('/api-buttons/:repoName', expect.any(Function));
      expect(mockRouter.get).toHaveBeenCalledWith('/detect-apis', expect.any(Function));
    });
  });

  describe('GET /detect-apis/:repoName', () => {
    it('returns 404 for non-existent repository', async () => {
      fs.existsSync.mockReturnValue(false);

      const req = { params: { repoName: 'non-existent' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await handlers['/detect-apis/:repoName'](req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Repository not found: non-existent'
      });
    });

    it('detects APIs in repository successfully', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockImplementation((dir) => {
        if (dir.includes('test-repo')) {
          return [
            { name: 'api.yaml', isDirectory: () => false },
            { name: 'schema.graphql', isDirectory: () => false },
            { name: 'service.proto', isDirectory: () => false }
          ];
        }
        return [];
      });

      fs.readFileSync.mockImplementation((file) => {
        if (file.includes('.yaml')) {
          return 'openapi: 3.0.0\ninfo:\n  title: Test API\n  version: 1.0.0';
        }
        if (file.includes('.graphql')) {
          return '# Schema\ntype Query { test: String }';
        }
        if (file.includes('.proto')) {
          return 'syntax = "proto3";\npackage test;\nservice TestService { }';
        }
        return '';
      });

      const req = { params: { repoName: 'test-repo' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          repository: 'test-repo',
          hasAnyApis: true,
          apis: expect.objectContaining({
            rest: expect.arrayContaining([
              expect.objectContaining({ file: 'api.yaml' })
            ]),
            graphql: expect.arrayContaining([
              expect.objectContaining({ file: 'schema.graphql' })
            ]),
            grpc: expect.arrayContaining([
              expect.objectContaining({ file: 'service.proto' })
            ])
          })
        })
      );
    });

    it('handles nslabsdashboards branch switching', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([]);
      execSync.mockImplementation((cmd) => {
        if (cmd.includes('git branch --show-current')) {
          return 'main\n';
        }
        return '';
      });

      const req = { params: { repoName: 'nslabsdashboards' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      expect(execSync).toHaveBeenCalledWith(
        'git checkout james-update',
        expect.objectContaining({
          cwd: expect.stringContaining('nslabsdashboards')
        })
      );
    });

    it('handles detection errors gracefully', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const req = { params: { repoName: 'error-repo' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await handlers['/detect-apis/:repoName'](req, res);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to detect APIs',
        details: 'Permission denied'
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('GET /api-buttons/:repoName', () => {
    it('generates button configuration', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockImplementation((dir) => {
        if (dir.includes('button-repo')) {
          return [{ name: 'api.yaml', isDirectory: () => false }];
        }
        return [];
      });

      fs.readFileSync.mockReturnValue('openapi: 3.0.0');

      const req = { params: { repoName: 'button-repo' } };
      const res = { json: jest.fn() };

      await handlers['/api-buttons/:repoName'](req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          repository: 'button-repo',
          hasApis: true,
          buttons: expect.arrayContaining([
            expect.objectContaining({
              type: 'swagger',
              label: expect.stringContaining('Swagger UI'),
              icon: '📋',
              color: 'green'
            }),
            expect.objectContaining({
              type: 'postman',
              label: expect.stringContaining('Postman Collection'),
              icon: '📮',
              color: 'orange'
            })
          ])
        })
      );
    });

    it('handles button config errors', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Read error');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const req = { params: { repoName: 'error-repo' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await handlers['/api-buttons/:repoName'](req, res);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('GET /detect-apis', () => {
    it('detects APIs in all repositories', async () => {
      fs.readdirSync.mockImplementation((dir) => {
        if (dir.includes('cloned-repositories')) {
          return [
            { name: 'repo1', isDirectory: () => true },
            { name: 'repo2', isDirectory: () => true },
            { name: '.git', isDirectory: () => true },
            { name: 'file.txt', isDirectory: () => false }
          ];
        }
        return [];
      });

      fs.readFileSync.mockReturnValue('');

      const req = {};
      const res = { json: jest.fn() };

      await handlers['/detect-apis'](req, res);

      expect(res.json).toHaveBeenCalledWith({
        repositories: expect.arrayContaining([
          expect.objectContaining({ repository: 'repo1' }),
          expect.objectContaining({ repository: 'repo2' })
        ]),
        summary: expect.objectContaining({
          totalRepositories: 2,
          apiCoverage: expect.any(Number)
        })
      });
    });

    it('handles batch detection errors', async () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Directory access error');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await handlers['/detect-apis'](req, res);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('API Detection Functions', () => {
    it('detects OpenAPI 3.0 specifications', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([
        { name: 'openapi.yaml', isDirectory: () => false }
      ]);
      fs.readFileSync.mockReturnValue(`openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
servers:
  - url: https://api.example.com`);

      const req = { params: { repoName: 'openapi-repo' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.apis.rest[0]).toMatchObject({
        file: 'openapi.yaml',
        title: 'My API',
        version: '1.0.0'
      });
    });

    it('detects Swagger 2.0 specifications', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([
        { name: 'swagger.json', isDirectory: () => false }
      ]);
      fs.readFileSync.mockReturnValue(JSON.stringify({
        swagger: '2.0',
        info: {
          title: 'Legacy API',
          version: '2.0.0'
        }
      }));

      const req = { params: { repoName: 'swagger-repo' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.apis.rest[0]).toMatchObject({
        file: 'swagger.json',
        title: 'Legacy API',
        version: '2.0.0'
      });
    });

    it('detects GraphQL schemas', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([
        { name: 'schema.graphql', isDirectory: () => false }
      ]);
      fs.readFileSync.mockReturnValue(`# Main GraphQL schema
type Query {
  users: [User!]!
}`);

      const req = { params: { repoName: 'graphql-repo' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.apis.graphql[0]).toMatchObject({
        file: 'schema.graphql',
        type: 'schema',
        description: 'Main GraphQL schema'
      });
    });

    it('detects GraphQL queries', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([
        { name: 'queries.graphql', isDirectory: () => false }
      ]);
      fs.readFileSync.mockReturnValue(`query GetUsers {
  users {
    id
    name
  }
}`);

      const req = { params: { repoName: 'query-repo' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.apis.graphql[0].type).toBe('query');
    });

    it('detects gRPC services', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([
        { name: 'service.proto', isDirectory: () => false }
      ]);
      fs.readFileSync.mockReturnValue(`syntax = "proto3";

package myapp;

// User service
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}

service AuthService {
  rpc Login(LoginRequest) returns (LoginResponse);
}`);

      const req = { params: { repoName: 'grpc-repo' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.apis.grpc[0]).toMatchObject({
        file: 'service.proto',
        services: ['UserService', 'AuthService'],
        package: 'myapp',
        description: 'User service'
      });
    });

    it('handles nested directories', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockImplementation((dir) => {
        if (dir.includes('nested-repo') && !dir.includes('/')) {
          return [
            { name: 'src', isDirectory: () => true },
            { name: 'api', isDirectory: () => true }
          ];
        }
        if (dir.includes('/src')) {
          return [{ name: 'schema.graphql', isDirectory: () => false }];
        }
        if (dir.includes('/api')) {
          return [{ name: 'openapi.yaml', isDirectory: () => false }];
        }
        return [];
      });

      fs.readFileSync.mockImplementation((file) => {
        if (file.includes('graphql')) return 'type Query { test: String }';
        if (file.includes('yaml')) return 'openapi: 3.0.0';
        return '';
      });

      const req = { params: { repoName: 'nested-repo' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.apis.rest.length).toBeGreaterThan(0);
      expect(result.apis.graphql.length).toBeGreaterThan(0);
    });

    it('ignores non-API files', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([
        { name: 'README.md', isDirectory: () => false },
        { name: 'package.json', isDirectory: () => false },
        { name: 'config.yaml', isDirectory: () => false }
      ]);

      fs.readFileSync.mockImplementation((file) => {
        if (file.includes('config.yaml')) return 'database: postgres';
        return '';
      });

      const req = { params: { repoName: 'no-api-repo' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.hasAnyApis).toBe(false);
      expect(result.recommendedButtons).toHaveLength(0);
    });

    it('handles file read errors gracefully', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([
        { name: 'api.yaml', isDirectory: () => false }
      ]);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const req = { params: { repoName: 'read-error-repo' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      // Should complete without throwing
      expect(res.json).toHaveBeenCalled();
    });

    it('generates correct button configurations', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([
        { name: 'api.yaml', isDirectory: () => false },
        { name: 'schema.graphql', isDirectory: () => false },
        { name: 'service.proto', isDirectory: () => false }
      ]);

      fs.readFileSync.mockImplementation((file) => {
        if (file.includes('yaml')) return 'openapi: 3.0.0';
        if (file.includes('graphql')) return 'type Query { test: String }';
        if (file.includes('proto')) return 'service TestService {}';
        return '';
      });

      const req = { params: { repoName: 'all-apis-repo' } };
      const res = { json: jest.fn() };

      await handlers['/api-buttons/:repoName'](req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.buttons).toHaveLength(4); // swagger, graphql, grpc, postman
      expect(result.buttons.map(b => b.type)).toEqual(
        expect.arrayContaining(['swagger', 'graphql', 'grpc', 'postman'])
      );
    });

    it('calculates correct summary statistics', async () => {
      fs.readdirSync.mockImplementation((dir) => {
        if (dir.includes('cloned-repositories')) {
          return [
            { name: 'repo1', isDirectory: () => true },
            { name: 'repo2', isDirectory: () => true },
            { name: 'repo3', isDirectory: () => true }
          ];
        }
        if (dir.includes('repo1')) {
          return [{ name: 'api.yaml', isDirectory: () => false }];
        }
        if (dir.includes('repo2')) {
          return [{ name: 'schema.graphql', isDirectory: () => false }];
        }
        return [];
      });

      fs.readFileSync.mockImplementation((file) => {
        if (file.includes('yaml')) return 'openapi: 3.0.0';
        if (file.includes('graphql')) return 'type Query { test: String }';
        return '';
      });

      const req = {};
      const res = { json: jest.fn() };

      await handlers['/detect-apis'](req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.summary).toEqual({
        totalRepositories: 3,
        totalRestApis: 1,
        totalGraphqlSchemas: 1,
        totalGrpcServices: 0,
        repositoriesWithApis: 2,
        apiCoverage: 67
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty directories', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([]);

      const req = { params: { repoName: 'empty-repo' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          hasAnyApis: false,
          recommendedButtons: []
        })
      );
    });

    it('handles branch switching errors', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([]);
      execSync.mockImplementation((cmd) => {
        if (cmd.includes('git branch')) return 'main\n';
        if (cmd.includes('git checkout')) {
          throw new Error('Branch not found');
        }
        return '';
      });

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const req = { params: { repoName: 'nslabsdashboards' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Warning: Could not switch to james-update branch'),
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('handles repositories with many API files', async () => {
      fs.existsSync.mockReturnValue(true);
      
      // Create many API files
      const manyFiles = [];
      for (let i = 0; i < 50; i++) {
        manyFiles.push({ name: `api-${i}.yaml`, isDirectory: () => false });
      }
      
      fs.readdirSync.mockReturnValue(manyFiles);
      fs.readFileSync.mockReturnValue('openapi: 3.0.0');

      const req = { params: { repoName: 'many-apis-repo' } };
      const res = { json: jest.fn() };

      await handlers['/detect-apis/:repoName'](req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.apis.rest).toHaveLength(50);
    });
  });
});