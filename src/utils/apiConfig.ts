/**
 * API Configuration Helper
 * Ensures correct API URL in both development and production
 */

// Helper to get base API URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const getApiUrl = (endpoint: string): string => {
  // In production with explicit API URL, use absolute URLs
  // In development, use relative URLs (proxy will handle routing)
  if (API_BASE_URL && process.env.NODE_ENV === 'production') {
    // Remove leading slash if present to avoid double slashes
    const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${path}`;
  }
  // Development mode: use relative URLs (proxied)
  return endpoint;
};

// Common API endpoints
export const API_ENDPOINTS = {
  repositories: '/api/repositories',
  health: '/api/health',
  apis: '/api/apis',
  docs: '/api/docs',
  auth: '/api/auth'
};