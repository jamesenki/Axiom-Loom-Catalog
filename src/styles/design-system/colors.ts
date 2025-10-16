// Professional Design System Color Palette
// Clean, readable colors for enterprise applications
export const colors = {
  // Professional Gray Scale - Light Theme
  gray: {
    50: '#f8fafc',     // Lightest gray
    100: '#f1f5f9',    // Very light gray
    200: '#e2e8f0',    // Light gray
    300: '#cbd5e1',    // Medium-light gray
    400: '#94a3b8',    // Medium gray
    500: '#64748b',    // Medium-dark gray
    600: '#475569',    // Dark gray
    700: '#334155',    // Darker gray
    800: '#1e293b',    // Very dark gray
    900: '#0f172a',    // Darkest gray
  },
  
  // Primary Brand Colors - Light Theme
  primary: {
    blue: '#0066CC',       // Professional blue
    main: '#0066CC',       // Primary color
    light: '#3385D6',      // Light blue
    dark: '#0052A3',       // Dark blue
    white: '#FFFFFF',      // Pure white
    black: '#1A1A1A',      // Near black for text
    yellow: '#0066CC',     // Map old yellow to professional blue for compatibility
  },
  
  // Secondary Colors
  secondary: {
    lightGray: '#F5F5F5',  // Very light background
    mediumGray: '#E5E5E5', // Light borders
    darkGray: '#666666',   // Medium text
    charcoal: '#333333',   // Dark text
  },
  
  // Accent Colors for UI Elements
  accent: {
    blue: '#0066CC',       // Primary blue
    green: '#00A86B',      // Success green
    red: '#DC3545',        // Error red
    orange: '#FD7E14',     // Warning orange
    purple: '#6F42C1',     // Info purple
  },
  
  // Semantic Colors
  semantic: {
    success: '#00A86B',
    warning: '#FD7E14',
    error: '#DC3545',
    info: '#0066CC',
  },
  
  // Status Colors (alias for semantic)
  status: {
    success: '#00A86B',
    warning: '#FD7E14',
    error: '#DC3545',
    info: '#0066CC',
  },
  
  // Background Colors - Light Theme
  background: {
    primary: '#FFFFFF',      // White primary background
    secondary: '#FAFAFA',    // Very light gray
    tertiary: '#F5F5F5',     // Light gray
    paper: '#FFFFFF',        // Card backgrounds
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text Colors - High Contrast for Light Backgrounds
  text: {
    primary: '#1A1A1A',      // Very dark gray for main text
    secondary: '#333333',    // Dark gray for secondary text
    tertiary: '#666666',     // Medium gray for subtle text
    muted: '#999999',        // Light gray for disabled text
    link: '#0066CC',         // Professional blue for links
    inverse: '#FFFFFF',      // White for dark backgrounds
  },
  
  // Border Colors - Visible on Light Backgrounds
  border: {
    light: '#E2E8F0',        // Light border
    medium: '#CBD5E1',       // Medium border
    dark: '#94A3B8',         // Dark border
    focus: '#0066CC',        // Focus state border
  },
  
  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)',
  },
  
  // Legacy compatibility - map to semantic colors
  info: {
    light: '#E3F2FD',
    main: '#0066CC',
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