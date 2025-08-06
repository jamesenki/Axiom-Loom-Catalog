/**
 * Auth Callback Component
 * Handles OAuth2/SSO callback from EY login
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/BypassAuthContext';

const CallbackContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const CallbackCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 48px;
  text-align: center;
  max-width: 400px;
`;

const Spinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0066cc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Message = styled.p`
  font-size: 18px;
  color: #2e3440;
  margin: 0;
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  padding: 16px;
  color: #c00;
  margin-top: 16px;
`;

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const refreshTokenParam = searchParams.get('refreshToken');
      const errorMessage = searchParams.get('message');

      if (errorMessage) {
        setError(errorMessage);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (token && refreshTokenParam) {
        // Store tokens
        localStorage.setItem('ey_auth_token', token);
        localStorage.setItem('ey_refresh_token', refreshTokenParam);
        
        // For local auth context, we'll just redirect and let the auth check happen on next render
        // Redirect to home or previous page
        const returnUrl = sessionStorage.getItem('auth_return_url') || '/';
        sessionStorage.removeItem('auth_return_url');
        navigate(returnUrl, { replace: true });
      } else {
        setError('Invalid callback parameters');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <CallbackContainer>
      <CallbackCard>
        {error ? (
          <>
            <Message>Authentication failed</Message>
            <ErrorMessage>{error}</ErrorMessage>
            <p style={{ marginTop: '16px', color: '#6c757d' }}>
              Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <Spinner />
            <Message>Completing sign in...</Message>
          </>
        )}
      </CallbackCard>
    </CallbackContainer>
  );
};

export default AuthCallback;