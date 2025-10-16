/**
 * Authentication Context for React
 * Provides authentication state and methods throughout the application
 */

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, User, AuthTokens, UserRole } from '../services/auth/clientAuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithSSO: () => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secure token storage
const TOKEN_KEY = 'axiom_loom_auth_token';
const REFRESH_TOKEN_KEY = 'axiom_loom_refresh_token';

class SecureStorage {
  static setTokens(tokens: AuthTokens) {
    // In production, consider using httpOnly cookies for better security
    localStorage.setItem(TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  static clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from stored tokens
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = SecureStorage.getAccessToken();
      if (accessToken) {
        try {
          const isValid = await authService.verifyAccessToken(accessToken);
          if (isValid) {
            // Fetch full user data from API
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
            }
          }
        } catch (error) {
          // Token is invalid, try to refresh
          await refreshToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    const refreshTokenValue = SecureStorage.getRefreshToken();
    if (!refreshTokenValue) {
      setUser(null);
      return;
    }

    try {
      const tokens = await authService.refreshAccessToken();
      SecureStorage.setTokens(tokens);
      
      // Get the current user after refreshing token
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        SecureStorage.clearTokens();
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setUser(null);
      SecureStorage.clearTokens();
    }
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (user) {
      // Refresh token 5 minutes before expiration
      const refreshInterval = setInterval(() => {
        refreshToken();
      }, 10 * 60 * 1000); // 10 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [user, refreshToken]);

  // Login with email/password (for development/testing)
  const login = async (email: string, password: string) => {
    // In production, this would call a login API endpoint
    // For now, we'll simulate a login
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? UserRole.ADMIN : UserRole.DEVELOPER,
      organizationId: 'axiom-loom',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const tokens = authService.generateTokens(mockUser);
    SecureStorage.setTokens(tokens);
    setUser(mockUser);
    
    // Redirect to home or previous page
    navigate('/');
  };

  // Login with SSO
  const loginWithSSO = () => {
    const state = Math.random().toString(36).substring(7);
    // Store state in session storage for CSRF protection
    sessionStorage.setItem('oauth_state', state);
    
    const authUrl = authService.getAuthorizationUrl(state);
    window.location.href = authUrl;
  };

  // Logout
  const logout = () => {
    setUser(null);
    SecureStorage.clearTokens();
    navigate('/login');
  };

  // Check if user has permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return authService.hasPermission(permission);
  };

  // Check if user has role
  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role || (user.role === UserRole.ADMIN);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithSSO,
    logout,
    refreshToken,
    hasPermission,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: string
) => {
  return (props: P) => {
    const { isAuthenticated, hasPermission, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate('/login');
      } else if (requiredPermission && !hasPermission(requiredPermission)) {
        navigate('/unauthorized');
      }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return null;
    }

    return <Component {...props} />;
  };
};