import styled, { css } from 'styled-components';
import theme from '../../styles/design-system/theme';

export interface CardProps {
  elevated?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  variant?: 'default' | 'outlined' | 'filled';
}

const cardVariants = {
  default: css`
    background-color: ${props => props.theme.colors.background.primary};
    border: 1px solid ${props => props.theme.colors.border.light};
  `,
  outlined: css`
    background-color: transparent;
    border: 2px solid ${props => props.theme.colors.border.medium};
  `,
  filled: css`
    background-color: ${props => props.theme.colors.background.secondary};
    border: 1px solid transparent;
  `,
};

export const Card = styled.div.withConfig({
  shouldForwardProp: (prop) => !['elevated', 'hoverable', 'clickable', 'variant'].includes(prop),
})<CardProps>`
  padding: ${props => props.theme.spacing[6]};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: ${props => props.theme.animations.transition.all};
  position: relative;
  
  ${({ variant = 'default' }) => cardVariants[variant]}
  
  ${({ elevated }) => elevated && css`
    box-shadow: ${props => props.theme.shadows.card};
  `}
  
  ${({ hoverable }) => hoverable && css`
    &:hover {
      box-shadow: ${props => props.theme.shadows.cardHover};
      transform: translateY(-2px);
    }
  `}
  
  ${({ clickable }) => clickable && css`
    cursor: pointer;
    user-select: none;
    
    &:active {
      transform: scale(0.99);
    }
  `}
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing[4]};
  padding-bottom: ${props => props.theme.spacing[4]};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

export const CardTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing[4]};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`;

export const CardContent = styled.div`
  color: ${props => props.theme.colors.text.primary};
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing[4]};
  padding-top: ${props => props.theme.spacing[4]};
  border-top: 1px solid ${props => props.theme.colors.border.light};
  gap: ${props => props.theme.spacing[3]};
`;

export const CardGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${props => props.theme.layout.gridGap.medium};
  
  ${({ columns }) => columns && css`
    grid-template-columns: repeat(${columns}, 1fr);
    
    ${props => props.theme.breakpoints.down.lg} {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  `}
`;