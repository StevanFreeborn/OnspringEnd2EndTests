import { expect, test as teardownBase } from '@playwright/test';
import { UserFactory } from '../factories/userFactory';
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
  const sysAdminUser = UserFactory.createSysAdminUser();

  await teardown.step('Login as system administrator', async () => {
    await loginPage.login(sysAdminUser);
    // eslint-disable-next-line playwright/no-standalone-expect
    await expect(dashboardPage.sidebar.usersFullName).toHaveText(sysAdminUser.fullName);
  });

  await teardown.step('Perform api test cleanup', async () => {
    await performApiTestCleanup({ sysAdminPage: page, useCache: useCachedApiSetup });
  });
});
