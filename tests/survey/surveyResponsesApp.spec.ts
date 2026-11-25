import { Survey } from '@stevanfreeborn/onspring-models';
import {
  AppDetailTargets,
  AppTasks,
  EditDisplaySettingsModalTargets,
  EditGeneralSettingsModalTargets,
  OptionTargets,
  SurveyQuestions,
  SurveyTasks,
} from '@stevanfreeborn/onspring-ui';
import { test as base, SurveyFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend<{ targetSurvey: Survey }>({
  targetSurvey: SurveyFixture.create().build(),
});

test.describe('survey responses app', () => {
  test.describe.configure({
    mode: 'default',
  });

  let targetSurvey: Survey;
  let targetSurveyResponsesAppId: number;

  test.beforeAll('Create target survey', async ({ targetSurvey: survey, sysAdminActor }) => {
    targetSurvey = survey;
    await sysAdminActor.attemptsTo(SurveyTasks.openResponseApp());
    targetSurveyResponsesAppId = await sysAdminActor.asks(SurveyQuestions.idFromUrl());
  });

  test.beforeEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(SurveyTasks.gotoSurvey(targetSurveyResponsesAppId));
  });

  test("Update a survey responses app's name", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-719',
    });

    const updatedName = `${targetSurvey.name} Updated`;

    await test.step("Verify the survey responses app matches survey's name", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(`${targetSurvey.name} Responses`);
    });

    await test.step("Verify the survey responses app's name cannot be updated", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await sysAdminActor
        .browse()
        .check(EditGeneralSettingsModalTargets.nameInput)
        .hasAttribute('disabled', 'disabled');
      await sysAdminActor.browse().click(EditGeneralSettingsModalTargets.cancelButton);
      await sysAdminActor.browse().waitForState(EditGeneralSettingsModalTargets.cancelButton, 'hidden');
    });

    await test.step("Update the survey's name", async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openSurveyFromResponseApp(), AppTasks.updateName(updatedName));
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(updatedName);
    });

    await test.step("Verify the survey responses app's name matches the updated survey's name", async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openResponseApp());
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.name).hasText(`${updatedName} Responses`);
    });
  });

  test('Disable a survey responses app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-720',
    });

    await test.step("Verify the survey responses app's status is readonly", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await sysAdminActor
        .browse()
        .check(EditGeneralSettingsModalTargets.statusSwitch)
        .hasClass(/k-state-disabled/i);
      await sysAdminActor.browse().click(EditGeneralSettingsModalTargets.cancelButton);
      await sysAdminActor.browse().waitForState(EditGeneralSettingsModalTargets.cancelButton, 'hidden');
    });

    await test.step("Update the survey's status to disabled", async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openSurveyFromResponseApp(), AppTasks.disable());
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Disabled');
    });

    await test.step("Verify the survey responses app's status is disabled", async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openResponseApp());
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Disabled');
    });
  });

  test('Enable a survey responses app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-721',
    });

    await test.step("Verify the survey responses app's status is readonly", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await sysAdminActor
        .browse()
        .check(EditGeneralSettingsModalTargets.statusSwitch)
        .hasClass(/k-state-disabled/i);
      await sysAdminActor.browse().click(EditGeneralSettingsModalTargets.cancelButton);
      await sysAdminActor.browse().waitForState(EditGeneralSettingsModalTargets.cancelButton, 'hidden');
    });

    await test.step("Update the survey's status to enabled", async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openSurveyFromResponseApp(), AppTasks.enable());
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.status).hasText('Enabled');
    });

    await test.step("Verify the survey responses app's status is enabled", async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openResponseApp());
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.status)
        .hasText(/enabled/i);
    });
  });

  test("Update a survey responses app's description", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-722',
    });

    const description = 'Test Description';

    await test.step("Update the survey responses app's description", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateDescription(description));
    });

    await test.step("Verify the survey responses app's description is updated", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.description).hasText(description);
    });
  });

  test("Disable a survey responses app's content versioning", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-723',
    });

    await test.step('Disable the survey responses app content versioning', async () => {
      await sysAdminActor.attemptsTo(AppTasks.toggleContentVersioning('disabled'));
    });

    await test.step('Verify the survey responses app content versioning is disabled', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.contentVersionStatus).hasText('Disabled');
    });
  });

  test("Enable a survey responses app's content versioning", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-724',
    });

    await test.step('Enable the survey responses app content versioning', async () => {
      await sysAdminActor.attemptsTo(AppTasks.toggleContentVersioning('enabled'));
    });

    await test.step('Verify the survey responses app content versioning is enabled', async () => {
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText(/enabled/i);
    });
  });

  test("Change the save types of a survey responses app's content versioning", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-725',
    });

    await test.step("Change the survey responses app's content versioning", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await sysAdminActor.browse().checkControl(EditGeneralSettingsModalTargets.indirectUserSavesCheckbox);
      await sysAdminActor.browse().checkControl(EditGeneralSettingsModalTargets.apiSavesCheckbox);
      await sysAdminActor.browse().checkControl(EditGeneralSettingsModalTargets.systemSavesCheckbox);
      await sysAdminActor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    });

    await test.step("Verify the survey responses app's content versioning is updated", async () => {
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.contentVersionStatus)
        .hasText('Enabled - Direct User Saves, Indirect User Saves, API Saves, System Saves');
    });
  });

  test("Disable a survey responses app's concurrent edit alert", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-726',
    });

    await test.step('Disable the survey responses app concurrent edit alert', async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateConcurrentEditAlert(false));
    });

    await test.step('Verify the survey responses app concurrent edit alert is disabled', async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.concurrentEditAlertStatus).hasText('Disabled');
    });
  });

  test("Enable a survey responses app's concurrent edit alert", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-727',
    });

    await test.step('Enable the survey responses app concurrent edit alert', async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateConcurrentEditAlert(true));
    });

    await test.step('Verify the survey responses app concurrent edit alert is enabled', async () => {
      await sysAdminActor
        .browse()
        .check(AppDetailTargets.generalTab.concurrentEditAlertStatus)
        .hasText(/enabled/i);
    });
  });

  test("Update a survey responses app's display link field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-728',
    });

    await test.step("Update the survey responses app's display link field", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateDisplayLinkField('Created Date'));
    });

    await test.step("Verify the survey responses app's display link field is updated", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.displayLink).hasText('Created Date');
    });
  });

  test("Update a survey responses app's integration link field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-729',
    });

    await test.step("Update the survey responses app's integration link field", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateIntegrationLinkField('Created Date'));
    });

    await test.step("Verify the survey responses app's integration link field is updated", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.integrationLink).hasText('Created Date');
    });
  });

  test("Update a survey responses app's display fields", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-730',
    });

    await test.step("Update the survey responses app's display fields", async () => {
      await sysAdminActor.attemptsTo(AppTasks.addDisplayField('Created Date'));
    });

    await test.step("Verify survey responses app's display fields were updated correctly", async () => {
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

  test("Update a survey responses app's primary sort field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-731',
    });

    await test.step("Update the survey responses app's primary sort field", async () => {
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

    await test.step("Verify survey responses app's primary sort field was updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.sort).hasText('Record Id (Ascending)');
    });
  });

  test("Update a survey responses app's secondary sort field", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-732',
    });

    await test.step("Update the survey responses app's secondary sort field", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
      await sysAdminActor.browse().click(EditDisplaySettingsModalTargets.secondarySortSelect);
      await sysAdminActor.browse().click(OptionTargets.byName('Created Date'));

      await sysAdminActor.browse().check(EditDisplaySettingsModalTargets.secondarySortDirectionSelect).isVisible();
      await sysAdminActor
        .browse()
        .check(EditDisplaySettingsModalTargets.secondarySortDirectionSelect)
        .hasText('Ascending');

      await sysAdminActor.browse().click(EditDisplaySettingsModalTargets.saveButton);
    });

    await test.step("Verify survey responses app's secondary sort field was updated correctly", async () => {
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

  test("Update a survey responses app's app notes", async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-733',
    });

    const note = 'This is a note';

    await test.step("Update the app's app notes", async () => {
      await sysAdminActor.attemptsTo(AppTasks.updateNotes(note));
    });

    await test.step("Verify app's app notes were updated correctly", async () => {
      await sysAdminActor.browse().check(AppDetailTargets.generalTab.notes).hasText(note);
    });
  });
});
