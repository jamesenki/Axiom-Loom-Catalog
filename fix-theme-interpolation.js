#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Files to fix
const styledComponentFiles = [
  'src/components/styled/Button.tsx',
  'src/components/styled/Card.tsx',
  'src/components/styled/Header.tsx',
  'src/components/styled/Input.tsx',
  'src/components/styled/Loading.tsx',
  'src/components/styled/Typography.tsx',
  'src/components/styled/Container.tsx',
  'src/components/styled/Skeleton.tsx',
  'src/components/styled/EnhancedCard.tsx',
  'src/components/styled/EmptyState.tsx',
  'src/styles/GlobalStyles.tsx'
];

// Additional files with theme issues
const additionalFiles = glob.sync('src/components/*.tsx', { 
  ignore: ['**/node_modules/**', '**/__tests__/**'] 
});

const allFiles = [...new Set([...styledComponentFiles, ...additionalFiles])];

function fixThemeInterpolation(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filePath} - file not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file imports theme directly
  const hasDirectThemeImport = /import.*theme.*from.*['"].*design-system/.test(content);
  
  if (hasDirectThemeImport) {
    // Pattern 1: Fix direct theme usage in styled components (e.g., ${theme.colors.primary})
    const styledPattern = /\$\{theme\.([\w.]+)\}/g;
    if (styledPattern.test(content)) {
      content = content.replace(styledPattern, (match, path) => {
        return `\${props => props.theme.${path}}`;
      });
      modified = true;
    }
    
    // Pattern 2: Fix theme usage in css`` blocks
    const cssBlockPattern = /css\`([^`]*)\$\{theme\.([\w.]+)\}([^`]*)\`/g;
    content = content.replace(cssBlockPattern, (match, before, path, after) => {
      return `css\`${before}\${props => props.theme.${path}}${after}\``;
    });
    
    // Pattern 3: Fix complex expressions with theme
    const complexPattern = /\$\{([^}]*theme\.[^}]+)\}/g;
    content = content.replace(complexPattern, (match, expression) => {
      if (!expression.includes('props =>') && !expression.includes('props=>') && !expression.includes('(props)')) {
        // Only fix if not already using props
        return `\${props => ${expression.replace(/theme\./g, 'props.theme.')}}`;
      }
      return match;
    });
    
    // Remove direct theme import if no longer needed
    const themeUsageOutsideStyled = /(?<!props\s*=>\s*)(?<!props=>\s*)(?<!\$\{props\s*=>\s*)theme\./g;
    if (!themeUsageOutsideStyled.test(content.replace(/import.*theme.*from.*/, ''))) {
      content = content.replace(/import\s+theme\s+from\s+['"].*design-system.*['"];?\n?/g, '');
      modified = true;
    }
  }
  
  // Fix GlobalStyles specifically
  if (filePath.includes('GlobalStyles')) {
    // Keep the theme import for GlobalStyles as it's used directly
    if (!content.includes('import theme from')) {
      content = `import theme from './design-system/theme';\n` + content;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed theme interpolation in ${filePath}`);
  }
}

console.log('Fixing theme interpolation issues...\n');

allFiles.forEach(file => {
  fixThemeInterpolation(file);
});

console.log('\n✨ Theme interpolation fixes complete!');