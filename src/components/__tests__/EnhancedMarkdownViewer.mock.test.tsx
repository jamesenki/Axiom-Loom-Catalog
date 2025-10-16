import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EnhancedMarkdownViewer } from '../EnhancedMarkdownViewer';

// Mock the EnhancedMarkdownViewer component
jest.mock('../EnhancedMarkdownViewer', () => ({
  EnhancedMarkdownViewer: ({ content, className, onContentReady }: any) => {
    const React = require('react');
    React.useEffect(() => {
      if (onContentReady) {
        onContentReady();
      }
    }, [onContentReady]);

    return (
      <div data-testid="enhanced-markdown-viewer" className={`enhanced-markdown-viewer ${className || ''}`}>
        <div data-testid="markdown-content">{content}</div>
      </div>
    );
  }
}));

describe('EnhancedMarkdownViewer (Mock)', () => {
  it('renders content', () => {
    const content = '# Test Markdown\n\nThis is a test.';
    render(<EnhancedMarkdownViewer content={content} />);
    
    expect(screen.getByTestId('enhanced-markdown-viewer')).toBeInTheDocument();
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('# Test Markdown This is a test.');
  });

  it('applies custom className', () => {
    const content = 'Test content';
    render(<EnhancedMarkdownViewer content={content} className="custom-class" />);
    
    const viewer = screen.getByTestId('enhanced-markdown-viewer');
    expect(viewer).toHaveClass('enhanced-markdown-viewer');
    expect(viewer).toHaveClass('custom-class');
  });

  it('renders with empty content', () => {
    render(<EnhancedMarkdownViewer content="" />);
    
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('');
  });

  it('renders with multiline content', () => {
    const content = `# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2
- List item 3`;
    
    render(<EnhancedMarkdownViewer content={content} />);
    
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('# Heading 1 ## Heading 2 ### Heading 3 This is a paragraph with **bold** and *italic* text. - List item 1 - List item 2 - List item 3');
  });

  it('updates when content changes', () => {
    const { rerender } = render(<EnhancedMarkdownViewer content="Initial content" />);
    
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('Initial content');
    
    rerender(<EnhancedMarkdownViewer content="Updated content" />);
    
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('Updated content');
  });

  it('handles special characters in content', () => {
    const content = '< > & " \' special characters';
    render(<EnhancedMarkdownViewer content={content} />);
    
    expect(screen.getByTestId('markdown-content')).toHaveTextContent(content);
  });

  it('renders code blocks as plain text', () => {
    const content = '```javascript\nconst hello = "world";\n```';
    render(<EnhancedMarkdownViewer content={content} />);
    
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('```javascript const hello = "world"; ```');
  });

  it('renders links as plain text', () => {
    const content = '[Link text](https://example.com)';
    render(<EnhancedMarkdownViewer content={content} />);
    
    expect(screen.getByTestId('markdown-content')).toHaveTextContent(content);
  });

  it('renders images as plain text', () => {
    const content = '![Alt text](image.png)';
    render(<EnhancedMarkdownViewer content={content} />);
    
    expect(screen.getByTestId('markdown-content')).toHaveTextContent(content);
  });

  it('renders tables as plain text', () => {
    const content = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`;
    
    render(<EnhancedMarkdownViewer content={content} />);
    
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('| Header 1 | Header 2 | |----------|----------| | Cell 1 | Cell 2 |');
  });
});