import { repositorySyncService } from '../repositorySync';
import { execSync } from 'child_process';
import fs from 'fs';

// Mock modules
jest.mock('child_process');
jest.mock('fs');

describe('repositorySyncService - Simple', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock fs methods
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);
    (fs.readFileSync as jest.Mock).mockReturnValue('{}');
    (fs.statSync as jest.Mock).mockReturnValue({ mtime: new Date() });
    
    // Mock fs.readdirSync
    (fs.readdirSync as jest.Mock).mockReturnValue([]);
    
    // Mock execSync for GitHub CLI
    (execSync as jest.Mock).mockImplementation((cmd) => {
      if (cmd.includes('gh repo list')) {
        // Return empty array to avoid complex mocking
        return '[]';
      }
      return '';
    });
  });

  describe('basic functionality', () => {
    it('initializes with correct default status', () => {
      const status = repositorySyncService.getSyncStatus();
      expect(status.isInProgress).toBe(false);
      expect(status.totalRepositories).toBe(0);
      expect(status.completedRepositories).toBe(0);
      expect(status.errors).toEqual([]);
    });

    it('returns empty last sync info when no previous sync', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const info = repositorySyncService.getLastSyncInfo();
      expect(info).toEqual({});
    });

    it('handles empty repository list gracefully', async () => {
      const result = await repositorySyncService.syncOnStartup();
      
      expect(result.success).toBe(true);
      expect(result.syncedRepositories).toEqual([]);
      expect(result.failedRepositories).toEqual([]);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.totalTime).toBeGreaterThanOrEqual(0);
    });

    it('falls back to local repositories when GitHub CLI fails', async () => {
      // Make GitHub CLI fail
      (execSync as jest.Mock).mockImplementation((cmd) => {
        if (cmd.includes('gh repo list')) {
          throw new Error('GitHub CLI not available');
        }
        return '';
      });

      // Mock local repositories
      (fs.readdirSync as jest.Mock).mockReturnValue([
        { name: 'local-repo', isDirectory: () => true }
      ]);

      const result = await repositorySyncService.syncOnStartup();
      
      expect(result.success).toBe(true);
      expect(result.syncedRepositories).toEqual(['local-repo']);
    });
  });
});