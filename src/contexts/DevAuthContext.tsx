import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Mock user for development
const mockUser: User = {
  id: 'dev-user-1',
  email: 'developer@localhost',
  name: 'Local Developer',
  role: UserRole.ADMIN,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-login in development
  useEffect(() => {
    console.log('Development mode: Auto-authenticating...');
    setUser(mockUser);
    localStorage.setItem('eyns_user', JSON.stringify(mockUser));
    localStorage.setItem('eyns_access_token', 'dev-token');
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(mockUser);
    localStorage.setItem('eyns_user', JSON.stringify(mockUser));
    localStorage.setItem('eyns_access_token', 'dev-token');
    setIsLoading(false);
    navigate('/');
  };

  const loginWithSSO = () => {
    console.log('SSO login disabled in development');
    login('developer@localhost', 'dev');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eyns_user');
    localStorage.removeItem('eyns_access_token');
    navigate('/login');
  };

  const hasRole = (role: UserRole) => {
    return user?.role === role || user?.role === UserRole.ADMIN;
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    // Admin has all permissions in dev mode
    return user.role === UserRole.ADMIN;
  };

  const value = {
    user,
    isAuthenticated: !!user,
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