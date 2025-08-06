import styled, { css } from 'styled-components';
import theme from '../../styles/design-system/theme';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

const buttonVariants = {
  primary: css`
    background-color: ${props => props.theme.colors.primary.yellow};
    color: ${props => props.theme.colors.primary.black};
    border: 2px solid ${props => props.theme.colors.primary.yellow};
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.primary.black};
      color: ${props => props.theme.colors.primary.yellow};
      border-color: ${props => props.theme.colors.primary.black};
    }
  `,
  secondary: css`
    background-color: ${props => props.theme.colors.primary.black};
    color: ${props => props.theme.colors.primary.white};
    border: 2px solid ${props => props.theme.colors.primary.black};
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.secondary.darkGray};
      border-color: ${props => props.theme.colors.secondary.darkGray};
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${props => props.theme.colors.primary.black};
    border: 2px solid ${props => props.theme.colors.primary.black};
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.primary.black};
      color: ${props => props.theme.colors.primary.white};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${props => props.theme.colors.primary.black};
    border: 2px solid transparent;
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.background.secondary};
    }
  `,
};

const buttonSizes = {
  sm: css`
    height: 32px;
    padding: 0 12px;
    font-size: 0.875rem;
  `,
  md: css`
    height: 40px;
    padding: 0 16px;
    font-size: 1rem;
  `,
  lg: css`
    height: 48px;
    padding: 0 24px;
    font-size: 1.125rem;
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  ${({ variant = 'primary' }) => buttonVariants[variant]}
  ${({ size = 'md' }) => buttonSizes[size]}
  ${({ fullWidth }) => fullWidth && css`width: 100%;`}
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.5);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Ripple effect on click */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
    transform: scale(0);
    opacity: 0;
    transition: transform 0.5s, opacity 0.5s;
  }
  
  &:active:not(:disabled)::after {
    transform: scale(4);
    opacity: 1;
    transition: 0s;
  }
`;

export const IconButton = styled(Button)`
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  
  ${({ size = 'md' }) => size === 'sm' && css`
    width: 32px;
    height: 32px;
    padding: 0.375rem;
  `}
  
  ${({ size = 'md' }) => size === 'lg' && css`
    width: 48px;
    height: 48px;
    padding: 0.75rem;
  `}
`;