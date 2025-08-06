const fs = require('fs');
const path = require('path');

function detectPostmanCollections(repoPath) {
  const collections = [];
  
  function searchDirectory(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          searchDirectory(path.join(dir, entry.name));
        } else if (entry.isFile()) {
          const fileName = entry.name.toLowerCase();
          if (fileName.includes('postman') && fileName.endsWith('.json')) {
            const filePath = path.join(dir, entry.name);
            const relativePath = path.relative(repoPath, filePath);
            
            console.log(`  Found Postman file: ${relativePath}`);
            
            try {
              const content = fs.readFileSync(filePath, 'utf8');
              const collection = JSON.parse(content);
              
              if (collection.info && collection.item) {
                collections.push({
                  file: relativePath,
                  name: collection.info.name || 'Postman Collection',
                  path: relativePath
                });
                console.log(`    ✓ Valid collection: ${collection.info.name}`);
              } else {
                console.log(`    ✗ Not a valid collection (missing info or item)`);
              }
            } catch (error) {
              console.log(`    ✗ Error parsing: ${error.message}`);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error searching directory ${dir}:`, error);
    }
  }
  
  searchDirectory(repoPath);
  return collections;
}

// Test specific repositories
const testRepos = [
  'velocityforge-sdv-platform-architecture',
  'rentalFleets',
  'cloudtwin-simulation-platform-architecture'
];

const CLONED_REPOS_PATH = path.join(__dirname, 'cloned-repositories');

testRepos.forEach(repo => {
  console.log(`\nTesting ${repo}:`);
  const repoPath = path.join(CLONED_REPOS_PATH, repo);
  const collections = detectPostmanCollections(repoPath);
  console.log(`Total valid collections found: ${collections.length}`);
});