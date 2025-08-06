const fs = require('fs').promises;
const path = require('path');

const REPO_DIR = path.join(__dirname, '../cloned-repositories/future-mobility-consumer-platform');

async function findBrokenLinks() {
  const brokenLinks = [];
  
  async function scanFile(filePath) {
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
          
          // Resolve the link path
          const fileDir = path.dirname(filePath);
          let targetPath;
          
          if (linkPath.startsWith('./')) {
            targetPath = path.join(fileDir, linkPath.substring(2));
          } else if (linkPath.startsWith('../')) {
            targetPath = path.join(fileDir, linkPath);
          } else if (linkPath.startsWith('/')) {
            targetPath = path.join(REPO_DIR, linkPath);
          } else {
            targetPath = path.join(fileDir, linkPath);
          }
          
          // Check if file exists
          try {
            await fs.access(targetPath);
          } catch {
            brokenLinks.push({
              file: path.relative(REPO_DIR, filePath),
              line: i + 1,
              linkText,
              linkPath,
              targetPath: path.relative(REPO_DIR, targetPath)
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error reading ${filePath}: ${error}`);
    }
  }
  
  async function scanDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        await scanFile(fullPath);
      }
    }
  }
  
  await scanDirectory(REPO_DIR);
  return brokenLinks;
}

async function main() {
  console.log('Scanning for broken links in future-mobility-consumer-platform...');
  const brokenLinks = await findBrokenLinks();
  
  console.log(`\nFound ${brokenLinks.length} broken links:\n`);
  
  // Group by file
  const linksByFile = {};
  for (const link of brokenLinks) {
    if (!linksByFile[link.file]) {
      linksByFile[link.file] = [];
    }
    linksByFile[link.file].push(link);
  }
  
  // Print results
  for (const [file, links] of Object.entries(linksByFile)) {
    console.log(`\n${file}:`);
    for (const link of links) {
      console.log(`  Line ${link.line}: [${link.linkText}](${link.linkPath}) -> ${link.targetPath}`);
    }
  }
  
  // Save to JSON
  await fs.writeFile(
    path.join(__dirname, '../broken-links-future-mobility.json'),
    JSON.stringify(brokenLinks, null, 2)
  );
  
  console.log('\nResults saved to broken-links-future-mobility.json');
}

main().catch(console.error);