import { DynamicApiDetectionService } from '../DynamicApiDetectionService';
import * as fs from 'fs/promises';
import * as path from 'path';

// Mock fs and path
jest.mock('fs/promises');
jest.mock('path');

describe('DynamicApiDetectionService', () => {
  let service: DynamicApiDetectionService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    service = new DynamicApiDetectionService();
  });

  describe('detectApiType', () => {
    it('detects REST API from openapi.yaml', async () => {
      const mockFiles = ['openapi.yaml', 'src/index.js'];
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });
      (fs.readFile as jest.Mock).mockResolvedValue('openapi: 3.0.0\npaths:\n  /users:\n    get:');
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

      const result = await service.detectApiType('/test/repo');

      expect(result).toBe('rest');
    });

    it('detects GraphQL API from schema files', async () => {
      const mockFiles = ['schema.graphql', 'src/index.js'];
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });
      (fs.readFile as jest.Mock).mockResolvedValue('type Query {\n  users: [User]\n}');
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

      const result = await service.detectApiType('/test/repo');

      expect(result).toBe('graphql');
    });

    it('detects gRPC API from proto files', async () => {
      const mockFiles = ['service.proto', 'src/index.js'];
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });
      (fs.readFile as jest.Mock).mockResolvedValue('syntax = "proto3";\nservice UserService {');
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

      const result = await service.detectApiType('/test/repo');

      expect(result).toBe('grpc');
    });

    it('returns unknown for unrecognized API types', async () => {
      const mockFiles = ['index.js', 'package.json'];
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

      const result = await service.detectApiType('/test/repo');

      expect(result).toBe('unknown');
    });

    it('handles errors gracefully', async () => {
      (fs.readdir as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const result = await service.detectApiType('/test/repo');

      expect(result).toBe('unknown');
    });
  });

  describe('getApiSpecFiles', () => {
    it('returns OpenAPI spec files for REST APIs', async () => {
      const mockFiles = ['openapi.yaml', 'swagger.json', 'api.yaml'];
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });
      (fs.readFile as jest.Mock).mockImplementation(async (filePath: string) => {
        if (filePath.includes('openapi.yaml')) return 'openapi: 3.0.0';
        if (filePath.includes('swagger.json')) return '{"swagger": "2.0"}';
        return 'not an api spec';
      });
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
      (path.extname as jest.Mock).mockImplementation((p: string) => {
        if (p.endsWith('.yaml')) return '.yaml';
        if (p.endsWith('.json')) return '.json';
        return '';
      });

      const result = await service.getApiSpecFiles('/test/repo', 'rest');

      expect(result).toHaveLength(2);
      expect(result[0].path).toContain('openapi.yaml');
      expect(result[1].path).toContain('swagger.json');
    });

    it('returns GraphQL schema files', async () => {
      const mockFiles = ['schema.graphql', 'types.gql'];
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });
      (fs.readFile as jest.Mock).mockResolvedValue('type Query { users: [User] }');
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

      const result = await service.getApiSpecFiles('/test/repo', 'graphql');

      expect(result).toHaveLength(2);
      expect(result[0].path).toContain('schema.graphql');
      expect(result[1].path).toContain('types.gql');
    });

    it('returns proto files for gRPC APIs', async () => {
      const mockFiles = ['service.proto', 'messages.proto'];
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });
      (fs.readFile as jest.Mock).mockResolvedValue('syntax = "proto3";');
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

      const result = await service.getApiSpecFiles('/test/repo', 'grpc');

      expect(result).toHaveLength(2);
      expect(result[0].path).toContain('service.proto');
      expect(result[1].path).toContain('messages.proto');
    });

    it('handles nested directories', async () => {
      const mockRootFiles = ['src', 'api'];
      const mockApiFiles = ['openapi.yaml'];
      
      (fs.readdir as jest.Mock)
        .mockResolvedValueOnce(mockRootFiles)
        .mockResolvedValueOnce(mockApiFiles);
      
      (fs.stat as jest.Mock)
        .mockResolvedValueOnce({ isDirectory: () => true }) // src
        .mockResolvedValueOnce({ isDirectory: () => true }) // api
        .mockResolvedValueOnce({ isDirectory: () => false }); // openapi.yaml
      
      (fs.readFile as jest.Mock).mockResolvedValue('openapi: 3.0.0');
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
      (path.extname as jest.Mock).mockReturnValue('.yaml');

      const result = await service.getApiSpecFiles('/test/repo', 'rest');

      expect(result).toHaveLength(1);
      expect(result[0].path).toContain('api/openapi.yaml');
    });

    it('returns empty array for unknown API types', async () => {
      const result = await service.getApiSpecFiles('/test/repo', 'unknown');

      expect(result).toEqual([]);
    });

    it('handles errors gracefully', async () => {
      (fs.readdir as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const result = await service.getApiSpecFiles('/test/repo', 'rest');

      expect(result).toEqual([]);
    });
  });

  describe('getApiMetadata', () => {
    it('extracts metadata from OpenAPI spec', async () => {
      const mockSpec = {
        openapi: '3.0.0',
        info: {
          title: 'User API',
          version: '1.0.0',
          description: 'API for managing users'
        },
        paths: {
          '/users': { get: {}, post: {} },
          '/users/{id}': { get: {}, put: {}, delete: {} }
        }
      };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockSpec));

      const result = await service.getApiMetadata('/test/openapi.json', 'rest');

      expect(result).toEqual({
        name: 'User API',
        version: '1.0.0',
        description: 'API for managing users',
        endpoints: 5
      });
    });

    it('extracts metadata from GraphQL schema', async () => {
      const mockSchema = `
        # User management API
        type Query {
          users: [User]
          user(id: ID!): User
        }
        type Mutation {
          createUser(input: UserInput!): User
          updateUser(id: ID!, input: UserInput!): User
          deleteUser(id: ID!): Boolean
        }
      `;
      (fs.readFile as jest.Mock).mockResolvedValue(mockSchema);

      const result = await service.getApiMetadata('/test/schema.graphql', 'graphql');

      expect(result).toEqual({
        name: 'GraphQL API',
        operations: {
          queries: 2,
          mutations: 3,
          subscriptions: 0
        }
      });
    });

    it('extracts metadata from gRPC proto file', async () => {
      const mockProto = `
        syntax = "proto3";
        package user.v1;
        
        service UserService {
          rpc GetUser(GetUserRequest) returns (User);
          rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
          rpc CreateUser(CreateUserRequest) returns (User);
        }
      `;
      (fs.readFile as jest.Mock).mockResolvedValue(mockProto);

      const result = await service.getApiMetadata('/test/service.proto', 'grpc');

      expect(result).toEqual({
        name: 'UserService',
        package: 'user.v1',
        services: 1,
        methods: 3
      });
    });

    it('handles invalid spec files', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('invalid content');

      const result = await service.getApiMetadata('/test/spec.yaml', 'rest');

      expect(result).toEqual({});
    });

    it('handles file read errors', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      const result = await service.getApiMetadata('/test/spec.yaml', 'rest');

      expect(result).toEqual({});
    });
  });
});