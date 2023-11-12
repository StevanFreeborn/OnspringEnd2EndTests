import { defineConfig } from '@playwright/test';
import os from 'os';
import { env } from './env';
import config from './playwright.config';

if (env.PLAYWRIGHT_SERVICE_URL === undefined) {
  throw new Error('PLAYWRIGHT_SERVICE_URL must be defined when using the service.');
}

if (env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN === undefined) {
  throw new Error('PLAYWRIGHT_SERVICE_ACCESS_TOKEN must be defined when using the service.');
}

export default defineConfig(config, {
  workers: env.PLAYWRIGHT_SERVICE_WORKERS ?? Math.floor(os.cpus().length / 2),
  use: {
    connectOptions: {
      wsEndpoint: `${env.PLAYWRIGHT_SERVICE_URL}?cap=${JSON.stringify({
        os:
          env.PLAYWRIGHT_SERVICE_OS === 'windows' || env.PLAYWRIGHT_SERVICE_OS === 'linux'
            ? env.PLAYWRIGHT_SERVICE_OS
            : 'windows',
        runId: env.PLAYWRIGHT_SERVICE_RUN_ID ?? `${os.hostname()}-${new Date().toISOString()}`,
      })}`,
      timeout: 30000,
      headers: {
        'x-mpt-access-key': env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN,
      },
      exposeNetwork: '<loopback>',
    },
  },
});
