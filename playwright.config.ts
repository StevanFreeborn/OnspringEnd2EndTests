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
const TEST_ENV = env.TEST_ENV;

const URL_MAP = {
  BETA: env.BETA_INSTANCE_URL,
  QA: env.QA_INSTANCE_URL,
  IST: env.IST_INSTANCE_URL,
  VPRIOR: env.VPRIOR_INSTANCE_URL,
  VNEXT: env.VNEXT_INSTANCE_URL,
  PROD: env.PROD_INSTANCE_URL,
  FEDSPRING_IST: env.FEDSPRING_IST_INSTANCE_URL,
  ALPHA: env.ALPHA_INSTANCE_URL,
  AZURE: env.AZURE_INSTANCE_URL,
  AZURE_UK: env.AZURE_UK_INSTANCE_URL,
};

export const BASE_URL = URL_MAP[TEST_ENV];

const API_URL = BASE_URL.replace(/^https:\/\/[^.]+/, 'https://api');

// Onspring servers timeout after 100 seconds.
// Want to be able to capture timeouts when they occur.
const expectNavAndActionTimeout = process.env.CI ? 2 * MS_PER_MIN : 0.5 * MS_PER_MIN;

export default defineConfig<PlaywrightTestConfig & ApiTestOptions>({
  reportSlowTests: null,
  testDir: './tests',
  timeout: 5 * MS_PER_MIN,
  expect: {
    timeout: expectNavAndActionTimeout,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
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
    timezoneId: 'America/Chicago',
    viewport: { width: 1920, height: 1080 },
    actionTimeout: expectNavAndActionTimeout,
    navigationTimeout: expectNavAndActionTimeout,
    baseURL: BASE_URL,
    apiURL: API_URL,
    useCachedApiSetup: isCI ? false : true,
    trace: 'retain-on-first-failure',
    screenshot: 'on-first-failure',
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
  snapshotPathTemplate:
    '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{-snapshotSuffix}{ext}',
  outputDir: testResultsDir,
  metadata: {
    environment: TEST_ENV,
  },
});
