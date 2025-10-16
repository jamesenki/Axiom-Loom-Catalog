/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SyncStatus } from '../SyncStatus';
import { repositorySyncService } from '../../services/repositorySync';

// Mock the repository sync service
jest.mock('../../services/repositorySync', () => ({
  repositorySyncService: {
    getSyncStatus: jest.fn(),
    getLastSyncInfo: jest.fn(),
    syncOnStartup: jest.fn()
  }
}));

const mockGetSyncStatus = repositorySyncService.getSyncStatus as jest.MockedFunction<typeof repositorySyncService.getSyncStatus>;
const mockGetLastSyncInfo = repositorySyncService.getLastSyncInfo as jest.MockedFunction<typeof repositorySyncService.getLastSyncInfo>;
const mockSyncOnStartup = repositorySyncService.syncOnStartup as jest.MockedFunction<typeof repositorySyncService.syncOnStartup>;

describe('SyncStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const defaultSyncStatus = {
    isInProgress: false,
    totalRepositories: 0,
    completedRepositories: 0,
    errors: []
  };

  const defaultLastSyncInfo = {
    timestamp: undefined,
    repositories: []
  };

  it('renders sync status when not in progress', () => {
    mockGetSyncStatus.mockReturnValue(defaultSyncStatus);
    mockGetLastSyncInfo.mockReturnValue(defaultLastSyncInfo);

    render(<SyncStatus />);

    expect(screen.getByText('Repository Sync')).toBeInTheDocument();
    expect(screen.getByText('Last sync: Never')).toBeInTheDocument();
  });

  it('renders sync in progress status', () => {
    mockGetSyncStatus.mockReturnValue({
      isInProgress: true,
      currentRepository: 'test-repo',
      totalRepositories: 10,
      completedRepositories: 3,
      errors: []
    });
    mockGetLastSyncInfo.mockReturnValue(defaultLastSyncInfo);

    render(<SyncStatus />);

    expect(screen.getByText('Syncing Repositories')).toBeInTheDocument();
    expect(screen.getByText('Syncing: test-repo')).toBeInTheDocument();
    expect(screen.getByText('3 of 10')).toBeInTheDocument();
  });

  it('shows progress bar during sync', () => {
    mockGetSyncStatus.mockReturnValue({
      isInProgress: true,
      totalRepositories: 4,
      completedRepositories: 1,
      errors: []
    });
    mockGetLastSyncInfo.mockReturnValue(defaultLastSyncInfo);

    render(<SyncStatus />);

    const progressBar = document.querySelector('.bg-blue-500.transition-all');
    expect(progressBar).toHaveStyle({ width: '25%' });
  });

  it('formats last sync timestamp correctly', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    
    mockGetSyncStatus.mockReturnValue(defaultSyncStatus);
    mockGetLastSyncInfo.mockReturnValue({
      timestamp: twoHoursAgo,
      repositories: []
    });

    render(<SyncStatus />);

    expect(screen.getByText('Last sync: 2 hours ago')).toBeInTheDocument();
  });

  it('expands and collapses details', () => {
    mockGetSyncStatus.mockReturnValue(defaultSyncStatus);
    mockGetLastSyncInfo.mockReturnValue({
      repositories: ['repo1', 'repo2']
    });

    render(<SyncStatus />);

    // Initially collapsed
    expect(screen.queryByText('Synced Repositories (2)')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByLabelText('Expand'));
    expect(screen.getByText('Synced Repositories (2)')).toBeInTheDocument();
    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('repo2')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(screen.getByLabelText('Collapse'));
    expect(screen.queryByText('Synced Repositories (2)')).not.toBeInTheDocument();
  });

  it('shows sync all button when expanded and not syncing', () => {
    mockGetSyncStatus.mockReturnValue(defaultSyncStatus);
    mockGetLastSyncInfo.mockReturnValue(defaultLastSyncInfo);

    render(<SyncStatus />);

    fireEvent.click(screen.getByLabelText('Expand'));
    expect(screen.getByText('Sync All Repositories')).toBeInTheDocument();
  });

  it('handles manual sync', async () => {
    mockGetSyncStatus.mockReturnValue(defaultSyncStatus);
    mockGetLastSyncInfo.mockReturnValue(defaultLastSyncInfo);
    
    const mockResult = {
      success: true,
      syncedRepositories: ['repo1', 'repo2'],
      failedRepositories: [],
      totalTime: 5000,
      timestamp: new Date()
    };
    
    mockSyncOnStartup.mockResolvedValue(mockResult);

    const onSyncComplete = jest.fn();
    render(<SyncStatus onSyncComplete={onSyncComplete} />);

    fireEvent.click(screen.getByLabelText('Expand'));
    fireEvent.click(screen.getByText('Sync All Repositories'));

    await waitFor(() => {
      expect(mockSyncOnStartup).toHaveBeenCalled();
      expect(onSyncComplete).toHaveBeenCalledWith(mockResult);
    });
  });

  it('displays sync errors', () => {
    mockGetSyncStatus.mockReturnValue({
      ...defaultSyncStatus,
      errors: ['Failed to sync repo1: Network error', 'Failed to sync repo2: Permission denied']
    });
    mockGetLastSyncInfo.mockReturnValue(defaultLastSyncInfo);

    render(<SyncStatus />);

    fireEvent.click(screen.getByLabelText('Expand'));
    
    expect(screen.getByText('Sync Errors (2)')).toBeInTheDocument();
    expect(screen.getByText('Failed to sync repo1: Network error')).toBeInTheDocument();
    expect(screen.getByText('Failed to sync repo2: Permission denied')).toBeInTheDocument();
  });

  it('polls for updates during sync', () => {
    mockGetSyncStatus.mockReturnValue({
      isInProgress: true,
      totalRepositories: 5,
      completedRepositories: 0,
      errors: []
    });
    mockGetLastSyncInfo.mockReturnValue(defaultLastSyncInfo);

    render(<SyncStatus />);

    // Initial call
    expect(mockGetSyncStatus).toHaveBeenCalledTimes(1);

    // Advance timer by 1 second
    jest.advanceTimersByTime(1000);
    expect(mockGetSyncStatus).toHaveBeenCalledTimes(2);

    // Advance timer by another second
    jest.advanceTimersByTime(1000);
    expect(mockGetSyncStatus).toHaveBeenCalledTimes(3);
  });

  it('stops polling when sync completes', () => {
    const { rerender } = render(<SyncStatus />);

    // Start with sync in progress
    mockGetSyncStatus.mockReturnValue({
      isInProgress: true,
      totalRepositories: 5,
      completedRepositories: 0,
      errors: []
    });
    mockGetLastSyncInfo.mockReturnValue(defaultLastSyncInfo);

    rerender(<SyncStatus />);

    // Verify polling starts
    jest.advanceTimersByTime(1000);
    const callsWhileSyncing = mockGetSyncStatus.mock.calls.length;

    // Complete sync
    mockGetSyncStatus.mockReturnValue({
      isInProgress: false,
      totalRepositories: 5,
      completedRepositories: 5,
      errors: [],
      lastSyncTime: new Date()
    });

    rerender(<SyncStatus />);

    // Advance timer and verify polling stopped
    jest.advanceTimersByTime(3000);
    expect(mockGetSyncStatus).toHaveBeenCalledTimes(callsWhileSyncing + 1);
  });

  it('shows appropriate status indicator colors', () => {
    const { rerender } = render(<SyncStatus />);

    // Green when successful
    mockGetSyncStatus.mockReturnValue(defaultSyncStatus);
    rerender(<SyncStatus />);
    let indicator = screen.getByText('Repository Sync').previousElementSibling;
    expect(indicator).toHaveClass('bg-green-500');

    // Blue and pulsing when in progress
    mockGetSyncStatus.mockReturnValue({
      ...defaultSyncStatus,
      isInProgress: true
    });
    rerender(<SyncStatus />);
    indicator = screen.getByText('Syncing Repositories').previousElementSibling;
    expect(indicator).toHaveClass('bg-blue-500', 'animate-pulse');

    // Yellow when there are errors
    mockGetSyncStatus.mockReturnValue({
      ...defaultSyncStatus,
      errors: ['Some error']
    });
    rerender(<SyncStatus />);
    indicator = screen.getByText('Repository Sync').previousElementSibling;
    expect(indicator).toHaveClass('bg-yellow-500');
  });

  it('applies custom className', () => {
    mockGetSyncStatus.mockReturnValue(defaultSyncStatus);
    mockGetLastSyncInfo.mockReturnValue(defaultLastSyncInfo);

    render(<SyncStatus className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles sync errors gracefully', async () => {
    mockGetSyncStatus.mockReturnValue(defaultSyncStatus);
    mockGetLastSyncInfo.mockReturnValue(defaultLastSyncInfo);
    mockSyncOnStartup.mockRejectedValue(new Error('Network error'));

    // Mock console.error to prevent error output in tests
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    render(<SyncStatus />);

    fireEvent.click(screen.getByLabelText('Expand'));
    fireEvent.click(screen.getByText('Sync All Repositories'));

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Sync failed:', expect.any(Error));
    });

    consoleError.mockRestore();
  });
});