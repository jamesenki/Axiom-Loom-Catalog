/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import UnifiedApiExplorer from '../UnifiedApiExplorer';
import { ThemeProvider } from 'styled-components';
import theme from '../../styles/design-system/theme';

// Mock fetch
global.fetch = jest.fn();

// Mock the router params
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ repoName: 'test-repo' }),
  useSearchParams: () => [new URLSearchParams(), jest.fn()]
}));

// Mock SwaggerUI component
jest.mock('swagger-ui-react', () => {
  return function SwaggerUI() {
    return <div data-testid="swagger-ui">Swagger UI Mock</div>;
  };
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('UnifiedApiExplorer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should show loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves to keep loading state
    );

    renderWithProviders(<UnifiedApiExplorer />);
    
    expect(screen.getByText('Loading API Explorer...')).toBeInTheDocument();
  });

  it('should display error state when API detection fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<UnifiedApiExplorer />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading APIs')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should display detected APIs in sidebar', async () => {
    const mockApiData = {
      apis: {
        rest: [
          { file: 'api/openapi.yaml', title: 'User API', version: '1.0.0', description: 'User management API' }
        ],
        graphql: [
          { file: 'schema.graphql', title: 'GraphQL API', description: 'Main GraphQL schema' }
        ],
        grpc: [
          { file: 'service.proto', title: 'gRPC Service', description: 'Main gRPC service' }
        ]
      }
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

    renderWithProviders(<UnifiedApiExplorer />);
    
    await waitFor(() => {
      expect(screen.getByText('User API')).toBeInTheDocument();
      expect(screen.getByText('GraphQL API')).toBeInTheDocument();
      expect(screen.getByText('gRPC Service')).toBeInTheDocument();
    });
  });

  it('should filter APIs based on search query', async () => {
    const mockApiData = {
      apis: {
        rest: [
          { file: 'api/user.yaml', title: 'User API', version: '1.0.0' },
          { file: 'api/product.yaml', title: 'Product API', version: '1.0.0' }
        ],
        graphql: [],
        grpc: []
      }
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

    renderWithProviders(<UnifiedApiExplorer />);
    
    await waitFor(() => {
      expect(screen.getByText('User API')).toBeInTheDocument();
      expect(screen.getByText('Product API')).toBeInTheDocument();
    });

    // Search for "user"
    const searchInput = screen.getByPlaceholderText('Search APIs...');
    fireEvent.change(searchInput, { target: { value: 'user' } });

    await waitFor(() => {
      expect(screen.getByText('User API')).toBeInTheDocument();
      expect(screen.queryByText('Product API')).not.toBeInTheDocument();
    });
  });

  it('should select API and load its content', async () => {
    const mockApiData = {
      apis: {
        rest: [
          { file: 'api/openapi.yaml', title: 'User API', version: '1.0.0' }
        ],
        graphql: [],
        grpc: []
      }
    };

    const mockApiContent = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'User API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/users': {
          get: {
            summary: 'Get all users'
          }
        }
      }
    });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => mockApiContent
      });

    renderWithProviders(<UnifiedApiExplorer />);
    
    await waitFor(() => {
      expect(screen.getByText('User API')).toBeInTheDocument();
    });

    // Click on the API
    fireEvent.click(screen.getByText('User API'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://api.example.com/users')).toBeInTheDocument();
      expect(screen.getByText('GET')).toBeInTheDocument();
    });
  });

  it('should execute request and display response', async () => {
    const mockApiData = {
      apis: {
        rest: [
          { file: 'api/openapi.yaml', title: 'User API', version: '1.0.0' }
        ],
        graphql: [],
        grpc: []
      }
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ paths: { '/users': { get: {} } } })
      });

    renderWithProviders(<UnifiedApiExplorer />);
    
    await waitFor(() => {
      expect(screen.getByText('User API')).toBeInTheDocument();
    });

    // Select API
    fireEvent.click(screen.getByText('User API'));

    await waitFor(() => {
      const sendButton = screen.getByText('Send');
      expect(sendButton).toBeInTheDocument();
    });

    // Execute request
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(screen.getByText(/Response/)).toBeInTheDocument();
      expect(screen.getByText(/200/)).toBeInTheDocument();
      expect(screen.getByText(/This is a simulated response/)).toBeInTheDocument();
    });
  });

  it('should save and load request history', async () => {
    const mockApiData = {
      apis: {
        rest: [
          { file: 'api/openapi.yaml', title: 'User API', version: '1.0.0' }
        ],
        graphql: [],
        grpc: []
      }
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ paths: { '/users': { get: {} } } })
      });

    renderWithProviders(<UnifiedApiExplorer />);
    
    await waitFor(() => {
      expect(screen.getByText('User API')).toBeInTheDocument();
    });

    // Select API and execute request
    fireEvent.click(screen.getByText('User API'));
    
    await waitFor(() => {
      expect(screen.getByText('Send')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(screen.getByText(/Response/)).toBeInTheDocument();
    });

    // Open history
    fireEvent.click(screen.getByText('History'));

    await waitFor(() => {
      expect(screen.getByText('Request History')).toBeInTheDocument();
      expect(screen.getByText(/GET OpenAPI/)).toBeInTheDocument();
    });
  });

  it('should switch between tabs', async () => {
    const mockApiData = {
      apis: {
        rest: [
          { file: 'api/openapi.yaml', title: 'User API', version: '1.0.0' }
        ],
        graphql: [],
        grpc: []
      }
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

    renderWithProviders(<UnifiedApiExplorer />);
    
    await waitFor(() => {
      expect(screen.getByText('User API')).toBeInTheDocument();
    });

    // Select API
    fireEvent.click(screen.getByText('User API'));

    // Switch to code snippets tab
    fireEvent.click(screen.getByText('Code Snippets'));

    await waitFor(() => {
      expect(screen.getByText('Curl')).toBeInTheDocument();
      expect(screen.getByText('Javascript')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
    });
  });

  it('should handle environment variables', async () => {
    const mockApiData = {
      apis: {
        rest: [
          { file: 'api/openapi.yaml', title: 'User API', version: '1.0.0' }
        ],
        graphql: [],
        grpc: []
      }
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ 
          servers: [{ url: '{{BASE_URL}}' }],
          paths: { '/users': { get: {} } } 
        })
      });

    renderWithProviders(<UnifiedApiExplorer />);
    
    await waitFor(() => {
      expect(screen.getByText('User API')).toBeInTheDocument();
    });

    // Select API
    fireEvent.click(screen.getByText('User API'));

    await waitFor(() => {
      const urlInput = screen.getByDisplayValue('{{BASE_URL}}/users');
      expect(urlInput).toBeInTheDocument();
    });

    // Check environment selector
    const envSelector = screen.getByDisplayValue('Development');
    expect(envSelector).toBeInTheDocument();
  });

  it('should add and modify headers', async () => {
    const mockApiData = {
      apis: {
        rest: [
          { file: 'api/openapi.yaml', title: 'User API', version: '1.0.0' }
        ],
        graphql: [],
        grpc: []
      }
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ paths: { '/users': { get: {} } } })
      });

    renderWithProviders(<UnifiedApiExplorer />);
    
    await waitFor(() => {
      expect(screen.getByText('User API')).toBeInTheDocument();
    });

    // Select API
    fireEvent.click(screen.getByText('User API'));

    await waitFor(() => {
      expect(screen.getByText('Headers')).toBeInTheDocument();
    });

    // Add new header
    fireEvent.click(screen.getByText('Add Header'));

    await waitFor(() => {
      const headerInputs = screen.getAllByPlaceholderText('Header name');
      expect(headerInputs.length).toBeGreaterThan(1);
    });
  });
});