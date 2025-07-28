/**
 * Documentation View Component
 * 
 * Displays repository documentation with enhanced markdown features
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EnhancedMarkdownViewer from './EnhancedMarkdownViewer';
import styles from './DocumentationView.module.css';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileItem[];
}

const DocumentationView: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [selectedFile, setSelectedFile] = useState<string>('README.md');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileItem[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // Fetch file tree
  useEffect(() => {
    fetchFileTree();
  }, [repoName]);

  // Fetch content when file changes
  useEffect(() => {
    if (selectedFile) {
      fetchFileContent(selectedFile);
    }
  }, [repoName, selectedFile]);

  const fetchFileTree = async () => {
    try {
      const response = await fetch(`/api/repository/${repoName}/files`);
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
      const response = await fetch(`/api/repository/${repoName}/file?path=${encodeURIComponent(filePath)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch file content');
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
        {/* File Explorer Sidebar */}
        <aside className={styles.docSidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Documentation Files</h3>
          </div>
          <div className={styles.fileTree}>
            {fileTree.length > 0 ? renderFileTree(fileTree) : (
              <p className={styles.noFiles}>No documentation files found</p>
            )}
          </div>
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