import { Response } from '@playwright/test';
import { FakeDataFactory, Role } from '@stevanfreeborn/onspring-models';
import {
  AdminNavTargets,
  AppDetailTargets,
  AppTasks,
  DeleteDialogTargets,
  EditAdminSettingsModalTargets,
  EditDisplaySettingsModalTargets,
  EditGeneralSettingsModalTargets,
  EditGeocodingSettingsModalTargets,
  EditNotesSettingsModalTargets,
  GroupTasks,
  OptionTargets,
  RoleTasks,
  SurveyDetailTargets,
  SurveysPageTargets,
  SurveyTasks,
  UserTasks,
} from '@stevanfreeborn/onspring-ui';
import { test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('survey supporting data app', () => {
  test.beforeEach(async ({ sysAdminActor }) => {
    await sysAdminActor.browse().goto(AdminNavTargets.homeRoute);
  });

  // TODO: Not handling cleanup here because when
  // deleting surveys an exception sometimes
  // occurs when another user simultaneously
  // loads the surveys admin page.
  // reference: https://corp.onspring.com/Content/8/4162

  test('Create a survey via the create button on the header of on the admin home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-858',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.createViaHeader(surveyName));
    });

    await test.step('Verify the survey was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(SurveyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(surveyName);
    });
  });

  test('Create a survey via the create button on the Surveys tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-859',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.createViaTile(surveyName));
    });

    await test.step('Verify the survey was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(SurveyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(surveyName);
    });
  });

  test('Create a survey via the Create Survey button on the Surveys admin page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-860',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Navigate to the surveys admin page', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openFromTile());
    });

    await test.step('Create the survey', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.createFromSurveysPage(surveyName));
    });

    await test.step('Verify the survey was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(SurveyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(surveyName);
    });
  });

  test('Create a copy of a survey via the create button on the header of the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-861',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const expectedSurveyCopyName = `${surveyName} (1)`;

    await test.step('Create the survey to be copied', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.createViaHeader(surveyName));
    });

    await test.step('Navigate back to admin home page', async () => {
      await sysAdminActor.browse().goto(AdminNavTargets.homeRoute);
    });

    await test.step('Create the copy of the survey', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.copyViaHeader(surveyName, expectedSurveyCopyName));
    });

    await test.step('Verify the survey was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(SurveyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(expectedSurveyCopyName);
    });
  });

  test('Create a copy of a survey via the Create Survey button on the Surveys admin page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-862',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const expectedSurveyCopyName = `${surveyName} (1)`;

    await test.step('Navigate to the surveys admin page', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openFromTile());
    });

    await test.step('Create the survey to be copied', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.createFromSurveysPage(surveyName));
    });

    await test.step('Navigate back to surveys admin page', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.goto());
    });

    await test.step('Create the copy of the survey', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.copyFromSurveysPage(surveyName, expectedSurveyCopyName));
    });

    await test.step('Verify the survey was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(SurveyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(expectedSurveyCopyName);
    });
  });

  test('Create a copy of a survey via the create button on the Surveys tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-863',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const expectedSurveyCopyName = `${surveyName} (1)`;

    await test.step('Create the survey to be copied', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.createViaTile(surveyName));
    });

    await test.step('Navigate back to admin home page', async () => {
      await sysAdminActor.browse().goto(AdminNavTargets.homeRoute);
    });

    await test.step('Create the copy of the survey', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.copyViaTile(surveyName, expectedSurveyCopyName));
    });

    await test.step('Verify the survey was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(SurveyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(expectedSurveyCopyName);
    });
  });

  test("Update a survey supporting data app's name", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-696',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const updatedSurveyName = `${surveyName}-updated`;

    await test.step('Create the survey supporting data app whose name will be updated', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
    });

    await test.step("Update the survey supporting data app's name", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await sysAdminActor.browse().check(EditGeneralSettingsModalTargets.nameInput).hasValue(surveyName);
      await sysAdminActor.browse().fill(EditGeneralSettingsModalTargets.nameInput, updatedSurveyName);
      await sysAdminActor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    });

    await test.step('Verify the survey supporting data app was updated correctly', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(updatedSurveyName);
    });
  });

  test('Disable a survey supporting data app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-697',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app to be disabled', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Enabled');
    });

    await test.step('Disable the survey supporting data app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.disable());
    });

    await test.step('Verify the survey supporting data app was disabled correctly', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Disabled');
    });
  });

  test('Enable a survey supporting data app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-698',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app to be enabled', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Enabled');
    });

    await test.step('Disable the survey supporting data app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.disable());
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Disabled');
    });

    await test.step('Enable the survey supporting data app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.enable());
    });

    await test.step('Verify the survey supporting data app was enabled correctly', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Enabled');
    });
  });

  test("Update a survey supporting data app's description", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-699',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const updatedDescription = 'This is an updated description';

    await test.step('Create the survey supporting data app whose description will be updated', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.description).hasText('');
    });

    await test.step("Update the survey supporting data app's description", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await sysAdminActor.browse().check(EditGeneralSettingsModalTargets.descriptionEditor).hasText('');
      await sysAdminActor.browse().fill(EditGeneralSettingsModalTargets.descriptionEditor, updatedDescription);
      await sysAdminActor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    });

    await test.step("Verify survey supporting data app's description was updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.description).hasText(updatedDescription);
    });
  });

  test("Disable a survey supporting data app's content versioning", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-700',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose content versioning will be disabled', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText('Enabled - Direct User Saves');
    });

    await test.step("Disable the survey supporting data app's content versioning", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await sysAdminActor
        .browse()
        .check(EditGeneralSettingsModalTargets.contentVersionStatusSwitch)
        .hasAttribute('aria-checked', 'true');
      await sysAdminActor.browse().check(EditGeneralSettingsModalTargets.contentVersionTypes).isVisible();

      await sysAdminActor.browse().click(EditGeneralSettingsModalTargets.contentVersionStatusToggle);
      await sysAdminActor
        .browse()
        .check(EditGeneralSettingsModalTargets.contentVersionStatusSwitch)
        .hasAttribute('aria-checked', 'false');
      await sysAdminActor.browse().check(EditGeneralSettingsModalTargets.contentVersionTypes).isHidden();

      await sysAdminActor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    });

    await test.step("Verify survey supporting data app's content versioning was disabled correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.contentVersionStatus).hasText('Disabled');
    });
  });

  test("Enable a survey supporting data app's content versioning", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-701',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose content versioning will be enabled', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText('Enabled - Direct User Saves');
    });

    await test.step("Disable the survey supporting data app's content versioning", async () => {
      await sysAdminActor.attemptsTo(AppTasks.toggleContentVersioning('disabled'));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.contentVersionStatus).hasText('Disabled');
    });

    await test.step("Enable the survey supporting data app's content versioning", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await sysAdminActor
        .browse()
        .check(EditGeneralSettingsModalTargets.contentVersionStatusSwitch)
        .hasAttribute('aria-checked', 'false');
      await sysAdminActor.browse().check(EditGeneralSettingsModalTargets.contentVersionTypes).isHidden();

      await sysAdminActor.browse().click(EditGeneralSettingsModalTargets.contentVersionStatusToggle);
      await sysAdminActor
        .browse()
        .check(EditGeneralSettingsModalTargets.contentVersionStatusSwitch)
        .hasAttribute('aria-checked', 'true');
      await sysAdminActor.browse().check(EditGeneralSettingsModalTargets.contentVersionTypes).isVisible();

      await sysAdminActor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    });

    await test.step("Verify survey supporting data app's content versioning was enabled correctly", async () => {
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText('Enabled - Direct User Saves');
    });
  });

  test("Change the save types of a survey supporting data app's content versioning", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-702',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose content versioning will be changed', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText('Enabled - Direct User Saves');
    });

    await test.step("Change the survey supporting data app's content versioning", async () => {
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

    await test.step("Verify survey supporting data app's content versioning was changed correctly", async () => {
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText('Enabled - Direct User Saves, Indirect User Saves, API Saves, System Saves');
    });
  });

  test("Disable a survey supporting data app's concurrent edit alert", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-703',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose concurrent edit alert will be disabled', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.concurrentEditAlertStatus).hasText('Enabled');
    });

    await test.step("Disable the survey supporting data app's concurrent edit alert", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateConcurrentEditAlert(false));
    });

    await test.step("Verify survey supporting data app's concurrent edit alert was disabled correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.concurrentEditAlertStatus).hasText('Disabled');
    });
  });

  test("Enable a survey supporting data app's concurrent edit alert", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-704',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose concurrent edit alert will be enabled', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.concurrentEditAlertStatus).hasText('Enabled');
    });

    await test.step("Disable the survey supporting data app's concurrent edit alert", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateConcurrentEditAlert(false));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.concurrentEditAlertStatus).hasText('Disabled');
    });

    await test.step("Enable the survey supporting data app's concurrent edit alert", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateConcurrentEditAlert(true));
    });

    await test.step("Verify survey supporting data app's concurrent edit alert was enabled correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.concurrentEditAlertStatus).hasText('Enabled');
    });
  });

  test("Update a survey supporting data's display link field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-705',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose display link field will be updated', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.displayLink).hasText('Record Id');
    });

    await test.step("Update the survey supporting data app's display link field", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateDisplayLinkField('Created Date'));
    });

    await test.step("Verify survey supporting data app's display link field was updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.displayLink).hasText('Created Date');
    });
  });

  test("Update a survey supporting data app's integration link field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-706',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose integration link field will be updated', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.integrationLink).hasText('Record Id');
    });

    await test.step("Update the survey supporting data app's integration link field", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateIntegrationLinkField('Created Date'));
    });

    await test.step("Verify survey supporting data app's integration link field was updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.integrationLink).hasText('Created Date');
    });
  });

  test("Update a survey supporting data app's display fields", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-707',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose display fields will be updated', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.displayFields).hasText('Record Id');
    });

    await test.step("Update the survey supporting data app's display fields", async () => {
      await sysAdminActor.attemptsTo(AppTasks.addDisplayField('Created Date'));
    });

    await test.step("Verify survey supporting data app's display fields were updated correctly", async () => {
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

  test("Update a survey supporting data app's primary sort field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-708',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose primary sort field will be updated', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.sort).hasText('None');
    });

    await test.step("Update the survey supporting data app's primary sort field", async () => {
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

    await test.step("Verify survey supporting data app's primary sort field was updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.sort).hasText('Record Id (Ascending)');
    });
  });

  test("Update a survey supporting data app's secondary sort field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-709',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose secondary sort field will be updated', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.sort).hasText('None');
    });

    await test.step("Update the survey supporting data app's secondary sort field", async () => {
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

    await test.step("Verify survey supporting data app's secondary sort field was updated correctly", async () => {
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

  test("Change a survey supporting data app's administration permissions to private", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-710',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose administration permissions will be changed', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Public');
    });

    await test.step("Change the survey supporting data app's administration permissions to private", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editAdminSettingsLink);
      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.adminPermissionsSelect);
      await sysAdminActor.browse().click(OptionTargets.byName('Private'));

      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.usersSelector).isVisible();
      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.groupsSelector).isVisible();
      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.rolesSelector).isVisible();

      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.saveButton);
      await sysAdminActor.browse().waitForState(EditAdminSettingsModalTargets.modal, 'hidden');
    });

    await test.step("Verify survey supporting data app's administration permissions were set to private", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Private');
    });
  });

  test('Give survey supporting data app administration permissions to specific users', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-711',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const newUser = FakeDataFactory.createFakeUser('Inactive');

    await test.step('Create user that will be given admin permissions', async () => {
      await sysAdminActor.attemptsTo(UserTasks.create(newUser));
    });

    try {
      await test.step('Create the survey supporting data app whose administration permissions will be changed', async () => {
        await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      });

      await test.step('Give survey supporting data app admin permissions to user', async () => {
        await sysAdminActor.attemptsTo(AppTasks.setAdminPermissions('Private', { user: newUser.fullName }));
      });

      await test.step('Verify survey supporting data app admin permissions were given to user', async () => {
        await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Private');
        await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminUsers).hasText(newUser.fullName);
      });
    } finally {
      await test.step('Delete user', async () => {
        await sysAdminActor.attemptsTo(UserTasks.deleteUsers([newUser.username]));
      });
    }
  });

  test('Give survey supporting data app administration permissions to specific roles', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-712',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const roleName = FakeDataFactory.createFakeRoleName();

    await test.step('Create role that will be given admin permissions', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.create(new Role({ name: roleName })));
    });

    try {
      await test.step('Create the survey supporting data app whose administration permissions will be changed', async () => {
        await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      });

      await test.step('Give survey supporting data app admin permissions to role', async () => {
        await sysAdminActor.attemptsTo(AppTasks.setAdminPermissions('Private', { role: roleName }));
      });

      await test.step('Verify survey supporting data app admin permissions were given to role', async () => {
        await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Private');
        await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminRoles).hasText(roleName);
      });
    } finally {
      await test.step('Delete role', async () => {
        await sysAdminActor.attemptsTo(RoleTasks.deleteRoles([roleName]));
      });
    }
  });

  test('Give survey supporting data app administration permissions to specific groups', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-713',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const groupName = FakeDataFactory.createFakeGroupName();

    await test.step('Create group that will be given admin permissions', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.create(groupName));
    });

    try {
      await test.step('Create the survey supporting data app whose administration permissions will be changed', async () => {
        await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      });

      await test.step('Give survey supporting data app admin permissions to group', async () => {
        await sysAdminActor.attemptsTo(AppTasks.setAdminPermissions('Private', { group: groupName }));
      });

      await test.step('Verify survey supporting data app admin permissions were given to group', async () => {
        await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Private');
        await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminGroups).hasText(groupName);
      });
    } finally {
      await test.step('Delete group', async () => {
        await sysAdminActor.attemptsTo(GroupTasks.deleteGroups([groupName]));
      });
    }
  });

  test("Change a survey supporting data app's administration permissions to public", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-714',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app whose administration permissions will be changed', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Public');
    });

    await test.step("Change the survey supporting data app's administration permissions to private", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editAdminSettingsLink);
      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.adminPermissionsSelect);
      await sysAdminActor.browse().click(OptionTargets.byName('Private'));
      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.saveButton);
      await sysAdminActor.browse().waitForState(EditAdminSettingsModalTargets.modal, 'hidden');
    });

    await test.step("Change the survey supporting data app's administration permissions to public", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editAdminSettingsLink);
      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.adminPermissionsSelect);
      await sysAdminActor.browse().click(OptionTargets.byName('Public'));

      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.usersSelector).isHidden();
      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.groupsSelector).isHidden();
      await sysAdminActor.browse().check(EditAdminSettingsModalTargets.rolesSelector).isHidden();

      await sysAdminActor.browse().click(EditAdminSettingsModalTargets.saveButton);
      await sysAdminActor.browse().waitForState(EditAdminSettingsModalTargets.modal, 'hidden');
    });

    await test.step("Verify survey supporting data app's administration permissions were set to public", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.adminPermissions).hasText('Public');
    });
  });

  test('Enable geocoding for a survey supporting data app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-715',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const addressFieldName = FakeDataFactory.createFakeFieldName('address');
    const cityFieldName = FakeDataFactory.createFakeFieldName('city');
    const stateFieldName = FakeDataFactory.createFakeFieldName('state');
    const zipFieldName = FakeDataFactory.createFakeFieldName('zip');
    const fieldNames = [addressFieldName, cityFieldName, stateFieldName, zipFieldName];

    await test.step('Create survey supporting data app whose geocoding will be enabled', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingStatus).hasText('Disabled');
    });

    await test.step('Create fields for geocoding mapping', async () => {
      for (const fieldName of fieldNames) {
        await sysAdminActor.attemptsTo(AppTasks.addTextField(fieldName));
      }
    });

    await test.step('Enable geocoding for survey supporting data app', async () => {
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

  test("Update a survey supporting data app's geocoding field mapping", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-716',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const addressFieldName = FakeDataFactory.createFakeFieldName('address');
    const cityFieldName = FakeDataFactory.createFakeFieldName('city');
    const stateFieldName = FakeDataFactory.createFakeFieldName('state');
    const zipFieldName = FakeDataFactory.createFakeFieldName('zip');
    const secondAddressFieldName = FakeDataFactory.createFakeFieldName('address-2');

    await test.step('Create survey supporting data app whose geocode mapping will be updated', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingStatus).hasText('Disabled');
    });

    await test.step('Enable geocoding for survey supporting data app', async () => {
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

  test('Disable geocoding for a survey supporting data app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-717',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const addressFieldName = FakeDataFactory.createFakeFieldName('address');
    const cityFieldName = FakeDataFactory.createFakeFieldName('city');
    const stateFieldName = FakeDataFactory.createFakeFieldName('state');
    const zipFieldName = FakeDataFactory.createFakeFieldName('zip');

    await test.step('Create survey supporting data app whose geocoding will be disabled', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingStatus).hasText('Disabled');
    });

    await test.step('Enable geocoding for survey supporting data app', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.enableGeocoding({
          address: addressFieldName,
          city: cityFieldName,
          state: stateFieldName,
          zip: zipFieldName,
        })
      );
    });

    await test.step('Disable geocoding for survey supporting data app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.disableGeocoding());
    });

    await test.step('Verify geocoding was disabled correctly', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingStatus).hasText('Disabled');
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.geocodingGrid).isHidden();
    });
  });

  test("Update a survey supporting data app's survey notes", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-718',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const note = 'This is a note';

    await test.step('Create the survey supporting data app whose survey notes will be updated', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.notes).hasText('');
    });

    await test.step("Update the survey supporting data app's survey notes", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editNotesSettingLink);
      await sysAdminActor.browse().check(EditNotesSettingsModalTargets.notesEditor).hasText('');
      await sysAdminActor.browse().fill(EditNotesSettingsModalTargets.notesEditor, note);
      await sysAdminActor.browse().click(EditNotesSettingsModalTargets.saveButton);
    });

    await test.step("Verify survey supporting data app's survey notes were updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.notes).hasText(note);
    });
  });

  test('Delete a survey supporting data app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-865',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const surveyRow = SurveysPageTargets.surveyRow(surveyName);
    const deleteButton = SurveysPageTargets.deleteSurveyButtonForRow(surveyName);

    await test.step('Navigate to the Surveys admin page', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.goto());
    });

    await test.step('Create the survey supporting data app to be deleted', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.createFromSurveysPage(surveyName));
      await sysAdminActor.browse().waitForLoadState();
      await sysAdminActor.browse().click(AppDetailTargets.closeButton);
    });

    await test.step('Navigate to the surveys admin page', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.goto(), SurveyTasks.scrollAllIntoView());
      await sysAdminActor.browse().check(surveyRow).isVisible();
    });

    await test.step('Delete the survey supporting data app', async () => {
      await sysAdminActor.browse().hover(surveyRow);
      await sysAdminActor.browse().click(deleteButton);

      await sysAdminActor.browse().check(SurveysPageTargets.deleteConfirmationInput).isVisible();
      await sysAdminActor.browse().type(SurveysPageTargets.deleteConfirmationInput, 'OK', { delay: 100 });
      await sysAdminActor.browse().check(SurveysPageTargets.deleteConfirmationInput).hasValue('OK');
      await sysAdminActor.browse().check(DeleteDialogTargets.deleteButton).isEnabled();

      const deleteSurveyResponse = sysAdminActor
        .browse()
        .waitForResponse((r: Response) => SurveysPageTargets.deleteSurveyPathRegex.test(r.url()) && r.status() === 200);
      await sysAdminActor.browse().click(DeleteDialogTargets.deleteButton);
      await deleteSurveyResponse;
      await sysAdminActor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
    });

    await test.step('Verify the survey supporting data app was deleted', async () => {
      await sysAdminActor.browse().check(surveyRow).isNotAttached();
    });
  });
});
