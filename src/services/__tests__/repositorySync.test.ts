import { syncRepositories, syncSingleRepository, SyncResult } from '../repositorySync';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('child_process');
jest.mock('fs');

const mockExec = exec as jest.MockedFunction<typeof exec>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('repositorySync', () => {
  const mockRepositories = [
    { url: 'https://github.com/org/repo1.git', name: 'repo1' },
    { url: 'https://github.com/org/repo2.git', name: 'repo2' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFs.existsSync.mockReturnValue(false);
    mockFs.mkdirSync.mockImplementation(() => undefined);
  });

  describe('syncSingleRepository', () => {
    it('clones repository when it does not exist', async () => {
      mockExec.mockImplementation((cmd, opts, callback) => {
        if (callback) {
          callback(null, 'Cloned successfully', '');
        }
        return {} as any;
      });

      const result = await syncSingleRepository(
        'https://github.com/org/test-repo.git',
        'test-repo'
      );

      expect(result).toEqual({
        name: 'test-repo',
        status: 'success',
        action: 'cloned',
        message: 'Successfully cloned test-repo'
      });

      expect(mockExec).toHaveBeenCalledWith(
        expect.stringContaining('git clone'),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('pulls repository when it already exists', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockExec.mockImplementation((cmd, opts, callback) => {
        if (callback) {
          callback(null, 'Already up to date.', '');
        }
        return {} as any;
      });

      const result = await syncSingleRepository(
        'https://github.com/org/test-repo.git',
        'test-repo'
      );

      expect(result).toEqual({
        name: 'test-repo',
        status: 'success',
        action: 'updated',
        message: 'Successfully updated test-repo'
      });

      expect(mockExec).toHaveBeenCalledWith(
        expect.stringContaining('git pull'),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('handles clone error', async () => {
      mockExec.mockImplementation((cmd, opts, callback) => {
        if (callback) {
          callback(new Error('Clone failed'), '', 'Clone error');
        }
        return {} as any;
      });

      const result = await syncSingleRepository(
        'https://github.com/org/test-repo.git',
        'test-repo'
      );

      expect(result).toEqual({
        name: 'test-repo',
        status: 'error',
        action: 'clone',
        message: 'Failed to clone test-repo: Clone failed'
      });
    });

    it('handles pull error', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockExec.mockImplementation((cmd, opts, callback) => {
        if (callback) {
          callback(new Error('Pull failed'), '', 'Pull error');
        }
        return {} as any;
      });

      const result = await syncSingleRepository(
        'https://github.com/org/test-repo.git',
        'test-repo'
      );

      expect(result).toEqual({
        name: 'test-repo',
        status: 'error',
        action: 'update',
        message: 'Failed to update test-repo: Pull failed'
      });
    });

    it('creates cloned-repositories directory if it does not exist', async () => {
      mockExec.mockImplementation((cmd, opts, callback) => {
        if (callback) {
          callback(null, 'Success', '');
        }
        return {} as any;
      });

      await syncSingleRepository(
        'https://github.com/org/test-repo.git',
        'test-repo'
      );

      expect(mockFs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('cloned-repositories'),
        { recursive: true }
      );
    });
  });

  describe('syncRepositories', () => {
    it('syncs all repositories successfully', async () => {
      mockExec.mockImplementation((cmd, opts, callback) => {
        if (callback) {
          callback(null, 'Success', '');
        }
        return {} as any;
      });

      const results = await syncRepositories(mockRepositories);

      expect(results).toHaveLength(2);
      expect(results[0]).toMatchObject({
        name: 'repo1',
        status: 'success',
        action: 'cloned'
      });
      expect(results[1]).toMatchObject({
        name: 'repo2',
        status: 'success',
        action: 'cloned'
      });
    });

    it('handles mixed success and failure', async () => {
      let callCount = 0;
      mockExec.mockImplementation((cmd, opts, callback) => {
        if (callback) {
          if (callCount === 0) {
            callCount++;
            callback(null, 'Success', '');
          } else {
            callback(new Error('Failed'), '', 'Error');
          }
        }
        return {} as any;
      });

      const results = await syncRepositories(mockRepositories);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('success');
      expect(results[1].status).toBe('error');
    });

    it('returns empty array for empty repository list', async () => {
      const results = await syncRepositories([]);
      expect(results).toEqual([]);
    });

    it('handles repositories with existing directories', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockExec.mockImplementation((cmd, opts, callback) => {
        if (callback) {
          callback(null, 'Already up to date.', '');
        }
        return {} as any;
      });

      const results = await syncRepositories(mockRepositories);

      expect(results).toHaveLength(2);
      expect(results[0].action).toBe('updated');
      expect(results[1].action).toBe('updated');
    });

    it('preserves repository metadata in results', async () => {
      mockExec.mockImplementation((cmd, opts, callback) => {
        if (callback) {
          callback(null, 'Success', '');
        }
        return {} as any;
      });

      const results = await syncRepositories(mockRepositories);

      expect(results[0].name).toBe('repo1');
      expect(results[1].name).toBe('repo2');
    });
  });

  describe('error handling', () => {
    it('handles command execution timeout', async () => {
      mockExec.mockImplementation((cmd, opts, callback) => {
        // Simulate timeout by not calling callback
        return {} as any;
      });

      // This would timeout in real scenario
      // For testing, we'll mock the timeout behavior
      const promise = syncSingleRepository(
        'https://github.com/org/test-repo.git',
        'test-repo'
      );

      // In real implementation, this would timeout
      // For now, manually resolve to test the structure
      mockExec.mockImplementation((cmd, opts, callback) => {
        if (callback) {
          callback(new Error('Timeout'), '', '');
        }
        return {} as any;
      });

      const result = await promise;
      expect(result.status).toBe('error');
    });

    it('handles invalid repository URL', async () => {
      const result = await syncSingleRepository(
        'invalid-url',
        'test-repo'
      );

      // The implementation might validate URLs
      // For now, it will try to clone and fail
      expect(result.status).toBe('error');
    });

    it('handles file system errors', async () => {
      mockFs.existsSync.mockImplementation(() => {
        throw new Error('FS Error');
      });

      const result = await syncSingleRepository(
        'https://github.com/org/test-repo.git',
        'test-repo'
      );

      expect(result.status).toBe('error');
      expect(result.message).toContain('FS Error');
    });
  });
});