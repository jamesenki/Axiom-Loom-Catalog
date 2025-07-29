import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { repositorySyncService, SyncResult } from '../services/repositorySync';
import { useSyncContext } from '../contexts/SyncContext';

interface SyncProgress {
  isRunning: boolean;
  currentRepo?: string;
  totalRepos: number;
  completedRepos: number;
  percentage: number;
  errors: string[];
}

const RepositorySync: React.FC = () => {
  const [syncProgress, setSyncProgress] = useState<SyncProgress>({
    isRunning: false,
    totalRepos: 0,
    completedRepos: 0,
    percentage: 0,
    errors: []
  });
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { updateSyncResult } = useSyncContext();

  // Load last sync info on mount
  useEffect(() => {
    const lastSync = repositorySyncService.getLastSyncInfo();
    if (lastSync.result && lastSync.timestamp) {
      setLastSyncResult({
        ...lastSync.result,
        timestamp: lastSync.timestamp
      });
    }
  }, []);

  const handleManualSync = async () => {
    if (syncProgress.isRunning) return;

    setSyncProgress({
      isRunning: true,
      totalRepos: 0,
      completedRepos: 0,
      percentage: 0,
      errors: []
    });
    setShowDetails(true);

    try {
      // Set up progress monitoring
      const progressInterval = setInterval(async () => {
        const status = await repositorySyncService.getSyncStatus();
        setSyncProgress({
          isRunning: status.isInProgress,
          currentRepo: status.currentRepository,
          totalRepos: status.totalRepositories,
          completedRepos: status.completedRepositories,
          percentage: status.totalRepositories > 0 
            ? Math.round((status.completedRepositories / status.totalRepositories) * 100)
            : 0,
          errors: status.errors
        });
      }, 500);

      // Start sync
      const result = await repositorySyncService.syncOnStartup();
      
      // Clear progress monitoring
      clearInterval(progressInterval);
      
      // Save and update results
      repositorySyncService.saveLastSyncInfo(result);
      setLastSyncResult(result);
      updateSyncResult(result);
      
      // Final progress update
      setSyncProgress(prev => ({
        ...prev,
        isRunning: false,
        percentage: 100,
        completedRepos: prev.totalRepos
      }));

    } catch (error) {
      console.error('Sync failed:', error);
      setSyncProgress(prev => ({
        ...prev,
        isRunning: false,
        errors: [...prev.errors, error instanceof Error ? error.message : 'Unknown error']
      }));
    }
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 
      ? `${minutes}m ${remainingSeconds}s`
      : `${seconds}s`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="repository-sync p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Back to Repositories
        </Link>
        <h1 className="text-3xl font-bold text-white mb-4">🔄 Repository Sync</h1>
        <p className="text-gray-300">
          Synchronize all repositories from the GitHub account to ensure you have the latest content.
        </p>
      </div>

      {/* Sync Button and Status */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Manual Sync</h2>
            {lastSyncResult && (
              <p className="text-sm text-gray-400">
                Last sync: {formatDate(lastSyncResult.timestamp)}
              </p>
            )}
          </div>
          <button
            onClick={handleManualSync}
            disabled={syncProgress.isRunning}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              syncProgress.isRunning
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            } text-white`}
          >
            {syncProgress.isRunning ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing...
              </span>
            ) : (
              '🔄 Start Sync'
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {(syncProgress.isRunning || syncProgress.percentage > 0) && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>{syncProgress.completedRepos} / {syncProgress.totalRepos} repositories</span>
              <span>{syncProgress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${syncProgress.percentage}%` }}
              />
            </div>
            {syncProgress.currentRepo && (
              <p className="text-sm text-gray-400 mt-2">
                Currently syncing: <span className="text-white">{syncProgress.currentRepo}</span>
              </p>
            )}
          </div>
        )}

        {/* Errors */}
        {syncProgress.errors.length > 0 && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mt-4">
            <h3 className="text-red-400 font-semibold mb-2">Errors encountered:</h3>
            <ul className="text-sm text-red-300 space-y-1">
              {syncProgress.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Last Sync Results */}
      {lastSyncResult && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Last Sync Results</h2>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className={`text-lg font-semibold ${
                lastSyncResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {lastSyncResult.success ? '✅ Success' : '❌ Failed'}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Synced Repositories</p>
              <p className="text-lg font-semibold text-white">
                {lastSyncResult.syncedRepositories.length}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Duration</p>
              <p className="text-lg font-semibold text-white">
                {formatDuration(lastSyncResult.totalTime)}
              </p>
            </div>
          </div>

          {showDetails && (
            <>
              {/* Synced Repositories */}
              {lastSyncResult.syncedRepositories.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Synced Repositories ({lastSyncResult.syncedRepositories.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {lastSyncResult.syncedRepositories.map((repo) => (
                      <div key={repo} className="bg-gray-700/30 rounded px-3 py-2">
                        <span className="text-green-400 mr-2">✓</span>
                        <span className="text-gray-300">{repo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Failed Repositories */}
              {lastSyncResult.failedRepositories.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-3">
                    Failed Repositories ({lastSyncResult.failedRepositories.length})
                  </h3>
                  <div className="space-y-2">
                    {lastSyncResult.failedRepositories.map((failure) => (
                      <div key={failure.name} className="bg-red-900/20 border border-red-800 rounded p-3">
                        <p className="text-red-300 font-medium">{failure.name}</p>
                        <p className="text-red-400 text-sm mt-1">{failure.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-900/20 border border-blue-800 rounded-lg p-6">
        <h3 className="text-blue-400 font-semibold mb-3">ℹ️ Sync Information</h3>
        <ul className="text-blue-300 space-y-2 text-sm">
          <li>• Sync will update all existing repositories and clone any new ones</li>
          <li>• The process may take several minutes depending on repository sizes</li>
          <li>• Failed syncs for individual repositories won't stop the overall process</li>
          <li>• Repositories are automatically synced when the application starts</li>
        </ul>
      </div>
    </div>
  );
};

export default RepositorySync;