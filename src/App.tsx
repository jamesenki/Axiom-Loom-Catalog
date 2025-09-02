import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import combinedTheme from './styles/combinedTheme';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import SyncStatus from './components/SyncStatus';
import { SyncProvider, useSyncContext } from './contexts/SyncContext';
import { AuthProvider } from './contexts/BypassAuthContext';
import { Container } from './components/styled';
import { FullPageLoading } from './components/styled/Loading';
import { useGlobalSearch } from './hooks/useGlobalSearch';
import { UserRole } from './services/auth/clientAuthService';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageTransition from './components/PageTransition';
import DemoMode from './components/DemoMode';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import EnhancedSearchModal from './components/EnhancedSearchModal';
import ErrorBoundary from './components/ErrorBoundary';
import { NeuralBackground } from './components/NeuralBackground';
import styled, { keyframes, css } from 'styled-components';

// Keyframes animations
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Add error logging only in browser environment
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.message, e.error);
    if (e.message.includes('button')) {
      console.error('Button error stack:', e.error?.stack);
    }
  });
}

// Lazy load components for better performance
const RepositoryList = lazy(() => import('./components/RepositoryList'));
const RepositoryDetail = lazy(() => import('./components/RepositoryDetailRedesigned'));
const RepositoryView = lazy(() => import('./components/RepositoryView'));
const DocumentationView = lazy(() => import('./components/DocumentationView'));
const PostmanView = lazy(() => import('./components/PostmanView'));
const GraphQLView = lazy(() => import('./components/GraphQLView'));
const GraphQLPlaygroundView = lazy(() => import('./components/GraphQLPlaygroundSimple'));
const APIExplorerView = lazy(() => import('./components/APIExplorerView'));
const AllAPIsView = lazy(() => import('./components/AllAPIsView'));
const SwaggerViewer = lazy(() => import('./components/SwaggerViewer'));
const APIDocumentationHub = lazy(() => import('./components/APIDocumentationHub'));
const RepositorySync = lazy(() => import('./components/RepositorySync'));

// New enhanced API components
const UnifiedApiExplorer = lazy(() => import('./components/UnifiedApiExplorer'));
const GraphQLPlaygroundEnhanced = lazy(() => import('./components/GraphQLPlaygroundSimple'));
const GrpcExplorer = lazy(() => import('./components/GrpcExplorer'));
const PostmanCollectionRunner = lazy(() => import('./components/PostmanCollectionRunner'));

// Auth components
const Login = lazy(() => import('./components/auth/LocalLogin'));
const AuthCallback = lazy(() => import('./components/auth/AuthCallback'));
const UserProfile = lazy(() => import('./components/auth/UserProfile'));
const ApiKeyManagement = lazy(() => import('./components/auth/ApiKeyManagement'));

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background: #FFFFFF !important;  /* FORCE WHITE background */
  background-color: #FFFFFF !important;
  background-image: none !important;
  position: relative;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding-top: 80px; /* Add space for fixed header */
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #00C9FF;
  font-size: 1.2rem;
  
  &::before {
    content: '';
    width: 80px;
    height: 80px;
    border: 4px solid rgba(139, 92, 246, 0.1);
    border-top-color: #8B5CF6;
    border-radius: 50%;
    animation: ${css`${spin}`} 1s linear infinite;
    margin-right: 1rem;
  }
