import { DynamicApiDetectionService } from '../DynamicApiDetectionService';
import * as path from 'path';

// Mock file system
const mockFileSystem = new Map<string, string>();

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
    stat: jest.fn()
  },
  existsSync: jest.fn(() => true)
}));

// Mock the dynamicApiDetection module
jest.mock('../dynamicApiDetection', () => ({
  ...jest.requireActual('../dynamicApiDetection'),
  detectRepositoryApis: jest.fn()
}));

const fs = require('fs').promises;
const { detectRepositoryApis } = require('../dynamicApiDetection');

describe('DynamicApiDetectionService', () => {
  let service: DynamicApiDetectionService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFileSystem.clear();
    service = new DynamicApiDetectionService();
  });

  describe('detectRestApis', () => {
    it('detects OpenAPI 3.0 specifications', async () => {
      mockFileSystem.set('/repo/api/openapi.yaml', `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
`);

      fs.readdir.mockImplementation(async (dir: string, options?: any) => {
        if (dir === '/repo') {
          return [{ name: 'api', isDirectory: () => true, isFile: () => false }];
        }
        if (dir === '/repo/api' || dir === path.join('/repo', 'api')) {
          return [{ name: 'openapi.yaml', isDirectory: () => false, isFile: () => true }];
        }
        return [];
      });

      fs.readFile.mockImplementation(async (path: string) => {
        return mockFileSystem.get(path) || '';
      });

      const result = await service.detectRestApis('/repo');
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        file: 'api/openapi.yaml',
        format: 'yaml',
        title: 'Test API',
        version: '1.0.0'
      });
    });

    it('detects Swagger 2.0 specifications', async () => {
      mockFileSystem.set('/repo/swagger.json', JSON.stringify({
        swagger: '2.0',
        info: {
          title: 'Legacy API',
          version: '2.0.0'
        }
      }));

      fs.readdir.mockResolvedValue([
        { name: 'swagger.json', isDirectory: () => false, isFile: () => true }
      ]);

      fs.readFile.mockImplementation(async (path: string) => {
        return mockFileSystem.get(path) || '';
      });

      const result = await service.detectRestApis('/repo');
      
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        file: 'swagger.json',
        title: 'Legacy API',
        version: '2.0.0'
      });
    });

    it('ignores non-OpenAPI YAML files', async () => {
      mockFileSystem.set('/repo/config.yaml', 'database: postgres');

      fs.readdir.mockResolvedValue([
        { name: 'config.yaml', isDirectory: () => false, isFile: () => true }
      ]);

      fs.readFile.mockImplementation(async (path: string) => {
        return mockFileSystem.get(path) || '';
      });

      const result = await service.detectRestApis('/repo');
      expect(result).toHaveLength(0);
    });

    it('handles multiple API specifications', async () => {
      mockFileSystem.set('/repo/v1/api.yaml', 'openapi: 3.0.0\ninfo:\n  title: API v1');
      mockFileSystem.set('/repo/v2/api.yaml', 'openapi: 3.1.0\ninfo:\n  title: API v2');

      fs.readdir.mockImplementation(async (dir: string, options?: any) => {
        if (dir === '/repo') {
          return [
            { name: 'v1', isDirectory: () => true, isFile: () => false },
            { name: 'v2', isDirectory: () => true, isFile: () => false }
          ];
        } else if (dir === '/repo/v1' || dir === '/repo/v2') {
          return [{ name: 'api.yaml', isDirectory: () => false, isFile: () => true }];
        }
        return [];
      });

      fs.readFile.mockImplementation(async (path: string) => {
        return mockFileSystem.get(path) || '';
      });

      const result = await service.detectRestApis('/repo');
      expect(result).toHaveLength(2);
    });
  });

  describe('detectGraphqlApis', () => {
    it('detects GraphQL schema files', async () => {
      mockFileSystem.set('/repo/schema.graphql', `
# Main GraphQL schema
type Query {
  users: [User!]!
}

type User {
  id: ID!
  name: String!
}
`);

      fs.readdir.mockResolvedValue([
        { name: 'schema.graphql', isDirectory: () => false, isFile: () => true }
      ]);

      fs.readFile.mockImplementation(async (path: string) => {
        return mockFileSystem.get(path) || '';
      });

      const result = await service.detectGraphqlApis('/repo');
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        file: 'schema.graphql',
        type: 'schema',
        description: 'Main GraphQL schema'
      });
    });

    it('detects GraphQL query files', async () => {
      mockFileSystem.set('/repo/queries/users.graphql', `
query GetUsers {
  users {
    id
    name
  }
}
`);

      fs.readdir.mockImplementation(async (dir: string, options?: any) => {
        if (dir === '/repo') {
          return [{ name: 'queries', isDirectory: () => true, isFile: () => false }];
        } else if (dir === '/repo/queries') {
          return [{ name: 'users.graphql', isDirectory: () => false, isFile: () => true }];
        }
        return [];
      });

      fs.readFile.mockImplementation(async (path: string) => {
        return mockFileSystem.get(path) || '';
      });

      const result = await service.detectGraphqlApis('/repo');
      
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        file: 'queries/users.graphql',
        type: 'query'
      });
    });

    it('handles .gql extension', async () => {
      mockFileSystem.set('/repo/types.gql', 'type Product { id: ID! }');

      fs.readdir.mockResolvedValue([
        { name: 'types.gql', isDirectory: () => false, isFile: () => true }
      ]);

      fs.readFile.mockImplementation(async (path: string) => {
        return mockFileSystem.get(path) || '';
      });

      const result = await service.detectGraphqlApis('/repo');
      expect(result).toHaveLength(1);
      expect(result[0].file).toBe('types.gql');
    });
  });

  describe('detectGrpcApis', () => {
    it('detects gRPC proto files', async () => {
      mockFileSystem.set('/repo/api/service.proto', `
syntax = "proto3";

package myapp;

// User management service
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
}

message User {
  string id = 1;
  string name = 2;
}
`);

      fs.readdir.mockImplementation(async (dir: string, options?: any) => {
        if (dir === '/repo') {
          return [{ name: 'api', isDirectory: () => true, isFile: () => false }];
        } else if (dir === '/repo/api') {
          return [{ name: 'service.proto', isDirectory: () => false, isFile: () => true }];
        }
        return [];
      });

      fs.readFile.mockImplementation(async (path: string) => {
        return mockFileSystem.get(path) || '';
      });

      const result = await service.detectGrpcApis('/repo');
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        file: 'api/service.proto',
        services: ['UserService'],
        package: 'myapp',
        syntax: 'proto3'
      });
    });

    it('detects multiple services in one proto file', async () => {
      mockFileSystem.set('/repo/services.proto', `
syntax = "proto3";

service AuthService {
  rpc Login(LoginRequest) returns (LoginResponse);
}

service PaymentService {
  rpc ProcessPayment(PaymentRequest) returns (PaymentResponse);
}
`);

      fs.readdir.mockResolvedValue([
        { name: 'services.proto', isDirectory: () => false, isFile: () => true }
      ]);

      fs.readFile.mockImplementation(async (path: string) => {
        return mockFileSystem.get(path) || '';
      });

      const result = await service.detectGrpcApis('/repo');
      
      expect(result).toHaveLength(1);
      expect(result[0].services).toEqual(['AuthService', 'PaymentService']);
    });
  });

  describe('detectRepositoryApis', () => {
    it('detects all API types in a repository', async () => {
      const mockResult = {
        repository: 'test-repo',
        hasAnyApis: true,
        apis: {
          rest: [{ file: 'api.yaml', format: 'yaml', title: 'REST API', version: '3.0.0' }],
          graphql: [{ file: 'schema.graphql', type: 'schema' }],
          grpc: [{ file: 'service.proto', services: ['TestService'] }]
        },
        recommendedButtons: ['swagger', 'graphql', 'grpc', 'postman']
      };
      
      detectRepositoryApis.mockResolvedValue(mockResult);

      const result = await service.detectRepositoryApis('/repo', 'test-repo');
      
      expect(result.repository).toBe('test-repo');
      expect(result.hasAnyApis).toBe(true);
      expect(result.apis.rest).toHaveLength(1);
      expect(result.apis.graphql).toHaveLength(1);
      expect(result.apis.grpc).toHaveLength(1);
      expect(result.recommendedButtons).toContain('swagger');
      expect(result.recommendedButtons).toContain('graphql');
      expect(result.recommendedButtons).toContain('grpc');
      expect(result.recommendedButtons).toContain('postman');
    });

    it('returns no APIs for empty repository', async () => {
      const mockResult = {
        repository: 'empty-repo',
        hasAnyApis: false,
        apis: {
          rest: [],
          graphql: [],
          grpc: []
        },
        recommendedButtons: []
      };
      
      detectRepositoryApis.mockResolvedValue(mockResult);

      const result = await service.detectRepositoryApis('/repo', 'empty-repo');
      
      expect(result.repository).toBe('empty-repo');
      expect(result.hasAnyApis).toBe(false);
      expect(result.apis.rest).toHaveLength(0);
      expect(result.apis.graphql).toHaveLength(0);
      expect(result.apis.grpc).toHaveLength(0);
      expect(result.recommendedButtons).toHaveLength(0);
    });
  });

  describe('determineRecommendedButtons', () => {
    it('recommends swagger for REST APIs', () => {
      const apiDetection = {
        repository: 'test',
        hasAnyApis: true,
        apis: {
          rest: [{ file: 'api.yaml' }],
          graphql: [],
          grpc: []
        },
        recommendedButtons: []
      } as any;
      const buttons = service.determineRecommendedButtons(apiDetection);
      expect(buttons).toContain('swagger');
      expect(buttons).toContain('postman');
    });

    it('recommends graphql for GraphQL APIs', () => {
      const apiDetection = {
        repository: 'test',
        hasAnyApis: true,
        apis: {
          rest: [],
          graphql: [{ file: 'schema.graphql' }],
          grpc: []
        },
        recommendedButtons: []
      } as any;
      const buttons = service.determineRecommendedButtons(apiDetection);
      expect(buttons).toContain('graphql');
      expect(buttons).toContain('postman');
    });

    it('recommends grpc for gRPC APIs', () => {
      const apiDetection = {
        repository: 'test',
        hasAnyApis: true,
        apis: {
          rest: [],
          graphql: [],
          grpc: [{ file: 'service.proto' }]
        },
        recommendedButtons: []
      } as any;
      const buttons = service.determineRecommendedButtons(apiDetection);
      expect(buttons).toContain('grpc');
      expect(buttons).toContain('postman');
    });

    it('recommends all buttons for mixed APIs', () => {
      const apiDetection = {
        repository: 'test',
        hasAnyApis: true,
        apis: {
          rest: [{ file: 'api.yaml' }],
          graphql: [{ file: 'schema.graphql' }],
          grpc: [{ file: 'service.proto' }]
        },
        recommendedButtons: []
      } as any;
      const buttons = service.determineRecommendedButtons(apiDetection);
      expect(buttons).toContain('swagger');
      expect(buttons).toContain('graphql');
      expect(buttons).toContain('grpc');
      expect(buttons).toContain('postman');
    });

    it('returns empty array for no APIs', () => {
      const apiDetection = {
        repository: 'test',
        hasAnyApis: false,
        apis: {
          rest: [],
          graphql: [],
          grpc: []
        },
        recommendedButtons: []
      } as any;
      const buttons = service.determineRecommendedButtons(apiDetection);
      expect(buttons).toHaveLength(0);
    });
  });

  describe('getApiButtonConfiguration', () => {
    it('generates swagger button configuration', () => {
      const apiDetection = {
        repository: 'test-repo',
        hasAnyApis: true,
        apis: {
          rest: [{ file: 'api1.yaml' }, { file: 'api2.yaml' }],
          graphql: [],
          grpc: []
        },
        recommendedButtons: ['swagger', 'postman']
      } as any;

      const config = service.getApiButtonConfiguration(apiDetection, 'test-repo');
      
      expect(config.buttons).toHaveLength(2);
      expect(config.buttons[0]).toMatchObject({
        type: 'swagger',
        label: 'Swagger UI (2 APIs)',
        icon: '📘',
        color: 'bg-green-600',
        url: '/swagger/test-repo'
      });
    });

    it('generates graphql button configuration', () => {
      const apiDetection = {
        repository: 'nslabsdashboards',
        hasAnyApis: true,
        apis: {
          rest: [],
          graphql: Array(19).fill({ file: 'schema.graphql' }),
          grpc: []
        },
        recommendedButtons: ['graphql', 'postman']
      } as any;

      const config = service.getApiButtonConfiguration(apiDetection, 'nslabsdashboards');
      
      const graphqlButton = config.buttons.find(b => b.type === 'graphql');
      expect(graphqlButton).toMatchObject({
        type: 'graphql',
        label: 'GraphQL Playground (19 schemas)',
        icon: '🔮',
        color: 'bg-pink-600',
        url: '/graphql/nslabsdashboards'
      });
    });

    it('generates correct summary', () => {
      const apiDetection = {
        repository: 'test-repo',
        hasAnyApis: true,
        apis: {
          rest: Array(5).fill({}),
          graphql: Array(3).fill({}),
          grpc: Array(2).fill({})
        },
        recommendedButtons: ['swagger', 'graphql', 'grpc', 'postman']
      } as any;

      const config = service.getApiButtonConfiguration(apiDetection, 'test-repo');
      
      expect(config.summary).toEqual({
        rest: 5,
        graphql: 3,
        grpc: 2,
        total: 10
      });
    });
  });
});