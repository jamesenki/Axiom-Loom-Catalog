module.exports = {
  ...require('./jest.config.js'),
  testTimeout: 30000,
  maxWorkers: 2,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    // Ignore slow integration tests for coverage runs
    'contentValidation.test',
    'realContentValidation.test',
    'documentApiIntegration.test'
  ],
  coverageReporters: ['text-summary', 'text'],
  collectCoverage: true,
  bail: false
};