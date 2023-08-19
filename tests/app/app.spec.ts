import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, test } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/appAdminPage';
import { AppsAdminPage } from './../../pageObjectModels/appsAdminPage';
import { DashboardPage } from './../../pageObjectModels/dashboardPage';

test.describe('app', () => {
  let appNames: string[] = [];

  test.beforeEach(async ({ sysAdminPage }) => {
    const dashboardPage = new DashboardPage(sysAdminPage);
    await dashboardPage.goto();
    await dashboardPage.page.waitForLoadState();
    await dashboardPage.sharedNavPage.adminGearIcon.click();
  });

  test.afterEach(async ({ sysAdminPage }) => {
    const appsAdminPage = new AppsAdminPage(sysAdminPage);
    await appsAdminPage.goto();
    await appsAdminPage.page.waitForLoadState();

    for (const appName of appNames) {
      const appRow = appsAdminPage.appGrid
        .getByRole('row', { name: appName })
        .first();
      const appDeleteButton = appRow.getByTitle('Delete App');
      await appsAdminPage.page.waitForLoadState('networkidle');

      // eslint-disable-next-line playwright/no-force-option
      await appRow.hover({ force: true });
      // eslint-disable-next-line playwright/no-force-option
      await appDeleteButton.click({ force: true });

      await appsAdminPage.deleteAppDialog.confirmationInput.type('OK', {
        delay: 100,
      });

      // eslint-disable-next-line playwright/no-force-option
      await appsAdminPage.deleteAppDialog.deleteButton.click({ force: true });
      await appsAdminPage.deleteAppDialog.waitForModalToBeDismissed();
      await appsAdminPage.page.waitForLoadState('networkidle');
    }

    appNames = [];
  });

  test('Create an app via the create button on the header of on the admin home page', async ({
    sysAdminPage,
  }) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();
    appNames.push(appName);

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.createAppUsingHeaderCreateButton(appName);

    await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
    await expect(appAdminPage.appName).toHaveText(appName);
  });

  test('Create an app via the create button on the Apps tile on the admin home page', async ({
    sysAdminPage,
  }) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();
    appNames.push(appName);

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.createAppUsingAppTileButton(appName);

    await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
    await expect(appAdminPage.appName).toHaveText(appName);
  });

  test('Create an app via the Create App button on the Apps admin page', async ({
    sysAdminPage,
  }) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appsAdminPage = new AppsAdminPage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();
    appNames.push(appName);

    await adminHomePage.appTileLink.click();

    await appsAdminPage.page.waitForLoadState();
    await appsAdminPage.createApp(appName);

    await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
    await expect(appAdminPage.appName).toHaveText(appName);
  });

  test('Create a copy of an app via the create button on the header of the admin home page', async ({
    sysAdminPage,
  }) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();
    const expectedAppCopyName = `${appName} (1)`;
    appNames.push(appName);
    appNames.push(expectedAppCopyName);

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.createAppUsingHeaderCreateButton(appName);

    await appAdminPage.sharedNavPage.adminGearIcon.click();

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.sharedAdminNavPage.adminCreateButton.hover();

    await expect(
      adminHomePage.sharedAdminNavPage.adminCreateMenu
    ).toBeVisible();

    await adminHomePage.sharedAdminNavPage.appCreateMenuOption.click();

    await expect(
      adminHomePage.createAppDialog.copyFromRadioButton
    ).toBeVisible();

    await adminHomePage.createAppDialog.copyFromRadioButton.click();
    await adminHomePage.createAppDialog.selectAnAppDropdown.click();
    await adminHomePage.createAppDialog.appToCopy(appName).click();
    await adminHomePage.createAppDialog.continueButton.click();

    await expect(adminHomePage.createAppModal.nameInput).toBeVisible();

    await expect(adminHomePage.createAppModal.nameInput).toHaveValue(
      expectedAppCopyName
    );

    await adminHomePage.createAppModal.saveButton.click();

    await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
    await expect(appAdminPage.appName).toHaveText(expectedAppCopyName);
  });

  test('Create a copy of an app via the create button on the Apps tile on the admin home page', async ({
    sysAdminPage,
  }) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();
    const expectedAppCopyName = `${appName} (1)`;
    appNames.push(appName);
    appNames.push(expectedAppCopyName);

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.createAppUsingAppTileButton(appName);

    await appAdminPage.sharedNavPage.adminGearIcon.click();

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.appTileLink.hover();

    await expect(adminHomePage.appTileCreateButton).toBeVisible();

    await adminHomePage.appTileCreateButton.click();

    await expect(
      adminHomePage.createAppDialog.copyFromRadioButton
    ).toBeVisible();

    await adminHomePage.createAppDialog.copyFromRadioButton.click();
    await adminHomePage.createAppDialog.selectAnAppDropdown.click();
    await adminHomePage.createAppDialog.appToCopy(appName).click();
    await adminHomePage.createAppDialog.continueButton.click();

    await expect(adminHomePage.createAppModal.nameInput).toBeVisible();

    await expect(adminHomePage.createAppModal.nameInput).toHaveValue(
      expectedAppCopyName
    );

    await adminHomePage.createAppModal.saveButton.click();

    await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
    await expect(appAdminPage.appName).toHaveText(expectedAppCopyName);
  });

  test('Create a copy of an app via the Create App button on the Apps admin page', async ({
    sysAdminPage,
  }) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appsAdminPage = new AppsAdminPage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();
    const expectedAppCopyName = `${appName} (1)`;
    appNames.push(appName);
    appNames.push(expectedAppCopyName);

    await adminHomePage.appTileLink.click();

    await appsAdminPage.page.waitForLoadState();
    await appsAdminPage.createApp(appName);
    await appAdminPage.closeButton.click();

    await appsAdminPage.page.waitForLoadState();
    await appsAdminPage.createAppButton.click();

    await expect(
      appsAdminPage.createAppDialog.copyFromRadioButton
    ).toBeVisible();

    await appsAdminPage.createAppDialog.copyFromRadioButton.click();
    await appsAdminPage.createAppDialog.selectAnAppDropdown.click();
    await appsAdminPage.createAppDialog.appToCopy(appName).click();
    await appsAdminPage.createAppDialog.continueButton.click();

    await expect(adminHomePage.createAppModal.nameInput).toBeVisible();

    await expect(appsAdminPage.createAppModal.nameInput).toHaveValue(
      expectedAppCopyName
    );

    await appsAdminPage.createAppModal.saveButton.click();

    await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
    await expect(appAdminPage.appName).toHaveText(expectedAppCopyName);
  });

  test('Delete an app', async ({ sysAdminPage }) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appsAdminPage = new AppsAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();
    const appRow = appsAdminPage.appGrid
      .getByRole('row', { name: appName })
      .first();
    const appDeleteButton = appRow.getByTitle('Delete App');

    await adminHomePage.appTileLink.click();

    await appsAdminPage.createApp(appName);

    await appsAdminPage.goto();

    await expect(appRow).toBeVisible();

    await appRow.hover();

    await appDeleteButton.click();

    await expect(appsAdminPage.deleteAppDialog.confirmationInput).toBeVisible();

    await appsAdminPage.deleteAppDialog.confirmationInput.type('OK', {
      delay: 100,
    });

    await expect(appsAdminPage.deleteAppDialog.confirmationInput).toHaveValue(
      'OK'
    );
    await expect(appsAdminPage.deleteAppDialog.deleteButton).toBeEnabled();

    await appsAdminPage.deleteAppDialog.deleteButton.click();
    await appsAdminPage.deleteAppDialog.waitForModalToBeDismissed();
    await appsAdminPage.page.waitForLoadState('networkidle');

    await expect(appRow).not.toBeAttached();
  });
});
