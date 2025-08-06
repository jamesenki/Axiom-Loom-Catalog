/**
 * Authentication API Routes
 * Handles login, logout, SSO callback, and token management
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  authenticate,
  authorize,
  trackFailedLogin,
  isAccountLocked,
  clearFailedLoginAttempts,
  auditLog,
  createApiKey,
  revokeApiKey
} = require('../middleware/auth.middleware');

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

// Mock user database (in production, use real database)
const users = new Map([
  ['admin@ey.com', {
    id: '1',
    email: 'admin@ey.com',
    password: '$2a$10$XQq2o2l6YGr6./P0gfpWUuOZ7dPJCiIqPjRPUDrPEHmWKH.S6S/fC', // password: admin123
    name: 'Admin User',
    role: 'admin',
    organizationId: 'ey'
  }],
  ['developer@ey.com', {
    id: '2',
    email: 'developer@ey.com',
    password: '$2a$10$XQq2o2l6YGr6./P0gfpWUuOZ7dPJCiIqPjRPUDrPEHmWKH.S6S/fC', // password: dev123
    name: 'Developer User',
    role: 'developer',
    organizationId: 'ey'
  }],
  // Local development users
  ['admin@localhost', {
    id: '3',
    email: 'admin@localhost',
    password: '$2b$10$89B9idU1o6h2Bk9YwUsiNORazAJHXn4O2UjZI0egQzdtHg6izzUGC', // password: admin
    name: 'Local Admin',
    role: 'admin',
    organizationId: 'local'
  }],
  ['dev@localhost', {
    id: '4',
    email: 'dev@localhost',
    password: '$2a$10$2x/ot6znksPn/x7YLBNoYOiomO8VKxAYm7xPJApUKP8Kg9Af7rF3m', // password: dev
    name: 'Local Developer',
    role: 'developer',
    organizationId: 'local'
  }],
  ['user@localhost', {
    id: '5',
    email: 'user@localhost',
    password: '$2a$10$xcDWP8U5AqQyR.KDS1RmFuLqNr7TaYCo8VgE7suo2It1RMpfaLqOy', // password: user
    name: 'Local User',
    role: 'viewer',
    organizationId: 'local'
  }]
]);

// Mock refresh token store (in production, use Redis or database)
const refreshTokens = new Map();

// Generate tokens
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m'
  });

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // Store refresh token
  refreshTokens.set(refreshToken, user.id);

  return {
    accessToken,
    refreshToken,
    expiresIn: 900 // 15 minutes
  };
};

// Login endpoint
router.post('/auth/login', auditLog('login'), async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if account is locked
  if (isAccountLocked(email)) {
    return res.status(423).json({ 
      error: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.' 
    });
  }

  const user = users.get(email);

  if (!user) {
    trackFailedLogin(email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    trackFailedLogin(email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Clear failed attempts on successful login
  clearFailedLoginAttempts(email);

  // Generate tokens
  const tokens = generateTokens(user);

  // Update last login
  user.lastLogin = new Date();

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId
    },
    ...tokens
  });
});

// SSO login initiation
router.get('/auth/sso/login', (req, res) => {
  const state = Math.random().toString(36).substring(7);
  const authorizationUrl = `https://login.ey.com/oauth2/authorize?` +
    `client_id=${process.env.EY_SSO_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.EY_SSO_CALLBACK_URL)}&` +
    `response_type=code&` +
    `scope=openid profile email&` +
    `state=${state}`;

  // Store state for CSRF protection (in production, use Redis)
  res.cookie('oauth_state', state, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 5 * 60 * 1000 // 5 minutes
  });

  res.json({ authorizationUrl });
});

// SSO callback
router.get('/auth/sso/callback', auditLog('sso_login'), async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies.oauth_state;

  // Verify state for CSRF protection
  if (!state || state !== storedState) {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }

  // Clear state cookie
  res.clearCookie('oauth_state');

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://login.ey.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.EY_SSO_CALLBACK_URL,
        client_id: process.env.EY_SSO_CLIENT_ID,
        client_secret: process.env.EY_SSO_CLIENT_SECRET
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const { access_token } = await tokenResponse.json();

    // Get user info
    const userInfoResponse = await fetch('https://login.ey.com/oauth2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userInfo = await userInfoResponse.json();

    // Create or update user
    const user = {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name || userInfo.preferred_username,
      role: userInfo.email.includes('admin') ? 'admin' : 'developer',
      organizationId: 'ey'
    };

    // Generate our own tokens
    const tokens = generateTokens(user);

    // Redirect to frontend with tokens
    const redirectUrl = new URL(process.env.FRONTEND_URL || 'http://localhost:3000');
    redirectUrl.pathname = '/auth/success';
    redirectUrl.searchParams.set('token', tokens.accessToken);
    redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);

    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('SSO callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(error.message)}`);
  }
});

// Refresh token endpoint
router.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  // Check if refresh token exists
  if (!refreshTokens.has(refreshToken)) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    // Get user
    const userId = refreshTokens.get(refreshToken);
    let user = null;
    
    for (const [email, userData] of users) {
      if (userData.id === userId) {
        user = userData;
        break;
      }
    }

    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Delete old refresh token and store new one
    refreshTokens.delete(refreshToken);

    res.json(tokens);
  } catch (error) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// Local login endpoint for development
router.post('/auth/local-login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const user = users.get(email);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // For local users, do simple password check
  if (email.endsWith('@localhost')) {
    const validPassword = (email === 'admin@localhost' && password === 'admin') ||
                         (email === 'dev@localhost' && password === 'dev') ||
                         (email === 'user@localhost' && password === 'user');
    
    if (validPassword) {
      const tokens = generateTokens(user);
      clearFailedLoginAttempts(email);
      
      return res.json({
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId
        }
      });
    }
  }
  
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Logout endpoint
router.post('/auth/logout', authenticate, auditLog('logout'), (req, res) => {
  const { refreshToken } = req.body;

  // Remove refresh token if provided
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/auth/me', authenticate, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    organizationId: req.user.organizationId
  });
});

// Update user profile
router.put('/auth/profile', authenticate, auditLog('profile_update'), async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Find user
  let user = null;
  for (const [email, userData] of users) {
    if (userData.id === userId) {
      user = userData;
      break;
    }
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update name if provided
  if (name) {
    user.name = name;
  }

  // Update password if provided
  if (currentPassword && newPassword) {
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId
  });
});

// API Key Management

// Create API key
router.post('/auth/api-keys', authenticate, authorize('create:api_keys'), auditLog('create_api_key'), async (req, res) => {
  const { name, permissions } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: 'API key name is required' });
  }

  const apiKey = await createApiKey(userId, name, permissions);

  res.json({
    apiKey: apiKey,
    name: name,
    createdAt: new Date(),
    message: 'Save this API key securely. It will not be shown again.'
  });
});

// List API keys
router.get('/auth/api-keys', authenticate, authorize('manage:own_api_keys'), (req, res) => {
  // In production, fetch from database
  res.json({
    apiKeys: [
      {
        id: '1',
        name: 'Development Key',
        lastUsed: new Date('2025-01-30'),
        createdAt: new Date('2025-01-01')
      }
    ]
  });
});

// Revoke API key
router.delete('/auth/api-keys/:keyId', authenticate, authorize('manage:own_api_keys'), auditLog('revoke_api_key'), (req, res) => {
  const { keyId } = req.params;
  
  // In production, verify ownership and remove from database
  revokeApiKey(keyId);
  
  res.json({ message: 'API key revoked successfully' });
});

// Change password (for development)
router.post('/auth/change-password', async (req, res) => {
  const { email, newPassword } = req.body;
  
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }
  
  const user = users.get(email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  user.password = await bcrypt.hash(newPassword, 10);
  res.json({ message: 'Password updated successfully' });
});

module.exports = router;