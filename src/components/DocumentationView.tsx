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
  const { repoName } = useParams<{ repoName: string }>();
  const [searchParams] = useSearchParams();
  const pathParam = searchParams.get('path');
  const [selectedFile, setSelectedFile] = useState<string>(pathParam || 'README.md');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileItem[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // Update selected file when path param changes
  useEffect(() => {
    if (pathParam) {
      setSelectedFile(pathParam);
    }
  }, [pathParam]);

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

  return (
    <div className={styles.documentationView}>
      <div className={styles.docHeader}>
        <Link to="/" className={styles.backLink}>← Back to Repositories</Link>
        <h1>📚 Documentation: {repoName}</h1>
      </div>

      <div className={styles.docContainer}>
        {/* File Tree Sidebar */}
        <aside className={styles.docSidebar}>
          <h3 className={styles.sidebarTitle}>📁 Documentation Files</h3>
          {fileTree.length > 0 ? (
            <div className={styles.fileTree}>
              {renderFileTree(fileTree)}
            </div>
          ) : (
            <p className={styles.emptyMessage}>Loading files...</p>
          )}
        </aside>

        {/* Main Content Area */}
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
              onContentChange={(newContent) => setContent(newContent)}
              onNavigate={(path) => {
                // Handle navigation to other markdown files
                console.log('Navigating to:', path);
                
                // Handle relative paths
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
                  // Plain path - could be relative to current directory or from root
                  const currentDir = selectedFile.includes('/') 
                    ? selectedFile.substring(0, selectedFile.lastIndexOf('/'))
                    : '';
                  
                  // First try relative to current directory
                  if (currentDir) {
                    targetPath = `${currentDir}/${path}`;
                  } else {
                    targetPath = path;
                  }
                }
                
                // Ensure .md extension only if not already present
                if (!targetPath.endsWith('.md')) {
                  targetPath += '.md';
                }
                
                console.log('Resolved target path:', targetPath);
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