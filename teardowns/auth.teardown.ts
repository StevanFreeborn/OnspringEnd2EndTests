/* eslint-disable playwright/expect-expect */
import { test as teardown } from '@playwright/test';
import fs from 'fs';
import { AUTH_DIR } from '../playwright.config';

function clearSavedAuthStates() {
  if (process.env.KEEP_AUTH_STATE === 'true') {
    return;
  }

  fs.rmSync(AUTH_DIR, { recursive: true, force: true });
}

teardown('remove saved auth states', async () => {
  clearSavedAuthStates();
});
