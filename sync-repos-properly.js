const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLONED_REPOS_PATH = path.join(__dirname, 'cloned-repositories');
const REPOS_CONFIG_FILE = path.join(__dirname, 'repositories.json');

// Special branch configurations
const SPECIAL_BRANCHES = {
  'demo-labsdashboards': 'james-update'
};

async function syncExistingRepos() {
  console.log('Starting sync of existing repositories...');
  
  const startTime = Date.now();
  const syncedRepos = [];
  const failedRepos = [];
  
  // Read config
  const configData = JSON.parse(fs.readFileSync(REPOS_CONFIG_FILE, 'utf-8'));
  const repositories = configData.repositories || [];
  
  // Get list of cloned directories
  const clonedDirs = fs.readdirSync(CLONED_REPOS_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name);
  
  console.log(`Found ${clonedDirs.length} cloned repositories`);
  
  // Update each cloned repository
  for (const dirName of clonedDirs) {
    const repoPath = path.join(CLONED_REPOS_PATH, dirName);
    
    try {
      console.log(`\nUpdating ${dirName}...`);
      
      // Fetch all remotes
      execSync('git fetch --all', { cwd: repoPath, encoding: 'utf-8' });
      
      // Check if this repo has a special branch configuration
      const specialBranch = SPECIAL_BRANCHES[dirName];
      
      if (specialBranch) {
        console.log(`  Using special branch: ${specialBranch}`);
        try {
          // First, check if we're already on the special branch
          const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: repoPath, encoding: 'utf-8' }).trim();
          
          if (currentBranch !== specialBranch) {
            // Try to checkout the special branch
            try {
              execSync(`git checkout ${specialBranch}`, { cwd: repoPath, encoding: 'utf-8' });
            } catch (e) {
              // If local branch doesn't exist, create it tracking the remote
              execSync(`git checkout -b ${specialBranch} origin/${specialBranch}`, { cwd: repoPath, encoding: 'utf-8' });
            }
          }
          
          // Pull the special branch
          execSync(`git pull origin ${specialBranch}`, { cwd: repoPath, encoding: 'utf-8' });
        } catch (error) {
          console.error(`  Failed to pull special branch ${specialBranch}: ${error.message}`);
          throw error;
        }
      } else {
        // Normal branch handling - try main first, then master
        try {
          execSync('git pull origin main', { cwd: repoPath, encoding: 'utf-8' });
        } catch (e) {
          // If main doesn't exist, try master
          try {
            execSync('git pull origin master', { cwd: repoPath, encoding: 'utf-8' });
          } catch (e2) {
            // If neither main nor master work, check current branch
            const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: repoPath, encoding: 'utf-8' }).trim();
            console.log(`  Pulling current branch: ${currentBranch}`);
            execSync(`git pull origin ${currentBranch}`, { cwd: repoPath, encoding: 'utf-8' });
          }
        }
      }
      
      console.log(`  ✓ Successfully synced`);
      syncedRepos.push(dirName);
      
      // Update status in config
      const repoIndex = repositories.findIndex(r => r.name === dirName);
      if (repoIndex !== -1) {
        repositories[repoIndex].status = 'synced';
        repositories[repoIndex].lastSynced = new Date().toISOString();
        if (specialBranch) {
          repositories[repoIndex].branch = specialBranch;
        }
      }
    } catch (error) {
      console.error(`  ✗ Failed to sync ${dirName}: ${error.message}`);
      failedRepos.push({ name: dirName, error: error.message });
      
      // Update status in config
      const repoIndex = repositories.findIndex(r => r.name === dirName);
      if (repoIndex !== -1) {
        repositories[repoIndex].status = 'sync_failed';
        repositories[repoIndex].lastError = error.message;
      }
    }
  }
  
  // Save updated configuration
  configData.repositories = repositories;
  fs.writeFileSync(REPOS_CONFIG_FILE, JSON.stringify(configData, null, 2));
  
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n=== Sync Complete ===');
  console.log(`Total time: ${totalTime} seconds`);
  console.log(`Synced: ${syncedRepos.length} repositories`);
  console.log(`Failed: ${failedRepos.length} repositories`);
  
  if (failedRepos.length > 0) {
    console.log('\nFailed repositories:');
    failedRepos.forEach(({ name, error }) => {
      console.log(`  - ${name}: ${error}`);
    });
  }
  
  return {
    success: true,
    syncedRepositories: syncedRepos,
    failedRepositories: failedRepos,
    totalTime: parseFloat(totalTime),
    timestamp: new Date()
  };
}

// Run the sync
syncExistingRepos().catch(console.error);