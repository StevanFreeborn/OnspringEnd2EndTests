import { expect, test as setup } from '@playwright/test';
import { UserFactory } from '../factories/userFactory';
import { LoginPage } from '../pageObjectModels/loginPage';
import { SYS_ADMIN_AUTH_PATH } from '../playwright.config';
import { DashboardPage } from './../pageObjectModels/dashboardPage';

setup('login as system administrator', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const sysAdminUser = UserFactory.createSysAdminUser();
  await loginPage.login(sysAdminUser);
  await expect(dashboardPage.sharedNavPage.usersFullName).toHaveText(
    sysAdminUser.fullName
  );
  await page.context().storageState({ path: SYS_ADMIN_AUTH_PATH });
  await page.close();
});
