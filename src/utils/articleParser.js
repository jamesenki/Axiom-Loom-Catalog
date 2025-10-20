const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

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

  // Extract excerpt (first paragraph after title)
  const excerptMatch = content.match(/^(?:#{1,6}\s+.+\n+)*(.+?)(?:\n\n|$)/m);
  const excerpt = data.excerpt || data.summary || (excerptMatch ? excerptMatch[1] : '');

  // Determine category from file path
  const pathParts = filePath.split(path.sep);
  const categoryIndex = pathParts.indexOf('articles') + 1;
  const category = pathParts[categoryIndex] || 'uncategorized';

  // Extract slug from filename
  const slug = path.basename(filePath, '.md');

  return {
    slug,
    title,
    excerpt: excerpt.substring(0, 200) + (excerpt.length > 200 ? '...' : ''),
    category,
    tags: data.tags || [],
    date: data.date || data.published || null,
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
