import 'styled-components';
import { Theme } from '../styles/design-system/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    // Add any legacy properties that might be needed
    primaryDark?: string;
    backgroundHover?: string;
  }
}