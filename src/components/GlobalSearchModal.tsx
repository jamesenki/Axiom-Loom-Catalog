/**
 * Global Search Modal Component
 * 
 * Provides a full-screen modal search interface with keyboard shortcuts
 */

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { AdvancedSearch } from './AdvancedSearch';
import { SearchResult } from '../services/searchService';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleResultSelect = (result: SearchResult) => {
    onClose();
    
    // Navigate based on result type
    switch (result.type) {
      case 'repository':
        navigate(`/repository/${result.repository}`);
        break;
      case 'file':
        navigate(`/repository/${result.repository}?file=${result.path}`);
        break;
      case 'api':
        navigate(`/api-hub/${result.repository}`);
        break;
      default:
        navigate(`/repository/${result.repository}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center pt-16 px-4">
        <div 
          ref={modalRef}
          className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Search EYNS AI Experience Center</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
            <AdvancedSearch 
              onResultSelect={handleResultSelect}
              className="w-full"
            />
          </div>
          
          {/* Footer */}
          <div className="px-6 py-3 border-t bg-gray-50 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span><kbd className="px-2 py-1 bg-gray-200 rounded">↑↓</kbd> Navigate</span>
                <span><kbd className="px-2 py-1 bg-gray-200 rounded">Enter</kbd> Select</span>
                <span><kbd className="px-2 py-1 bg-gray-200 rounded">Esc</kbd> Close</span>
              </div>
              <div>
                Press <kbd className="px-2 py-1 bg-gray-200 rounded">Cmd+K</kbd> to open search
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;