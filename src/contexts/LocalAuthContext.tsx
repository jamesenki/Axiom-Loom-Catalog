import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../services/auth/clientAuthService';
import { localAuthService } from '../services/auth/localAuthService';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localAuthService.getToken();
      if (token) {
        const isValid = await localAuthService.verifyToken(token);
        if (isValid) {
          const currentUser = await localAuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user } = await localAuthService.login(email, password);
      setUser(user);
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  const loginWithSSO = () => {
    // Just redirect to local login
    console.log('SSO disabled - using local authentication');
  };

  const logout = () => {
    localAuthService.logout();
    setUser(null);
    navigate('/login');
  };

  const hasRole = (role: UserRole) => {
    if (!user) return false;
    return user.role === role || user.role === UserRole.ADMIN;
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    // Simple permission model - admins have all permissions
    if (user.role === UserRole.ADMIN) return true;
    
    // Developers have most permissions except admin tasks
    if (user.role === UserRole.DEVELOPER) {
      return !permission.startsWith('admin:');
    }
    
    // Viewers can only read
    return permission.startsWith('read:');
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