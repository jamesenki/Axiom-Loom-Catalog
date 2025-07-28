import React from 'react';

interface EnhancedMarkdownViewerProps {
  content: string;
  className?: string;
  onContentChange?: (content: string) => void;
}

export const EnhancedMarkdownViewer: React.FC<EnhancedMarkdownViewerProps> = ({ 
  content, 
  className = '',
  onContentChange 
}) => {
  return (
    <div className={`enhanced-markdown-viewer ${className}`} data-testid="enhanced-markdown-viewer">
      <div className="markdown-content" data-testid="markdown-content">
        {content}
      </div>
    </div>
  );
};