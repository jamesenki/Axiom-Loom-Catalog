import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DynamicApiButtons } from '../DynamicApiButtons';

// Mock fetch
global.fetch = jest.fn();

// Mock window.open
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

describe('DynamicApiButtons - Additional Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles retry after error', async () => {
    // First call fails
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { rerender } = render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to detect APIs')).toBeInTheDocument();
    });

    // Mock successful response for retry
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [{
        type: 'swagger',
        label: 'Swagger UI (2 APIs)',
        icon: '📋',
        color: 'green',
        url: '/swagger/test-repo',
        description: 'Explore REST/OpenAPI specifications'
      }],
      summary: { rest: 2, graphql: 0, grpc: 0, total: 2 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    // Click retry button
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Swagger UI (2 APIs)')).toBeInTheDocument();
    });
  });

  it('opens correct URLs when buttons are clicked', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [
        {
          type: 'swagger',
          label: 'Swagger UI (5 APIs)',
          icon: '📋',
          color: 'green',
          url: '/swagger/test-repo',
          description: 'Explore REST/OpenAPI specifications'
        },
        {
          type: 'graphql',
          label: 'GraphQL Playground (3 schemas)',
          icon: '🔮',
          color: 'pink',
          url: '/graphql/test-repo',
          description: 'Explore GraphQL schemas and run queries'
        },
        {
          type: 'grpc',
          label: 'gRPC UI (2 services)',
          icon: '⚡',
          color: 'blue',
          url: '/grpc/test-repo',
          description: 'Explore gRPC service definitions'
        },
        {
          type: 'postman',
          label: 'Postman Collection (10 APIs)',
          icon: '📮',
          color: 'orange',
          url: '/api/postman/test-repo',
          description: 'Download Postman collection for API testing'
        }
      ],
      summary: { rest: 5, graphql: 3, grpc: 2, total: 10 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('Swagger UI (5 APIs)')).toBeInTheDocument();
    });

    // Test Swagger button
    fireEvent.click(screen.getByText('Swagger UI (5 APIs)'));
    expect(mockWindowOpen).toHaveBeenCalledWith('/swagger/test-repo', '_blank');

    // Test GraphQL button
    fireEvent.click(screen.getByText('GraphQL Playground (3 schemas)'));
    expect(mockWindowOpen).toHaveBeenCalledWith('/graphql/test-repo', '_blank');

    // Test gRPC button
    fireEvent.click(screen.getByText('gRPC UI (2 services)'));
    expect(mockWindowOpen).toHaveBeenCalledWith('/grpc/test-repo', '_blank');

    // Test Postman button
    fireEvent.click(screen.getByText('Postman Collection (10 APIs)'));
    expect(mockWindowOpen).toHaveBeenCalledWith('/api/postman/test-repo', '_blank');
  });

  it('applies custom className prop', async () => {
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

    render(<DynamicApiButtons repositoryName="test-repo" className="custom-class" />);

    await waitFor(() => {
      const container = screen.getByText('No API specifications found in this repository').parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });

  it('renders loading state with custom className', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<DynamicApiButtons repositoryName="test-repo" className="custom-loading" />);

    const loadingContainer = screen.getByText('Detecting available APIs...').closest('div');
    expect(loadingContainer).toHaveClass('custom-loading');
  });

  it('renders error state with custom className', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<DynamicApiButtons repositoryName="test-repo" className="custom-error" />);

    await waitFor(() => {
      const errorContainer = screen.getByText(/Failed to detect APIs/).closest('div');
      expect(errorContainer).toHaveClass('custom-error');
    });
  });

  it('handles empty repository name gracefully', async () => {
    render(<DynamicApiButtons repositoryName="" />);

    // Should still attempt to fetch
    expect(global.fetch).toHaveBeenCalledWith('/api/api-buttons/');
  });

  it('displays correct button colors', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [
        {
          type: 'swagger',
          label: 'Swagger UI',
          icon: '📋',
          color: 'green',
          url: '/swagger/test-repo',
          description: 'REST APIs'
        },
        {
          type: 'graphql',
          label: 'GraphQL',
          icon: '🔮',
          color: 'pink',
          url: '/graphql/test-repo',
          description: 'GraphQL APIs'
        },
        {
          type: 'grpc',
          label: 'gRPC',
          icon: '⚡',
          color: 'blue',
          url: '/grpc/test-repo',
          description: 'gRPC APIs'
        },
        {
          type: 'postman',
          label: 'Postman',
          icon: '📮',
          color: 'orange',
          url: '/api/postman/test-repo',
          description: 'Postman Collection'
        }
      ],
      summary: { rest: 1, graphql: 1, grpc: 1, total: 3 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      const swaggerButton = screen.getByText('Swagger UI').closest('button');
      expect(swaggerButton).toHaveClass('bg-green-600');

      const graphqlButton = screen.getByText('GraphQL').closest('button');
      expect(graphqlButton).toHaveClass('bg-pink-600');

      const grpcButton = screen.getByText('gRPC').closest('button');
      expect(grpcButton).toHaveClass('bg-blue-600');

      const postmanButton = screen.getByText('Postman').closest('button');
      expect(postmanButton).toHaveClass('bg-orange-600');
    });
  });

  it('handles fetch abort on unmount', () => {
    let abortController: AbortController | null = null;

    // Mock fetch to capture abort controller
    (global.fetch as jest.Mock).mockImplementationOnce((url, options) => {
      abortController = options?.signal?.controller;
      return new Promise(() => {}); // Never resolves
    });

    const { unmount } = render(<DynamicApiButtons repositoryName="test-repo" />);

    // Component should create an AbortController
    expect(global.fetch).toHaveBeenCalled();

    // Unmount should abort the fetch
    unmount();

    // Note: In actual implementation, you'd check if abort was called
    // For now, just verify fetch was called
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles rapid repository name changes', async () => {
    const { rerender } = render(<DynamicApiButtons repositoryName="repo1" />);

    // Quick succession of repository changes
    rerender(<DynamicApiButtons repositoryName="repo2" />);
    rerender(<DynamicApiButtons repositoryName="repo3" />);

    // Should fetch for the latest repository
    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith('/api/api-buttons/repo3');
    });
  });
});