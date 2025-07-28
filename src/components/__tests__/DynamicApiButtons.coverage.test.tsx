import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DynamicApiButtons } from '../DynamicApiButtons';

// Mock fetch
global.fetch = jest.fn();

// Mock window.open
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

describe('DynamicApiButtons - 100% Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test the getButtonConfigs function coverage
  it('covers all button type configurations', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [
        {
          type: 'swagger',
          label: 'Swagger UI (3 APIs)',
          icon: '📋',
          color: 'green',
          url: '/swagger/test-repo',
          description: 'Explore REST/OpenAPI specifications'
        },
        {
          type: 'graphql',
          label: 'GraphQL Playground (2 schemas)',
          icon: '🔮',
          color: 'pink',
          url: '/graphql/test-repo',
          description: 'Explore GraphQL schemas and run queries'
        },
        {
          type: 'grpc',
          label: 'gRPC UI (1 services)',
          icon: '⚡',
          color: 'blue',
          url: '/grpc/test-repo',
          description: 'Explore gRPC service definitions'
        },
        {
          type: 'postman',
          label: 'Postman Collection (6 APIs)',
          icon: '📮',
          color: 'orange',
          url: '/api/postman/test-repo',
          description: 'Download Postman collection for API testing'
        }
      ],
      summary: { rest: 3, graphql: 2, grpc: 1, total: 6 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('Swagger UI (3 APIs)')).toBeInTheDocument();
      expect(screen.getByText('GraphQL Playground (2 schemas)')).toBeInTheDocument();
      expect(screen.getByText('gRPC UI (1 services)')).toBeInTheDocument();
      expect(screen.getByText('Postman Collection (6 APIs)')).toBeInTheDocument();
    });

    // Test all button descriptions
    expect(screen.getByText('Explore REST/OpenAPI specifications')).toBeInTheDocument();
    expect(screen.getByText('Explore GraphQL schemas and run queries')).toBeInTheDocument();
    expect(screen.getByText('Explore gRPC service definitions')).toBeInTheDocument();
    expect(screen.getByText('Download Postman collection for API testing')).toBeInTheDocument();
  });

  // Test the internal detectAPIs function behavior
  it('covers detectAPIs function error paths', async () => {
    // First, test network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { rerender } = render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to detect APIs/)).toBeInTheDocument();
    });

    // Then test non-ok response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    // Click retry
    fireEvent.click(screen.getByText('Retry'));

    await waitFor(() => {
      expect(screen.getByText(/Failed to detect APIs/)).toBeInTheDocument();
    });
  });

  // Test the getButtonConfigs function with different API counts
  it('covers button label generation with different counts', async () => {
    const testCases = [
      { rest: 0, graphql: 0, grpc: 0 },
      { rest: 1, graphql: 0, grpc: 0 },
      { rest: 0, graphql: 1, grpc: 0 },
      { rest: 0, graphql: 0, grpc: 1 },
      { rest: 5, graphql: 3, grpc: 2 }
    ];

    for (const counts of testCases) {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          repository: 'test-repo',
          hasApis: counts.rest > 0 || counts.graphql > 0 || counts.grpc > 0,
          buttons: [
            counts.rest > 0 && {
              type: 'swagger',
              label: `Swagger UI (${counts.rest} API${counts.rest !== 1 ? 's' : ''})`,
              icon: '📋',
              color: 'green',
              url: '/swagger/test-repo',
              description: 'Explore REST/OpenAPI specifications'
            },
            counts.graphql > 0 && {
              type: 'graphql',
              label: `GraphQL Playground (${counts.graphql} schema${counts.graphql !== 1 ? 's' : ''})`,
              icon: '🔮',
              color: 'pink',
              url: '/graphql/test-repo',
              description: 'Explore GraphQL schemas and run queries'
            },
            counts.grpc > 0 && {
              type: 'grpc',
              label: `gRPC UI (${counts.grpc} service${counts.grpc !== 1 ? 's' : ''})`,
              icon: '⚡',
              color: 'blue',
              url: '/grpc/test-repo',
              description: 'Explore gRPC service definitions'
            }
          ].filter(Boolean),
          summary: { ...counts, total: counts.rest + counts.graphql + counts.grpc }
        })
      });

      const { unmount } = render(<DynamicApiButtons repositoryName={`repo-${JSON.stringify(counts)}`} />);
      
      await waitFor(() => {
        if (counts.rest > 0) {
          expect(screen.getByText(new RegExp(`Swagger UI.*${counts.rest}.*API`))).toBeInTheDocument();
        }
        if (counts.graphql > 0) {
          expect(screen.getByText(new RegExp(`GraphQL.*${counts.graphql}.*schema`))).toBeInTheDocument();
        }
        if (counts.grpc > 0) {
          expect(screen.getByText(new RegExp(`gRPC.*${counts.grpc}.*service`))).toBeInTheDocument();
        }
      });

      unmount();
    }
  });

  // Test abort controller cleanup
  it('aborts fetch on unmount', () => {
    let abortSignal: AbortSignal | undefined;
    
    (global.fetch as jest.Mock).mockImplementationOnce((url, options) => {
      abortSignal = options?.signal;
      return new Promise(() => {}); // Never resolves
    });

    const { unmount } = render(<DynamicApiButtons repositoryName="test-repo" />);
    
    // Verify fetch was called with abort signal
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        signal: expect.any(AbortSignal)
      })
    );

    unmount();
    
    // The component should clean up properly
    expect(abortSignal?.aborted).toBe(true);
  });

  // Test edge case: empty buttons array with hasApis true
  it('handles empty buttons array when hasApis is true', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        repository: 'test-repo',
        hasApis: true,
        buttons: [],
        summary: { rest: 0, graphql: 0, grpc: 0, total: 0 }
      })
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      // Should show no APIs message even though hasApis is true
      expect(screen.getByText('No API specifications found in this repository')).toBeInTheDocument();
    });
  });

  // Test summary rendering with all zeros
  it('does not render summary when all counts are zero', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        repository: 'test-repo',
        hasApis: false,
        buttons: [],
        summary: { rest: 0, graphql: 0, grpc: 0, total: 0 }
      })
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.queryByText('API Summary')).not.toBeInTheDocument();
    });
  });

  // Test button onClick handlers for coverage
  it('executes onClick handlers for all button types', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [
        {
          type: 'swagger',
          label: 'Swagger',
          icon: '📋',
          color: 'green',
          url: '/swagger/test-repo',
          description: 'REST API'
        },
        {
          type: 'graphql',
          label: 'GraphQL',
          icon: '🔮',
          color: 'pink',
          url: '/graphql/test-repo',
          description: 'GraphQL API'
        },
        {
          type: 'grpc',
          label: 'gRPC',
          icon: '⚡',
          color: 'blue',
          url: '/grpc/test-repo',
          description: 'gRPC API'
        },
        {
          type: 'postman',
          label: 'Postman',
          icon: '📮',
          color: 'orange',
          url: '/api/postman/test-repo',
          description: 'Postman'
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
      expect(screen.getByText('Swagger')).toBeInTheDocument();
    });

    // Click each button type
    const buttons = mockResponse.buttons;
    for (const button of buttons) {
      const buttonElement = screen.getByRole('button', { name: new RegExp(button.label) });
      fireEvent.click(buttonElement);
      expect(mockWindowOpen).toHaveBeenCalledWith(button.url, '_blank');
    }
  });

  // Test error boundary behavior
  it('handles JSON parse errors gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      }
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to detect APIs/)).toBeInTheDocument();
    });
  });

  // Test component with different className values
  it('applies all className variations', async () => {
    const testClasses = ['', 'custom-class', 'multiple classes here'];
    
    for (const className of testClasses) {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          repository: 'test-repo',
          hasApis: false,
          buttons: [],
          summary: { rest: 0, graphql: 0, grpc: 0, total: 0 }
        })
      });

      const { container, unmount } = render(
        <DynamicApiButtons repositoryName="test-repo" className={className} />
      );

      await waitFor(() => {
        const containerDiv = container.firstChild as HTMLElement;
        if (className) {
          expect(containerDiv).toHaveClass(className);
        }
      });

      unmount();
    }
  });

  // Test rapid repository changes
  it('handles rapid repository name changes correctly', async () => {
    let resolveFirst: any;
    let resolveSecond: any;
    
    const firstPromise = new Promise((resolve) => {
      resolveFirst = resolve;
    });
    
    const secondPromise = new Promise((resolve) => {
      resolveSecond = resolve;
    });

    (global.fetch as jest.Mock)
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise);

    const { rerender } = render(<DynamicApiButtons repositoryName="repo1" />);
    
    // Change repository before first request completes
    rerender(<DynamicApiButtons repositoryName="repo2" />);
    
    // Resolve second request first
    act(() => {
      resolveSecond({
        ok: true,
        json: async () => ({
          repository: 'repo2',
          hasApis: true,
          buttons: [{
            type: 'swagger',
            label: 'Repo2 API',
            icon: '📋',
            color: 'green',
            url: '/swagger/repo2',
            description: 'API'
          }],
          summary: { rest: 1, graphql: 0, grpc: 0, total: 1 }
        })
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Repo2 API')).toBeInTheDocument();
    });

    // Resolve first request (should be ignored)
    act(() => {
      resolveFirst({
        ok: true,
        json: async () => ({
          repository: 'repo1',
          hasApis: true,
          buttons: [{
            type: 'swagger',
            label: 'Repo1 API',
            icon: '📋',
            color: 'green',
            url: '/swagger/repo1',
            description: 'API'
          }],
          summary: { rest: 1, graphql: 0, grpc: 0, total: 1 }
        })
      });
    });

    // Should still show repo2 data
    expect(screen.getByText('Repo2 API')).toBeInTheDocument();
    expect(screen.queryByText('Repo1 API')).not.toBeInTheDocument();
  });
});