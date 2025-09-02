import { createGlobalStyle } from 'styled-components';
import theme from './design-system/theme';
import { axiomTheme, quantumColors } from './axiom-theme';

const GlobalStyles = createGlobalStyle`
  /* Import Quantum Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

  /* Axiom Loom CSS Custom Properties */
  :root {
    /* Quantum Colors */
    --quantum-deep: ${quantumColors.quantum.deep};
    --quantum-void: ${quantumColors.quantum.void};
    --quantum-dark: ${quantumColors.quantum.dark};
    --quantum-medium: ${quantumColors.quantum.medium};
    --quantum-light: ${quantumColors.quantum.light};
    --quantum-bright: ${quantumColors.quantum.bright};
    --quantum-glow: ${quantumColors.quantum.glow};

    /* Neural Blues */
    --neural-deep: ${quantumColors.neural.deep};
    --neural-dark: ${quantumColors.neural.dark};
    --neural-medium: ${quantumColors.neural.medium};
    --neural-light: ${quantumColors.neural.light};
    --neural-bright: ${quantumColors.neural.bright};
    --neural-glow: ${quantumColors.neural.glow};
    --neural-electric: ${quantumColors.neural.electric};

    /* Plasma Accents */
    --plasma-violet: ${quantumColors.plasma.violet};
    --plasma-cyan: ${quantumColors.plasma.cyan};
    --plasma-magenta: ${quantumColors.plasma.magenta};
    --plasma-gold: ${quantumColors.plasma.gold};
    --plasma-emerald: ${quantumColors.plasma.emerald};
    --plasma-crimson: ${quantumColors.plasma.crimson};

    /* Glass Morphism */
    --glass-background: ${quantumColors.glass.background};
    --glass-border: ${quantumColors.glass.border};
    --glass-hover: ${quantumColors.glass.hover};
    --glass-active: ${quantumColors.glass.active};

    /* Typography */
    --font-primary: ${axiomTheme.typography.fonts.primary};
    --font-mono: ${axiomTheme.typography.fonts.mono};
    --font-display: ${axiomTheme.typography.fonts.display};

    /* Spacing */
    --spacing-px: ${axiomTheme.spacing.px};
    --spacing-1: ${axiomTheme.spacing[1]};
    --spacing-2: ${axiomTheme.spacing[2]};
    --spacing-3: ${axiomTheme.spacing[3]};
    --spacing-4: ${axiomTheme.spacing[4]};
    --spacing-5: ${axiomTheme.spacing[5]};
    --spacing-6: ${axiomTheme.spacing[6]};
    --spacing-8: ${axiomTheme.spacing[8]};
    --spacing-10: ${axiomTheme.spacing[10]};
    --spacing-12: ${axiomTheme.spacing[12]};
    --spacing-16: ${axiomTheme.spacing[16]};
    --spacing-20: ${axiomTheme.spacing[20]};
    --spacing-24: ${axiomTheme.spacing[24]};
    --spacing-32: ${axiomTheme.spacing[32]};
  }

  /* CSS Reset and Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    /* Removed font-smoothing that might cause fuzzing */
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-primary);
    font-size: ${props => props.theme.typography.fontSize.base};
    line-height: ${props => props.theme.typography.lineHeight.normal};
    
    /* SIMPLE RULE: Black text on white background */
    color: #000000;  /* BLACK text */
    background: #FFFFFF;  /* WHITE background */
    
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Simple Professional Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* Typography - Clean and Professional */
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: var(--spacing-4);
    font-family: var(--font-display);
    font-weight: 700;
    line-height: 1.2;
    color: #1A1A1A;  /* Dark text for maximum readability */
    
    /* No effects - clean design */
    text-shadow: none;
  }

  h1 {
    font-size: ${props => props.theme.typography.fontSize['5xl']};
    ${props => props.theme.breakpoints.down.md} {
      font-size: ${props => props.theme.typography.fontSize['4xl']};
    }
  }

  h2 {
    font-size: ${props => props.theme.typography.fontSize['4xl']};
    ${props => props.theme.breakpoints.down.md} {
      font-size: ${props => props.theme.typography.fontSize['3xl']};
    }
  }

  h3 {
    font-size: ${props => props.theme.typography.fontSize['3xl']};
    ${props => props.theme.breakpoints.down.md} {
      font-size: ${props => props.theme.typography.fontSize['2xl']};
    }
  }

  h4 {
    font-size: ${props => props.theme.typography.fontSize['2xl']};
  }

  h5 {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }

  h6 {
    font-size: ${props => props.theme.typography.fontSize.lg};
  }

  p {
    margin-bottom: var(--spacing-4);
    line-height: 1.6;
    color: #333333;  /* Dark gray for good readability */
  }

  /* Links - Professional Style */
  a {
    color: #0066CC;  /* Professional blue */
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: #0052A3;  /* Darker blue on hover */
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid #0066CC;
      outline-offset: 2px;
    }
  }

  /* Lists */
  ul, ol {
    margin-bottom: ${props => props.theme.spacing[4]};
    padding-left: ${props => props.theme.spacing[6]};
  }

  li {
    margin-bottom: ${props => props.theme.spacing[2]};
  }

  /* Code */
  code {
    font-family: ${props => props.theme.typography.fontFamily.mono};
    font-size: ${props => props.theme.typography.fontSize.sm};
    background-color: ${props => props.theme.colors.background.secondary};
    padding: ${props => props.theme.spacing[0.5]} ${props => props.theme.spacing[1]};
    border-radius: ${props => props.theme.borderRadius.sm};
  }

  pre {
    font-family: ${props => props.theme.typography.fontFamily.mono};
    font-size: ${props => props.theme.typography.fontSize.sm};
    background-color: ${props => props.theme.colors.background.secondary};
    padding: ${props => props.theme.spacing[4]};
    border-radius: ${props => props.theme.borderRadius.md};
    overflow-x: auto;
    margin-bottom: ${props => props.theme.spacing[4]};
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${props => props.theme.spacing[4]};
  }

  th, td {
    padding: ${props => props.theme.spacing[3]};
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border.light};
  }

  th {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    background-color: ${props => props.theme.colors.background.secondary};
  }

  /* Forms */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Utility Classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Professional Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #F5F5F5;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 4px;
    
    &:hover {
      background: #94A3B8;
    }
  }

  /* Professional Selection */
  ::selection {
    background: rgba(0, 102, 204, 0.2);
    color: inherit;
  }

  /* Clean Focus Visible */
  :focus-visible {
    outline: 2px solid #0066CC;
    outline-offset: 2px;
  }

  /* Simple Animations */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Loading State */
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #E2E8F0;
    border-top-color: #0066CC;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
`;

export default GlobalStyles;