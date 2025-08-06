import 'styled-components';
import { Theme } from './styles/design-system/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}