const express = require('express');
const router = express.Router();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLONED_REPOS_PATH = path.join(__dirname, '../../cloned-repositories');
const REPOS_CONFIG_FILE = path.join(__dirname, '../../repositories.json');

// Global sync status for progress tracking
let syncStatus = {
  isInProgress: false,
  currentRepository: '',
  totalRepositories: 0,
  completedRepositories: 0,
  errors: [],
  lastSyncTime: null
};

// Ensure repositories config file exists
if (!fs.existsSync(REPOS_CONFIG_FILE)) {
  fs.writeFileSync(REPOS_CONFIG_FILE, JSON.stringify({ repositories: [] }, null, 2));
}

/**
 * Verify if a repository exists in the GitHub account
 */
router.post('/verify-repository/:account/:repoName', async (req, res) => {
  const { account, repoName } = req.params;
  const { token } = req.body || {};
  
  try {
    // First, try with the specific account if we have gh auth for it
    // Check if the account has existing auth by trying to switch to it
    let authCheckCmd = `gh auth status 2>&1`;
    let authOutput = '';
    try {
      authOutput = execSync(authCheckCmd, { encoding: 'utf-8' });
    } catch (e) {
      authOutput = e.stdout || '';
    }
    
    // Check if the specific account is authenticated
    const hasAccountAuth = authOutput.includes(`account ${account}`);
    
    let command;
    let env = { ...process.env };
    
    if (token) {
      // Use the provided token for authentication
      env.GH_TOKEN = token;
      command = `gh repo view ${account}/${repoName} --json name,visibility,isPrivate`;
    } else if (hasAccountAuth) {
      // Try to use the account-specific auth
      // First switch to the account, then view the repo
      try {
        execSync(`gh auth switch --user ${account}`, { encoding: 'utf-8', stdio: 'pipe' });
        command = `gh repo view ${account}/${repoName} --json name,visibility,isPrivate`;
      } catch (e) {
        // If switch fails, try with current auth
        command = `gh repo view ${account}/${repoName} --json name,visibility,isPrivate`;
      }
    } else {
      // Use current authentication
      command = `gh repo view ${account}/${repoName} --json name,visibility,isPrivate`;
    }
    
    // Use GitHub CLI to check if repository exists
    const output = execSync(
      command,
      { 
        encoding: 'utf-8',
        env: env,
        stdio: 'pipe'
      }
    );
    
    const repoData = JSON.parse(output);
    if (repoData.name) {
      res.json({ 
        exists: true, 
        name: repoData.name,
        isPrivate: repoData.isPrivate || false,
        visibility: repoData.visibility || 'public'
      });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error(`Repository verification failed for ${account}/${repoName}:`, error.message);
    
    // Try to provide more specific error messages
    const errorStr = error.message || error.toString();
    
    if (errorStr.includes('HTTP 404') || errorStr.includes('Could not resolve') || errorStr.includes('not found')) {
      res.status(404).json({ exists: false, error: 'Repository not found' });
    } else if (errorStr.includes('HTTP 403')) {
      res.status(403).json({ exists: false, error: 'Access forbidden. You may not have permission to access this repository.' });
    } else if (errorStr.includes('HTTP 401') || errorStr.includes('authentication') || errorStr.includes('Unauthorized')) {
      // If it's an auth error, check if gh CLI has any auth at all
      try {
        execSync('gh auth status', { stdio: 'pipe' });
        // If we have auth but still can't access, it's likely a private repo
        res.status(401).json({ exists: false, error: 'This appears to be a private repository. Please provide a GitHub token with access.' });
      } catch (e) {
        res.status(401).json({ exists: false, error: 'Authentication required. Please provide a GitHub token.' });
      }
    } else {
      // Generic error but provide the actual error message for debugging
      res.status(404).json({ exists: false, error: 'Unable to verify repository. It may be private or the name may be incorrect.' });
    }
  }
});

// Also keep the GET endpoint for backward compatibility
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
    res.status(404).json({ exists: false, error: 'Repository not found or requires authentication' });
  }
});

/**
 * Add a new repository to the local configuration
 */
