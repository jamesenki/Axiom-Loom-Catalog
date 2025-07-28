/**
 * Additional tests for dynamicApiDetection.ts to achieve 100% coverage
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { detectRepositoryApis, detectAllRepositoryApis } from '../dynamicApiDetection';

// Mock dependencies
jest.mock('fs');
jest.mock('child_process');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('dynamicApiDetection.ts - 100% Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue([]);
    mockFs.readFileSync.mockReturnValue('');
    mockExecSync.mockReturnValue(Buffer.from(''));
  });

  describe('detectRepositoryApis - Edge Cases', () => {
    it('handles repository not found', async () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = await detectRepositoryApis('non-existent');
      expect(result.hasAnyApis).toBe(false);
    });

    it('detects APIs with file reading errors', async () => {
      mockFs.readdirSync.mockReturnValue([
        { name: 'api.yaml', isDirectory: () => false } as any,
        { name: 'schema.graphql', isDirectory: () => false } as any
      ]);
      
      mockFs.readFileSync.mockImplementation((filePath) => {
        if (filePath.toString().includes('api.yaml')) {
          throw new Error('Permission denied');
        }
        return 'type Query { test: String }';
      });
      
      const result = await detectRepositoryApis('test-repo');
      
      // Should still detect GraphQL despite YAML read error
      expect(result.apis.graphql).toHaveLength(1);
      expect(result.apis.rest).toHaveLength(0);
    });

    it('handles deeply nested directory structures', async () => {
      const mockDirStructure: { [key: string]: any[] } = {
        '/base/cloned-repositories/test-repo': [
          { name: 'src', isDirectory: () => true },
          { name: 'docs', isDirectory: () => true }
        ],
        '/base/cloned-repositories/test-repo/src': [
          { name: 'api', isDirectory: () => true }
        ],
        '/base/cloned-repositories/test-repo/src/api': [
          { name: 'v1', isDirectory: () => true },
          { name: 'v2', isDirectory: () => true }
        ],
        '/base/cloned-repositories/test-repo/src/api/v1': [
          { name: 'openapi.yaml', isDirectory: () => false }
        ],
        '/base/cloned-repositories/test-repo/src/api/v2': [
          { name: 'schema.graphql', isDirectory: () => false }
        ],
        '/base/cloned-repositories/test-repo/docs': [
          { name: 'api.proto', isDirectory: () => false }
        ]
      };

      mockFs.readdirSync.mockImplementation((dirPath) => {
        const normalizedPath = dirPath.toString().replace(/\\/g, '/');
        for (const [key, value] of Object.entries(mockDirStructure)) {
          if (normalizedPath.includes(key.split('/').slice(-2).join('/'))) {
            return value as any;
          }
        }
        return [];
      });

      mockFs.readFileSync.mockImplementation((filePath) => {
        const file = filePath.toString();
        if (file.includes('openapi.yaml')) return 'openapi: 3.0.0';
        if (file.includes('schema.graphql')) return 'type Query { test: String }';
        if (file.includes('api.proto')) return 'syntax = "proto3";\nservice TestService {}';
        return '';
      });

      const result = await detectRepositoryApis('test-repo');
      
      expect(result.apis.rest).toHaveLength(1);
      expect(result.apis.graphql).toHaveLength(1);
      expect(result.apis.grpc).toHaveLength(1);
    });

    it('handles circular symlinks gracefully', async () => {
      const visitedDirs = new Set<string>();
      
      mockFs.readdirSync.mockImplementation((dirPath) => {
        const dir = dirPath.toString();
        if (visitedDirs.has(dir)) {
          return []; // Prevent infinite loop
        }
        visitedDirs.add(dir);
        
        if (dir.includes('test-repo') && !dir.includes('/')) {
          return [
            { name: 'link', isDirectory: () => true } as any,
            { name: 'api.yaml', isDirectory: () => false } as any
          ];
        }
        return [];
      });

      mockFs.readFileSync.mockReturnValue('openapi: 3.0.0');

      const result = await detectRepositoryApis('test-repo');
      expect(result.hasAnyApis).toBe(true);
    });

    it('handles special branch switching for nslabsdashboards', async () => {
      mockExecSync.mockImplementation((cmd) => {
        if (cmd.includes('git branch --show-current')) {
          return Buffer.from('main\n');
        }
        if (cmd.includes('git checkout james-update')) {
          return Buffer.from('Switched to branch james-update');
        }
        if (cmd.includes('git checkout main')) {
          return Buffer.from('Switched to branch main');
        }
        return Buffer.from('');
      });

      mockFs.readdirSync.mockReturnValue([
        { name: 'schema.graphql', isDirectory: () => false } as any
      ]);
      mockFs.readFileSync.mockReturnValue('type Query { test: String }');

      const result = await detectRepositoryApis('nslabsdashboards');
      
      expect(mockExecSync).toHaveBeenCalledWith(
        'git checkout james-update',
        expect.any(Object)
      );
      expect(mockExecSync).toHaveBeenCalledWith(
        'git checkout main',
        expect.any(Object)
      );
      expect(result.hasAnyApis).toBe(true);
    });

    it('handles branch switching errors for nslabsdashboards', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      mockExecSync.mockImplementation((cmd) => {
        if (cmd.includes('git branch --show-current')) {
          return Buffer.from('main\n');
        }
        if (cmd.includes('git checkout')) {
          throw new Error('Branch not found');
        }
        return Buffer.from('');
      });

      mockFs.readdirSync.mockReturnValue([]);

      const result = await detectRepositoryApis('nslabsdashboards');
      
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(result.hasAnyApis).toBe(false);
      
      consoleWarnSpy.mockRestore();
    });

    it('detects all supported OpenAPI/Swagger formats', async () => {
      const apiFiles = [
        { name: 'swagger.json', content: '{"swagger": "2.0", "info": {"title": "API", "version": "1.0"}}' },
        { name: 'openapi.json', content: '{"openapi": "3.0.0", "info": {"title": "API", "version": "1.0"}}' },
        { name: 'api.yaml', content: 'openapi: 3.0.0\ninfo:\n  title: API\n  version: 1.0' },
        { name: 'swagger.yml', content: 'swagger: "2.0"\ninfo:\n  title: API' }
      ];

      mockFs.readdirSync.mockReturnValue(
        apiFiles.map(f => ({ name: f.name, isDirectory: () => false } as any))
      );

      mockFs.readFileSync.mockImplementation((filePath) => {
        const fileName = path.basename(filePath.toString());
        const file = apiFiles.find(f => f.name === fileName);
        return file ? file.content : '';
      });

      const result = await detectRepositoryApis('test-repo');
      
      expect(result.apis.rest).toHaveLength(4);
      expect(result.apis.rest[0].format).toBe('json');
      expect(result.apis.rest[2].format).toBe('yaml');
    });

    it('extracts complete GraphQL metadata', async () => {
      mockFs.readdirSync.mockReturnValue([
        { name: 'schema.graphql', isDirectory: () => false } as any,
        { name: 'queries.gql', isDirectory: () => false } as any,
        { name: 'mutations.graphql', isDirectory: () => false } as any
      ]);

      mockFs.readFileSync.mockImplementation((filePath) => {
        const file = filePath.toString();
        if (file.includes('schema.graphql')) {
          return `# Main schema file
type Query {
  users: [User!]!
  posts: [Post!]!
}

type Mutation {
  createUser(input: UserInput!): User!
}

schema {
  query: Query
  mutation: Mutation
}`;
        }
        if (file.includes('queries.gql')) {
          return `query GetUsers {
  users {
    id
    name
  }
}`;
        }
        if (file.includes('mutations.graphql')) {
          return `mutation CreateUser($input: UserInput!) {
  createUser(input: $input) {
    id
  }
}`;
        }
        return '';
      });

      const result = await detectRepositoryApis('test-repo');
      
      expect(result.apis.graphql).toHaveLength(3);
      expect(result.apis.graphql[0].type).toBe('schema');
      expect(result.apis.graphql[0].description).toBe('Main schema file');
      expect(result.apis.graphql[1].type).toBe('query');
      expect(result.apis.graphql[2].type).toBe('mutation');
    });

    it('extracts complete gRPC metadata', async () => {
      mockFs.readdirSync.mockReturnValue([
        { name: 'user.proto', isDirectory: () => false } as any,
        { name: 'auth.proto', isDirectory: () => false } as any
      ]);

      mockFs.readFileSync.mockImplementation((filePath) => {
        const file = filePath.toString();
        if (file.includes('user.proto')) {
          return `syntax = "proto3";

package user.v1;

// User management service
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
}

// Authentication service  
service AuthService {
  rpc Login(LoginRequest) returns (LoginResponse);
}`;
        }
        if (file.includes('auth.proto')) {
          return `syntax = "proto3";

package auth.v1;

import "google/protobuf/timestamp.proto";

service TokenService {
  rpc GenerateToken(GenerateTokenRequest) returns (Token);
}`;
        }
        return '';
      });

      const result = await detectRepositoryApis('test-repo');
      
      expect(result.apis.grpc).toHaveLength(2);
      expect(result.apis.grpc[0].services).toEqual(['UserService', 'AuthService']);
      expect(result.apis.grpc[0].package).toBe('user.v1');
      expect(result.apis.grpc[0].description).toBe('User management service');
      expect(result.apis.grpc[1].services).toEqual(['TokenService']);
      expect(result.apis.grpc[1].hasImports).toBe(true);
    });

    it('handles malformed API files', async () => {
      mockFs.readdirSync.mockReturnValue([
        { name: 'broken.yaml', isDirectory: () => false } as any,
        { name: 'invalid.json', isDirectory: () => false } as any,
        { name: 'empty.proto', isDirectory: () => false } as any
      ]);

      mockFs.readFileSync.mockImplementation((filePath) => {
        const file = filePath.toString();
        if (file.includes('broken.yaml')) return 'invalid: yaml: content:';
        if (file.includes('invalid.json')) return '{ broken json';
        if (file.includes('empty.proto')) return '';
        return '';
      });

      const result = await detectRepositoryApis('test-repo');
      
      // Should handle errors gracefully
      expect(result.hasAnyApis).toBe(false);
      expect(result.apis.rest).toHaveLength(0);
      expect(result.apis.grpc).toHaveLength(0);
    });
  });

  describe('detectAllRepositoryApis - Full Coverage', () => {
    it('detects APIs across all repositories', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((dir) => {
        if (dir.toString().includes('cloned-repositories')) {
          return [
            { name: 'repo1', isDirectory: () => true } as any,
            { name: 'repo2', isDirectory: () => true } as any,
            { name: '.hidden', isDirectory: () => true } as any,
            { name: 'file.txt', isDirectory: () => false } as any
          ];
        }
        return [];
      });
      
      mockFs.statSync.mockReturnValue({
        isDirectory: () => true
      } as any);

      const results = await detectAllRepositoryApis();
      
      expect(results).toHaveLength(2); // Should skip hidden dirs and files
      expect(results[0].repository).toBe('repo1');
      expect(results[1].repository).toBe('repo2');
    });

    it('handles empty repository directory', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      
      const results = await detectAllRepositoryApis();
      
      expect(results).toHaveLength(0);
    });

    it('handles missing cloned-repositories directory', async () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const results = await detectAllRepositoryApis();
      
      expect(results).toHaveLength(0);
    });
  });

  describe('File type detection', () => {
    it('correctly identifies all GraphQL file types', async () => {
      const graphqlFiles = [
        'schema.graphql',
        'queries.gql',
        'mutations.graphql',
        'fragments.gql',
        'SCHEMA.GRAPHQL',
        'API.GQL'
      ];

      mockFs.readdirSync.mockReturnValue(
        graphqlFiles.map(name => ({ name, isDirectory: () => false } as any))
      );
      mockFs.readFileSync.mockReturnValue('type Query { test: String }');

      const result = await detectRepositoryApis('test-repo');
      
      expect(result.apis.graphql).toHaveLength(graphqlFiles.length);
    });

    it('correctly identifies all Proto file types', async () => {
      const protoFiles = [
        'service.proto',
        'messages.proto',
        'api.proto',
        'SERVICE.PROTO',
        'rpc.proto'
      ];

      mockFs.readdirSync.mockReturnValue(
        protoFiles.map(name => ({ name, isDirectory: () => false } as any))
      );
      mockFs.readFileSync.mockReturnValue('syntax = "proto3";');

      const result = await detectRepositoryApis('test-repo');
      
      expect(result.apis.grpc).toHaveLength(protoFiles.length);
    });
  });
});