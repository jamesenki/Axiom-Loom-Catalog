#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the content validation report
const report = JSON.parse(fs.readFileSync('content-validation-report.json', 'utf-8'));

// Extract syntax errors
const syntaxErrors = report.issues.filter(issue => issue.type === 'syntax-error');

console.log(`Found ${syntaxErrors.length} markdown syntax errors to fix`);

// Group by repository
const errorsByRepo = {};
syntaxErrors.forEach(error => {
  if (!errorsByRepo[error.repository]) {
    errorsByRepo[error.repository] = [];
  }
  errorsByRepo[error.repository].push(error);
});

// Common markdown syntax fixes
const syntaxFixPatterns = [
  // Fix unclosed code blocks
  {
    pattern: /```([^`]*?)(?=^#{1,6}\s|\Z)/gms,
    fix: (match, content) => `\`\`\`${content}\n\`\`\`\n`
  },
  // Fix broken link syntax - missing closing bracket
  {
    pattern: /\[([^\]]+)(?=\s*\()/g,
    fix: (match, text) => `[${text}]`
  },
  // Fix broken link syntax - missing closing parenthesis
  {
    pattern: /\[([^\]]+)\]\(([^)]+)(?=\s|$)/g,
    fix: (match, text, url) => `[${text}](${url})`
  },
  // Fix malformed bold syntax
  {
    pattern: /\*\*([^*]+)(?=\s|$)/g,
    fix: (match, text) => `**${text}**`
  },
  // Fix malformed italic syntax
  {
    pattern: /(?<!\*)\*([^*]+)(?=\s|$)/g,
    fix: (match, text) => `*${text}*`
  },
  // Fix malformed headers with extra spaces
  {
    pattern: /^(#{1,6})\s{2,}(.+)$/gm,
    fix: (match, hashes, title) => `${hashes} ${title}`
  },
  // Fix lists with incorrect indentation
  {
    pattern: /^(\s*)[-*+]\s{2,}(.+)$/gm,
    fix: (match, indent, content) => `${indent}- ${content}`
  }
];

let totalFixed = 0;

// Process each repository
Object.entries(errorsByRepo).forEach(([repo, errors]) => {
  console.log(`\n=== Processing ${repo} (${errors.length} errors) ===`);
  
  const processedFiles = new Set();
  
  errors.forEach(error => {
    const filePath = path.join('cloned-repositories', repo, error.file);
    
    // Skip if file doesn't exist or already processed
    if (!fs.existsSync(filePath) || processedFiles.has(filePath)) {
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    let fixCount = 0;
    
    // Apply syntax fixes
    syntaxFixPatterns.forEach(({ pattern, fix }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, fix);
        fixCount += matches.length;
      }
    });
    
    // Additional specific fixes based on error descriptions
    if (error.description) {
      // Fix specific markdown table issues
      if (error.description.includes('table')) {
        // Ensure tables have proper header separator
        content = content.replace(/(\|[^|]+\|[^|]+\|)\n(?!\|[-:]+\|)/g, '$1\n|---|---|');
      }
      
      // Fix unclosed inline code
      if (error.description.includes('code')) {
        // Count backticks and add missing ones
        const backtickCount = (content.match(/`/g) || []).length;
        if (backtickCount % 2 !== 0) {
          content += '`';
          fixCount++;
        }
      }
    }
    
    // Write back if changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ Fixed ${fixCount} issues in ${error.file}`);
      totalFixed += fixCount;
      processedFiles.add(filePath);
    } else {
      console.log(`  ⚠️  Could not auto-fix: ${error.file} - ${error.description || 'Unknown error'}`);
    }
  });
});

// Run a second pass to check for remaining issues
console.log('\n=== Second Pass: Checking for complex syntax issues ===');

const findMarkdownFiles = (dir) => {
  const files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  });
  
  return files;
};

// Check all markdown files in repositories with syntax errors
let complexIssuesFixed = 0;

Object.keys(errorsByRepo).forEach(repo => {
  const repoPath = path.join('cloned-repositories', repo);
  const mdFiles = findMarkdownFiles(repoPath);
  
  mdFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    // Fix tables with missing cells
    content = content.replace(/(\|[^|\n]+)\n/g, (match, row) => {
      const cellCount = (row.match(/\|/g) || []).length;
      if (cellCount < 2) {
        return row + '||\n';
      }
      return match;
    });
    
    // Fix nested lists with wrong indentation
    content = content.replace(/^(\s*)([*+-])\s*([*+-])\s+(.+)$/gm, '$1$2 $4\n$1  $3 ');
    
    // Fix multiple consecutive blank lines
    content = content.replace(/\n{4,}/g, '\n\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      complexIssuesFixed++;
    }
  });
});

console.log(`\n=== Summary ===`);
console.log(`Total syntax issues fixed: ${totalFixed + complexIssuesFixed}`);
console.log(`Files processed: ${Object.values(errorsByRepo).flat().length}`);
console.log(`\nNote: Some complex syntax errors may require manual review.`);