import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { Page, expect, test } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/appAdminPage';
import { AppsAdminPage } from './../../pageObjectModels/appsAdminPage';
import { DashboardPage } from './../../pageObjectModels/dashboardPage';

test.describe('app', () => {
  let appsToDelete: string[] = [];

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

    appsToDelete = [];
  });

  test('Create an app via the create button on the header of on the admin home page', async ({
    sysAdminPage,
  }) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

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
    appsToDelete.push(appName);

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
    appsToDelete.push(appName);

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
    appsToDelete.push(appName);
    appsToDelete.push(expectedAppCopyName);

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
    appsToDelete.push(appName);
    appsToDelete.push(expectedAppCopyName);

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
    appsToDelete.push(appName);
    appsToDelete.push(expectedAppCopyName);

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

  test("Update an app's name", async ({ sysAdminPage }) => {
    const { appAdminPage, appName } = await useAppSetup(
      sysAdminPage,
      appsToDelete
    );

    const updatedAppName = `${appName}-updated`;
    const appIndex = appsToDelete.indexOf(appName);
    appsToDelete[appIndex] = updatedAppName;

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.nameInput
    ).toHaveValue(appName);

    await appAdminPage.editAppGeneralSettingsModal.nameInput.fill(
      updatedAppName
    );
    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.appName).toHaveText(updatedAppName);
  });

  test('Disable an app', async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.appStatus).toHaveText('Enabled');

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.statusSwitch
    ).toHaveAttribute('aria-checked', 'true');

    await appAdminPage.editAppGeneralSettingsModal.statusToggle.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.statusSwitch
    ).toHaveAttribute('aria-checked', 'false');

    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.appStatus).toHaveText('Disabled');
  });

  test('Enable an app', async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.appStatus).toHaveText('Enabled');

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.statusSwitch
    ).toHaveAttribute('aria-checked', 'true');

    await appAdminPage.editAppGeneralSettingsModal.statusToggle.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.statusSwitch
    ).toHaveAttribute('aria-checked', 'false');

    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.appStatus).toHaveText('Disabled');

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.statusSwitch
    ).toHaveAttribute('aria-checked', 'false');

    await appAdminPage.editAppGeneralSettingsModal.statusToggle.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.statusSwitch
    ).toHaveAttribute('aria-checked', 'true');

    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.appStatus).toHaveText('Enabled');
  });

  test("Update an app's description.", async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.appDescription).toHaveText('');

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.descriptionEditor
    ).toHaveText('');

    const updatedDescription = 'This is an updated description';

    await appAdminPage.editAppGeneralSettingsModal.descriptionEditor.fill(
      updatedDescription
    );
    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.appDescription).toHaveText(updatedDescription);
  });

  test("Disable an app's content versioning", async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.appContentVersionStatus).toHaveText(
      'Enabled - Direct User Saves'
    );

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionStatusSwitch
    ).toHaveAttribute('aria-checked', 'true');

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionTypes
    ).toBeVisible();

    await appAdminPage.editAppGeneralSettingsModal.contentVersionStatusToggle.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionStatusSwitch
    ).toHaveAttribute('aria-checked', 'false');

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionTypes
    ).toBeHidden();

    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.appContentVersionStatus).toHaveText('Disabled');
  });

  test("Enable an app's content versioning", async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.appContentVersionStatus).toHaveText(
      'Enabled - Direct User Saves'
    );

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionStatusSwitch
    ).toHaveAttribute('aria-checked', 'true');

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionTypes
    ).toBeVisible();

    await appAdminPage.editAppGeneralSettingsModal.contentVersionStatusToggle.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionStatusSwitch
    ).toHaveAttribute('aria-checked', 'false');

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionTypes
    ).toBeHidden();

    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.appContentVersionStatus).toHaveText('Disabled');

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionStatusSwitch
    ).toHaveAttribute('aria-checked', 'false');

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionTypes
    ).toBeHidden();

    await appAdminPage.editAppGeneralSettingsModal.contentVersionStatusToggle.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionStatusSwitch
    ).toHaveAttribute('aria-checked', 'true');

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionTypes
    ).toBeVisible();

    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.appContentVersionStatus).toHaveText(
      'Enabled - Direct User Saves'
    );
  });

  test("Change the save types of an app's content versioning", async ({
    sysAdminPage,
  }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.appContentVersionStatus).toHaveText(
      'Enabled - Direct User Saves'
    );

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionStatusSwitch
    ).toHaveAttribute('aria-checked', 'true');

    await expect(
      appAdminPage.editAppGeneralSettingsModal.contentVersionTypes
    ).toBeVisible();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.directUserSavesCheckbox
    ).toBeChecked();

    await appAdminPage.editAppGeneralSettingsModal.indirectUserSavesCheckbox.check();
    await appAdminPage.editAppGeneralSettingsModal.apiSavesCheckbox.check();
    await appAdminPage.editAppGeneralSettingsModal.systemSavesCheckbox.check();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.indirectUserSavesCheckbox
    ).toBeChecked();
    await expect(
      appAdminPage.editAppGeneralSettingsModal.apiSavesCheckbox
    ).toBeChecked();
    await expect(
      appAdminPage.editAppGeneralSettingsModal.systemSavesCheckbox
    ).toBeChecked();

    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.appContentVersionStatus).toHaveText(
      'Enabled - Direct User Saves, Indirect User Saves, API Saves, System Saves'
    );
  });

  test("Disable an app's concurrent edit alert", async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.concurrentEditAlertStatus).toHaveText('Enabled');

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox
    ).toBeChecked();

    await appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox.uncheck();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox
    ).not.toBeChecked();

    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.concurrentEditAlertStatus).toHaveText('Disabled');
  });

  test("Enable an app's concurrent edit alert", async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.concurrentEditAlertStatus).toHaveText('Enabled');

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox
    ).toBeChecked();

    await appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox.uncheck();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox
    ).not.toBeChecked();

    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.concurrentEditAlertStatus).toHaveText('Disabled');

    await appAdminPage.editGeneralSettingsLink.click();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox
    ).not.toBeChecked();

    await appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox.check();

    await expect(
      appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox
    ).toBeChecked();

    await appAdminPage.editAppGeneralSettingsModal.saveButton.click();

    await expect(appAdminPage.concurrentEditAlertStatus).toHaveText('Enabled');
  });

  test("Update an app's display link field", async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.displayLink).toHaveText('Record Id');

    await appAdminPage.editDisplaySettingsLink.click();
    await appAdminPage.editAppDisplaySettingsModal.displayLinkSelect.click();
    await appAdminPage.page
      .getByRole('option', { name: 'Created Date' })
      .click();
    await appAdminPage.editAppDisplaySettingsModal.saveButton.click();

    await expect(appAdminPage.displayLink).toHaveText('Created Date');
  });

  test("Update an app's integration link field", async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.integrationLink).toHaveText('Record Id');

    await appAdminPage.editDisplaySettingsLink.click();
    await appAdminPage.editAppDisplaySettingsModal.integrationLinkSelect.click();
    await appAdminPage.page
      .getByRole('option', { name: 'Created Date' })
      .click();
    await appAdminPage.editAppDisplaySettingsModal.saveButton.click();

    await expect(appAdminPage.integrationLink).toHaveText('Created Date');
  });

  test("Update an app's display fields", async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.displayFields).toHaveText('Record Id');

    await appAdminPage.editDisplaySettingsLink.click();
    await appAdminPage.editAppDisplaySettingsModal.displayFieldsSelect.click();
    await appAdminPage.editAppDisplaySettingsModal
      .getDisplayFieldOption('Created Date')
      .click();
    await appAdminPage.editAppDisplaySettingsModal.displayFieldsSelect.click();
    await appAdminPage.editAppDisplaySettingsModal.saveButton.click();

    await expect(appAdminPage.displayFields).toHaveText(/Record Id/);
    await expect(appAdminPage.displayFields).toHaveText(/Created Date/);
  });

  test("Update an app's primary sort field", async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.sort).toHaveText('None');

    await appAdminPage.editDisplaySettingsLink.click();
    await appAdminPage.editAppDisplaySettingsModal.primarySortSelect.click();
    await appAdminPage.page.getByRole('option', { name: 'Record Id' }).click();
    await appAdminPage.editAppDisplaySettingsModal.saveButton.click();

    await expect(appAdminPage.sort).toHaveText('Record Id (Ascending)');
  });

  test("Update an app's secondary sort field", async ({ sysAdminPage }) => {
    const { appAdminPage } = await useAppSetup(sysAdminPage, appsToDelete);

    await expect(appAdminPage.sort).toHaveText('None');

    await appAdminPage.editDisplaySettingsLink.click();
    await appAdminPage.editAppDisplaySettingsModal.selectDisplayLinkField(
      'Created Date'
    );
    await appAdminPage.editAppDisplaySettingsModal.selectPrimarySortField(
      'Record Id'
    );

    await appAdminPage.editAppDisplaySettingsModal.secondarySortSelect.click();
    await appAdminPage.page
      .getByRole('option', { name: 'Created Date' })
      .click();

    await appAdminPage.editAppDisplaySettingsModal.saveButton.click();

    await expect(appAdminPage.sort).toHaveText(/Record Id \(Ascending\)/);
    await expect(appAdminPage.sort).toHaveText(/Created Date \(Ascending\)/);
  });

  test('Delete an app', async ({ sysAdminPage }) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appsAdminPage = new AppsAdminPage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();
    const appRow = appsAdminPage.appGrid
      .getByRole('row', { name: appName })
      .first();
    const appDeleteButton = appRow.getByTitle('Delete App');

    await adminHomePage.appTileLink.click();

    await appsAdminPage.createApp(appName);

    await appAdminPage.page.waitForLoadState();
    await appAdminPage.closeButton.click();

    await appsAdminPage.goto();

    await expect(appRow).toBeVisible();

    await appRow.hover();

    await appDeleteButton.click();

    await expect(appsAdminPage.deleteAppDialog.confirmationInput).toBeVisible();

    await appsAdminPage.deleteAppDialog.confirmationInput.pressSequentially(
      'OK',
      {
        delay: 100,
      }
    );

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

/**
 * Helper function to create an app, add app to delete list, and return objects needed for tests.
 */
async function useAppSetup(sysAdminPage: Page, appsToDelete: string[]) {
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
}
