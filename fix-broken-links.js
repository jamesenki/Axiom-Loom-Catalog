#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the content validation report
const report = JSON.parse(fs.readFileSync('content-validation-report.json', 'utf-8'));

// Group broken links by repository and file
const brokenLinksByRepo = {};

report.issues.forEach(issue => {
  if (issue.type === 'broken-link') {
    if (!brokenLinksByRepo[issue.repository]) {
      brokenLinksByRepo[issue.repository] = {};
    }
    if (!brokenLinksByRepo[issue.repository][issue.file]) {
      brokenLinksByRepo[issue.repository][issue.file] = [];
    }
    
    // Extract the link text and path from the description
    const match = issue.description.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (match) {
      brokenLinksByRepo[issue.repository][issue.file].push({
        linkText: match[1],
        linkPath: match[2],
        fullMatch: match[0]
      });
    }
  }
});

// Function to check if a file exists relative to the source file
function findCorrectPath(sourceFile, targetPath, repoPath) {
  const sourceDir = path.dirname(sourceFile);
  
  // Try different path resolutions
  const attempts = [
    // As-is from the source directory
    path.join(repoPath, sourceDir, targetPath),
    // From repository root
    path.join(repoPath, targetPath),
    // In docs directory
    path.join(repoPath, 'docs', path.basename(targetPath)),
    // Remove leading dots and slashes
    path.join(repoPath, targetPath.replace(/^\.\//, '').replace(/^\//, '')),
    // Try without docs prefix if it has one
    path.join(repoPath, targetPath.replace(/^\.\/docs\//, '').replace(/^docs\//, ''))
  ];

  for (const attempt of attempts) {
    if (fs.existsSync(attempt)) {
      // Calculate relative path from source to target
      const relPath = path.relative(path.join(repoPath, sourceDir), attempt);
      return relPath.startsWith('.') ? relPath : './' + relPath;
    }
  }
  
  return null;
}

// Process each repository
let totalFixed = 0;
let totalNotFound = 0;

Object.entries(brokenLinksByRepo).forEach(([repo, files]) => {
  console.log(`\n=== Processing ${repo} ===`);
  const repoPath = path.join('cloned-repositories', repo);
  
  Object.entries(files).forEach(([file, links]) => {
    const filePath = path.join(repoPath, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  ❌ File not found: ${file}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    links.forEach(link => {
      const correctPath = findCorrectPath(file, link.linkPath, repoPath);
      
      if (correctPath && correctPath !== link.linkPath) {
        const newLink = `[${link.linkText}](${correctPath})`;
        content = content.replace(link.fullMatch, newLink);
        console.log(`  ✅ Fixed in ${file}: ${link.linkPath} -> ${correctPath}`);
        modified = true;
        totalFixed++;
      } else if (!correctPath) {
        console.log(`  ⚠️  Cannot find target for ${file}: ${link.linkPath}`);
        totalNotFound++;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
    }
  });
});

console.log(`\n=== Summary ===`);
console.log(`Total links fixed: ${totalFixed}`);
console.log(`Total links not found: ${totalNotFound}`);
console.log(`\nNote: Links that couldn't be fixed may need manual attention or the target files may need to be created.`);