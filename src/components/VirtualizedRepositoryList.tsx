/**
 * Virtualized Repository List Component
 * 
 * Optimized version of RepositoryList with virtual scrolling for better performance
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, Code, FileText, GitBranch, Star } from 'lucide-react';
import { calculateVisibleRange, throttle } from '../utils/performance';

interface Repository {
  name: string;
  description: string;
  language?: string;
  topics?: string[];
  updated_at?: string;
  stargazers_count?: number;
  default_branch?: string;
  hasApiDocs?: boolean;
}

interface VirtualizedRepositoryListProps {
  className?: string;
}

const ITEM_HEIGHT = 140; // Approximate height of each repository card
const OVERSCAN = 3; // Number of items to render outside visible area

export const VirtualizedRepositoryList: React.FC<VirtualizedRepositoryListProps> = ({
  className = ''
}) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch repositories
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch('/api/repositories');
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        setRepositories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  // Calculate visible range
  const { startIndex, endIndex, offsetY } = useMemo(
    () => calculateVisibleRange(scrollTop, {
      itemHeight: ITEM_HEIGHT,
      containerHeight,
      items: repositories,
      overscan: OVERSCAN,
      renderItem: () => null // Not used in calculation
    }),
    [scrollTop, containerHeight, repositories]
  );

  // Throttled scroll handler
  const handleScroll = useCallback(
    throttle(() => {
      if (scrollRef.current) {
        setScrollTop(scrollRef.current.scrollTop);
      }
    }, 16), // ~60fps
    []
  );

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Visible items
  const visibleItems = useMemo(
    () => repositories.slice(startIndex, endIndex + 1),
    [repositories, startIndex, endIndex]
  );

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center text-red-600">
          <p className="text-xl mb-2">Error loading repositories</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No repositories found</p>
        <p className="text-gray-500 text-sm mt-2">
          Try adjusting your search or sync repositories
        </p>
      </div>
    );
  }

  const totalHeight = repositories.length * ITEM_HEIGHT;

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: '100%', minHeight: '400px' }}
    >
      <div
        ref={scrollRef}
        className="overflow-auto h-full"
        onScroll={handleScroll}
      >
        {/* Virtual spacer to maintain scroll height */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Rendered items */}
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }}
          >
            {visibleItems.map((repo, index) => (
              <RepositoryCard
                key={repo.name}
                repository={repo}
                index={startIndex + index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoized repository card component
const RepositoryCard = React.memo<{ repository: Repository; index: number }>(
  ({ repository, index }) => {
    const formatDate = (dateString?: string) => {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const getLanguageColor = (language?: string): string => {
      const colors: Record<string, string> = {
        TypeScript: '#3178C6',
        JavaScript: '#F7DF1E',
        Python: '#3776AB',
        Java: '#007396',
        Go: '#00ADD8',
        Rust: '#DEA584',
        Ruby: '#CC342D',
        PHP: '#777BB4',
        Swift: '#FA7343',
        Kotlin: '#7F52FF'
      };
      return colors[language || ''] || '#6B7280';
    };

    return (
      <div
        style={{ height: ITEM_HEIGHT }}
        className="px-4 py-2"
      >
        <Link
          to={`/repository/${repository.name}`}
          className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-4 h-full"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-500" />
              {repository.name}
            </h3>
            {repository.hasApiDocs && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                API Docs
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {repository.description || 'No description available'}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            {repository.language && (
              <span className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getLanguageColor(repository.language) }}
                />
                {repository.language}
              </span>
            )}
            
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(repository.updated_at)}
            </span>

            {repository.stargazers_count !== undefined && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {repository.stargazers_count}
              </span>
            )}

            {repository.default_branch && (
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                {repository.default_branch}
              </span>
            )}
          </div>

          {repository.topics && repository.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {repository.topics.slice(0, 5).map(topic => (
                <span
                  key={topic}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {topic}
                </span>
              ))}
              {repository.topics.length > 5 && (
                <span className="px-2 py-0.5 text-gray-500 text-xs">
                  +{repository.topics.length - 5} more
                </span>
              )}
            </div>
          )}
        </Link>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for better performance
    return (
      prevProps.repository.name === nextProps.repository.name &&
      prevProps.repository.updated_at === nextProps.repository.updated_at &&
      prevProps.index === nextProps.index
    );
  }
);

RepositoryCard.displayName = 'RepositoryCard';

export default VirtualizedRepositoryList;