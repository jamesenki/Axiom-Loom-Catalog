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
    mockDetectRepositoryApis.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<DynamicApiButtons repositoryName="test-repo" />);
    
    expect(screen.getByText('Detecting available APIs...')).toBeInTheDocument();
  });

  it('renders API buttons when APIs are detected', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api.yaml', title: 'Test API' }],
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

  it('renders no APIs message when no APIs found', async () => {
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
      expect(screen.getByText('No API specifications found in this repository')).toBeInTheDocument();
    });
  });

  it('renders error state on detection failure', async () => {
    mockDetectRepositoryApis.mockRejectedValueOnce(new Error('Detection failed'));

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Error detecting APIs/)).toBeInTheDocument();
      expect(screen.getByText('Detection failed')).toBeInTheDocument();
    });
  });

  it('renders only REST and GraphQL buttons when no gRPC found', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [{ file: 'api.yaml' }],
        graphql: [{ file: 'schema.graphql' }],
        grpc: []
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'graphql', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Swagger UI/)).toBeInTheDocument();
      expect(screen.getByText(/GraphQL Playground/)).toBeInTheDocument();
      expect(screen.queryByText(/gRPC UI/)).not.toBeInTheDocument();
      expect(screen.getByText(/Postman Collection/)).toBeInTheDocument();
    });
  });

  it('opens correct URL when button is clicked', async () => {
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

    const swaggerButton = screen.getByText(/Swagger UI/);
    fireEvent.click(swaggerButton);

    expect(mockOpen).toHaveBeenCalledWith('/api-explorer/test-repo', '_blank');
  });

  it('retries API detection on error', async () => {
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
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText(/Swagger UI/)).toBeInTheDocument();
    });
  });

  it('displays correct counts in button labels', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: {
        rest: [
          { file: 'api1.yaml' },
          { file: 'api2.yaml' },
          { file: 'api3.yaml' }
        ],
        graphql: [
          { file: 'schema1.graphql' },
          { file: 'schema2.graphql' }
        ],
        grpc: [
          { file: 'service.proto', services: ['Service1', 'Service2'] }
        ]
      },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'graphql', 'grpc', 'postman'] as any
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Swagger UI.*3 APIs/)).toBeInTheDocument();
      expect(screen.getByText(/GraphQL Playground.*2 schemas/)).toBeInTheDocument();
      expect(screen.getByText(/gRPC UI.*2 services/)).toBeInTheDocument();
      expect(screen.getByText(/Postman Collection.*6 APIs/)).toBeInTheDocument();
    });
  });

  it('applies custom className', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: { rest: [], graphql: [], grpc: [] },
      hasAnyApis: false,
      recommendedButtons: []
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" className="custom-class" />);

    await waitFor(() => {
      const container = screen.getByText('No API specifications found in this repository').parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });

  it('re-detects APIs when repository name changes', async () => {
    const mockResponse1 = {
      repository: 'repo1',
      apis: { rest: [{ file: 'api1.yaml' }], graphql: [], grpc: [] },
      hasAnyApis: true,
      recommendedButtons: ['swagger', 'postman'] as any
    };

    const mockResponse2 = {
      repository: 'repo2',
      apis: { rest: [], graphql: [{ file: 'schema.graphql' }], grpc: [] },
      hasAnyApis: true,
      recommendedButtons: ['graphql', 'postman'] as any
    };

    mockDetectRepositoryApis
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const { rerender } = render(<DynamicApiButtons repositoryName="repo1" />);

    await waitFor(() => {
      expect(screen.getByText(/Swagger UI/)).toBeInTheDocument();
    });

    rerender(<DynamicApiButtons repositoryName="repo2" />);

    await waitFor(() => {
      expect(screen.queryByText(/Swagger UI/)).not.toBeInTheDocument();
      expect(screen.getByText(/GraphQL Playground/)).toBeInTheDocument();
    });

    expect(mockDetectRepositoryApis).toHaveBeenCalledTimes(2);
    expect(mockDetectRepositoryApis).toHaveBeenNthCalledWith(1, 'repo1');
    expect(mockDetectRepositoryApis).toHaveBeenNthCalledWith(2, 'repo2');
  });

  it('opens correct URLs for all button types', async () => {
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
    });

    // Test each button
    fireEvent.click(screen.getByText(/Swagger UI/));
    expect(mockOpen).toHaveBeenCalledWith('/api-explorer/test-repo', '_blank');

    fireEvent.click(screen.getByText(/GraphQL Playground/));
    expect(mockOpen).toHaveBeenCalledWith('/graphql/test-repo', '_blank');

    fireEvent.click(screen.getByText(/gRPC UI/));
    expect(mockOpen).toHaveBeenCalledWith('/grpc-ui/test-repo', '_blank');

    fireEvent.click(screen.getByText(/Postman Collection/));
    expect(mockOpen).toHaveBeenCalledWith('/postman/test-repo', '_blank');
  });

  it('handles empty repository name', async () => {
    mockDetectRepositoryApis.mockRejectedValueOnce(new Error('Repository not found'));

    render(<DynamicApiButtons repositoryName="" />);

    await waitFor(() => {
      expect(screen.getByText(/Error detecting APIs/)).toBeInTheDocument();
    });

    expect(mockDetectRepositoryApis).toHaveBeenCalledWith('');
  });

  it('displays button descriptions on hover', async () => {
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

  it('displays API summary section', async () => {
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
      expect(screen.getByText('API Summary')).toBeInTheDocument();
      expect(screen.getByText('REST APIs: 2')).toBeInTheDocument();
      expect(screen.getByText('GraphQL Schemas: 1')).toBeInTheDocument();
      expect(screen.getByText('gRPC Services: 0')).toBeInTheDocument();
      expect(screen.getByText('Total: 3')).toBeInTheDocument();
    });
  });

  it('does not display summary for repositories without APIs', async () => {
    const mockResponse = {
      repository: 'test-repo',
      apis: { rest: [], graphql: [], grpc: [] },
      hasAnyApis: false,
      recommendedButtons: []
    };

    mockDetectRepositoryApis.mockResolvedValueOnce(mockResponse);

    render(<DynamicApiButtons repositoryName="test-repo" />);

    await waitFor(() => {
      expect(screen.getByText('No API specifications found in this repository')).toBeInTheDocument();
      expect(screen.queryByText('API Summary')).not.toBeInTheDocument();
    });
  });

  it('calls API detection with correct repository name', async () => {
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