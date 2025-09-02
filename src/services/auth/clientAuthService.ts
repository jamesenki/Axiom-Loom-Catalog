/**
 * Client-side Authentication Service for Axiom Loom Catalog
 * Handles token storage, OAuth2 flow, and API authentication
 */

import { getApiUrl } from '../../utils/apiConfig';

// User roles
export enum UserRole {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  VIEWER = 'viewer'
}

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  avatar?: string;
  apiKeys?: ApiKey[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Key interface
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
  permissions: string[];
}

// Auth tokens interface
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Session interface
export interface Session {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// OAuth2 provider configuration
export interface OAuth2Config {
  clientId: string;
  authorizationURL: string;
  tokenURL: string;
  userInfoURL: string;
  callbackURL: string;
  scope: string[];
}

// Axiom Loom SSO OAuth2 configuration (client-side safe)
export const AXIOM_LOOM_SSO_CONFIG: OAuth2Config = {
  clientId: process.env.REACT_APP_AXIOM_LOOM_SSO_CLIENT_ID || '',
  authorizationURL: process.env.REACT_APP_AXIOM_LOOM_SSO_AUTH_URL || 'https://login.axiom-loom.ai/oauth2/authorize',
  tokenURL: process.env.REACT_APP_AXIOM_LOOM_SSO_TOKEN_URL || 'https://login.axiom-loom.ai/oauth2/token',
  userInfoURL: process.env.REACT_APP_AXIOM_LOOM_SSO_USERINFO_URL || 'https://login.axiom-loom.ai/oauth2/userinfo',
  callbackURL: process.env.REACT_APP_AXIOM_LOOM_SSO_CALLBACK_URL || 'http://localhost:3000/auth/callback',
  scope: ['openid', 'profile', 'email']
};

class ClientAuthService {
  private readonly TOKEN_KEY = 'axiom_loom_auth_token';
  private readonly REFRESH_TOKEN_KEY = 'axiom_loom_refresh_token';
  private readonly USER_KEY = 'axiom_loom_user';

  // Store tokens in localStorage
  storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    
    // Calculate expiry time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expiresIn);
    localStorage.setItem('axiom_loom_token_expires', expiresAt.toISOString());
  }

  // Get stored access token
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get stored refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('axiom_loom_token_expires');
    if (!expiresAt) return true;
    
    return new Date() > new Date(expiresAt);
  }

  // Clear all auth data
  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('axiom_loom_token_expires');
  }

  // Store user data
  storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Get stored user
  getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  // Parse JWT token (client-side without verification)
  parseToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  }

  // OAuth2 flow - Generate authorization URL
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: AXIOM_LOOM_SSO_CONFIG.clientId,
      redirect_uri: AXIOM_LOOM_SSO_CONFIG.callbackURL,
      response_type: 'code',
      scope: AXIOM_LOOM_SSO_CONFIG.scope.join(' '),
      state: state
    });

    return `${AXIOM_LOOM_SSO_CONFIG.authorizationURL}?${params.toString()}`;
  }

  // Exchange authorization code for tokens (via backend)
  async exchangeCodeForTokens(code: string): Promise<AuthTokens> {
    const response = await fetch(getApiUrl('/api/auth/callback'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const data = await response.json();
    return data;
  }

  // Refresh access token (via backend)
  async refreshAccessToken(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(getApiUrl('/api/auth/refresh'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const tokens = await response.json();
    this.storeTokens(tokens);
    
    return tokens;
  }

  // Login with credentials (for development/demo)
  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.storeTokens(data.tokens);
    this.storeUser(data.user);
    
    return data;
  }

  // Logout
  async logout(): Promise<void> {
    const token = this.getAccessToken();
    
    if (token) {
      try {
        await fetch(getApiUrl('/api/auth/logout'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    
    this.clearAuth();
  }

  // Get current user from backend
  async getCurrentUser(): Promise<User | null> {
    const token = this.getAccessToken();
    if (!token || this.isTokenExpired()) {
      return null;
    }

    try {
      const response = await fetch(getApiUrl('/api/auth/me'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return null;
      }

      const user = await response.json();
      this.storeUser(user);
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  // Generate API key (via backend)
  async generateApiKey(name: string, permissions: string[]): Promise<ApiKey> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(getApiUrl('/api/auth/api-keys'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, permissions })
    });

    if (!response.ok) {
      throw new Error('Failed to generate API key');
    }

    return response.json();
  }

  // List API keys
  async listApiKeys(): Promise<ApiKey[]> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(getApiUrl('/api/auth/api-keys'), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to list API keys');
    }

    return response.json();
  }

  // Revoke API key
  async revokeApiKey(keyId: string): Promise<void> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(getApiUrl(`/api/auth/api-keys/${keyId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to revoke API key');
    }
  }

  // Check if user has permission
  hasPermission(permission: string): boolean {
    const user = this.getUser();
    if (!user) return false;

    const rolePermissions: Record<UserRole, string[]> = {
      [UserRole.ADMIN]: ['*'], // Admin has all permissions
      [UserRole.DEVELOPER]: [
        'read:apis',
        'read:documentation',
        'create:api_keys',
        'manage:own_api_keys',
        'test:apis',
        'download:collections'
      ],
      [UserRole.VIEWER]: [
        'read:apis',
        'read:documentation'
      ]
    };

    const permissions = rolePermissions[user.role] || [];
    return permissions.includes('*') || permissions.includes(permission);
  }

  // Verify access token is valid
  async verifyAccessToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(getApiUrl('/api/auth/verify'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  // Generate tokens (for demo/development)
  generateTokens(user: User): AuthTokens {
    // In a real app, this would be done server-side
    // For development, we'll generate mock tokens
    const accessToken = btoa(JSON.stringify({ 
      userId: user.id, 
      email: user.email,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + (3600 * 1000) // 1 hour
    }));
    
    const refreshToken = btoa(JSON.stringify({
      userId: user.id,
      type: 'refresh',
      iat: Date.now(),
      exp: Date.now() + (7 * 24 * 3600 * 1000) // 7 days
    }));

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600
    };
  }

  // Create authorization header
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getAccessToken();
    if (!token) return {};
    
    return { Authorization: `Bearer ${token}` };
  }

  // Demo login (for development)
  async demoLogin(role: UserRole = UserRole.DEVELOPER): Promise<{ user: User; tokens: AuthTokens }> {
    const demoUsers = {
      [UserRole.ADMIN]: { email: 'admin@axiom-loom.ai', password: 'admin123' },
      [UserRole.DEVELOPER]: { email: 'developer@axiom-loom.ai', password: 'dev123' },
      [UserRole.VIEWER]: { email: 'viewer@axiom-loom.ai', password: 'view123' }
    };

    const credentials = demoUsers[role];
    return this.login(credentials.email, credentials.password);
  }
}

export const authService = new ClientAuthService();