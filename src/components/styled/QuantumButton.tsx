/**
 * Professional Button Component
 * Clean, accessible buttons for enterprise applications
 */

import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { quantumColors, quantumAnimations } from '../../styles/axiom-theme';

// Simple animations only
const loadingSpinner = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Professional button variant styles
const getVariantStyles = (variant: ButtonVariant) => {
  const variants = {
    primary: css`
      background: #0066CC;  /* Professional blue */
      color: #FFFFFF;
      border: 1px solid #0066CC;
      
      &:hover:not(:disabled) {
        background: #0052A3;  /* Darker blue on hover */
        border-color: #0052A3;
      }
    `,
    
    secondary: css`
      background: #FFFFFF;
      color: #333333;
      border: 1px solid #E2E8F0;
      
      &:hover:not(:disabled) {
        background: #F5F5F5;
        border-color: #CBD5E1;
      }
    `,
    
    accent: css`
      background: #00A86B;  /* Success green */
      color: #FFFFFF;
      border: 1px solid #00A86B;
      
      &:hover:not(:disabled) {
        background: #008A56;
        border-color: #008A56;
      }
    `,
    
    ghost: css`
      background: transparent;
      color: #0066CC;
      border: 1px solid #0066CC;
      
      &:hover:not(:disabled) {
        background: rgba(0, 102, 204, 0.1);
        color: #0052A3;
        border-color: #0052A3;
      }
    `,
    
    glass: css`
      background: #F5F5F5;
      color: #333333;
      border: 1px solid #E2E8F0;
      
      &:hover:not(:disabled) {
        background: #E2E8F0;
        border-color: #CBD5E1;
      }
    `,
  };
  
  return variants[variant] || variants.primary;
};

// Size styles
const getSizeStyles = (size: ButtonSize) => {
  const sizes = {
    xs: css`
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
      min-height: 28px;
    `,
    sm: css`
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      min-height: 36px;
    `,
    md: css`
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      min-height: 44px;
    `,
    lg: css`
      padding: 1rem 2rem;
      font-size: 1.125rem;
      min-height: 52px;
    `,
    xl: css`
      padding: 1.25rem 2.5rem;
      font-size: 1.25rem;
      min-height: 60px;
    `,
  };
  
  return sizes[size] || sizes.md;
};

// Professional styled button
const StyledQuantumButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  isLoading: boolean;
  glowEffect: boolean;
  pulseEffect: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  
  border-radius: 6px;
  cursor: pointer;
  
  transition: all ${quantumAnimations.duration.fast} ${quantumAnimations.easing.quantum};
  
  /* Apply variant styles */
  ${props => getVariantStyles(props.variant)}
  
  /* Apply size styles */
  ${props => getSizeStyles(props.size)}
  
  /* No glow or pulse effects - professional design */
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Loading state */
  ${props => props.isLoading && css`
    cursor: wait;
  `}
  
  /* Focus styles */
  &:focus-visible {
    outline: 2px solid #0066CC;
    outline-offset: 2px;
  }
  
  /* Active state */
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

// Simple loading spinner - no other effects
const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: ${loadingSpinner} 1s linear infinite;
`;

// TypeScript interfaces
type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'glass';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface QuantumButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  glowEffect?: boolean;
  pulseEffect?: boolean;
  holographicEffect?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

/**
 * Professional Button Component
 * 
 * Features:
 * - Clean, professional design
 * - Multiple visual variants
 * - Loading state with spinner
 * - Full accessibility support
 * 
 * @param variant - Visual style variant
 * @param size - Button size
 * @param loading - Show loading state
 * @param leftIcon - Icon to show on the left
 * @param rightIcon - Icon to show on the right
 */
export const QuantumButton: React.FC<QuantumButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  glowEffect = false,
  pulseEffect = false,
  holographicEffect = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Call original onClick
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <StyledQuantumButton
      variant={variant}
      size={size}
      isLoading={loading}
      glowEffect={false}  // Always false for professional design
      pulseEffect={false}  // Always false for professional design
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Left icon or loading spinner */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        leftIcon && <span>{leftIcon}</span>
      )}
      
      {/* Button content */}
      <span>{children}</span>
      
      {/* Right icon */}
      {!loading && rightIcon && <span>{rightIcon}</span>}
    </StyledQuantumButton>
  );
};

// Pre-configured button variants for common use cases - professional design
export const PrimaryButton: React.FC<Omit<QuantumButtonProps, 'variant'>> = (props) => (
  <QuantumButton {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<QuantumButtonProps, 'variant'>> = (props) => (
  <QuantumButton {...props} variant="secondary" />
);

export const AccentButton: React.FC<Omit<QuantumButtonProps, 'variant'>> = (props) => (
  <QuantumButton {...props} variant="accent" />
);

export const GhostButton: React.FC<Omit<QuantumButtonProps, 'variant'>> = (props) => (
  <QuantumButton {...props} variant="ghost" />
);

export const GlassButton: React.FC<Omit<QuantumButtonProps, 'variant'>> = (props) => (
  <QuantumButton {...props} variant="glass" />
);

// Usage examples:
/*
// Basic quantum button
<QuantumButton>Launch Neural Network</QuantumButton>

// Primary button with glow effect
<PrimaryButton glowEffect>
  Deploy AI Model
</PrimaryButton>

// Loading button
<QuantumButton loading variant="secondary">
  Processing...
</QuantumButton>

// Button with icons
<AccentButton 
  leftIcon={<RocketIcon />} 
  rightIcon={<ArrowIcon />}
  size="lg"
>
  Launch Mission
</AccentButton>

// Glass morphism button with holographic effect
<GlassButton holographicEffect pulseEffect>
  Experience the Future
</GlassButton>
*/

export default QuantumButton;