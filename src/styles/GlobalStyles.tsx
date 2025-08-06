import { createGlobalStyle } from 'styled-components';
import theme from './design-system/theme';

const GlobalStyles = createGlobalStyle`
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
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily.primary};
    font-size: ${props => props.theme.typography.fontSize.base};
    line-height: ${props => props.theme.typography.lineHeight.normal};
    color: ${props => props.theme.colors.text.primary};
    background-color: ${props => props.theme.colors.background.primary};
    min-height: 100vh;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${props => props.theme.spacing[4]};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    line-height: ${props => props.theme.typography.lineHeight.tight};
    color: ${props => props.theme.colors.text.primary};
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
    margin-bottom: ${props => props.theme.spacing[4]};
    line-height: ${props => props.theme.typography.lineHeight.relaxed};
  }

  /* Links */
  a {
    color: ${props => props.theme.colors.text.link};
    text-decoration: none;
    transition: ${props => props.theme.animations.transition.colors};

    &:hover {
      text-decoration: underline;
    }

    &:focus {
      outline: none;
      box-shadow: ${props => props.theme.shadows.focus};
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

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.secondary.mediumGray};
    border-radius: ${props => props.theme.borderRadius.full};
    
    &:hover {
      background: ${props => props.theme.colors.secondary.darkGray};
    }
  }

  /* Selection */
  ::selection {
    background-color: ${props => props.theme.colors.primary.yellow};
    color: ${props => props.theme.colors.primary.black};
  }

  /* Focus Visible */
  :focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary.yellow};
    outline-offset: 2px;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Loading State */
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid ${props => props.theme.colors.border.light};
    border-top-color: ${props => props.theme.colors.primary.yellow};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
`;

export default GlobalStyles;