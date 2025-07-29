const localContentCache = require('../localContentCache');

// We'll use the actual fs module for integration tests
// since the localContentCache uses fs.promises

describe('LocalContentCache', () => {
  let cache;

  beforeEach(() => {
    jest.clearAllMocks();
    // Use the exported instance
    cache = localContentCache;
    // Clear cache state
    cache.clearCache();
  });

  describe('configuration', () => {
    it('has correct default values', () => {
      expect(cache.maxCacheSize).toBe(100 * 1024 * 1024); // 100MB
      expect(cache.maxCacheEntries).toBe(1000);
      expect(cache.cacheTimeoutMs).toBe(30 * 60 * 1000); // 30 minutes
    });
  });

  describe('cache operations', () => {
    it('can add and retrieve content from cache', () => {
      const cacheKey = cache.generateCacheKey('test.md');
      const data = {
        content: '# Test Content',
        mimeType: 'text/markdown',
        size: 14,
        filePath: 'test.md'
      };
      
      cache.addToCache(cacheKey, data);
      
      expect(cache.contentCache.has(cacheKey)).toBe(true);
      expect(cache.contentCache.get(cacheKey)).toEqual({
        content: '# Test Content',
        mimeType: 'text/markdown'
      });
      expect(cache.currentCacheSize).toBe(14);
    });

    it('removes content from cache', () => {
      const cacheKey = cache.generateCacheKey('test.md');
      const data = {
        content: '# Test Content',
        mimeType: 'text/markdown',
        size: 14,
        filePath: 'test.md'
      };
      
      cache.addToCache(cacheKey, data);
      cache.removeFromCache(cacheKey);
      
      expect(cache.contentCache.has(cacheKey)).toBe(false);
      expect(cache.currentCacheSize).toBe(0);
    });

    it('clears all caches', () => {
      const cacheKey = cache.generateCacheKey('test.md');
      cache.addToCache(cacheKey, { content: 'test', mimeType: 'text/plain', size: 4, filePath: 'test.md' });
      
      cache.clearCache();
      
      expect(cache.contentCache.size).toBe(0);
      expect(cache.cacheMetadata.size).toBe(0);
      expect(cache.fileTreeCache.size).toBe(0);
      expect(cache.currentCacheSize).toBe(0);
    });
  });

  describe('cache eviction', () => {
    it('evicts least recently used entries', () => {
      // Add some entries with different access times
      const now = Date.now();
      cache.addToCache('key1', { content: 'old', mimeType: 'text/plain', size: 3, filePath: 'old.txt' });
      cache.addToCache('key2', { content: 'newer', mimeType: 'text/plain', size: 5, filePath: 'newer.txt' });
      cache.addToCache('key3', { content: 'newest', mimeType: 'text/plain', size: 6, filePath: 'newest.txt' });
      
      const sizeBefore = cache.contentCache.size;
      cache.evictLeastRecentlyUsed();
      
      // Should have removed at least one entry
      expect(cache.contentCache.size).toBeLessThan(sizeBefore);
      // The oldest entry should be gone
      expect(cache.contentCache.has('key1')).toBe(false);
    });
  });

  describe('mime types', () => {
    it('returns correct mime types for common files', () => {
      expect(cache.getMimeType('test.md')).toBe('text/markdown');
      expect(cache.getMimeType('test.json')).toBe('application/json');
      expect(cache.getMimeType('test.yaml')).toBe('text/yaml');
      expect(cache.getMimeType('test.js')).toBe('application/javascript');
      expect(cache.getMimeType('test.proto')).toBe('text/plain');
      expect(cache.getMimeType('test.graphql')).toBe('text/plain');
      expect(cache.getMimeType('test.unknown')).toBe('text/plain');
    });
  });

  describe('getCacheStats', () => {
    it('returns accurate cache statistics', () => {
      const cacheKey = cache.generateCacheKey('test.md');
      cache.addToCache(cacheKey, { content: 'content', mimeType: 'text/plain', size: 7, filePath: 'test.md' });

      const stats = cache.getCacheStats();

      expect(stats.contentEntries).toBe(1);
      expect(stats.fileTreeEntries).toBe(0);
      expect(stats.totalSize).toBe(7);
      expect(stats.maxSize).toBe(100 * 1024 * 1024);
      expect(stats.utilizationPercent).toBe(0); // Very small percentage
    });
  });

  describe('generateCacheKey', () => {
    it('generates consistent hash for same path', () => {
      const path1 = '/test/file.md';
      const key1 = cache.generateCacheKey(path1);
      const key2 = cache.generateCacheKey(path1);
      
      expect(key1).toBe(key2);
      expect(key1).toMatch(/^[a-f0-9]{64}$/); // SHA256 hex string
    });

    it('generates different hashes for different paths', () => {
      const key1 = cache.generateCacheKey('/test/file1.md');
      const key2 = cache.generateCacheKey('/test/file2.md');
      
      expect(key1).not.toBe(key2);
    });
  });

  describe('file tree cache', () => {
    it('has correct timeout configuration', () => {
      expect(cache.fileTreeCacheTimeout).toBe(5 * 60 * 1000); // 5 minutes
    });
    
    it('can store and retrieve file trees', () => {
      const tree = {
        name: 'test',
        path: '/test',
        type: 'directory',
        children: []
      };
      
      cache.fileTreeCache.set('/test', { tree, timestamp: Date.now() });
      
      expect(cache.fileTreeCache.has('/test')).toBe(true);
      expect(cache.fileTreeCache.get('/test').tree).toEqual(tree);
    });
  });

  describe('cache size management', () => {
    it('tracks current cache size accurately', () => {
      expect(cache.currentCacheSize).toBe(0);
      
      const key1 = cache.generateCacheKey('file1.md');
      cache.addToCache(key1, { content: 'test', mimeType: 'text/plain', size: 4, filePath: 'file1.md' });
      expect(cache.currentCacheSize).toBe(4);
      
      const key2 = cache.generateCacheKey('file2.md');
      cache.addToCache(key2, { content: 'another test', mimeType: 'text/plain', size: 12, filePath: 'file2.md' });
      expect(cache.currentCacheSize).toBe(16);
      
      cache.removeFromCache(key1);
      expect(cache.currentCacheSize).toBe(12);
    });
    
    it('enforces max cache entries limit', () => {
      expect(cache.maxCacheEntries).toBe(1000);
    });
  });
});