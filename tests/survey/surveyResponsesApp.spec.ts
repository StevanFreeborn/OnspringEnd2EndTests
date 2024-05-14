import { test as base, expect } from '../../fixtures';
import { survey } from '../../fixtures/survey.fixtures';
import { Survey } from '../../models/survey';
import { SurveyAdminPage } from '../../pageObjectModels/surveys/surveyAdminPage';
import { SurveyResponsesAdminPage } from '../../pageObjectModels/surveys/surveyResponsesAdminPage';
import { AnnotationType } from '../annotations';

type SurveyResponsesAppTestFixtures = {
  survey: Survey;
  surveyAdminPage: SurveyAdminPage;
  surveyResponsesAdminPage: SurveyResponsesAdminPage;
};

const test = base.extend<SurveyResponsesAppTestFixtures>({
  survey: survey,
  surveyAdminPage: async ({ sysAdminPage }, use) => await use(new SurveyAdminPage(sysAdminPage)),
  surveyResponsesAdminPage: async ({ sysAdminPage }, use) => await use(new SurveyResponsesAdminPage(sysAdminPage)),
});

test.describe('survey responses app', () => {
  test.describe.configure({
    mode: 'default',
  });

  let targetSurvey: Survey;
  let targetSurveyResponsesAppId: number;

  test.beforeAll('Create target survey', async ({ survey, surveyAdminPage, surveyResponsesAdminPage }) => {
    targetSurvey = survey;
    await surveyAdminPage.configureResponseAppLink.click();
    await surveyAdminPage.page.waitForURL(surveyResponsesAdminPage.pathRegex);

    targetSurveyResponsesAppId = surveyResponsesAdminPage.getIdFromUrl();
  });

  test.beforeEach(async ({ surveyResponsesAdminPage }) => {
    await surveyResponsesAdminPage.goto(targetSurveyResponsesAppId);
  });

  test("Update a survey responses app's name", async ({ surveyResponsesAdminPage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-719',
    });

    const updatedName = `${targetSurvey.name} Updated`;

    await test.step("Verify the survey responses app matches survey's name", async () => {
      await expect(surveyResponsesAdminPage.generalTab.name).toHaveText(`${targetSurvey.name} Responses`);
    });

    await test.step("Verify the survey responses app's name cannot be updated", async () => {
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsLink.click();
      await expect(surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.nameInput).toHaveAttribute(
        'disabled',
        'disabled'
      );

      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.cancelButton.click();
    });

    await test.step("Update the survey's name", async () => {
      await surveyResponsesAdminPage.configureSurveyLinK.click();
      await surveyResponsesAdminPage.page.waitForURL(surveyAdminPage.pathRegex);

      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyAdminPage.generalTab.editGeneralSettingsModal.nameInput.fill(updatedName);
      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify the survey responses app's name matches the updated survey's name", async () => {
      await surveyAdminPage.configureResponseAppLink.click();
      await surveyAdminPage.page.waitForURL(surveyResponsesAdminPage.pathRegex);

      await expect(surveyResponsesAdminPage.generalTab.name).toHaveText(`${updatedName} Responses`);
    });
  });

  test('Disable a survey responses app', async ({ surveyResponsesAdminPage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-720',
    });

    await test.step("Verify the survey responses app's status is readonly", async () => {
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsLink.click();
      await expect(surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveClass(
        /k-state-disabled/i
      );

      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.cancelButton.click();
    });

    await test.step("Update the survey's status to disabled", async () => {
      await surveyResponsesAdminPage.configureSurveyLinK.click();
      await surveyResponsesAdminPage.page.waitForURL(surveyAdminPage.pathRegex);

      await surveyResponsesAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.statusSwitch.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify the survey responses app's status is disabled", async () => {
      await surveyAdminPage.configureResponseAppLink.click();
      await surveyAdminPage.page.waitForURL(surveyResponsesAdminPage.pathRegex);

      await expect(surveyResponsesAdminPage.generalTab.status).toHaveText('Disabled');
    });
  });

  test('Enable a survey responses app', async ({ surveyResponsesAdminPage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-721',
    });

    await test.step("Verify the survey responses app's status is readonly", async () => {
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsLink.click();
      await expect(surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveClass(
        /k-state-disabled/i
      );

      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.cancelButton.click();
    });

    await test.step("Update the survey's status to enabled", async () => {
      await surveyResponsesAdminPage.configureSurveyLinK.click();
      await surveyResponsesAdminPage.page.waitForURL(surveyAdminPage.pathRegex);

      await surveyResponsesAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.statusSwitch.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify the survey responses app's status is enabled", async () => {
      await surveyAdminPage.configureResponseAppLink.click();
      await surveyAdminPage.page.waitForURL(surveyResponsesAdminPage.pathRegex);

      await expect(surveyResponsesAdminPage.generalTab.status).toHaveText(/enabled/i);
    });
  });

  test("Update a survey responses app's description", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-722',
    });

    const description = `Test Description`;

    await test.step("Update the survey responses app's description", async () => {
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.descriptionEditor.fill(description);
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify the survey responses app's description is updated", async () => {
      await expect(surveyResponsesAdminPage.generalTab.description).toHaveText(description);
    });
  });

  test("Disable a survey responses app's content versioning", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-723',
    });

    await test.step('Disable the survey responses app content versioning', async () => {
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusToggle.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify the survey responses app content versioning is disabled', async () => {
      await expect(surveyResponsesAdminPage.generalTab.contentVersionStatus).toHaveText('Disabled');
    });
  });

  test("Enable a survey responses app's content versioning", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-724',
    });

    await test.step('Enable the survey responses app content versioning', async () => {
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusToggle.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify the survey responses app content versioning is enabled', async () => {
      await expect(surveyResponsesAdminPage.generalTab.contentVersionStatus).toHaveText(/enabled/i);
    });
  });

  test("Change the save types of a survey responses app's content versioning", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-725',
    });

    await test.step("Change the survey responses app's content versioning", async () => {
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.indirectUserSavesCheckbox.check();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.apiSavesCheckbox.check();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.systemSavesCheckbox.check();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify the survey responses app's content versioning is updated", async () => {
      await expect(surveyResponsesAdminPage.generalTab.contentVersionStatus).toHaveText(
        'Enabled - Direct User Saves, Indirect User Saves, API Saves, System Saves'
      );
    });
  });

  test("Disable a survey responses app's concurrent edit alert", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-726',
    });

    await test.step('Disable the survey responses app concurrent edit alert', async () => {
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertCheckbox.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify the survey responses app concurrent edit alert is disabled', async () => {
      await expect(surveyResponsesAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Disabled');
    });
  });

  test("Enable a survey responses app's concurrent edit alert", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-727',
    });

    await test.step('Enable the survey responses app concurrent edit alert', async () => {
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertCheckbox.click();
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify the survey responses app concurrent edit alert is enabled', async () => {
      await expect(surveyResponsesAdminPage.generalTab.concurrentEditAlertStatus).toHaveText(/enabled/i);
    });
  });

  test("Update a survey responses app's display link field", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-728',
    });

    await test.step("Update the survey responses app's display link field", async () => {
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.displayLinkSelect.click();
      await surveyResponsesAdminPage.page.getByRole('option', { name: 'Created Date' }).click();
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify the survey responses app's display link field is updated", async () => {
      await expect(surveyResponsesAdminPage.generalTab.displayLink).toHaveText('Created Date');
    });
  });

  test("Update a survey responses app's integration link field", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-729',
    });

    await test.step("Update the survey responses app's integration link field", async () => {
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.integrationLinkSelect.click();
      await surveyResponsesAdminPage.page.getByRole('option', { name: 'Created Date' }).click();
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify the survey responses app's integration link field is updated", async () => {
      await expect(surveyResponsesAdminPage.generalTab.integrationLink).toHaveText('Created Date');
    });
  });

  test("Update a survey responses app's display fields", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-730',
    });

    await test.step("Update the survey responses app's display fields", async () => {
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.addDisplayField('Created Date');
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify survey responses app's display fields were updated correctly", async () => {
      await expect(surveyResponsesAdminPage.generalTab.displayFields).toHaveText(/Record Id/);
      await expect(surveyResponsesAdminPage.generalTab.displayFields).toHaveText(/Created Date/);
    });
  });

  test("Update a survey responses app's primary sort field", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-731',
    });

    await test.step("Update the survey responses app's primary sort field", async () => {
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.selectPrimarySortField('Record Id');

      await expect(
        surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.primarySortDirectionSelect
      ).toBeVisible();

      await expect(surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.primarySortDirectionSelect).toHaveText(
        'Ascending'
      );

      await surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify survey responses app's primary sort field was updated correctly", async () => {
      await expect(surveyResponsesAdminPage.generalTab.sort).toHaveText('Record Id (Ascending)');
    });
  });

  test("Update a survey responses app's secondary sort field", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-732',
    });

    await test.step("Update the survey responses app's secondary sort field", async () => {
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsLink.click();
      await surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.selectSecondarySortField('Created Date');

      await expect(
        surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.secondarySortDirectionSelect
      ).toBeVisible();

      await expect(
        surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.secondarySortDirectionSelect
      ).toHaveText('Ascending');

      await surveyResponsesAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify survey responses app's secondary sort field was updated correctly", async () => {
      await expect(surveyResponsesAdminPage.generalTab.sort).toHaveText(/Record Id \(Ascending\)/);
      await expect(surveyResponsesAdminPage.generalTab.sort).toHaveText(/Created Date \(Ascending\)/);
    });
  });

  test("Update a survey responses app's app notes", async ({ surveyResponsesAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-733',
    });

    const note = 'This is a note';

    await test.step("Update the app's app notes", async () => {
      await surveyResponsesAdminPage.generalTab.editNotesSettingLink.click();
      await surveyResponsesAdminPage.generalTab.editNotesSettingsModal.notesEditor.fill(note);
      await surveyResponsesAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify app's app notes were updated correctly", async () => {
      await expect(surveyResponsesAdminPage.generalTab.notes).toHaveText(note);
    });
  });
});
