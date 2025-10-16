/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';
import { ThemeProvider } from 'styled-components';
import theme from '../../styles/design-system/theme';

// Import additional testing utilities
import { waitFor, act } from '@testing-library/react';
import { repositorySyncService } from '../../services/repositorySync';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => element,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
}));

// Mock all components
jest.mock('../styled/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header</header>,
}));

jest.mock('../styled/RepositoryListSimple', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-list">Repository List</div>,
}));

jest.mock('../RepositoryDetailRedesigned', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-detail">Repository Detail</div>,
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

jest.mock('../GraphQLPlaygroundView', () => ({
  __esModule: true,
  default: () => <div data-testid="graphql-playground-view">GraphQL Playground View</div>,
}));

jest.mock('../PostmanView', () => ({
  __esModule: true,
  default: () => <div data-testid="postman-view">Postman View</div>,
}));

jest.mock('../SwaggerViewer', () => ({
  __esModule: true,
  default: () => <div data-testid="swagger-viewer">Swagger Viewer</div>,
}));

jest.mock('../APIDocumentationHub', () => ({
  __esModule: true,
  default: () => <div data-testid="api-documentation-hub">API Documentation Hub</div>,
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

// Mock GlobalSearchModal
jest.mock('../GlobalSearchModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: any) => 
    isOpen ? <div data-testid="global-search-modal">Global Search Modal</div> : null,
}));

// Mock auth components
jest.mock('../../contexts/BypassAuthContext', () => ({
  __esModule: true,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: { email: 'test@example.com' },
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: true,
  }),
}));

jest.mock('../auth/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../auth/Login', () => ({
  __esModule: true,
  default: () => <div data-testid="login">Login</div>,
}));

jest.mock('../auth/AuthCallback', () => ({
  __esModule: true,
  default: () => <div data-testid="auth-callback">Auth Callback</div>,
}));

jest.mock('../auth/UserProfile', () => ({
  __esModule: true,
  default: () => <div data-testid="user-profile">User Profile</div>,
}));

jest.mock('../auth/LocalLogin', () => ({
  __esModule: true,
  default: () => <div data-testid="local-login">Local Login</div>,
}));

// Mock ErrorBoundary
jest.mock('../ErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock KeyboardShortcuts and EnhancedSearchModal
jest.mock('../KeyboardShortcuts', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../EnhancedSearchModal', () => ({
  __esModule: true,
  default: () => null,
}));

// Mock PageTransition
jest.mock('../PageTransition', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock GlobalStyles and Container
jest.mock('../../styles/GlobalStyles', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../styled/Container', () => ({
  __esModule: true,
  Container: ({ children, as, ...props }: any) => {
    const Component = as || 'div';
    return <Component {...props}>{children}</Component>;
  },
}));

// Mock hooks
jest.mock('../../hooks/useGlobalSearch', () => ({
  useGlobalSearch: () => ({
    isSearchOpen: false,
    openSearch: jest.fn(),
    closeSearch: jest.fn(),
  }),
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

const mockSyncResult = {
  success: true,
  syncedRepositories: [],
  failedRepositories: [],
  message: 'Sync completed'
};

// Helper function to render with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
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
    renderWithTheme(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders Header component', async () => {
    renderWithTheme(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  it('has correct container structure', async () => {
    renderWithTheme(<App />);
    
    await waitFor(() => {
      const mainElement = document.querySelector('main');
      expect(mainElement).toBeInTheDocument();
    });
  });

  it('renders repository list by default', async () => {
    renderWithTheme(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('repository-list')).toBeInTheDocument();
    });
  });

  it('does not show sync status initially', () => {
    renderWithTheme(<App />);
    expect(screen.queryByTestId('sync-status')).not.toBeInTheDocument();
  });

  it('does not perform auto-sync on startup', async () => {
    renderWithTheme(<App />);
    
    await waitFor(() => {
      expect(repositorySyncService.syncOnStartup).not.toHaveBeenCalled();
    });
  });

  it('registers service worker in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const mockRegister = jest.fn().mockResolvedValue({ scope: '/' });
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register: mockRegister },
      writable: true,
    });

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    renderWithTheme(<App />);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('/service-worker.js');
    });

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Service Worker registered:', expect.any(Object));
    });

    consoleLogSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it('handles service worker registration failure', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const mockRegister = jest.fn().mockRejectedValue(new Error('Registration failed'));
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register: mockRegister },
      writable: true,
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    renderWithTheme(<App />);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('/service-worker.js');
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Service Worker registration failed:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it('does not register service worker in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const mockRegister = jest.fn();
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register: mockRegister },
      writable: true,
    });
    
    renderWithTheme(<App />);
    
    expect(mockRegister).not.toHaveBeenCalled();
    
    process.env.NODE_ENV = originalEnv;
  });
});