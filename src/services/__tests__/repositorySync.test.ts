import { repositorySyncService } from '../repositorySync';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Mock dependencies
jest.mock('child_process');
jest.mock('fs');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('RepositorySyncService', () => {
  const CLONED_REPOS_PATH = path.join(__dirname, '../../cloned-repositories');
  const SYNC_STATUS_FILE = path.join(__dirname, '../../.sync-status.json');

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockFs.existsSync.mockReturnValue(true);
    mockFs.mkdirSync.mockImplementation();
    mockFs.readFileSync.mockReturnValue('{}');
    mockFs.writeFileSync.mockImplementation();
    mockFs.readdirSync.mockReturnValue([]);
    mockFs.statSync.mockReturnValue({
      mtime: new Date()
    } as any);
  });

  describe('constructor', () => {
    it('creates cloned repositories directory if it does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      
      // Create a new instance to trigger constructor
      const service = new (repositorySyncService.constructor as any)();
      
      expect(mockFs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('cloned-repositories'),
        { recursive: true }
      );
    });
  });

  describe('getSyncStatus', () => {
    it('returns current sync status', () => {
      const status = repositorySyncService.getSyncStatus();
      
      expect(status).toMatchObject({
        isInProgress: false,
        totalRepositories: 0,
        completedRepositories: 0,
        errors: []
      });
    });
  });

  describe('getLastSyncInfo', () => {
    it('returns last sync info from file', () => {
      const mockSyncData = {
        timestamp: '2025-01-01T00:00:00.000Z',
        repositories: ['repo1', 'repo2']
      };
      
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockSyncData));
      
      const info = repositorySyncService.getLastSyncInfo();
      
      expect(info).toMatchObject({
        timestamp: new Date('2025-01-01T00:00:00.000Z'),
        repositories: ['repo1', 'repo2']
      });
    });

    it('returns empty object if sync status file does not exist', () => {
      mockFs.existsSync.mockImplementation((path) => {
        if (path === SYNC_STATUS_FILE) return false;
        return true;
      });
      
      const info = repositorySyncService.getLastSyncInfo();
      
      expect(info).toEqual({});
    });

    it('handles JSON parse errors gracefully', () => {
      mockFs.readFileSync.mockReturnValue('invalid json');
      
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const info = repositorySyncService.getLastSyncInfo();
      
      expect(info).toEqual({});
      expect(consoleError).toHaveBeenCalled();
      
      consoleError.mockRestore();
    });
  });

  describe('syncOnStartup', () => {
    it('syncs all repositories from GitHub', async () => {
      const mockRepos = [
        {
          name: 'repo1',
          description: 'Test repo 1',
          url: 'https://github.com/test/repo1',
          updatedAt: '2025-01-01T00:00:00Z',
          primaryLanguage: { name: 'TypeScript' },
          repositoryTopics: [{ name: 'test' }],
          hasReadme: true
        },
        {
          name: 'repo2',
          description: 'Test repo 2',
          url: 'https://github.com/test/repo2',
          updatedAt: '2025-01-02T00:00:00Z',
          primaryLanguage: { name: 'JavaScript' },
          repositoryTopics: [],
          hasReadme: false
        }
      ];
      
      mockExecSync.mockImplementation((cmd: any) => {
        if (cmd.includes('gh repo list')) {
          return Buffer.from(JSON.stringify(mockRepos));
        }
        return Buffer.from('');
      });
      
      const result = await repositorySyncService.syncOnStartup();
      
      expect(result).toMatchObject({
        success: true,
        syncedRepositories: ['repo1', 'repo2'],
        failedRepositories: [],
        timestamp: expect.any(Date)
      });
      
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('gh repo list'),
        expect.any(Object)
      );
    });

    it('updates existing repositories', async () => {
      const mockRepos = [{ 
        name: 'existing-repo',
        url: 'https://github.com/test/existing-repo',
        updatedAt: '2025-01-01T00:00:00Z'
      }];
      
      mockExecSync.mockImplementation((cmd: any) => {
        if (cmd.includes('gh repo list')) {
          return Buffer.from(JSON.stringify(mockRepos));
        }
        return Buffer.from('');
      });
      
      mockFs.existsSync.mockImplementation((path: any) => {
        if (path.includes('existing-repo')) return true;
        return true;
      });
      
      await repositorySyncService.syncOnStartup();
      
      expect(mockExecSync).toHaveBeenCalledWith(
        'git fetch --all',
        expect.objectContaining({ cwd: expect.stringContaining('existing-repo') })
      );
      
      expect(mockExecSync).toHaveBeenCalledWith(
        'git pull origin main || git pull origin master',
        expect.objectContaining({ cwd: expect.stringContaining('existing-repo') })
      );
    });

    it('clones new repositories', async () => {
      const mockRepos = [{ 
        name: 'new-repo',
        url: 'https://github.com/test/new-repo',
        updatedAt: '2025-01-01T00:00:00Z'
      }];
      
      mockExecSync.mockImplementation((cmd: any) => {
        if (cmd.includes('gh repo list')) {
          return Buffer.from(JSON.stringify(mockRepos));
        }
        return Buffer.from('');
      });
      
      mockFs.existsSync.mockImplementation((path: any) => {
        if (path.includes('new-repo')) return false;
        return true;
      });
      
      await repositorySyncService.syncOnStartup();
      
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('gh repo clone'),
        expect.objectContaining({ stdio: 'inherit' })
      );
    });

    it('handles sync failures gracefully', async () => {
      const mockRepos = [
        { name: 'good-repo', url: 'https://github.com/test/good-repo', updatedAt: '2025-01-01T00:00:00Z' },
        { name: 'bad-repo', url: 'https://github.com/test/bad-repo', updatedAt: '2025-01-01T00:00:00Z' }
      ];
      
      mockExecSync.mockImplementation((cmd: any) => {
        if (cmd.includes('gh repo list')) {
          return Buffer.from(JSON.stringify(mockRepos));
        }
        if (cmd.includes('bad-repo')) {
          throw new Error('Permission denied');
        }
        return Buffer.from('');
      });
      
      const result = await repositorySyncService.syncOnStartup();
      
      expect(result).toMatchObject({
        success: false,
        syncedRepositories: ['good-repo'],
        failedRepositories: [{ name: 'bad-repo', error: 'Permission denied' }]
      });
    });

    it('falls back to local repositories if GitHub CLI fails', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('GitHub CLI not found');
      });
      
      mockFs.readdirSync.mockReturnValue([
        { name: 'local-repo1', isDirectory: () => true },
        { name: 'local-repo2', isDirectory: () => true },
        { name: '.git', isDirectory: () => true }, // Should be ignored
        { name: 'file.txt', isDirectory: () => false } // Should be ignored
      ] as any);
      
      mockFs.existsSync.mockImplementation((path: any) => {
        if (path.includes('README.md')) return true;
        return true;
      });
      
      const result = await repositorySyncService.syncOnStartup();
      
      expect(result.syncedRepositories).toEqual(['local-repo1', 'local-repo2']);
    });

    it('saves sync status to disk', async () => {
      const mockRepos = [{ 
        name: 'repo1',
        url: 'https://github.com/test/repo1',
        updatedAt: '2025-01-01T00:00:00Z'
      }];
      
      mockExecSync.mockImplementation((cmd: any) => {
        if (cmd.includes('gh repo list')) {
          return Buffer.from(JSON.stringify(mockRepos));
        }
        return Buffer.from('');
      });
      
      await repositorySyncService.syncOnStartup();
      
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('.sync-status.json'),
        expect.stringContaining('"repositories":["repo1"]')
      );
    });
  });

  describe('getRepositoryDescription', () => {
    it('reads description from package.json', () => {
      mockFs.existsSync.mockImplementation((path: any) => {
        if (path.includes('package.json')) return true;
        return false;
      });
      
      mockFs.readFileSync.mockImplementation((path: any) => {
        if (path.includes('package.json')) {
          return JSON.stringify({ description: 'Test package description' });
        }
        return '';
      });
      
      const service = repositorySyncService as any;
      const description = service.getRepositoryDescription('/test/repo');
      
      expect(description).toBe('Test package description');
    });

    it('reads description from README.md if package.json not available', () => {
      mockFs.existsSync.mockImplementation((path: any) => {
        if (path.includes('README.md')) return true;
        return false;
      });
      
      mockFs.readFileSync.mockImplementation((path: any) => {
        if (path.includes('README.md')) {
          return '# Test Repository\n\nThis is a test repository description.\n\n## Features';
        }
        return '';
      });
      
      const service = repositorySyncService as any;
      const description = service.getRepositoryDescription('/test/repo');
      
      expect(description).toBe('This is a test repository description.');
    });
  });

  describe('detectLanguage', () => {
    it('detects TypeScript projects', () => {
      mockFs.existsSync.mockImplementation((path: any) => {
        if (path.includes('tsconfig.json')) return true;
        return false;
      });
      
      const service = repositorySyncService as any;
      const language = service.detectLanguage('/test/repo');
      
      expect(language).toBe('TypeScript');
    });

    it('detects Python projects', () => {
      mockFs.existsSync.mockImplementation((path: any) => {
        if (path.includes('requirements.txt')) return true;
        return false;
      });
      
      const service = repositorySyncService as any;
      const language = service.detectLanguage('/test/repo');
      
      expect(language).toBe('Python');
    });

    it('detects language by file extensions', () => {
      mockFs.readdirSync.mockReturnValue(['main.go', 'utils.go', 'README.md'] as any);
      
      const service = repositorySyncService as any;
      const language = service.detectLanguage('/test/repo');
      
      expect(language).toBe('Go');
    });
  });

  describe('hasApiDocs', () => {
    it('detects OpenAPI documentation', () => {
      mockFs.readdirSync.mockImplementation(() => [
        { name: 'openapi.yaml', isDirectory: () => false, isFile: () => true }
      ] as any);
      
      const service = repositorySyncService as any;
      const hasApi = service.hasApiDocs('/test/repo');
      
      expect(hasApi).toBe(true);
    });

    it('detects GraphQL schemas', () => {
      mockFs.readdirSync.mockImplementation(() => [
        { name: 'schema.graphql', isDirectory: () => false, isFile: () => true }
      ] as any);
      
      const service = repositorySyncService as any;
      const hasApi = service.hasApiDocs('/test/repo');
      
      expect(hasApi).toBe(true);
    });

    it('detects gRPC proto files', () => {
      mockFs.readdirSync.mockImplementation(() => [
        { name: 'service.proto', isDirectory: () => false, isFile: () => true }
      ] as any);
      
      const service = repositorySyncService as any;
      const hasApi = service.hasApiDocs('/test/repo');
      
      expect(hasApi).toBe(true);
    });

    it('searches subdirectories for API docs', () => {
      mockFs.readdirSync.mockImplementation((dir: any) => {
        if (dir.includes('/api')) {
          return [
            { name: 'swagger.json', isDirectory: () => false, isFile: () => true }
          ] as any;
        }
        return [
          { name: 'api', isDirectory: () => true, isFile: () => false }
        ] as any;
      });
      
      const service = repositorySyncService as any;
      const hasApi = service.hasApiDocs('/test/repo');
      
      expect(hasApi).toBe(true);
    });
  });
});