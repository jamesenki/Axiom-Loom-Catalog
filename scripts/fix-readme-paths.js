const fs = require('fs').promises;
const path = require('path');

const REPO_BASE = path.join(__dirname, '../cloned-repositories');

async function fixReadmePaths() {
  let totalFixed = 0;
  
  async function processFile(filePath, repoPath) {
    try {
      let content = await fs.readFile(filePath, 'utf-8');
      let modified = false;
      const fileDepth = path.relative(repoPath, filePath).split(path.sep).length - 1;
      
      // Calculate correct path to README
      let readmePath = './README.md';
      if (fileDepth > 0) {
        readmePath = '../'.repeat(fileDepth) + 'README.md';
      }
      
      // Fix various README patterns
      const patterns = [
        { regex: /\]\(\.\.\/README\.md\)/g, depth: 1 },
        { regex: /\]\(\.\.\/\.\.\/README\.md\)/g, depth: 2 },
        { regex: /\]\(\.\.\/\.\.\/\.\.\/README\.md\)/g, depth: 3 },
      ];
      
      for (const pattern of patterns) {
        if (pattern.depth === fileDepth && pattern.regex.test(content)) {
          content = content.replace(pattern.regex, `](${readmePath})`);
          modified = true;
        }
      }
      
      // Also fix ./README.md when we're in a subdirectory
      if (fileDepth > 0 && content.includes('](./README.md)')) {
        content = content.replace(/\]\(\.\/README\.md\)/g, `](${readmePath})`);
        modified = true;
      }
      
      // Fix architecture links
      if (fileDepth > 0 && content.includes('./architecture/index.md')) {
        const archPath = '../'.repeat(fileDepth - 1) + 'architecture/index.md';
        content = content.replace(/\]\(\.\/architecture\/index\.md\)/g, `](${archPath})`);
        modified = true;
      }
      
      if (modified) {
        await fs.writeFile(filePath, content);
        console.log(`Fixed paths in: ${path.relative(REPO_BASE, filePath)}`);
        totalFixed++;
      }
    } catch (error) {
      console.error(`Error processing ${filePath}: ${error}`);
    }
  }
  
  async function scanDirectory(dir, repoPath) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await scanDirectory(fullPath, repoPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        await processFile(fullPath, repoPath);
      }
    }
  }
  
  // Process all repositories
  const repos = await fs.readdir(REPO_BASE, { withFileTypes: true });
  
  for (const repo of repos) {
    if (repo.isDirectory() && !repo.name.startsWith('.')) {
      console.log(`\nProcessing ${repo.name}...`);
      const repoPath = path.join(REPO_BASE, repo.name);
      await scanDirectory(repoPath, repoPath);
    }
  }
  
  return totalFixed;
}

async function main() {
  console.log('Fixing README paths...\n');
  
  const fixed = await fixReadmePaths();
  
  console.log(`\nTotal files fixed: ${fixed}`);
  console.log('\nDone!');
}

main().catch(console.error);