import { expect, test as teardownBase } from '@playwright/test';
import { User } from '@stevanfreeborn/onspring-models';
import { env } from '../env';
import { ApiTestOptions } from '../fixtures';
import { performApiTestCleanup } from '../fixtures/api.fixtures';
import { LoginPage } from '../pageObjectModels/authentication/loginPage';
import { DashboardPage } from '../pageObjectModels/dashboards/dashboardPage';

const teardown = teardownBase.extend<ApiTestOptions>({
  useCachedApiSetup: [false, { option: true }],
});

teardown('Teardown after API tests', async ({ page, useCachedApiSetup }) => {
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

  await teardown.step('Login as system administrator', async () => {
    await loginPage.login(sysAdminUser);

    await expect(dashboardPage.sidebar.usersFullName).toHaveText(sysAdminUser.fullName);
  });

  await teardown.step('Perform api test cleanup', async () => {
    await performApiTestCleanup({ sysAdminPage: page, useCache: useCachedApiSetup });
  });

  await page.close();
});
