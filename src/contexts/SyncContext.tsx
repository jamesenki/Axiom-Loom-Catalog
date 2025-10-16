/**
 * Sync Context
 * 
 * Provides global state for repository synchronization
 * Allows components to react to sync events
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SyncResult } from '../services/repositorySync';

interface SyncContextType {
  lastSyncResult: SyncResult | null;
  syncVersion: number; // Increments on each sync to trigger updates
  updateSyncResult: (result: SyncResult) => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const useSyncContext = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
};

interface SyncProviderProps {
  children: ReactNode;
}

export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [syncVersion, setSyncVersion] = useState(0);

  const updateSyncResult = (result: SyncResult) => {
    setLastSyncResult(result);
    setSyncVersion(prev => prev + 1);
  };

  return (
    <SyncContext.Provider value={{ lastSyncResult, syncVersion, updateSyncResult }}>
      {children}
    </SyncContext.Provider>
  );
};