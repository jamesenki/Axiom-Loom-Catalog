import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/design-system/theme';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/styled/Header';
import SyncStatus from './components/SyncStatus';
import { SyncProvider, useSyncContext } from './contexts/SyncContext';
import { AuthProvider } from './contexts/BypassAuthContext';
import { Container } from './components/styled';
import { FullPageLoading } from './components/styled/Loading';
import { useGlobalSearch } from './hooks/useGlobalSearch';
import { UserRole } from './services/auth/clientAuthService';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageTransition from './components/PageTransition';
import DemoMode, { DemoModeToggle } from './components/DemoMode';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import EnhancedSearchModal from './components/EnhancedSearchModal';

// Analytics and Monitoring
import { initializeAnalytics, AnalyticsConfig } from './services/analytics/analyticsService';
import { createGoogleAnalyticsProvider } from './services/analytics/providers/googleAnalyticsProvider';
import { createCustomAnalyticsProvider } from './services/analytics/providers/customAnalyticsProvider';
import { initializeErrorTracking } from './services/monitoring/errorTrackingService';
import { EnhancedErrorBoundary } from './components/EnhancedErrorBoundary';
import PrivacyConsent from './components/PrivacyConsent';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PerformanceDashboard from './components/PerformanceDashboard';

// Lazy load components for better performance
const RepositoryList = lazy(() => import('./components/styled/RepositoryListSimple'));
const RepositoryDetail = lazy(() => import('./components/RepositoryDetailRedesigned'));
const RepositoryView = lazy(() => import('./components/RepositoryView'));
const DocumentationView = lazy(() => import('./components/DocumentationView'));
const PostmanView = lazy(() => import('./components/PostmanView'));
const GraphQLView = lazy(() => import('./components/GraphQLView'));
const GraphQLPlaygroundView = lazy(() => import('./components/GraphQLPlaygroundView'));
const APIExplorerView = lazy(() => import('./components/APIExplorerView'));
const SwaggerViewer = lazy(() => import('./components/SwaggerViewer'));
const APIDocumentationHub = lazy(() => import('./components/APIDocumentationHub'));
const RepositorySync = lazy(() => import('./components/RepositorySync'));

// New enhanced API components
const UnifiedApiExplorer = lazy(() => import('./components/UnifiedApiExplorer'));
const GraphQLPlaygroundEnhanced = lazy(() => import('./components/GraphQLPlaygroundSimple'));
const GrpcExplorer = lazy(() => import('./components/GrpcExplorer'));
const PostmanCollectionRunner = lazy(() => import('./components/PostmanCollectionRunner'));

// Auth components
const Login = lazy(() => import('./components/auth/Login'));
const AuthCallback = lazy(() => import('./components/auth/AuthCallback'));
const UserProfile = lazy(() => import('./components/auth/UserProfile'));
const ApiKeyManagement = lazy(() => import('./components/auth/ApiKeyManagement'));

// Loading component
const PageLoader = () => (
  <FullPageLoading text="Loading..." variant="spinner" />
);

// Initialize analytics and monitoring
const initializeMonitoring = () => {
  // Initialize error tracking
  initializeErrorTracking({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    enabledInDevelopment: false,
    sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured'
    ]
  });

  // Initialize analytics
  const analyticsConfig: AnalyticsConfig = {
    providers: [
      createGoogleAnalyticsProvider({
        measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID || '',
        debugMode: process.env.NODE_ENV === 'development',
        anonymizeIp: true
      }),
      createCustomAnalyticsProvider({
        endpoint: process.env.REACT_APP_ANALYTICS_ENDPOINT,
        batchSize: 20,
        flushInterval: 30000
      })
    ],
    enabledProviders: process.env.NODE_ENV === 'production' 
      ? ['google-analytics', 'custom-analytics']
      : ['custom-analytics'],
    debugMode: process.env.NODE_ENV === 'development',
    respectDoNotTrack: true,
    anonymizeIp: true,
    cookieConsent: true,
    sessionTimeout: 30
  };

  initializeAnalytics(analyticsConfig);
};

