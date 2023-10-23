import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/appAdminPage';
import { AppsAdminPage } from './../../pageObjectModels/appsAdminPage';

type AppTestFixtures = {
  adminHomePage: AdminHomePage;
  appsAdminPage: AppsAdminPage;
  appAdminPage: AppAdminPage;
};

const test = base.extend<AppTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
  appsAdminPage: async ({ sysAdminPage }, use) => {
    const appsAdminPage = new AppsAdminPage(sysAdminPage);
    await use(appsAdminPage);
  },
  appAdminPage: async ({ adminHomePage }, use) => {
    const appAdminPage = new AppAdminPage(adminHomePage.page);
    await use(appAdminPage);
  },
});

test.describe('app', () => {
  let appsToDelete: string[] = [];

  test.beforeEach(async ({ adminHomePage }) => {
    await adminHomePage.goto();
  });

  test.afterEach(async ({ appsAdminPage }) => {
    await appsAdminPage.deleteApps(appsToDelete);
    appsToDelete = [];
  });

  test('Create an app via the create button on the header of on the admin home page', async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app', async () => {
      await adminHomePage.createAppUsingHeaderCreateButton(appName);
    });

    await test.step('Verify the app was created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.appName).toHaveText(appName);
    });
  });

  test('Create an app via the create button on the Apps tile on the admin home page', async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app', async () => {
      await adminHomePage.createAppUsingAppTileButton(appName);
    });

    await test.step('Verify app created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.appName).toHaveText(appName);
    });
  });

  test('Create an app via the Create App button on the Apps admin page', async ({
    adminHomePage,
    appsAdminPage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Navigate to the Apps admin page', async () => {
      await adminHomePage.appTileLink.click();
    });

    await test.step('Create the app', async () => {
      await appsAdminPage.createApp(appName);
    });

    await test.step('Verify app created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.appName).toHaveText(appName);
    });
  });

  test('Create a copy of an app via the create button on the header of the admin home page', async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const expectedAppCopyName = `${appName} (1)`;
    appsToDelete.push(appName);
    appsToDelete.push(expectedAppCopyName);

    await test.step('Create the app to be copied', async () => {
      await adminHomePage.createAppUsingHeaderCreateButton(appName);
    });

    await test.step('Navigate back to admin home page', async () => {
      await appAdminPage.sidebar.adminGearIcon.click();
    });

    await test.step('Create the copy of the app', async () => {
      await adminHomePage.page.waitForLoadState();
      await adminHomePage.adminNav.adminCreateButton.hover();

      await expect(adminHomePage.adminNav.adminCreateMenu).toBeVisible();

      await adminHomePage.adminNav.appCreateMenuOption.click();

      await expect(
        adminHomePage.createAppDialog.copyFromRadioButton
      ).toBeVisible();

      await adminHomePage.createAppDialog.copyFromRadioButton.click();
      await adminHomePage.createAppDialog.selectAnAppDropdown.click();
      await adminHomePage.createAppDialog.getAppToCopy(appName).click();
      await adminHomePage.createAppDialog.continueButton.click();

      await expect(adminHomePage.createAppModal.nameInput).toBeVisible();

      await expect(adminHomePage.createAppModal.nameInput).toHaveValue(
        expectedAppCopyName
      );

      await adminHomePage.createAppModal.saveButton.click();
    });

    await test.step('Verify app created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.appName).toHaveText(expectedAppCopyName);
    });
  });

  test('Create a copy of an app via the create button on the Apps tile on the admin home page', async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const expectedAppCopyName = `${appName} (1)`;
    appsToDelete.push(appName);
    appsToDelete.push(expectedAppCopyName);

    await test.step('Create the app to be copied', async () => {
      await adminHomePage.createAppUsingAppTileButton(appName);
    });

    await test.step('Navigate back to admin home page', async () => {
      await appAdminPage.sidebar.adminGearIcon.click();
    });

    await test.step('Create the copy of the app', async () => {
      await adminHomePage.page.waitForLoadState();
      await adminHomePage.appTileLink.hover();

      await expect(adminHomePage.appTileCreateButton).toBeVisible();

      await adminHomePage.appTileCreateButton.click();

      await expect(
        adminHomePage.createAppDialog.copyFromRadioButton
      ).toBeVisible();

      await adminHomePage.createAppDialog.copyFromRadioButton.click();
      await adminHomePage.createAppDialog.selectAnAppDropdown.click();
      await adminHomePage.createAppDialog.getAppToCopy(appName).click();
      await adminHomePage.createAppDialog.continueButton.click();

      await expect(adminHomePage.createAppModal.nameInput).toBeVisible();

      await expect(adminHomePage.createAppModal.nameInput).toHaveValue(
        expectedAppCopyName
      );

      await adminHomePage.createAppModal.saveButton.click();
    });

    await test.step('Verify app created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.appName).toHaveText(expectedAppCopyName);
    });
  });

  test('Create a copy of an app via the Create App button on the Apps admin page', async ({
    adminHomePage,
    appsAdminPage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const expectedAppCopyName = `${appName} (1)`;
    appsToDelete.push(appName);
    appsToDelete.push(expectedAppCopyName);

    await test.step('Navigate to the Apps admin page', async () => {
      await adminHomePage.appTileLink.click();
    });

    await test.step('Create the app to be copied', async () => {
      await appsAdminPage.page.waitForLoadState();
      await appsAdminPage.createApp(appName);
      await appAdminPage.closeButton.click();
    });

    await test.step('Create the copy of the app', async () => {
      await appsAdminPage.page.waitForLoadState();
      await appsAdminPage.createAppButton.click();

      await expect(
        appsAdminPage.createAppDialog.copyFromRadioButton
      ).toBeVisible();

      await appsAdminPage.createAppDialog.copyFromRadioButton.click();
      await appsAdminPage.createAppDialog.selectAnAppDropdown.click();
      await appsAdminPage.createAppDialog.getAppToCopy(appName).click();
      await appsAdminPage.createAppDialog.continueButton.click();

      await expect(adminHomePage.createAppModal.nameInput).toBeVisible();

      await expect(appsAdminPage.createAppModal.nameInput).toHaveValue(
        expectedAppCopyName
      );

      await appsAdminPage.createAppModal.saveButton.click();
    });

    await test.step('Verify app created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.appName).toHaveText(expectedAppCopyName);
    });
  });

  test("Update an app's name", async ({ appAdminPage, adminHomePage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const updatedAppName = `${appName}-updated`;
    appsToDelete.push(updatedAppName);

    await test.step('Create the app whose name will be updated', async () => {
      await adminHomePage.createApp(appName);
    });

    await test.step("Update the app's name", async () => {
      await appAdminPage.editGeneralSettingsLink.click();

      await expect(
        appAdminPage.editAppGeneralSettingsModal.nameInput
      ).toHaveValue(appName);

      await appAdminPage.editAppGeneralSettingsModal.nameInput.fill(
        updatedAppName
      );
      await appAdminPage.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's name was updated correctly", async () => {
      await expect(appAdminPage.appName).toHaveText(updatedAppName);
    });
  });

  test('Disable an app', async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app to be disabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.appStatus).toHaveText('Enabled');
    });

    await test.step('Disable the app', async () => {
      await appAdminPage.editGeneralSettingsLink.click();

      await expect(
        appAdminPage.editAppGeneralSettingsModal.statusSwitch
      ).toHaveAttribute('aria-checked', 'true');

      await appAdminPage.editAppGeneralSettingsModal.statusToggle.click();

      await expect(
        appAdminPage.editAppGeneralSettingsModal.statusSwitch
      ).toHaveAttribute('aria-checked', 'false');

      await appAdminPage.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify app was disabled correctly', async () => {
      await expect(appAdminPage.appStatus).toHaveText('Disabled');
    });
  });

  test('Enable an app', async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app to be enabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.appStatus).toHaveText('Enabled');
    });

    await test.step('Disable the app', async () => {
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

    await test.step('Enable the app', async () => {
      await appAdminPage.editGeneralSettingsLink.click();

      await expect(
        appAdminPage.editAppGeneralSettingsModal.statusSwitch
      ).toHaveAttribute('aria-checked', 'false');

      await appAdminPage.editAppGeneralSettingsModal.statusToggle.click();

      await expect(
        appAdminPage.editAppGeneralSettingsModal.statusSwitch
      ).toHaveAttribute('aria-checked', 'true');

      await appAdminPage.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify app was enabled correctly', async () => {
      await expect(appAdminPage.appStatus).toHaveText('Enabled');
    });
  });

  test("Update an app's description.", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const updatedDescription = 'This is an updated description';
    appsToDelete.push(appName);

    await test.step('Create the app whose description will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.appDescription).toHaveText('');
    });

    await test.step("Update the app's description", async () => {
      await appAdminPage.editGeneralSettingsLink.click();

      await expect(
        appAdminPage.editAppGeneralSettingsModal.descriptionEditor
      ).toHaveText('');

      await appAdminPage.editAppGeneralSettingsModal.descriptionEditor.fill(
        updatedDescription
      );
      await appAdminPage.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's description was updated correctly", async () => {
      await expect(appAdminPage.appDescription).toHaveText(updatedDescription);
    });
  });

  test("Disable an app's content versioning", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be disabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.appContentVersionStatus).toHaveText(
        'Enabled - Direct User Saves'
      );
    });

    await test.step("Disable the app's content versioning", async () => {
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
    });

    await test.step("Verify app's content versioning was disabled correctly", async () => {
      await expect(appAdminPage.appContentVersionStatus).toHaveText('Disabled');
    });
  });

  test("Enable an app's content versioning", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be enabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.appContentVersionStatus).toHaveText(
        'Enabled - Direct User Saves'
      );
    });

    await test.step("Disable the app's content versioning", async () => {
      await appAdminPage.editGeneralSettingsLink.click();
      await appAdminPage.editAppGeneralSettingsModal.contentVersionStatusToggle.click();
      await appAdminPage.editAppGeneralSettingsModal.saveButton.click();
      await expect(appAdminPage.appContentVersionStatus).toHaveText('Disabled');
    });

    await test.step("Enable the app's content versioning", async () => {
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
    });

    await test.step("Verify app's content versioning was enabled correctly", async () => {
      await expect(appAdminPage.appContentVersionStatus).toHaveText(
        'Enabled - Direct User Saves'
      );
    });
  });

  test("Change the save types of an app's content versioning", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be changed', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.appContentVersionStatus).toHaveText(
        'Enabled - Direct User Saves'
      );
    });

    await test.step("Change the app's content versioning", async () => {
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
    });

    await test.step("Verify app's content versioning was changed correctly", async () => {
      await expect(appAdminPage.appContentVersionStatus).toHaveText(
        'Enabled - Direct User Saves, Indirect User Saves, API Saves, System Saves'
      );
    });
  });

  test("Disable an app's concurrent edit alert", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose concurrent edit alert will be disabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.concurrentEditAlertStatus).toHaveText(
        'Enabled'
      );
    });

    await test.step("Disable the app's concurrent edit alert", async () => {
      await appAdminPage.editGeneralSettingsLink.click();

      await expect(
        appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox
      ).toBeChecked();

      await appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox.uncheck();

      await expect(
        appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox
      ).not.toBeChecked();

      await appAdminPage.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's concurrent edit alert was disabled correctly", async () => {
      await expect(appAdminPage.concurrentEditAlertStatus).toHaveText(
        'Disabled'
      );
    });
  });

  test("Enable an app's concurrent edit alert", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose concurrent edit alert will be enabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.concurrentEditAlertStatus).toHaveText(
        'Enabled'
      );
    });

    await test.step("Disable the app's concurrent edit alert", async () => {
      await appAdminPage.editGeneralSettingsLink.click();
      await appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox.uncheck();
      await appAdminPage.editAppGeneralSettingsModal.saveButton.click();
      await expect(appAdminPage.concurrentEditAlertStatus).toHaveText(
        'Disabled'
      );
    });

    await test.step("Enable the app's concurrent edit alert", async () => {
      await appAdminPage.editGeneralSettingsLink.click();

      await expect(
        appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox
      ).not.toBeChecked();

      await appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox.check();

      await expect(
        appAdminPage.editAppGeneralSettingsModal.concurrentEditAlertCheckbox
      ).toBeChecked();

      await appAdminPage.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's concurrent edit alert was enabled correctly", async () => {
      await expect(appAdminPage.concurrentEditAlertStatus).toHaveText(
        'Enabled'
      );
    });
  });

  test("Update an app's display link field", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose display link field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.displayLink).toHaveText('Record Id');
    });

    await test.step("Update the app's display link field", async () => {
      await appAdminPage.editDisplaySettingsLink.click();
      await appAdminPage.editAppDisplaySettingsModal.displayLinkSelect.click();
      await appAdminPage.page
        .getByRole('option', { name: 'Created Date' })
        .click();
      await appAdminPage.editAppDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's display link field was updated correctly", async () => {
      await expect(appAdminPage.displayLink).toHaveText('Created Date');
    });
  });

  test("Update an app's integration link field", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose integration link field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.integrationLink).toHaveText('Record Id');
    });

    await test.step("Update the app's integration link field", async () => {
      await appAdminPage.editDisplaySettingsLink.click();
      await appAdminPage.editAppDisplaySettingsModal.integrationLinkSelect.click();
      await appAdminPage.page
        .getByRole('option', { name: 'Created Date' })
        .click();
      await appAdminPage.editAppDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's integration link field was updated correctly", async () => {
      await expect(appAdminPage.integrationLink).toHaveText('Created Date');
    });
  });

  test("Update an app's display fields", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose display fields will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.displayFields).toHaveText('Record Id');
    });

    await test.step("Update the app's display fields", async () => {
      await appAdminPage.editDisplaySettingsLink.click();
      await appAdminPage.editAppDisplaySettingsModal.displayFieldsSelect.click();
      await appAdminPage.editAppDisplaySettingsModal
        .getDisplayFieldOption('Created Date')
        .click();
      await appAdminPage.editAppDisplaySettingsModal.displayFieldsSelect.click();
      await appAdminPage.editAppDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's display fields were updated correctly", async () => {
      await expect(appAdminPage.displayFields).toHaveText(/Record Id/);
      await expect(appAdminPage.displayFields).toHaveText(/Created Date/);
    });
  });

  test("Update an app's primary sort field", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose primary sort field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.sort).toHaveText('None');
    });

    await test.step("Update the app's primary sort field", async () => {
      await appAdminPage.editDisplaySettingsLink.click();
      await appAdminPage.editAppDisplaySettingsModal.primarySortSelect.click();
      await appAdminPage.page
        .getByRole('option', { name: 'Record Id' })
        .click();

      await expect(
        appAdminPage.editAppDisplaySettingsModal.primarySortDirectionSelect
      ).toBeVisible();
      await expect(
        appAdminPage.editAppDisplaySettingsModal.primarySortDirectionSelect
      ).toHaveText('Ascending');

      await appAdminPage.editAppDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's primary sort field was updated correctly", async () => {
      await expect(appAdminPage.sort).toHaveText('Record Id (Ascending)');
    });
  });

  test("Update an app's secondary sort field", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose secondary sort field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.sort).toHaveText('None');
    });

    await test.step("Update the app's secondary sort field", async () => {
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

      await expect(
        appAdminPage.editAppDisplaySettingsModal.secondarySortDirectionSelect
      ).toBeVisible();
      await expect(
        appAdminPage.editAppDisplaySettingsModal.secondarySortDirectionSelect
      ).toHaveText('Ascending');

      await appAdminPage.editAppDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's secondary sort field was updated correctly", async () => {
      await expect(appAdminPage.sort).toHaveText(/Record Id \(Ascending\)/);
      await expect(appAdminPage.sort).toHaveText(/Created Date \(Ascending\)/);
    });
  });

  test("Change an app's administration permissions to private", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.adminPermissions).toHaveText('Public');
    });

    await test.step("Change the app's administration permissions to private", async () => {
      await appAdminPage.editAdminSettingsLink.click();
      await appAdminPage.editAppAdminSettingsModal.selectAdminPermissions(
        'Private'
      );

      await expect(
        appAdminPage.editAppAdminSettingsModal.usersSelect
      ).toBeVisible();
      await expect(
        appAdminPage.editAppAdminSettingsModal.groupsSelect
      ).toBeVisible();
      await expect(
        appAdminPage.editAppAdminSettingsModal.rolesSelect
      ).toBeVisible();

      await appAdminPage.editAppAdminSettingsModal.saveButton.click();
    });

    await test.step("Verify app's administration permissions were set to private", async () => {
      await expect(appAdminPage.adminPermissions).toHaveText('Private');
    });
  });

  test('Give app administration permissions to specific users', async () => {
    // TODO: Implement this test
    expect(true).toBe(false);
  });

  test('Give app administration permissions to specific roles', async () => {
    // TODO: Implement this test
    expect(true).toBe(false);
  });

  test('Give app administration permissions to specific groups', async () => {
    // TODO: Implement this test
    expect(true).toBe(false);
  });

  test("Change an app's administration permissions to public", async ({
    adminHomePage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.adminPermissions).toHaveText('Public');
    });

    await test.step("Change the app's administration permissions to private", async () => {
      await appAdminPage.editAdminSettingsLink.click();
      await appAdminPage.editAppAdminSettingsModal.selectAdminPermissions(
        'Private'
      );
      await appAdminPage.editAppAdminSettingsModal.saveButton.click();
    });

    await test.step("Change the app's administration permissions to public", async () => {
      await appAdminPage.editAdminSettingsLink.click();
      await appAdminPage.editAppAdminSettingsModal.selectAdminPermissions(
        'Public'
      );

      await expect(
        appAdminPage.editAppAdminSettingsModal.usersSelect
      ).toBeHidden();
      await expect(
        appAdminPage.editAppAdminSettingsModal.groupsSelect
      ).toBeHidden();
      await expect(
        appAdminPage.editAppAdminSettingsModal.rolesSelect
      ).toBeHidden();

      await appAdminPage.editAppAdminSettingsModal.saveButton.click();
    });

    await test.step("Verify app's administration permissions were set to public", async () => {
      await expect(appAdminPage.adminPermissions).toHaveText('Public');
    });
  });

  test('Delete an app', async ({
    adminHomePage,
    appsAdminPage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const appRow = appsAdminPage.appGrid
      .getByRole('row', { name: appName })
      .first();
    const appDeleteButton = appRow.getByTitle('Delete App');

    await test.step('Navigate to the Apps admin page', async () => {
      await adminHomePage.appTileLink.click();
    });

    await test.step('Create the app to be deleted', async () => {
      await appsAdminPage.createApp(appName);
      await appAdminPage.page.waitForLoadState();
      await appAdminPage.closeButton.click();
    });

    await test.step('Navigate to apps admin page', async () => {
      await appsAdminPage.goto();
      await expect(appRow).toBeVisible();
    });

    await test.step('Delete the app', async () => {
      await appRow.hover();

      await appDeleteButton.click();

      await expect(
        appsAdminPage.deleteAppDialog.confirmationInput
      ).toBeVisible();

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
      await appsAdminPage.deleteAppDialog.waitForDialogToBeDismissed();
      await appsAdminPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify app was deleted correctly', async () => {
      await expect(appRow).not.toBeAttached();
    });
  });
});
