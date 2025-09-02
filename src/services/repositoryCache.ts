// Repository cache service for local-first approach
const CACHE_KEY = 'axiom_loom_repository_cache';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

export interface CachedData {
  repositories: any[];
  timestamp: number;
}

export class RepositoryCache {
  private static instance: RepositoryCache;
  
  private constructor() {}
  
  static getInstance(): RepositoryCache {
    if (!RepositoryCache.instance) {
      RepositoryCache.instance = new RepositoryCache();
    }
    return RepositoryCache.instance;
  }
  
  // Get cached repositories
  getRepositories(): any[] | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const data: CachedData = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - data.timestamp > CACHE_EXPIRY) {
        this.clear();
        return null;
      }
      
      return data.repositories;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }
  
  // Set repositories in cache
  setRepositories(repositories: any[]): void {
    try {
      const data: CachedData = {
        repositories,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }
  
  // Clear cache
  clear(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
  
  // Check if cache is valid
  isValid(): boolean {
    const cached = this.getRepositories();
    return cached !== null && cached.length > 0;
  }
}

export const repositoryCache = RepositoryCache.getInstance();