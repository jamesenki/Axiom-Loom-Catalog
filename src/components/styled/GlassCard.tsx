/**
 * Professional Card Components
 * Clean, readable cards for enterprise applications
 */

import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { quantumColors, glassMorphism, quantumAnimations } from '../../styles/axiom-theme';

// Simple hover effect only - no dramatic animations

// Professional card styles - clean and simple
const baseGlassStyles = css<{
  variant: 'default' | 'elevated' | 'floating' | 'interactive';
  glowEffect: boolean;
  shimmerEffect: boolean;
}>`
  /* Clean white background */
  background: #FFFFFF;
  border: ${glassMorphism.border.subtle};
  border-radius: 8px;
  position: relative;
  
  /* Subtle shadow */
  box-shadow: ${glassMorphism.shadow.soft};
  
  /* Variant-specific styles */
  ${props => {
    switch (props.variant) {
      case 'elevated':
        return css`
          box-shadow: ${glassMorphism.shadow.medium};
        `;
      case 'floating':
        return css`
          box-shadow: ${glassMorphism.shadow.dramatic};
        `;
      case 'interactive':
        return css`
          cursor: pointer;
          transition: all ${quantumAnimations.duration.normal} ${quantumAnimations.easing.quantum};
          
          &:hover {
            background: ${glassMorphism.background.secondary};
            border: ${glassMorphism.border.medium};
            transform: translateY(-1px);
            box-shadow: ${glassMorphism.shadow.medium};
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
      default:
        return css``;
    }
  }}
  
  /* No glow effects - professional design */
  
  /* No shimmer effects - clean design */
`;

// Styled components
const StyledGlassCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant', 'glowEffect', 'shimmerEffect', 'padding'].includes(prop)
})<{
  variant: 'default' | 'elevated' | 'floating' | 'interactive';
  glowEffect: boolean;
  shimmerEffect: boolean;
  padding: 'sm' | 'md' | 'lg' | 'xl';
}>`
  ${baseGlassStyles}
  
  padding: ${props => {
    switch (props.padding) {
      case 'sm': return '1rem';
      case 'lg': return '2rem';
      case 'xl': return '3rem';
      default: return '1.5rem';
    }
  }};
`;

const StyledGlassCardHeader = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${quantumColors.glass.border};
`;

const GlassCardTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1A1A1A;  /* Dark text for readability */
  margin: 0 0 0.5rem 0;
`;

const GlassCardSubtitle = styled.p`
  font-size: 0.875rem;
  color: #666666;  /* Medium gray for subtitle */
  margin: 0;
`;

const StyledGlassCardContent = styled.div`
  color: #333333;  /* Dark gray for content */
  line-height: 1.6;
`;

const StyledGlassCardFooter = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${quantumColors.glass.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// No ripple effects - clean professional design

// Component interfaces
interface GlassCardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'floating' | 'interactive';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  glowEffect?: boolean;
  shimmerEffect?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

interface GlassCardHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

/**
 * Professional Card Component
 * 
 * Features:
 * - Clean, professional design
 * - Multiple visual variants
 * - Subtle hover effects
 * - Customizable padding
 * 
 * @param variant - Visual style variant
 * @param padding - Internal padding size
 * @param onClick - Click handler for interactive variant
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  glowEffect = false,
  shimmerEffect = false,
  onClick,
  onDoubleClick,
  className,
  'data-testid': dataTestId,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick();
    }
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onDoubleClick) {
      onDoubleClick();
    }
  };

  return (
    <StyledGlassCard
      variant={variant}
      padding={padding}
      glowEffect={false}  // Always false for professional design
      shimmerEffect={false}  // Always false for professional design
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={className}
      data-testid={dataTestId}
    >
      {children}
    </StyledGlassCard>
  );
};

/**
 * Glass Card Header Component
 * Pre-styled header section with title and optional subtitle
 */
export const GlassCardHeader: React.FC<GlassCardHeaderProps> = ({
  title,
  subtitle,
  children,
}) => (
  <StyledGlassCardHeader>
    <GlassCardTitle>{title}</GlassCardTitle>
    {subtitle && <GlassCardSubtitle>{subtitle}</GlassCardSubtitle>}
    {children}
  </StyledGlassCardHeader>
);

/**
 * Glass Card Content Component
 * Content area with proper spacing and typography
 */
export const GlassCardContent: React.FC<{ children: ReactNode }> = ({ children }) => (
  <StyledGlassCardContent>{children}</StyledGlassCardContent>
);

/**
 * Glass Card Footer Component
 * Footer section with flex layout for actions
 */
export const GlassCardFooter: React.FC<{ children: ReactNode }> = ({ children }) => (
  <StyledGlassCardFooter>{children}</StyledGlassCardFooter>
);

// Pre-configured card variants for common use cases - professional design
export const FeatureCard: React.FC<Omit<GlassCardProps, 'variant'>> = (props) => (
  <GlassCard {...props} variant="elevated" />
);

export const InteractiveCard: React.FC<Omit<GlassCardProps, 'variant'>> = (props) => (
  <GlassCard {...props} variant="interactive" />
);

export const FloatingCard: React.FC<Omit<GlassCardProps, 'variant'>> = (props) => (
  <GlassCard {...props} variant="floating" />
);

// Usage examples:
/*
// Basic glass card
<GlassCard>
  <GlassCardHeader title="Neural Network" subtitle="AI-powered insights" />
  <GlassCardContent>
    <p>Revolutionary AI technology for the future.</p>
  </GlassCardContent>
</GlassCard>

// Interactive card with effects
<InteractiveCard onClick={() => console.log('clicked')} shimmerEffect>
  <h3>Click me!</h3>
  <p>This card has ripple effects and hover animations.</p>
</InteractiveCard>

// Feature showcase card
<FeatureCard padding="lg">
  <GlassCardHeader title="Quantum Computing" />
  <GlassCardContent>
    <p>Experience the power of quantum algorithms.</p>
  </GlassCardContent>
  <GlassCardFooter>
    <button>Learn More</button>
  </GlassCardFooter>
</FeatureCard>
*/

export default GlassCard;