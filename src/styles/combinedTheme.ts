/**
 * Combined Theme - Merges Axiom Loom design system with app requirements
 */
import { axiomTheme, quantumColors } from './axiom-theme';
import defaultTheme from './design-system/theme';

// Merge themes, with Axiom taking precedence
export const combinedTheme = {
  // Keep required structure from default theme
  ...defaultTheme,
  
  // Override with Axiom Loom colors and styles
  colors: {
    ...defaultTheme.colors,
    ...axiomTheme.colors,
    // Maintain compatibility with existing components
    primary: {
      ...defaultTheme.colors.primary,
      main: quantumColors.plasma.violet,
    },
    background: {
      ...defaultTheme.colors.background,
      primary: quantumColors.quantum.deep,
      secondary: quantumColors.quantum.void,
    },
    text: {
      ...defaultTheme.colors.text,
      primary: quantumColors.neural.bright,
      secondary: quantumColors.neural.light,
    },
    border: {
      ...defaultTheme.colors.border,
      light: quantumColors.glass.border,
      medium: quantumColors.glass.border,
    },
  },
  
  // Keep Axiom-specific properties
  quantum: axiomTheme.colors.quantum,
  neural: axiomTheme.colors.neural,
  plasma: axiomTheme.colors.plasma,
  glass: axiomTheme.colors.glass,
  gradients: axiomTheme.colors.gradients,
  
  // Merge typography
  typography: {
    ...defaultTheme.typography,
    ...axiomTheme.typography,
  },
  
  // Keep spacing and other required properties
  spacing: defaultTheme.spacing, // Use default spacing to maintain compatibility
  layout: defaultTheme.layout,
  shadows: defaultTheme.shadows,
  breakpoints: defaultTheme.breakpoints, // Use default breakpoints for compatibility
  containers: defaultTheme.containers,
  
  // Use default animations for compatibility
  animations: defaultTheme.animations,
  
  // Keep component configurations
  components: {
    ...defaultTheme.components,
    // Override with Axiom-specific component styles
    button: {
      ...defaultTheme.components.button,
      borderRadius: '12px',
    },
    card: {
      ...defaultTheme.components.card,
      borderRadius: '16px',
      background: axiomTheme.colors.glass.background,
      border: `1px solid ${axiomTheme.colors.glass.border}`,
    },
  },
};

export default combinedTheme;