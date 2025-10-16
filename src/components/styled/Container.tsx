import styled, { css } from 'styled-components';
import theme from '../../styles/design-system/theme';

export interface ContainerProps {
  maxWidth?: keyof typeof theme.containers;
  fluid?: boolean;
  centered?: boolean;
  padding?: keyof typeof theme.layout.containerPadding;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !['maxWidth', 'fluid', 'centered', 'padding'].includes(prop),
})<ContainerProps>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  
  ${({ maxWidth = 'xl' }) => css`
    max-width: ${props => props.theme.containers[maxWidth]};
  `}
  
  ${({ fluid }) => fluid && css`
    max-width: 100%;
  `}
  
  ${({ centered = true }) => centered && css`
    margin-left: auto;
    margin-right: auto;
  `}
  
  ${({ padding = 'desktop' }) => css`
    padding-left: ${props => props.theme.layout.containerPadding[padding]};
    padding-right: ${props => props.theme.layout.containerPadding[padding]};
    
    ${props => props.theme.breakpoints.down.md} {
      padding-left: ${props => props.theme.layout.containerPadding.mobile};
      padding-right: ${props => props.theme.layout.containerPadding.mobile};
    }
    
    @media (min-width: 768px) and (max-width: 1023px) {
      padding-left: ${props => props.theme.layout.containerPadding.tablet};
      padding-right: ${props => props.theme.layout.containerPadding.tablet};
    }
  `}
`;

export const Section = styled.section.withConfig({
  shouldForwardProp: (prop) => prop !== 'spacing',
})<{ spacing?: keyof typeof theme.layout.sectionSpacing }>`
  padding-top: ${({ spacing = 'medium' }) => theme.layout.sectionSpacing[spacing]};
  padding-bottom: ${({ spacing = 'medium' }) => theme.layout.sectionSpacing[spacing]};
  
  ${props => props.theme.breakpoints.down.md} {
    padding-top: ${({ spacing = 'medium' }) => 
      spacing === 'large' ? theme.layout.sectionSpacing.medium : 
      spacing === 'medium' ? theme.layout.sectionSpacing.small : 
      theme.layout.sectionSpacing.small
    };
    padding-bottom: ${({ spacing = 'medium' }) => 
      spacing === 'large' ? theme.layout.sectionSpacing.medium : 
      spacing === 'medium' ? theme.layout.sectionSpacing.small : 
      theme.layout.sectionSpacing.small
    };
  }
`;

export const Grid = styled.div<{ columns?: number; gap?: keyof typeof theme.layout.gridGap }>`
  display: grid;
  gap: ${({ gap = 'medium' }) => theme.layout.gridGap[gap]};
  
  ${({ columns = 12 }) => css`
    grid-template-columns: repeat(${columns}, 1fr);
    
    ${props => props.theme.breakpoints.down.lg} {
      grid-template-columns: repeat(${Math.min(columns, 8)}, 1fr);
    }
    
    ${props => props.theme.breakpoints.down.md} {
      grid-template-columns: repeat(${Math.min(columns, 4)}, 1fr);
    }
    
    ${props => props.theme.breakpoints.down.sm} {
      grid-template-columns: 1fr;
    }
  `}
`;

export const Flex = styled.div.withConfig({
  shouldForwardProp: (prop) => !['direction', 'align', 'justify', 'wrap', 'gap'].includes(prop),
})<{
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: keyof typeof theme.spacing;
}>`
  display: flex;
  
  ${({ direction = 'row' }) => css`
    flex-direction: ${direction};
  `}
  
  ${({ align = 'stretch' }) => css`
    align-items: ${align === 'start' ? 'flex-start' : 
                   align === 'end' ? 'flex-end' : 
                   align};
  `}
  
  ${({ justify = 'start' }) => css`
    justify-content: ${justify === 'start' ? 'flex-start' : 
                       justify === 'end' ? 'flex-end' : 
                       justify === 'between' ? 'space-between' :
                       justify === 'around' ? 'space-around' :
                       justify === 'evenly' ? 'space-evenly' :
                       justify};
  `}
  
  ${({ wrap }) => wrap && css`
    flex-wrap: wrap;
  `}
  
  ${({ gap }) => gap && css`
    gap: ${props => props.theme.spacing[gap]};
  `}
`;