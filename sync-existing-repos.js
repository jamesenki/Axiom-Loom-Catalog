const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLONED_REPOS_PATH = path.join(__dirname, 'cloned-repositories');
const REPOS_CONFIG_FILE = path.join(__dirname, 'repositories.json');

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
      console.log(`Updating ${dirName}...`);
      
      // Fetch all remotes
      execSync('git fetch --all', { cwd: repoPath, encoding: 'utf-8' });
      
      // Try to pull from main or master
      try {
        execSync('git pull origin main', { cwd: repoPath, encoding: 'utf-8' });
      } catch (e) {
        // If main doesn't exist, try master
        execSync('git pull origin master', { cwd: repoPath, encoding: 'utf-8' });
      }
      
      syncedRepos.push(dirName);
      
      // Update status in config
      const repoIndex = repositories.findIndex(r => r.name === dirName);
      if (repoIndex !== -1) {
        repositories[repoIndex].status = 'synced';
        repositories[repoIndex].lastSynced = new Date().toISOString();
      }
    } catch (error) {
      console.error(`Failed to sync ${dirName}:`, error.message);
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