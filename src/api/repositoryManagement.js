const express = require('express');
const router = express.Router();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLONED_REPOS_PATH = path.join(__dirname, '../../cloned-repositories');
const REPOS_CONFIG_FILE = path.join(__dirname, '../../repositories.json');

// Ensure repositories config file exists
if (!fs.existsSync(REPOS_CONFIG_FILE)) {
  fs.writeFileSync(REPOS_CONFIG_FILE, JSON.stringify({ repositories: [] }, null, 2));
}

/**
 * Verify if a repository exists in the GitHub account
 */
router.get('/verify-repository/:account/:repoName', async (req, res) => {
  const { account, repoName } = req.params;
  
  try {
    // Use GitHub CLI to check if repository exists
    const output = execSync(
      `gh repo view ${account}/${repoName} --json name`,
      { encoding: 'utf-8' }
    );
    
    const repoData = JSON.parse(output);
    if (repoData.name) {
      res.json({ exists: true, name: repoData.name });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error(`Repository verification failed for ${account}/${repoName}:`, error.message);
    res.status(404).json({ exists: false, error: 'Repository not found' });
  }
});

/**
 * Add a new repository to the local configuration
 */
router.post('/repositories/add', async (req, res) => {
  const { name, account } = req.body;
  
  if (!name || !account) {
    return res.status(400).json({ error: 'Repository name and account are required' });
  }
  
  try {
    // Read current configuration
    const configData = JSON.parse(fs.readFileSync(REPOS_CONFIG_FILE, 'utf-8'));
    
    // Check if repository already exists
    const exists = configData.repositories.some(repo => 
      repo.name === name && repo.account === account
    );
    
    if (exists) {
      return res.status(409).json({ error: 'Repository already exists in configuration' });
    }
    
    // Add new repository
    configData.repositories.push({
      name,
      account,
      addedAt: new Date().toISOString(),
      status: 'pending_sync'
    });
    
    // Save updated configuration
    fs.writeFileSync(REPOS_CONFIG_FILE, JSON.stringify(configData, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Repository added successfully',
      repository: { name, account }
    });
  } catch (error) {
    console.error('Failed to add repository:', error);
    res.status(500).json({ error: 'Failed to add repository to configuration' });
  }
});

/**
 * Sync a specific repository
 */
router.post('/sync-repository/:repoName', async (req, res) => {
  const { repoName } = req.params;
  const repoPath = path.join(CLONED_REPOS_PATH, repoName);
  
  try {
    // Read configuration to get account info
    const configData = JSON.parse(fs.readFileSync(REPOS_CONFIG_FILE, 'utf-8'));
    const repoConfig = configData.repositories.find(repo => repo.name === repoName);
    
    if (!repoConfig) {
      return res.status(404).json({ error: 'Repository not found in configuration' });
    }
    
    const { account } = repoConfig;
    
    // Ensure cloned repositories directory exists
    if (!fs.existsSync(CLONED_REPOS_PATH)) {
      fs.mkdirSync(CLONED_REPOS_PATH, { recursive: true });
    }
    
    if (fs.existsSync(repoPath)) {
      // Update existing repository
      console.log(`Updating ${repoName}...`);
      execSync('git fetch --all', { cwd: repoPath });
      execSync('git pull origin main || git pull origin master', { cwd: repoPath });
    } else {
      // Clone new repository
      console.log(`Cloning ${repoName}...`);
      execSync(
        `gh repo clone ${account}/${repoName} ${repoPath}`,
        { stdio: 'inherit' }
      );
    }
    
    // Update repository status
    const updatedConfig = JSON.parse(fs.readFileSync(REPOS_CONFIG_FILE, 'utf-8'));
    const repoIndex = updatedConfig.repositories.findIndex(repo => repo.name === repoName);
    if (repoIndex !== -1) {
      updatedConfig.repositories[repoIndex].status = 'synced';
      updatedConfig.repositories[repoIndex].lastSynced = new Date().toISOString();
      fs.writeFileSync(REPOS_CONFIG_FILE, JSON.stringify(updatedConfig, null, 2));
    }
    
    res.json({ 
      success: true, 
      message: `Repository ${repoName} synced successfully`,
      path: repoPath
    });
  } catch (error) {
    console.error(`Failed to sync repository ${repoName}:`, error);
    res.status(500).json({ 
      error: 'Failed to sync repository', 
      details: error.message 
    });
  }
});

/**
 * Get list of configured repositories
 */
router.get('/repositories/configured', (req, res) => {
  try {
    const configData = JSON.parse(fs.readFileSync(REPOS_CONFIG_FILE, 'utf-8'));
    res.json(configData.repositories);
  } catch (error) {
    console.error('Failed to read repositories configuration:', error);
    res.status(500).json({ error: 'Failed to read configuration' });
  }
});

module.exports = router;