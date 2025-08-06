/**
 * PlantUML Diagram Component
 * 
 * Renders PlantUML diagrams by sending content to backend API
 * Supports caching and error handling
 */

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Loader2, RefreshCw, Download } from 'lucide-react';
import { getApiUrl } from '../utils/apiConfig';

interface PlantUmlDiagramProps {
  content: string;
  title?: string;
  format?: 'svg' | 'png';
  className?: string;
  onError?: (error: Error) => void;
}

export const PlantUmlDiagram: React.FC<PlantUmlDiagramProps> = ({
  content,
  title,
  format = 'svg',
  className = '',
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    renderDiagram();

    return () => {
      // Cleanup: abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Revoke object URL to free memory
      if (diagramUrl) {
        URL.revokeObjectURL(diagramUrl);
      }
    };
  }, [content, format, retryCount]);

  const renderDiagram = async () => {
    if (!content || !content.trim()) {
      setError('No PlantUML content provided');
      return;
    }

    setLoading(true);
    setError(null);

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(getApiUrl('/api/plantuml/render'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, format }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to render diagram');
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create object URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Revoke previous URL if exists
      if (diagramUrl) {
        URL.revokeObjectURL(diagramUrl);
      }
      
      setDiagramUrl(url);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          // Request was aborted, don't set error
          return;
        }
        setError(err.message);
        onError?.(err);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleDownload = () => {
    if (!diagramUrl) return;

    const link = document.createElement('a');
    link.href = diagramUrl;
    link.download = `${title || 'diagram'}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validatePlantUml = async () => {
    try {
      const response = await fetch(getApiUrl('/api/plantuml/validate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
      });

      const result = await response.json();
      if (!result.valid) {
        setError(result.error || 'Invalid PlantUML syntax');
      }
    } catch (err) {
      console.error('Validation error:', err);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gray-50 rounded-lg ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
        <span className="text-gray-600">Rendering diagram...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-grow">
            <p className="text-red-700 font-medium">Failed to render diagram</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            {content.includes('@startuml') && content.includes('@enduml') ? (
              <button
                onClick={handleRetry}
                className="mt-2 inline-flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </button>
            ) : (
              <p className="text-red-600 text-xs mt-2">
                Tip: PlantUML diagrams must start with @startuml and end with @enduml
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!diagramUrl) {
    return (
      <div className={`p-8 bg-gray-50 rounded-lg text-center ${className}`}>
        <p className="text-gray-500">No diagram to display</p>
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
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="p-4 overflow-auto">
        {format === 'svg' ? (
          <div 
            className="inline-block"
            dangerouslySetInnerHTML={{ 
              __html: `<img src="${diagramUrl}" alt="${title || 'PlantUML Diagram'}" />` 
            }}
          />
        ) : (
          <img 
            src={diagramUrl} 
            alt={title || 'PlantUML Diagram'}
            className="max-w-full h-auto"
          />
        )}
      </div>
    </div>
  );
};

export default PlantUmlDiagram;