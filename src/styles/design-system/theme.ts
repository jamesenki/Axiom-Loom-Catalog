// Complete Theme Object
import { colors } from './colors';
import { typography } from './typography';
import { spacing, layout } from './spacing';
import { shadows } from './shadows';
import { breakpoints, containers } from './breakpoints';
import { animations } from './animations';

const theme = {
  colors,
  typography,
  spacing,
  layout,
  shadows,
  breakpoints,
  containers,
  animations,
  
  // Component-specific tokens
  components: {
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      padding: {
        sm: `${spacing[2]} ${spacing[3]}`,
        md: `${spacing[2.5]} ${spacing[4]}`,
        lg: `${spacing[3]} ${spacing[5]}`,
      },
      borderRadius: '4px',
    },
    card: {
      borderRadius: '8px',
      padding: spacing[6],
      background: colors.background.primary,
      border: `1px solid ${colors.border.light}`,
    },
    input: {
      height: '40px',
      padding: `${spacing[2]} ${spacing[3]}`,
      borderRadius: '4px',
      border: `1px solid ${colors.border.medium}`,
      focusBorder: colors.primary.yellow,
    },
    modal: {
      overlay: colors.background.overlay,
      borderRadius: '12px',
      padding: spacing[8],
      maxWidth: '600px',
    },
  },
  
  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  // Border radius scale
  borderRadius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },
};

export default theme;

// Type definitions for TypeScript
export type Theme = typeof theme;