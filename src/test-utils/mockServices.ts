/**
 * Mock Services for Testing
 * 
 * Provides mock implementations of application services
 */

import { ApiDetectionResult } from '../services/dynamicApiDetection';
import { SyncResult, SyncStatus } from '../services/repositorySync';

// Mock API Detection Service
export const mockApiDetectionService = {
  detectRepositoryApis: jest.fn((repoName: string): Promise<ApiDetectionResult> => {
    return Promise.resolve({
      repository: repoName,
      apis: {
        rest: [],
        graphql: [],
        grpc: []
      },
      hasAnyApis: false,
      recommendedButtons: []
    });
  })
};

// Mock Repository Sync Service
export const mockRepositorySyncService = {
  getSyncStatus: jest.fn((): SyncStatus => ({
    isInProgress: false,
    totalRepositories: 0,
    completedRepositories: 0,
    errors: []
  })),
  
  getLastSyncInfo: jest.fn(() => ({})),
  
  syncOnStartup: jest.fn((): Promise<SyncResult> => {
    return Promise.resolve({
      success: true,
      syncedRepositories: [],
      failedRepositories: [],
      totalTime: 0,
      timestamp: new Date()
    });
  }),
  
  manualSync: jest.fn((): Promise<SyncResult> => {
    return Promise.resolve({
      success: true,
      syncedRepositories: [],
      failedRepositories: [],
      totalTime: 0,
      timestamp: new Date()
    });
  })
};

// Mock GitHub API Service
export const mockGitHubService = {
  fetchFile: jest.fn((repo: string, path: string) => {
    return Promise.resolve({
      content: '# Mock Content',
      sha: 'mock-sha'
    });
  }),
  
  fetchRepositoryInfo: jest.fn((repo: string) => {
    return Promise.resolve({
      name: repo,
      description: 'Mock repository',
      language: 'TypeScript',
      topics: ['mock'],
      updated_at: new Date().toISOString()
    });
  })
};

// Mock File System Service
export const mockFileSystemService = {
  readFile: jest.fn((path: string) => {
    return Promise.resolve('Mock file content');
  }),
  
  writeFile: jest.fn((path: string, content: string) => {
    return Promise.resolve();
  }),
  
  exists: jest.fn((path: string) => {
    return Promise.resolve(true);
  })
};

// Helper to reset all mocks
export const resetAllMocks = () => {
  Object.values(mockApiDetectionService).forEach(mock => {
    if (typeof mock === 'function' && 'mockReset' in mock) {
      mock.mockReset();
    }
  });
  
  Object.values(mockRepositorySyncService).forEach(mock => {
    if (typeof mock === 'function' && 'mockReset' in mock) {
      mock.mockReset();
    }
  });
  
  Object.values(mockGitHubService).forEach(mock => {
    if (typeof mock === 'function' && 'mockReset' in mock) {
      mock.mockReset();
    }
  });
  
  Object.values(mockFileSystemService).forEach(mock => {
    if (typeof mock === 'function' && 'mockReset' in mock) {
      mock.mockReset();
    }
  });
};