import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for testing against specific IP address
 * Uses 10.0.0.109:3000 as specified in the test requirements
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: false, // Disable parallel for detailed workflow testing
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: 1, // Single worker for sequential testing
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report-ip' }],
    ['list'],
    ['json', { outputFile: 'test-results/ip-results.json' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://10.0.0.109:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Screenshot on failure and success */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',

    /* Extended timeout for slower network */
    actionTimeout: 30000,
    navigationTimeout: 30000,

    /* Ignore HTTPS errors for local testing */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Additional settings for stable testing
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection'
          ]
        }
      },
    }
  ],

  /* Global timeout for test files */
  timeout: 5 * 60 * 1000, // 5 minutes

  /* Expect timeout */
  expect: {
    timeout: 15000,
  },

  /* Global setup */
  globalSetup: undefined,
  globalTeardown: undefined,
});