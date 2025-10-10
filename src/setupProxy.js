const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');

module.exports = function(app) {
  // Serve static files from public/repo-images
  app.use('/repo-images', express.static(path.join(__dirname, '../public/repo-images')));

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        // Force development mode for authentication bypass
        proxyReq.setHeader('X-Dev-Mode', 'true');
        // Also set NODE_ENV header
        proxyReq.setHeader('X-Node-Env', 'development');

        // Remove authorization header for unprotected endpoints
        if (req.path === '/api/repositories' && req.method === 'GET') {
          proxyReq.removeHeader('authorization');
        }
      }
    })
  );
};