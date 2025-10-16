/**
 * Professional Design System
 * Clean, readable, enterprise-grade design system
 */

// Professional Color Palette - Clean and readable
export const quantumColors = {
  // High contrast text colors for light themes
  text: {
    primary: '#1A1A1A',      // Very dark gray for maximum readability
    secondary: '#333333',    // Dark gray for secondary text
    tertiary: '#666666',     // Medium gray for subtle text
    muted: '#999999',        // Light gray for disabled text
    link: '#0066CC',         // Professional blue for links
    linkHover: '#0052A3',    // Darker blue for hover
  },

  // Professional Blues - Clean and trustworthy
  quantum: {
    deep: '#FFFFFF',         // White background
    void: '#FAFAFA',         // Very light gray
    dark: '#F5F5F5',         // Light gray
    medium: '#E2E8F0',       // Border gray
    light: '#CBD5E1',        // Medium border
    bright: '#94A3B8',       // Text gray
    glow: '#0066CC',         // Professional blue
  },

  // Professional Grays - Clean hierarchy
  neural: {
    deep: '#FFFFFF',         // White primary background
    dark: '#FAFAFA',         // Very light background
    medium: '#F5F5F5',       // Card backgrounds
    light: '#E2E8F0',        // Light borders
    bright: '#1A1A1A',       // Dark text for maximum contrast
    glow: '#333333',         // Secondary text
    electric: '#0066CC',     // Primary accent blue
  },

  // Professional Accents - Minimal and clean
  plasma: {
    violet: '#0066CC',       // Professional blue
    cyan: '#00A86B',         // Success green
    magenta: '#DC3545',      // Error red
    gold: '#FD7E14',         // Warning orange
    emerald: '#00A86B',      // Success green
    crimson: '#DC3545',      // Error red
  },

  // Clean Card Colors
  glass: {
    background: '#FFFFFF',
    border: '#E2E8F0',
    hover: '#F5F5F5',
    active: '#E2E8F0',
  },

  // Professional Gradients - Subtle only
  gradients: {
    aurora: {
      start: '#FFFFFF',      // White
      middle: '#FAFAFA',     // Very light gray
      end: '#F5F5F5',        // Light gray
    },
    neutron: {
      start: '#FFFFFF',      // White
      middle: '#FAFAFA',     // Very light gray
      end: '#F5F5F5',        // Light gray
    },
    supernova: {
      start: '#FFFFFF',      // White
      middle: '#FAFAFA',     // Very light gray
      end: '#F5F5F5',        // Light gray
    },
    holographic: {
      start: '#FFFFFF',      // White
      middle: '#FAFAFA',     // Very light gray
      end: '#F5F5F5',        // Light gray
    },
  },
};

// Professional Animation Configurations - Minimal and clean
export const quantumAnimations = {
  // Timing functions - Standard easing
  easing: {
    quantum: 'cubic-bezier(0.4, 0, 0.2, 1)',    // Standard ease
    neural: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',  // Slight ease out
    plasma: 'cubic-bezier(0.4, 0, 0.2, 1)',     // Standard ease (no bounce)
  },

  // Duration scales - Fast and responsive
  duration: {
    instant: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '250ms',
    epic: '300ms',     // Max duration for professional feel
  },

  // NO GLOW EFFECTS - Professional design
  glow: {
    small: 'none',
    medium: 'none',
    large: 'none',
    epic: 'none',
  },

  // NO BLUR EFFECTS - Clean design
  blur: {
    sm: 'none',
    md: 'none',
    lg: 'none',
    xl: 'none',
  },
};

// Professional Card Properties - Clean and simple
export const glassMorphism = {
  background: {
    primary: '#FFFFFF',        // Clean white background
    secondary: '#FAFAFA',      // Very light gray
    tertiary: '#F5F5F5',       // Light gray
  },
  
  backdrop: {
    light: 'none',    // No backdrop effects
    medium: 'none',   // No backdrop effects
    heavy: 'none',    // No backdrop effects
  },
  
  border: {
    subtle: '1px solid #E2E8F0',    // Light gray border
    medium: '1px solid #CBD5E1',    // Medium gray border
    bright: '1px solid #94A3B8',    // Darker gray border
  },
  
  shadow: {
    soft: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',     // Subtle shadow
    medium: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',   // Card shadow
    dramatic: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)', // Elevated shadow
  },
};

// Complete Axiom Theme
export const axiomTheme = {
  colors: quantumColors,
  animations: quantumAnimations,
  glass: glassMorphism,

  // Typography for the future
  typography: {
    fonts: {
      primary: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", Monaco, monospace',
      display: '"Space Grotesk", "Inter", sans-serif',
    },
    
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
  },

  // Spacing system
  spacing: {
    px: '1px',
    0: '0',
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
    24: '6rem',
    32: '8rem',
  },

  // Border radius for the future
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },

  // Z-index layers
  zIndex: {
    background: -10,
    default: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    max: 2147483647,
  },
};

// Gradient utilities
export const createGradient = (
  direction: string = 'to right',
  ...colors: string[]
): string => {
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
};

// Glow utilities
export const createGlow = (
  color: string,
  intensity: 'small' | 'medium' | 'large' | 'epic' = 'medium'
): string => {
  const glowSize = quantumAnimations.glow[intensity];
  return `${glowSize} ${color}`;
};

// Clean card effect utility - Professional design
export const createGlassEffect = (
  background: string = glassMorphism.background.primary,
  blur: string = glassMorphism.backdrop.medium,
  border: string = glassMorphism.border.subtle
) => ({
  background,
  backdropFilter: 'none',  // No effects
  border,
  borderRadius: '8px',      // Standard border radius
  boxShadow: glassMorphism.shadow.soft,
});

export default axiomTheme;

// Type definitions
export type QuantumColors = typeof quantumColors;
export type AxiomTheme = typeof axiomTheme;