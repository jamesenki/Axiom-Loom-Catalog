/**
 * Authentication Service for Axiom Loom Catalog
 * Handles OAuth2/OIDC, JWT tokens, and API key authentication
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Configuration - In production, these should come from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '15m';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

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
  clientSecret: string;
  authorizationURL: string;
  tokenURL: string;
  userInfoURL: string;
  callbackURL: string;
  scope: string[];
}

// Axiom Loom SSO OAuth2 configuration
export const AXIOM_LOOM_SSO_CONFIG: OAuth2Config = {
  clientId: process.env.AXIOM_LOOM_SSO_CLIENT_ID || '',
  clientSecret: process.env.AXIOM_LOOM_SSO_CLIENT_SECRET || '',
  authorizationURL: process.env.AXIOM_LOOM_SSO_AUTH_URL || 'https://login.axiom-loom.ai/oauth2/authorize',
  tokenURL: process.env.AXIOM_LOOM_SSO_TOKEN_URL || 'https://login.axiom-loom.ai/oauth2/token',
  userInfoURL: process.env.AXIOM_LOOM_SSO_USERINFO_URL || 'https://login.axiom-loom.ai/oauth2/userinfo',
  callbackURL: process.env.AXIOM_LOOM_SSO_CALLBACK_URL || 'http://localhost:3000/auth/callback',
  scope: ['openid', 'profile', 'email']
};

class AuthService {
  // Generate JWT tokens
  generateTokens(user: User): AuthTokens {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRATION } as jwt.SignOptions
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 minutes in seconds
    };
  }

  // Verify access token
  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  // Verify refresh token
  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
    const decoded = this.verifyRefreshToken(refreshToken);
    
    // In production, fetch user from database
    const user = await this.getUserById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    return this.generateTokens(user);
  }

  // Generate API key
  generateApiKey(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = 'axiom_loom_';
    
    for (let i = 0; i < 32; i++) {
      apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return apiKey;
  }

  // Hash API key for storage
  async hashApiKey(apiKey: string): Promise<string> {
    return bcrypt.hash(apiKey, 10);
  }

  // Verify API key
  async verifyApiKey(apiKey: string, hashedKey: string): Promise<boolean> {
    return bcrypt.compare(apiKey, hashedKey);
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

  // OAuth2 flow - Exchange code for tokens
  async exchangeCodeForTokens(code: string): Promise<any> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: AXIOM_LOOM_SSO_CONFIG.callbackURL,
      client_id: AXIOM_LOOM_SSO_CONFIG.clientId,
      client_secret: AXIOM_LOOM_SSO_CONFIG.clientSecret
    });

    const response = await fetch(AXIOM_LOOM_SSO_CONFIG.tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    return response.json();
  }

  // OAuth2 flow - Get user info
  async getUserInfo(accessToken: string): Promise<any> {
    const response = await fetch(AXIOM_LOOM_SSO_CONFIG.userInfoURL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  // Create or update user from OAuth2 data
  async createOrUpdateUserFromOAuth(oauthData: any): Promise<User> {
    // In production, this would interact with a database
    // For now, we'll create a user object
    const user: User = {
      id: oauthData.sub || oauthData.id,
      email: oauthData.email,
      name: oauthData.name || oauthData.preferred_username,
      role: this.determineUserRole(oauthData.email),
      organizationId: 'axiom-loom',
      avatar: oauthData.picture,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return user;
  }

  // Determine user role based on email or other criteria
  private determineUserRole(email: string): UserRole {
    // In production, this would check against a database or LDAP
    if (email.endsWith('@axiom-loom.ai')) {
      if (email.includes('admin')) {
        return UserRole.ADMIN;
      }
      return UserRole.DEVELOPER;
    }
    return UserRole.VIEWER;
  }

  // Mock function - In production, this would fetch from database
  private async getUserById(userId: string): Promise<User | null> {
    // Mock implementation
    return {
      id: userId,
      email: 'user@axiom-loom.ai',
      name: 'Test User',
      role: UserRole.DEVELOPER,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Check if user has permission
  hasPermission(user: User, permission: string): boolean {
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

  // Rate limiting key for user
  getRateLimitKey(user: User): string {
    return `rate_limit:${user.id}:${user.role}`;
  }

  // Get rate limit for role
  getRateLimit(role: UserRole): { windowMs: number; max: number } {
    const limits = {
      [UserRole.ADMIN]: { windowMs: 15 * 60 * 1000, max: 1000 }, // 1000 requests per 15 minutes
      [UserRole.DEVELOPER]: { windowMs: 15 * 60 * 1000, max: 500 }, // 500 requests per 15 minutes
      [UserRole.VIEWER]: { windowMs: 15 * 60 * 1000, max: 100 } // 100 requests per 15 minutes
    };

    return limits[role] || limits[UserRole.VIEWER];
  }
}

export const authService = new AuthService();