import { create } from 'zustand';
import { getApiUrl } from '../utils/apiConfig';

interface Repository {
  name: string;
  description?: string;
  language?: string;
  topics?: string[];
  updated_at?: string;
  html_url?: string;
}

interface AppStore {
  repositories: Repository[];
  isLoading: boolean;
  error: string | null;
  fetchRepositories: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  repositories: [],
  isLoading: false,
  error: null,
  fetchRepositories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(getApiUrl('/api/repositories'));
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const data = await response.json();
      set({ repositories: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error', 
        isLoading: false 
      });
    }
  }
}));