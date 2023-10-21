import { Page } from '@playwright/test';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/appAdminPage';
import { AppsAdminPage } from '../../pageObjectModels/appsAdminPage';
import { DashboardPage } from '../../pageObjectModels/dashboardPage';

export const TestHelper = {
  /**
   * @summary Helper function to navigate to the admin home page.
   */
  async navigateToAdminHomePage(sysAdminPage: Page) {
    const dashboardPage = new DashboardPage(sysAdminPage);
    await dashboardPage.goto();
    await dashboardPage.page.waitForLoadState();
    await dashboardPage.sharedNavPage.adminGearIcon.click();
  },
  /**
   * @summary Helper function to create an app, add app to delete list, and return objects needed for tests.
   */
  async createAppForTest(sysAdminPage: Page, appsToDelete: string[]) {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.createAppUsingHeaderCreateButton(appName);

    return {
      adminHomePage,
      appAdminPage,
      appName,
    };
  },
  /**
   * @summary Helper function to delete apps created during tests.
   */
  async deleteAppsForTest(sysAdminPage: Page, appsToDelete: string[]) {
    const appsAdminPage = new AppsAdminPage(sysAdminPage);
    await appsAdminPage.goto();
    await appsAdminPage.page.waitForLoadState();

    for (const appName of appsToDelete) {
      const appRow = appsAdminPage.appGrid
        .getByRole('row', { name: appName })
        .first();
      const appDeleteButton = appRow.getByTitle('Delete App');
      await appsAdminPage.page.waitForLoadState('networkidle');

      // eslint-disable-next-line playwright/no-force-option
      await appRow.hover({ force: true });
      // eslint-disable-next-line playwright/no-force-option
      await appDeleteButton.click({ force: true });

      await appsAdminPage.deleteAppDialog.confirmationInput.pressSequentially(
        'OK',
        {
          delay: 100,
        }
      );

      // eslint-disable-next-line playwright/no-force-option
      await appsAdminPage.deleteAppDialog.deleteButton.click({ force: true });
      await appsAdminPage.deleteAppDialog.waitForModalToBeDismissed();
      await appsAdminPage.page.waitForLoadState('networkidle');
    }
  },
};
