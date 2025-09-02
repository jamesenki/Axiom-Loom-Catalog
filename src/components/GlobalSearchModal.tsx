/**
 * Global Search Modal Component
 * 
 * Provides a full-screen modal search interface with keyboard shortcuts
 * Uses Axiom Loom design system and styled-components
 */

import React, { useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/design-system';
import { AdvancedSearch } from './AdvancedSearch';
import { SearchResult } from '../services/searchService';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: flex-start;
  justify-content: center;
  padding: ${props => props.theme.spacing[16]} ${props => props.theme.spacing[4]};
  animation: ${props => props.isOpen ? css`${fadeIn}` : css`${fadeOut}`} 0.3s ease-in-out;
`;

const ModalContent = styled.div<{ isOpen: boolean }>`
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  width: 100%;
  max-width: 896px;
  max-height: 80vh;
  overflow: hidden;
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)'};
  transition: transform 0.3s ease-in-out;
  border: 2px solid ${props => props.theme.colors.primary.yellow};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  border-bottom: 2px solid ${props => props.theme.colors.primary.yellow};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.black} 0%, ${props => props.theme.colors.secondary.darkGray} 100%);
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary.white};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.primary.white};
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(255, 230, 0, 0.2);
    transform: scale(1.05);
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary.yellow};
    outline-offset: 2px;
  }
`;

const ModalBody = styled.div`
  padding: ${props => props.theme.spacing[6]};
  max-height: calc(80vh - 140px);
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  border-top: 1px solid ${props => props.theme.colors.border.light};
  background: ${props => props.theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const KeyboardShortcuts = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
`;

const KeyboardKey = styled.kbd`
  background: ${props => props.theme.colors.background.tertiary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  color: ${props => props.theme.colors.text.primary};
`;

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

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent isOpen={isOpen} ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <Search size={24} />
            Search Axiom Loom Catalog
          </ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close search modal">
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <AdvancedSearch 
            onResultSelect={handleResultSelect}
            className="w-full"
          />
        </ModalBody>
        
        <ModalFooter>
          <KeyboardShortcuts>
            <span><KeyboardKey>↑↓</KeyboardKey> Navigate</span>
            <span><KeyboardKey>Enter</KeyboardKey> Select</span>
            <span><KeyboardKey>Esc</KeyboardKey> Close</span>
          </KeyboardShortcuts>
          <div>
            Press <KeyboardKey>Cmd+K</KeyboardKey> to open search
          </div>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default GlobalSearchModal;