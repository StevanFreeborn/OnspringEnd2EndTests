import { Browser, Page } from '@playwright/test';
import { SYS_ADMIN_AUTH_PATH } from '../playwright.config';

export async function sysAdminPage(
  { browser }: { browser: Browser },
  use: (r: Page) => Promise<void>
) {
  const context = await browser.newContext({
    storageState: SYS_ADMIN_AUTH_PATH,
  });
  const page = await context.newPage();
  await use(page);
  await context.close();
}
