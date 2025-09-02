/**
 * Login Component
 * Provides login functionality with Axiom Loom SSO and development login
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/BypassAuthContext';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 48px;
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 28px;
    color: #2e3440;
    margin: 0;
    font-weight: 700;
  }
  
  p {
    color: #6c757d;
    margin-top: 8px;
    font-size: 16px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #2e3440;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
  
  &::placeholder {
    color: #a0a0a0;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'secondary' ? `
    background: white;
    color: #0066cc;
    border: 2px solid #0066cc;
    
    &:hover {
      background: #f0f7ff;
    }
  ` : `
    background: #0066cc;
    color: white;
    
    &:hover {
      background: #0052a3;
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  text-align: center;
  position: relative;
  margin: 24px 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e1e4e8;
  }
  
  span {
    background: white;
    padding: 0 16px;
    position: relative;
    color: #6c757d;
    font-size: 14px;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  padding: 12px 16px;
  color: #c00;
  font-size: 14px;
`;

const DevModeWarning = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 6px;
  padding: 12px 16px;
  color: #856404;
  font-size: 13px;
  margin-top: 16px;
`;

const TestCredentials = styled.div`
  background: #f0f7ff;
  border: 1px solid #cce5ff;
  border-radius: 6px;
  padding: 16px;
  margin-top: 16px;
  
  h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #004085;
  }
  
  code {
    display: block;
    background: #e7f3ff;
    padding: 4px 8px;
    border-radius: 4px;
    margin: 4px 0;
    font-size: 13px;
    font-family: 'Monaco', 'Consolas', monospace;
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithSSO } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = () => {
    setIsLoading(true);
    loginWithSSO();
  };

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <h1>Axiom Loom Catalog</h1>
          <p>Sign in to continue</p>
        </Logo>

        <Button 
          type="button" 
          onClick={handleSSOLogin}
          disabled={isLoading}
        >
          Sign in with Axiom Loom SSO
        </Button>

        {isDevelopment && (
          <>
            <Divider>
              <span>or</span>
            </Divider>

            <Form onSubmit={handleDevLogin}>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@axiom-loom.ai"
                  required
                  disabled={isLoading}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </FormGroup>

              <Button 
                type="submit" 
                variant="secondary"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in (Dev Mode)'}
              </Button>
            </Form>

            <DevModeWarning>
              <strong>Development Mode:</strong> This login form is only available in development. 
              In production, only Axiom Loom SSO authentication is available.
            </DevModeWarning>

            <TestCredentials>
              <h4>Test Credentials:</h4>
              <code>admin@axiom-loom.ai / admin123</code>
              <code>developer@axiom-loom.ai / dev123</code>
            </TestCredentials>
          </>
        )}
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;