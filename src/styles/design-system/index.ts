// Design System Main Export
export { colors } from './colors';
export { typography } from './typography';
export { spacing, layout } from './spacing';
export { shadows } from './shadows';
export { breakpoints, containers } from './breakpoints';
export { animations } from './animations';

// Re-export all as a single theme object
export { default as theme } from './theme';

// Export styled components utilities
export { styled, css, createGlobalStyle, keyframes, ThemeProvider } from 'styled-components';