const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const REPO_BASE = path.join(__dirname, '../cloned-repositories');
const API_BASE = 'http://localhost:3000';

async function quickLinkCheck() {
  const brokenLinks = [];
  let totalLinks = 0;
  
  async function scanFile(filePath, repoName) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        
        while ((match = linkRegex.exec(line)) !== null) {
          const linkText = match[1];
          const linkPath = match[2];
          
          // Skip external links and anchors
          if (linkPath.startsWith('http') || linkPath.startsWith('#')) continue;
          
          totalLinks++;
          
          // Resolve the link path
          const fileDir = path.dirname(filePath);
          const repoDir = path.join(REPO_BASE, repoName);
          let targetPath;
          
          if (linkPath.startsWith('./')) {
            targetPath = path.join(fileDir, linkPath.substring(2));
          } else if (linkPath.startsWith('../')) {
            targetPath = path.join(fileDir, linkPath);
          } else if (linkPath.startsWith('/')) {
            targetPath = path.join(repoDir, linkPath);
          } else {
            targetPath = path.join(fileDir, linkPath);
          }
          
          // Check if file exists
          try {
            await fs.access(targetPath);
          } catch {
            brokenLinks.push({
              repo: repoName,
              file: path.relative(repoDir, filePath),
              line: i + 1,
              linkText,
              linkPath,
              targetPath: path.relative(repoDir, targetPath)
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error reading ${filePath}: ${error}`);
    }
  }
  
  async function scanDirectory(dir, repoName) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await scanDirectory(fullPath, repoName);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        await scanFile(fullPath, repoName);
      }
    }
  }
  
  // Get all repositories
  const repos = await fs.readdir(REPO_BASE, { withFileTypes: true });
  
  for (const repo of repos) {
    if (repo.isDirectory() && !repo.name.startsWith('.')) {
      process.stdout.write(`Checking ${repo.name}... `);
      const repoPath = path.join(REPO_BASE, repo.name);
      await scanDirectory(repoPath, repo.name);
      console.log('done');
    }
  }
  
  return { totalLinks, brokenLinks };
}

async function main() {
  console.log('Running quick link validation...\n');
  
  const { totalLinks, brokenLinks } = await quickLinkCheck();
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('LINK VALIDATION SUMMARY');
  console.log(`${'='.repeat(80)}`);
  console.log(`Total links checked: ${totalLinks}`);
  console.log(`Valid links: ${totalLinks - brokenLinks.length}`);
  console.log(`Broken links: ${brokenLinks.length}`);
  console.log(`Success rate: ${((totalLinks - brokenLinks.length) / totalLinks * 100).toFixed(2)}%`);
  
  if (brokenLinks.length > 0) {
    console.log(`\n${'='.repeat(80)}`);
    console.log('REMAINING BROKEN LINKS');
    console.log(`${'='.repeat(80)}`);
    
    const linksByRepo = {};
    for (const link of brokenLinks) {
      if (!linksByRepo[link.repo]) {
        linksByRepo[link.repo] = [];
      }
      linksByRepo[link.repo].push(link);
    }
    
    for (const [repo, links] of Object.entries(linksByRepo)) {
      console.log(`\n${repo}: ${links.length} broken links`);
      for (const link of links.slice(0, 5)) {
        console.log(`  ${link.file}:${link.line} - [${link.linkText}](${link.linkPath})`);
      }
      if (links.length > 5) {
        console.log(`  ... and ${links.length - 5} more`);
      }
    }
  }
  
  // Save detailed report
  await fs.writeFile(
    path.join(__dirname, '../final-link-report.json'),
    JSON.stringify({ totalLinks, brokenLinks }, null, 2)
  );
  
  console.log('\nDetailed report saved to: final-link-report.json');
}

main().catch(console.error);