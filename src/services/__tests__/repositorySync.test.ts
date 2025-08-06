import { repositorySyncService, SyncResult } from '../repositorySync';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('repositorySyncService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    (global.fetch as jest.Mock).mockClear();
  });

  describe('getSyncStatus', () => {
    it('returns current sync status', async () => {
      const mockStatus = {
        isInProgress: false,
        totalRepositories: 0,
        completedRepositories: 0,
        errors: []
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatus
      });
      
      const status = await repositorySyncService.getSyncStatus();
      expect(status).toMatchObject(mockStatus);
    });

    it('returns default status on error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      const status = await repositorySyncService.getSyncStatus();
      expect(status).toBeDefined();
      expect(status.isInProgress).toBe(false);
    });
  });

  describe('getLastSyncInfo', () => {
    it('returns empty object when no sync has occurred', () => {
      const info = repositorySyncService.getLastSyncInfo();
      expect(info).toEqual({});
    });

    it('returns last sync information from localStorage', () => {
      const mockDate = new Date('2025-01-20T10:00:00');
      const mockResult: SyncResult = {
        success: true,
        syncedRepositories: ['repo1', 'repo2'],
        failedRepositories: [],
        totalTime: 5000,
        timestamp: mockDate
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        timestamp: mockDate.toISOString(),
        result: {
          ...mockResult,
          timestamp: mockDate.toISOString()
        }
      }));

      const info = repositorySyncService.getLastSyncInfo();
      expect(new Date(info.timestamp)).toEqual(mockDate);
      expect(info.result).toEqual({
        ...mockResult,
        timestamp: mockDate.toISOString()
      });
    });
  });

  describe('syncOnStartup', () => {
    it('syncs all repositories successfully', async () => {
      const mockResult: SyncResult = {
        success: true,
        syncedRepositories: ['repo1', 'repo2'],
        failedRepositories: [],
        totalTime: 5000,
        timestamp: new Date()
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult
      });
      
      const result = await repositorySyncService.syncOnStartup();

      expect(result.success).toBe(true);
      expect(result.syncedRepositories).toEqual(['repo1', 'repo2']);
      expect(result.failedRepositories).toEqual([]);
      expect(result.totalTime).toBe(5000);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('handles sync errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Server error'
      });

      const result = await repositorySyncService.syncOnStartup();

      expect(result.success).toBe(false);
      expect(result.syncedRepositories).toEqual([]);
      expect(result.failedRepositories).toEqual([]);
      expect(result.totalTime).toBe(0);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('handles network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await repositorySyncService.syncOnStartup();

      expect(result.success).toBe(false);
      expect(result.syncedRepositories).toEqual([]);
      expect(result.failedRepositories).toEqual([]);
    });
  });

  describe('startSync', () => {
    it('starts sync with limit parameter', async () => {
      const mockResult: SyncResult = {
        success: true,
        syncedRepositories: ['repo1'],
        failedRepositories: [],
        totalTime: 3000,
        timestamp: new Date()
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult
      });
      
      const result = await repositorySyncService.startSync(10);

      expect(global.fetch).toHaveBeenCalledWith('/api/repository/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: 10 })
      });
      expect(result).toEqual(mockResult);
    });

    it('throws error on failed sync', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(repositorySyncService.startSync()).rejects.toThrow('Sync failed');
    });
  });

  describe('cloneRepository', () => {
    it('clones repository successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await expect(repositorySyncService.cloneRepository('test-repo')).resolves.not.toThrow();
      
      expect(global.fetch).toHaveBeenCalledWith('/api/repository/clone/test-repo', {
        method: 'POST'
      });
    });

    it('throws error on failed clone', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(repositorySyncService.cloneRepository('test-repo')).rejects.toThrow('Clone failed');
    });
  });

  describe('updateRepositoryMetadata', () => {
    it('updates metadata successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await expect(repositorySyncService.updateRepositoryMetadata('test-repo')).resolves.not.toThrow();
      
      expect(global.fetch).toHaveBeenCalledWith('/api/repository/metadata/test-repo', {
        method: 'PUT'
      });
    });

    it('throws error on failed update', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(repositorySyncService.updateRepositoryMetadata('test-repo')).rejects.toThrow('Metadata update failed');
    });
  });

  describe('error handling', () => {
    it('handles permission errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Permission denied'));

      await expect(repositorySyncService.startSync()).rejects.toThrow('Permission denied');
    });

    it('handles network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network timeout'));

      await expect(repositorySyncService.cloneRepository('test-repo')).rejects.toThrow('Network timeout');
    });
  });
});