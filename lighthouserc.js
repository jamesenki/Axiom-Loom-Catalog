module.exports = {
  ci: {
    collect: {
      // Serve the built application locally for testing
      startServerCommand: 'npm run serve:ci',
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      // Performance budgets based on EY requirements
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Bundle size checks
        'resource-summary:script:size': ['error', { maxNumericValue: 512000 }], // 500KB
        'resource-summary:total:size': ['error', { maxNumericValue: 2048000 }], // 2MB
        
        // EY-specific checks
        'uses-text-compression': 'error',
        'uses-responsive-images': 'error',
        'offscreen-images': 'error',
        'render-blocking-resources': 'error',
        'unused-css-rules': 'error',
        'unused-javascript': 'error',
        'modern-image-formats': 'error',
        'uses-webp-images': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9001,
      storage: './lighthouse-ci-storage',
    },
  },
};