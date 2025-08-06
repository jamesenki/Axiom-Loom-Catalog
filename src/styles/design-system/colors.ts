// EY Brand Colors and Design System Color Palette
export const colors = {
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
  primaryDark: '#E6D100', // Darker yellow
  backgroundHover: '#F5F5F5',
  info: {
    light: '#E3F2FD',
    main: '#0B6BA7',
  },
  // Primary EY Brand Colors
  primary: {
    yellow: '#FFE600', // EY Yellow - Primary brand color
    black: '#2E2E38', // EY Black
    white: '#FFFFFF',
    main: '#FFE600', // Alias for primary color
  },
  
  // Secondary Brand Colors
  secondary: {
    darkGray: '#747480',
    mediumGray: '#C0C0C6',
    lightGray: '#F5F5F5',
    gray: '#C0C0C6', // Alias for compatibility
  },
  
  // Accent Colors for UI Elements
  accent: {
    blue: '#0B6BA7', // For links and interactive elements
    green: '#00A350', // Success states
    red: '#C4232B', // Error states
    orange: '#FF7900', // Warning states
    purple: '#6B46C1', // Special UI elements
  },
  
  // Semantic Colors
  semantic: {
    success: '#00A350',
    warning: '#FF7900',
    error: '#C4232B',
    info: '#0B6BA7',
  },
  
  // Status Colors (alias for semantic for compatibility)
  status: {
    success: '#00A350',
    warning: '#FF7900',
    error: '#C4232B',
    info: '#0B6BA7',
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#FAFAFA',
    dark: '#2E2E38',
    overlay: 'rgba(46, 46, 56, 0.8)',
  },
  
  // Text Colors
  text: {
    primary: '#2E2E38',
    secondary: '#747480',
    tertiary: '#C0C0C6',
    inverse: '#FFFFFF',
    link: '#0B6BA7',
  },
  
  // Border Colors
  border: {
    light: '#E0E0E6',
    medium: '#C0C0C6',
    dark: '#747480',
  },
  
  // Shadow Colors
  shadow: {
    light: 'rgba(46, 46, 56, 0.08)',
    medium: 'rgba(46, 46, 56, 0.12)',
    dark: 'rgba(46, 46, 56, 0.24)',
  },
};

// Color utilities
export const getColorWithOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};