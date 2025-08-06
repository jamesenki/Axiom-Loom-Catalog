import { DynamicApiDetectionService } from '../DynamicApiDetectionService';
import * as fs from 'fs';
import * as path from 'path';
import * as dynamicApiDetection from '../dynamicApiDetection';

// Mock modules
jest.mock('fs');
jest.mock('../dynamicApiDetection', () => ({
  detectRepositoryApis: jest.fn(),
  detectAllRepositoryApis: jest.fn()
}));

const mockFs = fs as jest.Mocked<typeof fs>;
const mockFsPromises = fs.promises as jest.Mocked<typeof fs.promises>;

describe('DynamicApiDetectionService', () => {
  let service: DynamicApiDetectionService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    service = new DynamicApiDetectionService();
    
    // Default mock implementations
    mockFsPromises.readdir = jest.fn().mockResolvedValue([]);
    mockFsPromises.readFile = jest.fn().mockResolvedValue('');
  });

  describe('detectRepositoryApis', () => {
    it('should detect repository APIs', async () => {
      const expectedResult = {
        hasAnyApis: true,
        apis: {
          rest: [{ file: 'openapi.yaml', format: 'yaml', version: '3.0.0', title: 'Test API' }],
          graphql: [],
          grpc: []
        }
      };
      
      (dynamicApiDetection.detectRepositoryApis as jest.Mock).mockResolvedValue(expectedResult);
      
      const result = await service.detectRepositoryApis('/test/repo', 'test-repo');
      
      expect(dynamicApiDetection.detectRepositoryApis).toHaveBeenCalledWith('test-repo');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('detectRestApis', () => {
    it('should detect OpenAPI YAML files', async () => {
      const mockFiles = [
        { name: 'openapi.yaml', isDirectory: () => false, isFile: () => true },
        { name: 'swagger.yml', isDirectory: () => false, isFile: () => true }
      ];
      
      mockFsPromises.readdir = jest.fn().mockResolvedValue(mockFiles);
      mockFsPromises.readFile = jest.fn()
        .mockResolvedValueOnce('openapi: 3.0.0\ninfo:\n  title: Test API\n  version: 1.0.0')
        .mockResolvedValueOnce('swagger: "2.0"\ninfo:\n  title: Swagger API\n  version: 2.0.0');
      
      const result = await service.detectRestApis('/test/repo');
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        file: 'openapi.yaml',
        format: 'yaml',
        version: '1.0.0',
        title: 'Test API'
      });
      expect(result[1]).toEqual({
        file: 'swagger.yml',
        format: 'yaml',
        version: '2.0.0',
        title: 'Swagger API'
      });
    });

    it('should detect OpenAPI JSON files', async () => {
      const mockFiles = [
        { name: 'openapi.json', isDirectory: () => false, isFile: () => true }
      ];
      
      mockFsPromises.readdir = jest.fn().mockResolvedValue(mockFiles);
      mockFsPromises.readFile = jest.fn().mockResolvedValue(JSON.stringify({
        openapi: '3.0.0',
        info: {
          title: 'JSON API',
          version: '1.0.0'
        }
      }));
      
      const result = await service.detectRestApis('/test/repo');
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        file: 'openapi.json',
        format: 'json',
        version: '1.0.0',
        title: 'JSON API'
      });
    });

    it('should handle invalid JSON gracefully', async () => {
      const mockFiles = [
        { name: 'invalid.json', isDirectory: () => false, isFile: () => true }
      ];
      
      mockFsPromises.readdir = jest.fn().mockResolvedValue(mockFiles);
      mockFsPromises.readFile = jest.fn().mockResolvedValue('{ invalid json }');
      
      const result = await service.detectRestApis('/test/repo');
      
      expect(result).toHaveLength(0);
    });

    it('should handle errors gracefully', async () => {
      mockFsPromises.readdir = jest.fn().mockRejectedValue(new Error('Permission denied'));
      
      const result = await service.detectRestApis('/test/repo');
      
      expect(result).toHaveLength(0);
    });
  });

  describe('detectGraphqlApis', () => {
    it('should detect GraphQL schema files', async () => {
      const mockFiles = [
        { name: 'schema.graphql', isDirectory: () => false, isFile: () => true },
        { name: 'types.gql', isDirectory: () => false, isFile: () => true }
      ];
      
      mockFsPromises.readdir = jest.fn().mockResolvedValue(mockFiles);
      mockFsPromises.readFile = jest.fn()
        .mockResolvedValueOnce('# User schema\ntype Query {\n  users: [User]\n}\nquery getUsers {\n  users\n}')
        .mockResolvedValueOnce('mutation createUser {\n  createUser\n}');
      
      const result = await service.detectGraphqlApis('/test/repo');
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        file: 'schema.graphql',
        type: 'query',
        description: 'User schema'
      });
      expect(result[1]).toEqual({
        file: 'types.gql',
        type: 'mutation',
        description: ''
      });
    });

    it('should detect schema type files', async () => {
      const mockFiles = [
        { name: 'schema.graphql', isDirectory: () => false, isFile: () => true }
      ];
      
      mockFsPromises.readdir = jest.fn().mockResolvedValue(mockFiles);
      mockFsPromises.readFile = jest.fn().mockResolvedValue('type User {\n  id: ID!\n}');
      
      const result = await service.detectGraphqlApis('/test/repo');
      
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('schema');
    });
  });

  describe('detectGrpcApis', () => {
    it('should detect proto files with services', async () => {
      const mockFiles = [
        { name: 'service.proto', isDirectory: () => false, isFile: () => true }
      ];
      
      mockFsPromises.readdir = jest.fn().mockResolvedValue(mockFiles);
      mockFsPromises.readFile = jest.fn().mockResolvedValue(`
        syntax = "proto3";
        package user.v1;
        
        service UserService {
          rpc GetUser(GetUserRequest) returns (User);
        }
        
        service AdminService {
          rpc DeleteUser(DeleteUserRequest) returns (Empty);
        }
      `);
      
      const result = await service.detectGrpcApis('/test/repo');
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        file: 'service.proto',
        services: ['UserService', 'AdminService'],
        package: 'user.v1',
        syntax: 'proto3'
      });
    });

    it('should handle proto files without package', async () => {
      const mockFiles = [
        { name: 'simple.proto', isDirectory: () => false, isFile: () => true }
      ];
      
      mockFsPromises.readdir = jest.fn().mockResolvedValue(mockFiles);
      mockFsPromises.readFile = jest.fn().mockResolvedValue('syntax = "proto2";\nservice TestService {}');
      
      const result = await service.detectGrpcApis('/test/repo');
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        file: 'simple.proto',
        services: ['TestService'],
        package: undefined,
        syntax: 'proto2'
      });
    });
  });

  describe('determineRecommendedButtons', () => {
    it('should recommend swagger button for REST APIs', () => {
      const apis = {
        hasAnyApis: true,
        apis: {
          rest: [{ file: 'openapi.yaml', format: 'yaml', version: '3.0.0', title: 'API' }],
          graphql: [],
          grpc: []
        }
      };
      
      const result = service.determineRecommendedButtons(apis);
      
      expect(result).toContain('swagger');
      expect(result).toContain('postman');
    });

    it('should recommend all buttons for mixed APIs', () => {
      const apis = {
        hasAnyApis: true,
        apis: {
          rest: [{ file: 'openapi.yaml', format: 'yaml', version: '3.0.0', title: 'API' }],
          graphql: [{ file: 'schema.graphql', type: 'schema' as const, description: '' }],
          grpc: [{ file: 'service.proto', services: ['Test'], syntax: 'proto3' }]
        }
      };
      
      const result = service.determineRecommendedButtons(apis);
      
      expect(result).toContain('swagger');
      expect(result).toContain('graphql');
      expect(result).toContain('grpc');
      expect(result).toContain('postman');
    });

    it('should return empty array for no APIs', () => {
      const apis = {
        hasAnyApis: false,
        apis: {
          rest: [],
          graphql: [],
          grpc: []
        }
      };
      
      const result = service.determineRecommendedButtons(apis);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getApiButtonConfiguration', () => {
    it('should generate button configuration for detected APIs', () => {
      const detection = {
        hasAnyApis: true,
        apis: {
          rest: [{ file: 'openapi.yaml', format: 'yaml', version: '3.0.0', title: 'API' }],
          graphql: [{ file: 'schema.graphql', type: 'schema' as const, description: '' }],
          grpc: []
        }
      };
      
      const result = service.getApiButtonConfiguration(detection, 'test-repo');
      
      expect(result.repository).toBe('test-repo');
      expect(result.hasApis).toBe(true);
      expect(result.buttons).toHaveLength(3); // swagger, graphql, postman
      expect(result.summary).toEqual({
        rest: 1,
        graphql: 1,
        grpc: 0,
        total: 2
      });
    });

    it('should generate correct button labels with counts', () => {
      const detection = {
        hasAnyApis: true,
        apis: {
          rest: [
            { file: 'api1.yaml', format: 'yaml', version: '3.0.0', title: 'API1' },
            { file: 'api2.yaml', format: 'yaml', version: '3.0.0', title: 'API2' }
          ],
          graphql: [],
          grpc: []
        }
      };
      
      const result = service.getApiButtonConfiguration(detection, 'test-repo');
      
      const swaggerButton = result.buttons.find(b => b.type === 'swagger');
      expect(swaggerButton?.label).toBe('Swagger UI (2 APIs)');
    });
  });

  describe('getFilesRecursively', () => {
    it('should recursively find files', async () => {
      // Mock nested directory structure
      mockFsPromises.readdir = jest.fn()
        .mockResolvedValueOnce([
          { name: 'file1.yaml', isDirectory: () => false, isFile: () => true },
          { name: 'src', isDirectory: () => true, isFile: () => false },
          { name: '.git', isDirectory: () => true, isFile: () => false }
        ] as any)
        .mockResolvedValueOnce([
          { name: 'file2.json', isDirectory: () => false, isFile: () => true }
        ] as any);
      
      const result = await (service as any).getFilesRecursively('/test');
      
      expect(result).toContain('file1.yaml');
      expect(result).toContain(path.join('src', 'file2.json'));
      expect(result).not.toContain('.git');
    });

    it('should skip node_modules', async () => {
      mockFsPromises.readdir = jest.fn().mockResolvedValue([
        { name: 'file.js', isDirectory: () => false, isFile: () => true },
        { name: 'node_modules', isDirectory: () => true, isFile: () => false }
      ] as any);
      
      const result = await (service as any).getFilesRecursively('/test');
      
      expect(result).toContain('file.js');
      expect(result).not.toContain('node_modules');
    });

    it('should handle errors gracefully', async () => {
      mockFsPromises.readdir = jest.fn().mockRejectedValue(new Error('Permission denied'));
      
      const result = await (service as any).getFilesRecursively('/test');
      
      expect(result).toEqual([]);
    });
  });
});