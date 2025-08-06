import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../../styles/design-system';
import { Card as BaseCard } from './Card';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
`;

export const EnhancedCard = styled(BaseCard)<{ 
  isNew?: boolean; 
  hasUpdate?: boolean;
  featured?: boolean;
}>`
  position: relative;
  overflow: hidden;
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
  
  ${props => props.featured && css`
    background: linear-gradient(135deg, ${props.theme.colors.background.primary} 0%, ${props.theme.colors.background.secondary} 100%);
    border: 2px solid ${props.theme.colors.primary.yellow};
    
    &::before {
      content: 'Featured';
      position: absolute;
      top: -5px;
      right: 20px;
      background: ${props.theme.colors.primary.yellow};
      color: ${props.theme.colors.primary.black};
      padding: ${props.theme.spacing[1]} ${props.theme.spacing[3]};
      font-size: ${props.theme.typography.fontSize.xs};
      font-weight: ${props.theme.typography.fontWeight.bold};
      text-transform: uppercase;
      border-radius: 0 0 ${props.theme.borderRadius.md} ${props.theme.borderRadius.md};
      box-shadow: ${props.theme.shadows.md};
    }
  `}
  
  ${props => props.isNew && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, 
        transparent, 
        ${props.theme.colors.primary.yellow}, 
        transparent
      );
      background-size: 200% 100%;
      animation: ${shimmer} 2s linear infinite;
    }
  `}
  
  ${props => props.hasUpdate && css`
    animation: ${pulse} 2s infinite;
  `}

  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: ${props => props.theme.shadows.xl};
    border-color: ${props => props.theme.colors.primary.yellow};
    
    .card-icon {
      transform: rotate(360deg);
    }
    
    .action-buttons {
      opacity: 1;
      transform: translateY(0);
    }
    
    .hover-overlay {
      opacity: 1;
    }
  }
`;

export const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.yellow}20, ${props => props.theme.colors.accent.blue}20);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing[3]};
  transition: transform ${props => props.theme.animations.duration.slow} ${props => props.theme.animations.easing.easeOut};
  
  svg {
    color: ${props => props.theme.colors.primary.yellow};
  }
`;

export const CardBadgeContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spacing[3]};
`;

export const CardBadge = styled.span<{ 
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' 
}>`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  transition: all ${props => props.theme.animations.duration.fast} ${props => props.theme.animations.easing.easeOut};
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props => props.theme.colors.primary.yellow}20;
          color: ${props => props.theme.colors.primary.yellow};
          border: 1px solid ${props => props.theme.colors.primary.yellow}40;
        `;
      case 'secondary':
        return `
          background: ${props => props.theme.colors.accent.blue}20;
          color: ${props => props.theme.colors.accent.blue};
          border: 1px solid ${props => props.theme.colors.accent.blue}40;
        `;
      case 'success':
        return `
          background: ${props => props.theme.colors.semantic.success}20;
          color: ${props => props.theme.colors.semantic.success};
          border: 1px solid ${props => props.theme.colors.semantic.success}40;
        `;
      case 'warning':
        return `
          background: ${props => props.theme.colors.semantic.warning}20;
          color: ${props => props.theme.colors.semantic.warning};
          border: 1px solid ${props => props.theme.colors.semantic.warning}40;
        `;
      case 'info':
        return `
          background: ${props => props.theme.colors.semantic.info}20;
          color: ${props => props.theme.colors.semantic.info};
          border: 1px solid ${props => props.theme.colors.semantic.info}40;
        `;
      default:
        return `
          background: ${props => props.theme.colors.background.secondary};
          color: ${props => props.theme.colors.text.secondary};
          border: 1px solid ${props => props.theme.colors.border.light};
        `;
    }
  }}
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

export const CardMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[3]} 0;
  border-top: 1px solid ${props => props.theme.colors.border.light};
  margin-top: ${props => props.theme.spacing[3]};
`;

export const MetricItem = styled.div`
  text-align: center;
`;

export const MetricValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[1]};
`;

export const MetricLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    ${props => props.theme.colors.background.overlay} 100%
  );
  opacity: 0;
  transition: opacity ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
  pointer-events: none;
`;

export const ActionButtonContainer = styled.div`
  position: absolute;
  bottom: ${props => props.theme.spacing[4]};
  left: ${props => props.theme.spacing[4]};
  right: ${props => props.theme.spacing[4]};
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  opacity: 0;
  transform: translateY(10px);
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
`;

export const CategoryTag = styled.div<{ category: string }>`
  position: absolute;
  top: ${props => props.theme.spacing[3]};
  left: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background: ${props => {
    const categories: Record<string, string> = {
      'AI/ML': theme.colors.semantic.info,
      'API': theme.colors.primary.yellow,
      'Frontend': theme.colors.accent.blue,
      'Backend': theme.colors.semantic.success,
      'Database': theme.colors.semantic.warning,
      'DevOps': theme.colors.secondary.darkGray,
    };
    return categories[props.category] || theme.colors.text.secondary;
  }}20;
  color: ${props => {
    const categories: Record<string, string> = {
      'AI/ML': theme.colors.semantic.info,
      'API': theme.colors.primary.yellow,
      'Frontend': theme.colors.accent.blue,
      'Backend': theme.colors.semantic.success,
      'Database': theme.colors.semantic.warning,
      'DevOps': theme.colors.secondary.darkGray,
    };
    return categories[props.category] || theme.colors.text.secondary;
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ProgressBar = styled.div<{ progress: number; color?: string }>`
  width: 100%;
  height: 4px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${props => props.theme.spacing[2]};
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: ${props => props.color || theme.colors.primary.yellow};
    border-radius: ${props => props.theme.borderRadius.full};
    transition: width ${props => props.theme.animations.duration.slow} ${props => props.theme.animations.easing.easeOut};
  }
`;

export const LiveIndicator = styled.div<{ isLive?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.isLive ? theme.colors.semantic.success : theme.colors.text.secondary};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: ${props => props.theme.borderRadius.full};
    background: ${props => props.isLive ? theme.colors.semantic.success : theme.colors.text.secondary};
    animation: ${props => props.isLive ? pulse : 'none'} 2s infinite;
  }
`;