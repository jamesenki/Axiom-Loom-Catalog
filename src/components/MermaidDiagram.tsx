/**
 * Mermaid Diagram Component
 * 
 * Renders Mermaid diagrams using mermaid.js
 * Supports various diagram types including flowcharts, sequence diagrams, etc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Download, Loader2 } from 'lucide-react';

// Dynamic import to avoid SSR issues
let mermaidAPI: any = null;

interface MermaidDiagramProps {
  content: string;
  title?: string;
  className?: string;
  theme?: 'default' | 'dark' | 'forest' | 'neutral';
  onError?: (error: Error) => void;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  content,
  title,
  className = '',
  theme = 'default',
  onError
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isMermaidReady, setIsMermaidReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef<string>(`mermaid-${Date.now()}-${Math.random()}`);

  useEffect(() => {
    loadMermaid();
  }, []);

  useEffect(() => {
    if (isMermaidReady && content) {
      renderDiagram();
    }
  }, [content, theme, isMermaidReady]);

  const loadMermaid = async () => {
    try {
      if (!mermaidAPI) {
        // Using CDN for simplicity - in production, install via npm
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
        script.async = true;
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

        // Initialize mermaid
        const mermaid = (window as any).mermaid;
        mermaid.initialize({
          startOnLoad: false,
          theme: theme,
          securityLevel: 'loose',
          fontFamily: 'monospace',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          },
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            useMaxWidth: true
          },
          gantt: {
            numberSectionStyles: 4,
            axisFormat: '%Y-%m-%d'
          }
        });
        
        mermaidAPI = mermaid.mermaidAPI;
      } else {
        // Mermaid already loaded
      }
      
      setLoading(false);
      setIsMermaidReady(true);
    } catch (err) {
      setError('Failed to load Mermaid library');
      setLoading(false);
      if (err instanceof Error) {
        onError?.(err);
      }
    }
  };

  const renderDiagram = async () => {
    if (!content || !containerRef.current) return;

    setError(null);
    
    try {
      // Clear previous content
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // Generate a unique ID for this render
      const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Render the diagram
      const { svg } = await mermaidAPI.render(uniqueId, content);
      setSvgContent(svg);
      
      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to render diagram';
      setError(errorMessage);
      console.error('Mermaid rendering error:', err);
      console.error('Diagram content:', content);
      
      // Try to provide more helpful error messages
      if (errorMessage.includes('parse')) {
        setError('Invalid diagram syntax. Please check your Mermaid code.');
      }
      
      if (err instanceof Error) {
        onError?.(err);
      }
    }
  };

  const handleDownload = () => {
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'diagram'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gray-50 rounded-lg ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
        <span className="text-gray-600">Loading Mermaid...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-grow">
            <p className="text-red-700 font-medium">Failed to render Mermaid diagram</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <details className="mt-2">
              <summary className="text-red-600 text-xs cursor-pointer">View diagram source</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                {content}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
            title="Download diagram"
            disabled={!svgContent}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )}
      <div 
        ref={containerRef}
        className="p-4 overflow-auto mermaid-container"
        style={{ minHeight: '200px' }}
      />
    </div>
  );
};

// Mermaid syntax validator
export const validateMermaidSyntax = (content: string): { valid: boolean; error?: string } => {
  const trimmed = content.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Empty diagram content' };
  }
  
  // Check for common diagram types
  const validStarts = [
    'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 
    'stateDiagram', 'erDiagram', 'journey', 'gantt', 'pie',
    'gitGraph', 'mindmap', 'timeline'
  ];
  
  const hasValidStart = validStarts.some(start => 
    trimmed.startsWith(start) || trimmed.includes(`\n${start}`)
  );
  
  if (!hasValidStart) {
    return { 
      valid: false, 
      error: 'Diagram must start with a valid type (e.g., graph, flowchart, sequenceDiagram)' 
    };
  }
  
  return { valid: true };
};

export default MermaidDiagram;