const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const localContentCache = require('./localContentCache');

const CLONED_REPOS_PATH = path.join(__dirname, '../../cloned-repositories');

/**
 * Get file tree for a repository
 */
router.get('/repository/:repoName/files', async (req, res) => {
  const { repoName } = req.params;
  const repoPath = path.join(CLONED_REPOS_PATH, repoName);

  try {
    // Check if repository exists
    await fs.access(repoPath);
    
    // Use cached file tree
    const { tree, fromCache } = await localContentCache.getFileTree(repoPath);
    
    // Set cache headers
    res.set({
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      'X-Content-From-Cache': fromCache.toString()
    });
    
    res.json(tree);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Repository not found' });
    } else {
      console.error('Error building file tree:', error);
      res.status(500).json({ error: 'Failed to fetch file tree' });
    }
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
    // Use cached content
    const { content, mimeType, fromCache } = await localContentCache.getFileContent(fullPath);
    
    // Set appropriate headers
    res.set({
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'X-Content-From-Cache': fromCache.toString()
    });
    
    res.send(content);
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
 * Get cache statistics endpoint
 */
router.get('/cache/stats', (req, res) => {
  const stats = localContentCache.getCacheStats();
  res.json(stats);
});

/**
 * Clear cache endpoint (for admin use)
 */
router.post('/cache/clear', (req, res) => {
  localContentCache.clearCache();
  res.json({ message: 'Cache cleared successfully' });
});

/**
 * Get raw file content (bypasses text processing)
 */
router.get('/repository/:repoName/raw', async (req, res) => {
  const { repoName } = req.params;
  const { path: filePath } = req.query;
  
  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  const fullPath = path.join(CLONED_REPOS_PATH, repoName, filePath);
  
  // Security check
  const normalizedPath = path.normalize(fullPath);
  const repoBasePath = path.normalize(path.join(CLONED_REPOS_PATH, repoName));
  
  if (!normalizedPath.startsWith(repoBasePath)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    // Stream file for large files
    const stats = await fs.stat(fullPath);
    
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Length': stats.size,
      'Cache-Control': 'public, max-age=3600'
    });
    
    const stream = require('fs').createReadStream(fullPath);
    stream.pipe(res);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'File not found' });
    } else {
      console.error('Error streaming file:', error);
      res.status(500).json({ error: 'Failed to read file' });
    }
  }
});

module.exports = router;