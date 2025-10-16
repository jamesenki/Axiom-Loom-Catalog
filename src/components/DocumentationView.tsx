/**
 * Documentation View Component
 * 
 * Displays repository documentation with enhanced markdown features
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import EnhancedMarkdownViewer from './EnhancedMarkdownViewer';
import styles from './DocumentationView.module.css';
import { getApiUrl } from '../utils/apiConfig';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileItem[];
}

const DocumentationView: React.FC = () => {
  const { repoName, '*': filePath } = useParams<{ repoName: string, '*': string }>();
  const [searchParams] = useSearchParams();
  const pathParam = searchParams.get('path');
  
  // Use file path from URL params first, then query params, then default to README.md
  const defaultFile = filePath || pathParam || 'README.md';
  const [selectedFile, setSelectedFile] = useState<string>(defaultFile);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileItem[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // Update selected file when path param changes
  useEffect(() => {
    const newFile = filePath || pathParam || 'README.md';
    if (newFile !== selectedFile) {
      setSelectedFile(newFile);
    }
  }, [filePath, pathParam]);

  // Fetch file tree
  useEffect(() => {
    if (repoName) {
      fetchFileTree();
    }
  }, [repoName]);

  // Fetch content when file changes
  useEffect(() => {
    if (selectedFile && repoName) {
      fetchFileContent(selectedFile);
    }
  }, [repoName, selectedFile]);

  const fetchFileTree = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/repository/${repoName}/files`), {
        headers: {
          'x-dev-mode': 'true'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch file tree');
      }
      const data = await response.json();
      setFileTree(data);
      
      // Auto-expand directories with documentation
      const dirsToExpand = new Set<string>();
      const findDocDirs = (items: FileItem[], path = '') => {
        items.forEach(item => {
          const fullPath = path ? `${path}/${item.name}` : item.name;
          if (item.type === 'directory') {
            const hasDocFiles = item.children?.some(child => 
              child.name.toLowerCase().endsWith('.md') ||
              child.name.toLowerCase() === 'readme.md'
            );
            if (hasDocFiles) {
              dirsToExpand.add(fullPath);
            }
            if (item.children) {
              findDocDirs(item.children, fullPath);
            }
          }
        });
      };
      findDocDirs(data);
      setExpandedDirs(dirsToExpand);
    } catch (err) {
      console.error('Error fetching file tree:', err);
    }
  };

  const fetchFileContent = async (filePath: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(getApiUrl(`/api/repository/${repoName}/file?path=${encodeURIComponent(filePath)}`), {
        headers: {
          'x-dev-mode': 'true'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      setContent(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documentation');
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  const toggleDirectory = (path: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  const renderFileTree = (items: FileItem[], parentPath = ''): JSX.Element => {
    return (
      <ul className={styles.fileTreeList}>
        {items.map((item) => {
          const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
          const isExpanded = expandedDirs.has(fullPath);
          const isMarkdown = item.name.toLowerCase().endsWith('.md');
          const isSelected = fullPath === selectedFile;

          if (item.type === 'directory') {
            return (
              <li key={fullPath} className={`${styles.fileTreeItem} ${styles.directory}`}>
                <div
                  className={`${styles.fileTreeLabel} ${isExpanded ? styles.expanded : ''}`}
                  onClick={() => toggleDirectory(fullPath)}
                >
                  <span className={styles.icon}>{isExpanded ? '📂' : '📁'}</span>
                  <span className={styles.name}>{item.name}</span>
                </div>
                {isExpanded && item.children && (
                  <div className={styles.fileTreeChildren}>
                    {renderFileTree(item.children, fullPath)}
                  </div>
                )}
              </li>
            );
          }

          if (isMarkdown) {
            return (
              <li key={fullPath} className={`${styles.fileTreeItem} ${styles.file}`}>
                <div
                  className={`${styles.fileTreeLabel} ${isSelected ? styles.selected : ''}`}
                  onClick={() => setSelectedFile(fullPath)}
                >
                  <span className={styles.icon}>📄</span>
                  <span className={styles.name}>{item.name}</span>
                </div>
              </li>
            );
          }

          return null;
        })}
      </ul>
    );
  };

  // Generate breadcrumb components
  const generateBreadcrumbs = () => {
    const breadcrumbs = [];
    
    // Always include repository home link
    breadcrumbs.push(
      <Link 
        key="repo-home" 
        to={`/repository/${repoName}`} 
        className={styles.breadcrumbLink}
      >
        🏠 {repoName}
      </Link>
    );
    
    // Add documentation root if we're not on README
    if (selectedFile !== 'README.md') {
      breadcrumbs.push(
        <span key="separator-docs" className={styles.breadcrumbSeparator}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </span>
      );
      
      breadcrumbs.push(
        <button 
          key="readme-link" 
          onClick={() => setSelectedFile('README.md')}
          className={styles.breadcrumbButton}
        >
          📚 Documentation
        </button>
      );
    }
    
    // Add current file if it's not README
    if (selectedFile && selectedFile !== 'README.md') {
      breadcrumbs.push(
        <span key="separator-current" className={styles.breadcrumbSeparator}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </span>
      );
      
      // Format the filename for display
      const fileName = selectedFile.split('/').pop()?.replace('.md', '') || selectedFile;
      const displayName = fileName.split(/[-_]/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      breadcrumbs.push(
        <span key="current-file" className={styles.breadcrumbCurrent}>
          📄 {displayName}
        </span>
      );
    }
    
    return breadcrumbs;
  };

  return (
    <div className={styles.documentationView}>
      <div className={styles.docHeader}>
        <Link to="/" className={styles.backLink}>← Back to Repositories</Link>
        <h1>📚 Documentation: {repoName}</h1>
        
        {/* Breadcrumb navigation */}
        <nav className={styles.breadcrumbNav} aria-label="Documentation breadcrumb">
          {generateBreadcrumbs()}
        </nav>
      </div>

      <div className={styles.docContainer}>
        {/* Main Content Area - Navigation via links in README */}
        <main className={styles.docContent}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading documentation...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <h2>Error Loading Documentation</h2>
              <p>{error}</p>
              <button onClick={() => fetchFileContent(selectedFile)}>Retry</button>
            </div>
          ) : content ? (
            <EnhancedMarkdownViewer
              content={content}
              repoName={repoName}
              currentFilePath={selectedFile}
              onContentChange={(newContent) => setContent(newContent)}
              onNavigate={(path) => {
                console.log('Navigating to:', path);
                
                // Check if this is a React Router path (starts with routes like /coming-soon, /demo, /docs)
                const routerPaths = ['/coming-soon', '/demo', '/repository', '/apis', '/docs'];
                const isRouterPath = routerPaths.some(route => path.startsWith(route)) || 
                                   (path.startsWith('./') && routerPaths.some(route => path.includes(route)));
                
                if (isRouterPath) {
                  // Handle React Router navigation
                  console.log('Navigating to React Router path:', path);
                  let routerPath = path;
                  
                  // Clean up relative path syntax for router
                  if (routerPath.startsWith('./')) {
                    routerPath = routerPath.substring(2);
                  }
                  if (!routerPath.startsWith('/')) {
                    routerPath = '/' + routerPath;
                  }
                  
                  // Use window.location for immediate navigation to React routes
                  window.location.href = routerPath;
                  return;
                }
                
                // Handle markdown file navigation within the repository
                let targetPath: string;
                
                if (path.startsWith('./') || path.startsWith('../')) {
                  // Relative path - resolve based on current file
                  const currentDir = selectedFile.includes('/') 
                    ? selectedFile.substring(0, selectedFile.lastIndexOf('/'))
                    : '';
                  
                  if (path.startsWith('./')) {
                    targetPath = currentDir ? `${currentDir}/${path.substring(2)}` : path.substring(2);
                  } else {
                    // Handle ../ paths
                    let dir = currentDir;
                    let relativePath = path;
                    while (relativePath.startsWith('../')) {
                      const lastSlash = dir.lastIndexOf('/');
                      dir = lastSlash > 0 ? dir.substring(0, lastSlash) : '';
                      relativePath = relativePath.substring(3);
                    }
                    targetPath = dir ? `${dir}/${relativePath}` : relativePath;
                  }
                } else if (path.startsWith('/')) {
                  // Absolute path from repo root
                  targetPath = path.substring(1);
                } else {
                  // Plain path - treat as relative to current directory or from root
                  const currentDir = selectedFile.includes('/') 
                    ? selectedFile.substring(0, selectedFile.lastIndexOf('/'))
                    : '';
                  
                  if (currentDir) {
                    targetPath = `${currentDir}/${path}`;
                  } else {
                    targetPath = path;
                  }
                }
                
                // Add .md extension for file paths
                if (!targetPath.endsWith('.md')) {
                  targetPath += '.md';
                }
                
                console.log('Resolved target path for file:', targetPath);
                setSelectedFile(targetPath);
              }}
            />
          ) : (
            <div className={styles.emptyState}>
              <h2>Select a Documentation File</h2>
              <p>Choose a markdown file from the sidebar to view its contents.</p>
            </div>
          )}
        </main>
      </div>

    </div>
  );
};

export default DocumentationView;