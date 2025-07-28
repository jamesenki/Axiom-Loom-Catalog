import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '../appStore';

// Mock fetch
global.fetch = jest.fn();

describe('appStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.repositories = [];
      result.current.isLoading = false;
      result.current.error = null;
    });
  });

  it('has initial state', () => {
    const { result } = renderHook(() => useAppStore());
    
    expect(result.current.repositories).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('sets loading state when fetching repositories', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.fetchRepositories();
    });
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('fetches repositories successfully', async () => {
    const mockRepositories = [
      { name: 'repo1', description: 'Test repo 1' },
      { name: 'repo2', description: 'Test repo 2' }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories
    });

    const { result } = renderHook(() => useAppStore());
    
    await act(async () => {
      await result.current.fetchRepositories();
    });
    
    expect(result.current.repositories).toEqual(mockRepositories);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles fetch errors', async () => {
    const errorMessage = 'Network error';
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useAppStore());
    
    await act(async () => {
      await result.current.fetchRepositories();
    });
    
    expect(result.current.repositories).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('handles non-OK responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    const { result } = renderHook(() => useAppStore());
    
    await act(async () => {
      await result.current.fetchRepositories();
    });
    
    expect(result.current.repositories).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch repositories');
  });

  it('calls correct API endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    const { result } = renderHook(() => useAppStore());
    
    await act(async () => {
      await result.current.fetchRepositories();
    });
    
    expect(global.fetch).toHaveBeenCalledWith('/api/repositories');
  });

  it('handles unknown errors', async () => {
    // Mock a non-Error rejection
    (global.fetch as jest.Mock).mockRejectedValueOnce('Unknown error');

    const { result } = renderHook(() => useAppStore());
    
    await act(async () => {
      await result.current.fetchRepositories();
    });
    
    expect(result.current.error).toBe('Unknown error');
  });

  it('clears error when retrying fetch', async () => {
    // First call fails
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('First error'));

    const { result } = renderHook(() => useAppStore());
    
    await act(async () => {
      await result.current.fetchRepositories();
    });
    
    expect(result.current.error).toBe('First error');

    // Second call starts - error should be cleared
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {}) // Never resolves
    );

    act(() => {
      result.current.fetchRepositories();
    });
    
    expect(result.current.error).toBe(null);
    expect(result.current.isLoading).toBe(true);
  });
});