/**
 * Repository Sync Service (Client-side)
 * 
 * Handles synchronization of repository metadata through API calls
 */

import { getApiUrl } from '../utils/apiConfig';

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
  private syncStatus: SyncStatus = {
    isInProgress: false,
    totalRepositories: 0,
    completedRepositories: 0,
    errors: []
  };

  /**
   * Start synchronization through API
   */
  async startSync(limit?: number): Promise<SyncResult> {
    try {
      const response = await fetch(getApiUrl('/api/repository/sync'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit })
      });
      
      if (!response.ok) {
        throw new Error('Sync failed');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Sync on startup
   */
  async syncOnStartup(): Promise<SyncResult> {
    try {
      const response = await fetch(getApiUrl('/api/repository/sync'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Startup sync failed: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Sync error:', error);
      // Return a default result on error
      return {
        success: false,
        syncedRepositories: [],
        failedRepositories: [],
        totalTime: 0,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<SyncStatus> {
    try {
      const response = await fetch(getApiUrl('/api/repository/sync/status'));
      
      if (!response.ok) {
        return this.syncStatus;
      }
      
      const status = await response.json();
      this.syncStatus = status;
      return status;
    } catch (error) {
      return this.syncStatus;
    }
  }

  /**
   * Clone a single repository
   */
  async cloneRepository(repoName: string): Promise<void> {
    try {
      const response = await fetch(getApiUrl(`/api/repository/clone/${repoName}`), {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Clone failed');
      }
    } catch (error) {
      throw new Error(`Clone error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update repository metadata
   */
  async updateRepositoryMetadata(repoName: string): Promise<void> {
    try {
      const response = await fetch(getApiUrl(`/api/repository/metadata/${repoName}`), {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Metadata update failed');
      }
    } catch (error) {
      throw new Error(`Metadata update error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get last sync info from local storage
   */
  getLastSyncInfo(): { timestamp?: Date; result?: SyncResult } {
    try {
      const stored = localStorage.getItem('lastSyncInfo');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          timestamp: parsed.timestamp ? new Date(parsed.timestamp) : undefined,
          result: parsed.result
        };
      }
    } catch (error) {
      console.error('Error reading last sync info:', error);
    }
    return {};
  }

  /**
   * Save last sync info to local storage
   */
  saveLastSyncInfo(result: SyncResult): void {
    try {
      localStorage.setItem('lastSyncInfo', JSON.stringify({
        timestamp: new Date(),
        result
      }));
    } catch (error) {
      console.error('Error saving last sync info:', error);
    }
  }
}

// Export singleton instance
export const repositorySyncService = new RepositorySyncService();