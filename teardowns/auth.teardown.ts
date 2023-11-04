import { test as teardown } from '@playwright/test';
import fs from 'fs';
import { AUTH_DIR } from '../playwright.config';

teardown('remove saved auth states', async () => {
  fs.rmSync(AUTH_DIR, { recursive: true, force: true });
});
