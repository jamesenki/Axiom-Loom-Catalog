/**
 * Sync Status Component
 * 
 * Displays the current status of repository synchronization
 * Shows progress, errors, and allows manual sync
 */

import React, { useEffect, useState } from 'react';
import { repositorySyncService, SyncStatus as ISyncStatus, SyncResult } from '../services/repositorySync';

interface SyncStatusProps {
  onSyncComplete?: (result: SyncResult) => void;
  className?: string;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ onSyncComplete, className = '' }) => {
  const [syncStatus, setSyncStatus] = useState<ISyncStatus>({
    isInProgress: false,
    totalRepositories: 0,
    completedRepositories: 0,
    errors: []
  });
  const [lastSyncInfo, setLastSyncInfo] = useState(repositorySyncService.getLastSyncInfo());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Poll for sync status updates while sync is in progress
    let interval: NodeJS.Timeout | null = null;
    
    if (syncStatus.isInProgress) {
      interval = setInterval(() => {
        repositorySyncService.getSyncStatus().then(status => setSyncStatus(status));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [syncStatus.isInProgress]);

  const handleManualSync = async () => {
    setSyncStatus({ ...syncStatus, isInProgress: true });
    try {
      const result = await repositorySyncService.syncOnStartup();
      repositorySyncService.saveLastSyncInfo(result);
      setLastSyncInfo({
        timestamp: result.timestamp,
        result: result
      });
      if (onSyncComplete) {
        onSyncComplete(result);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      repositorySyncService.getSyncStatus().then(status => setSyncStatus(status));
    }
  };

  const formatTimestamp = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getProgressPercentage = () => {
    if (!syncStatus.isInProgress || syncStatus.totalRepositories === 0) return 0;
    return Math.round((syncStatus.completedRepositories / syncStatus.totalRepositories) * 100);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              syncStatus.isInProgress ? 'bg-blue-500 animate-pulse' :
              syncStatus.errors.length > 0 ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            <h3 className="text-sm font-medium text-gray-900">
              {syncStatus.isInProgress ? 'Syncing Repositories' : 'Repository Sync'}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              Last sync: {formatTimestamp(lastSyncInfo.timestamp || syncStatus.lastSyncTime)}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg className={`w-4 h-4 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {syncStatus.isInProgress && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Syncing: {syncStatus.currentRepository || 'Initializing...'}</span>
              <span>{syncStatus.completedRepositories} of {syncStatus.totalRepositories}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {!syncStatus.isInProgress && (
              <button
                onClick={handleManualSync}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Sync All Repositories
              </button>
            )}

            {lastSyncInfo.result?.syncedRepositories && lastSyncInfo.result.syncedRepositories.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">Synced Repositories ({lastSyncInfo.result.syncedRepositories.length})</h4>
                <div className="max-h-32 overflow-y-auto">
                  <ul className="text-xs text-gray-600 space-y-1">
                    {lastSyncInfo.result.syncedRepositories.map((repo, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{repo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {syncStatus.errors.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-red-700 mb-2">Sync Errors ({syncStatus.errors.length})</h4>
                <div className="max-h-32 overflow-y-auto">
                  <ul className="text-xs text-red-600 space-y-1">
                    {syncStatus.errors.map((error, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <svg className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="break-all">{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncStatus;