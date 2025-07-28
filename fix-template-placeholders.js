#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Pattern to identify template placeholders that look like markdown links
const placeholderPattern = /\[([A-Z][^:\]]*)\](?=:)/g;

// Files/directories to process
const reposDir = 'cloned-repositories';
const processedFiles = [];
let totalFixed = 0;

// Function to fix placeholders in a file
function fixPlaceholders(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let fixedContent = content;
  
  // Replace [PLACEHOLDER]: with **PLACEHOLDER**:
  fixedContent = fixedContent.replace(placeholderPattern, '**$1**');
  
  // Also fix standalone placeholders like [DOMAIN] that aren't followed by colon
  fixedContent = fixedContent.replace(/\[([A-Z_]+)\](?!\()/g, '`$1`');
  
  if (fixedContent !== content) {
    fs.writeFileSync(filePath, fixedContent);
    const matches = content.match(placeholderPattern) || [];
    const standaloneMatches = content.match(/\[([A-Z_]+)\](?!\()/g) || [];
    const totalMatches = matches.length + standaloneMatches.length;
    
    if (totalMatches > 0) {
      processedFiles.push({ file: filePath, fixes: totalMatches });
      totalFixed += totalMatches;
      return totalMatches;
    }
  }
  
  return 0;
}

// Recursively find and fix markdown files
function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'site') {
      processDirectory(fullPath);
    } else if (item.endsWith('.md')) {
      const fixes = fixPlaceholders(fullPath);
      if (fixes > 0) {
        console.log(`✅ Fixed ${fixes} placeholders in ${path.relative(reposDir, fullPath)}`);
      }
    }
  });
}

console.log('Fixing template placeholders in markdown files...\n');

// Process all repositories
processDirectory(reposDir);

console.log(`\n=== Summary ===`);
console.log(`Total placeholders fixed: ${totalFixed}`);
console.log(`Files processed: ${processedFiles.length}`);

if (processedFiles.length > 0) {
  console.log('\nTop files with most fixes:');
  processedFiles
    .sort((a, b) => b.fixes - a.fixes)
    .slice(0, 10)
    .forEach(({ file, fixes }) => {
      console.log(`  ${fixes} fixes: ${path.relative(reposDir, file)}`);
    });
}