#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Pattern that was causing issues
const placeholderPattern = /\[([A-Z][^:\]]*)\](?=:)/g;

// Check all markdown files
const reposDir = 'cloned-repositories';
let filesWithPatterns = 0;
let totalPatterns = 0;

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = content.match(placeholderPattern) || [];
  if (matches.length > 0) {
    filesWithPatterns++;
    totalPatterns += matches.length;
    console.log(`Found ${matches.length} patterns in ${path.relative(reposDir, filePath)}`);
    matches.slice(0, 3).forEach(m => console.log(`  - ${m}`));
  }
  return matches.length;
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'site') {
      processDirectory(fullPath);
    } else if (item.endsWith('.md')) {
      checkFile(fullPath);
    }
  });
}

console.log('Verifying template placeholder fixes...\n');
processDirectory(reposDir);

console.log(`\n=== Summary ===`);
console.log(`Files with placeholder patterns: ${filesWithPatterns}`);
console.log(`Total patterns found: ${totalPatterns}`);

if (totalPatterns === 0) {
  console.log('\n✅ All template placeholders have been successfully fixed!');
} else {
  console.log('\n⚠️  Some patterns may still need attention');
}