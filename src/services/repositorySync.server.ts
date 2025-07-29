/**
 * Repository Sync Service
 * 
 * Handles synchronization of repository metadata and content
 * from GitHub to local cache
 */

// Node.js modules - only available on server
let execSync: any;
let fs: any;
let path: any;

// Only import Node.js modules if we're in a Node environment
if (typeof window === 'undefined') {
  execSync = require('child_process').execSync;
  fs = require('fs');
  path = require('path');
}

export interface SyncStatus {
  isInProgress: boolean;
  currentRepository?: string;
  totalRepositories: number;
  completedRepositories: number;
  errors: string[];
  lastSyncTime?: Date;
}

export interface RepositoryMetadata {
  name: string;
  description: string;
  url: string;
  lastUpdated: Date;
  language: string;
  topics: string[];
  hasReadme: boolean;
  hasApiDocs: boolean;
}

export interface SyncResult {
  success: boolean;
  syncedRepositories: string[];
  failedRepositories: { name: string; error: string }[];
  totalTime: number;
  timestamp: Date;
}

class RepositorySyncService {
  private readonly CLONED_REPOS_PATH = path.join(__dirname, '../../cloned-repositories');
  private readonly GITHUB_ACCOUNT = '20230011612_EYGS';
  private readonly SYNC_STATUS_FILE = path.join(__dirname, '../../.sync-status.json');
  
  private syncStatus: SyncStatus = {
    isInProgress: false,
    totalRepositories: 0,
    completedRepositories: 0,
    errors: []
  };

  constructor() {
    // Ensure cloned repositories directory exists
    if (!fs.existsSync(this.CLONED_REPOS_PATH)) {
      fs.mkdirSync(this.CLONED_REPOS_PATH, { recursive: true });
    }
  }

  /**
   * Get current sync status
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Get last sync information from disk
   */
  getLastSyncInfo(): { timestamp?: Date; repositories?: string[] } {
    try {
      if (fs.existsSync(this.SYNC_STATUS_FILE)) {
        const data = JSON.parse(fs.readFileSync(this.SYNC_STATUS_FILE, 'utf-8'));
        return {
          timestamp: data.timestamp ? new Date(data.timestamp) : undefined,
          repositories: data.repositories || []
        };
      }
    } catch (error) {
      console.error('Error reading sync status:', error);
    }
    return {};
  }

  /**
   * Sync all repositories on application load
   */
  async syncOnStartup(): Promise<SyncResult> {
    console.log('🔄 Starting repository sync on application load...');
    const startTime = Date.now();
    
    this.syncStatus = {
      isInProgress: true,
      totalRepositories: 0,
      completedRepositories: 0,
      errors: []
    };

    const result: SyncResult = {
      success: true,
      syncedRepositories: [],
      failedRepositories: [],
      totalTime: 0,
      timestamp: new Date()
    };

    try {
      // Get list of repositories from the account
      const repositories = await this.fetchRepositoryList();
      this.syncStatus.totalRepositories = repositories.length;

      // Sync each repository
      for (const repo of repositories) {
        try {
          this.syncStatus.currentRepository = repo.name;
          await this.syncRepository(repo);
          result.syncedRepositories.push(repo.name);
          this.syncStatus.completedRepositories++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          result.failedRepositories.push({ name: repo.name, error: errorMessage });
          this.syncStatus.errors.push(`${repo.name}: ${errorMessage}`);
          result.success = false;
        }
      }

      // Save sync status to disk
      this.saveSyncStatus(result);

    } catch (error) {
      console.error('Fatal error during sync:', error);
      result.success = false;
      this.syncStatus.errors.push(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.syncStatus.isInProgress = false;
      this.syncStatus.lastSyncTime = new Date();
      result.totalTime = Date.now() - startTime;
    }

    console.log(`✅ Sync completed in ${result.totalTime}ms`);
    return result;
  }

  /**
   * Fetch list of repositories from GitHub account
   */
  private async fetchRepositoryList(): Promise<RepositoryMetadata[]> {
    try {
      // Using GitHub CLI to list repositories
      const output = execSync(
        `gh repo list ${this.GITHUB_ACCOUNT} --limit 1000 --json name,description,url,updatedAt,primaryLanguage,repositoryTopics,hasReadme`,
        { encoding: 'utf-8' }
      );

      const repos = JSON.parse(output);
      
      return repos.map((repo: any) => ({
        name: repo.name,
        description: repo.description || '',
        url: repo.url,
        lastUpdated: new Date(repo.updatedAt),
        language: repo.primaryLanguage?.name || '',
        topics: repo.repositoryTopics?.map((t: any) => t.name) || [],
        hasReadme: repo.hasReadme || false,
        hasApiDocs: false // Will be determined during sync
      }));
    } catch (error) {
      console.error('Error fetching repository list:', error);
      
      // Fallback to local repositories if GitHub CLI fails
      return this.getLocalRepositories();
    }
  }

  /**
   * Get list of repositories already cloned locally
   */
  private getLocalRepositories(): RepositoryMetadata[] {
    const repos: RepositoryMetadata[] = [];
    
    if (fs.existsSync(this.CLONED_REPOS_PATH)) {
      const entries = fs.readdirSync(this.CLONED_REPOS_PATH, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const repoPath = path.join(this.CLONED_REPOS_PATH, entry.name);
          const stats = fs.statSync(repoPath);
          
          repos.push({
            name: entry.name,
            description: this.getRepositoryDescription(repoPath),
            url: `https://github.com/${this.GITHUB_ACCOUNT}/${entry.name}`,
            lastUpdated: stats.mtime,
            language: this.detectLanguage(repoPath),
            topics: [],
            hasReadme: fs.existsSync(path.join(repoPath, 'README.md')),
            hasApiDocs: this.hasApiDocs(repoPath)
          });
        }
      }
    }
    
    return repos;
  }

