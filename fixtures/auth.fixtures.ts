import { SYS_ADMIN_AUTH_PATH } from '../playwright.config';

export async function sysAdminPage({ browser }, use) {
  const context = await browser.newContext({
    storageState: SYS_ADMIN_AUTH_PATH,
  });
  const page = await context.newPage();
  await use(page);
  await context.close();
}
