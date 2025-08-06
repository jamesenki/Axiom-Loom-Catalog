import { useTheme as useStyledTheme } from 'styled-components';
import { Theme } from '../styles/design-system/theme';

export const useTheme = (): Theme => {
  return useStyledTheme() as Theme;
};