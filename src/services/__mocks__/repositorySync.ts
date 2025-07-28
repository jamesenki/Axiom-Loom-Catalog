export const repositorySyncService = {
  getSyncStatus: jest.fn(() => ({
    isInProgress: false,
    totalRepositories: 0,
    completedRepositories: 0,
    errors: [],
    lastSyncTime: undefined
  })),
  getLastSyncInfo: jest.fn(() => ({
    timestamp: undefined,
    repositories: []
  })),
  syncOnStartup: jest.fn(() => Promise.resolve({
    success: true,
    syncedRepositories: [],
    failedRepositories: [],
    totalTime: 0,
    timestamp: new Date()
  }))
};

export interface SyncStatus {
  isInProgress: boolean;
  currentRepository?: string;
  totalRepositories: number;
  completedRepositories: number;
  errors: string[];
  lastSyncTime?: Date;
}

export interface SyncResult {
  success: boolean;
  syncedRepositories: string[];
  failedRepositories: { name: string; error: string }[];
  totalTime: number;
  timestamp: Date;
}