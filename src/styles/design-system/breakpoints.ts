// Responsive Breakpoints System
export const breakpoints = {
  // Breakpoint values
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Media query strings
  up: {
    xs: '@media (min-width: 0px)',
    sm: '@media (min-width: 640px)',
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
    xl: '@media (min-width: 1280px)',
    '2xl': '@media (min-width: 1536px)',
  },
  
  down: {
    xs: '@media (max-width: 639px)',
    sm: '@media (max-width: 767px)',
    md: '@media (max-width: 1023px)',
    lg: '@media (max-width: 1279px)',
    xl: '@media (max-width: 1535px)',
    '2xl': '@media (max-width: 9999px)',
  },
  
};

// Utility function to create between breakpoint queries
export const between = (min: keyof typeof breakpoints.values, max: keyof typeof breakpoints.values) => {
  return `@media (min-width: ${breakpoints.values[min]}px) and (max-width: ${breakpoints.values[max] - 1}px)`;
};

// Container widths
export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
};