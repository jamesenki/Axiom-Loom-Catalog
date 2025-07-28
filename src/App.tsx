import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import RepositoryList from './components/RepositoryList';
import RepositoryView from './components/RepositoryView';
import DocumentationView from './components/DocumentationView';
import PostmanView from './components/PostmanView';
import GraphQLView from './components/GraphQLView';
import APIExplorerView from './components/APIExplorerView';
import APIDocumentationHub from './components/APIDocumentationHub';
import RepositorySync from './components/RepositorySync';
import SyncStatus from './components/SyncStatus';
import { repositorySyncService, SyncResult } from './services/repositorySync';
import { SyncProvider, useSyncContext } from './contexts/SyncContext';

function AppContent() {
  const [showSyncStatus, setShowSyncStatus] = useState(true);
  const { updateSyncResult } = useSyncContext();

  useEffect(() => {
    // Auto-sync repositories on application load
    const performAutoSync = async () => {
      console.log('🚀 Starting auto-sync on application load...');
      try {
        const result = await repositorySyncService.syncOnStartup();
        updateSyncResult(result);
        
        // Hide sync status after 10 seconds if successful
        if (result.success && result.failedRepositories.length === 0) {
          setTimeout(() => setShowSyncStatus(false), 10000);
        }
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    };

    performAutoSync();
  }, [updateSyncResult]);

  return (
    <div className="App">
      <Router>
        <Header />
        {showSyncStatus && (
          <div className="fixed top-16 right-4 w-96 z-50">
            <SyncStatus 
              onSyncComplete={(result) => {
                updateSyncResult(result);
                if (result.success && result.failedRepositories.length === 0) {
                  setTimeout(() => setShowSyncStatus(false), 10000);
                }
              }}
            />
          </div>
        )}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<RepositoryList />} />
            <Route path="/repository/:repoName" element={<RepositoryView />} />
            <Route path="/docs/:repoName" element={<DocumentationView />} />
            <Route path="/postman/:repoName" element={<PostmanView />} />
            <Route path="/graphql/:repoName" element={<GraphQLView />} />
            <Route path="/api-explorer/:repoName" element={<APIExplorerView />} />
            <Route path="/api-hub/:repoName" element={<APIDocumentationHub />} />
            <Route path="/sync" element={<RepositorySync />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

function App() {
  return (
    <SyncProvider>
      <AppContent />
    </SyncProvider>
  );
}

export default App;
