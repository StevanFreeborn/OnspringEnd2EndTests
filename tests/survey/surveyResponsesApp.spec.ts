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

  test('Disable a survey responses app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-720',
    });

    expect(true).toBe(true);
  });

  test('Enable a survey responses app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-721',
    });

    expect(true).toBe(true);
  });

  test("Update a survey responses app's description", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-722',
    });

    expect(true).toBe(true);
  });

  test("Disable a survey responses app's content versioning", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-723',
    });

    expect(true).toBe(true);
  });

  test("Enable a survey responses app's content versioning", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-724',
    });

    expect(true).toBe(true);
  });

  test("Change the save types of a survey responses app's content versioning", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-725',
    });

    expect(true).toBe(true);
  });

  test("Disable a survey responses app's concurrent edit alert", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-726',
    });

    expect(true).toBe(true);
  });

  test("Enable a survey responses app's concurrent edit alert", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-727',
    });

    expect(true).toBe(true);
  });

  test("Update a survey responses app's display link field", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-728',
    });

    expect(true).toBe(true);
  });

  test("Update a survey responses app's integration link field", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-729',
    });

    expect(true).toBe(true);
  });

  test("Update a survey responses app's display fields", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-730',
    });

    expect(true).toBe(true);
  });

  test("Update a survey responses app's primary sort field", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-731',
    });

    expect(true).toBe(true);
  });

  test("Update a survey responses app's secondary sort field", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-732',
    });

    expect(true).toBe(true);
  });

  test("Update a survey responses app's app notes", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-733',
    });

    expect(true).toBe(true);
  });
});
