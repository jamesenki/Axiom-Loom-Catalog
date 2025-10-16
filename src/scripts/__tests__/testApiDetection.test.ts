import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Mock modules
jest.mock('fs');
jest.mock('child_process');
jest.mock('../dynamicApiDetection', () => ({
  detectRepositoryApis: jest.fn()
}));

// Mock console
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('testApiDetection', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  const runTestScript = () => {
    jest.isolateModules(() => {
      require('../testApiDetection');
    });
  };

  it('tests API detection for a repository', async () => {
    const mockDetectRepositoryApis = jest.requireMock('../dynamicApiDetection').detectRepositoryApis;
    
    mockDetectRepositoryApis.mockResolvedValue({
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api.yaml', title: 'Test API' }],
        graphql: [{ file: 'schema.graphql', type: 'schema' }],
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'graphql', 'postman']
    });

    await runTestScript();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Testing API detection'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Repository: test-repo'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('REST APIs: 1'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('GraphQL APIs: 1'));
  });

  it('handles detection errors gracefully', async () => {
    const mockDetectRepositoryApis = jest.requireMock('../dynamicApiDetection').detectRepositoryApis;
    
    mockDetectRepositoryApis.mockRejectedValue(new Error('Detection failed'));

    await runTestScript();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error during API detection:',
      expect.any(Error)
    );
  });

  it('displays recommended buttons', async () => {
    const mockDetectRepositoryApis = jest.requireMock('../dynamicApiDetection').detectRepositoryApis;
    
    mockDetectRepositoryApis.mockResolvedValue({
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api.yaml' }],
        graphql: [],
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'postman']
    });

    await runTestScript();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Recommended buttons:'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('swagger'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('postman'));
  });

  it('handles repositories with no APIs', async () => {
    const mockDetectRepositoryApis = jest.requireMock('../dynamicApiDetection').detectRepositoryApis;
    
    mockDetectRepositoryApis.mockResolvedValue({
      repository: 'docs-repo',
      apis: {
        rest: [],
        graphql: [],
        grpc: []
      },
      hasAnyApis: false,
      recommendedButtons: []
    });

    await runTestScript();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Has APIs: false'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('REST APIs: 0'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('GraphQL APIs: 0'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('gRPC APIs: 0'));
  });

  it('displays API file details', async () => {
    const mockDetectRepositoryApis = jest.requireMock('../dynamicApiDetection').detectRepositoryApis;
    
    mockDetectRepositoryApis.mockResolvedValue({
      repository: 'detailed-repo',
      apis: {
        rest: [
          { file: 'v1/api.yaml', title: 'API v1', version: '1.0.0' },
          { file: 'v2/api.yaml', title: 'API v2', version: '2.0.0' }
        ],
        graphql: [
          { file: 'schema.graphql', type: 'schema', description: 'Main schema' }
        ],
        grpc: [
          { file: 'service.proto', services: ['UserService', 'AuthService'], package: 'myapp' }
        ]
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'graphql', 'grpc', 'postman']
    });

    await runTestScript();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check REST API details
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('v1/api.yaml'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('API v1'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('1.0.0'));

    // Check GraphQL details
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('schema.graphql'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Main schema'));

    // Check gRPC details
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('service.proto'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('UserService'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('AuthService'));
  });

  it('tests multiple repositories if specified', async () => {
    const mockDetectRepositoryApis = jest.requireMock('../dynamicApiDetection').detectRepositoryApis;
    
    // Mock process.argv to include multiple repos
    const originalArgv = process.argv;
    process.argv = ['node', 'testApiDetection.ts', 'repo1', 'repo2'];

    mockDetectRepositoryApis
      .mockResolvedValueOnce({
        repository: 'repo1',
        apis: { rest: [], graphql: [], grpc: [] },
        hasAnyApis: false,
        recommendedButtons: []
      })
      .mockResolvedValueOnce({
        repository: 'repo2',
        apis: { rest: [{ file: 'api.yaml' }], graphql: [], grpc: [] },
        hasAnyApis: true,
        recommendedButtons: ['swagger', 'postman']
      });

    await runTestScript();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockDetectRepositoryApis).toHaveBeenCalledTimes(2);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Repository: repo1'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Repository: repo2'));

    // Restore process.argv
    process.argv = originalArgv;
  });

  it('displays formatted JSON output', async () => {
    const mockDetectRepositoryApis = jest.requireMock('../dynamicApiDetection').detectRepositoryApis;
    
    const mockResult = {
      repository: 'json-test',
      apis: {
        rest: [{ file: 'api.yaml' }],
        graphql: [],
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'postman']
    };

    mockDetectRepositoryApis.mockResolvedValue(mockResult);

    await runTestScript();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    // Should log the full JSON result
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '\nFull result:',
      JSON.stringify(mockResult, null, 2)
    );
  });

  it('uses default repository name if none provided', async () => {
    const mockDetectRepositoryApis = jest.requireMock('../dynamicApiDetection').detectRepositoryApis;
    
    // Reset process.argv to default
    const originalArgv = process.argv;
    process.argv = ['node', 'testApiDetection.ts'];

    mockDetectRepositoryApis.mockResolvedValue({
      repository: 'future-mobility-oems-platform',
      apis: { rest: [], graphql: [], grpc: [] },
      hasAnyApis: false,
      recommendedButtons: []
    });

    await runTestScript();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockDetectRepositoryApis).toHaveBeenCalledWith('future-mobility-oems-platform');

    // Restore process.argv
    process.argv = originalArgv;
  });
});