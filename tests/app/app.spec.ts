import { Response } from '@playwright/test';
import { FakeDataFactory, Role } from '@stevanfreeborn/onspring-models';
import {
  AdminTileTargets,
  AppDetailTargets,
  AppsPageTargets,
  AppTasks,
  DeleteAppDialogTargets,
  EditAdminSettingsModalTargets,
  EditDisplaySettingsModalTargets,
  EditGeneralSettingsModalTargets,
  EditGeocodingSettingsModalTargets,
  GroupTasks,
  OptionTargets,
  RoleTasks,
  UserTasks,
} from '@stevanfreeborn/onspring-ui';
import { test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('app', () => {
  let appsToDelete: string[] = [];

  test.beforeEach(async ({ sysAdminActor }) => {
    await sysAdminActor.browse().goto('/Admin/Home');
  });

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(AppTasks.deleteApps(appsToDelete));
    appsToDelete = [];
  });

  test('Create an app via the create button on the header of on the admin home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-1',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.createViaHeader(appName));
    });

    await test.step('Verify the app was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(AppDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(appName);
    });
  });

  test('Create an app via the create button on the Apps tile on the admin home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-2',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.createViaTile(appName));
    });

    await test.step('Verify the app was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(AppDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(appName);
    });
  });

  test('Create an app via the Create App button on the Apps admin page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-3',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Navigate to the Apps admin page', async () => {
      await sysAdminActor.browse().click(AdminTileTargets.appTileLink);
    });

    await test.step('Create the app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
    });

    await test.step('Verify the app was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(AppDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(appName);
    });
  });

  test('Create a copy of an app via the create button on the header of the admin home page', async ({
    sysAdminActor,
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
      await sysAdminActor.attemptsTo(AppTasks.createViaHeader(appName));
    });

    await test.step('Navigate back to admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the copy of the app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.copyViaHeader(appName, expectedAppCopyName));
    });

    await test.step('Verify the app was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(AppDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(expectedAppCopyName);
    });
  });

  test('Create a copy of an app via the create button on the Apps tile on the admin home page', async ({
    sysAdminActor,
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
      await sysAdminActor.attemptsTo(AppTasks.createViaTile(appName));
    });

    await test.step('Navigate back to admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the copy of the app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.copyViaTile(appName, expectedAppCopyName));
    });

    await test.step('Verify the app was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(AppDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(expectedAppCopyName);
    });
  });

  test('Create a copy of an app via the Create App button on the Apps admin page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-6',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const expectedAppCopyName = `${appName} (1)`;
    appsToDelete.push(appName);
    appsToDelete.push(expectedAppCopyName);

    await test.step('Navigate to the Apps admin page', async () => {
      await sysAdminActor.browse().click(AdminTileTargets.appTileLink);
    });

    await test.step('Create the app to be copied', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
    });

    await test.step('Navigate back to apps admin page', async () => {
      await sysAdminActor.attemptsTo(AppTasks.goto());
    });

    await test.step('Create the copy of the app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.copyFromGrid(appName, expectedAppCopyName));
    });

    await test.step('Verify the app was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(AppDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(expectedAppCopyName);
    });
  });

  test("Update an app's name", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-7',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const updatedAppName = `${appName}-updated`;
    appsToDelete.push(updatedAppName);

    await test.step('Create the app whose name will be updated', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
    });

    await test.step("Update the app's name", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateName(updatedAppName));
    });

    await test.step("Verify app's name was updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(updatedAppName);
    });
  });

  test('Disable an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-8',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app to be disabled', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Enabled');
    });

    await test.step('Disable the app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.disable());
    });

    await test.step('Verify app was disabled correctly', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Disabled');
    });
  });

  test('Enable an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-9',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app to be enabled', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Enabled');
    });

    await test.step('Disable the app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.disable());
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Disabled');
    });

    await test.step('Enable the app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.enable());
    });

    await test.step('Verify app was enabled correctly', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Enabled');
    });
  });

  test("Update an app's description.", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-10',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const updatedDescription = 'This is an updated description';
    appsToDelete.push(appName);

    await test.step('Create the app whose description will be updated', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.description).hasText('');
    });

    await test.step("Update the app's description", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateDescription(updatedDescription));
    });

    await test.step("Verify app's description was updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.description).hasText(updatedDescription);
    });
  });

  test("Disable an app's content versioning", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-11',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be disabled', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText('Enabled - Direct User Saves');
    });

    await test.step("Disable the app's content versioning", async () => {
      await sysAdminActor.attemptsTo(AppTasks.toggleContentVersioning('disabled'));
    });

    await test.step("Verify app's content versioning was disabled correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.contentVersionStatus).hasText('Disabled');
    });
  });

  test("Enable an app's content versioning", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-12',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be enabled', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText('Enabled - Direct User Saves');
    });

    await test.step("Disable the app's content versioning", async () => {
      await sysAdminActor.attemptsTo(AppTasks.toggleContentVersioning('disabled'));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.contentVersionStatus).hasText('Disabled');
    });

    await test.step("Enable the app's content versioning", async () => {
      await sysAdminActor.attemptsTo(AppTasks.toggleContentVersioning('enabled'));
    });

    await test.step("Verify app's content versioning was enabled correctly", async () => {
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText('Enabled - Direct User Saves');
    });
  });

  test("Change the save types of an app's content versioning", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-13',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose content versioning will be changed', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText('Enabled - Direct User Saves');
    });

    await test.step("Change the app's content versioning", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await sysAdminActor
        .browse()
        .check(EditGeneralSettingsModalTargets.contentVersionStatusSwitch)
        .hasAttribute('aria-checked', 'true');
      await sysAdminActor.browse().check(EditGeneralSettingsModalTargets.contentVersionTypes).isVisible();
      await sysAdminActor.browse().check(EditGeneralSettingsModalTargets.directUserSavesCheckbox).isChecked();

      await sysAdminActor.browse().checkControl(EditGeneralSettingsModalTargets.indirectUserSavesCheckbox);
      await sysAdminActor.browse().checkControl(EditGeneralSettingsModalTargets.apiSavesCheckbox);
      await sysAdminActor.browse().checkControl(EditGeneralSettingsModalTargets.systemSavesCheckbox);

      await sysAdminActor.browse().check(EditGeneralSettingsModalTargets.indirectUserSavesCheckbox).isChecked();
      await sysAdminActor.browse().check(EditGeneralSettingsModalTargets.apiSavesCheckbox).isChecked();
      await sysAdminActor.browse().check(EditGeneralSettingsModalTargets.systemSavesCheckbox).isChecked();

      await sysAdminActor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    });

    await test.step("Verify app's content versioning was changed correctly", async () => {
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText('Enabled - Direct User Saves, Indirect User Saves, API Saves, System Saves');
    });
  });

  test("Disable an app's concurrent edit alert", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-14',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose concurrent edit alert will be disabled', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.concurrentEditAlertStatus).hasText('Enabled');
    });

    await test.step("Disable the app's concurrent edit alert", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateConcurrentEditAlert(false));
    });

    await test.step("Verify app's concurrent edit alert was disabled correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.concurrentEditAlertStatus).hasText('Disabled');
    });
  });

  test("Enable an app's concurrent edit alert", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-15',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose concurrent edit alert will be enabled', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.concurrentEditAlertStatus).hasText('Enabled');
    });

    await test.step("Disable the app's concurrent edit alert", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateConcurrentEditAlert(false));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.concurrentEditAlertStatus).hasText('Disabled');
    });

    await test.step("Enable the app's concurrent edit alert", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateConcurrentEditAlert(true));
    });

    await test.step("Verify app's concurrent edit alert was enabled correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.concurrentEditAlertStatus).hasText('Enabled');
    });
  });

  test("Update an app's display link field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-16',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose display link field will be updated', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.displayLink).hasText('Record Id');
    });

    await test.step("Update the app's display link field", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateDisplayLinkField('Created Date'));
    });

    await test.step("Verify app's display link field was updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.displayLink).hasText('Created Date');
    });
  });

  test("Update an app's integration link field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-17',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose integration link field will be updated', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.integrationLink).hasText('Record Id');
    });

    await test.step("Update the app's integration link field", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateIntegrationLinkField('Created Date'));
    });

    await test.step("Verify app's integration link field was updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.integrationLink).hasText('Created Date');
    });
  });

  test("Update an app's display fields", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-18',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose display fields will be updated', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.displayFields).hasText('Record Id');
    });

    await test.step("Update the app's display fields", async () => {
      await sysAdminActor.attemptsTo(AppTasks.addDisplayField('Created Date'));
    });

    await test.step("Verify app's display fields were updated correctly", async () => {
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.displayFields)
        .hasText(/Record Id/);
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.displayFields)
        .hasText(/Created Date/);
    });
  });

  test("Update an app's primary sort field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-19',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose primary sort field will be updated', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.sort).hasText('None');
    });

    await test.step("Update the app's primary sort field", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
      await sysAdminActor.browse().click(EditDisplaySettingsModalTargets.primarySortSelect);
      await sysAdminActor.browse().click(OptionTargets.byName('Record Id'));

      await sysAdminActor.browse().check(EditDisplaySettingsModalTargets.primarySortDirectionSelect).isVisible();
      await sysAdminActor
        .browse()
        .check(EditDisplaySettingsModalTargets.primarySortDirectionSelect)
        .hasText('Ascending');

      await sysAdminActor.browse().click(EditDisplaySettingsModalTargets.saveButton);
    });

    await test.step("Verify app's primary sort field was updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.sort).hasText('Record Id (Ascending)');
    });
  });

  test("Update an app's secondary sort field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-20',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose secondary sort field will be updated', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.sort).hasText('None');
    });

    await test.step("Update the app's secondary sort field", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
      await sysAdminActor.browse().click(EditDisplaySettingsModalTargets.displayFieldsSelect);
      await sysAdminActor.browse().click(EditDisplaySettingsModalTargets.unselectedDisplayOption('Created Date'));
      await sysAdminActor.browse().click(EditDisplaySettingsModalTargets.selectorCloseButton);

      await sysAdminActor.browse().click(EditDisplaySettingsModalTargets.primarySortSelect);
      await sysAdminActor.browse().click(OptionTargets.byName('Record Id'));

      await sysAdminActor.browse().click(EditDisplaySettingsModalTargets.secondarySortSelect);
      await sysAdminActor.browse().click(OptionTargets.byName('Created Date'));

      await sysAdminActor.browse().check(EditDisplaySettingsModalTargets.secondarySortDirectionSelect).isVisible();
      await sysAdminActor
        .browse()
        .check(EditDisplaySettingsModalTargets.secondarySortDirectionSelect)
        .hasText('Ascending');

      await sysAdminActor.browse().click(EditDisplaySettingsModalTargets.saveButton);
    });

    await test.step("Verify app's secondary sort field was updated correctly", async () => {
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.sort)
        .hasText(/Record Id \(Ascending\)/);
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.sort)
        .hasText(/Created Date \(Ascending\)/);
    });
  });

  test("Change an app's administration permissions to private", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-21',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Public');
    });

    await test.step("Change the app's administration permissions to private", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editAdminSettingsLink);
      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.adminPermissionsSelect);
      await sysAdminActor.browse().click(OptionTargets.byName('Private'));

      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.usersSelector).isVisible();
      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.groupsSelector).isVisible();
      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.rolesSelector).isVisible();

      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.saveButton);
      await sysAdminActor.browse().waitForState(EditAdminSettingsModalTargets.modal, 'hidden');
    });

    await test.step("Verify app's administration permissions were set to private", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Private');
    });
  });

  test('Give app administration permissions to specific users', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-22',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const newUser = FakeDataFactory.createFakeUser('Inactive');
    appsToDelete.push(appName);
    const usersToDelete = [newUser.username];

    await test.step('Create user that will be given admin permissions', async () => {
      await sysAdminActor.attemptsTo(UserTasks.create(newUser));
    });

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
    });

    await test.step('Give app admin permissions to user', async () => {
      await sysAdminActor.attemptsTo(AppTasks.setAdminPermissions('Private', { user: newUser.fullName }));
    });

    await test.step('Verify app admin permissions were given to user', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Private');
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminUsers).hasText(newUser.fullName);
    });

    await test.step('Delete user', async () => {
      await sysAdminActor.attemptsTo(UserTasks.deleteUsers(usersToDelete));
    });
  });

  test('Give app administration permissions to specific roles', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-23',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const roleName = FakeDataFactory.createFakeRoleName();
    appsToDelete.push(appName);
    const rolesToDelete = [roleName];

    await test.step('Create role that will be given admin permissions', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.create(new Role({ name: roleName })));
    });

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
    });

    await test.step('Give app admin permissions to role', async () => {
      await sysAdminActor.attemptsTo(AppTasks.setAdminPermissions('Private', { role: roleName }));
    });

    await test.step('Verify app admin permissions were given to role', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Private');
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminRoles).hasText(roleName);
    });

    await test.step('Delete role', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.deleteRoles(rolesToDelete));
    });
  });

  test('Give app administration permissions to specific groups', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-24',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const groupName = FakeDataFactory.createFakeGroupName();
    appsToDelete.push(appName);
    const groupsToDelete = [groupName];

    await test.step('Create group that will be given admin permissions', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.create(groupName));
    });

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
    });

    await test.step('Give app admin permissions to group', async () => {
      await sysAdminActor.attemptsTo(AppTasks.setAdminPermissions('Private', { group: groupName }));
    });

    await test.step('Verify app admin permissions were given to group', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Private');
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminGroups).hasText(groupName);
    });

    await test.step('Delete group', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.deleteGroups(groupsToDelete));
    });
  });

  test("Change an app's administration permissions to public", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-25',
    });

    const appName = FakeDataFactory.createFakeAppName();
    appsToDelete.push(appName);

    await test.step('Create the app whose administration permissions will be changed', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Public');
    });

    await test.step("Change the app's administration permissions to private", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editAdminSettingsLink);
      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.adminPermissionsSelect);
      await sysAdminActor.browse().click(OptionTargets.byName('Private'));
      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.saveButton);
      await sysAdminActor.browse().waitForState(EditAdminSettingsModalTargets.modal, 'hidden');
    });

    await test.step("Change the app's administration permissions to public", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editAdminSettingsLink);
      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.adminPermissionsSelect);
      await sysAdminActor.browse().click(OptionTargets.byName('Public'));

      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.usersSelector).isHidden();
      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.groupsSelector).isHidden();
      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.rolesSelector).isHidden();

      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.saveButton);
      await sysAdminActor.browse().waitForState(EditAdminSettingsModalTargets.modal, 'hidden');
    });

    await test.step("Verify app's administration permissions were set to public", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Public');
    });
  });

  test('Enable geocoding for an app', async ({ sysAdminActor }) => {
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
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingStatus).hasText('Disabled');
    });

    await test.step('Create fields for geocoding mapping', async () => {
      for (const name of fieldNames) {
        await sysAdminActor.attemptsTo(AppTasks.addTextField(name));
      }
    });

    await test.step('Enable geocoding for app', async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTabButton);
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editGeocodingSettingsLink);
      await sysAdminActor.browse().click(EditGeocodingSettingsModalTargets.statusToggle);

      await sysAdminActor.browse().check(EditGeocodingSettingsModalTargets.geocodingDataGrid).isVisible();

      await sysAdminActor.browse().click(EditGeocodingSettingsModalTargets.addressSelect);
      await sysAdminActor.browse().click(OptionTargets.byName(addressFieldName));

      await sysAdminActor.browse().click(EditGeocodingSettingsModalTargets.citySelect);
      await sysAdminActor.browse().click(OptionTargets.byName(cityFieldName));

      await sysAdminActor.browse().click(EditGeocodingSettingsModalTargets.stateSelect);
      await sysAdminActor.browse().click(OptionTargets.byName(stateFieldName));

      await sysAdminActor.browse().click(EditGeocodingSettingsModalTargets.zipSelect);
      await sysAdminActor.browse().click(OptionTargets.byName(zipFieldName));

      await sysAdminActor.browse().click(EditGeocodingSettingsModalTargets.saveButton);
    });

    await test.step('Verify geocoding was enabled correctly', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingStatus).hasText('Enabled');
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingGrid).isVisible();
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingAddress).hasText(addressFieldName);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingCity).hasText(cityFieldName);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingState).hasText(stateFieldName);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingZip).hasText(zipFieldName);
    });
  });

  test("Update an app's geocoding field mapping", async ({ sysAdminActor }) => {
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
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingStatus).hasText('Disabled');
    });

    await test.step('Enable geocoding for app', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.enableGeocoding({
          address: addressFieldName,
          city: cityFieldName,
          state: stateFieldName,
          zip: zipFieldName,
        })
      );
    });

    await test.step('Create field to update geocoding mapping', async () => {
      await sysAdminActor.attemptsTo(AppTasks.addTextField(secondAddressFieldName));
    });

    await test.step('Update geocoding field mapping', async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTabButton);
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editGeocodingSettingsLink);
      await sysAdminActor.browse().click(EditGeocodingSettingsModalTargets.addressSelect);
      await sysAdminActor.browse().click(OptionTargets.byName(secondAddressFieldName));
      await sysAdminActor.browse().click(EditGeocodingSettingsModalTargets.saveButton);
    });

    await test.step('Verify geocoding was updated correctly', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingStatus).hasText('Enabled');
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingGrid).isVisible();
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingAddress).hasText(secondAddressFieldName);
    });
  });

  test('Disable geocoding for an app', async ({ sysAdminActor }) => {
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
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingStatus).hasText('Disabled');
    });

    await test.step('Enable geocoding for app', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.enableGeocoding({
          address: addressFieldName,
          city: cityFieldName,
          state: stateFieldName,
          zip: zipFieldName,
        })
      );
    });

    await test.step('Disable geocoding for app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.disableGeocoding());
    });

    await test.step('Verify geocoding was disabled correctly', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingStatus).hasText('Disabled');
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingGrid).isHidden();
    });
  });

  test("Update an app's app notes", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-29',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const note = 'This is a note';
    appsToDelete.push(appName);

    await test.step('Create the app whose app notes will be updated', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.notes).hasText('');
    });

    await test.step("Update the app's app notes", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateNotes(note));
    });

    await test.step("Verify app's app notes were updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.notes).hasText(note);
    });
  });

  test('Delete an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-782',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const appRow = AppsPageTargets.rowByName(appName);
    const deleteButton = AppsPageTargets.deleteButtonInRow(appName);

    await test.step('Navigate to the Apps admin page', async () => {
      await sysAdminActor.browse().click(AdminTileTargets.appTileLink);
    });

    await test.step('Create the app to be deleted', async () => {
      await sysAdminActor.attemptsTo(AppTasks.create(appName));
      await sysAdminActor.browse().click(AppDetailTargets.closeButton);
    });

    await test.step('Navigate to apps admin page', async () => {
      await sysAdminActor.attemptsTo(AppTasks.goto(), AppTasks.filterBy(appName));
      await sysAdminActor.browse().check(appRow).isVisible();
    });

    await test.step('Delete the app', async () => {
      await sysAdminActor.browse().hover(appRow);
      await sysAdminActor.browse().click(deleteButton);

      await sysAdminActor.browse().check(DeleteAppDialogTargets.confirmationInput).isVisible();
      await sysAdminActor.browse().type(DeleteAppDialogTargets.confirmationInput, 'OK');
      await sysAdminActor.browse().check(DeleteAppDialogTargets.confirmationInput).hasValue('OK');
      await sysAdminActor.browse().check(DeleteAppDialogTargets.deleteButton).isEnabled();

      const deleteResponse = sysAdminActor
        .browse()
        .waitForResponse((r: Response) => r.url().includes('/Delete') && r.status() === 200);
      await sysAdminActor.browse().click(DeleteAppDialogTargets.deleteButton);
      await deleteResponse;
      await sysAdminActor.browse().waitForDetached(DeleteAppDialogTargets.dialog);
    });

    await test.step('Verify app was deleted correctly', async () => {
      await sysAdminActor.browse().check(appRow).isNotAttached();
    });
  });
});
