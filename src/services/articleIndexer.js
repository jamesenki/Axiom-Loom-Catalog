const fs = require('fs');
const path = require('path');
const { parseArticle } = require('../utils/articleParser');

/**
 * Category definitions with display names
 */
const CATEGORIES = {
  'organizational-foundations': {
    name: 'Organizational Foundations',
    description: 'Building effective engineering organizations and culture',
    order: 1
  },
  'practices-and-principles': {
    name: 'Practices & Principles',
    description: 'Core methodologies and frameworks for software delivery',
    order: 2
  },
  'technical-practices': {
    name: 'Technical Practices',
    description: 'Engineering practices that enable quality and velocity',
    order: 3
  },
  'team-structures': {
    name: 'Team Structures',
    description: 'Organizing teams for flow and autonomy',
    order: 4
  },
  'capability-building': {
    name: 'Capability Building',
    description: 'Growing skills and knowledge in engineering teams',
    order: 5
  },
  'technical-showcase': {
    name: 'Technical Showcase',
    description: 'Deep dives into specific technical implementations',
    order: 6
  }
};

/**
 * Check if a filename should be excluded from article indexing
 * @param {string} filename - Name of the file
 * @returns {boolean} True if file should be excluded
 */
function shouldExcludeFile(filename) {
  const exclusionPatterns = [
    'README.md',
    /^SESSION_CONTEXT/i,  // Session context logs
    /^CONTEXT_/i,          // Context files
    /^\./,                 // Hidden files
  ];

  return exclusionPatterns.some(pattern => {
    if (typeof pattern === 'string') {
      return filename === pattern;
    }
    return pattern.test(filename);
  });
}

/**
 * Recursively find all markdown files in directory
 * @param {string} dir - Directory to scan
 * @returns {string[]} Array of file paths
 */
function findMarkdownFiles(dir) {
  const files = [];

  function scan(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md') && !shouldExcludeFile(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  scan(dir);
  return files;
}

/**
 * Build article index from all markdown files
 * @param {string} articlesPath - Root path to articles directory
 * @returns {object} Indexed articles by category
 */
function buildArticleIndex(articlesPath) {
  const markdownFiles = findMarkdownFiles(articlesPath);
  const index = {
    categories: CATEGORIES,
    articles: [],
    byCategory: {},
    bySlug: {}
  };

  // Initialize category buckets
  Object.keys(CATEGORIES).forEach(cat => {
    index.byCategory[cat] = [];
  });

  // Parse each article
  for (const filePath of markdownFiles) {
    try {
      const article = parseArticle(filePath);

      // Add to main list
      index.articles.push(article);

      // Add to category bucket
      if (index.byCategory[article.category]) {
        index.byCategory[article.category].push(article);
      } else {
        // Handle uncategorized
        if (!index.byCategory.uncategorized) {
          index.byCategory.uncategorized = [];
        }
        index.byCategory.uncategorized.push(article);
      }

      // Add to slug lookup
      index.bySlug[article.slug] = article;

    } catch (error) {
      console.error(`Failed to parse article: ${filePath}`, error);
    }
  }

  // Sort articles by date (newest first) within each category
  for (const category in index.byCategory) {
    index.byCategory[category].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });
  }

  return index;
}

module.exports = { buildArticleIndex, CATEGORIES };
