const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const CLONED_REPOS_PATH = path.join(__dirname, '../../cloned-repositories');

/**
 * Get file tree for a repository
 */
router.get('/repository/:repoName/files', async (req, res) => {
  const { repoName } = req.params;
  const repoPath = path.join(CLONED_REPOS_PATH, repoName);

  try {
    const fileTree = await buildFileTree(repoPath);
    res.json(fileTree);
  } catch (error) {
    console.error('Error building file tree:', error);
    res.status(500).json({ error: 'Failed to fetch file tree' });
  }
});

/**
 * Get file content
 */
router.get('/repository/:repoName/file', async (req, res) => {
  const { repoName } = req.params;
  const { path: filePath } = req.query;
  
  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  const fullPath = path.join(CLONED_REPOS_PATH, repoName, filePath);
  
  // Security check: ensure the path is within the repository directory
  const normalizedPath = path.normalize(fullPath);
  const repoBasePath = path.normalize(path.join(CLONED_REPOS_PATH, repoName));
  
  if (!normalizedPath.startsWith(repoBasePath)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const content = await fs.readFile(fullPath, 'utf8');
    res.type('text/plain').send(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'File not found' });
    } else {
      console.error('Error reading file:', error);
      res.status(500).json({ error: 'Failed to read file' });
    }
  }
});

/**
 * Build file tree structure recursively
 */
async function buildFileTree(dirPath, basePath = '', maxDepth = 5, currentDepth = 0) {
  if (currentDepth >= maxDepth) {
    return [];
  }

  const items = [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      // Skip hidden files and common directories
      if (entry.name.startsWith('.') || 
          entry.name === 'node_modules' ||
          entry.name === 'dist' ||
          entry.name === 'build' ||
          entry.name === 'coverage' ||
          entry.name === '__pycache__') {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        const children = await buildFileTree(fullPath, relativePath, maxDepth, currentDepth + 1);
        items.push({
          name: entry.name,
          path: relativePath,
          type: 'directory',
          children: children
        });
      } else {
        // Only include markdown files and certain other documentation files
        const ext = path.extname(entry.name).toLowerCase();
        if (ext === '.md' || 
            ext === '.mdx' || 
            entry.name === 'README' ||
            entry.name === 'LICENSE' ||
            entry.name === 'CHANGELOG' ||
            entry.name === 'CONTRIBUTING') {
          items.push({
            name: entry.name,
            path: relativePath,
            type: 'file'
          });
        }
      }
    }
    
    // Sort: directories first, then files, alphabetically within each group
    items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    
    return items;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
}

module.exports = router;