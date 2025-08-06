// EYNS AI Experience Center Design System
export const theme = {
  colors: {
    primary: {
      yellow: '#FFD700',
      black: '#000000',
      white: '#FFFFFF',
      main: '#FFD700', // Alias for primary color
    },
    secondary: {
      lightGray: '#F5F5F5',
      mediumGray: '#9E9E9E',
      darkGray: '#616161',
    },
    // Legacy color mappings for compatibility
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E0E0E6',
      300: '#C0C0C6',
      400: '#9E9E9E',
      500: '#747480',
      600: '#616161',
      700: '#424242',
      800: '#2E2E38',
      900: '#212121',
    },
    // Accent Colors for UI Elements
    accent: {
      blue: '#0B6BA7',
      green: '#00A350',
      red: '#C4232B',
      orange: '#FF7900',
      purple: '#6B46C1',
    },
    // Semantic Colors
    semantic: {
      success: '#00A350',
      warning: '#FF7900',
      error: '#C4232B',
      info: '#0B6BA7',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      tertiary: '#FAFAFA',
      dark: '#1A1A1A',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
      tertiary: '#9E9E9E',
      inverse: '#FFFFFF',
      link: '#1976D2',
    },
    border: {
      light: '#E0E0E0',
      medium: '#BDBDBD',
      dark: '#616161',
    },
    status: {
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3',
    },
    // Legacy info color for compatibility
    info: {
      light: '#E3F2FD',
      main: '#2196F3',
    },
  },
  
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'Monaco, Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    // Pre-composed Text Styles
    textStyles: {
      h1: {
        fontSize: '3rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2.25rem',
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.875rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.35,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      bodyLarge: {
        fontSize: '1.125rem',
        fontWeight: 400,
        lineHeight: 1.75,
      },
      body: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      bodySmall: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      button: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: '0.02em',
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.4,
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
    },
  },
  
  spacing: {
    0.5: '0.125rem',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
  },
  
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
    up: {
      sm: '@media (min-width: 640px)',
      md: '@media (min-width: 768px)',
      lg: '@media (min-width: 1024px)',
      xl: '@media (min-width: 1280px)',
      '2xl': '@media (min-width: 1536px)',
    },
    down: {
      xs: '@media (max-width: 639px)',
      sm: '@media (max-width: 767px)',
      md: '@media (max-width: 1023px)',
      lg: '@media (max-width: 1279px)',
      xl: '@media (max-width: 1535px)',
    },
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    focus: '0 0 0 3px rgba(255, 215, 0, 0.5)',
  },
  
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    },
    transition: {
      colors: 'color 150ms ease-in-out, background-color 150ms ease-in-out, border-color 150ms ease-in-out',
      transform: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      all: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  // Component-specific styles
  components: {
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      padding: {
        sm: '0 12px',
        md: '0 16px',
        lg: '0 24px',
      },
      borderRadius: '8px',
    },
  },
  
  // Legacy properties for compatibility
  primaryDark: '#E6D100',
  backgroundHover: '#F5F5F5',
};

// TypeScript theme type
export type Theme = typeof theme;