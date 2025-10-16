/**
 * Axiom Loom Logo Component
 * Revolutionary AI-generated logo with neural network animations
 */

import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { quantumColors, createGradient } from '../styles/axiom-theme';

// Animation keyframes
const neuralPulse = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const nodeGlow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 4px ${quantumColors.plasma.violet});
  }
  33% {
    filter: drop-shadow(0 0 8px ${quantumColors.plasma.cyan});
  }
  66% {
    filter: drop-shadow(0 0 6px ${quantumColors.plasma.emerald});
  }
`;

const connectionFlow = keyframes`
  0% {
    stroke-dashoffset: 100;
    opacity: 0.2;
  }
  50% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: -100;
    opacity: 0.2;
  }
`;

// Styled components
const LogoContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['size', 'animated'].includes(prop)
})<{ size: 'small' | 'medium' | 'large'; animated: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => {
    switch (props.size) {
      case 'small': return '0.5rem';
      case 'large': return '1.5rem';
      default: return '1rem';
    }
  }};
  
  svg {
    width: ${props => {
      switch (props.size) {
        case 'small': return '32px';
        case 'large': return '64px';
        default: return '48px';
      }
    }};
    height: ${props => {
      switch (props.size) {
        case 'small': return '32px';
        case 'large': return '64px';
        default: return '48px';
      }
    }};
    
    ${props => props.animated && css`
      animation: ${neuralPulse} 3s ease-in-out infinite;
    `}
  }
`;

const LogoText = styled.span.withConfig({
  shouldForwardProp: (prop) => !['size', 'gradient'].includes(prop)
})<{ size: 'small' | 'medium' | 'large'; gradient: boolean }>`
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 700;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '1.25rem';
      case 'large': return '2rem';
      default: return '1.5rem';
    }
  }};
  
  ${props => props.gradient ? css`
    background: ${createGradient(
      '45deg',
      quantumColors.gradients.aurora.start,
      quantumColors.gradients.aurora.middle,
      quantumColors.gradients.aurora.end
    )};
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${gradientShift} 4s ease-in-out infinite;
  ` : css`
    color: ${quantumColors.neural.electric};
  `}
`;

const NeuralNode = styled.circle<{ delay: number }>`
  animation: ${css`${nodeGlow}`} 2s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  transition: all 0.3s ease;
`;

const NeuralConnection = styled.path<{ delay: number }>`
  stroke: ${quantumColors.plasma.cyan};
  stroke-width: 2;
  stroke-dasharray: 20, 10;
  stroke-dashoffset: 0;
  fill: none;
  opacity: 0.6;
  
  animation: ${css`${connectionFlow}`} 3s linear infinite;
  animation-delay: ${props => props.delay}s;
`;

// Component interface
interface AxiomLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  animated?: boolean;
  gradient?: boolean;
  className?: string;
}

/**
 * Axiom Loom Logo Component
 * 
 * Features:
 * - Animated neural network pattern
 * - Gradient text effects
 * - Multiple sizes
 * - Performance optimized animations
 * 
 * @param size - Logo size variant
 * @param showText - Whether to show "Axiom Loom" text
 * @param animated - Enable/disable animations
 * @param gradient - Use gradient text effect
 * @param className - Additional CSS classes
 */
export const AxiomLogo: React.FC<AxiomLogoProps> = ({
  size = 'medium',
  showText = true,
  animated = true,
  gradient = true,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay for entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const logoSvg = (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease' }}
    >
      {/* Neural Network Background */}
      <defs>
        <radialGradient id="neuralGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={quantumColors.plasma.violet} stopOpacity="0.8" />
          <stop offset="50%" stopColor={quantumColors.plasma.cyan} stopOpacity="0.4" />
          <stop offset="100%" stopColor={quantumColors.neural.electric} stopOpacity="0.1" />
        </radialGradient>
        
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={quantumColors.plasma.violet} />
          <stop offset="50%" stopColor={quantumColors.plasma.cyan} />
          <stop offset="100%" stopColor={quantumColors.plasma.emerald} />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="url(#neuralGradient)"
        stroke={quantumColors.glass.border.replace('rgba(255, 255, 255, 0.1)', quantumColors.plasma.cyan)}
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Neural Connections */}
      {animated && (
        <>
          <NeuralConnection
            d="M8 16 L24 24 L40 16"
            delay={0}
          />
          <NeuralConnection
            d="M8 32 L24 24 L40 32"
            delay={0.5}
          />
          <NeuralConnection
            d="M16 8 L24 24 L32 8"
            delay={1}
          />
          <NeuralConnection
            d="M16 40 L24 24 L32 40"
            delay={1.5}
          />
        </>
      )}

      {/* Neural Nodes */}
      <NeuralNode cx="24" cy="24" r="4" fill="url(#nodeGradient)" delay={0} />
      <NeuralNode cx="8" cy="16" r="2" fill={quantumColors.plasma.violet} delay={0.2} />
      <NeuralNode cx="40" cy="16" r="2" fill={quantumColors.plasma.cyan} delay={0.4} />
      <NeuralNode cx="8" cy="32" r="2" fill={quantumColors.plasma.emerald} delay={0.6} />
      <NeuralNode cx="40" cy="32" r="2" fill={quantumColors.plasma.gold} delay={0.8} />
      <NeuralNode cx="16" cy="8" r="1.5" fill={quantumColors.plasma.magenta} delay={1} />
      <NeuralNode cx="32" cy="8" r="1.5" fill={quantumColors.plasma.crimson} delay={1.2} />
      <NeuralNode cx="16" cy="40" r="1.5" fill={quantumColors.plasma.violet} delay={1.4} />
      <NeuralNode cx="32" cy="40" r="1.5" fill={quantumColors.plasma.cyan} delay={1.6} />

      {/* Central "A" for Axiom */}
      <path
        d="M20 32 L24 20 L28 32 M21.5 28 L26.5 28"
        stroke={quantumColors.quantum.deep}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  return (
    <LogoContainer size={size} animated={animated} className={className}>
      {logoSvg}
      {showText && (
        <LogoText size={size} gradient={gradient}>
          Axiom Loom
        </LogoText>
      )}
    </LogoContainer>
  );
};

// Icon-only variant
export const AxiomIcon: React.FC<Omit<AxiomLogoProps, 'showText'>> = (props) => (
  <AxiomLogo {...props} showText={false} />
);

// Usage examples:
/*
// Basic usage
<AxiomLogo />

// Large logo with gradient text
<AxiomLogo size="large" gradient={true} />

// Small icon only, no animation
<AxiomIcon size="small" animated={false} />

// Custom styling
<AxiomLogo className="my-custom-class" />
*/

export default AxiomLogo;