import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { Keyboard, Command, Search, Home, Settings, Book, Zap, X } from 'lucide-react';
import { theme } from '../styles/design-system';
import { useGlobalSearch } from '../hooks/useGlobalSearch';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const KeyboardShortcutsOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background.overlay};
  z-index: ${props => props.theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
`;

const ShortcutsModal = styled.div<{ isVisible: boolean }>`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[8]};
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.xl};
  transform: ${props => props.isVisible ? 'scale(1)' : 'scale(0.9)'};
  animation: ${props => props.isVisible ? css`${slideUp}` : 'none'} ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing[6]};
  padding-bottom: ${props => props.theme.spacing[4]};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${props => props.theme.animations.duration.fast} ${props => props.theme.animations.easing.easeOut};

  &:hover {
    background: ${props => props.theme.colors.background.secondary};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ShortcutSection = styled.div`
  margin-bottom: ${props => props.theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

const ShortcutList = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing[3]};
`;

const ShortcutItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: background ${props => props.theme.animations.duration.fast} ${props => props.theme.animations.easing.easeOut};

  &:hover {
    background: ${props => props.theme.colors.background.tertiary};
  }
`;

const ShortcutDescription = styled.span`
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const ShortcutKeys = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[1]};
`;

const Key = styled.kbd`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  box-shadow: inset 0 -2px 0 ${props => props.theme.colors.border.medium};
  min-width: 24px;
  text-align: center;
`;

const StatusIndicator = styled.div<{ isActive: boolean }>`
  position: fixed;
  bottom: ${props => props.theme.spacing[4]};
  right: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.full};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  box-shadow: ${props => props.theme.shadows.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  z-index: ${props => props.theme.zIndex.fixed};
  opacity: ${props => props.isActive ? 1 : 0.7};
  transition: all ${props => props.theme.animations.duration.fast} ${props => props.theme.animations.easing.easeOut};

  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    opacity: 1;
  }
`;

interface Shortcut {
  keys: string[];
  description: string;
  action: () => void;
  section: string;
}

interface KeyboardShortcutsProps {
  onDemoToggle?: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onDemoToggle }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { openSearch } = useGlobalSearch();

  const shortcuts: Shortcut[] = [
    // Navigation
    {
      keys: ['g', 'h'],
      description: 'Go to Home',
      action: () => navigate('/'),
      section: 'Navigation'
    },
    {
      keys: ['g', 's'],
      description: 'Go to Sync Settings',
      action: () => navigate('/sync'),
      section: 'Navigation'
    },
    {
      keys: ['g', 'p'],
      description: 'Go to Profile',
      action: () => navigate('/profile'),
      section: 'Navigation'
    },

    // Search
    {
      keys: ['Cmd', 'k'],
      description: 'Open Global Search',
      action: () => openSearch(),
      section: 'Search'
    },
    {
      keys: ['/'],
      description: 'Focus Search',
      action: () => openSearch(),
      section: 'Search'
    },

    // Demo & Help
    {
      keys: ['d'],
      description: 'Toggle Demo Mode',
      action: () => onDemoToggle?.(),
      section: 'Demo'
    },
    {
      keys: ['?'],
      description: 'Show Keyboard Shortcuts',
      action: () => setShowModal(true),
      section: 'Help'
    },

    // Quick Actions
    {
      keys: ['n'],
      description: 'Add New Repository',
      action: () => {
        // This would trigger the add repository modal
        const addButton = document.querySelector('[data-action="add-repository"]') as HTMLElement;
        addButton?.click();
      },
      section: 'Actions'
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isModifier = event.metaKey || event.ctrlKey || event.altKey || event.shiftKey;
      
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Handle special key combinations
      if ((event.metaKey || event.ctrlKey) && key === 'k') {
        event.preventDefault();
        openSearch();
        return;
      }

      // Handle escape key
      if (key === 'escape') {
        setShowModal(false);
        return;
      }

      // Handle single character shortcuts
      if (!isModifier) {
        setActiveKeys(prev => new Set([...prev, key]));

        // Check for single key shortcuts
        const singleKeyShortcut = shortcuts.find(
          shortcut => shortcut.keys.length === 1 && shortcut.keys[0].toLowerCase() === key
        );

        if (singleKeyShortcut) {
          event.preventDefault();
          singleKeyShortcut.action();
          setActiveKeys(new Set());
          return;
        }

        // Check for multi-key sequences (like 'g h')
        setTimeout(() => {
          const activeKeysArray = Array.from(activeKeys);
          activeKeysArray.push(key);
          
          const sequence = activeKeysArray.join(' ');
          const sequenceShortcut = shortcuts.find(
            shortcut => shortcut.keys.join(' ').toLowerCase() === sequence
          );

          if (sequenceShortcut) {
            event.preventDefault();
            sequenceShortcut.action();
          }

          setActiveKeys(new Set());
        }, 100);
      }
    },
    [activeKeys, shortcuts, openSearch, onDemoToggle]
  );

  const handleKeyUp = useCallback(() => {
    // Clear active keys after a delay
    setTimeout(() => setActiveKeys(new Set()), 1000);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const shortcutsBySection = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.section]) {
      acc[shortcut.section] = [];
    }
    acc[shortcut.section].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  const getSectionIcon = (section: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Navigation': <Home size={16} />,
      'Search': <Search size={16} />,
      'Demo': <Zap size={16} />,
      'Help': <Book size={16} />,
      'Actions': <Settings size={16} />
    };
    return icons[section] || <Command size={16} />;
  };

  return (
    <>
      <StatusIndicator isActive={activeKeys.size > 0}>
        <Keyboard size={16} />
        {activeKeys.size > 0 ? Array.from(activeKeys).join(' ') : 'Press ? for shortcuts'}
      </StatusIndicator>

      <KeyboardShortcutsOverlay
        isVisible={showModal}
        onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
      >
        <ShortcutsModal isVisible={showModal}>
          <ModalHeader>
            <ModalTitle>
              <Keyboard size={24} />
              Keyboard Shortcuts
            </ModalTitle>
            <CloseButton onClick={() => setShowModal(false)}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          {Object.entries(shortcutsBySection).map(([section, sectionShortcuts]) => (
            <ShortcutSection key={section}>
              <SectionTitle>
                {getSectionIcon(section)}
                {section}
              </SectionTitle>
              <ShortcutList>
                {sectionShortcuts.map((shortcut, index) => (
                  <ShortcutItem key={index}>
                    <ShortcutDescription>{shortcut.description}</ShortcutDescription>
                    <ShortcutKeys>
                      {shortcut.keys.map((key, keyIndex) => (
                        <Key key={keyIndex}>
                          {key === 'Cmd' ? '⌘' : key === 'Ctrl' ? 'Ctrl' : key.toUpperCase()}
                        </Key>
                      ))}
                    </ShortcutKeys>
                  </ShortcutItem>
                ))}
              </ShortcutList>
            </ShortcutSection>
          ))}

          <div style={{ 
            marginTop: theme.spacing[6], 
            padding: theme.spacing[4], 
            background: theme.colors.background.secondary, 
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary
          }}>
            <strong>Pro Tips:</strong>
            <ul style={{ margin: `${props => props.theme.spacing[2]} 0`, paddingLeft: theme.spacing[4] }}>
              <li>Use sequence shortcuts like "g h" (press 'g' then 'h' quickly)</li>
              <li>Shortcuts are disabled when typing in input fields</li>
              <li>Press Escape to close any modal or overlay</li>
            </ul>
          </div>
        </ShortcutsModal>
      </KeyboardShortcutsOverlay>
    </>
  );
};

export default KeyboardShortcuts;