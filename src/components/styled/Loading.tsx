import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../../styles/design-system';

// Loading spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const wave = keyframes`
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
`;

// Spinner Loading Component
export const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg'; color?: string }>`
  display: inline-block;
  border-radius: 50%;
  animation: ${css`${spin}`} 0.8s linear infinite;
  
  ${props => ({ size = 'md', color = props.theme.colors.primary.yellow }) => {
    const sizes = {
      sm: { width: '16px', height: '16px', border: '2px' },
      md: { width: '24px', height: '24px', border: '3px' },
      lg: { width: '32px', height: '32px', border: '4px' },
    };
    
    return css`
      width: ${sizes[size].width};
      height: ${sizes[size].height};
      border: ${sizes[size].border} solid ${props => props.theme.colors.border.light};
      border-top-color: ${color};
    `;
  }}
`;

// Dots Loading Component
const DotsContainer = styled.div`
  display: inline-flex;
  gap: ${props => props.theme.spacing[1]};
`;

const Dot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  background-color: ${props => props.theme.colors.primary.yellow};
  border-radius: 50%;
  animation: ${css`${pulse}`} 1.4s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

export const Dots: React.FC = () => (
  <DotsContainer>
    <Dot delay={0} />
    <Dot delay={0.2} />
    <Dot delay={0.4} />
  </DotsContainer>
);

// Bar Loading Component
const BarsContainer = styled.div`
  display: inline-flex;
  gap: ${props => props.theme.spacing[0.5]};
  align-items: flex-end;
  height: 24px;
`;

const Bar = styled.div<{ delay: number }>`
  width: 4px;
  height: 100%;
  background-color: ${props => props.theme.colors.primary.yellow};
  animation: ${css`${wave}`} 1.2s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

export const Bars: React.FC = () => (
  <BarsContainer>
    <Bar delay={0} />
    <Bar delay={0.1} />
    <Bar delay={0.2} />
    <Bar delay={0.3} />
    <Bar delay={0.4} />
  </BarsContainer>
);

// Full Page Loading Component
const LoadingOverlay = styled.div<{ $blur?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ $blur }) => $blur ? theme.colors.background.overlay : theme.colors.background.primary};
  z-index: ${props => props.theme.zIndex.modal};
  
  ${({ $blur }) => $blur && css`
  `}
`;

const LoadingText = styled.p`
  margin-top: ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

interface FullPageLoadingProps {
  text?: string;
  blur?: boolean;
  variant?: 'spinner' | 'dots' | 'bars';
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({ 
  text = 'Loading...', 
  blur = false,
  variant = 'spinner' 
}) => (
  <LoadingOverlay $blur={blur}>
    {variant === 'spinner' && <Spinner size="lg" />}
    {variant === 'dots' && <Dots />}
    {variant === 'bars' && <Bars />}
    {text && <LoadingText>{text}</LoadingText>}
  </LoadingOverlay>
);

// Skeleton Loading Component
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const Skeleton = styled.div<{ 
  width?: string; 
  height?: string; 
  radius?: keyof typeof theme.borderRadius;
}>`
  width: ${({ width = '100%' }) => width};
  height: ${({ height = '20px' }) => height};
  border-radius: ${({ radius = 'md' }) => theme.borderRadius[radius]};
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.background.secondary} 25%,
    ${props => props.theme.colors.border.light} 50%,
    ${props => props.theme.colors.background.secondary} 75%
  );
  background-size: 200% 100%;
  animation: ${css`${shimmer}`} 1.5s ease-in-out infinite;
`;

// Loading Button State
export const ButtonLoading = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

// Progress Bar Component
export const ProgressBar = styled.div<{ progress: number; height?: string }>`
  width: 100%;
  height: ${({ height = '8px' }) => height};
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ progress }) => `${progress}%`};
    background-color: ${props => props.theme.colors.primary.yellow};
    transition: width 0.3s ease;
    border-radius: ${props => props.theme.borderRadius.full};
  }
`;