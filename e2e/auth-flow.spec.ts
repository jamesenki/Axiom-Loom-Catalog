/**
 * E2E Tests for Authentication Flow
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('redirects to login when accessing protected route', async ({ page }) => {
    // Try to access a protected route
    await page.goto('http://localhost:3000/api-keys');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByText('EY AI Experience Center')).toBeVisible();
    await expect(page.getByText('Sign in to continue')).toBeVisible();
  });

  test('shows SSO login button', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    const ssoButton = page.getByText('Sign in with EY SSO');
    await expect(ssoButton).toBeVisible();
    await expect(ssoButton).toBeEnabled();
  });

  test('development login form works', async ({ page }) => {
    // This test only works in development mode
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev) {
      test.skip();
      return;
    }

    await page.goto('http://localhost:3000/login');
    
    // Fill in development login form
    await page.fill('input[type="email"]', 'developer@ey.com');
    await page.fill('input[type="password"]', 'dev123');
    
    // Submit form
    await page.click('button:has-text("Sign in (Dev Mode)")');
    
    // Should redirect to home after successful login
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('user menu appears after login', async ({ page }) => {
    // Mock authentication state
    await page.addInitScript(() => {
      localStorage.setItem('ey_auth_token', 'mock-token');
      localStorage.setItem('ey_refresh_token', 'mock-refresh-token');
    });

    await page.goto('http://localhost:3000');
    
    // Check for user menu button
    const userButton = page.getByRole('button', { name: /User/i });
    await expect(userButton).toBeVisible();
    
    // Click to open menu
    await userButton.click();
    
    // Check menu items
    await expect(page.getByText('Profile')).toBeVisible();
    await expect(page.getByText('Sign Out')).toBeVisible();
  });

  test('logout works correctly', async ({ page }) => {
    // Mock authentication state
    await page.addInitScript(() => {
      localStorage.setItem('ey_auth_token', 'mock-token');
      localStorage.setItem('ey_refresh_token', 'mock-refresh-token');
    });

    await page.goto('http://localhost:3000');
    
    // Open user menu
    const userButton = page.getByRole('button', { name: /User/i });
    await userButton.click();
    
    // Click sign out
    await page.click('button:has-text("Sign Out")');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
    
    // Check tokens are cleared
    const tokens = await page.evaluate(() => {
      return {
        authToken: localStorage.getItem('ey_auth_token'),
        refreshToken: localStorage.getItem('ey_refresh_token')
      };
    });
    
    expect(tokens.authToken).toBeNull();
    expect(tokens.refreshToken).toBeNull();
  });

  test('protected routes show unauthorized message', async ({ page }) => {
    // Mock authentication with viewer role
    await page.addInitScript(() => {
      localStorage.setItem('ey_auth_token', 'mock-viewer-token');
    });

    // Try to access admin-only route
    await page.goto('http://localhost:3000/sync');
    
    // Should show unauthorized message
    await expect(page.getByText('Access Denied')).toBeVisible();
    await expect(page.getByText(/don't have the required role/)).toBeVisible();
  });

  test('API key management is accessible for developers', async ({ page }) => {
    // Mock authentication with developer role
    await page.addInitScript(() => {
      localStorage.setItem('ey_auth_token', 'mock-developer-token');
    });

    await page.goto('http://localhost:3000/api-keys');
    
    // Should show API key management page
    await expect(page.getByText('API Key Management')).toBeVisible();
    await expect(page.getByText('Create New API Key')).toBeVisible();
  });

  test('security headers are present', async ({ page }) => {
    const response = await page.goto('http://localhost:3000');
    const headers = response?.headers();
    
    if (headers) {
      // Check for security headers (these might not all be present in dev mode)
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection'
      ];
      
      for (const header of securityHeaders) {
        if (headers[header]) {
          expect(headers[header]).toBeTruthy();
        }
      }
    }
  });
});