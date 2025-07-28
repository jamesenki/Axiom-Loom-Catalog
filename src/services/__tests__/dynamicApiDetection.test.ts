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
  }
}));

const fs = require('fs').promises;

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

      fs.readdir.mockImplementation(async (dir: string) => {
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
        { name: 'swagger.json', isDirectory: () => false }
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
        { name: 'config.yaml', isDirectory: () => false }
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

      fs.readdir.mockImplementation(async (dir: string) => {
        if (dir === '/repo') {
          return [
            { name: 'v1', isDirectory: () => true },
            { name: 'v2', isDirectory: () => true }
          ];
        } else if (dir === '/repo/v1' || dir === '/repo/v2') {
          return [{ name: 'api.yaml', isDirectory: () => false }];
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
        { name: 'schema.graphql', isDirectory: () => false }
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

      fs.readdir.mockImplementation(async (dir: string) => {
        if (dir === '/repo') {
          return [{ name: 'queries', isDirectory: () => true }];
        } else if (dir === '/repo/queries') {
          return [{ name: 'users.graphql', isDirectory: () => false }];
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
        { name: 'types.gql', isDirectory: () => false }
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

      fs.readdir.mockImplementation(async (dir: string) => {
        if (dir === '/repo') {
          return [{ name: 'api', isDirectory: () => true }];
        } else if (dir === '/repo/api') {
          return [{ name: 'service.proto', isDirectory: () => false }];
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
        description: 'User management service'
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
        { name: 'services.proto', isDirectory: () => false }
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
      mockFileSystem.set('/repo/api.yaml', 'openapi: 3.0.0\ninfo:\n  title: REST API');
      mockFileSystem.set('/repo/schema.graphql', 'type Query { test: String }');
      mockFileSystem.set('/repo/service.proto', 'service TestService {}');

      fs.readdir.mockResolvedValue([
        { name: 'api.yaml', isDirectory: () => false },
        { name: 'schema.graphql', isDirectory: () => false },
        { name: 'service.proto', isDirectory: () => false }
      ]);

      fs.readFile.mockImplementation(async (path: string) => {
        return mockFileSystem.get(path) || '';
      });

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
      fs.readdir.mockResolvedValue([]);

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
      const restApis = [{ file: 'api.yaml' }] as any;
      const buttons = service.determineRecommendedButtons(restApis, [], []);
      expect(buttons).toContain('swagger');
      expect(buttons).toContain('postman');
    });

    it('recommends graphql for GraphQL APIs', () => {
      const graphqlApis = [{ file: 'schema.graphql' }] as any;
      const buttons = service.determineRecommendedButtons([], graphqlApis, []);
      expect(buttons).toContain('graphql');
      expect(buttons).toContain('postman');
    });

    it('recommends grpc for gRPC APIs', () => {
      const grpcApis = [{ file: 'service.proto' }] as any;
      const buttons = service.determineRecommendedButtons([], [], grpcApis);
      expect(buttons).toContain('grpc');
      expect(buttons).toContain('postman');
    });

    it('recommends all buttons for mixed APIs', () => {
      const restApis = [{ file: 'api.yaml' }] as any;
      const graphqlApis = [{ file: 'schema.graphql' }] as any;
      const grpcApis = [{ file: 'service.proto' }] as any;
      const buttons = service.determineRecommendedButtons(restApis, graphqlApis, grpcApis);
      expect(buttons).toContain('swagger');
      expect(buttons).toContain('graphql');
      expect(buttons).toContain('grpc');
      expect(buttons).toContain('postman');
    });

    it('returns empty array for no APIs', () => {
      const buttons = service.determineRecommendedButtons([], [], []);
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

      const config = service.getApiButtonConfiguration(apiDetection);
      
      expect(config.buttons).toHaveLength(2);
      expect(config.buttons[0]).toMatchObject({
        type: 'swagger',
        label: 'Swagger UI (2 APIs)',
        icon: '📋',
        color: 'green',
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

      const config = service.getApiButtonConfiguration(apiDetection);
      
      const graphqlButton = config.buttons.find(b => b.type === 'graphql');
      expect(graphqlButton).toMatchObject({
        type: 'graphql',
        label: 'GraphQL Playground (19 schemas)',
        icon: '🔮',
        color: 'pink',
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

      const config = service.getApiButtonConfiguration(apiDetection);
      
      expect(config.summary).toEqual({
        rest: 5,
        graphql: 3,
        grpc: 2,
        total: 10
      });
    });
  });
});