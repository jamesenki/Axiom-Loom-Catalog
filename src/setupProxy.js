const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Determine backend target from env, default to localhost:4000
  const port = process.env.REACT_APP_API_PORT || process.env.SERVER_PORT || 4000;
  const target = process.env.REACT_APP_API_URL || `http://localhost:${port}`;

  // ONLY proxy API calls to backend - let React handle all other routes
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[PROXY] ${req.method} ${req.path} -> ${target}${req.path}`);

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