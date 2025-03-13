import { expect, test as setupBase } from '@playwright/test';
import { UserFactory } from '../factories/userFactory';
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
  const sysAdminUser = UserFactory.createSysAdminUser();

  await setup.step('Login as system administrator', async () => {
    await loginPage.login(sysAdminUser);
    // eslint-disable-next-line playwright/no-standalone-expect
    await expect(dashboardPage.sidebar.usersFullName).toHaveText(sysAdminUser.fullName);
  });

  await setup.step('Perform api test setup', async () => {
    await performApiTestsSetup({ sysAdminPage: page, useCache: useCachedApiSetup });
    await page.close();
  });
});
