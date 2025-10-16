/**
 * API Configuration Helper
 * Ensures correct API URL in both development and production
 */

export const getApiUrl = (endpoint: string): string => {
  // Always use relative URLs - works in both dev (via proxy) and production (via Azure routing)
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