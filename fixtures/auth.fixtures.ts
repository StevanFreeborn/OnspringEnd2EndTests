import { Browser, Page, TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { SYS_ADMIN_AUTH_PATH } from '../playwright.config';

export async function sysAdminPage(
  { browser }: { browser: Browser },
  use: (r: Page) => Promise<void>,
  testInfo: TestInfo
) {
  await baseAuthPage({ browser }, use, testInfo, SYS_ADMIN_AUTH_PATH);
}

// This is necessary because videos currently are not supported
// when using a custom page fixture.
// see issue: https://github.com/microsoft/playwright/issues/14813
async function baseAuthPage(
  { browser }: { browser: Browser },
  use: (r: Page) => Promise<void>,
  testInfo: TestInfo,
  authStorageLocation: string
) {
  const videoDir = path.join(testInfo.outputPath(), 'videos');

  const context = await browser.newContext({
    storageState: authStorageLocation,
    recordVideo: {
      dir: videoDir,
      size: { width: 1920, height: 1080 },
    },
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

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
