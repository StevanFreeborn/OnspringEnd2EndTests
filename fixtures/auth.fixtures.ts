import { Browser, Page, Response, TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { env } from '../env';
import { User } from '../models/user';
import { BASE_URL, SYS_ADMIN_AUTH_PATH, isCI } from '../playwright.config';

export async function sysAdminPage(
  { browser }: { browser: Browser },
  use: (r: Page) => Promise<void>,
  testInfo: TestInfo
) {
  await createBaseAuthPage({ browser }, use, testInfo, SYS_ADMIN_AUTH_PATH);
}

export async function testUserPage(
  {
    browser,
    user,
  }: {
    browser: Browser;
    user: User;
  },
  use: (r: Page) => Promise<void>,
  testInfo: TestInfo
) {
  await createBaseAuthPage({ browser }, use, testInfo, user.authStoragePath);
}

// This is necessary because videos currently are not supported
// when using a custom page fixture.
// see issue: https://github.com/microsoft/playwright/issues/14813
export async function createBaseAuthPage(
  { browser }: { browser: Browser },
  use: (r: Page) => Promise<void>,
  testInfo: TestInfo,
  authStorageLocation?: string
) {
  const videoDir = path.join(testInfo.outputPath(), 'videos');
  const harPath = path.join(testInfo.outputPath(), 'logs', 'trace.har');

  const context = await browser.newContext({
    storageState: authStorageLocation,
    recordVideo: isCI
      ? undefined
      : {
          dir: videoDir,
          size: { width: 1920, height: 1080 },
        },
    viewport: { width: 1920, height: 1080 },
    recordHar: env.RECORD_HAR ? { path: harPath } : undefined,
  });

  const page = await context.newPage();

  page.on('response', errorResponseHandler);

  page.on('pageerror', async error => {
    const err = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    await testInfo.attach(error.name, {
      body: JSON.stringify(err, null, 2),
      contentType: 'application/json',
    });
  });

  try {
    await use(page);
    await context.close();
  } finally {
    if (fs.existsSync(videoDir)) {
      const videoFiles = fs.readdirSync(videoDir);

      if (videoFiles.length > 0 && testInfo.status === 'failed') {
        for (const file of videoFiles) {
          const videoFile = path.join(videoDir, file);
          await testInfo.attach('video', { path: videoFile });
        }
      }
    }
  }
}

// Onspring servers timeout after 100 seconds.
// Want to fail tests when timeouts or unexpected server responses occur as opposed to hanging.
export function errorResponseHandler(response: Response) {
  const url = response.url();
  const isBaseUrl = url.includes(BASE_URL);
  const timestamp = new Date().toISOString();

  if (isBaseUrl && response.status() === 524) {
    throw new Error(`Request to ${url} timed out at ${timestamp}.`);
  }

  if (isBaseUrl && response.status() === 522) {
    throw new Error(`Request to ${url} encountered a connection timeout at ${timestamp}.`);
  }

  if (isBaseUrl && response.status() === 520) {
    throw new Error(`Request to ${url} returned an unexpected response at ${timestamp}.`);
  }

  if (isBaseUrl && response.status() === 502) {
    throw new Error(`Request to ${url} encountered a bad gateway at ${timestamp}.`);
  }
}
