import { expect, test } from '@playwright/test';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { UserFactory } from '../../factories/userFactory';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/appAdminPage';
import { AppsAdminPage } from '../../pageObjectModels/appsAdminPage';
import { DashboardPage } from '../../pageObjectModels/dashboardPage';
import { LoginPage } from '../../pageObjectModels/loginPage';

test.describe('app', () => {
  let appNames: string[] = [];

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = UserFactory.createSysAdminUser();
    const dashboardPage = new DashboardPage(page);

    await loginPage.login(user);
    await dashboardPage.page.waitForLoadState();
    await dashboardPage.sharedNavPage.adminGearIcon.click();
  });

  test.afterEach(async ({ page }) => {
    const appsAdminPage = new AppsAdminPage(page);
    await appsAdminPage.goto();

    for (const appName of appNames) {
      const appRow = appsAdminPage.appGrid
        .getByRole('row', { name: appName })
        .first();
      const appDeleteButton = appRow.getByTitle('Delete App');

      await appRow.hover();

      await appDeleteButton.waitFor();
      await appDeleteButton.click();

      await appsAdminPage.deleteAppDialog.dialog.waitFor();
      await appsAdminPage.deleteAppDialog.confirmationInput.focus();
      await appsAdminPage.deleteAppDialog.confirmationInput.type('OK');
      await appsAdminPage.deleteAppDialog.deleteButton.click();

      await appsAdminPage.page.waitForLoadState('networkidle');
    }

    appNames = [];
  });

  test('Create an app via the create button on the header of on the admin home page', async ({
    page,
  }) => {
    const adminHomePage = new AdminHomePage(page);
    const appAdminPage = new AppAdminPage(page);
    const appName = FakeDataFactory.createFakeAppName();
    appNames.push(appName);

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.sharedAdminNavPage.adminCreateButton.hover();
    await adminHomePage.sharedAdminNavPage.adminCreateMenu.waitFor();
    await adminHomePage.sharedAdminNavPage.appCreateMenuOption.click();

    await adminHomePage.createAppDialog.continueButton.waitFor();
    await adminHomePage.createAppDialog.continueButton.click();

    await adminHomePage.createAppModal.nameInput.waitFor();
    await adminHomePage.createAppModal.nameInput.fill(appName);
    await adminHomePage.createAppModal.saveButton.click();

    await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
    await expect(appAdminPage.appName).toHaveText(appName);
  });

  test('Create an app via the create button on the Apps tile on the admin home page', async ({
    page,
  }) => {
    const adminHomePage = new AdminHomePage(page);
    const appAdminPage = new AppAdminPage(page);
    const appName = FakeDataFactory.createFakeAppName();
    appNames.push(appName);

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.appTileLink.hover();
    await adminHomePage.appTileCreateButton.waitFor();
    await adminHomePage.appTileCreateButton.click();

    await adminHomePage.createAppDialog.continueButton.waitFor();
    await adminHomePage.createAppDialog.continueButton.click();

    await adminHomePage.createAppModal.nameInput.waitFor();
    await adminHomePage.createAppModal.nameInput.fill(appName);
    await adminHomePage.createAppModal.saveButton.click();

    await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
    await expect(appAdminPage.appName).toHaveText(appName);
  });

  test('Create an app via the "Create App" button on the Apps admin page', async ({
    page,
  }) => {
    const adminHomePage = new AdminHomePage(page);
    const appsAdminPage = new AppsAdminPage(page);
    const appAdminPage = new AppAdminPage(page);
    const appName = FakeDataFactory.createFakeAppName();
    appNames.push(appName);

    await adminHomePage.appTileLink.click();

    await appsAdminPage.page.waitForLoadState();
    await appsAdminPage.createAppButton.click();

    await appsAdminPage.createAppDialog.continueButton.waitFor();
    await appsAdminPage.createAppDialog.continueButton.click();

    await appsAdminPage.createAppModal.nameInput.waitFor();
    await appsAdminPage.createAppModal.nameInput.fill(appName);
    await appsAdminPage.createAppModal.saveButton.click();

    await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
    await expect(appAdminPage.appName).toHaveText(appName);
  });

  test('Create a copy of an app via the create button on the header of the admin home page.', async ({
    page,
  }) => {
    const adminHomePage = new AdminHomePage(page);
    const appAdminPage = new AppAdminPage(page);
    const appName = FakeDataFactory.createFakeAppName();
    const expectedAppCopyName = `${appName} (1)`;
    appNames.push(appName);
    appNames.push(expectedAppCopyName);

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.sharedAdminNavPage.adminCreateButton.hover();
    await adminHomePage.sharedAdminNavPage.adminCreateMenu.waitFor();
    await adminHomePage.sharedAdminNavPage.appCreateMenuOption.click();

    await adminHomePage.createAppDialog.continueButton.waitFor();
    await adminHomePage.createAppDialog.continueButton.click();

    await adminHomePage.createAppModal.nameInput.waitFor();
    await adminHomePage.createAppModal.nameInput.fill(appName);
    await adminHomePage.createAppModal.saveButton.click();

    await appAdminPage.sharedNavPage.adminGearIcon.click();

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.sharedAdminNavPage.adminCreateButton.hover();
    await adminHomePage.sharedAdminNavPage.adminCreateMenu.waitFor();
    await adminHomePage.sharedAdminNavPage.appCreateMenuOption.click();

    await adminHomePage.createAppDialog.copyFromRadioButton.waitFor();
    await adminHomePage.createAppDialog.copyFromRadioButton.click();
    await adminHomePage.createAppDialog.selectAnAppDropdown.click();
    await adminHomePage.createAppDialog.appToCopy(appName).click();
    await adminHomePage.createAppDialog.continueButton.click();

    await adminHomePage.createAppModal.nameInput.waitFor();

    await expect(adminHomePage.createAppModal.nameInput).toHaveValue(
      expectedAppCopyName
    );

    await adminHomePage.createAppModal.saveButton.click();

    await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
    await expect(appAdminPage.appName).toHaveText(expectedAppCopyName);
  });

  test('Create a copy of an app via the create button on the Apps tile on the admin home page.', async ({
    page,
  }) => {
    const adminHomePage = new AdminHomePage(page);
    const appAdminPage = new AppAdminPage(page);
    const appName = FakeDataFactory.createFakeAppName();
    const expectedAppCopyName = `${appName} (1)`;
    appNames.push(appName);
    appNames.push(expectedAppCopyName);

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.appTileLink.hover();
    await adminHomePage.appTileCreateButton.waitFor();
    await adminHomePage.appTileCreateButton.click();

    await adminHomePage.createAppDialog.continueButton.waitFor();
    await adminHomePage.createAppDialog.continueButton.click();

    await adminHomePage.createAppModal.nameInput.waitFor();
    await adminHomePage.createAppModal.nameInput.fill(appName);
    await adminHomePage.createAppModal.saveButton.click();

    await appAdminPage.sharedNavPage.adminGearIcon.click();

    await adminHomePage.page.waitForLoadState();
    await adminHomePage.appTileLink.hover();
    await adminHomePage.appTileCreateButton.waitFor();
    await adminHomePage.appTileCreateButton.click();

    await adminHomePage.createAppDialog.copyFromRadioButton.waitFor();
    await adminHomePage.createAppDialog.copyFromRadioButton.click();
    await adminHomePage.createAppDialog.selectAnAppDropdown.click();
    await adminHomePage.createAppDialog.appToCopy(appName).click();
    await adminHomePage.createAppDialog.continueButton.click();

    await adminHomePage.createAppModal.nameInput.waitFor();

    await expect(adminHomePage.createAppModal.nameInput).toHaveValue(
      expectedAppCopyName
    );

    await adminHomePage.createAppModal.saveButton.click();

    await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
    await expect(appAdminPage.appName).toHaveText(expectedAppCopyName);
  });

  test('Delete an app', async ({ page }) => {
    const adminHomePage = new AdminHomePage(page);
    const appsAdminPage = new AppsAdminPage(page);
    const appAdminPage = new AppAdminPage(page);
    const appName = FakeDataFactory.createFakeAppName();
    const appRow = appsAdminPage.appGrid
      .getByRole('row', { name: appName })
      .first();
    const appDeleteButton = appRow.getByTitle('Delete App');

    await adminHomePage.appTileLink.click();

    await appsAdminPage.page.waitForLoadState();
    await appsAdminPage.createAppButton.click();

    await appsAdminPage.createAppDialog.continueButton.waitFor();
    await appsAdminPage.createAppDialog.continueButton.click();

    await appsAdminPage.createAppModal.nameInput.waitFor();
    await appsAdminPage.createAppModal.nameInput.fill(appName);
    await appsAdminPage.createAppModal.saveButton.click();

    await appAdminPage.closeButton.click();

    await appsAdminPage.page.waitForLoadState('domcontentloaded');

    await appRow.hover();
    await appDeleteButton.waitFor();

    await expect(appDeleteButton).toBeVisible();

    await appDeleteButton.click();

    await appsAdminPage.deleteAppDialog.confirmationInput.waitFor();
    await appsAdminPage.deleteAppDialog.confirmationInput.focus();
    await appsAdminPage.deleteAppDialog.confirmationInput.type('OK');
    await appsAdminPage.deleteAppDialog.deleteButton.click();

    await expect(appRow).not.toBeAttached();
  });
});
