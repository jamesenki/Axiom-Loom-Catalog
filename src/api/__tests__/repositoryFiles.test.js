// Fix for setImmediate not defined in test environment
if (typeof setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = require('../repositoryFiles');

// Mock fs module
jest.mock('fs');

const app = express();
app.use('/api', router);

describe('Repository Files API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/repository/:repoName/files', () => {
    it('returns file tree for valid repository', async () => {
      const mockFiles = [
        {
          name: 'README.md',
          type: 'file',
          path: 'README.md'
        },
        {
          name: 'docs',
          type: 'directory',
          children: [
            {
              name: 'guide.md',
              type: 'file',
              path: 'docs/guide.md'
            }
          ]
        }
      ];

      // Mock fs.existsSync
      fs.existsSync.mockReturnValue(true);
      
      // Mock fs.readdirSync
      fs.readdirSync.mockImplementation((dir) => {
        if (dir.includes('test-repo')) {
          return ['README.md', 'docs'];
        }
        if (dir.includes('docs')) {
          return ['guide.md'];
        }
        return [];
      });

      // Mock fs.statSync
      fs.statSync.mockImplementation((filePath) => ({
        isDirectory: () => filePath.includes('docs'),
        isFile: () => !filePath.includes('docs')
      }));

      const response = await request(app)
        .get('/api/repository/test-repo/files')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('returns 404 for non-existent repository', async () => {
      fs.existsSync.mockReturnValue(false);

      const response = await request(app)
        .get('/api/repository/non-existent/files')
        .expect(404);

      expect(response.body).toEqual({
        error: 'Repository not found'
      });
    });

    it('filters out hidden files and node_modules', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue(['.git', 'node_modules', 'README.md', '.DS_Store']);
      fs.statSync.mockImplementation((filePath) => ({
        isDirectory: () => filePath.includes('node_modules') || filePath.includes('.git'),
        isFile: () => filePath.includes('.md') || filePath.includes('.DS_Store')
      }));

      const response = await request(app)
        .get('/api/repository/test-repo/files')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('README.md');
    });

    it('handles filesystem errors gracefully', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const response = await request(app)
        .get('/api/repository/test-repo/files')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to read repository files'
      });
    });
  });

  describe('GET /api/repository/:repoName/file', () => {
    it('returns file content for valid file', async () => {
      const mockContent = '# Test README\n\nThis is test content.';
      
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockContent);
      fs.statSync.mockReturnValue({
        isFile: () => true,
        isDirectory: () => false
      });

      const response = await request(app)
        .get('/api/repository/test-repo/file')
        .query({ path: 'README.md' })
        .expect(200);

      expect(response.text).toBe(mockContent);
      expect(response.headers['content-type']).toMatch(/text\/plain/);
    });

    it('returns 400 when path parameter is missing', async () => {
      const response = await request(app)
        .get('/api/repository/test-repo/file')
        .expect(400);

      expect(response.body).toEqual({
        error: 'File path is required'
      });
    });

    it('returns 404 for non-existent file', async () => {
      fs.existsSync.mockReturnValue(false);

      const response = await request(app)
        .get('/api/repository/test-repo/file')
        .query({ path: 'non-existent.md' })
        .expect(404);

      expect(response.body).toEqual({
        error: 'File not found'
      });
    });

    it('prevents directory traversal attacks', async () => {
      const response = await request(app)
        .get('/api/repository/test-repo/file')
        .query({ path: '../../../etc/passwd' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid file path'
      });
    });

    it('returns 403 for directory paths', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.statSync.mockReturnValue({
        isFile: () => false,
        isDirectory: () => true
      });

      const response = await request(app)
        .get('/api/repository/test-repo/file')
        .query({ path: 'docs' })
        .expect(403);

      expect(response.body).toEqual({
        error: 'Cannot read directory as file'
      });
    });

    it('handles file read errors gracefully', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.statSync.mockReturnValue({
        isFile: () => true,
        isDirectory: () => false
      });
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const response = await request(app)
        .get('/api/repository/test-repo/file')
        .query({ path: 'README.md' })
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to read file'
      });
    });

    it('handles special characters in file paths', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.statSync.mockReturnValue({
        isFile: () => true,
        isDirectory: () => false
      });
      fs.readFileSync.mockReturnValue('Content of file with spaces');

      const response = await request(app)
        .get('/api/repository/test-repo/file')
        .query({ path: 'docs/my file with spaces.md' })
        .expect(200);

      expect(response.text).toBe('Content of file with spaces');
    });
  });

  describe('File tree building', () => {
    it('correctly builds nested file tree structure', async () => {
      fs.existsSync.mockReturnValue(true);
      
      // Mock complex directory structure
      fs.readdirSync.mockImplementation((dir) => {
        if (dir.endsWith('test-repo')) {
          return ['README.md', 'src', 'docs'];
        }
        if (dir.endsWith('src')) {
          return ['index.js', 'components'];
        }
        if (dir.endsWith('components')) {
          return ['App.js', 'Header.js'];
        }
        if (dir.endsWith('docs')) {
          return ['guide.md', 'api.md'];
        }
        return [];
      });

      fs.statSync.mockImplementation((filePath) => ({
        isDirectory: () => filePath.includes('src') || filePath.includes('components') || filePath.includes('docs'),
        isFile: () => filePath.endsWith('.md') || filePath.endsWith('.js')
      }));

      const response = await request(app)
        .get('/api/repository/test-repo/files')
        .expect(200);

      // Verify structure
      expect(response.body).toHaveLength(3); // README.md, src, docs
      
      const srcDir = response.body.find(item => item.name === 'src');
      expect(srcDir.type).toBe('directory');
      expect(srcDir.children).toHaveLength(2); // index.js, components
      
      const componentsDir = srcDir.children.find(item => item.name === 'components');
      expect(componentsDir.children).toHaveLength(2); // App.js, Header.js
    });
  });
});