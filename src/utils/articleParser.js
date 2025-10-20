const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Category display names mapping
const CATEGORY_NAMES = {
  'organizational-foundations': 'Organizational Foundations',
  'practices-and-principles': 'Practices & Principles',
  'technical-practices': 'Technical Practices',
  'team-structures': 'Team Structures',
  'capability-building': 'Capability Building',
  'technical-showcase': 'Technical Showcase'
};

/**
 * Parse article markdown file and extract metadata
 * @param {string} filePath - Full path to markdown file
 * @returns {object} Article metadata and content
 */
function parseArticle(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Extract title from first H1 if not in frontmatter
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = data.title || (titleMatch ? titleMatch[1] : path.basename(filePath, '.md'));

  // Extract excerpt - skip "Published: [TBD]" and similar lines
  let excerpt = data.excerpt || data.summary || '';

  if (!excerpt) {
    // Find first substantial paragraph that isn't metadata
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip empty lines, headers, and metadata lines
      if (trimmed &&
          !trimmed.startsWith('#') &&
          !trimmed.startsWith('**Published**') &&
          !trimmed.startsWith('**Updated**') &&
          !trimmed.startsWith('**Reading Time**') &&
          !trimmed.startsWith('**Category**') &&
          trimmed.length > 50) {
        excerpt = trimmed;
        break;
      }
    }
  }

  // Determine category from file path
  const pathParts = filePath.split(path.sep);
  const categoryIndex = pathParts.indexOf('articles') + 1;
  const category = pathParts[categoryIndex] || 'uncategorized';
  const categoryName = CATEGORY_NAMES[category] || category;

  // Extract slug from filename
  const slug = path.basename(filePath, '.md');

  // Use today's date if no date is provided
  const today = new Date().toISOString().split('T')[0];
  const articleDate = data.date || data.published || today;

  return {
    slug,
    title,
    excerpt: excerpt.substring(0, 200) + (excerpt.length > 200 ? '...' : ''),
    category,
    categoryName,
    tags: data.tags || [],
    date: articleDate,
    readingTime: data.readingTime || estimateReadingTime(content),
    content,
    filePath
  };
}

/**
 * Estimate reading time in minutes
 * @param {string} content - Article content
 * @returns {number} Estimated reading time
 */
function estimateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

module.exports = { parseArticle, estimateReadingTime };
