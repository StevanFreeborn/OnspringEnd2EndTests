import { LayoutItemType } from '../../componentObjectModels/addLayoutItemMenu';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { UserFactory } from '../../factories/userFactory';
import { test as base, expect } from '../../fixtures';
import { UserStatus } from '../../models/user';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/appAdminPage';
import { AddGroupAdminPage } from './../../pageObjectModels/addGroupAdminPage';
import { AddRoleAdminPage } from './../../pageObjectModels/addRoleAdminPage';
import { AddUserAdminPage } from './../../pageObjectModels/addUserAdminPage';
import { AppsAdminPage } from './../../pageObjectModels/appsAdminPage';
import { EditGroupAdminPage } from './../../pageObjectModels/editGroupAdminPage';
import { EditRoleAdminPage } from './../../pageObjectModels/editRoleAdminPage';
import { EditUserAdminPage } from './../../pageObjectModels/editUserAdminPage';
import { GroupsSecurityAdminPage } from './../../pageObjectModels/groupsSecurityAdminPage';
import { RolesSecurityAdminPage } from './../../pageObjectModels/rolesSecurityAdminPage';
import { UsersSecurityAdminPage } from './../../pageObjectModels/usersSecurityAdminPage';

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
  appAdminPage: async ({ sysAdminPage }, use) => {
    const appAdminPage = new AppAdminPage(sysAdminPage);
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
      await expect(appAdminPage.generalTab.appName).toHaveText(appName);
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
      await expect(appAdminPage.generalTab.appName).toHaveText(appName);
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
      await expect(appAdminPage.generalTab.appName).toHaveText(appName);
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

      await expect(adminHomePage.createAppDialog.copyFromRadioButton).toBeVisible();

      await adminHomePage.createAppDialog.copyFromRadioButton.click();
      await adminHomePage.createAppDialog.selectAnAppDropdown.click();
      await adminHomePage.createAppDialog.getAppToCopy(appName).click();
      await adminHomePage.createAppDialog.continueButton.click();

      await expect(adminHomePage.createAppModal.nameInput).toBeVisible();

      await expect(adminHomePage.createAppModal.nameInput).toHaveValue(expectedAppCopyName);

      await adminHomePage.createAppModal.saveButton.click();
    });

    await test.step('Verify app created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.generalTab.appName).toHaveText(expectedAppCopyName);
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

      await expect(adminHomePage.createAppDialog.copyFromRadioButton).toBeVisible();

      await adminHomePage.createAppDialog.copyFromRadioButton.click();
      await adminHomePage.createAppDialog.selectAnAppDropdown.click();
      await adminHomePage.createAppDialog.getAppToCopy(appName).click();
      await adminHomePage.createAppDialog.continueButton.click();

      await expect(adminHomePage.createAppModal.nameInput).toBeVisible();

      await expect(adminHomePage.createAppModal.nameInput).toHaveValue(expectedAppCopyName);

      await adminHomePage.createAppModal.saveButton.click();
    });

    await test.step('Verify app created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.generalTab.appName).toHaveText(expectedAppCopyName);
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

      await expect(appsAdminPage.createAppDialog.copyFromRadioButton).toBeVisible();

      await appsAdminPage.createAppDialog.copyFromRadioButton.click();
      await appsAdminPage.createAppDialog.selectAnAppDropdown.click();
      await appsAdminPage.createAppDialog.getAppToCopy(appName).click();
      await appsAdminPage.createAppDialog.continueButton.click();

      await expect(adminHomePage.createAppModal.nameInput).toBeVisible();

      await expect(appsAdminPage.createAppModal.nameInput).toHaveValue(expectedAppCopyName);

      await appsAdminPage.createAppModal.saveButton.click();
    });

    await test.step('Verify app created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.generalTab.appName).toHaveText(expectedAppCopyName);
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
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.nameInput).toHaveValue(appName);

      await appAdminPage.generalTab.editAppGeneralSettingsModal.nameInput.fill(updatedAppName);
      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's name was updated correctly", async () => {
      await expect(appAdminPage.generalTab.appName).toHaveText(updatedAppName);
    });
  });

  test('Disable an app', async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app to be disabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.appStatus).toHaveText('Enabled');
    });

    await test.step('Disable the app', async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await appAdminPage.generalTab.editAppGeneralSettingsModal.statusToggle.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify app was disabled correctly', async () => {
      await expect(appAdminPage.generalTab.appStatus).toHaveText('Disabled');
    });
  });

  test('Enable an app', async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app to be enabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.appStatus).toHaveText('Enabled');
    });

    await test.step('Disable the app', async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await appAdminPage.generalTab.editAppGeneralSettingsModal.statusToggle.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();

      await expect(appAdminPage.generalTab.appStatus).toHaveText('Disabled');
    });

    await test.step('Enable the app', async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await appAdminPage.generalTab.editAppGeneralSettingsModal.statusToggle.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify app was enabled correctly', async () => {
      await expect(appAdminPage.generalTab.appStatus).toHaveText('Enabled');
    });
  });

  test("Update an app's description.", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const updatedDescription = 'This is an updated description';
    appsToDelete.push(appName);

    await test.step('Create the app whose description will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.appDescription).toHaveText('');
    });

    await test.step("Update the app's description", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.descriptionEditor).toHaveText('');

      await appAdminPage.generalTab.editAppGeneralSettingsModal.descriptionEditor.fill(updatedDescription);
      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's description was updated correctly", async () => {
      await expect(appAdminPage.generalTab.appDescription).toHaveText(updatedDescription);
    });
  });

  test("Disable an app's content versioning", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be disabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.appContentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });

    await test.step("Disable the app's content versioning", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionStatusToggle.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionTypes).toBeHidden();

      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's content versioning was disabled correctly", async () => {
      await expect(appAdminPage.generalTab.appContentVersionStatus).toHaveText('Disabled');
    });
  });

  test("Enable an app's content versioning", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be enabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.appContentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });

    await test.step("Disable the app's content versioning", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();
      await appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionStatusToggle.click();
      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
      await expect(appAdminPage.generalTab.appContentVersionStatus).toHaveText('Disabled');
    });

    await test.step("Enable the app's content versioning", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionTypes).toBeHidden();

      await appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionStatusToggle.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's content versioning was enabled correctly", async () => {
      await expect(appAdminPage.generalTab.appContentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });
  });

  test("Change the save types of an app's content versioning", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be changed', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.appContentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });

    await test.step("Change the app's content versioning", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.directUserSavesCheckbox).toBeChecked();

      await appAdminPage.generalTab.editAppGeneralSettingsModal.indirectUserSavesCheckbox.check();
      await appAdminPage.generalTab.editAppGeneralSettingsModal.apiSavesCheckbox.check();
      await appAdminPage.generalTab.editAppGeneralSettingsModal.systemSavesCheckbox.check();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.indirectUserSavesCheckbox).toBeChecked();
      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.apiSavesCheckbox).toBeChecked();
      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.systemSavesCheckbox).toBeChecked();

      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's content versioning was changed correctly", async () => {
      await expect(appAdminPage.generalTab.appContentVersionStatus).toHaveText(
        'Enabled - Direct User Saves, Indirect User Saves, API Saves, System Saves'
      );
    });
  });

  test("Disable an app's concurrent edit alert", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose concurrent edit alert will be disabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Enabled');
    });

    await test.step("Disable the app's concurrent edit alert", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.concurrentEditAlertCheckbox).toBeChecked();

      await appAdminPage.generalTab.editAppGeneralSettingsModal.concurrentEditAlertCheckbox.uncheck();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.concurrentEditAlertCheckbox).not.toBeChecked();

      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's concurrent edit alert was disabled correctly", async () => {
      await expect(appAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Disabled');
    });
  });

  test("Enable an app's concurrent edit alert", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose concurrent edit alert will be enabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Enabled');
    });

    await test.step("Disable the app's concurrent edit alert", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();
      await appAdminPage.generalTab.editAppGeneralSettingsModal.concurrentEditAlertCheckbox.uncheck();
      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
      await expect(appAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Disabled');
    });

    await test.step("Enable the app's concurrent edit alert", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.concurrentEditAlertCheckbox).not.toBeChecked();

      await appAdminPage.generalTab.editAppGeneralSettingsModal.concurrentEditAlertCheckbox.check();

      await expect(appAdminPage.generalTab.editAppGeneralSettingsModal.concurrentEditAlertCheckbox).toBeChecked();

      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's concurrent edit alert was enabled correctly", async () => {
      await expect(appAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Enabled');
    });
  });

  test("Update an app's display link field", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose display link field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.displayLink).toHaveText('Record Id');
    });

    await test.step("Update the app's display link field", async () => {
      await appAdminPage.generalTab.editDisplaySettingsLink.click();
      await appAdminPage.generalTab.editAppDisplaySettingsModal.displayLinkSelect.click();
      await appAdminPage.page.getByRole('option', { name: 'Created Date' }).click();
      await appAdminPage.generalTab.editAppDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's display link field was updated correctly", async () => {
      await expect(appAdminPage.generalTab.displayLink).toHaveText('Created Date');
    });
  });

  test("Update an app's integration link field", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose integration link field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.integrationLink).toHaveText('Record Id');
    });

    await test.step("Update the app's integration link field", async () => {
      await appAdminPage.generalTab.editDisplaySettingsLink.click();
      await appAdminPage.generalTab.editAppDisplaySettingsModal.integrationLinkSelect.click();
      await appAdminPage.page.getByRole('option', { name: 'Created Date' }).click();
      await appAdminPage.generalTab.editAppDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's integration link field was updated correctly", async () => {
      await expect(appAdminPage.generalTab.integrationLink).toHaveText('Created Date');
    });
  });

  test("Update an app's display fields", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose display fields will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.displayFields).toHaveText('Record Id');
    });

    await test.step("Update the app's display fields", async () => {
      await appAdminPage.generalTab.editDisplaySettingsLink.click();
      await appAdminPage.generalTab.editAppDisplaySettingsModal.addDisplayField('Created Date');
      await appAdminPage.generalTab.editAppDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's display fields were updated correctly", async () => {
      await expect(appAdminPage.generalTab.displayFields).toHaveText(/Record Id/);
      await expect(appAdminPage.generalTab.displayFields).toHaveText(/Created Date/);
    });
  });

  test("Update an app's primary sort field", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose primary sort field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.sort).toHaveText('None');
    });

    await test.step("Update the app's primary sort field", async () => {
      await appAdminPage.generalTab.editDisplaySettingsLink.click();
      await appAdminPage.generalTab.editAppDisplaySettingsModal.selectPrimarySortField('Record Id');

      await expect(appAdminPage.generalTab.editAppDisplaySettingsModal.primarySortDirectionSelect).toBeVisible();
      await expect(appAdminPage.generalTab.editAppDisplaySettingsModal.primarySortDirectionSelect).toHaveText(
        'Ascending'
      );

      await appAdminPage.generalTab.editAppDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's primary sort field was updated correctly", async () => {
      await expect(appAdminPage.generalTab.sort).toHaveText('Record Id (Ascending)');
    });
  });

  test("Update an app's secondary sort field", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose secondary sort field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.sort).toHaveText('None');
    });

    await test.step("Update the app's secondary sort field", async () => {
      await appAdminPage.generalTab.editDisplaySettingsLink.click();
      await appAdminPage.generalTab.editAppDisplaySettingsModal.addDisplayField('Created Date');
      await appAdminPage.generalTab.editAppDisplaySettingsModal.selectPrimarySortField('Record Id');

      await appAdminPage.generalTab.editAppDisplaySettingsModal.selectSecondarySortField('Created Date');

      await expect(appAdminPage.generalTab.editAppDisplaySettingsModal.secondarySortDirectionSelect).toBeVisible();
      await expect(appAdminPage.generalTab.editAppDisplaySettingsModal.secondarySortDirectionSelect).toHaveText(
        'Ascending'
      );

      await appAdminPage.generalTab.editAppDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's secondary sort field was updated correctly", async () => {
      await expect(appAdminPage.generalTab.sort).toHaveText(/Record Id \(Ascending\)/);
      await expect(appAdminPage.generalTab.sort).toHaveText(/Created Date \(Ascending\)/);
    });
  });

  test("Change an app's administration permissions to private", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.adminPermissions).toHaveText('Public');
    });

    await test.step("Change the app's administration permissions to private", async () => {
      await appAdminPage.generalTab.editAdminSettingsLink.click();
      await appAdminPage.generalTab.editAppAdminSettingsModal.selectAdminPermissions('Private');

      await expect(appAdminPage.generalTab.editAppAdminSettingsModal.usersSelect).toBeVisible();
      await expect(appAdminPage.generalTab.editAppAdminSettingsModal.groupsSelect).toBeVisible();
      await expect(appAdminPage.generalTab.editAppAdminSettingsModal.rolesSelect).toBeVisible();

      await appAdminPage.generalTab.editAppAdminSettingsModal.saveButton.click();
    });

    await test.step("Verify app's administration permissions were set to private", async () => {
      await expect(appAdminPage.generalTab.adminPermissions).toHaveText('Private');
    });
  });

  test('Give app administration permissions to specific users', async ({
    adminHomePage,
    sysAdminPage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const newUser = UserFactory.createNewUser(UserStatus.Inactive);
    appsToDelete.push(appName);
    const usersToDelete = [newUser.username];

    await test.step('Create user that will be given admin permissions', async () => {
      const addUserAdminPage = new AddUserAdminPage(sysAdminPage);
      const editUserAdminPage = new EditUserAdminPage(sysAdminPage);
      await addUserAdminPage.addUser(newUser);
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
    });

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await adminHomePage.createApp(appName);
    });

    await test.step('Give app admin permissions to user', async () => {
      await appAdminPage.generalTab.editAdminSettingsLink.click();
      await appAdminPage.generalTab.editAppAdminSettingsModal.selectAdminPermissions('Private');

      await expect(appAdminPage.generalTab.editAppAdminSettingsModal.usersSelect).toBeVisible();

      await appAdminPage.generalTab.editAppAdminSettingsModal.selectUser(newUser.fullName);
      await appAdminPage.generalTab.editAppAdminSettingsModal.saveButton.click();
    });

    await test.step('Verify app admin permissions were given to user', async () => {
      await expect(appAdminPage.generalTab.adminPermissions).toHaveText('Private');
      await expect(appAdminPage.generalTab.adminUsers).toHaveText(newUser.fullName);
    });

    await test.step('Delete user', async () => {
      const usersSecurityAdminPage = new UsersSecurityAdminPage(sysAdminPage);
      await usersSecurityAdminPage.deleteUsers(usersToDelete);
    });
  });

  test('Give app administration permissions to specific roles', async ({
    adminHomePage,
    sysAdminPage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const roleName = FakeDataFactory.createFakeRoleName();
    appsToDelete.push(appName);
    const rolesToDelete = [roleName];

    await test.step('Create role that will be given admin permissions', async () => {
      const addRoleAdminPage = new AddRoleAdminPage(sysAdminPage);
      const editRoleAdminPage = new EditRoleAdminPage(sysAdminPage);
      await addRoleAdminPage.addRole(roleName);
      await addRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
    });

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await adminHomePage.createApp(appName);
    });

    await test.step('Give app admin permissions to role', async () => {
      await appAdminPage.generalTab.editAdminSettingsLink.click();
      await appAdminPage.generalTab.editAppAdminSettingsModal.selectAdminPermissions('Private');

      await expect(appAdminPage.generalTab.editAppAdminSettingsModal.rolesSelect).toBeVisible();

      await appAdminPage.generalTab.editAppAdminSettingsModal.selectRole(roleName);
      await appAdminPage.generalTab.editAppAdminSettingsModal.saveButton.click();
    });

    await test.step('Verify app admin permissions were given to role', async () => {
      await expect(appAdminPage.generalTab.adminPermissions).toHaveText('Private');
      await expect(appAdminPage.generalTab.adminRoles).toHaveText(roleName);
    });

    await test.step('Delete role', async () => {
      const roleSecurityAdminPage = new RolesSecurityAdminPage(sysAdminPage);
      await roleSecurityAdminPage.deleteRoles(rolesToDelete);
    });
  });

  test('Give app administration permissions to specific groups', async ({
    adminHomePage,
    sysAdminPage,
    appAdminPage,
  }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const groupName = FakeDataFactory.createFakeGroupName();
    appsToDelete.push(appName);
    const groupsToDelete = [groupName];

    await test.step('Create group that will be given admin permissions', async () => {
      const addGroupAdminPage = new AddGroupAdminPage(sysAdminPage);
      const editGroupAdminPage = new EditGroupAdminPage(sysAdminPage);
      await addGroupAdminPage.addGroup(groupName);
      await addGroupAdminPage.page.waitForURL(editGroupAdminPage.pathRegex);
    });

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await adminHomePage.createApp(appName);
    });

    await test.step('Give app admin permissions to group', async () => {
      await appAdminPage.generalTab.editAdminSettingsLink.click();
      await appAdminPage.generalTab.editAppAdminSettingsModal.selectAdminPermissions('Private');

      await expect(appAdminPage.generalTab.editAppAdminSettingsModal.groupsSelect).toBeVisible();

      await appAdminPage.generalTab.editAppAdminSettingsModal.selectGroup(groupName);
      await appAdminPage.generalTab.editAppAdminSettingsModal.saveButton.click();
    });

    await test.step('Verify app admin permissions were given to group', async () => {
      await expect(appAdminPage.generalTab.adminPermissions).toHaveText('Private');
      await expect(appAdminPage.generalTab.adminGroups).toHaveText(groupName);
    });

    await test.step('Delete group', async () => {
      const groupSecurityAdminPage = new GroupsSecurityAdminPage(sysAdminPage);
      await groupSecurityAdminPage.deleteGroups(groupsToDelete);
    });
  });

  test("Change an app's administration permissions to public", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.adminPermissions).toHaveText('Public');
    });

    await test.step("Change the app's administration permissions to private", async () => {
      await appAdminPage.generalTab.editAdminSettingsLink.click();
      await appAdminPage.generalTab.editAppAdminSettingsModal.selectAdminPermissions('Private');
      await appAdminPage.generalTab.editAppAdminSettingsModal.saveButton.click();
    });

    await test.step("Change the app's administration permissions to public", async () => {
      await appAdminPage.generalTab.editAdminSettingsLink.click();
      await appAdminPage.generalTab.editAppAdminSettingsModal.selectAdminPermissions('Public');

      await expect(appAdminPage.generalTab.editAppAdminSettingsModal.usersSelect).toBeHidden();
      await expect(appAdminPage.generalTab.editAppAdminSettingsModal.groupsSelect).toBeHidden();
      await expect(appAdminPage.generalTab.editAppAdminSettingsModal.rolesSelect).toBeHidden();

      await appAdminPage.generalTab.editAppAdminSettingsModal.saveButton.click();
    });

    await test.step("Verify app's administration permissions were set to public", async () => {
      await expect(appAdminPage.generalTab.adminPermissions).toHaveText('Public');
    });
  });

  test('Enable geocoding for an app', async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    const addressFieldName = FakeDataFactory.createFakeFieldName('address');
    const cityFieldName = FakeDataFactory.createFakeFieldName('city');
    const stateFieldName = FakeDataFactory.createFakeFieldName('state');
    const zipFieldName = FakeDataFactory.createFakeFieldName('zip');

    const fieldNames = [addressFieldName, cityFieldName, stateFieldName, zipFieldName];

    await test.step('Create app whose geocoding will be enabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.geocodingStatus).toHaveText('Disabled');
    });

    await test.step('Create fields for geocoding mapping', async () => {
      await appAdminPage.layoutTabButton.click();

      for (const fieldName of fieldNames) {
        await appAdminPage.layoutTab.addLayoutItem(LayoutItemType.TextField, fieldName);
      }
    });

    await test.step('Enable geocoding for app', async () => {
      await appAdminPage.generalTabButton.click();
      await appAdminPage.generalTab.editGeocodingSettingsLink.click();
      await appAdminPage.generalTab.editGeocodingSettingsModal.statusToggle.click();

      await expect(appAdminPage.generalTab.editGeocodingSettingsModal.geocodingDataGrid).toBeVisible();

      await appAdminPage.generalTab.editGeocodingSettingsModal.selectAddressField(addressFieldName);
      await appAdminPage.generalTab.editGeocodingSettingsModal.selectCityField(cityFieldName);
      await appAdminPage.generalTab.editGeocodingSettingsModal.selectStateField(stateFieldName);
      await appAdminPage.generalTab.editGeocodingSettingsModal.selectZipField(zipFieldName);
      await appAdminPage.generalTab.editGeocodingSettingsModal.saveButton.click();
    });

    await test.step('Verify geocoding was enabled correctly', async () => {
      await expect(appAdminPage.generalTab.geocodingStatus).toHaveText('Enabled');
      await expect(appAdminPage.generalTab.geocodingData.grid).toBeVisible();
      await expect(appAdminPage.generalTab.geocodingData.address).toHaveText(addressFieldName);
      await expect(appAdminPage.generalTab.geocodingData.city).toHaveText(cityFieldName);
      await expect(appAdminPage.generalTab.geocodingData.state).toHaveText(stateFieldName);
      await expect(appAdminPage.generalTab.geocodingData.zip).toHaveText(zipFieldName);
    });
  });

  test("Update an app's app notes", async ({ adminHomePage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const note = 'This is a note';
    appsToDelete.push(appName);

    await test.step('Create the app whose app notes will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.appNotes).toHaveText('');
    });

    await test.step("Update the app's app notes", async () => {
      await appAdminPage.generalTab.editNotesSettingLink.click();

      await expect(appAdminPage.generalTab.editAppNotesSettingsModal.notesEditor).toHaveText('');

      await appAdminPage.generalTab.editAppNotesSettingsModal.notesEditor.fill(note);
      await appAdminPage.generalTab.editAppGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's app notes were updated correctly", async () => {
      await expect(appAdminPage.generalTab.appNotes).toHaveText(note);
    });
  });

  test('Delete an app', async ({ adminHomePage, appsAdminPage, appAdminPage }) => {
    const appName = FakeDataFactory.createFakeAppName();
    const appRow = appsAdminPage.appGrid.getByRole('row', { name: appName }).first();
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

      await expect(appsAdminPage.deleteAppDialog.confirmationInput).toBeVisible();

      await appsAdminPage.deleteAppDialog.confirmationInput.pressSequentially('OK', {
        delay: 100,
      });

      await expect(appsAdminPage.deleteAppDialog.confirmationInput).toHaveValue('OK');
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