  /**
   * Sync a single repository
   */
  private async syncRepository(repo: RepositoryMetadata): Promise<void> {
    const repoPath = path.join(this.CLONED_REPOS_PATH, repo.name);
    
    try {
      if (fs.existsSync(repoPath)) {
        // Update existing repository
        console.log(`📥 Updating ${repo.name}...`);
        execSync('git fetch --all', { cwd: repoPath });
        execSync('git pull origin main || git pull origin master', { cwd: repoPath });
      } else {
        // Clone new repository
        console.log(`📦 Cloning ${repo.name}...`);
        execSync(
          `gh repo clone ${this.GITHUB_ACCOUNT}/${repo.name} ${repoPath}`,
          { stdio: 'inherit' }
        );
      }
      
      // Update metadata
      repo.hasApiDocs = this.hasApiDocs(repoPath);
      
    } catch (error) {
      console.error(`Error syncing ${repo.name}:`, error);
      throw error;
    }
  }

  /**
   * Get repository description from README or package.json
   */
  private getRepositoryDescription(repoPath: string): string {
    // Try package.json first
    const packageJsonPath = path.join(repoPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        if (packageJson.description) {
          return packageJson.description;
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    
    // Try README.md
    const readmePath = path.join(repoPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      const content = fs.readFileSync(readmePath, 'utf-8');
      const lines = content.split('\n');
      
      // Look for description after title
      for (let i = 0; i < Math.min(lines.length, 10); i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('#') && !line.startsWith('![')) {
          return line.substring(0, 200);
        }
      }
    }
    
    return '';
  }

  /**
   * Detect primary language of repository
   */
  private detectLanguage(repoPath: string): string {
    const languageFiles = {
      'TypeScript': ['tsconfig.json', '*.ts', '*.tsx'],
      'JavaScript': ['package.json', '*.js', '*.jsx'],
      'Python': ['requirements.txt', 'setup.py', '*.py'],
      'Java': ['pom.xml', 'build.gradle', '*.java'],
      'Go': ['go.mod', '*.go'],
      'Rust': ['Cargo.toml', '*.rs'],
      'C#': ['*.csproj', '*.cs']
    };
    
    for (const [language, patterns] of Object.entries(languageFiles)) {
      for (const pattern of patterns) {
        if (pattern.startsWith('*')) {
          // Check for file extensions
          const files = fs.readdirSync(repoPath);
          if (files.some(f => f.endsWith(pattern.substring(1)))) {
            return language;
          }
        } else {
          // Check for specific files
          if (fs.existsSync(path.join(repoPath, pattern))) {
            return language;
          }
        }
      }
    }
    
    return '';
  }

  /**
   * Check if repository has API documentation
   */
  private hasApiDocs(repoPath: string): boolean {
    const apiIndicators = [
      'openapi.yaml', 'openapi.yml', 'openapi.json',
      'swagger.yaml', 'swagger.yml', 'swagger.json',
      'api.yaml', 'api.yml',
      '*.proto', '*.graphql', '*.gql'
    ];
    
    const checkDir = (dir: string): boolean => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            if (checkDir(path.join(dir, entry.name))) {
              return true;
            }
          } else if (entry.isFile()) {
            for (const indicator of apiIndicators) {
              if (indicator.startsWith('*')) {
                if (entry.name.endsWith(indicator.substring(1))) {
                  return true;
                }
              } else if (entry.name === indicator) {
                return true;
              }
            }
          }
        }
      } catch (error) {
        // Ignore permission errors
      }
      
      return false;
    };
    
    return checkDir(repoPath);
  }

  /**
   * Save sync status to disk
   */
  private saveSyncStatus(result: SyncResult): void {
    try {
      const status = {
        timestamp: result.timestamp,
        repositories: result.syncedRepositories,
        failed: result.failedRepositories,
        totalTime: result.totalTime
      };
      
      fs.writeFileSync(this.SYNC_STATUS_FILE, JSON.stringify(status, null, 2));
    } catch (error) {
      console.error('Error saving sync status:', error);
    }
  }
}

// Export singleton instance
export const repositorySyncService = new RepositorySyncService();