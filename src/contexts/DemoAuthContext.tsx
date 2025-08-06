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
  enableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user - always available
const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@localhost',
  name: 'Demo User',
  role: UserRole.DEVELOPER,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for demo mode on mount
  useEffect(() => {
    const checkAuth = async () => {
      const isDemoMode = localStorage.getItem('eyns_demo_mode') === 'true';
      if (isDemoMode) {
        setUser(DEMO_USER);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const enableDemoMode = () => {
    localStorage.setItem('eyns_demo_mode', 'true');
    setUser(DEMO_USER);
    navigate('/');
  };

  const login = async (email: string, password: string) => {
    // For demo purposes, always succeed
    if (email && password) {
      enableDemoMode();
    } else {
      throw new Error('Email and password required');
    }
  };

  const loginWithSSO = () => {
    // Just enable demo mode
    enableDemoMode();
  };

  const logout = () => {
    localStorage.removeItem('eyns_demo_mode');
    setUser(null);
    navigate('/login');
  };

  const hasRole = (role: UserRole) => {
    if (!user) return false;
    return user.role === role || user.role === UserRole.ADMIN || user.role === UserRole.DEVELOPER;
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    // Demo user has all read permissions
    return true;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithSSO,
    logout,
    hasRole,
    hasPermission,
    enableDemoMode
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