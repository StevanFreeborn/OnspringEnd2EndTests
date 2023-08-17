import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import 'dotenv/config';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: true,
  forbidOnly: process.env.CI == 'true',
  retries: process.env.CI == 'true' ? 2 : 1,
  workers: process.env.CI == 'true' ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    actionTimeout: 0,
    baseURL: process.env.INSTANCE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    {
      name: 'android mobile',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'iOS mobile',
      use: {
        ...devices['iPhone 13 Pro'],
      },
    },
  ],

  outputDir: 'test-results/',
};

export default config;
