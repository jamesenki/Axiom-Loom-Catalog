import React from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FolderOpen, 
  Search, 
  Wifi, 
  AlertTriangle, 
  Plus, 
  RefreshCw,
  Coffee,
  Sparkles
} from 'lucide-react';
import { theme } from '../../styles/design-system';
import { Button } from './Button';
import { H2, Text } from './Typography';

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const sparkle = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[16]} ${props => props.theme.spacing[8]};
  text-align: center;
  min-height: 400px;
  position: relative;
`;

const EmptyStateIcon = styled.div<{ variant?: string }>`
  width: 120px;
  height: 120px;
  margin-bottom: ${props => props.theme.spacing[6]};
  background: ${props => {
    const backgrounds: Record<string, string> = {
      'no-data': `linear-gradient(135deg, ${props => props.theme.colors.text.secondary}20 0%, ${props => props.theme.colors.text.secondary}10 100%)`,
      'no-results': `linear-gradient(135deg, ${props => props.theme.colors.semantic.warning}20 0%, ${props => props.theme.colors.semantic.warning}10 100%)`,
      'error': `linear-gradient(135deg, ${props => props.theme.colors.semantic.error}20 0%, ${props => props.theme.colors.semantic.error}10 100%)`,
      'offline': `linear-gradient(135deg, ${props => props.theme.colors.text.secondary}20 0%, ${props => props.theme.colors.text.secondary}10 100%)`,
      'success': `linear-gradient(135deg, ${props => props.theme.colors.semantic.success}20 0%, ${props => props.theme.colors.semantic.success}10 100%)`,
    };
    return backgrounds[props.variant || 'no-data'] || backgrounds['no-data'];
  }};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 6s ease-in-out infinite;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${props => props.theme.colors.primary.yellow}10 0%, transparent 50%);
    animation: ${sparkle} 4s ease-in-out infinite;
  }

  svg {
    color: ${props => {
      const colors: Record<string, string> = {
        'no-data': theme.colors.text.secondary,
        'no-results': theme.colors.semantic.warning,
        'error': theme.colors.semantic.error,
        'offline': theme.colors.text.secondary,
        'success': theme.colors.semantic.success,
      };
      return colors[props.variant || 'no-data'] || colors['no-data'];
    }};
    position: relative;
    z-index: 1;
  }
`;

const EmptyStateTitle = styled(H2)`
  margin-bottom: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.text.primary};
`;

const EmptyStateDescription = styled(Text)`
  margin-bottom: ${props => props.theme.spacing[8]};
  color: ${props => props.theme.colors.text.secondary};
  max-width: 500px;
  line-height: 1.6;
`;

const EmptyStateActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  flex-wrap: wrap;
  justify-content: center;
`;

const DecorationElement = styled.div<{ 
  top?: string; 
  left?: string; 
  right?: string; 
  bottom?: string;
  delay?: string;
}>`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.primary.yellow}10;
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  animation: ${float} 8s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${props => props.theme.colors.primary.yellow}40;
  }
`;

interface EmptyStateProps {
  variant?: 'no-data' | 'no-results' | 'error' | 'offline' | 'success';
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  customIcon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'no-data',
  title,
  description,
  primaryAction,
  secondaryAction,
  customIcon
}) => {
  const getDefaultIcon = (variant: string) => {
    const icons: Record<string, React.ReactNode> = {
      'no-data': <FolderOpen size={48} />,
      'no-results': <Search size={48} />,
      'error': <AlertTriangle size={48} />,
      'offline': <Wifi size={48} />,
      'success': <Sparkles size={48} />,
    };
    return icons[variant] || icons['no-data'];
  };

  return (
    <EmptyStateContainer>
      {/* Decorative elements */}
      <DecorationElement top="10%" left="10%" delay="0s">
        <Sparkles size={20} />
      </DecorationElement>
      <DecorationElement top="20%" right="15%" delay="2s">
        <Coffee size={20} />
      </DecorationElement>
      <DecorationElement bottom="15%" left="20%" delay="4s">
        <Plus size={20} />
      </DecorationElement>
      <DecorationElement bottom="25%" right="10%" delay="6s">
        <RefreshCw size={20} />
      </DecorationElement>

      <EmptyStateIcon variant={variant}>
        {customIcon || getDefaultIcon(variant)}
      </EmptyStateIcon>

      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateDescription>{description}</EmptyStateDescription>

      {(primaryAction || secondaryAction) && (
        <EmptyStateActions>
          {primaryAction && (
            <Button
              variant="primary"
              onClick={primaryAction.onClick}
            >
              {primaryAction.icon}
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </Button>
          )}
        </EmptyStateActions>
      )}
    </EmptyStateContainer>
  );
};

// Specialized empty state components
export const NoRepositoriesState: React.FC<{ onAddRepository: () => void }> = ({ onAddRepository }) => (
  <EmptyState
    variant="no-data"
    title="No Repositories Found"
    description="Get started by adding your first repository to the experience center. You can sync from GitHub, GitLab, or add them manually."
    primaryAction={{
      label: 'Add Repository',
      onClick: onAddRepository,
      icon: <Plus size={16} />
    }}
  />
);

export const NoSearchResultsState: React.FC<{ 
  query: string; 
  onClearSearch: () => void; 
  onBrowseAll: () => void;
}> = ({ query, onClearSearch, onBrowseAll }) => (
  <EmptyState
    variant="no-results"
    title="No Results Found"
    description={`We couldn't find anything matching "${query}". Try different keywords or browse all available resources.`}
    primaryAction={{
      label: 'Browse All',
      onClick: onBrowseAll,
      icon: <FolderOpen size={16} />
    }}
    secondaryAction={{
      label: 'Clear Search',
      onClick: onClearSearch,
      icon: <RefreshCw size={16} />
    }}
  />
);

export const ErrorState: React.FC<{ 
  title?: string;
  description?: string;
  onRetry: () => void; 
  onGoHome: () => void;
}> = ({ 
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again or return to the home page.",
  onRetry, 
  onGoHome 
}) => (
  <EmptyState
    variant="error"
    title={title}
    description={description}
    primaryAction={{
      label: 'Try Again',
      onClick: onRetry,
      icon: <RefreshCw size={16} />
    }}
    secondaryAction={{
      label: 'Go Home',
      onClick: onGoHome,
      icon: <FolderOpen size={16} />
    }}
  />
);

export const OfflineState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <EmptyState
    variant="offline"
    title="You're Offline"
    description="It looks like you've lost your internet connection. Please check your connection and try again."
    primaryAction={{
      label: 'Retry',
      onClick: onRetry,
      icon: <RefreshCw size={16} />
    }}
  />
);

export const SuccessState: React.FC<{ 
  title: string;
  description: string;
  onContinue: () => void;
  continueLabel?: string;
}> = ({ title, description, onContinue, continueLabel = "Continue" }) => (
  <EmptyState
    variant="success"
    title={title}
    description={description}
    primaryAction={{
      label: continueLabel,
      onClick: onContinue,
      icon: <Sparkles size={16} />
    }}
  />
);

export default EmptyState;