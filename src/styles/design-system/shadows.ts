// Shadow System for depth and elevation
export const shadows = {
  // Elevation levels following Material Design principles
  none: 'none',
  sm: '0 1px 3px 0 rgba(46, 46, 56, 0.1), 0 1px 2px 0 rgba(46, 46, 56, 0.06)',
  md: '0 4px 6px -1px rgba(46, 46, 56, 0.1), 0 2px 4px -1px rgba(46, 46, 56, 0.06)',
  lg: '0 10px 15px -3px rgba(46, 46, 56, 0.1), 0 4px 6px -2px rgba(46, 46, 56, 0.05)',
  xl: '0 20px 25px -5px rgba(46, 46, 56, 0.1), 0 10px 10px -5px rgba(46, 46, 56, 0.04)',
  '2xl': '0 25px 50px -12px rgba(46, 46, 56, 0.25)',
  
  // Specific use cases
  card: '0 2px 8px rgba(46, 46, 56, 0.08)',
  cardHover: '0 8px 16px rgba(46, 46, 56, 0.12)',
  dropdown: '0 10px 20px rgba(46, 46, 56, 0.15)',
  modal: '0 20px 40px rgba(46, 46, 56, 0.2)',
  
  // Inset shadows
  inner: 'inset 0 2px 4px 0 rgba(46, 46, 56, 0.06)',
  
  // Focus shadows (for accessibility)
  focus: '0 0 0 3px rgba(255, 230, 0, 0.5)', // Using EY Yellow
  focusError: '0 0 0 3px rgba(196, 35, 43, 0.5)',
  focusSuccess: '0 0 0 3px rgba(0, 163, 80, 0.5)',
};