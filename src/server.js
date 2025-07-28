/**
 * Express Server for EYNS AI Experience Center
 * Provides API endpoints for repository management and dynamic API detection
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dynamicApiRoutes = require('./api/dynamicApiDetection');
const repositoryManagementRoutes = require('./api/repositoryManagement');
const repositoryFilesRoutes = require('./api/repositoryFiles');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', dynamicApiRoutes);
app.use('/api', repositoryManagementRoutes);
app.use('/api', repositoryFilesRoutes);

// Repository details endpoint
app.get('/api/repository/:repoName', (req, res) => {
  const { repoName } = req.params;
  const reposPath = path.join(__dirname, '../cloned-repositories');
  const repoPath = path.join(reposPath, repoName);
  
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: 'Repository not found' });
  }
  
  try {
    // Read repository metadata if available
    const readmePath = path.join(repoPath, 'README.md');
    const packageJsonPath = path.join(repoPath, 'package.json');
    
    let description = '';
    let topics = [];
    let language = '';
    
    // Try to get description from README
    if (fs.existsSync(readmePath)) {
      const readmeContent = fs.readFileSync(readmePath, 'utf8');
      const descMatch = readmeContent.match(/^#.*\n\n(.+)/m);
      if (descMatch) {
        description = descMatch[1].trim();
      }
    }
    
    // Try to get info from package.json
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.description) {
        description = packageJson.description;
      }
      if (packageJson.keywords) {
        topics = packageJson.keywords;
      }
      language = 'JavaScript';
    }
    
    // Get last modified time
    const stats = fs.statSync(repoPath);
    
    res.json({
      name: repoName,
      description,
      language,
      topics,
      updated_at: stats.mtime,
      default_branch: 'main',
      stargazers_count: 0,
      forks_count: 0
    });
    
  } catch (error) {
    console.error('Error fetching repository details:', error);
    res.status(500).json({ error: 'Failed to fetch repository details' });
  }
});

// Static files (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`EYNS AI Experience Center backend running on port ${PORT}`);
  });
}

module.exports = app;