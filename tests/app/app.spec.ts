import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { UserFactory } from '../../factories/userFactory';
import { test as base, expect } from '../../fixtures';
import { Role } from '../../models/role';
import { TextField } from '../../models/textField';
import { UserStatus } from '../../models/user';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AppsAdminPage } from '../../pageObjectModels/apps/appsAdminPage';
import { AddGroupAdminPage } from '../../pageObjectModels/groups/addGroupAdminPage';
import { EditGroupAdminPage } from '../../pageObjectModels/groups/editGroupAdminPage';
import { GroupsSecurityAdminPage } from '../../pageObjectModels/groups/groupsSecurityAdminPage';
import { AddRoleAdminPage } from '../../pageObjectModels/roles/addRoleAdminPage';
import { EditRoleAdminPage } from '../../pageObjectModels/roles/editRoleAdminPage';
import { RolesSecurityAdminPage } from '../../pageObjectModels/roles/rolesSecurityAdminPage';
import { AddUserAdminPage } from '../../pageObjectModels/users/addUserAdminPage';
import { EditUserAdminPage } from '../../pageObjectModels/users/editUserAdminPage';
import { UsersSecurityAdminPage } from '../../pageObjectModels/users/usersSecurityAdminPage';
import { AnnotationType } from '../annotations';

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
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-1',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app', async () => {
      await adminHomePage.createAppUsingHeaderCreateButton(appName);
    });

    await test.step('Verify the app was created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.generalTab.name).toHaveText(appName);
    });
  });

  test('Create an app via the create button on the Apps tile on the admin home page', async ({
    adminHomePage,
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-2',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app', async () => {
      await adminHomePage.createAppUsingAppTileButton(appName);
    });

    await test.step('Verify the app was created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.generalTab.name).toHaveText(appName);
    });
  });

  test('Create an app via the Create App button on the Apps admin page', async ({
    adminHomePage,
    appsAdminPage,
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-3',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Navigate to the Apps admin page', async () => {
      await adminHomePage.appTileLink.click();
    });

    await test.step('Create the app', async () => {
      await appsAdminPage.createApp(appName);
    });

    await test.step('Verify the app was created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.generalTab.name).toHaveText(appName);
    });
  });

  test('Create a copy of an app via the create button on the header of the admin home page', async ({
    adminHomePage,
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-4',
    });

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
      await adminHomePage.createAppDialog.copyFromDropdown.click();
      await adminHomePage.createAppDialog.getAppToCopy(appName).click();
      await adminHomePage.createAppDialog.continueButton.click();

      await expect(adminHomePage.createAppModal.nameInput).toBeVisible();
      await expect(adminHomePage.createAppModal.nameInput).toHaveValue(expectedAppCopyName);

      await adminHomePage.createAppModal.saveButton.click();
    });

    await test.step('Verify the app was created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.generalTab.name).toHaveText(expectedAppCopyName);
    });
  });

  test('Create a copy of an app via the create button on the Apps tile on the admin home page', async ({
    adminHomePage,
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-808',
    });

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
      await adminHomePage.createAppDialog.copyFromDropdown.click();
      await adminHomePage.createAppDialog.getAppToCopy(appName).click();
      await adminHomePage.createAppDialog.continueButton.click();

      await expect(adminHomePage.createAppModal.nameInput).toBeVisible();

      await expect(adminHomePage.createAppModal.nameInput).toHaveValue(expectedAppCopyName);

      await adminHomePage.createAppModal.saveButton.click();
    });

    await test.step('Verify the app was created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.generalTab.name).toHaveText(expectedAppCopyName);
    });
  });

  test('Create a copy of an app via the Create App button on the Apps admin page', async ({
    adminHomePage,
    appsAdminPage,
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-6',
    });

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
      await appAdminPage.sidebar.adminGearIcon.click();
    });

    await test.step('Navigate back to apps admin page', async () => {
      await adminHomePage.page.waitForLoadState();
      await adminHomePage.appTileLink.click();
    });

    await test.step('Create the copy of the app', async () => {
      await appsAdminPage.page.waitForLoadState();
      await appsAdminPage.createAppButton.click();

      await expect(appsAdminPage.createAppDialog.copyFromRadioButton).toBeVisible();

      await appsAdminPage.createAppDialog.copyFromRadioButton.click();
      await appsAdminPage.createAppDialog.copyFromDropdown.click();
      await appsAdminPage.createAppDialog.getAppToCopy(appName).click();
      await appsAdminPage.createAppDialog.continueButton.click();

      await expect(adminHomePage.createAppModal.nameInput).toBeVisible();
      await expect(appsAdminPage.createAppModal.nameInput).toHaveValue(expectedAppCopyName);

      await appsAdminPage.createAppModal.saveButton.click();
    });

    await test.step('Verify the app was created correctly', async () => {
      await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
      await expect(appAdminPage.generalTab.name).toHaveText(expectedAppCopyName);
    });
  });

  test("Update an app's name", async ({ appAdminPage, adminHomePage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-7',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const updatedAppName = `${appName}-updated`;
    appsToDelete.push(updatedAppName);

    await test.step('Create the app whose name will be updated', async () => {
      await adminHomePage.createApp(appName);
    });

    await test.step("Update the app's name", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.nameInput).toHaveValue(appName);

      await appAdminPage.generalTab.editGeneralSettingsModal.nameInput.fill(updatedAppName);
      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's name was updated correctly", async () => {
      await expect(appAdminPage.generalTab.name).toHaveText(updatedAppName);
    });
  });

  test('Disable an app', async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-8',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app to be disabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.status).toHaveText('Enabled');
    });

    await test.step('Disable the app', async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await appAdminPage.generalTab.editGeneralSettingsModal.statusToggle.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify app was disabled correctly', async () => {
      await expect(appAdminPage.generalTab.status).toHaveText('Disabled');
    });
  });

  test('Enable an app', async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-9',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app to be enabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.status).toHaveText('Enabled');
    });

    await test.step('Disable the app', async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await appAdminPage.generalTab.editGeneralSettingsModal.statusToggle.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();

      await expect(appAdminPage.generalTab.status).toHaveText('Disabled');
    });

    await test.step('Enable the app', async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await appAdminPage.generalTab.editGeneralSettingsModal.statusToggle.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify app was enabled correctly', async () => {
      await expect(appAdminPage.generalTab.status).toHaveText('Enabled');
    });
  });

  test("Update an app's description.", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-10',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const updatedDescription = 'This is an updated description';
    appsToDelete.push(appName);

    await test.step('Create the app whose description will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.description).toHaveText('');
    });

    await test.step("Update the app's description", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.descriptionEditor).toHaveText('');

      await appAdminPage.generalTab.editGeneralSettingsModal.descriptionEditor.fill(updatedDescription);
      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's description was updated correctly", async () => {
      await expect(appAdminPage.generalTab.description).toHaveText(updatedDescription);
    });
  });

  test("Disable an app's content versioning", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-11',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be disabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.contentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });

    await test.step("Disable the app's content versioning", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await appAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusToggle.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.contentVersionTypes).toBeHidden();

      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's content versioning was disabled correctly", async () => {
      await expect(appAdminPage.generalTab.contentVersionStatus).toHaveText('Disabled');
    });
  });

  test("Enable an app's content versioning", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-12',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be enabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.contentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });

    await test.step("Disable the app's content versioning", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();
      await appAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusToggle.click();
      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
      await expect(appAdminPage.generalTab.contentVersionStatus).toHaveText('Disabled');
    });

    await test.step("Enable the app's content versioning", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.contentVersionTypes).toBeHidden();

      await appAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusToggle.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's content versioning was enabled correctly", async () => {
      await expect(appAdminPage.generalTab.contentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });
  });

  test("Change the save types of an app's content versioning", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-13',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be changed', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.contentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });

    await test.step("Change the app's content versioning", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.directUserSavesCheckbox).toBeChecked();

      await appAdminPage.generalTab.editGeneralSettingsModal.indirectUserSavesCheckbox.check();
      await appAdminPage.generalTab.editGeneralSettingsModal.apiSavesCheckbox.check();
      await appAdminPage.generalTab.editGeneralSettingsModal.systemSavesCheckbox.check();

      await expect(appAdminPage.generalTab.editGeneralSettingsModal.indirectUserSavesCheckbox).toBeChecked();
      await expect(appAdminPage.generalTab.editGeneralSettingsModal.apiSavesCheckbox).toBeChecked();
      await expect(appAdminPage.generalTab.editGeneralSettingsModal.systemSavesCheckbox).toBeChecked();

      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's content versioning was changed correctly", async () => {
      await expect(appAdminPage.generalTab.contentVersionStatus).toHaveText(
        'Enabled - Direct User Saves, Indirect User Saves, API Saves, System Saves'
      );
    });
  });

  test("Disable an app's concurrent edit alert", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-14',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose concurrent edit alert will be disabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Enabled');
    });

    await test.step("Disable the app's concurrent edit alert", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();
      await appAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertStatusSwitch.toggle(false);
      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's concurrent edit alert was disabled correctly", async () => {
      await expect(appAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Disabled');
    });
  });

  test("Enable an app's concurrent edit alert", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-15',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose concurrent edit alert will be enabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Enabled');
    });

    await test.step("Disable the app's concurrent edit alert", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();
      await appAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertStatusSwitch.toggle(false);
      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
      await expect(appAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Disabled');
    });

    await test.step("Enable the app's concurrent edit alert", async () => {
      await appAdminPage.generalTab.editGeneralSettingsLink.click();
      await appAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertStatusSwitch.toggle(true);
      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's concurrent edit alert was enabled correctly", async () => {
      await expect(appAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Enabled');
    });
  });

  test("Update an app's display link field", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-16',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose display link field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.displayLink).toHaveText('Record Id');
    });

    await test.step("Update the app's display link field", async () => {
      await appAdminPage.generalTab.editDisplaySettingsLink.click();
      await appAdminPage.generalTab.editDisplaySettingsModal.displayLinkSelect.click();
      await appAdminPage.page.getByRole('option', { name: 'Created Date' }).click();
      await appAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's display link field was updated correctly", async () => {
      await expect(appAdminPage.generalTab.displayLink).toHaveText('Created Date');
    });
  });

  test("Update an app's integration link field", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-17',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose integration link field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.integrationLink).toHaveText('Record Id');
    });

    await test.step("Update the app's integration link field", async () => {
      await appAdminPage.generalTab.editDisplaySettingsLink.click();
      await appAdminPage.generalTab.editDisplaySettingsModal.integrationLinkSelect.click();
      await appAdminPage.page.getByRole('option', { name: 'Created Date' }).click();
      await appAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's integration link field was updated correctly", async () => {
      await expect(appAdminPage.generalTab.integrationLink).toHaveText('Created Date');
    });
  });

  test("Update an app's display fields", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-18',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose display fields will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.displayFields).toHaveText('Record Id');
    });

    await test.step("Update the app's display fields", async () => {
      await appAdminPage.generalTab.editDisplaySettingsLink.click();
      await appAdminPage.generalTab.editDisplaySettingsModal.addDisplayField('Created Date');
      await appAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's display fields were updated correctly", async () => {
      await expect(appAdminPage.generalTab.displayFields).toHaveText(/Record Id/);
      await expect(appAdminPage.generalTab.displayFields).toHaveText(/Created Date/);
    });
  });

  test("Update an app's primary sort field", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-19',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose primary sort field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.sort).toHaveText('None');
    });

    await test.step("Update the app's primary sort field", async () => {
      await appAdminPage.generalTab.editDisplaySettingsLink.click();
      await appAdminPage.generalTab.editDisplaySettingsModal.selectPrimarySortField('Record Id');

      await expect(appAdminPage.generalTab.editDisplaySettingsModal.primarySortDirectionSelect).toBeVisible();
      await expect(appAdminPage.generalTab.editDisplaySettingsModal.primarySortDirectionSelect).toHaveText('Ascending');

      await appAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's primary sort field was updated correctly", async () => {
      await expect(appAdminPage.generalTab.sort).toHaveText('Record Id (Ascending)');
    });
  });

  test("Update an app's secondary sort field", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-20',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose secondary sort field will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.sort).toHaveText('None');
    });

    await test.step("Update the app's secondary sort field", async () => {
      await appAdminPage.generalTab.editDisplaySettingsLink.click();
      await appAdminPage.generalTab.editDisplaySettingsModal.addDisplayField('Created Date');
      await appAdminPage.generalTab.editDisplaySettingsModal.selectPrimarySortField('Record Id');

      await appAdminPage.generalTab.editDisplaySettingsModal.selectSecondarySortField('Created Date');

      await expect(appAdminPage.generalTab.editDisplaySettingsModal.secondarySortDirectionSelect).toBeVisible();
      await expect(appAdminPage.generalTab.editDisplaySettingsModal.secondarySortDirectionSelect).toHaveText(
        'Ascending'
      );

      await appAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify app's secondary sort field was updated correctly", async () => {
      await expect(appAdminPage.generalTab.sort).toHaveText(/Record Id \(Ascending\)/);
      await expect(appAdminPage.generalTab.sort).toHaveText(/Created Date \(Ascending\)/);
    });
  });

  test("Change an app's administration permissions to private", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-21',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.adminPermissions).toHaveText('Public');
    });

    await test.step("Change the app's administration permissions to private", async () => {
      await appAdminPage.generalTab.editAdminSettingsLink.click();
      await appAdminPage.generalTab.editAdminSettingsModal.selectAdminPermissions('Private');

      await expect(appAdminPage.generalTab.editAdminSettingsModal.usersDualPaneSelector.locator()).toBeVisible();
      await expect(appAdminPage.generalTab.editAdminSettingsModal.groupsDualPaneSelector.locator()).toBeVisible();
      await expect(appAdminPage.generalTab.editAdminSettingsModal.rolesDualPaneSelector.locator()).toBeVisible();

      await appAdminPage.generalTab.editAdminSettingsModal.save();
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
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-22',
    });

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
      await appAdminPage.generalTab.editAdminSettingsModal.selectAdminPermissions('Private');
      await appAdminPage.generalTab.editAdminSettingsModal.selectUser(newUser.fullName);
      await appAdminPage.generalTab.editAdminSettingsModal.save();
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
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-23',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const roleName = FakeDataFactory.createFakeRoleName();
    appsToDelete.push(appName);
    const rolesToDelete = [roleName];

    await test.step('Create role that will be given admin permissions', async () => {
      const addRoleAdminPage = new AddRoleAdminPage(sysAdminPage);
      const editRoleAdminPage = new EditRoleAdminPage(sysAdminPage);
      await addRoleAdminPage.addRole(new Role({ name: roleName }));
      await addRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
    });

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await adminHomePage.createApp(appName);
    });

    await test.step('Give app admin permissions to role', async () => {
      await appAdminPage.generalTab.editAdminSettingsLink.click();
      await appAdminPage.generalTab.editAdminSettingsModal.selectAdminPermissions('Private');

      await expect(appAdminPage.generalTab.editAdminSettingsModal.rolesDualPaneSelector.locator()).toBeVisible();

      await appAdminPage.generalTab.editAdminSettingsModal.selectRole(roleName);
      await appAdminPage.generalTab.editAdminSettingsModal.save();
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
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-24',
    });

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
      await appAdminPage.generalTab.editAdminSettingsModal.selectAdminPermissions('Private');

      await expect(appAdminPage.generalTab.editAdminSettingsModal.groupsDualPaneSelector.locator()).toBeVisible();

      await appAdminPage.generalTab.editAdminSettingsModal.selectGroup(groupName);
      await appAdminPage.generalTab.editAdminSettingsModal.save();
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
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-25',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.adminPermissions).toHaveText('Public');
    });

    await test.step("Change the app's administration permissions to private", async () => {
      await appAdminPage.generalTab.editAdminSettingsLink.click();
      await appAdminPage.generalTab.editAdminSettingsModal.selectAdminPermissions('Private');
      await appAdminPage.generalTab.editAdminSettingsModal.save();
    });

    await test.step("Change the app's administration permissions to public", async () => {
      await appAdminPage.generalTab.editAdminSettingsLink.click();
      await appAdminPage.generalTab.editAdminSettingsModal.selectAdminPermissions('Public');

      await expect(appAdminPage.generalTab.editAdminSettingsModal.usersDualPaneSelector.locator()).toBeHidden();
      await expect(appAdminPage.generalTab.editAdminSettingsModal.groupsDualPaneSelector.locator()).toBeHidden();
      await expect(appAdminPage.generalTab.editAdminSettingsModal.rolesDualPaneSelector.locator()).toBeHidden();

      await appAdminPage.generalTab.editAdminSettingsModal.save();
    });

    await test.step("Verify app's administration permissions were set to public", async () => {
      await expect(appAdminPage.generalTab.adminPermissions).toHaveText('Public');
    });
  });

  test('Enable geocoding for an app', async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-26',
    });

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

      for (const name of fieldNames) {
        await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(new TextField({ name: name }));
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

  test("Update an app's geocoding field mapping", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-27',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    const addressFieldName = FakeDataFactory.createFakeFieldName('address');
    const cityFieldName = FakeDataFactory.createFakeFieldName('city');
    const stateFieldName = FakeDataFactory.createFakeFieldName('state');
    const zipFieldName = FakeDataFactory.createFakeFieldName('zip');
    const secondAddressFieldName = FakeDataFactory.createFakeFieldName('address-2');

    await test.step('Create app whose geocode mapping will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.geocodingStatus).toHaveText('Disabled');
    });

    await test.step('Enable geocoding for app', async () => {
      await appAdminPage.enableGeocoding({
        address: new TextField({ name: addressFieldName }),
        city: new TextField({ name: cityFieldName }),
        state: new TextField({ name: stateFieldName }),
        zip: new TextField({ name: zipFieldName }),
      });
    });

    await test.step('Create field to update geocoding mapping', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(
        new TextField({ name: secondAddressFieldName })
      );
    });

    await test.step('Update geocoding field mapping', async () => {
      await appAdminPage.generalTabButton.click();
      await appAdminPage.generalTab.editGeocodingSettingsLink.click();
      await appAdminPage.generalTab.editGeocodingSettingsModal.selectAddressField(secondAddressFieldName);
      await appAdminPage.generalTab.editGeocodingSettingsModal.saveButton.click();
    });

    await test.step('Verify geocoding was updated correctly', async () => {
      await expect(appAdminPage.generalTab.geocodingStatus).toHaveText('Enabled');
      await expect(appAdminPage.generalTab.geocodingData.grid).toBeVisible();
      await expect(appAdminPage.generalTab.geocodingData.address).toHaveText(secondAddressFieldName);
    });
  });

  test('Disable geocoding for an app', async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-28',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);
    const addressFieldName = FakeDataFactory.createFakeFieldName('address');
    const cityFieldName = FakeDataFactory.createFakeFieldName('city');
    const stateFieldName = FakeDataFactory.createFakeFieldName('state');
    const zipFieldName = FakeDataFactory.createFakeFieldName('zip');

    await test.step('Create app whose geocoding will be disabled', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.geocodingStatus).toHaveText('Disabled');
    });

    await test.step('Enable geocoding for app', async () => {
      await appAdminPage.enableGeocoding({
        address: new TextField({ name: addressFieldName }),
        city: new TextField({ name: cityFieldName }),
        state: new TextField({ name: stateFieldName }),
        zip: new TextField({ name: zipFieldName }),
      });
    });

    await test.step('Disable geocoding for app', async () => {
      await appAdminPage.generalTab.editGeocodingSettingsLink.click();
      await appAdminPage.generalTab.editGeocodingSettingsModal.statusToggle.click();
      await appAdminPage.generalTab.editGeocodingSettingsModal.saveButton.click();
    });

    await test.step('Verify geocoding was disabled correctly', async () => {
      await expect(appAdminPage.generalTab.geocodingStatus).toHaveText('Disabled');
      await expect(appAdminPage.generalTab.geocodingData.grid).toBeHidden();
    });
  });

  test("Update an app's app notes", async ({ adminHomePage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-29',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const note = 'This is a note';
    appsToDelete.push(appName);

    await test.step('Create the app whose app notes will be updated', async () => {
      await adminHomePage.createApp(appName);
      await expect(appAdminPage.generalTab.notes).toHaveText('');
    });

    await test.step("Update the app's app notes", async () => {
      await appAdminPage.generalTab.editNotesSettingLink.click();

      await expect(appAdminPage.generalTab.editNotesSettingsModal.notesEditor).toHaveText('');

      await appAdminPage.generalTab.editNotesSettingsModal.notesEditor.fill(note);
      await appAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's app notes were updated correctly", async () => {
      await expect(appAdminPage.generalTab.notes).toHaveText(note);
    });
  });

  test('Delete an app', async ({ adminHomePage, appsAdminPage, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-782',
    });

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

      const deleteResponse = appsAdminPage.page.waitForResponse(appsAdminPage.deleteAppPathRegex);
      await appsAdminPage.deleteAppDialog.deleteButton.click();
      await deleteResponse;
      await appsAdminPage.deleteAppDialog.waitForDialogToBeDismissed();
    });

    await test.step('Verify app was deleted correctly', async () => {
      await expect(appRow).not.toBeAttached();
    });
  });
});
