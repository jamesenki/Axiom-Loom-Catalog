import styled from 'styled-components';
import { theme } from '../../styles/design-system';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${theme.spacing[1]} ${theme.spacing[2]}`;
      case 'lg': return `${theme.spacing[2]} ${theme.spacing[4]}`;
      default: return `${theme.spacing[1]} ${theme.spacing[3]}`;
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return theme.typography.fontSize.xs;
      case 'lg': return theme.typography.fontSize.base;
      default: return theme.typography.fontSize.sm;
    }
  }};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  background-color: ${props => {
    switch (props.variant) {
      case 'primary':
        return theme.colors.primary.yellow;
      case 'secondary':
        return theme.colors.secondary.darkGray;
      case 'success':
        return theme.colors.semantic.success;
      case 'warning':
        return theme.colors.semantic.warning;
      case 'danger':
        return theme.colors.semantic.error;
      case 'info':
        return theme.colors.semantic.info;
      default:
        return theme.colors.background.tertiary;
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'primary':
        return theme.colors.primary.black;
      case 'secondary':
      case 'success':
      case 'warning':
      case 'danger':
      case 'info':
        return theme.colors.primary.white;
      default:
        return theme.colors.text.primary;
    }
  }};
`;