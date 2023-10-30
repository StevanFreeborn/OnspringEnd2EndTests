import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import 'dotenv/config';
import os from 'os';
import path from 'path';

export const SYS_ADMIN_AUTH_PATH = path.join('.auth', 'sysAdmin.json');
const isCI = process.env.CI == 'true';
const testResultsDir = 'test-results';

let baseURL: string | undefined;

switch (process.env.TEST_ENV) {
  case 'BETA':
    baseURL = process.env.BETA_INSTANCE_URL;
    break;
  case 'QA':
    baseURL = process.env.QA_INSTANCE_URL;
    break;
  case 'IST':
    baseURL = process.env.IST_INSTANCE_URL;
    break;
  case 'VPRIOR':
    baseURL = process.env.VPRIOR_INSTANCE_URL;
    break;
  case 'VNEXT':
    baseURL = process.env.VNEXT_INSTANCE_URL;
    break;
  case 'PROD':
    baseURL = process.env.BETA_INSTANCE_URL;
    break;
  case 'ALPHA':
  default:
    baseURL = process.env.ALPHA_INSTANCE_URL;
    break;
}

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 120 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 3 : 1,
  workers: isCI ? 1 : Math.floor(os.cpus().length / 2),
  reporter: [
    ['html'],
    ['list'],
    ['blob'],
    [
      'json',
      {
        outputFile: path.join(testResultsDir, 'report.json'),
      },
    ],
  ],
  use: {
    actionTimeout: 0,
    baseURL: baseURL,
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
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
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
  ],
  outputDir: testResultsDir,
};

export default config;
