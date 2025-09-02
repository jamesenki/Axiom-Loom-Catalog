/**
 * API Configuration Helper
 * Ensures correct API URL in both development and production
 */

export const getApiUrl = (endpoint: string): string => {
  // In production, use the environment variable or default to localhost:3001
  if (process.env.NODE_ENV === 'production') {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    return `${apiUrl}${endpoint}`;
  }
  
  // In development, use relative URL (proxy will handle it)
  return endpoint;
};

// Helper to get base API URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Common API endpoints
export const API_ENDPOINTS = {
  repositories: '/api/repositories',
  health: '/api/health',
  apis: '/api/apis',
  docs: '/api/docs',
  auth: '/api/auth'
};