import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock all components
jest.mock('../Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header</header>,
}));

jest.mock('../RepositoryList', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-list">Repository List</div>,
}));

jest.mock('../RepositoryView', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-view">Repository View</div>,
}));

jest.mock('../DocumentationView', () => ({
  __esModule: true,
  default: () => <div data-testid="documentation-view">Documentation View</div>,
}));

jest.mock('../APIExplorerView', () => ({
  __esModule: true,
  default: () => <div data-testid="api-explorer-view">API Explorer View</div>,
}));

jest.mock('../GraphQLView', () => ({
  __esModule: true,
  default: () => <div data-testid="graphql-view">GraphQL View</div>,
}));

jest.mock('../PostmanView', () => ({
  __esModule: true,
  default: () => <div data-testid="postman-view">Postman View</div>,
}));

jest.mock('../RepositorySync', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-sync">Repository Sync</div>,
}));

// Mock SyncStatus
jest.mock('../SyncStatus', () => ({
  __esModule: true,
  default: ({ onSyncComplete }: any) => <div data-testid="sync-status">Sync Status</div>,
}));

// Mock repository sync service
jest.mock('../../services/repositorySync', () => {
  const mockSyncResult = {
    success: true,
    syncedRepositories: [],
    failedRepositories: [],
    message: 'Sync completed'
  };
  
  return {
    repositorySyncService: {
      syncOnStartup: jest.fn().mockResolvedValue(mockSyncResult)
    },
    SyncResult: jest.fn()
  };
});

// Mock SyncProvider
const mockUpdateSyncResult = jest.fn();
jest.mock('../../contexts/SyncContext', () => ({
  SyncProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSyncContext: () => ({
    syncResult: null,
    isInitialSync: false,
    updateSyncResult: mockUpdateSyncResult
  })
}));

// Import additional testing utilities
import { waitFor, act } from '@testing-library/react';
import { repositorySyncService } from '../../services/repositorySync';

const mockSyncResult = {
  success: true,
  syncedRepositories: [],
  failedRepositories: [],
  message: 'Sync completed'
};

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders Header component', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('has correct container classes', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.App')).toBeInTheDocument();
    expect(container.querySelector('.main-content')).toBeInTheDocument();
  });

  it('renders repository list by default', () => {
    render(<App />);
    expect(screen.getByTestId('repository-list')).toBeInTheDocument();
  });

  it('performs auto-sync on startup', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(repositorySyncService.syncOnStartup).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockUpdateSyncResult).toHaveBeenCalledWith({
        success: true,
        syncedRepositories: [],
        failedRepositories: [],
        message: 'Sync completed'
      });
    });
  });

  it('shows sync status initially', () => {
    render(<App />);
    expect(screen.getByTestId('sync-status')).toBeInTheDocument();
  });

  it('hides sync status after successful sync', async () => {
    render(<App />);
    
    // Initially visible
    expect(screen.getByTestId('sync-status')).toBeInTheDocument();

    // Wait for auto-sync to complete
    await waitFor(() => {
      expect(mockUpdateSyncResult).toHaveBeenCalled();
    });

    // Fast-forward time to hide sync status
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('sync-status')).not.toBeInTheDocument();
    });
  });

  it('keeps sync status visible on failed sync', async () => {
    const failedSyncResult = {
      success: false,
      syncedRepositories: [],
      failedRepositories: ['repo1'],
      message: 'Sync failed'
    };
    
    (repositorySyncService.syncOnStartup as jest.Mock).mockResolvedValueOnce(failedSyncResult);
    
    render(<App />);
    
    await waitFor(() => {
      expect(mockUpdateSyncResult).toHaveBeenCalledWith(failedSyncResult);
    });

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Should still be visible
    expect(screen.getByTestId('sync-status')).toBeInTheDocument();
  });

  it('handles auto-sync errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (repositorySyncService.syncOnStartup as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Auto-sync failed:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('logs startup message', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<App />);
    
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('🚀 Starting auto-sync on application load...');
    });

    consoleLogSpy.mockRestore();
  });
});