`;

// Loading component
const PageLoader = () => (
  <LoadingContainer>
    Loading Quantum Interface...
  </LoadingContainer>
);

function AppContent() {
  const [showSyncStatus, setShowSyncStatus] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { updateSyncResult } = useSyncContext();
  const { isSearchOpen, closeSearch } = useGlobalSearch();

  useEffect(() => {
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
    <ErrorBoundary>
      <ThemeProvider theme={combinedTheme}>
        <GlobalStyles />
        <AppContainer>
          {/* Neural network background - DISABLED FOR READABILITY */}
          {/* <NeuralBackground 
            nodeCount={60}
            maxConnections={6}
            connectionDistance={200}
            animationSpeed={1}
            interactive={true}
            opacity={0.4}
            colorScheme="quantum"
          /> */}
          
          <ContentWrapper>
            <Router>
              <AuthProvider>
                <Header />
                {showSyncStatus && (
                  <div style={{
                    position: 'fixed',
                    top: '100px',
                    right: '16px',
                    width: '384px',
                    zIndex: 1000
                  }}>
                    <SyncStatus />
                  </div>
                )}

                {isDemoMode && <DemoMode isActive={isDemoMode} onToggle={() => setIsDemoMode(!isDemoMode)} />}
                <KeyboardShortcuts />
                
                {isSearchOpen && (
                  <EnhancedSearchModal 
                    isOpen={isSearchOpen}
                    onClose={closeSearch}
                  />
                )}

                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<PageTransition><RepositoryList /></PageTransition>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    
                    {/* Repository routes */}
                    <Route path="/repositories" element={<PageTransition><RepositoryList /></PageTransition>} />
                    <Route path="/repository/:repoName" element={<PageTransition><RepositoryDetail /></PageTransition>} />
                    <Route path="/repository/:repoName/view" element={<PageTransition><RepositoryView /></PageTransition>} />
                    
                    {/* Documentation routes */}
                    <Route path="/docs" element={<PageTransition><APIDocumentationHub /></PageTransition>} />
                    <Route path="/docs/:repoName" element={<PageTransition><DocumentationView /></PageTransition>} />
                    <Route path="/docs/:repoName/*" element={<PageTransition><DocumentationView /></PageTransition>} />
                    
                    {/* API routes */}
                    <Route path="/apis" element={<PageTransition><AllAPIsView /></PageTransition>} />
                    <Route path="/api-explorer" element={<PageTransition><UnifiedApiExplorer /></PageTransition>} />
                    <Route path="/api-explorer/:repoName" element={<PageTransition><APIExplorerView /></PageTransition>} />
                    <Route path="/api/:repoName/swagger" element={<PageTransition><SwaggerViewer /></PageTransition>} />
                    
                    {/* GraphQL routes */}
                    <Route path="/graphql/:repoName" element={<PageTransition><GraphQLView /></PageTransition>} />
                    <Route path="/graphql-playground/:repoName" element={<PageTransition><GraphQLPlaygroundEnhanced /></PageTransition>} />
                    
                    {/* Postman routes */}
                    <Route path="/postman/:repoName" element={<PageTransition><PostmanView /></PageTransition>} />
                    <Route path="/postman-runner/:repoName" element={<PageTransition><PostmanCollectionRunner /></PageTransition>} />
                    
                    {/* gRPC routes */}
                    <Route path="/grpc/:repoName" element={<PageTransition><GrpcExplorer /></PageTransition>} />
                    <Route path="/grpc-playground/:repoName" element={<PageTransition><GrpcExplorer /></PageTransition>} />
                    
                    {/* Protected routes */}
                    <Route path="/sync" element={
                      <ProtectedRoute requiredRole={UserRole.ADMIN}>
                        <PageTransition><RepositorySync /></PageTransition>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/profile" element={
                      <ProtectedRoute requiredRole={UserRole.DEVELOPER}>
                        <PageTransition><UserProfile /></PageTransition>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/api-keys" element={
                      <ProtectedRoute requiredRole={UserRole.ADMIN}>
                        <PageTransition><ApiKeyManagement /></PageTransition>
                      </ProtectedRoute>
                    } />
                    
                    {/* Fallback route */}
                    <Route path="*" element={<PageTransition><RepositoryList /></PageTransition>} />
                  </Routes>
                </Suspense>
              </AuthProvider>
            </Router>
          </ContentWrapper>
        </AppContainer>
      </ThemeProvider>
    </ErrorBoundary>
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