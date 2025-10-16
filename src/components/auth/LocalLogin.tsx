import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AlertCircle, LogIn, User, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/BypassAuthContext';
import { Container, Button, Input, H1, Text } from '../styled';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.background.primary} 0%, ${props => props.theme.colors.background.secondary} 100%);
`;

const LoginCard = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: ${props => props.theme.spacing[12]};
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
  
  h1 {
    color: ${props => props.theme.colors.primary.black};
    font-size: ${props => props.theme.typography.fontSize['2xl']};
    font-weight: 700;
    margin-bottom: ${props => props.theme.spacing[2]};
  }
  
  p {
    color: ${props => props.theme.colors.text.secondary};
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: ${props => props.theme.spacing[3]};
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.text.secondary};
    width: 20px;
    height: 20px;
  }
  
  input {
    padding-left: ${props => props.theme.spacing[10]};
  }
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme.colors.status.error}10;
  border: 1px solid ${props => props.theme.colors.status.error}30;
  color: ${props => props.theme.colors.status.error};
  padding: ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  svg {
    flex-shrink: 0;
  }
`;

const CredentialsHint = styled.div`
  background-color: ${props => props.theme.colors.info.light};
  border: 1px solid ${props => props.theme.colors.info.main}30;
  padding: ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-top: ${props => props.theme.spacing[4]};
  
  h3 {
    font-size: ${props => props.theme.typography.fontSize.sm};
    font-weight: 600;
    color: ${props => props.theme.colors.info.main};
    margin-bottom: ${props => props.theme.spacing[2]};
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      font-size: ${props => props.theme.typography.fontSize.sm};
      color: ${props => props.theme.colors.text.secondary};
      padding: ${props => props.theme.spacing[1]} 0;
      
      code {
        background: ${props => props.theme.colors.background.secondary};
        padding: ${props => props.theme.spacing[0.5]} ${props => props.theme.spacing[1]};
        border-radius: ${props => props.theme.borderRadius.sm};
        font-family: ${props => props.theme.typography.fontFamily.mono};
      }
    }
  }
`;

export const LocalLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

  const handleQuickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <LoginContainer>
      <Container maxWidth="sm">
        <LoginCard>
          <Logo>
            <h1>Axiom Loom Catalog</h1>
            <p>Local Authentication</p>
          </Logo>

          <Form onSubmit={handleSubmit}>
            {error && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {error}
              </ErrorMessage>
            )}
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <InputWrapper>
                <User />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@localhost"
                  required
                  disabled={isLoading}
                />
              </InputWrapper>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputWrapper>
                <Lock />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />
              </InputWrapper>
            </FormGroup>
            
            <Button
              type="submit"
              disabled={isLoading}
              fullWidth
            >
              <LogIn size={20} />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>
          
          <CredentialsHint>
            <h3>Test Credentials:</h3>
            <ul>
              <li>
                Admin: <code onClick={() => handleQuickLogin('admin@localhost', 'admin')}>admin@localhost / admin</code>
              </li>
              <li>
                Developer: <code onClick={() => handleQuickLogin('dev@localhost', 'dev')}>dev@localhost / dev</code>
              </li>
              <li>
                Viewer: <code onClick={() => handleQuickLogin('user@localhost', 'user')}>user@localhost / user</code>
              </li>
            </ul>
          </CredentialsHint>
        </LoginCard>
      </Container>
    </LoginContainer>
  );
};

export default LocalLogin;