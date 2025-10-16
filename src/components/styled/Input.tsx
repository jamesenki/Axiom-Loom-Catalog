import styled from 'styled-components';
import { theme } from '../../styles/design-system';

interface InputProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  error?: boolean;
}

export const Input = styled.input<InputProps>`
  width: 100%;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${props.theme.spacing[2]} ${props.theme.spacing[3]}`;
      case 'lg': return `${props.theme.spacing[4]} ${props.theme.spacing[5]}`;
      default: return `${props.theme.spacing[3]} ${props.theme.spacing[4]}`;
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return props.theme.typography.fontSize.sm;
      case 'lg': return props.theme.typography.fontSize.lg;
      default: return props.theme.typography.fontSize.base;
    }
  }};
  line-height: ${props => props.theme.typography.lineHeight.normal};
  color: ${props => props.theme.colors.text.primary};
  background-color: ${props => {
    switch (props.variant) {
      case 'filled':
        return theme.colors.background.secondary;
      default:
        return theme.colors.primary.white;
    }
  }};
  border: 2px solid ${props => {
    if (props.error) return theme.colors.semantic.error;
    switch (props.variant) {
      case 'outlined':
        return theme.colors.border.medium;
      default:
        return 'transparent';
    }
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  outline: none;
  transition: all 0.2s ease-in-out;
  
  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
  
  &:hover {
    border-color: ${props => {
      if (props.error) return theme.colors.semantic.error;
      return theme.colors.border.dark;
    }};
  }
  
  &:focus {
    border-color: ${props => {
      if (props.error) return theme.colors.semantic.error;
      return theme.colors.primary.yellow;
    }};
    box-shadow: 0 0 0 3px ${props => {
      if (props.error) return 'rgba(196, 35, 43, 0.12)';
      return 'rgba(255, 230, 0, 0.12)';
    }};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.background.secondary};
    color: ${props => props.theme.colors.text.tertiary};
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea<InputProps>`
  width: 100%;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${props.theme.spacing[2]} ${props.theme.spacing[3]}`;
      case 'lg': return `${props.theme.spacing[4]} ${props.theme.spacing[5]}`;
      default: return `${props.theme.spacing[3]} ${props.theme.spacing[4]}`;
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return props.theme.typography.fontSize.sm;
      case 'lg': return props.theme.typography.fontSize.lg;
      default: return props.theme.typography.fontSize.base;
    }
  }};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  color: ${props => props.theme.colors.text.primary};
  background-color: ${props => {
    switch (props.variant) {
      case 'filled':
        return theme.colors.background.secondary;
      default:
        return theme.colors.primary.white;
    }
  }};
  border: 2px solid ${props => {
    if (props.error) return theme.colors.semantic.error;
    switch (props.variant) {
      case 'outlined':
        return theme.colors.border.medium;
      default:
        return 'transparent';
    }
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease-in-out;
  
  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
  
  &:hover {
    border-color: ${props => {
      if (props.error) return theme.colors.semantic.error;
      return theme.colors.border.dark;
    }};
  }
  
  &:focus {
    border-color: ${props => {
      if (props.error) return theme.colors.semantic.error;
      return theme.colors.primary.yellow;
    }};
    box-shadow: 0 0 0 3px ${props => {
      if (props.error) return 'rgba(196, 35, 43, 0.12)';
      return 'rgba(255, 230, 0, 0.12)';
    }};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.background.secondary};
    color: ${props => props.theme.colors.text.tertiary};
    cursor: not-allowed;
  }
`;