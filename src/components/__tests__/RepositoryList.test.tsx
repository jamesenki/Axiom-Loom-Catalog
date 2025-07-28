import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import RepositoryList from '../RepositoryList';

// Mock fetch
global.fetch = jest.fn();

const mockRepositories = [
  {
    id: '1',
    name: 'test-repo-1',
    displayName: 'Test Repository 1',
    description: 'Test repository 1 description',
    category: 'backend',
    status: 'active',
    metrics: {
      apiCount: 10,
      lastUpdated: '2025-01-15T10:00:00Z'
    }
  },
  {
    id: '2',
    name: 'test-repo-2',
    displayName: 'Test Repository 2',
    description: 'Test repository 2 description',
    category: 'frontend',
    status: 'maintenance',
    metrics: {
      apiCount: 5,
      lastUpdated: '2025-01-14T08:00:00Z'
    }
  }
];

describe('RepositoryList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <RepositoryList />
      </BrowserRouter>
    );
  };

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter();

    expect(screen.getByText('Loading repositories...')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });

  it('renders repository list when data is loaded', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Test Repository 1')).toBeInTheDocument();
      expect(screen.getByText('Test repository 1 description')).toBeInTheDocument();
      expect(screen.getByText('📊 APIs: 10')).toBeInTheDocument();
      
      expect(screen.getByText('Test Repository 2')).toBeInTheDocument();
      expect(screen.getByText('Test repository 2 description')).toBeInTheDocument();
      expect(screen.getByText('📊 APIs: 5')).toBeInTheDocument();
    });
  });

  it('fetches repositories on mount', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    renderWithRouter();

    expect(global.fetch).toHaveBeenCalledWith('/api/repositories');
  });

  it('renders empty state when no repositories', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.queryByText('Test Repository 1')).not.toBeInTheDocument();
    });
  });

  it('displays status badges', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('active')).toBeInTheDocument();
      expect(screen.getByText('maintenance')).toBeInTheDocument();
    });
  });

  it('renders action buttons for each repository', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories
    });

    renderWithRouter();

    await waitFor(() => {
      // Check for all button types
      expect(screen.getAllByText('📁 Repository')).toHaveLength(2);
      expect(screen.getAllByText('📚 Documentation')).toHaveLength(2);
      expect(screen.getAllByText('📮 Postman')).toHaveLength(2);
      expect(screen.getAllByText('🔍 GraphQL')).toHaveLength(2);
      expect(screen.getAllByText('🛠️ API Explorer')).toHaveLength(2);
    });
  });

  it('links to correct routes', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories
    });

    renderWithRouter();

    await waitFor(() => {
      const repoLink = screen.getAllByText('📁 Repository')[0].closest('a');
      expect(repoLink).toHaveAttribute('href', '/repository/test-repo-1');
      
      const docsLink = screen.getAllByText('📚 Documentation')[0].closest('a');
      expect(docsLink).toHaveAttribute('href', '/docs/test-repo-1');
    });
  });

  it('displays last updated date', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('🕒 Updated: 1/15/2025')).toBeInTheDocument();
      expect(screen.getByText('🕒 Updated: 1/14/2025')).toBeInTheDocument();
    });
  });

  it('renders sync button', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories
    });

    renderWithRouter();

    await waitFor(() => {
      const syncLink = screen.getByText('🔄 Repository Sync');
      expect(syncLink).toBeInTheDocument();
      expect(syncLink.closest('a')).toHaveAttribute('href', '/sync');
    });
  });

  it('handles non-OK responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch repositories')).toBeInTheDocument();
    });
  });

  it('renders header correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('🚀 EYNS AI Experience Center')).toBeInTheDocument();
      expect(screen.getByText('Developer Portal - Repositories, APIs, Documentation & More')).toBeInTheDocument();
    });
  });
});