import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../services/auth/clientAuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithSSO: () => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Always authenticated user
const BYPASS_USER: User = {
  id: 'bypass-user',
  email: 'demo@localhost',
  name: 'Demo User',
  role: UserRole.DEVELOPER,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always authenticated - force bypass
  const [user] = useState(BYPASS_USER);
  const [isAuthenticated] = useState(true);
  const [isLoading] = useState(false);
  
  // Debug logging
  console.log('[BypassAuthContext] Rendering - isAuthenticated:', true);
  console.log('[BypassAuthContext] User:', BYPASS_USER);

  const login = async () => {
    // No-op - already logged in
  };

  const loginWithSSO = () => {
    // No-op - already logged in
  };

  const logout = () => {
    // No-op - can't logout in bypass mode
    window.location.href = '/';
  };

  const hasRole = (role: UserRole) => {
    return true; // Has all roles
  };

  const hasPermission = (permission: string) => {
    return true; // Has all permissions
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithSSO,
    logout,
    hasRole,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};