router.post('/repositories/add', async (req, res) => {
  const { name, account, token } = req.body;
  
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
    
    // Add new repository with optional token (stored securely)
    const repoConfig = {
      name,
      account,
      addedAt: new Date().toISOString(),
      status: 'pending_sync'
    };
    
    // Store token separately in a secure way if provided
    if (token) {
      // In production, this should be stored in a secure credential store
      // For now, we'll store it in memory and pass it along when needed
      repoConfig.hasToken = true;
    }
    
    configData.repositories.push(repoConfig);
    
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
  const { token } = req.body || {};
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
    
    // Prepare environment with token if provided
    let env = { ...process.env };
    if (token) {
      env.GH_TOKEN = token;
    }
    
    if (fs.existsSync(repoPath)) {
      // Update existing repository
      console.log(`Updating ${repoName}...`);
      execSync('git fetch --all', { cwd: repoPath, env });
      execSync('git pull origin main || git pull origin master', { cwd: repoPath, env });
    } else {
      // Clone new repository
      console.log(`Cloning ${repoName}...`);
      execSync(
        `gh repo clone ${account}/${repoName} ${repoPath}`,
        { stdio: 'inherit', env }
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

/**
 * Sync all repositories
 */
router.post('/repository/sync', async (req, res) => {
  const startTime = Date.now();
  const syncedRepositories = [];
  const failedRepositories = [];
  const { limit } = req.body || {}; // Allow limiting for testing

  // Reset sync status
  syncStatus = {
    isInProgress: true,
    currentRepository: '',
    totalRepositories: 0,
    completedRepositories: 0,
    errors: [],
    lastSyncTime: null
  };

  try {
    // Ensure cloned repositories directory exists
    if (!fs.existsSync(CLONED_REPOS_PATH)) {
      syncStatus.isInProgress = false;
      return res.json({
        success: true,
        syncedRepositories: [],
        failedRepositories: [],
        totalTime: 0,
        timestamp: new Date(),
        message: 'No repositories found to sync'
      });
    }

    // Get list of directories in cloned-repositories
    let directories = fs.readdirSync(CLONED_REPOS_PATH, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
      .map(dirent => dirent.name);
    
    // Remove ai-prompts if it doesn't exist
    directories = directories.filter(dir => fs.existsSync(path.join(CLONED_REPOS_PATH, dir)));

    // Apply limit if specified (for testing)
    if (limit && limit > 0) {
      directories = directories.slice(0, limit);
    }

    console.log(`Found ${directories.length} local repositories to sync`);
    syncStatus.totalRepositories = directories.length;

    // Special branch configurations
    const SPECIAL_BRANCHES = {
      'nslabsdashboards': 'james-update'
    };

    // Sync each local repository with timeout
    for (const repoName of directories) {
      const repoPath = path.join(CLONED_REPOS_PATH, repoName);
      
      try {
        console.log(`Syncing ${repoName}... (${syncedRepositories.length + 1}/${directories.length})`);
        syncStatus.currentRepository = repoName;
        
        // Check if it's a git repository
        try {
          execSync('git rev-parse --git-dir', { 
            cwd: repoPath, 
            encoding: 'utf-8',
            timeout: 5000 // 5 second timeout
          });
        } catch (e) {
          console.log(`${repoName} is not a git repository, skipping`);
          syncStatus.completedRepositories++;
          continue;
        }
        
        // Fetch all remotes with timeout
        try {
          execSync('git fetch --all', { 
            cwd: repoPath, 
            encoding: 'utf-8',
            timeout: 30000 // 30 second timeout for fetch
          });
        } catch (e) {
          console.error(`Fetch failed for ${repoName}, continuing with local state`);
        }
        
        // Check if this repo has a special branch
        const specialBranch = SPECIAL_BRANCHES[repoName];
        
        if (specialBranch) {
          // Handle special branch
          try {
            // Check if branch exists locally
            const branches = execSync('git branch', { 
              cwd: repoPath, 
              encoding: 'utf-8',
              timeout: 5000
            });
            
            if (!branches.includes(specialBranch)) {
              // Create branch tracking remote
              execSync(`git checkout -b ${specialBranch} origin/${specialBranch}`, { 
                cwd: repoPath, 
                encoding: 'utf-8',
                timeout: 10000
              });
            } else {
              execSync(`git checkout ${specialBranch}`, { 
                cwd: repoPath, 
                encoding: 'utf-8',
                timeout: 5000
              });
            }
            
            execSync(`git pull origin ${specialBranch}`, { 
              cwd: repoPath, 
              encoding: 'utf-8',
              timeout: 30000 // 30 second timeout for pull
            });
          } catch (e) {
            console.error(`Failed to sync special branch ${specialBranch} for ${repoName}: ${e.message}`);
            throw e;
          }
        } else {
          // Try to pull from current branch
          try {
            const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { 
              cwd: repoPath, 
              encoding: 'utf-8',
              timeout: 5000
            }).trim();
            
            execSync(`git pull origin ${currentBranch}`, { 
              cwd: repoPath, 
              encoding: 'utf-8',
              timeout: 30000
            });
          } catch (e) {
            // If current branch fails, try main then master
            try {
              execSync('git pull origin main', { 
                cwd: repoPath, 
                encoding: 'utf-8',
                timeout: 30000
              });
            } catch (e2) {
              try {
                execSync('git pull origin master', { 
                  cwd: repoPath, 
                  encoding: 'utf-8',
                  timeout: 30000
                });
              } catch (e3) {
                throw new Error(`Could not pull from any branch: ${e3.message}`);
              }
            }
          }
        }
        
        syncedRepositories.push(repoName);
        syncStatus.completedRepositories++;
      } catch (error) {
        console.error(`Failed to sync ${repoName}:`, error.message);
        failedRepositories.push({ name: repoName, error: error.message });
        syncStatus.errors.push(`${repoName}: ${error.message}`);
        syncStatus.completedRepositories++;
      }
    }

    const totalTime = Date.now() - startTime;
    
    // Update final sync status
    syncStatus.isInProgress = false;
    syncStatus.lastSyncTime = new Date();
    syncStatus.currentRepository = '';
    
    res.json({
      success: true,
      syncedRepositories,
      failedRepositories,
      totalTime,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Sync failed:', error);
    
    // Update sync status on error
    syncStatus.isInProgress = false;
    syncStatus.errors.push(error.message);
    
    res.status(500).json({ 
      success: false,
      error: 'Sync failed', 
      details: error.message,
      syncedRepositories,
      failedRepositories,
      totalTime: Date.now() - startTime,
      timestamp: new Date()
    });
  }
});

/**
 * Get sync status
 */
router.get('/repository/sync/status', (req, res) => {
  try {
    res.json(syncStatus);
  } catch (error) {
    res.status(500).json({
      isInProgress: false,
      totalRepositories: 0,
      completedRepositories: 0,
      errors: [error.message],
      lastSyncTime: null
    });
  }
});

/**
 * Startup sync (same as regular sync but with less logging)
 */
router.post('/repository/sync/startup', async (req, res) => {
  // Just forward to regular sync for now
  req.url = '/repository/sync';
  router.handle(req, res);
});

module.exports = router;