import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import '@testing-library/jest-dom';
import APIDocumentationHub from '../APIDocumentationHub';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ repoName: 'test-repo' }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock fetch
global.fetch = jest.fn();

describe('APIDocumentationHub', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockApiDetectionResult = {
    repository: 'test-repo',
    hasAnyApis: true,
    restApis: [
      {
        file: 'openapi.yaml',
        title: 'User API',
        version: '1.0.0',
        description: 'API for user management'
      }
    ],
    graphqlApis: [
      {
        file: 'schema.graphql',
        schema: 'type Query { users: [User] }'
      }
    ],
    grpcApis: [
      {
        file: 'service.proto',
        serviceName: 'UserService',
        services: ['GetUser', 'CreateUser']
      }
    ],
    postmanCollections: [
      {
        file: 'collection.postman.json',
        name: 'Test Collection',
        description: 'Postman collection for testing'
      }
    ]
  };

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<APIDocumentationHub />);

    expect(screen.getByText('Loading API documentation...')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<APIDocumentationHub />);

    await waitFor(() => {
      expect(screen.getByText('Error loading API documentation')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('renders API documentation hub with title', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiDetectionResult
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      expect(screen.getByText('📚 API Documentation Hub')).toBeInTheDocument();
      expect(screen.getByText(/Comprehensive API documentation and exploration for test-repo/)).toBeInTheDocument();
    });
  });

  it('displays API counts in overview tab', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiDetectionResult
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      expect(screen.getByText('REST APIs')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // REST count
      expect(screen.getByText('GraphQL APIs')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // GraphQL count
      expect(screen.getByText('gRPC Services')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // gRPC count
    });
  });

  it('displays available API specifications', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiDetectionResult
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      expect(screen.getByText('Available API Specifications')).toBeInTheDocument();
      expect(screen.getByText('User API')).toBeInTheDocument();
      expect(screen.getByText('openapi.yaml')).toBeInTheDocument();
      expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    });
  });

  it('switches between tabs', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiDetectionResult
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      expect(screen.getByText('Available API Specifications')).toBeInTheDocument();
    });

    // Click on API Explorer tab
    fireEvent.click(screen.getByText('API Explorer'));
    expect(screen.getByText('This REST API specification can be explored using the integrated Swagger UI.')).toBeInTheDocument();

    // Click on Postman tab
    fireEvent.click(screen.getByText('Postman'));
    expect(screen.getByText('Postman Collections')).toBeInTheDocument();
    expect(screen.getByText('Test Collection')).toBeInTheDocument();

    // Click on GraphQL tab
    fireEvent.click(screen.getByText('GraphQL'));
    expect(screen.getByText('GraphQL APIs')).toBeInTheDocument();
    expect(screen.getByText('GraphQL Schema')).toBeInTheDocument();
  });

  it('selects API specification when clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiDetectionResult
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      expect(screen.getByText('User API')).toBeInTheDocument();
    });

    // Initially first spec should be selected
    const userApiSpec = screen.getByText('User API').closest('div');
    expect(userApiSpec).toHaveClass('border-blue-500');

    // Click on GraphQL spec
    const graphqlSpec = screen.getByText('GraphQL API');
    fireEvent.click(graphqlSpec.closest('div')!);

    // Check selection changed
    expect(graphqlSpec.closest('div')).toHaveClass('border-blue-500');
  });

  it('renders links to API viewers', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiDetectionResult
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      expect(screen.getByText('API Explorer')).toBeInTheDocument();
    });

    // Switch to API Explorer tab
    fireEvent.click(screen.getByText('API Explorer'));

    const swaggerLink = screen.getByText('Open in API Explorer →');
    expect(swaggerLink.closest('a')).toHaveAttribute('href', '/api-explorer/test-repo?spec=openapi.yaml');
  });

  it('shows no APIs message when repository has no APIs', async () => {
    const emptyResult = {
      ...mockApiDetectionResult,
      hasAnyApis: false,
      restApis: [],
      graphqlApis: [],
      grpcApis: [],
      postmanCollections: []
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyResult
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      expect(screen.getByText('No API specifications found in this repository')).toBeInTheDocument();
    });
  });

  it('displays Postman collections correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiDetectionResult
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Postman'));
    });

    expect(screen.getByText('Test Collection')).toBeInTheDocument();
    expect(screen.getByText('collection.postman.json')).toBeInTheDocument();
    
    const viewButton = screen.getByText('View Collection');
    expect(viewButton.closest('a')).toHaveAttribute('href', '/postman/test-repo?collection=collection.postman.json');
  });

  it('displays GraphQL schemas with links', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiDetectionResult
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('GraphQL'));
    });

    expect(screen.getByText('GraphQL Schema')).toBeInTheDocument();
    expect(screen.getByText('schema.graphql')).toBeInTheDocument();
    
    const graphiqlButton = screen.getByText('Open GraphiQL');
    expect(graphiqlButton.closest('a')).toHaveAttribute('href', '/graphql/test-repo?schema=schema.graphql');
  });

  it('displays API type icons correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiDetectionResult
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      // Check for API type icons
      expect(screen.getByText('🔌')).toBeInTheDocument(); // REST
      expect(screen.getByText('🔍')).toBeInTheDocument(); // GraphQL
      expect(screen.getByText('⚡')).toBeInTheDocument(); // gRPC
    });
  });

  it('handles non-OK responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      expect(screen.getByText('Error loading API documentation')).toBeInTheDocument();
      expect(screen.getByText('Failed to detect APIs')).toBeInTheDocument();
    });
  });

  it('displays API documentation features info', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiDetectionResult
    });

    render(<APIDocumentationHub />);

    await waitFor(() => {
      expect(screen.getByText('ℹ️ API Documentation Features')).toBeInTheDocument();
      expect(screen.getByText(/Automatic detection of REST.*GraphQL.*gRPC APIs/)).toBeInTheDocument();
      expect(screen.getByText(/Interactive API Explorer for testing endpoints/)).toBeInTheDocument();
    });
  });
});