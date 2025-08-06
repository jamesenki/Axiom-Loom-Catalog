import { repositorySyncService } from '../repositorySync';

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

describe('repositorySyncService - Simple', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    (global.fetch as jest.Mock).mockClear();
  });

  describe('basic functionality', () => {
    it('initializes with correct default status', async () => {
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
      expect(status.isInProgress).toBe(false);
      expect(status.totalRepositories).toBe(0);
      expect(status.completedRepositories).toBe(0);
      expect(status.errors).toEqual([]);
    });

    it('returns empty last sync info when no previous sync', () => {
      const info = repositorySyncService.getLastSyncInfo();
      expect(info).toEqual({});
    });

    it('handles empty repository list gracefully', async () => {
      const mockResult = {
        success: true,
        syncedRepositories: [],
        failedRepositories: [],
        totalTime: 0,
        timestamp: new Date()
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult
      });
      
      const result = await repositorySyncService.syncOnStartup();
      
      expect(result.success).toBe(true);
      expect(result.syncedRepositories).toEqual([]);
      expect(result.failedRepositories).toEqual([]);
    });

  });

  describe('error scenarios', () => {
    it('handles API errors without crashing', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
      
      const result = await repositorySyncService.syncOnStartup();
      
      expect(result.success).toBe(false);
      expect(result.syncedRepositories).toEqual([]);
      expect(result.failedRepositories).toEqual([]);
    });

    it('continues operation when localStorage fails', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const info = repositorySyncService.getLastSyncInfo();
      expect(info).toEqual({});
    });

    it('handles malformed localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const info = repositorySyncService.getLastSyncInfo();
      expect(info).toEqual({});
    });
  });

  describe('API interaction', () => {
    it('calls correct endpoint for sync', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          syncedRepositories: [],
          failedRepositories: [],
          totalTime: 0,
          timestamp: new Date()
        })
      });
      
      await repositorySyncService.syncOnStartup();
      
      expect(global.fetch).toHaveBeenCalledWith('/api/repository/sync', expect.objectContaining({
        method: 'POST'
      }));
    });

    it('includes proper headers in API calls', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });
      
      await repositorySyncService.startSync();
      
      expect(global.fetch).toHaveBeenCalledWith('/api/repository/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
    });
  });
});