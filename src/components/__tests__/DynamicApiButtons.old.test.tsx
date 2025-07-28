import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DynamicApiButtons } from '../DynamicApiButtons';
import { detectRepositoryApis } from '../../services/dynamicApiDetection';

// Mock the service
jest.mock('../../services/dynamicApiDetection', () => ({
  detectRepositoryApis: jest.fn()
}));

const mockDetectRepositoryApis = detectRepositoryApis as jest.MockedFunction<typeof detectRepositoryApis>;

describe('DynamicApiButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {}) // Never resolves to test loading state
    );

    render(<DynamicApiButtons repositoryName="test-repo" />);
    
    expect(screen.getByText('Detecting available APIs...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders no APIs message when repository has no APIs', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: false,
      buttons: [],
      summary: { rest: 0, graphql: 0, grpc: 0, total: 0 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('No API specifications found in this repository')).toBeInTheDocument();
    });
  });

  it('renders Swagger UI button for REST APIs', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [{
        type: 'swagger',
        label: 'Swagger UI (5 APIs)',
        icon: '📋',
        color: 'green',
        url: '/swagger/test-repo',
        description: 'Explore REST/OpenAPI specifications'
      }],
      summary: { rest: 5, graphql: 0, grpc: 0, total: 5 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      const button = screen.getByText('Swagger UI (5 APIs)');
      expect(button).toBeInTheDocument();
      expect(button.closest('button')).toHaveClass('bg-green-600');
    });
  });

  it('renders GraphQL Playground button for GraphQL APIs', async () => {
    const mockResponse = {
      repository: 'nslabsdashboards',
      hasApis: true,
      buttons: [{
        type: 'graphql',
        label: 'GraphQL Playground (19 schemas)',
        icon: '🔮',
        color: 'pink',
        url: '/graphql/nslabsdashboards',
        description: 'Explore GraphQL schemas and run queries'
      }],
      summary: { rest: 0, graphql: 19, grpc: 0, total: 19 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="nslabsdashboards" />);

    await waitFor(() => {
      const button = screen.getByText('GraphQL Playground (19 schemas)');
      expect(button).toBeInTheDocument();
      expect(button.closest('button')).toHaveClass('bg-pink-600');
    });
  });

  it('renders gRPC UI button for gRPC services', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [{
        type: 'grpc',
        label: 'gRPC UI (3 services)',
        icon: '⚡',
        color: 'blue',
        url: '/grpc/test-repo',
        description: 'Explore gRPC service definitions'
      }],
      summary: { rest: 0, graphql: 0, grpc: 3, total: 3 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      const button = screen.getByText('gRPC UI (3 services)');
      expect(button).toBeInTheDocument();
      expect(button.closest('button')).toHaveClass('bg-blue-600');
    });
  });

  it('renders multiple buttons for mixed API repository', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [
        {
          type: 'swagger',
          label: 'Swagger UI (10 APIs)',
          icon: '📋',
          color: 'green',
          url: '/swagger/test-repo',
          description: 'Explore REST/OpenAPI specifications'
        },
        {
          type: 'graphql',
          label: 'GraphQL Playground (5 schemas)',
          icon: '🔮',
          color: 'pink',
          url: '/graphql/test-repo',
          description: 'Explore GraphQL schemas and run queries'
        },
        {
          type: 'postman',
          label: 'Postman Collection (15 APIs)',
          icon: '📮',
          color: 'orange',
          url: '/api/postman/test-repo',
          description: 'Download Postman collection for API testing'
        }
      ],
      summary: { rest: 10, graphql: 5, grpc: 0, total: 15 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('Swagger UI (10 APIs)')).toBeInTheDocument();
      expect(screen.getByText('GraphQL Playground (5 schemas)')).toBeInTheDocument();
      expect(screen.getByText('Postman Collection (15 APIs)')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to detect APIs')).toBeInTheDocument();
      expect(screen.getByText('Unable to load API information for this repository.')).toBeInTheDocument();
    });
  });

  it('handles non-OK responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to detect APIs')).toBeInTheDocument();
    });
  });

  it('navigates to correct URL when button is clicked', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [{
        type: 'swagger',
        label: 'Swagger UI (5 APIs)',
        icon: '📋',
        color: 'green',
        url: '/swagger/test-repo',
        description: 'Explore REST/OpenAPI specifications'
      }],
      summary: { rest: 5, graphql: 0, grpc: 0, total: 5 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    // Mock window.open
    const mockOpen = jest.fn();
    window.open = mockOpen;

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      const button = screen.getByText('Swagger UI (5 APIs)');
      fireEvent.click(button);
      expect(mockOpen).toHaveBeenCalledWith('/swagger/test-repo', '_blank');
    });
  });

  it('shows description on hover', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [{
        type: 'swagger',
        label: 'Swagger UI (5 APIs)',
        icon: '📋',
        color: 'green',
        url: '/swagger/test-repo',
        description: 'Explore REST/OpenAPI specifications'
      }],
      summary: { rest: 5, graphql: 0, grpc: 0, total: 5 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      const button = screen.getByText('Swagger UI (5 APIs)');
      expect(button.getAttribute('title')).toBe('Explore REST/OpenAPI specifications');
    });
  });

  it('calls API with correct repository name', async () => {
    const mockResponse = {
      repository: 'specific-repo',
      hasApis: true,
      buttons: [],
      summary: { rest: 0, graphql: 0, grpc: 0, total: 0 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="specific-repo" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/api-buttons/specific-repo');
    });
  });
});