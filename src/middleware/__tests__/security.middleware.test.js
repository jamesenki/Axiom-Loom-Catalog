/**
 * Security Middleware Tests
 */

// Fix for setImmediate not defined in test environment
if (typeof setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

const request = require('supertest');
const express = require('express');
const {
  securityHeaders,
  enforceHTTPS,
  getCorsOptions,
  sanitizeRequest,
  detectSuspiciousActivity
} = require('../security.middleware');

describe('Security Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('Security Headers', () => {
    it('sets security headers correctly', async () => {
      app.use(securityHeaders());
      app.get('/test', (req, res) => res.json({ success: true }));

      const response = await request(app).get('/test');

      // Check for important security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('0'); // Modern browsers disable this
      expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(response.headers['x-powered-by']).toBeUndefined();
    });

    it('sets CSP header', async () => {
      app.use(securityHeaders());
      app.get('/test', (req, res) => res.json({ success: true }));

      const response = await request(app).get('/test');
      
      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['content-security-policy']).toContain("default-src 'self'");
    });
  });

  describe('HTTPS Enforcement', () => {
    it('redirects HTTP to HTTPS in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      app.use(enforceHTTPS);
      app.get('/test', (req, res) => res.json({ success: true }));

      const response = await request(app)
        .get('/test')
        .set('x-forwarded-proto', 'http');

      expect(response.status).toBe(301);
      expect(response.headers.location).toMatch(/^https:\/\//);

      process.env.NODE_ENV = originalEnv;
    });

    it('allows HTTPS requests in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      app.use(enforceHTTPS);
      app.get('/test', (req, res) => res.json({ success: true }));

      const response = await request(app)
        .get('/test')
        .set('x-forwarded-proto', 'https');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });

      process.env.NODE_ENV = originalEnv;
    });

    it('skips HTTPS enforcement in development', async () => {
      process.env.NODE_ENV = 'development';

      app.use(enforceHTTPS);
      app.get('/test', (req, res) => res.json({ success: true }));

      const response = await request(app).get('/test');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });
  });

  describe('CORS Configuration', () => {
    it('returns proper CORS options', () => {
      const corsOptions = getCorsOptions();

      expect(corsOptions.credentials).toBe(true);
      expect(corsOptions.methods).toContain('GET');
      expect(corsOptions.methods).toContain('POST');
      expect(corsOptions.allowedHeaders).toContain('Authorization');
      expect(corsOptions.allowedHeaders).toContain('X-API-Key');
    });

    it('validates origin correctly', () => {
      const corsOptions = getCorsOptions();
      const originFunction = corsOptions.origin;

      // Test allowed origin
      let callbackCalled = false;
      originFunction('http://localhost:3000', (err, allowed) => {
        callbackCalled = true;
        expect(err).toBeNull();
        expect(allowed).toBe(true);
      });
      expect(callbackCalled).toBe(true);

      // Test disallowed origin
      callbackCalled = false;
      originFunction('http://malicious-site.com', (err, allowed) => {
        callbackCalled = true;
        expect(err).toBeTruthy();
      });
      expect(callbackCalled).toBe(true);

      // Test no origin (like mobile apps)
      callbackCalled = false;
      originFunction(null, (err, allowed) => {
        callbackCalled = true;
        expect(err).toBeNull();
        expect(allowed).toBe(true);
      });
      expect(callbackCalled).toBe(true);
    });
  });

  describe('Request Sanitization', () => {
    it('sanitizes XSS attempts in request body', async () => {
      app.use(sanitizeRequest);
      app.post('/test', (req, res) => res.json(req.body));

      const response = await request(app)
        .post('/test')
        .send({
          name: 'Test <script>alert("XSS")</script>',
          description: 'Normal text'
        });

      expect(response.body.name).toBe('Test ');
      expect(response.body.description).toBe('Normal text');
    });

    it('sanitizes javascript: URLs', async () => {
      app.use(sanitizeRequest);
      app.post('/test', (req, res) => res.json(req.body));

      const response = await request(app)
        .post('/test')
        .send({
          url: 'javascript:alert("XSS")',
          safeUrl: 'https://example.com'
        });

      expect(response.body.url).toBe('alert("XSS")');
      expect(response.body.safeUrl).toBe('https://example.com');
    });

    it('sanitizes event handlers', async () => {
      app.use(sanitizeRequest);
      app.post('/test', (req, res) => res.json(req.body));

      const response = await request(app)
        .post('/test')
        .send({
          html: '<div onclick="alert(1)">Click me</div>'
        });

      expect(response.body.html).toBe('<div >Click me</div>');
    });
  });

  describe('Suspicious Activity Detection', () => {
    it('detects SQL injection attempts', async () => {
      let loggedEvent = null;
      const originalLog = console.error;
      console.error = (msg, data) => {
        if (msg === 'SECURITY_EVENT:') {
          loggedEvent = JSON.parse(data);
        }
      };

      app.use(detectSuspiciousActivity);
      app.get('/test', (req, res) => res.json({ success: true }));

      await request(app).get('/test?id=1 OR 1=1');

      expect(loggedEvent).toBeTruthy();
      expect(loggedEvent.type).toBe('suspicious_request');
      expect(loggedEvent.details.reasons).toContain('Potential SQL injection attempt');

      console.error = originalLog;
    });

    it('detects path traversal attempts', async () => {
      let loggedEvent = null;
      const originalLog = console.error;
      console.error = (msg, data) => {
        if (msg === 'SECURITY_EVENT:') {
          loggedEvent = JSON.parse(data);
        }
      };

      // Create fresh app instance to ensure no interference
      const testApp = express();
      // Manually set originalUrl to bypass Express normalization
      testApp.use((req, res, next) => {
        if (req.url.includes('passwd')) {
          req.originalUrl = '/test/../../../etc/passwd';
        }
        next();
      });
      testApp.use(detectSuspiciousActivity);
      testApp.get('*', (req, res) => res.json({ success: true }));

      await request(testApp).get('/test/etc/passwd');

      expect(loggedEvent).toBeTruthy();
      expect(loggedEvent.type).toBe('suspicious_request');
      expect(loggedEvent.details.reasons).toContain('Path traversal attempt');

      console.error = originalLog;
    });

    it('detects suspicious user agents', async () => {
      let loggedEvent = null;
      const originalLog = console.error;
      console.error = (msg, data) => {
        if (msg === 'SECURITY_EVENT:') {
          loggedEvent = JSON.parse(data);
        }
      };

      app.use(detectSuspiciousActivity);
      app.get('/test', (req, res) => res.json({ success: true }));

      await request(app)
        .get('/test')
        .set('User-Agent', 'sqlmap/1.0');

      expect(loggedEvent).toBeTruthy();
      expect(loggedEvent.type).toBe('suspicious_request');
      expect(loggedEvent.details.reasons).toContain('Suspicious user agent detected');

      console.error = originalLog;
    });
  });
});