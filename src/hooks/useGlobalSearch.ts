/**
 * Global Search Hook
 * 
 * Manages global search modal state and keyboard shortcuts (Cmd+K / Ctrl+K)
 */

import { useState, useEffect, useCallback } from 'react';

export const useGlobalSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
  }, []);

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        event.stopPropagation();
        toggleSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleSearch]);

  return {
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch
  };
};

export default useGlobalSearch;