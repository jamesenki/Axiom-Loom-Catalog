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

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('DynamicApiButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockDetectRepositoryApis.mockImplementation(() => 
      new Promise(() => {}) // Never resolves to test loading state
    );

    render(<DynamicApiButtons repositoryName="test-repo" />);
    
    expect(screen.getByText('Detecting available APIs...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders no APIs message when repository has no APIs', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [],
        graphql: [],
        grpc: []
      },
      hasAnyApis: false,
      recommendedButtons: []
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('Documentation-focused repository (no API specifications detected)')).toBeInTheDocument();
    });
  });

  it('renders Swagger UI button for REST APIs', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api1.yaml' }, { file: 'api2.yaml' }, { file: 'api3.yaml' }, { file: 'api4.yaml' }, { file: 'api5.yaml' }],
        graphql: [],
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      const button = screen.getByText(/Swagger UI.*5 APIs/);
      expect(button).toBeInTheDocument();
      expect(button.closest('button')).toHaveClass('bg-green-500');
    });
  });

  it('renders GraphQL Playground button for GraphQL APIs', async () => {
    const mockResponse = {
      repository: 'nslabsdashboards',
      apis: {
        rest: [],
        graphql: Array(19).fill({ file: 'schema.graphql' }),
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['graphql', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="nslabsdashboards" />);

    await waitFor(() => {
      const button = screen.getByText(/GraphQL Playground.*19 schemas/);
      expect(button).toBeInTheDocument();
      expect(button.closest('button')).toHaveClass('bg-pink-500');
    });
  });

  it('renders gRPC UI button for gRPC services', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [],
        graphql: [],
        grpc: [{ file: 'service.proto', services: ['Service1', 'Service2', 'Service3'] }]
      },
      hasAnyApis: true,
      recommendedButtons: ['grpc', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      const button = screen.getByText(/gRPC UI.*1 services/);
      expect(button).toBeInTheDocument();
      expect(button.closest('button')).toHaveClass('bg-blue-500');
    });
  });

  it('renders Postman Collection button when APIs exist', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api1.yaml' }, { file: 'api2.yaml' }],
        graphql: [{ file: 'schema.graphql' }],
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'graphql', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      const button = screen.getByText(/Postman Collection.*3 APIs/);
      expect(button).toBeInTheDocument();
      expect(button.closest('button')).toHaveClass('bg-orange-500');
    });
  });

  it('renders all buttons for repository with multiple API types', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api.yaml' }],
        graphql: [{ file: 'schema.graphql' }],
        grpc: [{ file: 'service.proto', services: ['TestService'] }]
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'graphql', 'grpc', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Swagger UI/)).toBeInTheDocument();
      expect(screen.getByText(/GraphQL Playground/)).toBeInTheDocument();
      expect(screen.getByText(/gRPC UI/)).toBeInTheDocument();
      expect(screen.getByText(/Postman Collection/)).toBeInTheDocument();
    });
  });

  it('opens correct URL when Swagger button is clicked', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api.yaml' }],
        graphql: [],
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Swagger UI/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Swagger UI/));
    expect(mockOpen).toHaveBeenCalledWith('/swagger/test-repo', '_blank');
  });

  it('opens correct URL when GraphQL button is clicked', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [],
        graphql: [{ file: 'schema.graphql' }],
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['graphql', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/GraphQL Playground/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/GraphQL Playground/));
    expect(mockOpen).toHaveBeenCalledWith('/graphql/test-repo', '_blank');
  });

  it('opens correct URL when gRPC button is clicked', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [],
        graphql: [],
        grpc: [{ file: 'service.proto', services: ['TestService'] }]
      },
      hasAnyApis: true,
      recommendedButtons: ['grpc', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/gRPC UI/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/gRPC UI/));
    expect(mockOpen).toHaveBeenCalledWith('/grpc/test-repo', '_blank');
  });

  it('opens correct URL when Postman button is clicked', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api.yaml' }],
        graphql: [],
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Postman Collection/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Postman Collection/));
    expect(mockOpen).toHaveBeenCalledWith('/api/postman/test-repo', '_blank');
  });

  it('renders error state when API detection fails', async () => {
    mockDetectRepositoryApis.mockRejectedValueOnce(new Error('Failed to detect APIs'));

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Error detecting APIs/)).toBeInTheDocument();
      expect(screen.getByText('Failed to detect APIs')).toBeInTheDocument();
    });
  });

  it('allows retry on error', async () => {
    // First call fails
    mockDetectRepositoryApis.mockRejectedValueOnce(new Error('Network error'));

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Error detecting APIs/)).toBeInTheDocument();
    });

    // Mock successful response for retry
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api.yaml' }],
        graphql: [],
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    // Click retry button
    fireEvent.click(screen.getByText('Retry'));

    await waitFor(() => {
      expect(screen.getByText(/Swagger UI/)).toBeInTheDocument();
    });
  });

  it('renders API summary section with counts', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api1.yaml' }, { file: 'api2.yaml' }],
        graphql: [{ file: 'schema.graphql' }],
        grpc: [{ file: 'service.proto', services: ['Service1', 'Service2'] }]
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'graphql', 'grpc', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('API Summary')).toBeInTheDocument();
      expect(screen.getByText(/REST APIs \(2\)/)).toBeInTheDocument();
      expect(screen.getByText(/GraphQL Schemas \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/gRPC Services \(2\)/)).toBeInTheDocument();
    });
  });

  it('applies custom className prop', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [],
        graphql: [],
        grpc: []
      },
      hasAnyApis: false,
      recommendedButtons: []
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" className="custom-class" />);

    await waitFor(() => {
      const container = screen.getByText('No API specifications found in this repository').closest('div');
      expect(container?.parentElement).toHaveClass('custom-class');
    });
  });

  it('refreshes when repository name changes', async () => {
    const mockResponse1 = {
      repository: 'repo1',
      apis: { rest: [], graphql: [], grpc: [] },
      hasAnyApis: false,
      recommendedButtons: []
    };

    const mockResponse2 = {
      repository: 'repo2',
      apis: { rest: [{ file: 'api.yaml' }], graphql: [], grpc: [] },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'postman'] as any
    };

    mockDetectRepositoryApis
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const { rerender } = render(<DynamicApiButtons repositoryName="repo1" />);

    await waitFor(() => {
      expect(screen.getByText('Documentation-focused repository (no API specifications detected)')).toBeInTheDocument();
    });

    rerender(<DynamicApiButtons repositoryName="repo2" />);

    await waitFor(() => {
      expect(screen.getByText(/Swagger UI/)).toBeInTheDocument();
    });

    expect(mockDetectRepositoryApis).toHaveBeenCalledTimes(2);
    expect(mockDetectRepositoryApis).toHaveBeenCalledWith('repo1');
    expect(mockDetectRepositoryApis).toHaveBeenCalledWith('repo2');
  });

  it('has accessible button descriptions', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api.yaml' }],
        graphql: [],
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      const button = screen.getByText(/Swagger UI/);
      expect(button.getAttribute('title')).toBe('Explore REST/OpenAPI specifications');
    });
  });

  it('calls API with correct repository name', async () => {
    mockDetectRepositoryApis.mockResolvedValueOnce({
      repository: 'specific-repo',
      apis: { rest: [], graphql: [], grpc: [] },
      hasAnyApis: false,
      recommendedButtons: []
    });

    render(<DynamicApiButtons repositoryName="specific-repo" />);

    await waitFor(() => {
      expect(mockDetectRepositoryApis).toHaveBeenCalledWith('specific-repo');
    });
  });
});