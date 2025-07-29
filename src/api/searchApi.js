/**
 * Search API Endpoints
 * 
 * Provides server-side search functionality
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Simple in-memory search index
let searchIndex = new Map();

/**
 * Build search index from repositories
 */
const buildSearchIndex = () => {
  const reposPath = path.join(__dirname, '../../cloned-repositories');
  searchIndex.clear();
  
  if (!fs.existsSync(reposPath)) {
    return;
  }

  const repos = fs.readdirSync(reposPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'));

  repos.forEach(repo => {
    const repoPath = path.join(reposPath, repo.name);
    
    // Index repository
    searchIndex.set(`repo:${repo.name}`, {
      type: 'repository',
      repository: repo.name,
      title: repo.name,
      content: repo.name,
      path: ''
    });

    // Index README
    const readmePath = path.join(repoPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      try {
        const content = fs.readFileSync(readmePath, 'utf8');
        searchIndex.set(`file:${repo.name}/README.md`, {
          type: 'file',
          repository: repo.name,
          title: 'README.md',
          content: content.substring(0, 1000), // First 1000 chars
          path: 'README.md'
        });
      } catch (error) {
        console.error(`Error reading README for ${repo.name}:`, error);
      }
    }

    // Index API specs
    indexApiSpecs(repo.name, repoPath);
  });

  console.log(`Search index built with ${searchIndex.size} entries`);
};

/**
 * Index API specifications
 */
const indexApiSpecs = (repoName, repoPath) => {
  const patterns = [
    { pattern: /\.(yaml|yml|json)$/i, type: 'rest' },
    { pattern: /\.(graphql|gql)$/i, type: 'graphql' },
    { pattern: /\.proto$/i, type: 'grpc' }
  ];

  const searchDir = (dir) => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(repoPath, fullPath);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          searchDir(fullPath);
        } else if (entry.isFile()) {
          patterns.forEach(({ pattern, type }) => {
            if (pattern.test(entry.name)) {
              searchIndex.set(`api:${repoName}/${relativePath}`, {
                type: 'api',
                repository: repoName,
                title: entry.name,
                content: '',
                path: relativePath,
                apiType: type
              });
            }
          });
        }
      });
    } catch (error) {
      // Ignore errors
    }
  };

  searchDir(repoPath);
};

/**
 * Search endpoint
 */
router.post('/search', (req, res) => {
  const { query, scope = 'all', filters = {}, limit = 20, offset = 0 } = req.body;

  if (!query) {
    return res.json({
      query: '',
      results: [],
      totalCount: 0,
      facets: {
        repositories: [],
        languages: [],
        apiTypes: [],
        fileTypes: [],
        topics: []
      },
      executionTime: 0
    });
  }

  const startTime = Date.now();
  const queryLower = query.toLowerCase();
  const results = [];

  // Simple search implementation
  for (const [id, entry] of searchIndex) {
    // Check scope
    if (scope !== 'all') {
      if (scope === 'repositories' && entry.type !== 'repository') continue;
      if (scope === 'documentation' && entry.type !== 'file') continue;
      if (scope === 'apis' && entry.type !== 'api') continue;
    }

    // Apply filters
    if (filters.repositories?.length && !filters.repositories.includes(entry.repository)) {
      continue;
    }

    // Search in title and content
    const searchText = `${entry.title} ${entry.content}`.toLowerCase();
    if (searchText.includes(queryLower)) {
      results.push({
        id,
        type: entry.type,
        title: entry.title,
        repository: entry.repository,
        path: entry.path,
        score: entry.title.toLowerCase().includes(queryLower) ? 10 : 5,
        highlights: [],
        metadata: entry.apiType ? { apiType: entry.apiType } : {}
      });
    }
  }

  // Sort by score
  results.sort((a, b) => b.score - a.score);

  // Build facets
  const facets = {
    repositories: [],
    languages: [],
    apiTypes: [],
    fileTypes: [],
    topics: []
  };

  const repoCount = new Map();
  const apiTypeCount = new Map();

  results.forEach(result => {
    // Repository facet
    repoCount.set(result.repository, (repoCount.get(result.repository) || 0) + 1);
    
    // API type facet
    if (result.metadata?.apiType) {
      apiTypeCount.set(result.metadata.apiType, (apiTypeCount.get(result.metadata.apiType) || 0) + 1);
    }
  });

  facets.repositories = Array.from(repoCount.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);

  facets.apiTypes = Array.from(apiTypeCount.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);

  // Apply pagination
  const paginatedResults = results.slice(offset, offset + limit);

  res.json({
    query,
    results: paginatedResults,
    totalCount: results.length,
    facets,
    suggestions: [],
    executionTime: Date.now() - startTime
  });
});

/**
 * Search suggestions endpoint
 */
router.get('/search/suggestions', (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    return res.json([]);
  }

  const suggestions = new Set();
  const queryLower = q.toLowerCase();

  for (const [_, entry] of searchIndex) {
    if (entry.title.toLowerCase().startsWith(queryLower)) {
      suggestions.add(entry.title);
      if (suggestions.size >= 5) break;
    }
  }

  res.json(Array.from(suggestions));
});

/**
 * Rebuild search index endpoint
 */
router.post('/search/rebuild', (req, res) => {
  buildSearchIndex();
  res.json({ 
    message: 'Search index rebuilt',
    entries: searchIndex.size 
  });
});

// Build initial index
buildSearchIndex();

module.exports = router;