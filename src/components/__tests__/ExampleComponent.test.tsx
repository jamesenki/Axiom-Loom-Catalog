/**
 * Example Component Test
 * 
 * Demonstrates testing patterns and best practices
 */

import { render, screen, fireEvent, waitFor, createMockRepository, createMockApiDetectionResult } from '../../test-utils';
import { mockApiDetectionService, mockRepositorySyncService } from '../../test-utils/mockServices';

// Import React for the component
import React from 'react';

// Example component for demonstration
const ExampleComponent: React.FC<{ repository: string }> = ({ repository }) => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mockApiDetectionService.detectRepositoryApis(repository);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Repository: {repository}</h1>
      <button onClick={loadData}>Load APIs</button>
      
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div role="alert">{error}</div>}
      {data && (
        <div data-testid="api-info">
          {data.hasAnyApis ? (
            <p>Found {data.apis.rest.length + data.apis.graphql.length + data.apis.grpc.length} APIs</p>
          ) : (
            <p>No APIs found</p>
          )}
        </div>
      )}
    </div>
  );
};

describe('ExampleComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders repository name', () => {
    render(<ExampleComponent repository="test-repo" />);
    expect(screen.getByText('Repository: test-repo')).toBeInTheDocument();
  });

  it('loads API data when button is clicked', async () => {
    const mockApiData = createMockApiDetectionResult({
      hasAnyApis: true,
      apis: {
        rest: [{ file: 'api.yaml' }],
        graphql: [],
        grpc: []
      }
    });

    mockApiDetectionService.detectRepositoryApis.mockResolvedValue(mockApiData);

    render(<ExampleComponent repository="test-repo" />);
    
    // Click the load button
    fireEvent.click(screen.getByText('Load APIs'));

    // Check loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('api-info')).toBeInTheDocument();
    });

    // Check the result
    expect(screen.getByText('Found 1 APIs')).toBeInTheDocument();
  });

  it('displays error when API call fails', async () => {
    mockApiDetectionService.detectRepositoryApis.mockRejectedValue(
      new Error('Network error')
    );

    render(<ExampleComponent repository="test-repo" />);
    
    fireEvent.click(screen.getByText('Load APIs'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
  });

  it('shows no APIs message when repository has no APIs', async () => {
    const mockApiData = createMockApiDetectionResult({
      hasAnyApis: false
    });

    mockApiDetectionService.detectRepositoryApis.mockResolvedValue(mockApiData);

    render(<ExampleComponent repository="test-repo" />);
    
    fireEvent.click(screen.getByText('Load APIs'));

    await waitFor(() => {
      expect(screen.getByText('No APIs found')).toBeInTheDocument();
    });
  });

  it('calls API detection service with correct repository name', async () => {
    render(<ExampleComponent repository="specific-repo" />);
    
    fireEvent.click(screen.getByText('Load APIs'));

    await waitFor(() => {
      expect(mockApiDetectionService.detectRepositoryApis).toHaveBeenCalledWith('specific-repo');
    });
  });
});