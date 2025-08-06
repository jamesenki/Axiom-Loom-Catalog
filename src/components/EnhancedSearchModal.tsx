import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Search, X, Clock, ExternalLink, File, Code, ArrowRight, Zap } from 'lucide-react';
import { theme } from '../styles/design-system';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const SearchOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background.overlay};
  z-index: ${props => props.theme.zIndex.modal};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
  backdrop-filter: blur(8px);
`;

const SearchContainer = styled.div<{ isOpen: boolean }>`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xl};
  width: 90%;
  max-width: 600px;
  max-height: 70vh;
  overflow: hidden;
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.9)'};
  animation: ${props => props.isOpen ? slideUp : 'none'} ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
`;

const SearchHeader = styled.div`
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  background: linear-gradient(135deg, ${props => props.theme.colors.background.primary} 0%, ${props => props.theme.colors.background.secondary} 100%);
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]} ${props => props.theme.spacing[3]} ${props => props.theme.spacing[12]};
  border: none;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.primary};
  outline: none;
  transition: all ${props => props.theme.animations.duration.fast} ${props => props.theme.animations.easing.easeOut};

  &:focus {
    background: ${props => props.theme.colors.background.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary.yellow};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.text.secondary};
  pointer-events: none;
`;

const CloseButton = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing[4]};
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.animations.duration.fast} ${props => props.theme.animations.easing.easeOut};

  &:hover {
    background: ${props => props.theme.colors.background.secondary};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const SearchResults = styled.div`
  max-height: 50vh;
  overflow-y: auto;
`;

const ResultsSection = styled.div`
  padding: ${props => props.theme.spacing[2]} 0;
`;

const SectionTitle = styled.div`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[6]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${props => props.theme.colors.background.secondary};
`;

const ResultItem = styled.div<{ isHighlighted: boolean }>`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  cursor: pointer;
  background: ${props => props.isHighlighted ? theme.colors.background.secondary : 'transparent'};
  border-left: 3px solid ${props => props.isHighlighted ? theme.colors.primary.yellow : 'transparent'};
  transition: all ${props => props.theme.animations.duration.fast} ${props => props.theme.animations.easing.easeOut};

  &:hover {
    background: ${props => props.theme.colors.background.secondary};
    border-left-color: ${props => props.theme.colors.primary.yellow};
  }
`;

const ResultIcon = styled.div<{ type: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    const backgrounds: Record<string, string> = {
      'repository': `${props => props.theme.colors.primary.yellow}20`,
      'api': `${props => props.theme.colors.accent.blue}20`,
      'document': `${props => props.theme.colors.semantic.info}20`,
      'recent': `${props => props.theme.colors.text.secondary}20`,
    };
    return backgrounds[props.type] || backgrounds['repository'];
  }};

  svg {
    color: ${props => {
      const colors: Record<string, string> = {
        'repository': theme.colors.primary.yellow,
        'api': theme.colors.accent.blue,
        'document': theme.colors.semantic.info,
        'recent': theme.colors.text.secondary,
      };
      return colors[props.type] || colors['repository'];
    }};
  }
`;

const ResultContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ResultTitle = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[1]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResultDescription = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResultAction = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.xs};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
`;

const QuickActions = styled.div`
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  border-top: 1px solid ${props => props.theme.colors.border.light};
  background: ${props => props.theme.colors.background.secondary};
`;

const ActionsList = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  transition: all ${props => props.theme.animations.duration.fast} ${props => props.theme.animations.easing.easeOut};

  &:hover {
    background: ${props => props.theme.colors.primary.yellow};
    color: ${props => props.theme.colors.primary.black};
    border-color: ${props => props.theme.colors.primary.yellow};
  }
`;

const NoResults = styled.div`
  padding: ${props => props.theme.spacing[8]} ${props => props.theme.spacing[6]};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
`;

interface SearchResult {
  id: string;
  type: 'repository' | 'api' | 'document' | 'recent';
  title: string;
  description: string;
  url: string;
  icon?: React.ReactNode;
}

