import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import RepositoryView from '../RepositoryView';

// Mock the DynamicApiButtons component
jest.mock('../DynamicApiButtons', () => ({
  DynamicApiButtons: ({ repositoryName }: { repositoryName: string }) => (
    <div data-testid="dynamic-api-buttons">{repositoryName} API Buttons</div>
  )
}));

// Mock fetch
global.fetch = jest.fn();

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <span>ArrowLeft</span>,
  Folder: () => <span>Folder</span>,
  GitBranch: () => <span>GitBranch</span>,
  Calendar: () => <span>Calendar</span>,
  Info: () => <span>Info</span>
}));

describe('RepositoryView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (repoName: string) => {
    return render(
      <MemoryRouter initialEntries={[`/repository/${repoName}`]}>
        <Routes>
          <Route path="/repository/:repoName" element={<RepositoryView />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter('test-repo');
    
    expect(screen.getByText('Loading repository details...')).toBeInTheDocument();
    // Check for spinner by class
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders repository details when loaded', async () => {
    const mockRepository = {
      name: 'test-repo',
      description: 'A test repository',
      language: 'TypeScript',
      topics: ['testing', 'react'],
      updated_at: '2025-01-15T10:00:00Z',
      default_branch: 'main',
      stargazers_count: 42,
      forks_count: 10
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepository
    });

    renderWithRouter('test-repo');

    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
      expect(screen.getByText('A test repository')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('main')).toBeInTheDocument();
      expect(screen.getByText('testing')).toBeInTheDocument();
      expect(screen.getByText('react')).toBeInTheDocument();
    });
  });

  it('renders back button with correct link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'test-repo' })
    });

    renderWithRouter('test-repo');

    await waitFor(() => {
      const backLink = screen.getByText('Back to Repositories').closest('a');
      expect(backLink).toHaveAttribute('href', '/repositories');
    });
  });

  it('renders API tools section with DynamicApiButtons', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'test-repo' })
    });

    renderWithRouter('test-repo');

    await waitFor(() => {
      expect(screen.getByText('Available API Tools')).toBeInTheDocument();
      expect(screen.getByTestId('dynamic-api-buttons')).toBeInTheDocument();
      expect(screen.getByText('test-repo API Buttons')).toBeInTheDocument();
    });
  });

  it('renders documentation links', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'test-repo' })
    });

    renderWithRouter('test-repo');

    await waitFor(() => {
      expect(screen.getByText('Documentation')).toBeInTheDocument();
      
      const docsLink = screen.getByText('View Documentation').closest('a');
      expect(docsLink).toHaveAttribute('href', '/repository/test-repo/docs');
      
      const readmeLink = screen.getByText('README.md').closest('a');
      expect(readmeLink).toHaveAttribute('href', '/repository/test-repo/readme');
    });
  });

  it('handles missing optional fields gracefully', async () => {
    const mockRepository = {
      name: 'minimal-repo',
      // No description, language, topics, etc.
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepository
    });

    renderWithRouter('minimal-repo');

    await waitFor(() => {
      expect(screen.getByText('minimal-repo')).toBeInTheDocument();
      // Should not crash when optional fields are missing
      expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    renderWithRouter('test-repo');

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching repository:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('handles 404 responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    renderWithRouter('nonexistent-repo');

    await waitFor(() => {
      // Should handle gracefully, not crash
      expect(screen.queryByText('Loading repository details...')).not.toBeInTheDocument();
    });
  });

  it('formats date correctly', async () => {
    const mockRepository = {
      name: 'test-repo',
      updated_at: '2025-01-15T10:30:45Z'
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepository
    });

    renderWithRouter('test-repo');

    await waitFor(() => {
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
      // Date should be formatted
      expect(screen.getByText(/1\/15\/2025/)).toBeInTheDocument();
    });
  });

  it('renders topics as badges', async () => {
    const mockRepository = {
      name: 'test-repo',
      topics: ['react', 'typescript', 'testing', 'component-library']
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepository
    });

    renderWithRouter('test-repo');

    await waitFor(() => {
      mockRepository.topics.forEach(topic => {
        const badge = screen.getByText(topic);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-blue-900', 'bg-opacity-30', 'text-blue-300');
      });
    });
  });

  it('displays language with color indicator', async () => {
    const mockRepository = {
      name: 'test-repo',
      language: 'JavaScript'
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepository
    });

    renderWithRouter('test-repo');

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      // Language indicator dot
      const dot = document.querySelector('.w-3.h-3.rounded-full.bg-blue-500');
      expect(dot).toBeInTheDocument();
    });
  });

  it('calls API with correct repository name', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'specific-repo' })
    });

    renderWithRouter('specific-repo');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/repository/specific-repo');
    });
  });

  it('does not fetch if no repository name provided', () => {
    render(
      <MemoryRouter initialEntries={['/repository/']}>
        <Routes>
          <Route path="/repository/" element={<RepositoryView />} />
        </Routes>
      </MemoryRouter>
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });
});