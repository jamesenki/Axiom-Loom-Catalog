import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DynamicApiButtons } from '../DynamicApiButtons';

// Mock fetch
global.fetch = jest.fn();

// Mock window.open
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

describe('DynamicApiButtons - Complete Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles all button onClick handlers', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [
        {
          type: 'swagger',
          label: 'Swagger UI (1 API)',
          icon: '📋',
          color: 'green',
          url: '/swagger/test-repo',
          description: 'REST API'
        },
        {
          type: 'graphql',
          label: 'GraphQL (1 schema)',
          icon: '🔮',
          color: 'pink',
          url: '/graphql/test-repo',
          description: 'GraphQL API'
        },
        {
          type: 'grpc',
          label: 'gRPC (1 service)',
          icon: '⚡',
          color: 'blue',
          url: '/grpc/test-repo',
          description: 'gRPC API'
        },
        {
          type: 'postman',
          label: 'Postman (3 APIs)',
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
      expect(screen.getByText('Swagger UI (1 API)')).toBeInTheDocument();
    });

    // Test each button click
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      fireEvent.click(button);
    });

    // Should have called window.open for each button
    expect(mockWindowOpen).toHaveBeenCalledTimes(4);
    expect(mockWindowOpen).toHaveBeenCalledWith('/swagger/test-repo', '_blank');
    expect(mockWindowOpen).toHaveBeenCalledWith('/graphql/test-repo', '_blank');
    expect(mockWindowOpen).toHaveBeenCalledWith('/grpc/test-repo', '_blank');
    expect(mockWindowOpen).toHaveBeenCalledWith('/api/postman/test-repo', '_blank');
  });

  it('renders API summary section', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [{
        type: 'swagger',
        label: 'Swagger UI',
        icon: '📋',
        color: 'green',
        url: '/swagger/test-repo',
        description: 'REST API'
      }],
      summary: { 
        rest: 5, 
        graphql: 3, 
        grpc: 2, 
        total: 10 
      }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('API Summary')).toBeInTheDocument();
      expect(screen.getByText('REST APIs: 5')).toBeInTheDocument();
      expect(screen.getByText('GraphQL Schemas: 3')).toBeInTheDocument();
      expect(screen.getByText('gRPC Services: 2')).toBeInTheDocument();
      expect(screen.getByText('Total: 10')).toBeInTheDocument();
    });
  });

  it('renders no summary when no APIs found', async () => {
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
      // Should not render API Summary section
      expect(screen.queryByText('API Summary')).not.toBeInTheDocument();
    });
  });

  it('handles missing summary data gracefully', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [{
        type: 'swagger',
        label: 'Swagger UI',
        icon: '📋',
        color: 'green',
        url: '/swagger/test-repo',
        description: 'REST API'
      }],
      // Missing summary
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('Swagger UI')).toBeInTheDocument();
      // Should handle missing summary gracefully
      expect(screen.queryByText('API Summary')).not.toBeInTheDocument();
    });
  });

  it('handles all button types in getButtonConfigs', async () => {
    // This test ensures all switch cases are covered
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [],
      summary: { rest: 0, graphql: 0, grpc: 0, total: 0 }
    };

    // Mock the internal API detection to return all button types
    const mockApiDetection = {
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api.yaml' }],
        graphql: [{ file: 'schema.graphql' }],
        grpc: [{ file: 'service.proto' }]
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'graphql', 'grpc', 'postman'] as any
    };

    // We need to test the internal getButtonConfigs function
    // Since it's not exported, we'll test it through the component behavior
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise((resolve) => {
        // Delay to allow us to check internal state
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({
              repository: 'test-repo',
              hasApis: true,
              buttons: [
                { type: 'swagger', label: 'Swagger UI (1 APIs)', icon: '📋', color: 'green', url: '/swagger/test-repo', description: 'Explore REST/OpenAPI specifications' },
                { type: 'graphql', label: 'GraphQL Playground (1 schemas)', icon: '🔮', color: 'pink', url: '/graphql/test-repo', description: 'Explore GraphQL schemas and run queries' },
                { type: 'grpc', label: 'gRPC UI (1 services)', icon: '⚡', color: 'blue', url: '/grpc/test-repo', description: 'Explore gRPC service definitions' },
                { type: 'postman', label: 'Postman Collection (3 APIs)', icon: '📮', color: 'orange', url: '/api/postman/test-repo', description: 'Download Postman collection for API testing' }
              ],
              summary: { rest: 1, graphql: 1, grpc: 1, total: 3 }
            })
          });
        }, 10);
      })
    );

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('Swagger UI (1 APIs)')).toBeInTheDocument();
      expect(screen.getByText('GraphQL Playground (1 schemas)')).toBeInTheDocument();
      expect(screen.getByText('gRPC UI (1 services)')).toBeInTheDocument();
      expect(screen.getByText('Postman Collection (3 APIs)')).toBeInTheDocument();
    });
  });

  it('handles empty recommendedButtons array', async () => {
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

  it('handles network timeout', async () => {
    // Create a promise that never resolves
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Network timeout')), 100);
      })
    );

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to detect APIs/)).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('handles invalid button type gracefully', async () => {
    const mockResponse = {
      repository: 'test-repo',
      hasApis: true,
      buttons: [{
        type: 'unknown',
        label: 'Unknown Button',
        icon: '❓',
        color: 'gray',
        url: '/unknown/test-repo',
        description: 'Unknown API type'
      }],
      summary: { rest: 0, graphql: 0, grpc: 0, total: 0 }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      // Should still render the button even if type is unknown
      expect(screen.getByText('Unknown Button')).toBeInTheDocument();
    });
  });
});