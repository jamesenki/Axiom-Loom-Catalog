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
    background-color: #FFFFFF !important;  /* FORCE WHITE background */
    border: 1px solid #E2E8F0 !important;  /* LIGHT GRAY border */
  `,
  outlined: css`
    background-color: #FFFFFF !important;  /* WHITE background */
    border: 2px solid #E2E8F0 !important;  /* LIGHT GRAY border */
  `,
  filled: css`
    background-color: #FFFFFF !important;  /* WHITE background */
    border: 1px solid #E2E8F0 !important;  /* LIGHT GRAY border */
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
  color: #000000 !important;  /* BLACK text for maximum contrast */
  opacity: 1 !important;
  filter: none !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: #333333 !important;  /* DARK GRAY for descriptions */
  opacity: 1 !important;
  filter: none !important;
  margin-bottom: ${props => props.theme.spacing[4]};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`;

export const CardContent = styled.div`
  color: #000000 !important;  /* BLACK text */
  opacity: 1 !important;
  filter: none !important;
  background: transparent !important;
  
  * {
    color: #000000 !important;  /* BLACK text for all children */
    opacity: 1 !important;
    filter: none !important;
    background: transparent !important;
  }
  
  h3 {
    color: #000000 !important;  /* BLACK headings */
    opacity: 1 !important;
    font-weight: 600;
  }
  
  p {
    color: #333333 !important;  /* DARK GRAY for paragraphs */
    opacity: 1 !important;
  }
  
  /* Small text and version numbers */
  small,
  [size="small"] {
    color: #666666 !important;  /* MEDIUM GRAY for small text */
  }
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