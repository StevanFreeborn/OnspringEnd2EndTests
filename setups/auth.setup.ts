import { test as setup } from '@playwright/test';
import { UserFactory } from '../factories/userFactory';
import { LoginPage } from '../pageObjectModels/loginPage';
import { SYS_ADMIN_AUTH_PATH } from '../playwright.config';

setup('login as system administrator', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const sysAdminUser = UserFactory.createSysAdminUser();
  await loginPage.login(sysAdminUser);
  await page.context().storageState({ path: SYS_ADMIN_AUTH_PATH });
});
