import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import 'dotenv/config';
import os from 'os';
import path from 'path';

export const MS_PER_SEC = 1000;
export const MS_PER_MIN = 60 * MS_PER_SEC;
export const AUTH_DIR = '.auth';
export const SYS_ADMIN_AUTH_PATH = path.join('.auth', 'sysAdmin.json');
const isCI = process.env.CI == 'true';
const testResultsDir = 'test-results';

export let BASE_URL: string | undefined;

switch (process.env.TEST_ENV) {
  case 'BETA':
    BASE_URL = process.env.BETA_INSTANCE_URL;
    break;
  case 'QA':
    BASE_URL = process.env.QA_INSTANCE_URL;
    break;
  case 'IST':
    BASE_URL = process.env.IST_INSTANCE_URL;
    break;
  case 'VPRIOR':
    BASE_URL = process.env.VPRIOR_INSTANCE_URL;
    break;
  case 'VNEXT':
    BASE_URL = process.env.VNEXT_INSTANCE_URL;
    break;
  case 'PROD':
    BASE_URL = process.env.PROD_INSTANCE_URL;
    break;
  case 'ALPHA':
  default:
    BASE_URL = process.env.ALPHA_INSTANCE_URL;
    break;
}

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 2 * MS_PER_MIN,
  expect: {
    timeout: 30 * MS_PER_SEC,
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
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 0,
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: {
      mode: 'retain-on-failure',
      size: { width: 1920, height: 1080 },
    },
  },

  projects: [
    {
      name: 'setup',
      testDir: 'setups',
      testMatch: '**/*.setup.ts',
      teardown: 'teardown',
    },
    {
      name: 'teardown',
      testDir: 'teardowns',
      testMatch: '**/*.teardown.ts',
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
