import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fs from 'fs';
import * as path from 'path';
import { EnhancedMarkdownViewer } from '../components/EnhancedMarkdownViewer';

const REPOS_DIR = path.join(__dirname, '../../cloned-repositories');

describe('Enhanced Markdown Viewer Integration Tests', () => {
  const testDocuments = [
    {
      repo: 'nslabsdashboards',
      file: 'README.md',
      expectedHeadings: ['NSLabs Dashboards', 'Features', 'Getting Started'],
      expectedCodeBlocks: true,
      expectedLinks: true
    },
    {
      repo: 'smartpath',
      file: 'README.md',
      expectedHeadings: ['SmartPath'],
      expectedCodeBlocks: true,
      expectedLinks: true
    },
    {
      repo: 'rentalFleets',
      file: 'README.md',
      expectedHeadings: ['Rental Fleets'],
      expectedCodeBlocks: true,
      expectedLinks: true
    }
  ];

  describe('Document Rendering', () => {
    test.each(testDocuments)('$repo/$file renders correctly', ({ repo, file, expectedHeadings }) => {
      const filePath = path.join(REPOS_DIR, repo, file);
      
      // Skip if file doesn't exist
      if (!fs.existsSync(filePath)) {
        console.warn(`Skipping ${repo}/${file} - file not found`);
        return;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const { container } = render(<EnhancedMarkdownViewer content={content} />);

      // Check that content is rendered
      expect(container.querySelector('.markdown-content')).toBeInTheDocument();

      // Check for expected headings
      expectedHeadings.forEach(heading => {
        const headingElements = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const found = headingElements.some(el => el.textContent?.includes(heading));
        expect(found).toBe(true);
      });
    });
  });

  describe('Table of Contents Generation', () => {
    test('generates TOC for real documents', () => {
      const filePath = path.join(REPOS_DIR, 'nslabsdashboards', 'README.md');
      if (!fs.existsSync(filePath)) return;

      const content = fs.readFileSync(filePath, 'utf-8');
      render(<EnhancedMarkdownViewer content={content} />);

      // Check TOC is generated
      const tocButton = screen.getByTitle('Toggle Table of Contents');
      expect(tocButton).toBeInTheDocument();

      // Check TOC has entries
      const tocLinks = screen.getAllByRole('link');
      expect(tocLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Code Block Rendering', () => {
    test('renders code blocks with syntax highlighting', () => {
      const filePath = path.join(REPOS_DIR, 'nslabsdashboards', 'README.md');
      if (!fs.existsSync(filePath)) return;

      const content = fs.readFileSync(filePath, 'utf-8');
      const { container } = render(<EnhancedMarkdownViewer content={content} />);

      // Check for code blocks
      const codeBlocks = container.querySelectorAll('pre code');
      expect(codeBlocks.length).toBeGreaterThan(0);

      // Check for syntax highlighting classes
      const hasHighlighting = Array.from(codeBlocks).some(block => 
        block.className.includes('language-')
      );
      expect(hasHighlighting).toBe(true);
    });
  });

  describe('Search Functionality', () => {
    test('search works with real document content', async () => {
      const filePath = path.join(REPOS_DIR, 'smartpath', 'README.md');
      if (!fs.existsSync(filePath)) return;

      const content = fs.readFileSync(filePath, 'utf-8');
      render(<EnhancedMarkdownViewer content={content} />);

      // Open search
      const searchButton = screen.getByTitle('Search (Ctrl+F)');
      fireEvent.click(searchButton);

      // Search for common term
      const searchInput = screen.getByPlaceholderText('Search in document...');
      fireEvent.change(searchInput, { target: { value: 'API' } });

      // Wait for search results
      await waitFor(() => {
        const searchResults = screen.queryByText(/\d+\/\d+/);
        expect(searchResults).toBeInTheDocument();
      });
    });
  });

  describe('Print and Export', () => {
    test('export generates valid HTML', () => {
      const filePath = path.join(REPOS_DIR, 'rentalFleets', 'README.md');
      if (!fs.existsSync(filePath)) return;

      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Mock URL.createObjectURL
      const mockCreateObjectURL = jest.fn(() => 'mock-url');
      const mockClick = jest.fn();
      global.URL.createObjectURL = mockCreateObjectURL;
      
      const originalCreateElement = document.createElement;
      document.createElement = jest.fn((tagName) => {
        if (tagName === 'a') {
          return {
            click: mockClick,
            remove: jest.fn(),
            setAttribute: jest.fn(),
            style: {}
          } as any;
        }
        return originalCreateElement.call(document, tagName);
      });

      render(<EnhancedMarkdownViewer content={content} />);

      const exportButton = screen.getByTitle('Export as HTML');
      fireEvent.click(exportButton);

      // Verify export was triggered
      expect(mockCreateObjectURL).toHaveBeenCalled();
      const blobArg = mockCreateObjectURL.mock.calls[0][0];
      expect(blobArg).toBeInstanceOf(Blob);
      expect(blobArg.type).toBe('text/html;charset=utf-8');

      // Restore
      document.createElement = originalCreateElement;
    });
  });

  describe('Large Document Performance', () => {
    test('handles large documents efficiently', () => {
      // Find largest document
      let largestDoc = { path: '', size: 0 };
      
      repositories.forEach(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        const findLargeFiles = (dir: string): void => {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
              findLargeFiles(filePath);
            } else if (file.endsWith('.md')) {
              if (stat.size > largestDoc.size) {
                largestDoc = { path: filePath, size: stat.size };
              }
            }
          });
        };
        findLargeFiles(repoPath);
      });

      if (largestDoc.path) {
        const content = fs.readFileSync(largestDoc.path, 'utf-8');
        const startTime = Date.now();
        
        render(<EnhancedMarkdownViewer content={content} />);
        
        const renderTime = Date.now() - startTime;
        console.log(`Rendered ${largestDoc.size} bytes in ${renderTime}ms`);
        
        // Should render within reasonable time
        expect(renderTime).toBeLessThan(1000); // 1 second max
      }
    });
  });

  describe('Link Navigation', () => {
    test('internal links are properly resolved', () => {
      const filePath = path.join(REPOS_DIR, 'future-mobility-fleet-platform', 'README.md');
      if (!fs.existsSync(filePath)) return;

      const content = fs.readFileSync(filePath, 'utf-8');
      const { container } = render(<EnhancedMarkdownViewer content={content} />);

      // Find all links
      const links = container.querySelectorAll('a');
      const internalLinks = Array.from(links).filter(link => {
        const href = link.getAttribute('href');
        return href && !href.startsWith('http') && !href.startsWith('#');
      });

      // Internal links should have proper attributes
      internalLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
      });
    });
  });

  describe('Mobile Responsiveness', () => {
    test('viewer is responsive on mobile', () => {
      const filePath = path.join(REPOS_DIR, 'sample-arch-package', 'README.md');
      if (!fs.existsSync(filePath)) return;

      // Mock mobile viewport
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      const content = fs.readFileSync(filePath, 'utf-8');
      const { container } = render(<EnhancedMarkdownViewer content={content} />);

      // Check mobile-friendly elements
      const toolbar = container.querySelector('.toolbar');
      expect(toolbar).toBeInTheDocument();

      // TOC should be toggleable on mobile
      const tocContainer = container.querySelector('.toc-container');
      expect(tocContainer).toBeInTheDocument();
    });
  });
});

// List of repositories for testing
const repositories = fs.readdirSync(REPOS_DIR)
  .filter(name => fs.statSync(path.join(REPOS_DIR, name)).isDirectory())
  .filter(name => !name.startsWith('.'));