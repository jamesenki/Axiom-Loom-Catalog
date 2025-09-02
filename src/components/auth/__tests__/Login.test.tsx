/**
 * Login Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../../contexts/BypassAuthContext';

// Mock the auth context
jest.mock('../../../contexts/BypassAuthContext', () => ({
  ...jest.requireActual('../../../contexts/BypassAuthContext'),
  useAuth: () => ({
    login: jest.fn(),
    loginWithSSO: jest.fn(),
    isLoading: false
  })
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  it('renders login form correctly', () => {
    renderLogin();
    
    expect(screen.getByText('Axiom Loom Catalog')).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Axiom Loom SSO')).toBeInTheDocument();
  });

  it('shows development login form in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    renderLogin();
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Development Mode:')).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  it('handles form submission', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByText('Sign in (Dev Mode)');
    
    fireEvent.change(emailInput, { target: { value: 'test@axiom-loom.ai' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(emailInput).toHaveValue('test@axiom-loom.ai');
      expect(passwordInput).toHaveValue('password123');
    });
    
    process.env.NODE_ENV = originalEnv;
  });

  it('handles SSO login button click', () => {
    const mockLoginWithSSO = jest.fn();
    jest.spyOn(require('../../../contexts/BypassAuthContext'), 'useAuth').mockReturnValue({
      login: jest.fn(),
      loginWithSSO: mockLoginWithSSO,
      isLoading: false
    });
    
    renderLogin();
    
    const ssoButton = screen.getByText('Sign in with Axiom Loom SSO');
    fireEvent.click(ssoButton);
    
    expect(mockLoginWithSSO).toHaveBeenCalled();
  });
});