/**
 * Local Content Cache Service
 * 
 * Provides optimized content serving with caching to avoid repeated file reads
 * and ensure fast response times for the marketing portal
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class LocalContentCache {
  constructor() {
    // In-memory cache for file content
    this.contentCache = new Map();
    
    // Cache metadata to track usage and manage eviction
    this.cacheMetadata = new Map();
    
    // Configuration
    this.maxCacheSize = 100 * 1024 * 1024; // 100MB
    this.maxCacheEntries = 1000;
    this.cacheTimeoutMs = 30 * 60 * 1000; // 30 minutes
    
    // Current cache size in bytes
    this.currentCacheSize = 0;
    
    // File tree cache to avoid repeated directory traversals
    this.fileTreeCache = new Map();
    this.fileTreeCacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Generate cache key for file content
   */
  generateCacheKey(filePath) {
    return crypto.createHash('sha256').update(filePath).digest('hex');
  }

  /**
   * Get file content from cache or disk
   */
  async getFileContent(filePath) {
    const cacheKey = this.generateCacheKey(filePath);
    
    // Check cache first
    if (this.contentCache.has(cacheKey)) {
      const cached = this.contentCache.get(cacheKey);
      const metadata = this.cacheMetadata.get(cacheKey);
      
      // Check if cache is still valid
      if (Date.now() - metadata.timestamp < this.cacheTimeoutMs) {
        // Update last accessed time
        metadata.lastAccessed = Date.now();
        metadata.accessCount++;
        
        return {
          content: cached.content,
          mimeType: cached.mimeType,
          fromCache: true
        };
      } else {
        // Cache expired, remove it
        this.removeFromCache(cacheKey);
      }
    }
    
    // Read from disk
    try {
      const stats = await fs.stat(filePath);
      
      // Don't cache files larger than 10MB
      if (stats.size > 10 * 1024 * 1024) {
        const buffer = await fs.readFile(filePath);
        let content = buffer.toString('utf8');
        
        // Remove BOM if present
        if (content.charCodeAt(0) === 0xFEFF) {
          content = content.slice(1);
        }
        
        // Fix double-encoded UTF-8 emojis
        content = this.fixDoubleEncodedEmojis(content);
        
        return {
          content,
          mimeType: this.getMimeType(filePath),
          fromCache: false
        };
      }
      
      // Read as buffer first to handle encoding issues
      const buffer = await fs.readFile(filePath);
      let content = buffer.toString('utf8');
      
      // Remove BOM if present
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      
      // Fix double-encoded UTF-8 emojis
      content = this.fixDoubleEncodedEmojis(content);
      
      const mimeType = this.getMimeType(filePath);
      
      // Add to cache
      this.addToCache(cacheKey, {
        content,
        mimeType,
        size: stats.size,
        filePath
      });
      
      return {
        content,
        mimeType,
        fromCache: false
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get file tree with caching
   */
  async getFileTree(dirPath, options = {}) {
    const cacheKey = `tree:${dirPath}:${JSON.stringify(options)}`;
    
    // Check cache first
    if (this.fileTreeCache.has(cacheKey)) {
      const cached = this.fileTreeCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.fileTreeCacheTimeout) {
        return {
          tree: cached.tree,
          fromCache: true
        };
      } else {
        this.fileTreeCache.delete(cacheKey);
      }
    }
    
    // Build tree
    const tree = await this.buildFileTree(dirPath, '', options.maxDepth || 5);
    
    // Cache the result
    this.fileTreeCache.set(cacheKey, {
      tree,
      timestamp: Date.now()
    });
    
    // Limit file tree cache size
    if (this.fileTreeCache.size > 50) {
      const oldestKey = this.fileTreeCache.keys().next().value;
      this.fileTreeCache.delete(oldestKey);
    }
    
    return {
      tree,
      fromCache: false
    };
  }

  /**
   * Build file tree recursively
   */
  async buildFileTree(dirPath, basePath = '', maxDepth = 5, currentDepth = 0) {
    if (currentDepth >= maxDepth) {
      return [];
    }

    const items = [];
    
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      // Process entries in parallel for better performance
      const promises = entries.map(async (entry) => {
        // Skip hidden files and common directories
        if (entry.name.startsWith('.') || 
            entry.name === 'node_modules' ||
            entry.name === 'dist' ||
            entry.name === 'build' ||
            entry.name === 'coverage' ||
            entry.name === '__pycache__') {
          return null;
        }

        const fullPath = path.join(dirPath, entry.name);
        const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
          const children = await this.buildFileTree(fullPath, relativePath, maxDepth, currentDepth + 1);
          return {
            name: entry.name,
            path: relativePath,
            type: 'directory',
            children: children
          };
        } else {
          // Include various documentation files
          const ext = path.extname(entry.name).toLowerCase();
          const docExtensions = ['.md', '.mdx', '.txt', '.rst', '.adoc'];
          const docFiles = ['README', 'LICENSE', 'CHANGELOG', 'CONTRIBUTING', 'AUTHORS', 'NOTICE'];
          
          if (docExtensions.includes(ext) || docFiles.includes(entry.name.toUpperCase())) {
            const stats = await fs.stat(fullPath);
            return {
              name: entry.name,
              path: relativePath,
              type: 'file',
              size: stats.size,
              modified: stats.mtime.toISOString()
            };
          }
        }
        
        return null;
      });
      
      const results = await Promise.all(promises);
      items.push(...results.filter(item => item !== null));
      
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

  /**
   * Add content to cache with LRU eviction
   */
  addToCache(cacheKey, data) {
    // Check if we need to evict entries
    if (this.contentCache.size >= this.maxCacheEntries || 
        this.currentCacheSize + data.size > this.maxCacheSize) {
      this.evictLeastRecentlyUsed();
    }
    
    this.contentCache.set(cacheKey, {
      content: data.content,
      mimeType: data.mimeType
    });
    
    this.cacheMetadata.set(cacheKey, {
      size: data.size,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1,
      filePath: data.filePath
    });
    
    this.currentCacheSize += data.size;
  }

  /**
   * Remove entry from cache
   */
  removeFromCache(cacheKey) {
    if (this.cacheMetadata.has(cacheKey)) {
      const metadata = this.cacheMetadata.get(cacheKey);
      this.currentCacheSize -= metadata.size;
      this.contentCache.delete(cacheKey);
      this.cacheMetadata.delete(cacheKey);
    }
  }

  /**
   * Evict least recently used entries
   */
  evictLeastRecentlyUsed() {
    // Sort by last accessed time
    const entries = Array.from(this.cacheMetadata.entries())
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    // Remove oldest 20% of entries
    const toRemove = Math.max(1, Math.floor(entries.length * 0.2));
    
    for (let i = 0; i < toRemove; i++) {
      this.removeFromCache(entries[i][0]);
    }
  }

  /**
   * Fix double-encoded UTF-8 emojis
   * This happens when UTF-8 is interpreted as Latin-1 and re-encoded
   */
  fixDoubleEncodedEmojis(content) {
    // Fix common double-encoded emoji patterns
    // This happens when UTF-8 bytes are interpreted as Latin-1 and re-encoded
    const replacements = [
      // Target emoji
      { pattern: /\xC3\xB0\xC5\xB8\xC5\xBD\xC2\xAF/g, replacement: '🎯' },
      // Rocket emoji  
      { pattern: /\xC3\xB0\xC5\xB8\xC5\xA1\xE2\x82\xAC/g, replacement: '🚀' },
      // Key emoji
      { pattern: /\xC3\xB0\xC5\xB8\xE2\x80\x9D/g, replacement: '🔑' },
      // Chart emoji
      { pattern: /\xC3\xB0\xC5\xB8\xE2\x80\x9C\xC5\xA0/g, replacement: '📊' },
      // Chart increasing emoji
      { pattern: /\xC3\xB0\xC5\xB8\xE2\x80\x9C\xCB\x86/g, replacement: '📈' },
      // Shield emoji
      { pattern: /\xC3\xB0\xC5\xB8\xE2\x80\xBA\xC2\xA1/g, replacement: '🛡' },
      // Wrench emoji
      { pattern: /\xC3\xB0\xC5\xB8\xE2\x80\x9D\xC2\xA7/g, replacement: '🔧' },
      // Lock emoji
      { pattern: /\xC3\xB0\xC5\xB8\xE2\x80\x9D/g, replacement: '🔒' },
      // Generic pattern to catch other common emojis
      { pattern: /ð([^\s]{1,6})/g, replacement: (match) => {
        // Try to fix common patterns
        const emojiMap = {
          '\u00f0\u0178\u017d\u00af': '\uD83C\uDFAF',  // Target
          '\u00f0\u0178\u0161\u20ac': '\uD83D\uDE80',  // Rocket
          '\u00f0\u0178\u201d': '\uD83D\uDD11',  // Key
          '\u00f0\u0178\u201c\u0160': '\uD83D\uDCCA',  // Chart
          '\u00f0\u0178\u201c\u02c6': '\uD83D\uDCC8',  // Chart increasing
          '\u00f0\u0178\u2019\u00a1': '\uD83D\uDCA1',  // Light bulb
          '\u00f0\u0178\u017d\u00ae': '\uD83C\uDFAE',  // Game controller
          '\u00f0\u0178\u203a\u00a1': '\uD83D\uDEE1',  // Shield
          '\u00f0\u0178\u201d': '\uD83D\uDD12',  // Lock
          '\u00f0\u0178\u201d\u00a7': '\uD83D\uDD27',  // Wrench
          '\u00f0\u0178\u203a': '\uD83D\uDEE0',  // Tools
          '\u00f0\u0178\u201c\u0161': '\uD83D\uDCDA',  // Books
          '\u00f0\u0178\u201c\u2013': '\uD83D\uDCD6',  // Book
          '\u00f0\u0178\u201c': '\uD83D\uDCDD',  // Memo
          '\u00f0\u0178\u201c\u2039': '\uD83D\uDCCB',  // Clipboard
          '\u00f0\u0178\u201c\u0152': '\uD83D\uDCCC',  // Pushpin
          '\u00f0\u0178\u201c': '\uD83D\uDCCD',  // Pin
          '\u00f0\u0178\u201c\u017d': '\uD83D\uDCCE',  // Paperclip
          '\u00f0\u0178\u2013\u2021': '\uD83D\uDD87',  // Linked paperclips
          '\u00f0\u0178\u201c': '\uD83D\uDCCF',  // Ruler
          '\u00f0\u0178\u201c': '\uD83D\uDCD0',  // Triangle ruler
          '\u00e2\u0153\u201a': '\u2702',  // Scissors
          '\u00f0\u0178\u2014\u201a': '\uD83D\uDDC2',  // Card index dividers
          '\u00f0\u0178\u2014\u201c': '\uD83D\uDDD3',  // Calendar
          '\u00f0\u0178\u201c\u2026': '\uD83D\uDCC5',  // Calendar
          '\u00f0\u0178\u201c\u2020': '\uD83D\uDCC6',  // Calendar
          '\u00f0\u0178\u2014\u2019': '\uD83D\uDDD2',  // Notepad
          '\u00f0\u0178\u201c\u2021': '\uD83D\uDCC7',  // Card index
          '\u00f0\u0178\u201c\u2030': '\uD83D\uDCC9',  // Chart
          '\u00f0\u0178\u2014\u0192': '\uD83D\uDDC3',  // Card file box
          '\u00f0\u0178\u2014\u201e': '\uD83D\uDDC4',  // File cabinet
          '\u00f0\u0178\u2014\u2018': '\uD83D\uDDD1',  // Wastebasket
        };
        return emojiMap[match] || match;
      }}
    ];

    let fixedContent = content;
    for (const { pattern, replacement } of replacements) {
      if (typeof replacement === 'string') {
        fixedContent = fixedContent.replace(pattern, replacement);
      } else {
        fixedContent = fixedContent.replace(pattern, replacement);
      }
    }
    
    return fixedContent;
  }

  /**
   * Get MIME type based on file extension
   */
  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      // Text formats
      '.md': 'text/markdown',
      '.mdx': 'text/mdx',
      '.txt': 'text/plain',
      '.json': 'application/json',
      '.yaml': 'text/yaml',
      '.yml': 'text/yaml',
      '.xml': 'application/xml',
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.ts': 'text/typescript',
      '.jsx': 'text/jsx',
      '.tsx': 'text/tsx',
      '.css': 'text/css',
      '.proto': 'text/plain',
      '.graphql': 'text/plain',
      '.gql': 'text/plain',
      // Image formats
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.ico': 'image/x-icon',
      // Other formats
      '.pdf': 'application/pdf',
      '.zip': 'application/zip',
      '.tar': 'application/x-tar',
      '.gz': 'application/gzip'
    };

    return mimeTypes[ext] || 'text/plain';
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.contentCache.clear();
    this.cacheMetadata.clear();
    this.fileTreeCache.clear();
    this.currentCacheSize = 0;
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      contentEntries: this.contentCache.size,
      fileTreeEntries: this.fileTreeCache.size,
      totalSize: this.currentCacheSize,
      maxSize: this.maxCacheSize,
      utilizationPercent: Math.round((this.currentCacheSize / this.maxCacheSize) * 100)
    };
  }
}

// Export singleton instance
module.exports = new LocalContentCache();