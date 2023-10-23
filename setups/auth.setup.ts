import { expect, test as setup } from '@playwright/test';
import { UserFactory } from '../factories/userFactory';
import { LoginPage } from '../pageObjectModels/loginPage';
import { SYS_ADMIN_AUTH_PATH } from '../playwright.config';
import { DashboardPage } from './../pageObjectModels/dashboardPage';

setup('login as system administrator', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const sysAdminUser = UserFactory.createSysAdminUser();

  await setup.step('Login as system administrator', async () => {
    await loginPage.login(sysAdminUser);
    await expect(dashboardPage.sidebar.usersFullName).toHaveText(
      sysAdminUser.fullName
    );
  });

  await setup.step('Save system administrator auth state', async () => {
    await page.context().storageState({ path: SYS_ADMIN_AUTH_PATH });
    await page.close();
  });
});
