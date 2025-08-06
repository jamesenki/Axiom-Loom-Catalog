/**
 * Local Authentication Service
 * Simple username/password auth that works completely offline
 */

import { User, UserRole } from './clientAuthService';
import { getApiUrl } from '../../utils/apiConfig';

// Local users database (in production, this would be in a real database)
const LOCAL_USERS = [
  {
    id: '1',
    email: 'admin@localhost',
    password: 'admin', // In production, this would be hashed
    name: 'Local Admin',
    role: UserRole.ADMIN,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'dev@localhost',
    password: 'dev',
    name: 'Local Developer',
    role: UserRole.DEVELOPER,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    email: 'user@localhost',
    password: 'user',
    name: 'Local User',
    role: UserRole.VIEWER,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export class LocalAuthService {
  private TOKEN_KEY = 'eyns_local_token';
  private USER_KEY = 'eyns_local_user';

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(getApiUrl('/api/auth/local-login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      const data = await response.json();
      
      // Store tokens
      localStorage.setItem(this.TOKEN_KEY, data.accessToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
      
      return {
        user: data.user as User,
        token: data.accessToken
      };
    } catch (error) {
      // Fallback to local check for development
      const user = LOCAL_USERS.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw error instanceof Error ? error : new Error('Invalid email or password');
      }
      
      // Create a simple token for fallback
      const token = btoa(JSON.stringify({ userId: user.id, email: user.email, timestamp: Date.now() }));
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      
      // Store in localStorage
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword));
      
      return {
        user: userWithoutPassword as User,
        token
      };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const decoded = JSON.parse(atob(token));
      // Simple check - token is valid for 24 hours
      const isExpired = Date.now() - decoded.timestamp > 24 * 60 * 60 * 1000;
      return !isExpired;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

export const localAuthService = new LocalAuthService();