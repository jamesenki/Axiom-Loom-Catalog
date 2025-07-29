import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import '@testing-library/jest-dom';
import RepositorySync from '../RepositorySync';
import { repositorySyncService } from '../../services/repositorySync';

// Mock the repository sync service
jest.mock('../../services/repositorySync', () => ({
  repositorySyncService: {
    getLastSyncInfo: jest.fn(),
    getSyncStatus: jest.fn(),
    syncOnStartup: jest.fn()
  },
  SyncResult: jest.fn()
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('RepositorySync Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the sync page with title and description', () => {
    (repositorySyncService.getLastSyncInfo as jest.Mock).mockReturnValue({});
    
    render(<RepositorySync />);
    
    expect(screen.getByText('🔄 Repository Sync')).toBeInTheDocument();
    expect(screen.getByText(/Synchronize all repositories from the GitHub account/)).toBeInTheDocument();
  });

  it('displays last sync information when available', () => {
    const mockLastSync = {
      timestamp: new Date('2025-01-20T10:00:00'),
      repositories: ['repo1', 'repo2']
    };
    
    (repositorySyncService.getLastSyncInfo as jest.Mock).mockReturnValue(mockLastSync);
    
    render(<RepositorySync />);
    
    expect(screen.getByText(/Last sync:/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 20, 2025/)).toBeInTheDocument();
  });

  it('starts manual sync when button is clicked', async () => {
    (repositorySyncService.getLastSyncInfo as jest.Mock).mockReturnValue({});
    (repositorySyncService.getSyncStatus as jest.Mock).mockReturnValue({
      isInProgress: false,
      totalRepositories: 0,
      completedRepositories: 0,
      errors: []
    });
    
    const mockSyncResult = {
      success: true,
      syncedRepositories: ['repo1'],
      failedRepositories: [],
      totalTime: 5000,
      timestamp: new Date()
    };
    
    (repositorySyncService.syncOnStartup as jest.Mock).mockResolvedValue(mockSyncResult);
    
    render(<RepositorySync />);
    
    const syncButton = screen.getByText('🔄 Start Sync');
    fireEvent.click(syncButton);
    
    expect(repositorySyncService.syncOnStartup).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(screen.getByText('Syncing...')).toBeInTheDocument();
    });
  });

  it('displays progress bar during sync', async () => {
    (repositorySyncService.getLastSyncInfo as jest.Mock).mockReturnValue({});
    
    let syncStatusCall = 0;
    (repositorySyncService.getSyncStatus as jest.Mock).mockImplementation(() => {
      syncStatusCall++;
      if (syncStatusCall === 1) {
        return {
          isInProgress: true,
          currentRepository: 'repo1',
          totalRepositories: 3,
          completedRepositories: 1,
          errors: []
        };
      }
      return {
        isInProgress: false,
        totalRepositories: 3,
        completedRepositories: 3,
        errors: []
      };
    });
    
    const mockSyncResult = {
      success: true,
      syncedRepositories: ['repo1', 'repo2', 'repo3'],
      failedRepositories: [],
      totalTime: 5000,
      timestamp: new Date()
    };
    
    (repositorySyncService.syncOnStartup as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(mockSyncResult), 100);
      });
    });
    
    render(<RepositorySync />);
    
    const syncButton = screen.getByText('🔄 Start Sync');
    fireEvent.click(syncButton);
    
    await waitFor(() => {
      expect(screen.getByText('1 / 3 repositories')).toBeInTheDocument();
      expect(screen.getByText('33%')).toBeInTheDocument();
      expect(screen.getByText(/Currently syncing:.*repo1/)).toBeInTheDocument();
    });
  });

  it('displays errors when sync fails', async () => {
    (repositorySyncService.getLastSyncInfo as jest.Mock).mockReturnValue({});
    (repositorySyncService.getSyncStatus as jest.Mock).mockReturnValue({
      isInProgress: false,
      totalRepositories: 0,
      completedRepositories: 0,
      errors: ['Failed to sync repo1: Network error']
    });
    
    (repositorySyncService.syncOnStartup as jest.Mock).mockRejectedValue(
      new Error('Sync failed')
    );
    
    render(<RepositorySync />);
    
    const syncButton = screen.getByText('🔄 Start Sync');
    fireEvent.click(syncButton);
    
    await waitFor(() => {
      expect(screen.getByText('Errors encountered:')).toBeInTheDocument();
      expect(screen.getByText('• Failed to sync repo1: Network error')).toBeInTheDocument();
    });
  });

  it('shows sync results after completion', async () => {
    (repositorySyncService.getLastSyncInfo as jest.Mock).mockReturnValue({});
    (repositorySyncService.getSyncStatus as jest.Mock).mockReturnValue({
      isInProgress: false,
      totalRepositories: 0,
      completedRepositories: 0,
      errors: []
    });
    
    const mockSyncResult = {
      success: true,
      syncedRepositories: ['repo1', 'repo2'],
      failedRepositories: [{
        name: 'repo3',
        error: 'Permission denied'
      }],
      totalTime: 15000,
      timestamp: new Date()
    };
    
    (repositorySyncService.syncOnStartup as jest.Mock).mockResolvedValue(mockSyncResult);
    
    render(<RepositorySync />);
    
    const syncButton = screen.getByText('🔄 Start Sync');
    fireEvent.click(syncButton);
    
    await waitFor(() => {
      expect(screen.getByText('Last Sync Results')).toBeInTheDocument();
      expect(screen.getByText('✅ Success')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Synced repositories count
      expect(screen.getByText('15s')).toBeInTheDocument(); // Duration
    });
  });

  it('toggles details visibility', async () => {
    const mockLastSync = {
      timestamp: new Date(),
      repositories: ['repo1', 'repo2']
    };
    
    (repositorySyncService.getLastSyncInfo as jest.Mock).mockReturnValue(mockLastSync);
    
    const mockSyncResult = {
      success: true,
      syncedRepositories: ['repo1', 'repo2'],
      failedRepositories: [],
      totalTime: 5000,
      timestamp: new Date()
    };
    
    render(<RepositorySync />);
    
    // Set last sync result by updating component state
    const { rerender } = render(<RepositorySync />);
    
    // Show details button should be present
    const showDetailsButton = screen.getByText('Show Details');
    fireEvent.click(showDetailsButton);
    
    expect(screen.getByText('Hide Details')).toBeInTheDocument();
  });

  it('disables sync button during sync', async () => {
    (repositorySyncService.getLastSyncInfo as jest.Mock).mockReturnValue({});
    (repositorySyncService.getSyncStatus as jest.Mock).mockReturnValue({
      isInProgress: true,
      totalRepositories: 1,
      completedRepositories: 0,
      errors: []
    });
    
    const mockSyncPromise = new Promise(() => {}); // Never resolves
    (repositorySyncService.syncOnStartup as jest.Mock).mockReturnValue(mockSyncPromise);
    
    render(<RepositorySync />);
    
    const syncButton = screen.getByRole('button', { name: /Start Sync/i });
    fireEvent.click(syncButton);
    
    await waitFor(() => {
      expect(syncButton).toBeDisabled();
      expect(syncButton).toHaveClass('bg-gray-600 cursor-not-allowed');
    });
  });

  it('formats duration correctly', async () => {
    (repositorySyncService.getLastSyncInfo as jest.Mock).mockReturnValue({});
    
    const testCases = [
      { totalTime: 45000, expected: '45s' },
      { totalTime: 65000, expected: '1m 5s' },
      { totalTime: 125000, expected: '2m 5s' }
    ];
    
    for (const testCase of testCases) {
      const mockSyncResult = {
        success: true,
        syncedRepositories: ['repo1'],
        failedRepositories: [],
        totalTime: testCase.totalTime,
        timestamp: new Date()
      };
      
      (repositorySyncService.syncOnStartup as jest.Mock).mockResolvedValue(mockSyncResult);
      
      const { rerender } = render(<RepositorySync />);
      
      const syncButton = screen.getByText('🔄 Start Sync');
      fireEvent.click(syncButton);
      
      await waitFor(() => {
        expect(screen.getByText(testCase.expected)).toBeInTheDocument();
      });
      
      rerender(<RepositorySync />);
    }
  });

  it('updates sync context on successful sync', async () => {
    const mockUpdateSyncResult = jest.fn();
    jest.spyOn(require('../../contexts/SyncContext'), 'useSyncContext').mockReturnValue({
      updateSyncResult: mockUpdateSyncResult,
      lastSyncResult: null,
      syncVersion: 0
    });
    
    (repositorySyncService.getLastSyncInfo as jest.Mock).mockReturnValue({});
    (repositorySyncService.getSyncStatus as jest.Mock).mockReturnValue({
      isInProgress: false,
      totalRepositories: 0,
      completedRepositories: 0,
      errors: []
    });
    
    const mockSyncResult = {
      success: true,
      syncedRepositories: ['repo1'],
      failedRepositories: [],
      totalTime: 5000,
      timestamp: new Date()
    };
    
    (repositorySyncService.syncOnStartup as jest.Mock).mockResolvedValue(mockSyncResult);
    
    render(<RepositorySync />);
    
    const syncButton = screen.getByText('🔄 Start Sync');
    fireEvent.click(syncButton);
    
    await waitFor(() => {
      expect(mockUpdateSyncResult).toHaveBeenCalledWith(mockSyncResult);
    });
  });
});