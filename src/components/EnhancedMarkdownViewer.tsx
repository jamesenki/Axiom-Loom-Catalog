/**
 * Enhanced Markdown Viewer Component
 * 
 * Features:
 * - Syntax highlighting for code blocks
 * - Table of contents generation
 * - Search within documents
 * - Print/export functionality
 * - Mobile-responsive design
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Components } from 'react-markdown';
import 'highlight.js/styles/github-dark.css';
import styles from './EnhancedMarkdownViewer.module.css';

interface EnhancedMarkdownViewerProps {
  content: string;
  className?: string;
  onContentChange?: (content: string) => void;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const EnhancedMarkdownViewer: React.FC<EnhancedMarkdownViewerProps> = ({
  content,
  className = '',
  onContentChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showToc, setShowToc] = useState(true);
  const [highlightedContent, setHighlightedContent] = useState(content);
  const [searchResults, setSearchResults] = useState<number>(0);
  const [currentMatch, setCurrentMatch] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Generate table of contents from content
  const tocItems = useMemo((): TocItem[] => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      items.push({ id, text, level });
    }

    return items;
  }, [content]);

  // Handle search functionality
  useEffect(() => {
    if (!searchTerm) {
      setHighlightedContent(content);
      setSearchResults(0);
      setCurrentMatch(0);
      return;
    }

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const matches = content.match(regex) || [];
    setSearchResults(matches.length);

    if (matches.length > 0) {
      let matchIndex = 0;
      const highlighted = content.replace(regex, (match) => {
        matchIndex++;
        return `<mark class="${matchIndex === currentMatch + 1 ? 'current-match' : 'search-match'}">${match}</mark>`;
      });
      setHighlightedContent(highlighted);
    } else {
      setHighlightedContent(content);
    }
  }, [content, searchTerm, currentMatch]);

  // Navigate to next/previous search result
  const navigateSearch = (direction: 'next' | 'prev') => {
    if (searchResults === 0) return;

    let newMatch = currentMatch;
    if (direction === 'next') {
      newMatch = (currentMatch + 1) % searchResults;
    } else {
      newMatch = (currentMatch - 1 + searchResults) % searchResults;
    }
    setCurrentMatch(newMatch);

    // Scroll to match
    const marks = contentRef.current?.querySelectorAll('mark');
    if (marks && marks[newMatch]) {
      marks[newMatch].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(!showSearch);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
      if (showSearch && e.key === 'Enter') {
        if (e.shiftKey) {
          navigateSearch('prev');
        } else {
          navigateSearch('next');
        }
      }
      if (showSearch && e.key === 'Escape') {
        setShowSearch(false);
        setSearchTerm('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, searchResults, currentMatch]);

  // Handle printing
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // Handle export as HTML
  const handleExport = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Markdown</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 20px; }
    pre { background: #f4f4f4; padding: 1em; overflow-x: auto; }
    code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1em; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f4f4f4; }
    @media print { body { max-width: none; } }
  </style>
</head>
<body>
  ${contentRef.current?.innerHTML || ''}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-export.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Custom components for react-markdown
  const components: Components = {
    h1: ({ children, ...props }) => {
      const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h1 id={id} {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }) => {
      const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h2 id={id} {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }) => {
      const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h3 id={id} {...props}>{children}</h3>;
    },
    h4: ({ children, ...props }) => {
      const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h4 id={id} {...props}>{children}</h4>;
    },
    h5: ({ children, ...props }) => {
      const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h5 id={id} {...props}>{children}</h5>;
    },
    h6: ({ children, ...props }) => {
      const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h6 id={id} {...props}>{children}</h6>;
    },
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <pre className={className}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className={`${styles.enhancedMarkdownViewer} ${className} ${isPrinting ? styles.printing : ''}`}>
      {/* Toolbar */}
      <div className={styles.markdownToolbar}>
        <div className={styles.toolbarLeft}>
          <button
            onClick={() => setShowToc(!showToc)}
            className={styles.toolbarButton}
            title="Toggle Table of Contents"
          >
            📑 TOC
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={styles.toolbarButton}
            title="Search (Ctrl+F)"
          >
            🔍 Search
          </button>
        </div>
        <div className={styles.toolbarRight}>
          <button
            onClick={handlePrint}
            className={styles.toolbarButton}
            title="Print (Ctrl+P)"
          >
            🖨️ Print
          </button>
          <button
            onClick={handleExport}
            className={styles.toolbarButton}
            title="Export as HTML"
          >
            💾 Export
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className={styles.searchBar}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in document..."
            className={styles.searchInput}
            autoFocus
          />
          <div className={styles.searchControls}>
            <span className={styles.searchResults}>
              {searchResults > 0 ? `${currentMatch + 1}/${searchResults}` : 'No results'}
            </span>
            <button
              onClick={() => navigateSearch('prev')}
              disabled={searchResults === 0}
              className={styles.searchNavButton}
              title="Previous (Shift+Enter)"
            >
              ↑
            </button>
            <button
              onClick={() => navigateSearch('next')}
              disabled={searchResults === 0}
              className={styles.searchNavButton}
              title="Next (Enter)"
            >
              ↓
            </button>
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchTerm('');
              }}
              className={styles.searchCloseButton}
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className={styles.markdownContentWrapper}>
        {/* Table of Contents */}
        {showToc && tocItems.length > 0 && (
          <aside className={styles.markdownToc}>
            <h3>Table of Contents</h3>
            <nav>
              <ul>
                {tocItems.map((item) => (
                  <li
                    key={item.id}
                    className={styles.tocItem}
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToHeading(item.id);
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        {/* Markdown Content */}
        <div className={styles.markdownContent} ref={contentRef}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeHighlight,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }]
            ]}
            components={components}
          >
            {searchTerm ? highlightedContent : content}
          </ReactMarkdown>
        </div>
      </div>

    </div>
  );
};

export default EnhancedMarkdownViewer;