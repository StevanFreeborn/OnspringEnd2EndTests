import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import 'dotenv/config';
import os from 'os';
import path from 'path';

export const SYS_ADMIN_AUTH_PATH = path.join('.auth', 'sysAdmin.json');
const isCI = process.env.CI == 'true';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 120 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  workers: isCI ? 1 : Math.floor(os.cpus().length / 2),
  reporter: [['html'], ['list'], ['blob']],
  use: {
    actionTimeout: 0,
    baseURL: process.env.INSTANCE_URL,
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: isCI ? 'on-first-retry' : 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testDir: 'setups',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'safari',
      use: {
        ...devices['Desktop Safari'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'android',
      use: {
        ...devices['Pixel 5'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'iOS',
      use: {
        ...devices['iPhone 13 Pro'],
      },
      dependencies: ['setup'],
    },
  ],

  outputDir: 'test-results/',
};

export default config;
