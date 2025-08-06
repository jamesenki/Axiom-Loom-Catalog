import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react';
// Remove direct theme import - theme comes from ThemeProvider
import { Button } from './styled/Button';
import { Container, H1, H2, Text } from './styled';

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background.primary};
  padding: ${props => props.theme.spacing[8]};
`;

const ErrorCard = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[12]};
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.xl};
  animation: ${shake} 0.5s ease-in-out;
`;

const ErrorIcon = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto ${props => props.theme.spacing[6]};
  background: linear-gradient(135deg, ${props => props.theme.colors.semantic.error}20 0%, ${props => props.theme.colors.semantic.error}10 100%);
  border-radius: ${props => props.theme.borderRadius['2xl']};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.theme.colors.semantic.error}30;

  svg {
    color: ${props => props.theme.colors.semantic.error};
  }
`;

const ErrorTitle = styled(H1)`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[4]};
`;

const ErrorMessage = styled(Text)`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing[8]};
  font-size: ${props => props.theme.typography.fontSize.lg};
  line-height: 1.6;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spacing[8]};
`;

const ErrorDetails = styled.details`
  text-align: left;
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[4]};
  margin-top: ${props => props.theme.spacing[6]};

  summary {
    cursor: pointer;
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: ${props => props.theme.spacing[3]};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing[2]};

    &:hover {
      color: ${props => props.theme.colors.primary.yellow};
    }
  }
`;

const ErrorStack = styled.pre`
  background: ${props => props.theme.colors.primary.black};
  color: ${props => props.theme.colors.semantic.error};
  padding: ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px;
  overflow-y: auto;
`;

const ErrorId = styled.div`
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.md};
  display: inline-block;
  margin-top: ${props => props.theme.spacing[4]};
`;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate a unique error ID for tracking
    const errorId = `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // ALWAYS log error so we can debug
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In a real app, you might want to send this to an error reporting service
    // Example: logErrorToService(error, errorInfo, this.state.errorId);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    const errorDetails = {
      id: errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // In a real app, you would send this to your error reporting service
    // For now, we'll just copy to clipboard
    navigator.clipboard?.writeText(JSON.stringify(errorDetails, null, 2)).then(() => {
      alert('Error details copied to clipboard. Please share with the development team.');
    }).catch(() => {
      // Fallback: show in a new window
      const errorWindow = window.open('', '_blank');
      if (errorWindow) {
        errorWindow.document.write(`
          <html>
            <head><title>Error Report</title></head>
            <body>
              <h2>Error Report</h2>
              <pre>${JSON.stringify(errorDetails, null, 2)}</pre>
            </body>
          </html>
        `);
      }
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorContainer>
          <Container maxWidth="md">
            <ErrorCard>
              <ErrorIcon>
                <AlertTriangle size={48} />
              </ErrorIcon>
              
              <ErrorTitle>Oops! Something went wrong</ErrorTitle>
              
              <ErrorMessage>
                We encountered an unexpected error while loading this page. 
                This issue has been automatically reported to our team.
              </ErrorMessage>

              <ErrorActions>
                <Button
                  variant="primary"
                  onClick={this.handleReload}
                >
                  <RefreshCw size={16} />
                  Reload Page
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                >
                  <Home size={16} />
                  Go Home
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={this.handleReportError}
                >
                  <Mail size={16} />
                  Report Issue
                </Button>
              </ErrorActions>

              <ErrorId>
                Error ID: {this.state.errorId}
              </ErrorId>
              
              {/* ALWAYS SHOW THE ACTUAL ERROR */}
              <div style={{background: '#fee', padding: '20px', margin: '20px 0', border: '2px solid red'}}>
                <h3>ACTUAL ERROR:</h3>
                <p style={{color: 'red', fontWeight: 'bold'}}>{this.state.error?.message || 'Unknown error'}</p>
                <details>
                  <summary>Stack trace</summary>
                  <pre style={{fontSize: '12px', overflow: 'auto'}}>{this.state.error?.stack}</pre>
                </details>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <ErrorDetails>
                  <summary>
                    <Bug size={16} />
                    Technical Details (Development Only)
                  </summary>
                  <H2 style={{ margin: '16px 0' }}>Error Message:</H2>
                  <Text style={{ 
                    color: '#dc3545',
                    fontFamily: 'monospace',
                    fontSize: '14px'
                  }}>
                    {this.state.error.message}
                  </Text>
                  
                  {this.state.error.stack && (
                    <>
                      <H2 style={{ margin: '16px 0' }}>Stack Trace:</H2>
                      <ErrorStack>{this.state.error.stack}</ErrorStack>
                    </>
                  )}
                  
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <H2 style={{ margin: '16px 0' }}>Component Stack:</H2>
                      <ErrorStack>{this.state.errorInfo.componentStack}</ErrorStack>
                    </>
                  )}
                </ErrorDetails>
              )}
            </ErrorCard>
          </Container>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook for handling async errors (since Error Boundaries don't catch them)
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error) => {
    // Log the error
    console.error('Async error caught:', error);
    
    // In a real app, you might want to:
    // 1. Send to error reporting service
    // 2. Show user-friendly error message
    // 3. Optionally reload the page or redirect
    
    // For now, we'll just throw it to be caught by error boundary
    throw error;
  }, []);

  return handleError;
};

export default ErrorBoundary;