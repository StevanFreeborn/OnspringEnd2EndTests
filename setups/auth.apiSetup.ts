import { expect, test as setupBase } from '@playwright/test';
import { User } from '@stevanfreeborn/onspring-models';
import { env } from '../env';
import { ApiTestOptions } from '../fixtures';
import { performApiTestsSetup } from '../fixtures/api.fixtures';
import { LoginPage } from '../pageObjectModels/authentication/loginPage';
import { DashboardPage } from '../pageObjectModels/dashboards/dashboardPage';

const setup = setupBase.extend<ApiTestOptions>({
  useCachedApiSetup: [false, { option: true }],
});

setup('Setup before API tests', async ({ page, useCachedApiSetup }) => {
  setup.slow();

  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const sysAdminUser = new User({
    firstName: env.SYS_ADMIN_FIRST_NAME,
    lastName: env.SYS_ADMIN_LAST_NAME,
    email: env.SYS_ADMIN_EMAIL,
    username: env.SYS_ADMIN_USERNAME,
    password: env.SYS_ADMIN_PASSWORD,
    status: 'Active',
    sysAdmin: true,
  });

  await setup.step('Login as system administrator', async () => {
    await loginPage.login(sysAdminUser);

    await expect(dashboardPage.sidebar.usersFullName).toHaveText(sysAdminUser.fullName);
  });

  await setup.step('Perform api test setup', async () => {
    await performApiTestsSetup({ sysAdminPage: page, useCache: useCachedApiSetup });
    await page.close();
  });
});
