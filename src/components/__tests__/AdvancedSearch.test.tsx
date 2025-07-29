/**
 * Advanced Search Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AdvancedSearch } from '../AdvancedSearch';
import { searchService } from '../../services/searchService';

// Mock the search service
jest.mock('../../services/searchService', () => ({
  searchService: {
    search: jest.fn(),
    getSuggestions: jest.fn()
  }
}));

// Mock debounce hook
jest.mock('../../hooks/useDebounce', () => ({
  useDebounce: (value: any) => value
}));

describe('AdvancedSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input with placeholder', () => {
    render(<AdvancedSearch />);
    
    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    expect(input).toBeInTheDocument();
  });

  it('shows all scope tabs', () => {
    render(<AdvancedSearch />);
    
    expect(screen.getByText('all')).toBeInTheDocument();
    expect(screen.getByText('repositories')).toBeInTheDocument();
    expect(screen.getByText('documentation')).toBeInTheDocument();
    expect(screen.getByText('apis')).toBeInTheDocument();
  });

  it('performs search when typing', async () => {
    const mockResponse = {
      query: 'test',
      results: [
        {
          id: 'repo:test-repo',
          type: 'repository' as const,
          title: 'test-repo',
          repository: 'test-repo',
          score: 10,
          highlights: []
        }
      ],
      totalCount: 1,
      facets: {
        repositories: [],
        languages: [],
        apiTypes: [],
        fileTypes: [],
        topics: []
      },
      executionTime: 50
    };

    (searchService.search as jest.Mock).mockResolvedValue(mockResponse);

    render(<AdvancedSearch />);
    
    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    await userEvent.type(input, 'test');

    await waitFor(() => {
      expect(searchService.search).toHaveBeenCalledWith({
        query: 'test',
        scope: 'all',
        filters: {},
        limit: 20
      });
    });

    expect(screen.getByText('test-repo')).toBeInTheDocument();
    expect(screen.getByText('Found 1 results')).toBeInTheDocument();
  });

  it('shows loading state during search', async () => {
    (searchService.search as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<AdvancedSearch />);
    
    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    await userEvent.type(input, 'test');

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('displays search suggestions', async () => {
    const suggestions = ['test-repo', 'test-api', 'test-docs'];
    (searchService.getSuggestions as jest.Mock).mockResolvedValue(suggestions);

    render(<AdvancedSearch />);
    
    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    await userEvent.type(input, 'te');

    await waitFor(() => {
      suggestions.forEach(suggestion => {
        expect(screen.getByText(suggestion)).toBeInTheDocument();
      });
    });
  });

  it('selects suggestion on click', async () => {
    const suggestions = ['test-repo'];
    (searchService.getSuggestions as jest.Mock).mockResolvedValue(suggestions);

    render(<AdvancedSearch />);
    
    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    await userEvent.type(input, 'te');

    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('test-repo'));

    expect(input).toHaveValue('test-repo');
  });

  it('toggles filters panel', () => {
    render(<AdvancedSearch />);
    
    const filterButton = screen.getByText('Filters');
    
    fireEvent.click(filterButton);
    expect(screen.getByText('Clear all')).toBeInTheDocument();
    
    fireEvent.click(filterButton);
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });

  it('changes search scope', async () => {
    const mockResponse = {
      query: 'test',
      results: [],
      totalCount: 0,
      facets: {
        repositories: [],
        languages: [],
        apiTypes: [],
        fileTypes: [],
        topics: []
      },
      executionTime: 50
    };

    (searchService.search as jest.Mock).mockResolvedValue(mockResponse);

    render(<AdvancedSearch />);
    
    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    await userEvent.type(input, 'test');

    const repoTab = screen.getByText('repositories');
    fireEvent.click(repoTab);

    await waitFor(() => {
      expect(searchService.search).toHaveBeenLastCalledWith({
        query: 'test',
        scope: 'repositories',
        filters: {},
        limit: 20
      });
    });
  });

  it('displays facets from search results', async () => {
    const mockResponse = {
      query: 'test',
      results: [],
      totalCount: 0,
      facets: {
        repositories: [{ value: 'repo1', count: 5 }],
        languages: [{ value: 'TypeScript', count: 3 }],
        apiTypes: [{ value: 'rest', count: 2 }],
        fileTypes: [],
        topics: [{ value: 'testing', count: 4 }]
      },
      executionTime: 50
    };

    (searchService.search as jest.Mock).mockResolvedValue(mockResponse);

    render(<AdvancedSearch />);
    
    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    await userEvent.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('TypeScript (3)')).toBeInTheDocument();
      expect(screen.getByText('REST (2)')).toBeInTheDocument();
      expect(screen.getByText('testing (4)')).toBeInTheDocument();
    });
  });

  it('applies filters to search', async () => {
    const mockResponse = {
      query: 'test',
      results: [],
      totalCount: 0,
      facets: {
        repositories: [],
        languages: [{ value: 'TypeScript', count: 3 }],
        apiTypes: [],
        fileTypes: [],
        topics: []
      },
      executionTime: 50
    };

    (searchService.search as jest.Mock).mockResolvedValue(mockResponse);

    render(<AdvancedSearch />);
    
    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    await userEvent.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('TypeScript (3)')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('TypeScript (3)'));

    await waitFor(() => {
      expect(searchService.search).toHaveBeenLastCalledWith({
        query: 'test',
        scope: 'all',
        filters: { languages: ['TypeScript'] },
        limit: 20
      });
    });
  });

  it('clears all filters', async () => {
    const mockResponse = {
      query: 'test',
      results: [],
      totalCount: 0,
      facets: {
        repositories: [],
        languages: [{ value: 'TypeScript', count: 3 }],
        apiTypes: [],
        fileTypes: [],
        topics: []
      },
      executionTime: 50
    };

    (searchService.search as jest.Mock).mockResolvedValue(mockResponse);

    render(<AdvancedSearch />);
    
    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    await userEvent.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('TypeScript (3)')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('TypeScript (3)'));
    
    await waitFor(() => {
      expect(screen.getByText('Clear all')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Clear all'));

    await waitFor(() => {
      expect(searchService.search).toHaveBeenLastCalledWith({
        query: 'test',
        scope: 'all',
        filters: {},
        limit: 20
      });
    });
  });

  it('calls onResultSelect when result is clicked', async () => {
    const mockResult = {
      id: 'repo:test-repo',
      type: 'repository' as const,
      title: 'test-repo',
      repository: 'test-repo',
      score: 10,
      highlights: []
    };

    const mockResponse = {
      query: 'test',
      results: [mockResult],
      totalCount: 1,
      facets: {
        repositories: [],
        languages: [],
        apiTypes: [],
        fileTypes: [],
        topics: []
      },
      executionTime: 50
    };

    (searchService.search as jest.Mock).mockResolvedValue(mockResponse);

    const onResultSelect = jest.fn();
    render(<AdvancedSearch onResultSelect={onResultSelect} />);
    
    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    await userEvent.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('test-repo'));
    expect(onResultSelect).toHaveBeenCalledWith(mockResult);
  });

  it('displays no results message', async () => {
    const mockResponse = {
      query: 'nonexistent',
      results: [],
      totalCount: 0,
      facets: {
        repositories: [],
        languages: [],
        apiTypes: [],
        fileTypes: [],
        topics: []
      },
      suggestions: ['existing-repo'],
      executionTime: 50
    };

    (searchService.search as jest.Mock).mockResolvedValue(mockResponse);

    render(<AdvancedSearch />);
    
    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    await userEvent.type(input, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('No results found for "nonexistent"')).toBeInTheDocument();
      expect(screen.getByText('Did you mean:')).toBeInTheDocument();
      expect(screen.getByText('existing-repo')).toBeInTheDocument();
    });
  });

  it('handles keyboard navigation for suggestions', async () => {
    const suggestions = ['test-repo', 'test-api', 'test-docs'];
    (searchService.getSuggestions as jest.Mock).mockResolvedValue(suggestions);

    render(<AdvancedSearch />);
    
    const input = screen.getByPlaceholderText('Search repositories, documentation, APIs...');
    await userEvent.type(input, 'te');

    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    // Press arrow down
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    
    // Press enter to select
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(input).toHaveValue('test-repo');
  });
});