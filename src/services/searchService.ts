/**
 * Search Service
 * 
 * Provides advanced search and filtering capabilities across repositories,
 * documentation, and API specifications
 */

import { RepositoryMetadata } from './repositorySync';
import { getApiUrl } from '../utils/apiConfig';

export interface SearchOptions {
  query: string;
  scope?: 'all' | 'repositories' | 'documentation' | 'apis';
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'name' | 'updated' | 'type';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  repositories?: string[];
  languages?: string[];
  apiTypes?: ('rest' | 'graphql' | 'grpc')[];
  hasApiDocs?: boolean;
  updatedAfter?: Date;
  updatedBefore?: Date;
  topics?: string[];
  fileTypes?: string[];
}

export interface SearchResult {
  id: string;
  type: 'repository' | 'file' | 'api' | 'content';
  title: string;
  description?: string;
  repository: string;
  path?: string;
  score: number;
  highlights: SearchHighlight[];
  metadata?: Record<string, any>;
}

export interface SearchHighlight {
  field: string;
  snippet: string;
  matchedTokens: string[];
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalCount: number;
  facets: SearchFacets;
  suggestions?: string[];
  executionTime: number;
}

export interface SearchFacets {
  repositories: FacetValue[];
  languages: FacetValue[];
  apiTypes: FacetValue[];
  fileTypes: FacetValue[];
  topics: FacetValue[];
}

export interface FacetValue {
  value: string;
  count: number;
}

class SearchService {
  private searchIndex: Map<string, SearchIndexEntry> = new Map();
  private repositoryMetadata: Map<string, RepositoryMetadata> = new Map();

  /**
   * Build search index from repository content
   */
  async buildSearchIndex(repositories: RepositoryMetadata[]): Promise<void> {
    console.log('Building search index for', repositories.length, 'repositories');
    
    this.searchIndex.clear();
    this.repositoryMetadata.clear();

    for (const repo of repositories) {
      this.repositoryMetadata.set(repo.name, repo);
      await this.indexRepository(repo);
    }

    console.log('Search index built with', this.searchIndex.size, 'entries');
  }

