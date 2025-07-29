/**
 * Advanced Search Component
 * 
 * Provides comprehensive search interface with filters, facets, and real-time results
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, X, ChevronDown, ChevronRight, FileText, Code, Box, Clock, Tag } from 'lucide-react';
import { searchService, SearchOptions, SearchFilters, SearchResponse, SearchResult } from '../services/searchService';
import { useDebounce } from '../hooks/useDebounce';

interface AdvancedSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  initialQuery?: string;
  className?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onResultSelect,
  initialQuery = '',
  className = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [scope, setScope] = useState<'all' | 'repositories' | 'documentation' | 'apis'>('all');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Perform search when query or filters change
  useEffect(() => {
    if (debouncedQuery || Object.keys(filters).length > 0) {
      performSearch();
    } else {
      setSearchResponse(null);
    }
  }, [debouncedQuery, scope, filters]);

  // Get suggestions for autocomplete
  useEffect(() => {
    if (query.length >= 2 && query !== debouncedQuery) {
      getSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const options: SearchOptions = {
        query: debouncedQuery,
        scope,
        filters,
        limit: 20
      };
      
      const response = await searchService.search(options);
      setSearchResponse(response);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async () => {
    try {
      const suggestions = await searchService.getSuggestions(query);
      setSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('Suggestions error:', error);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          handleSuggestionSelect(suggestions[selectedSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        break;
    }
  };

  const toggleFilter = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (Array.isArray(newFilters[filterType])) {
        const arr = newFilters[filterType] as any[];
        const index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
          if (arr.length === 0) {
            delete newFilters[filterType];
          }
        } else {
          arr.push(value);
        }
      } else {
        if (newFilters[filterType] === value) {
          delete newFilters[filterType];
        } else {
          (newFilters as any)[filterType] = value;
        }
      }
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'repository':
        return <Box className="w-4 h-4" />;
      case 'file':
        return <FileText className="w-4 h-4" />;
      case 'api':
        return <Code className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatHighlight = (text: string, matchedTokens: string[]) => {
    let highlighted = text;
    matchedTokens.forEach(token => {
      const regex = new RegExp(`(${token})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    });
    return highlighted;
  };

  return (
    <div className={`advanced-search ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search repositories, documentation, APIs..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                      index === selectedSuggestion ? 'bg-gray-100' : ''
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 ${
              showFilters ? 'bg-gray-50' : ''
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {Object.keys(filters).length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        </div>

        {/* Scope Tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'repositories', 'documentation', 'apis'] as const).map(s => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-4 py-1 rounded-full text-sm capitalize ${
                scope === s
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Clear all
            </button>
          </div>
          
          {/* Facets from search results */}
          {searchResponse?.facets && (
            <div className="space-y-3">
              {/* Language Filter */}
              {searchResponse.facets.languages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Language</h4>
                  <div className="flex flex-wrap gap-2">
                    {searchResponse.facets.languages.map(({ value, count }) => (
                      <button
                        key={value}
                        onClick={() => toggleFilter('languages', value)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          filters.languages?.includes(value)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border hover:bg-gray-50'
                        }`}
                      >
                        {value} ({count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* API Type Filter */}
              {searchResponse.facets.apiTypes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">API Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {searchResponse.facets.apiTypes.map(({ value, count }) => (
                      <button
                        key={value}
                        onClick={() => toggleFilter('apiTypes', value as any)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          filters.apiTypes?.includes(value as any)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border hover:bg-gray-50'
                        }`}
                      >
                        {value.toUpperCase()} ({count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics Filter */}
              {searchResponse.facets.topics.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {searchResponse.facets.topics.slice(0, 10).map(({ value, count }) => (
                      <button
                        key={value}
                        onClick={() => toggleFilter('topics', value)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          filters.topics?.includes(value)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border hover:bg-gray-50'
                        }`}
                      >
                        <Tag className="w-3 h-3 inline mr-1" />
                        {value} ({count})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {loading && (
        <div className="text-center py-8 text-gray-500">
          Searching...
        </div>
      )}

      {!loading && searchResponse && (
        <div>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Found {searchResponse.totalCount} results
              {searchResponse.executionTime && (
                <span className="text-gray-400"> in {searchResponse.executionTime}ms</span>
              )}
            </p>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            {searchResponse.results.map((result) => (
              <div
                key={result.id}
                onClick={() => onResultSelect?.(result)}
                className="p-4 bg-white border rounded-lg hover:shadow-md cursor-pointer transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="text-gray-400 mt-1">
                    {getResultIcon(result.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      {result.title}
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {result.type}
                      </span>
                    </h3>
                    
                    {result.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {result.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{result.repository}</span>
                      {result.path && (
                        <span>{result.path}</span>
                      )}
                      {result.metadata?.lastUpdated && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(result.metadata.lastUpdated).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Highlights */}
                    {result.highlights.length > 0 && (
                      <div className="mt-2">
                        {result.highlights.map((highlight, index) => (
                          <div
                            key={index}
                            className="text-sm text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: formatHighlight(highlight.snippet, highlight.matchedTokens)
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {searchResponse.results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No results found for "{query}"</p>
              {searchResponse.suggestions && searchResponse.suggestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm">Did you mean:</p>
                  <div className="flex justify-center gap-2 mt-2">
                    {searchResponse.suggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;