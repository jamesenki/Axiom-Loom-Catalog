import styled, { css } from 'styled-components';
import { theme } from '../../styles/design-system';

// Base text component with common properties
const BaseText = css<{ color?: keyof typeof theme.colors.text; align?: 'left' | 'center' | 'right' | 'justify' }>`
  color: ${({ color = 'primary' }) => theme.colors.text[color]};
  text-align: ${({ align = 'left' }) => align};
  margin: 0;
`;

// Heading components
export const H1 = styled.h1<{ color?: keyof typeof theme.colors.text; align?: 'left' | 'center' | 'right' }>`
  ${BaseText}
  font-size: ${props => props.theme.typography.textStyles.h1.fontSize};
  font-weight: ${props => props.theme.typography.textStyles.h1.fontWeight};
  line-height: ${props => props.theme.typography.textStyles.h1.lineHeight};
  letter-spacing: ${props => props.theme.typography.textStyles.h1.letterSpacing};
  margin-bottom: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.breakpoints.down.md} {
    font-size: ${props => props.theme.typography.fontSize['4xl']};
  }
`;

export const H2 = styled.h2<{ color?: keyof typeof theme.colors.text; align?: 'left' | 'center' | 'right' }>`
  ${BaseText}
  font-size: ${props => props.theme.typography.textStyles.h2.fontSize};
  font-weight: ${props => props.theme.typography.textStyles.h2.fontWeight};
  line-height: ${props => props.theme.typography.textStyles.h2.lineHeight};
  letter-spacing: ${props => props.theme.typography.textStyles.h2.letterSpacing};
  margin-bottom: ${props => props.theme.spacing[5]};
  
  ${props => props.theme.breakpoints.down.md} {
    font-size: ${props => props.theme.typography.fontSize['3xl']};
  }
`;

export const H3 = styled.h3<{ color?: keyof typeof theme.colors.text; align?: 'left' | 'center' | 'right' }>`
  ${BaseText}
  font-size: ${props => props.theme.typography.textStyles.h3.fontSize};
  font-weight: ${props => props.theme.typography.textStyles.h3.fontWeight};
  line-height: ${props => props.theme.typography.textStyles.h3.lineHeight};
  letter-spacing: ${props => props.theme.typography.textStyles.h3.letterSpacing};
  margin-bottom: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.breakpoints.down.md} {
    font-size: ${props => props.theme.typography.fontSize['2xl']};
  }
`;

export const H4 = styled.h4<{ color?: keyof typeof theme.colors.text; align?: 'left' | 'center' | 'right' }>`
  ${BaseText}
  font-size: ${props => props.theme.typography.textStyles.h4.fontSize};
  font-weight: ${props => props.theme.typography.textStyles.h4.fontWeight};
  line-height: ${props => props.theme.typography.textStyles.h4.lineHeight};
  margin-bottom: ${props => props.theme.spacing[3]};
`;

export const H5 = styled.h5<{ color?: keyof typeof theme.colors.text; align?: 'left' | 'center' | 'right' }>`
  ${BaseText}
  font-size: ${props => props.theme.typography.textStyles.h5.fontSize};
  font-weight: ${props => props.theme.typography.textStyles.h5.fontWeight};
  line-height: ${props => props.theme.typography.textStyles.h5.lineHeight};
  margin-bottom: ${props => props.theme.spacing[3]};
`;

export const H6 = styled.h6<{ color?: keyof typeof theme.colors.text; align?: 'left' | 'center' | 'right' }>`
  ${BaseText}
  font-size: ${props => props.theme.typography.textStyles.h6.fontSize};
  font-weight: ${props => props.theme.typography.textStyles.h6.fontWeight};
  line-height: ${props => props.theme.typography.textStyles.h6.lineHeight};
  margin-bottom: ${props => props.theme.spacing[3]};
`;

// Body text components
export const Text = styled.p<{ 
  size?: 'small' | 'base' | 'large';
  color?: keyof typeof theme.colors.text;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: keyof typeof theme.typography.fontWeight;
}>`
  ${BaseText}
  font-size: ${({ size = 'base' }) => 
    size === 'small' ? theme.typography.textStyles.bodySmall.fontSize :
    size === 'large' ? theme.typography.textStyles.bodyLarge.fontSize :
    theme.typography.textStyles.body.fontSize
  };
  font-weight: ${({ weight = 'normal' }) => theme.typography.fontWeight[weight]};
  line-height: ${({ size = 'base' }) => 
    size === 'small' ? theme.typography.textStyles.bodySmall.lineHeight :
    size === 'large' ? theme.typography.textStyles.bodyLarge.lineHeight :
    theme.typography.textStyles.body.lineHeight
  };
  margin-bottom: ${props => props.theme.spacing[4]};
`;

export const Caption = styled.span<{ color?: keyof typeof theme.colors.text }>`
  ${BaseText}
  font-size: ${props => props.theme.typography.textStyles.caption.fontSize};
  font-weight: ${props => props.theme.typography.textStyles.caption.fontWeight};
  line-height: ${props => props.theme.typography.textStyles.caption.lineHeight};
`;

export const Overline = styled.span<{ color?: keyof typeof theme.colors.text }>`
  ${BaseText}
  font-size: ${props => props.theme.typography.textStyles.overline.fontSize};
  font-weight: ${props => props.theme.typography.textStyles.overline.fontWeight};
  line-height: ${props => props.theme.typography.textStyles.overline.lineHeight};
  letter-spacing: ${props => props.theme.typography.textStyles.overline.letterSpacing};
  text-transform: uppercase;
`;

// Special text components
export const Lead = styled.p<{ color?: keyof typeof theme.colors.text; align?: 'left' | 'center' | 'right' }>`
  ${BaseText}
  font-size: ${props => props.theme.typography.fontSize.xl};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-weight: ${props => props.theme.typography.fontWeight.light};
  margin-bottom: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.breakpoints.down.md} {
    font-size: ${props => props.theme.typography.fontSize.lg};
  }
`;

export const Highlight = styled.mark`
  background-color: ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.black};
  padding: ${props => props.theme.spacing[0.5]} ${props => props.theme.spacing[1]};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

export const Code = styled.code`
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing[0.5]} ${props => props.theme.spacing[1]};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

export const BlockQuote = styled.blockquote`
  margin: ${props => props.theme.spacing[6]} 0;
  padding-left: ${props => props.theme.spacing[6]};
  border-left: 4px solid ${props => props.theme.colors.primary.yellow};
  font-style: italic;
  color: ${props => props.theme.colors.text.secondary};
  
  p {
    margin-bottom: ${props => props.theme.spacing[3]};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;