  /**
   * Perform advanced search
   */
  async search(options: SearchOptions): Promise<SearchResponse> {
    try {
      // Use API endpoint for search
      const response = await fetch(getApiUrl('/api/search'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        throw new Error('Search API error');
      }

      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      
      // Fallback to local search if API fails
      return this.localSearch(options);
    }
  }

  /**
   * Perform local search (fallback)
   */
  private async localSearch(options: SearchOptions): Promise<SearchResponse> {
    const startTime = Date.now();
    const { query, scope = 'all', filters = {}, limit = 20, offset = 0, sortBy = 'relevance' } = options;

    // Tokenize query
    const queryTokens = this.tokenize(query.toLowerCase());
    
    // Search across index
    const searchResults: SearchResult[] = [];
    const facets = this.initializeFacets();

    for (const [id, entry] of this.searchIndex) {
      // Apply scope filter
      if (scope !== 'all' && !this.matchesScope(entry, scope)) {
        continue;
      }

      // Apply filters
      if (!this.matchesFilters(entry, filters)) {
        continue;
      }

      // Calculate relevance score
      const score = this.calculateScore(queryTokens, entry);
      
      if (score > 0) {
        const result = this.createSearchResult(id, entry, queryTokens, score);
        searchResults.push(result);
        this.updateFacets(facets, entry);
      }
    }

    // Sort results
    const sortedResults = this.sortResults(searchResults, sortBy, options.sortOrder);
    
    // Apply pagination
    const paginatedResults = sortedResults.slice(offset, offset + limit);

    // Generate suggestions
    const suggestions = this.generateSuggestions(query, searchResults);

    return {
      query,
      results: paginatedResults,
      totalCount: sortedResults.length,
      facets: this.finalizeFacets(facets),
      suggestions,
      executionTime: Date.now() - startTime
    };
  }

  /**
   * Search within a specific repository
   */
  async searchInRepository(repositoryName: string, query: string): Promise<SearchResult[]> {
    const options: SearchOptions = {
      query,
      filters: { repositories: [repositoryName] }
    };
    
    const response = await this.search(options);
    return response.results;
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(partialQuery: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await fetch(getApiUrl(`/api/search/suggestions?q=${encodeURIComponent(partialQuery)}`));
      
      if (!response.ok) {
        throw new Error('Suggestions API error');
      }

      return await response.json();
    } catch (error) {
      console.error('Suggestions error:', error);
      
      // Fallback to local suggestions
      const tokens = this.tokenize(partialQuery.toLowerCase());
      const suggestions = new Set<string>();

      for (const [_, entry] of this.searchIndex) {
        for (const token of entry.tokens) {
          if (token.startsWith(tokens[0]) && token !== tokens[0]) {
            suggestions.add(token);
            if (suggestions.size >= limit) {
              return Array.from(suggestions);
            }
          }
        }
      }

      return Array.from(suggestions);
    }
  }

  /**
   * Get popular search terms
   */
  getPopularTerms(limit: number = 10): string[] {
    const termFrequency = new Map<string, number>();

    for (const [_, entry] of this.searchIndex) {
      for (const token of entry.tokens) {
        termFrequency.set(token, (termFrequency.get(token) || 0) + 1);
      }
    }

    return Array.from(termFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([term]) => term);
  }

  /**
   * Index a repository
   */
  private async indexRepository(repo: RepositoryMetadata): Promise<void> {
    // Index repository metadata
    const repoId = `repo:${repo.name}`;
    this.searchIndex.set(repoId, {
      type: 'repository',
      repository: repo.name,
      title: repo.name,
      content: `${repo.name} ${repo.description} ${repo.topics.join(' ')}`,
      tokens: this.tokenize(`${repo.name} ${repo.description} ${repo.topics.join(' ')}`),
      metadata: {
        language: repo.language,
        topics: repo.topics,
        hasApiDocs: repo.hasApiDocs,
        lastUpdated: repo.lastUpdated
      }
    });

    // In a real implementation, would also index:
    // - README content
    // - Documentation files
    // - API specifications
    // - Code files (with limitations)
  }

  /**
   * Tokenize text for searching
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-_]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }

  /**
   * Calculate relevance score
   */
  private calculateScore(queryTokens: string[], entry: SearchIndexEntry): number {
    let score = 0;
    const entryTokens = new Set(entry.tokens);

    for (const queryToken of queryTokens) {
      // Exact match
      if (entryTokens.has(queryToken)) {
        score += 10;
      }
      
      // Prefix match
      for (const entryToken of entryTokens) {
        if (entryToken.startsWith(queryToken)) {
          score += 5;
        }
        // Fuzzy match (simplified)
        if (this.levenshteinDistance(queryToken, entryToken) <= 2) {
          score += 2;
        }
      }
    }

    // Boost score based on type
    if (entry.type === 'repository') score *= 1.5;
    if (entry.type === 'api') score *= 1.3;

    // Boost for recent updates
    if (entry.metadata?.lastUpdated) {
      const daysSinceUpdate = (Date.now() - new Date(entry.metadata.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate < 30) score *= 1.2;
    }

    return score;
  }

  /**
   * Calculate Levenshtein distance for fuzzy matching
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Check if entry matches scope
   */
  private matchesScope(entry: SearchIndexEntry, scope: string): boolean {
    switch (scope) {
      case 'repositories':
        return entry.type === 'repository';
      case 'documentation':
        return entry.type === 'file' && (entry.path?.endsWith('.md') ?? false);
      case 'apis':
        return entry.type === 'api';
      default:
        return true;
    }
  }

  /**
   * Check if entry matches filters
   */
  private matchesFilters(entry: SearchIndexEntry, filters: SearchFilters): boolean {
    if (filters.repositories?.length && !filters.repositories.includes(entry.repository)) {
      return false;
    }

    if (filters.languages?.length && entry.metadata?.language && !filters.languages.includes(entry.metadata.language)) {
      return false;
    }

    if (filters.apiTypes?.length && entry.type === 'api' && entry.metadata?.apiType && !filters.apiTypes.includes(entry.metadata.apiType)) {
      return false;
    }

    if (filters.hasApiDocs !== undefined && entry.metadata?.hasApiDocs !== filters.hasApiDocs) {
      return false;
    }

    if (filters.topics?.length) {
      const entryTopics = entry.metadata?.topics || [];
      if (!filters.topics.some(topic => entryTopics.includes(topic))) {
        return false;
      }
    }

    return true;
  }

  /**
   * Create search result from index entry
   */
  private createSearchResult(id: string, entry: SearchIndexEntry, queryTokens: string[], score: number): SearchResult {
    const highlights = this.generateHighlights(entry, queryTokens);

    return {
      id,
      type: entry.type,
      title: entry.title,
      description: entry.metadata?.description,
      repository: entry.repository,
      path: entry.path,
      score,
      highlights,
      metadata: entry.metadata
    };
  }

  /**
   * Generate highlighted snippets
   */
  private generateHighlights(entry: SearchIndexEntry, queryTokens: string[]): SearchHighlight[] {
    const highlights: SearchHighlight[] = [];
    const content = entry.content.toLowerCase();

    for (const token of queryTokens) {
      const index = content.indexOf(token);
      if (index !== -1) {
        const start = Math.max(0, index - 30);
        const end = Math.min(content.length, index + token.length + 30);
        const snippet = '...' + entry.content.slice(start, end) + '...';
        
        highlights.push({
          field: 'content',
          snippet,
          matchedTokens: [token]
        });
      }
    }

    return highlights;
  }

  /**
   * Sort search results
   */
  private sortResults(results: SearchResult[], sortBy: string, order: string = 'desc'): SearchResult[] {
    const sorted = [...results];

    switch (sortBy) {
      case 'relevance':
        sorted.sort((a, b) => b.score - a.score);
        break;
      case 'name':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'updated':
        sorted.sort((a, b) => {
          const aDate = new Date(a.metadata?.lastUpdated || 0).getTime();
          const bDate = new Date(b.metadata?.lastUpdated || 0).getTime();
          return bDate - aDate;
        });
        break;
      case 'type':
        sorted.sort((a, b) => a.type.localeCompare(b.type));
        break;
    }

    if (order === 'asc' && sortBy !== 'relevance') {
      sorted.reverse();
    }

    return sorted;
  }

  /**
   * Initialize facets
   */
  private initializeFacets(): SearchFacets {
    return {
      repositories: [],
      languages: [],
      apiTypes: [],
      fileTypes: [],
      topics: []
    };
  }

  /**
   * Update facets with entry data
   */
  private updateFacets(facets: SearchFacets, entry: SearchIndexEntry): void {
    // Update repository facet
    this.updateFacetValue(facets.repositories, entry.repository);

    // Update language facet
    if (entry.metadata?.language) {
      this.updateFacetValue(facets.languages, entry.metadata.language);
    }

    // Update API type facet
    if (entry.type === 'api' && entry.metadata?.apiType) {
      this.updateFacetValue(facets.apiTypes, entry.metadata.apiType);
    }

    // Update topics facet
    if (entry.metadata?.topics) {
      for (const topic of entry.metadata.topics) {
        this.updateFacetValue(facets.topics, topic);
      }
    }
  }

  /**
   * Update facet value count
   */
  private updateFacetValue(facetValues: FacetValue[], value: string): void {
    const existing = facetValues.find(fv => fv.value === value);
    if (existing) {
      existing.count++;
    } else {
      facetValues.push({ value, count: 1 });
    }
  }

  /**
   * Finalize facets (sort by count)
   */
  private finalizeFacets(facets: SearchFacets): SearchFacets {
    return {
      repositories: facets.repositories.sort((a, b) => b.count - a.count),
      languages: facets.languages.sort((a, b) => b.count - a.count),
      apiTypes: facets.apiTypes.sort((a, b) => b.count - a.count),
      fileTypes: facets.fileTypes.sort((a, b) => b.count - a.count),
      topics: facets.topics.sort((a, b) => b.count - a.count)
    };
  }

  /**
   * Generate search suggestions
   */
  private generateSuggestions(query: string, results: SearchResult[]): string[] {
    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    // Add suggestions from successful results
    for (const result of results.slice(0, 10)) {
      const titleTokens = this.tokenize(result.title);
      for (const token of titleTokens) {
        if (token.includes(queryLower) && token !== queryLower) {
          suggestions.add(token);
        }
      }
    }

    return Array.from(suggestions).slice(0, 5);
  }
}

// Search index entry interface
interface SearchIndexEntry {
  type: 'repository' | 'file' | 'api' | 'content';
  repository: string;
  title: string;
  content: string;
  tokens: string[];
  path?: string;
  metadata?: Record<string, any>;
}

// Export singleton instance
export const searchService = new SearchService();