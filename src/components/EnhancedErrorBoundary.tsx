/**
 * Enhanced Error Boundary Component
 * 
 * Catches React errors and reports them to monitoring services
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { getErrorTracking } from '../services/monitoring/errorTrackingService';
import { getAnalytics } from '../services/analytics/analyticsService';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background.primary};
  padding: 2rem;
`;

const ErrorCard = styled.div`
  max-width: 600px;
  width: 100%;
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.lg};
  padding: 3rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: ${props => props.theme.colors.status.error}20;
  color: ${props => props.theme.colors.status.error};
  border-radius: 50%;
  margin-bottom: 2rem;
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 1rem;
`;

const ErrorDescription = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ErrorDetails = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: 8px;
  padding: 1rem;
  margin: 2rem 0;
  text-align: left;
`;

const ErrorMessage = styled.pre`
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.status.error};
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
`;

const ErrorStack = styled.pre`
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  white-space: pre-wrap;
  word-break: break-word;
  margin: 1rem 0 0 0;
  max-height: 200px;
  overflow-y: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background-color: ${props.theme.colors.primary.main};
    color: white;
    border: none;

    &:hover {
      background-color: #E6D100;
    }
  ` : `
    background-color: transparent;
    color: ${props.theme.colors.text.primary};
    border: 1px solid ${props.theme.colors.border.light};

    &:hover {
      background-color: ${props.theme.colors.background.secondary};
    }
  `}
`;

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary.main};
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorId = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 2rem;
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
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
  errorId: string | null;
  showDetails: boolean;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      showDetails: false
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Generate error ID
    const errorId = this.state.errorId || `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Report to error tracking service
    try {
      const errorTracking = getErrorTracking();
      errorTracking.captureError(error, {
        errorBoundary: true,
        componentStack: errorInfo.componentStack,
        errorId,
        props: this.props,
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    } catch (trackingError) {
      console.error('Failed to report error to tracking service:', trackingError);
    }

    // Report to analytics
    try {
      const analytics = getAnalytics();
      analytics.trackError(error, {
        errorBoundary: true,
        componentStack: errorInfo.componentStack,
        errorId
      });
    } catch (analyticsError) {
      console.error('Failed to report error to analytics:', analyticsError);
    }

    // Update state with error info
    this.setState({
      errorInfo,
      errorId
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      const { error, errorInfo, errorId, showDetails } = this.state;

      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>
              <AlertTriangle size={40} />
            </ErrorIcon>

            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            
            <ErrorDescription>
              We encountered an unexpected error. Don't worry, our team has been notified 
              and is working to fix this issue. You can try reloading the page or returning 
              to the home page.
            </ErrorDescription>

            {error && (
              <>
                <ToggleButton onClick={this.toggleDetails}>
                  {showDetails ? (
                    <>
                      Hide Details <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Show Details <ChevronDown size={16} />
                    </>
                  )}
                </ToggleButton>

                {showDetails && (
                  <ErrorDetails>
                    <ErrorMessage>{error.toString()}</ErrorMessage>
                    {errorInfo && (
                      <ErrorStack>{errorInfo.componentStack}</ErrorStack>
                    )}
                  </ErrorDetails>
                )}
              </>
            )}

            <ButtonGroup>
              <Button variant="secondary" onClick={this.handleGoHome}>
                <Home size={18} />
                Go to Home
              </Button>
              <Button variant="primary" onClick={this.handleReload}>
                <RefreshCw size={18} />
                Reload Page
              </Button>
            </ButtonGroup>

            {errorId && (
              <ErrorId>Error ID: {errorId}</ErrorId>
            )}
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Function component wrapper for easier use with hooks
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <EnhancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </EnhancedErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default EnhancedErrorBoundary;