function AppContent() {
  const [showSyncStatus, setShowSyncStatus] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { updateSyncResult } = useSyncContext();
  const { isSearchOpen, closeSearch } = useGlobalSearch();

  useEffect(() => {
    // Initialize monitoring services
    initializeMonitoring();

    // Removed auto-sync on load - only sync on user request
    // This improves performance and prevents unnecessary network requests
    setShowSyncStatus(false);

    // Register service worker for caching and offline support
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

  return (
    <EnhancedErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router>
        <AuthProvider>
          <Header />
          {showSyncStatus && (
            <div style={{
              position: 'fixed',
              top: '64px',
              right: theme.spacing[4],
              width: '384px',
              zIndex: theme.zIndex.fixed
            }}>
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
          <Container as="main" maxWidth="2xl" padding="desktop">
            <Suspense fallback={<PageLoader />}>
              <PageTransition transitionType="fade">
                <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/success" element={<AuthCallback />} />
                <Route path="/auth/error" element={<AuthCallback />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <RepositoryList />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />
                <Route path="/api-keys" element={
                  <ProtectedRoute requiredPermission="create:api_keys">
                    <ApiKeyManagement />
                  </ProtectedRoute>
                } />
                <Route path="/repository/:repoName" element={
                  <ProtectedRoute>
                    <RepositoryDetail />
                  </ProtectedRoute>
                } />
                <Route path="/repository/:repoName/view" element={
                  <ProtectedRoute>
                    <RepositoryView />
                  </ProtectedRoute>
                } />
                <Route path="/docs/:repoName" element={
                  <ProtectedRoute>
                    <DocumentationView />
                  </ProtectedRoute>
                } />
                <Route path="/postman/:repoName" element={
                  <ProtectedRoute>
                    <PostmanView />
                  </ProtectedRoute>
                } />
                <Route path="/graphql/:repoName" element={
                  <ProtectedRoute>
                    <GraphQLPlaygroundView />
                  </ProtectedRoute>
                } />
                <Route path="/grpc-playground/:repoName" element={
                  <ProtectedRoute>
                    <GraphQLView />
                  </ProtectedRoute>
                } />
                <Route path="/api-explorer/:repoName" element={
                  <ProtectedRoute>
                    <APIExplorerView />
                  </ProtectedRoute>
                } />
                <Route path="/api-viewer/:repoName" element={
                  <ProtectedRoute>
                    <SwaggerViewer />
                  </ProtectedRoute>
                } />
                <Route path="/api-hub/:repoName" element={
                  <ProtectedRoute>
                    <APIDocumentationHub />
                  </ProtectedRoute>
                } />
                <Route path="/sync" element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <RepositorySync />
                  </ProtectedRoute>
                } />
                
                {/* Enhanced API Explorer routes */}
                <Route path="/api-explorer-v2/:repoName" element={
                  <ProtectedRoute>
                    <UnifiedApiExplorer />
                  </ProtectedRoute>
                } />
                <Route path="/graphql-enhanced/:repoName" element={
                  <ProtectedRoute>
                    <GraphQLPlaygroundEnhanced />
                  </ProtectedRoute>
                } />
                <Route path="/grpc-explorer/:repoName" element={
                  <ProtectedRoute>
                    <GrpcExplorer />
                  </ProtectedRoute>
                } />
                <Route path="/postman-runner/:repoName" element={
                  <ProtectedRoute>
                    <PostmanCollectionRunner />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin/analytics" element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/performance" element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <PerformanceDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
              </PageTransition>
            </Suspense>
          </Container>
          
          {/* Enhanced Global Search Modal */}
          <EnhancedSearchModal 
            isOpen={isSearchOpen}
            onClose={closeSearch}
          />
          
          {/* Demo Mode - Hidden */}
          <DemoMode 
            isActive={isDemoMode} 
            onToggle={() => setIsDemoMode(!isDemoMode)} 
          />
          
          {/* Keyboard Shortcuts */}
          <KeyboardShortcuts onDemoToggle={() => setIsDemoMode(!isDemoMode)} />
          
          {/* Privacy Consent Banner */}
          <PrivacyConsent />
        </AuthProvider>
        </Router>
      </ThemeProvider>
    </EnhancedErrorBoundary>
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