import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import SyncStatus from './components/SyncStatus';
import { repositorySyncService } from './services/repositorySync';
import { SyncProvider, useSyncContext } from './contexts/SyncContext';
import { useWebVitals, useIdleCallback } from './hooks/usePerformanceOptimization';
import { preloadResources, requestIdleCallback } from './utils/performance';

// Lazy load components for code splitting
const RepositoryList = lazy(() => import('./components/VirtualizedRepositoryList'));
const RepositoryView = lazy(() => import('./components/RepositoryView'));
const DocumentationView = lazy(() => import('./components/DocumentationView'));
const PostmanView = lazy(() => import('./components/PostmanView'));
const GraphQLView = lazy(() => import('./components/GraphQLView'));
const APIExplorerView = lazy(() => import('./components/APIExplorerView'));
const APIDocumentationHub = lazy(() => import('./components/APIDocumentationHub'));
const RepositorySync = lazy(() => import('./components/RepositorySync'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  const [showSyncStatus, setShowSyncStatus] = useState(true);
  const { updateSyncResult } = useSyncContext();

  // Monitor web vitals
  useWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric);
    }
    // Could send to analytics service
  });

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Preload critical resources during idle time
  useIdleCallback(() => {
    preloadResources([
      '/static/css/main.css',
      '/static/js/main.js'
    ]);
  }, []);

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

    // Perform sync after initial render
    requestIdleCallback(() => {
      performAutoSync();
    });
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
                  setTimeout(() => setShowSyncStatus(false), 3000);
                }
              }}
            />
          </div>
        )}
        <main className="main-content">
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
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