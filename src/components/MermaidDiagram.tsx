/**
 * Mermaid Diagram Component
 * 
 * Renders Mermaid diagrams using mermaid.js
 * Supports various diagram types including flowcharts, sequence diagrams, etc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Download, Loader2, ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';

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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseModal();
    }
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
    <>
      <div className={`bg-white rounded-lg shadow-sm ${className}`}>
        <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700">{title || 'Diagram'}</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              className="inline-flex items-center justify-center w-8 h-8 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title="Zoom out"
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="inline-flex items-center justify-center px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors min-w-[3rem]"
              title="Reset zoom (100%)"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="inline-flex items-center justify-center w-8 h-8 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title="Zoom in"
              disabled={zoomLevel >= 3}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center justify-center w-8 h-8 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title="Open in full screen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center w-8 h-8 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title="Download diagram"
              disabled={!svgContent}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div 
          ref={containerRef}
          className="p-4 overflow-auto mermaid-container cursor-grab active:cursor-grabbing"
          style={{ 
            minHeight: '200px',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top left',
            transition: 'transform 0.2s ease'
          }}
        />
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={handleCloseModal}
          onKeyDown={handleModalKeyDown}
          tabIndex={-1}
        >
          <div 
            className="bg-white rounded-lg max-w-7xl max-h-full overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-gray-50 z-10">
              <h3 className="text-lg font-medium text-gray-900">{title || 'Diagram'}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                  title="Download diagram"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCloseModal}
                  className="inline-flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                  title="Close full screen (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div 
              className="p-8"
              dangerouslySetInnerHTML={{ __html: svgContent || '' }}
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            />
          </div>
        </div>
      )}
    </>
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