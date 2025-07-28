import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';
import { 
  detectRepositoryApis,
  detectAllRepositoryApis,
  ApiDetectionResult 
} from '../dynamicApiDetection';

// Mock modules
jest.mock('fs/promises');
jest.mock('child_process');

describe('dynamicApiDetection - Additional Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('detectRepositoryApis', () => {
    it('detects REST APIs in a repository', async () => {
      const mockReaddir = fs.readdir as jest.Mock;
      const mockReadFile = fs.readFile as jest.Mock;
      const mockStat = fs.stat as jest.Mock;

      // Mock repository structure
      mockReaddir.mockImplementation(async (dir: string) => {
        if (dir.includes('test-repo')) {
          return ['api', 'docs', 'src'];
        }
        if (dir.includes('/api')) {
          return ['openapi.yaml', 'swagger.json'];
        }
        return [];
      });

      mockStat.mockResolvedValue({ isDirectory: () => true });

      mockReadFile.mockImplementation(async (file: string) => {
        if (file.includes('openapi.yaml')) {
          return Buffer.from(`openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users`);
        }
        if (file.includes('swagger.json')) {
          return Buffer.from(JSON.stringify({
            swagger: '2.0',
            info: { title: 'Legacy API', version: '2.0.0' }
          }));
        }
        return Buffer.from('');
      });

      const result = await detectRepositoryApis('test-repo');

      expect(result.repository).toBe('test-repo');
      expect(result.hasAnyApis).toBe(true);
      expect(result.apis.rest).toHaveLength(2);
      expect(result.recommendedButtons).toContain('swagger');
      expect(result.recommendedButtons).toContain('postman');
    });

    it('detects GraphQL APIs in a repository', async () => {
      const mockReaddir = fs.readdir as jest.Mock;
      const mockReadFile = fs.readFile as jest.Mock;
      const mockStat = fs.stat as jest.Mock;

      mockReaddir.mockImplementation(async (dir: string) => {
        if (dir.includes('graphql-repo')) {
          return ['src', 'graphql'];
        }
        if (dir.includes('/graphql')) {
          return ['schema.graphql', 'queries.gql'];
        }
        return [];
      });

      mockStat.mockResolvedValue({ isDirectory: () => true });

      mockReadFile.mockImplementation(async (file: string) => {
        if (file.includes('.graphql') || file.includes('.gql')) {
          return Buffer.from(`# GraphQL Schema
type Query {
  users: [User!]!
}

type User {
  id: ID!
  name: String!
}`);
        }
        return Buffer.from('');
      });

      const result = await detectRepositoryApis('graphql-repo');

      expect(result.apis.graphql).toHaveLength(2);
      expect(result.recommendedButtons).toContain('graphql');
      expect(result.recommendedButtons).toContain('postman');
    });

    it('detects gRPC APIs in a repository', async () => {
      const mockReaddir = fs.readdir as jest.Mock;
      const mockReadFile = fs.readFile as jest.Mock;
      const mockStat = fs.stat as jest.Mock;

      mockReaddir.mockImplementation(async (dir: string) => {
        if (dir.includes('grpc-repo')) {
          return ['protos'];
        }
        if (dir.includes('/protos')) {
          return ['service.proto', 'messages.proto'];
        }
        return [];
      });

      mockStat.mockResolvedValue({ isDirectory: () => true });

      mockReadFile.mockImplementation(async (file: string) => {
        if (file.includes('.proto')) {
          return Buffer.from(`syntax = "proto3";

package myapp;

// User service definition
service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (ListUsersResponse);
}`);
        }
        return Buffer.from('');
      });

      const result = await detectRepositoryApis('grpc-repo');

      expect(result.apis.grpc).toHaveLength(2);
      expect(result.recommendedButtons).toContain('grpc');
      expect(result.recommendedButtons).toContain('postman');
    });

    it('handles nslabsdashboards special branch', async () => {
      const mockExecSync = execSync as jest.Mock;
      const mockReaddir = fs.readdir as jest.Mock;
      const mockStat = fs.stat as jest.Mock;

      mockExecSync.mockImplementation((cmd: string) => {
        if (cmd.includes('git branch --show-current')) {
          return 'main\n';
        }
        return '';
      });

      mockReaddir.mockResolvedValue([]);
      mockStat.mockResolvedValue({ isDirectory: () => true });

      await detectRepositoryApis('nslabsdashboards');

      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('git checkout james-update'),
        expect.any(Object)
      );
    });

    it('handles repositories with no APIs', async () => {
      const mockReaddir = fs.readdir as jest.Mock;
      const mockStat = fs.stat as jest.Mock;

      mockReaddir.mockResolvedValue(['README.md', 'LICENSE']);
      mockStat.mockResolvedValue({ isDirectory: () => false });

      const result = await detectRepositoryApis('docs-only-repo');

      expect(result.hasAnyApis).toBe(false);
      expect(result.apis.rest).toHaveLength(0);
      expect(result.apis.graphql).toHaveLength(0);
      expect(result.apis.grpc).toHaveLength(0);
      expect(result.recommendedButtons).toHaveLength(0);
    });

    it('handles file read errors gracefully', async () => {
      const mockReaddir = fs.readdir as jest.Mock;
      const mockReadFile = fs.readFile as jest.Mock;
      const mockStat = fs.stat as jest.Mock;

      mockReaddir.mockResolvedValue(['api.yaml']);
      mockStat.mockResolvedValue({ isDirectory: () => false });
      mockReadFile.mockRejectedValue(new Error('Permission denied'));

      const result = await detectRepositoryApis('error-repo');

      // Should complete without throwing
      expect(result.repository).toBe('error-repo');
      expect(result.hasAnyApis).toBe(false);
    });

    it('detects mixed API types', async () => {
      const mockReaddir = fs.readdir as jest.Mock;
      const mockReadFile = fs.readFile as jest.Mock;
      const mockStat = fs.stat as jest.Mock;

      mockReaddir.mockImplementation(async (dir: string) => {
        if (dir.includes('mixed-repo')) {
          return ['api.yaml', 'schema.graphql', 'service.proto'];
        }
        return [];
      });

      mockStat.mockResolvedValue({ isDirectory: () => false });

      mockReadFile.mockImplementation(async (file: string) => {
        if (file.includes('.yaml')) {
          return Buffer.from('openapi: 3.0.0');
        }
        if (file.includes('.graphql')) {
          return Buffer.from('type Query { test: String }');
        }
        if (file.includes('.proto')) {
          return Buffer.from('service TestService {}');
        }
        return Buffer.from('');
      });

      const result = await detectRepositoryApis('mixed-repo');

      expect(result.apis.rest).toHaveLength(1);
      expect(result.apis.graphql).toHaveLength(1);
      expect(result.apis.grpc).toHaveLength(1);
      expect(result.recommendedButtons).toHaveLength(4); // swagger, graphql, grpc, postman
    });
  });

  describe('detectAllRepositoryApis', () => {
    it('processes multiple repositories', async () => {
      const mockReaddir = fs.readdir as jest.Mock;
      const mockStat = fs.stat as jest.Mock;

      mockReaddir.mockResolvedValue([]);
      mockStat.mockResolvedValue({ isDirectory: () => true });

      const results = await detectAllRepositoryApis(['repo1', 'repo2', 'repo3']);

      expect(results).toHaveLength(3);
      expect(results[0].repository).toBe('repo1');
      expect(results[1].repository).toBe('repo2');
      expect(results[2].repository).toBe('repo3');
    });

    it('handles errors in individual repositories', async () => {
      const mockReaddir = fs.readdir as jest.Mock;

      mockReaddir
        .mockResolvedValueOnce([]) // repo1 - success
        .mockRejectedValueOnce(new Error('Access denied')) // repo2 - error
        .mockResolvedValueOnce([]); // repo3 - success

      const results = await detectAllRepositoryApis(['repo1', 'repo2', 'repo3']);

      expect(results).toHaveLength(3);
      expect(results[0].repository).toBe('repo1');
      expect(results[1].repository).toBe('repo2');
      expect(results[1].hasAnyApis).toBe(false); // Error repo should have no APIs
      expect(results[2].repository).toBe('repo3');
    });

    it('returns empty array for empty input', async () => {
      const results = await detectAllRepositoryApis([]);
      expect(results).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('handles deeply nested API files', async () => {
      const mockReaddir = fs.readdir as jest.Mock;
      const mockReadFile = fs.readFile as jest.Mock;
      const mockStat = fs.stat as jest.Mock;

      mockReaddir.mockImplementation(async (dir: string) => {
        if (dir.includes('nested-repo')) {
          return ['src'];
        }
        if (dir.includes('/src')) {
          return ['api'];
        }
        if (dir.includes('/api')) {
          return ['v1'];
        }
        if (dir.includes('/v1')) {
          return ['openapi.yaml'];
        }
        return [];
      });

      mockStat.mockResolvedValue({ isDirectory: () => true });
      mockReadFile.mockImplementation(async () => 
        Buffer.from('openapi: 3.0.0\ninfo:\n  title: Nested API')
      );

      const result = await detectRepositoryApis('nested-repo');

      expect(result.apis.rest.length).toBeGreaterThan(0);
    });

    it('handles invalid YAML/JSON gracefully', async () => {
      const mockReaddir = fs.readdir as jest.Mock;
      const mockReadFile = fs.readFile as jest.Mock;
      const mockStat = fs.stat as jest.Mock;

      mockReaddir.mockResolvedValue(['invalid.yaml']);
      mockStat.mockResolvedValue({ isDirectory: () => false });
      mockReadFile.mockResolvedValue(Buffer.from('invalid: yaml: content:'));

      const result = await detectRepositoryApis('invalid-repo');

      // Should not crash, just skip invalid files
      expect(result.repository).toBe('invalid-repo');
    });

    it('handles symbolic links', async () => {
      const mockReaddir = fs.readdir as jest.Mock;
      const mockStat = fs.stat as jest.Mock;

      mockReaddir.mockResolvedValue(['symlink']);
      mockStat.mockResolvedValue({ 
        isDirectory: () => false,
        isSymbolicLink: () => true
      });

      const result = await detectRepositoryApis('symlink-repo');

      expect(result.repository).toBe('symlink-repo');
      // Should complete without errors
    });
  });
});