import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react';
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
  background: ${props => props.theme.colors?.background?.primary || '#0A0A1B'};
  padding: ${props => props.theme.spacing?.[8] || '2rem'};
`;

const ErrorCard = styled.div`
  background: ${props => props.theme.colors?.background?.primary || '#0A0A1B'};
  border: 1px solid ${props => props.theme.colors?.border?.light || 'rgba(139, 92, 246, 0.2)'};
  border-radius: ${props => props.theme.borderRadius?.xl || '1rem'};
  padding: ${props => props.theme.spacing?.[12] || '3rem'};
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: ${props => props.theme.shadows?.xl || '0 20px 25px -5px rgba(0, 0, 0, 0.1)'};
  animation: ${css`${shake}`} 0.5s ease-in-out;
`;

const ErrorIcon = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto ${props => props.theme.spacing?.[6] || '1.5rem'};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors?.semantic?.error || '#ef4444'}20 0%, 
    ${props => props.theme.colors?.semantic?.error || '#ef4444'}10 100%
  );
  border-radius: ${props => props.theme.borderRadius?.['2xl'] || '1.5rem'};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.theme.colors?.semantic?.error || '#ef4444'}30;

  svg {
    color: ${props => props.theme.colors?.semantic?.error || '#ef4444'};
  }
`;

const ErrorTitle = styled.h1`
  font-family: ${props => props.theme.typography?.fontFamily?.primary || 'Inter, sans-serif'};
  font-size: ${props => props.theme.typography?.fontSize?.['4xl'] || '2.25rem'};
  font-weight: ${props => props.theme.typography?.fontWeight?.bold || '700'};
  color: ${props => props.theme.colors?.text?.primary || '#ffffff'};
  margin-bottom: ${props => props.theme.spacing?.[4] || '1rem'};
  
  span {
    background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const ErrorMessage = styled.p`
  font-family: ${props => props.theme.typography?.fontFamily?.primary || 'Inter, sans-serif'};
  font-size: ${props => props.theme.typography?.fontSize?.lg || '1.125rem'};
  color: ${props => props.theme.colors?.text?.secondary || '#94A3B8'};
  margin-bottom: ${props => props.theme.spacing?.[8] || '2rem'};
  line-height: 1.6;
`;

const ErrorDetails = styled.div`
  background: ${props => props.theme.colors?.background?.secondary || '#141429'};
  border: 1px solid ${props => props.theme.colors?.border?.light || 'rgba(139, 92, 246, 0.2)'};
  border-radius: ${props => props.theme.borderRadius?.lg || '0.75rem'};
  padding: ${props => props.theme.spacing?.[6] || '1.5rem'};
  margin: ${props => props.theme.spacing?.[8] || '2rem'} 0;
  text-align: left;
`;

const ErrorStack = styled.pre`
  font-family: ${props => props.theme.typography?.fontFamily?.mono || 'JetBrains Mono, monospace'};
  font-size: ${props => props.theme.typography?.fontSize?.sm || '0.875rem'};
  color: ${props => props.theme.colors?.text?.tertiary || '#64748B'};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors?.background?.tertiary || '#1E293B'};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors?.border?.medium || 'rgba(139, 92, 246, 0.4)'};
    border-radius: 4px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing?.[4] || '1rem'};
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.[2] || '0.5rem'};
  transition: all 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
  }
`;

const HelpSection = styled.div`
  margin-top: ${props => props.theme.spacing?.[8] || '2rem'};
  padding-top: ${props => props.theme.spacing?.[8] || '2rem'};
  border-top: 1px solid ${props => props.theme.colors?.border?.light || 'rgba(139, 92, 246, 0.2)'};
`;

const HelpTitle = styled.h3`
  font-family: ${props => props.theme.typography?.fontFamily?.primary || 'Inter, sans-serif'};
  font-size: ${props => props.theme.typography?.fontSize?.lg || '1.125rem'};
  font-weight: ${props => props.theme.typography?.fontWeight?.semibold || '600'};
  color: ${props => props.theme.colors?.text?.secondary || '#94A3B8'};
  margin-bottom: ${props => props.theme.spacing?.[4] || '1rem'};
`;

const HelpList = styled.ul`
  text-align: left;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const HelpItem = styled.li`
  font-family: ${props => props.theme.typography?.fontFamily?.primary || 'Inter, sans-serif'};
  font-size: ${props => props.theme.typography?.fontSize?.base || '1rem'};
  color: ${props => props.theme.colors?.text?.tertiary || '#64748B'};
  margin-bottom: ${props => props.theme.spacing?.[2] || '0.5rem'};
  padding-left: ${props => props.theme.spacing?.[6] || '1.5rem'};
  position: relative;
  
  &:before {
    content: '→';
    position: absolute;
    left: 0;
    color: ${props => props.theme.colors?.primary?.main || '#8B5CF6'};
  }
`;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to external service if needed
    if (process.env.NODE_ENV === 'production') {
      // Could send to error tracking service here
      console.error('Production error:', {
        message: error.toString(),
        stack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportBug = () => {
    const subject = encodeURIComponent('Bug Report: Application Error');
    const body = encodeURIComponent(`
Error: ${this.state.error?.toString() || 'Unknown error'}

Stack Trace:
${this.state.error?.stack || 'No stack trace available'}

Component Stack:
${this.state.errorInfo?.componentStack || 'No component stack available'}

User Agent: ${navigator.userAgent}
URL: ${window.location.href}
Time: ${new Date().toISOString()}
    `);
    
    window.open(`mailto:support@axiomloom.ai?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>
              <AlertTriangle size={48} />
            </ErrorIcon>
            
            <ErrorTitle>
              <span>Quantum Disruption Detected</span>
            </ErrorTitle>
            
            <ErrorMessage>
              The neural network encountered an unexpected quantum state. 
              Our AI agents are analyzing the anomaly.
            </ErrorMessage>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <HelpTitle>Error Details</HelpTitle>
                <ErrorStack>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </ErrorStack>
              </ErrorDetails>
            )}

            <ActionButtons>
              <ActionButton variant="primary" onClick={this.handleReset}>
                <RefreshCw />
                Try Again
              </ActionButton>
              
              <ActionButton variant="secondary" onClick={this.handleReload}>
                <RefreshCw />
                Reload Page
              </ActionButton>
              
              <ActionButton variant="secondary" onClick={this.handleGoHome}>
                <Home />
                Go Home
              </ActionButton>
              
              {process.env.NODE_ENV === 'development' && (
                <ActionButton variant="ghost" onClick={this.handleReportBug}>
                  <Bug />
                  Report Bug
                </ActionButton>
              )}
            </ActionButtons>

            <HelpSection>
              <HelpTitle>What can you do?</HelpTitle>
              <HelpList>
                <HelpItem>Try refreshing the page</HelpItem>
                <HelpItem>Clear your browser cache and cookies</HelpItem>
                <HelpItem>Check your internet connection</HelpItem>
                <HelpItem>Try again in a few moments</HelpItem>
                {this.state.errorCount > 2 && (
                  <HelpItem>Contact support if the issue persists</HelpItem>
                )}
              </HelpList>
            </HelpSection>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;