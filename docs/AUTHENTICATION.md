# Authentication & Security Documentation

## Overview

The Axiom Loom AI Experience Center implements enterprise-grade authentication and security features to protect sensitive data and ensure only authorized users can access the platform.

## Table of Contents

1. [Authentication Methods](#authentication-methods)
2. [Security Features](#security-features)
3. [User Roles & Permissions](#user-roles--permissions)
4. [API Authentication](#api-authentication)
5. [Security Headers](#security-headers)
6. [Rate Limiting](#rate-limiting)
7. [Audit Logging](#audit-logging)
8. [Development Setup](#development-setup)
9. [Production Deployment](#production-deployment)

## Authentication Methods

### 1. Axiom Loom SSO (Single Sign-On)

The primary authentication method for production environments is EY's corporate SSO system using OAuth2/OIDC.

**Flow:**
1. User clicks "Sign in with Axiom Loom SSO"
2. Redirected to Axiom Loom login portal
3. After successful authentication, redirected back with authorization code
4. Code exchanged for JWT tokens
5. User session established

### 2. JWT Token Authentication

After initial authentication, the system uses JWT tokens for subsequent requests:

- **Access Token**: Short-lived (15 minutes), contains user claims
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

### 3. API Key Authentication

Developers can generate API keys for programmatic access:

```bash
# Using API key in header
curl -H "X-API-Key: ey_your-api-key-here" https://api.example.com/repositories

# Using API key as query parameter
curl https://api.example.com/repositories?apiKey=ey_your-api-key-here
```

## Security Features

### Content Security Policy (CSP)

Strict CSP headers prevent XSS attacks:

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.ey.com https://login.ey.com;
```

### HTTPS Enforcement

- Automatic redirect from HTTP to HTTPS in production
- HSTS (HTTP Strict Transport Security) enabled
- Secure cookies with `httpOnly` and `secure` flags

### CORS Configuration

Controlled cross-origin access:

```javascript
const allowedOrigins = [
  'https://ai-experience.ey.com',
  'http://localhost:3000' // Development only
];
```

## User Roles & Permissions

### Roles

1. **Admin**
   - Full system access
   - User management
   - System configuration
   - All developer permissions

2. **Developer**
   - Read APIs and documentation
   - Create and manage API keys
   - Test APIs
   - Download collections

3. **Viewer**
   - Read APIs and documentation only
   - No write access

### Permission Matrix

| Action | Admin | Developer | Viewer |
|--------|-------|-----------|---------|
| Read APIs | ✓ | ✓ | ✓ |
| Read Documentation | ✓ | ✓ | ✓ |
| Create API Keys | ✓ | ✓ | ✗ |
| Manage API Keys | ✓ | ✓ (own) | ✗ |
| Test APIs | ✓ | ✓ | ✗ |
| Download Collections | ✓ | ✓ | ✗ |
| Sync Repositories | ✓ | ✗ | ✗ |
| User Management | ✓ | ✗ | ✗ |

## API Authentication

### Using JWT Tokens

```javascript
// Include in Authorization header
fetch('/api/repositories', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
  }
});
```

### Using API Keys

```javascript
// Option 1: Header
fetch('/api/repositories', {
  headers: {
    'X-API-Key': 'ey_your-api-key-here'
  }
});

// Option 2: Query parameter
fetch('/api/repositories?apiKey=ey_your-api-key-here');
```

### API Key Management

1. Navigate to Profile → API Keys
2. Click "Create New API Key"
3. Enter a descriptive name
4. Select required permissions
5. Save the generated key securely (shown only once)

## Security Headers

The following security headers are automatically applied:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 0` (modern browsers)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: various restrictions`

## Rate Limiting

Rate limits are applied per user role:

| Role | Requests per 15 minutes |
|------|------------------------|
| Admin | 1000 |
| Developer | 500 |
| Viewer | 100 |

Exceeded limits return:
```
HTTP 429 Too Many Requests
X-Rate-Limit-Remaining: 0
Retry-After: 900
```

## Audit Logging

Sensitive operations are automatically logged:

- Login/logout events
- API key creation/deletion
- Failed authentication attempts
- Permission denied events
- File access
- Configuration changes

Log format:
```json
{
  "timestamp": "2025-01-30T10:30:45.123Z",
  "user": "user@ey.com",
  "action": "login",
  "method": "POST",
  "path": "/auth/login",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "responseStatus": 200
}
```

## Development Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
```env
JWT_SECRET=your-development-secret
JWT_REFRESH_SECRET=your-development-refresh-secret
EY_SSO_CLIENT_ID=dev-client-id
EY_SSO_CLIENT_SECRET=dev-client-secret
```

### 2. Development Authentication

In development mode, you can use test credentials:

- **Admin**: admin@ey.com / admin123
- **Developer**: developer@ey.com / dev123

### 3. Testing Authentication

```bash
# Run auth unit tests
npm test -- --testPathPattern=auth

# Run auth E2E tests
npm run test:e2e -- auth-flow.spec.ts
```

## Production Deployment

### 1. Security Checklist

- [ ] Generate strong, unique secrets for JWT_SECRET and JWT_REFRESH_SECRET
- [ ] Configure Axiom Loom SSO credentials
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set NODE_ENV=production
- [ ] Configure secure session storage (Redis recommended)
- [ ] Set up audit log aggregation
- [ ] Enable security monitoring alerts
- [ ] Review and adjust rate limits
- [ ] Test CSP configuration
- [ ] Verify CORS allowed origins

### 2. Environment Variables

Production-critical variables:

```env
NODE_ENV=production
HTTPS_ENABLED=true
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_REFRESH_SECRET=<generate-with-openssl-rand-base64-32>
SESSION_SECRET=<generate-with-openssl-rand-base64-32>
```

### 3. Monitoring

Set up monitoring for:

- Failed login attempts (>5 in 15 minutes)
- Unusual API key usage patterns
- CSP violations
- Rate limit violations
- 401/403 error rates

### 4. Security Updates

- Regularly update dependencies: `npm audit fix`
- Monitor security advisories
- Rotate secrets periodically
- Review audit logs for suspicious activity

## Troubleshooting

### Common Issues

1. **"Invalid or expired token"**
   - Token may have expired (15 min lifetime)
   - Use refresh token to get new access token

2. **"Too many requests"**
   - Rate limit exceeded
   - Wait for window to reset or upgrade role

3. **CORS errors**
   - Ensure origin is in allowed list
   - Check request includes credentials

4. **SSO redirect fails**
   - Verify callback URL matches configuration
   - Check SSO client credentials

### Debug Mode

Enable debug logging:
```env
LOG_LEVEL=debug
```

View auth-specific logs:
```bash
grep "AUTH:" logs/app.log
grep "SECURITY_EVENT:" logs/security.log
```

## Support

For authentication issues:
1. Check audit logs for specific error
2. Verify environment configuration
3. Contact IT support for SSO issues
4. Submit issue to development team for platform issues