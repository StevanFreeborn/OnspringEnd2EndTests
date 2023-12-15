import { Browser, Page, Response, TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';
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

  const context = await browser.newContext({
    storageState: authStorageLocation,
    recordVideo: isCI
      ? undefined
      : {
          dir: videoDir,
          size: { width: 1920, height: 1080 },
        },
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  page.on('response', errorResponseHandler);

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

  if (isBaseUrl && response.status() === 524) {
    throw new Error(`Request to ${url} timed out.`);
  }

  if (isBaseUrl && response.status() === 520) {
    throw new Error(`Request to ${url} returned an unexpected response.`);
  }

  if (isBaseUrl && response.status() === 502) {
    throw new Error(`Request to ${url} encountered a bad gateway.`);
  }
}
