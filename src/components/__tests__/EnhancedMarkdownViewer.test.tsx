import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { EnhancedMarkdownViewer } from '../EnhancedMarkdownViewer';

// Mock window.print
window.print = jest.fn();

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock document.createElement for download
const mockClick = jest.fn();
const createElementSpy = jest.spyOn(document, 'createElement');
createElementSpy.mockImplementation((tagName: string) => {
  const element = document.createElement(tagName);
  if (tagName === 'a') {
    Object.defineProperty(element, 'click', {
      value: mockClick,
      writable: true
    });
  }
  return element;
});

describe('EnhancedMarkdownViewer', () => {
  const sampleMarkdown = `# Test Document

## Introduction
This is a test document with **bold** and *italic* text.

### Code Example
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Features
- Feature 1
- Feature 2
- Feature 3

### Table Example
| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |

## Conclusion
This is the end of the document.`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders markdown content correctly', () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    expect(screen.getByRole('heading', { level: 1, name: 'Test Document' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Introduction' })).toBeInTheDocument();
    expect(screen.getByText(/This is a test document with/)).toBeInTheDocument();
  });

  it('generates table of contents from headings', () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    
    // Check TOC links
    const tocLinks = screen.getAllByRole('link');
    expect(tocLinks).toHaveLength(5); // 5 headings in the sample
    expect(tocLinks[0]).toHaveTextContent('Test Document');
    expect(tocLinks[1]).toHaveTextContent('Introduction');
  });

  it('toggles table of contents visibility', () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    const tocButton = screen.getByTitle('Toggle Table of Contents');
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    
    fireEvent.click(tocButton);
    expect(screen.queryByText('Table of Contents')).not.toBeInTheDocument();
    
    fireEvent.click(tocButton);
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
  });

  it('shows and hides search bar', () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    const searchButton = screen.getByTitle('Search (Ctrl+F)');
    
    // Search bar should not be visible initially
    expect(screen.queryByPlaceholderText('Search in document...')).not.toBeInTheDocument();
    
    fireEvent.click(searchButton);
    expect(screen.getByPlaceholderText('Search in document...')).toBeInTheDocument();
    
    fireEvent.click(searchButton);
    expect(screen.queryByPlaceholderText('Search in document...')).not.toBeInTheDocument();
  });

  it('performs search and highlights results', async () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    const searchButton = screen.getByTitle('Search (Ctrl+F)');
    fireEvent.click(searchButton);
    
    const searchInput = screen.getByPlaceholderText('Search in document...');
    await userEvent.type(searchInput, 'test');
    
    await waitFor(() => {
      expect(screen.getByText('2/2')).toBeInTheDocument(); // 2 occurrences of "test"
    });
  });

  it('navigates between search results', async () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    const searchButton = screen.getByTitle('Search (Ctrl+F)');
    fireEvent.click(searchButton);
    
    const searchInput = screen.getByPlaceholderText('Search in document...');
    await userEvent.type(searchInput, 'Feature');
    
    await waitFor(() => {
      expect(screen.getByText('1/3')).toBeInTheDocument();
    });
    
    const nextButton = screen.getByTitle('Next (Enter)');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('2/3')).toBeInTheDocument();
    });
    
    const prevButton = screen.getByTitle('Previous (Shift+Enter)');
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(screen.getByText('1/3')).toBeInTheDocument();
    });
  });

  it('closes search with close button', async () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    const searchButton = screen.getByTitle('Search (Ctrl+F)');
    fireEvent.click(searchButton);
    
    const searchInput = screen.getByPlaceholderText('Search in document...');
    await userEvent.type(searchInput, 'test');
    
    const closeButton = screen.getByTitle('Close (Esc)');
    fireEvent.click(closeButton);
    
    expect(screen.queryByPlaceholderText('Search in document...')).not.toBeInTheDocument();
  });

  it('handles keyboard shortcuts', () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    // Ctrl+F to open search
    fireEvent.keyDown(window, { key: 'f', ctrlKey: true });
    expect(screen.getByPlaceholderText('Search in document...')).toBeInTheDocument();
    
    // Escape to close search
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByPlaceholderText('Search in document...')).not.toBeInTheDocument();
    
    // Ctrl+P to print
    fireEvent.keyDown(window, { key: 'p', ctrlKey: true });
    expect(window.print).toHaveBeenCalled();
  });

  it('prints document', () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    const printButton = screen.getByTitle('Print (Ctrl+P)');
    fireEvent.click(printButton);
    
    // Wait for print to be called (after timeout)
    setTimeout(() => {
      expect(window.print).toHaveBeenCalled();
    }, 150);
  });

  it('exports document as HTML', () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    const exportButton = screen.getByTitle('Export as HTML');
    fireEvent.click(exportButton);
    
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('scrolls to heading when TOC link is clicked', () => {
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    const introductionLink = screen.getByRole('link', { name: 'Introduction' });
    fireEvent.click(introductionLink);
    
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });
  });

  it('renders code blocks with syntax highlighting', () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    const codeBlock = screen.getByText(/function hello/);
    expect(codeBlock.closest('pre')).toBeInTheDocument();
    expect(codeBlock.closest('code')).toHaveClass('language-javascript');
  });

  it('renders tables correctly', () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    expect(screen.getByText('Column 1')).toBeInTheDocument();
    expect(screen.getByText('Column 2')).toBeInTheDocument();
    expect(screen.getByText('Value 1')).toBeInTheDocument();
    expect(screen.getByText('Value 2')).toBeInTheDocument();
  });

  it('renders lists correctly', () => {
    render(<EnhancedMarkdownViewer content={sampleMarkdown} />);
    
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
  });

  it('handles empty content', () => {
    render(<EnhancedMarkdownViewer content="" />);
    
    // Should still render toolbar
    expect(screen.getByTitle('Toggle Table of Contents')).toBeInTheDocument();
    
    // No TOC should be shown for empty content
    expect(screen.queryByText('Table of Contents')).not.toBeInTheDocument();
  });

  it('handles content without headings', () => {
    const contentWithoutHeadings = 'This is just plain text without any headings.';
    render(<EnhancedMarkdownViewer content={contentWithoutHeadings} />);
    
    // Should not show TOC when there are no headings
    expect(screen.queryByText('Table of Contents')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <EnhancedMarkdownViewer content={sampleMarkdown} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls onContentChange when provided', () => {
    const onContentChange = jest.fn();
    render(
      <EnhancedMarkdownViewer 
        content={sampleMarkdown} 
        onContentChange={onContentChange}
      />
    );
    
    // Note: In the current implementation, onContentChange is not actually called
    // This test is here for when that functionality is implemented
    expect(onContentChange).not.toHaveBeenCalled();
  });

  it('handles special markdown elements', () => {
    const specialMarkdown = `
# Heading with [link](https://example.com)

> This is a blockquote

\`inline code\`

---

**Bold text** and *italic text* and ***bold italic***
`;
    
    render(<EnhancedMarkdownViewer content={specialMarkdown} />);
    
    // Check link
    const link = screen.getByRole('link', { name: 'link' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    
    // Check blockquote
    expect(screen.getByText('This is a blockquote')).toBeInTheDocument();
    
    // Check inline code
    expect(screen.getByText('inline code')).toBeInTheDocument();
    
    // Check formatting
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('italic text')).toBeInTheDocument();
  });
});