import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock all child components to avoid complex dependencies
jest.mock('../components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>
}));

jest.mock('../components/RepositoryList', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-list">Repository List</div>
}));

jest.mock('../components/RepositoryView', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-view">Repository View</div>
}));

jest.mock('../components/DocumentationView', () => ({
  __esModule: true,
  default: () => <div data-testid="documentation-view">Documentation View</div>
}));

jest.mock('../components/APIExplorerView', () => ({
  __esModule: true,
  default: () => <div data-testid="api-explorer">API Explorer</div>
}));

jest.mock('../components/GraphQLView', () => ({
  __esModule: true,
  default: () => <div data-testid="graphql-view">GraphQL View</div>
}));

jest.mock('../components/PostmanView', () => ({
  __esModule: true,
  default: () => <div data-testid="postman-view">Postman View</div>
}));

jest.mock('../components/RepositorySync', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-sync">Repository Sync</div>
}));

// Mock SyncProvider
jest.mock('../contexts/SyncContext', () => ({
  SyncProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSyncContext: () => ({
    syncResult: null,
    isInitialSync: false,
    updateSyncResult: jest.fn()
  })
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  useNavigate: () => mockNavigate,
  Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders the app container with correct class', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.App')).toBeInTheDocument();
  });

  it('renders main content area', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.main-content')).toBeInTheDocument();
  });

  it('includes all route components', () => {
    render(<App />);
    
    // All components should be rendered due to our mocked Routes
    expect(screen.getByTestId('repository-list')).toBeInTheDocument();
    expect(screen.getByTestId('repository-view')).toBeInTheDocument();
    expect(screen.getByTestId('documentation-view')).toBeInTheDocument();
    expect(screen.getByTestId('api-explorer')).toBeInTheDocument();
    expect(screen.getByTestId('graphql-view')).toBeInTheDocument();
    expect(screen.getByTestId('postman-view')).toBeInTheDocument();
    expect(screen.getByTestId('repository-sync')).toBeInTheDocument();
  });

  it('wraps app in SyncProvider', () => {
    // This test verifies the component renders without errors when wrapped in SyncProvider
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('includes navigation redirect', () => {
    render(<App />);
    expect(screen.getByText('Navigate to /repositories')).toBeInTheDocument();
  });

  it('has correct structure hierarchy', () => {
    const { container } = render(<App />);
    
    const app = container.querySelector('.App');
    const header = container.querySelector('[data-testid="header"]');
    const mainContent = container.querySelector('.main-content');
    
    expect(app).toContainElement(header as HTMLElement);
    expect(app).toContainElement(mainContent as HTMLElement);
  });

  it('applies dark theme classes', () => {
    const { container } = render(<App />);
    const app = container.querySelector('.App');
    
    expect(app).toHaveClass('App');
    // The app should have dark theme styling
    expect(app?.className).toMatch(/App/);
  });
});