interface EnhancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedSearchModal: React.FC<EnhancedSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Mock data - replace with actual search API
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'repository',
      title: 'AI Transformation Hub',
      description: 'Central repository for AI transformation tools and APIs',
      url: '/repository/ai-transformation-hub',
    },
    {
      id: '2',
      type: 'api',
      title: 'User Authentication API',
      description: 'RESTful API for user authentication and authorization',
      url: '/api-explorer/auth-service',
    },
    {
      id: '3',
      type: 'document',
      title: 'API Integration Guide',
      description: 'Complete guide for integrating with EY APIs',
      url: '/docs/integration-guide',
    },
  ];

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      // Filter mock results based on query
      const filtered = mockResults.filter(
        result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
      setHighlightedIndex(0);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlightedIndex]) {
        handleResultSelect(results[highlightedIndex]);
      }
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    // Save to recent searches
    const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    navigate(result.url);
    onClose();
  };

  const getResultIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'repository': <ExternalLink size={16} />,
      'api': <Zap size={16} />,
      'document': <File size={16} />,
      'recent': <Clock size={16} />,
    };
    return icons[type] || <ExternalLink size={16} />;
  };

  const quickActions = [
    { label: 'Browse All Repositories', action: () => navigate('/') },
    { label: 'API Explorer', action: () => navigate('/api-explorer/all') },
    { label: 'Documentation', action: () => navigate('/docs') },
    { label: 'Add Repository', action: () => navigate('/sync') },
  ];

  if (!isOpen) return null;

  return (
    <SearchOverlay 
      isOpen={isOpen} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <SearchContainer isOpen={isOpen}>
        <SearchHeader>
          <SearchInputContainer>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              ref={inputRef}
              type="text"
              placeholder="Search repositories, APIs, documentation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </SearchInputContainer>
        </SearchHeader>

        <SearchResults>
          {query.trim() && (
            <>
              {results.length > 0 ? (
                <ResultsSection>
                  <SectionTitle>Search Results</SectionTitle>
                  {results.map((result, index) => (
                    <ResultItem
                      key={result.id}
                      isHighlighted={index === highlightedIndex}
                      onClick={() => handleResultSelect(result)}
                    >
                      <ResultIcon type={result.type}>
                        {getResultIcon(result.type)}
                      </ResultIcon>
                      <ResultContent>
                        <ResultTitle>{result.title}</ResultTitle>
                        <ResultDescription>{result.description}</ResultDescription>
                      </ResultContent>
                      <ResultAction>
                        <ArrowRight size={14} />
                      </ResultAction>
                    </ResultItem>
                  ))}
                </ResultsSection>
              ) : !isLoading ? (
                <NoResults>
                  No results found for "{query}"
                  <br />
                  <small>Try different keywords or browse our quick actions below</small>
                </NoResults>
              ) : null}
            </>
          )}

          {!query.trim() && recentSearches.length > 0 && (
            <ResultsSection>
              <SectionTitle>Recent Searches</SectionTitle>
              {recentSearches.map((search, index) => (
                <ResultItem
                  key={index}
                  isHighlighted={false}
                  onClick={() => setQuery(search)}
                >
                  <ResultIcon type="recent">
                    <Clock size={16} />
                  </ResultIcon>
                  <ResultContent>
                    <ResultTitle>{search}</ResultTitle>
                  </ResultContent>
                </ResultItem>
              ))}
            </ResultsSection>
          )}
        </SearchResults>

        <QuickActions>
          <SectionTitle style={{ padding: `0 0 ${props => props.theme.spacing[3]} 0`, background: 'transparent' }}>
            Quick Actions
          </SectionTitle>
          <ActionsList>
            {quickActions.map((action, index) => (
              <ActionButton
                key={index}
                onClick={() => {
                  action.action();
                  onClose();
                }}
              >
                {action.label}
              </ActionButton>
            ))}
          </ActionsList>
        </QuickActions>
      </SearchContainer>
    </SearchOverlay>
  );
};

export default EnhancedSearchModal;