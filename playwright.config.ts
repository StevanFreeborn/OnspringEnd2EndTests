import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import os from 'os';
import path from 'path';
import { env } from './env';
import { ApiTestOptions } from './fixtures';

export const MS_PER_SEC = 1000;
export const MS_PER_MIN = 60 * MS_PER_SEC;
export const AUTH_DIR = '.auth';
export const SYS_ADMIN_AUTH_PATH = path.join('.auth', 'sysAdmin.json');
export const isCI = env.CI == 'true';
const testResultsDir = 'test-results';
const jsonReportPath = path.join(testResultsDir, 'report.json');
const TEST_ENV = env.TEST_ENV || 'ALPHA';
export let BASE_URL: string;

switch (TEST_ENV) {
  case 'BETA':
    BASE_URL = env.BETA_INSTANCE_URL;
    break;
  case 'QA':
    BASE_URL = env.QA_INSTANCE_URL;
    break;
  case 'IST':
    BASE_URL = env.IST_INSTANCE_URL;
    break;
  case 'VPRIOR':
    BASE_URL = env.VPRIOR_INSTANCE_URL;
    break;
  case 'VNEXT':
    BASE_URL = env.VNEXT_INSTANCE_URL;
    break;
  case 'PROD':
    BASE_URL = env.PROD_INSTANCE_URL;
    break;
  case 'FEDSPRING_IST':
    BASE_URL = env.FEDSPRING_IST_INSTANCE_URL;
    break;
  case 'ALPHA':
    BASE_URL = env.ALPHA_INSTANCE_URL;
    break;
  case 'AZURE':
    BASE_URL = env.AZURE_INSTANCE_URL;
    break;
  default:
    BASE_URL = env.ALPHA_INSTANCE_URL;
    break;
}

const API_URL = BASE_URL.replace(/^https:\/\/[^.]+/, 'https://api');

// Onspring servers timeout after 100 seconds.
// Want to be able to capture timeouts when they occur.
const expectNavAndActionTimeout = 2 * MS_PER_MIN;

export default defineConfig<PlaywrightTestConfig & ApiTestOptions>({
  reportSlowTests: null,
  testDir: './tests',
  timeout: 5 * MS_PER_MIN,
  expect: {
    timeout: expectNavAndActionTimeout,
  },
  retries: isCI ? 2 : 0,
  fullyParallel: true,
  forbidOnly: isCI,
  workers: isCI ? 1 : Math.floor(os.cpus().length / 2),
  reporter: isCI
    ? [
        ['html'],
        ['list'],
        ['blob'],
        [
          'json',
          {
            outputFile: jsonReportPath,
          },
        ],
        ['github'],
      ]
    : [
        ['html'],
        ['list'],
        ['blob'],
        [
          'json',
          {
            outputFile: jsonReportPath,
          },
        ],
      ],
  use: {
    viewport: { width: 1920, height: 1080 },
    actionTimeout: expectNavAndActionTimeout,
    navigationTimeout: expectNavAndActionTimeout,
    baseURL: BASE_URL,
    apiURL: API_URL,
    useCachedApiSetup: isCI ? false : true,
    trace: 'retain-on-first-failure',
    screenshot: 'only-on-failure',
    video: {
      mode: isCI ? 'off' : 'retain-on-failure',
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
      name: 'api-setup',
      testDir: 'setups',
      testMatch: '**/*.apiSetup.ts',
      teardown: 'api-teardown',
    },
    {
      name: 'teardown',
      testDir: 'teardowns',
      testMatch: '**/**.teardown.ts',
    },
    {
      name: 'api-teardown',
      testDir: 'teardowns',
      testMatch: '**/*.apiTeardown.ts',
    },
    {
      name: 'chrome',
      testIgnore: '**/api/**',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'edge',
      testIgnore: '**/api/**',
      use: {
        ...devices['Desktop Edge'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'api',
      testDir: 'tests/api',
      dependencies: ['api-setup'],
    },
    {
      name: 'cleanup',
      testDir: 'cleanup',
      testMatch: '**/*.cleanup.ts',
      dependencies: ['setup'],
      outputDir: 'cleanup-results',
      use: {
        ...devices['Desktop Edge'],
        video: 'off',
        trace: 'off',
      },
    },
  ],
  outputDir: testResultsDir,
  metadata: {
    environment: TEST_ENV,
  },
});
