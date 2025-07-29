import { detectRepositoryApis, ApiDetectionResult } from '../dynamicApiDetection';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Mock modules
jest.mock('fs');
jest.mock('child_process');

describe('dynamicApiDetection service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('detectRepositoryApis', () => {
    beforeEach(() => {
      // Mock filesystem existence check
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      // Mock execSync for branch operations
      (execSync as jest.Mock).mockReturnValue('');
    });

    it('successfully detects APIs in a repository', async () => {
      // Mock file searches
      (fs.readdirSync as jest.Mock).mockImplementation((dir) => {
        if (dir.includes('test-repo')) {
          if (dir.includes('api')) {
            return [
              { name: 'openapi.yaml', isDirectory: () => false, isFile: () => true }
            ];
          } else if (dir.includes('graphql')) {
            return [
              { name: 'schema.graphql', isDirectory: () => false, isFile: () => true }
            ];
          } else if (dir.includes('proto')) {
            return [
              { name: 'service.proto', isDirectory: () => false, isFile: () => true }
            ];
          }
          return [
            { name: 'api', isDirectory: () => true, isFile: () => false },
            { name: 'graphql', isDirectory: () => true, isFile: () => false },
            { name: 'proto', isDirectory: () => true, isFile: () => false }
          ];
        }
        return [];
      });

      // Mock file reads
      (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
        if (filePath.includes('openapi.yaml')) {
          return `
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
  description: API for user management
paths:
  /users:
    get:
      summary: Get users
`;
        } else if (filePath.includes('schema.graphql')) {
          return `
# Main GraphQL schema
type Query {
  users: [User]
}
`;
        } else if (filePath.includes('service.proto')) {
          return `
// gRPC service definitions
package com.example.api;

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}

service AuthService {
  rpc Login(LoginRequest) returns (LoginResponse);
}
`;
        }
        return '';
      });

      const result = await detectRepositoryApis('test-repo');

      expect(result.repository).toBe('test-repo');
      expect(result.hasAnyApis).toBe(true);
      expect(result.apis.rest).toHaveLength(1);
      expect(result.apis.rest[0].title).toBe('User API');
      expect(result.apis.graphql).toHaveLength(1);
      expect(result.apis.grpc).toHaveLength(1);
      expect(result.apis.grpc[0].services).toContain('UserService');
      expect(result.apis.grpc[0].services).toContain('AuthService');
    });

    it('throws error when repository not found', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await expect(detectRepositoryApis('test-repo')).rejects.toThrow(
        'Repository not found: test-repo'
      );
    });

    it('handles file read errors gracefully', async () => {
      (fs.readdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = await detectRepositoryApis('test-repo');
      
      expect(result.hasAnyApis).toBe(false);
      expect(result.apis.rest).toEqual([]);
      expect(result.apis.graphql).toEqual([]);
      expect(result.apis.grpc).toEqual([]);
    });

    it('handles repository with no APIs', async () => {
      // Mock empty directories
      (fs.readdirSync as jest.Mock).mockReturnValue([]);

      const result = await detectRepositoryApis('docs-repo');

      expect(result.hasAnyApis).toBe(false);
      expect(result.recommendedButtons).toEqual([]);
      expect(result.apis.rest).toEqual([]);
      expect(result.apis.graphql).toEqual([]);
      expect(result.apis.grpc).toEqual([]);
    });

    it('handles repository with only REST APIs', async () => {
      (fs.readdirSync as jest.Mock).mockImplementation((dir) => {
        if (dir.includes('rest-repo') && !dir.includes('node_modules')) {
          return [
            { name: 'swagger.yaml', isDirectory: () => false, isFile: () => true }
          ];
        }
        return [];
      });

      (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
        if (filePath.includes('swagger.yaml')) {
          return `
swagger: "2.0"
info:
  title: REST API
  version: 2.0.0
paths:
  /api/v1/users:
    get:
      summary: Get users
`;
        }
        return '';
      });

      const result = await detectRepositoryApis('rest-repo');

      expect(result.apis.rest).toHaveLength(1);
      expect(result.apis.graphql).toHaveLength(0);
      expect(result.apis.grpc).toHaveLength(0);
      expect(result.recommendedButtons).toContain('swagger');
      expect(result.recommendedButtons).toContain('postman');
      expect(result.recommendedButtons).not.toContain('graphql');
      expect(result.recommendedButtons).not.toContain('grpc');
    });

    it('handles repository with only GraphQL APIs', async () => {
      (fs.readdirSync as jest.Mock).mockImplementation((dir) => {
        if (dir.includes('graphql-repo') && !dir.includes('node_modules')) {
          return [
            { name: 'schema.graphql', isDirectory: () => false, isFile: () => true }
          ];
        }
        return [];
      });

      (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
        if (filePath.includes('schema.graphql')) {
          return 'type Query { hello: String }';
        }
        return '';
      });

      const result = await detectRepositoryApis('graphql-repo');

      expect(result.apis.graphql).toHaveLength(1);
      expect(result.recommendedButtons).toContain('graphql');
      expect(result.recommendedButtons).not.toContain('swagger');
    });

    it('handles special branch for nslabsdashboards', async () => {
      (fs.readdirSync as jest.Mock).mockReturnValue([]);

      await detectRepositoryApis('nslabsdashboards');

      // Verify git checkout was called for james-update branch
      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('git checkout james-update'),
        expect.any(Object)
      );
    });

    it('detects OpenAPI specifications correctly', async () => {
      (fs.readdirSync as jest.Mock).mockImplementation((dir) => {
        if (dir.includes('test-repo')) {
          return [
            { name: 'api.json', isDirectory: () => false, isFile: () => true }
          ];
        }
        return [];
      });

      (fs.readFileSync as jest.Mock).mockReturnValue(`{
        "openapi": "3.0.0",
        "info": {
          "title": "JSON API",
          "version": "1.0.0"
        }
      }`);

      const result = await detectRepositoryApis('test-repo');

      expect(result.apis.rest).toHaveLength(1);
      expect(result.apis.rest[0].title).toBe('JSON API');
    });

    it('identifies GraphQL query files', async () => {
      (fs.readdirSync as jest.Mock).mockImplementation((dir) => {
        if (dir.includes('test-repo')) {
          return [
            { name: 'query.graphql', isDirectory: () => false, isFile: () => true }
          ];
        }
        return [];
      });

      (fs.readFileSync as jest.Mock).mockReturnValue(`
query GetUsers {
  users {
    id
    name
  }
}
`);

      const result = await detectRepositoryApis('test-repo');

      expect(result.apis.graphql).toHaveLength(1);
      expect(result.apis.graphql[0].type).toBe('query');
    });

    it('extracts gRPC package information', async () => {
      (fs.readdirSync as jest.Mock).mockImplementation((dir) => {
        if (dir.includes('test-repo')) {
          return [
            { name: 'api.proto', isDirectory: () => false, isFile: () => true }
          ];
        }
        return [];
      });

      (fs.readFileSync as jest.Mock).mockReturnValue(`
package com.example.grpc;

service TestService {
  rpc GetTest(TestRequest) returns (TestResponse);
}
`);

      const result = await detectRepositoryApis('test-repo');

      expect(result.apis.grpc).toHaveLength(1);
      expect(result.apis.grpc[0].package).toBe('com.example.grpc');
      expect(result.apis.grpc[0].services).toContain('TestService');
    });

    it('ignores non-API files', async () => {
      (fs.readdirSync as jest.Mock).mockImplementation((dir) => {
        if (dir.includes('test-repo')) {
          return [
            { name: 'README.md', isDirectory: () => false, isFile: () => true },
            { name: 'package.json', isDirectory: () => false, isFile: () => true },
            { name: '.gitignore', isDirectory: () => false, isFile: () => true },
            { name: 'api.yaml', isDirectory: () => false, isFile: () => true }
          ];
        }
        return [];
      });

      (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
        if (filePath.includes('api.yaml')) {
          return 'openapi: 3.0.0\ninfo:\n  title: Test\n  version: 1.0.0';
        }
        return 'not an api file';
      });

      const result = await detectRepositoryApis('test-repo');

      expect(result.apis.rest).toHaveLength(1);
      expect(result.apis.rest[0].file).toBe('api.yaml');
    });

    it('skips hidden directories and node_modules', async () => {
      let callCount = 0;
      (fs.readdirSync as jest.Mock).mockImplementation((dir) => {
        callCount++;
        // Prevent infinite recursion
        if (callCount > 10) return [];
        
        if (dir.endsWith('test-repo')) {
          return [
            { name: '.hidden', isDirectory: () => true, isFile: () => false },
            { name: 'node_modules', isDirectory: () => true, isFile: () => false },
            { name: 'src', isDirectory: () => true, isFile: () => false }
          ];
        }
        if (dir.endsWith('src')) {
          return [
            { name: 'api.yaml', isDirectory: () => false, isFile: () => true }
          ];
        }
        return [];
      });

      (fs.readFileSync as jest.Mock).mockReturnValue('openapi: 3.0.0\ninfo:\n  title: Test');

      const result = await detectRepositoryApis('test-repo');

      expect(result.apis.rest).toHaveLength(1);
      // Verify that the mocked fs.readdirSync was called with src directory
      const readDirCalls = (fs.readdirSync as jest.Mock).mock.calls;
      expect(readDirCalls.some(call => call[0].endsWith('src'))).toBe(true);
    });
  });
});