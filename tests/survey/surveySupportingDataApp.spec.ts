import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { SurveyAdminPage } from '../../pageObjectModels/surveys/surveyAdminPage';
import { SurveysAdminPage } from '../../pageObjectModels/surveys/surveysAdminPage';
import { AnnotationType } from '../annotations';

type SurveyTestFixtures = {
  adminHomePage: AdminHomePage;
  surveysAdminPage: SurveysAdminPage;
  surveyAdminPage: SurveyAdminPage;
};

const test = base.extend<SurveyTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
  surveysAdminPage: async ({ sysAdminPage }, use) => {
    const surveysAdminPage = new SurveysAdminPage(sysAdminPage);
    await use(surveysAdminPage);
  },
  surveyAdminPage: async ({ sysAdminPage }, use) => {
    const surveyAdminPage = new SurveyAdminPage(sysAdminPage);
    await use(surveyAdminPage);
  },
});

test.describe('survey supporting data app', () => {
  let surveysToDelete: string[] = [];

  test.beforeEach(async ({ adminHomePage }) => {
    await adminHomePage.goto();
  });

  test.afterEach(async ({ surveysAdminPage }) => {
    await surveysAdminPage.deleteSurveys(surveysToDelete);
    surveysToDelete = [];
  });

  test('Create a survey via the create button on the header of on the admin home page', async ({
    adminHomePage,
    surveyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-858',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey', async () => {
      adminHomePage.createSurveyUsingHeaderCreateButton(surveyName);
    });

    await test.step('Verify the survey was created correctly', async () => {
      await expect(surveyAdminPage.page).toHaveURL(surveyAdminPage.pathRegex);
      await expect(surveyAdminPage.generalTab.name).toHaveText(surveyName);
    });
  });

  test('Create a survey via the create button on the Surveys tile on the admin home page', async ({
    adminHomePage,
    surveyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-859',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey', async () => {
      await adminHomePage.createSurveyUsingSurveyTileButton(surveyName);
    });

    await test.step('Verify the survey was created correctly', async () => {
      await expect(surveyAdminPage.page).toHaveURL(surveyAdminPage.pathRegex);
      await expect(surveyAdminPage.generalTab.name).toHaveText(surveyName);
    });
  });

  test('Create a survey via the Create Survey button on the Surveys admin page', async ({
    adminHomePage,
    surveysAdminPage,
    surveyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-860',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Navigate to the surveys admin page', async () => {
      await adminHomePage.surveyTileLink.click();
    });

    await test.step('Create the survey', async () => {
      await surveysAdminPage.createSurvey(surveyName);
    });

    await test.step('Verify the survey was created correctly', async () => {
      await expect(surveyAdminPage.page).toHaveURL(surveyAdminPage.pathRegex);
      await expect(surveyAdminPage.generalTab.name).toHaveText(surveyName);
    });
  });

  test('Create a copy of a survey via the create button on the header of the admin home page', async ({
    adminHomePage,
    surveyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-861',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const expectedSurveyCopyName = `${surveyName} (1)`;
    surveysToDelete.push(surveyName, expectedSurveyCopyName);

    await test.step('Create the survey to be copied', async () => {
      await adminHomePage.createSurveyUsingHeaderCreateButton(surveyName);
    });

    await test.step('Navigate back to admin home page', async () => {
      await surveyAdminPage.sidebar.adminGearIcon.click();
    });

    await test.step('Create the copy of the survey', async () => {
      await adminHomePage.page.waitForLoadState();
      await adminHomePage.adminNav.adminCreateButton.hover();

      await expect(adminHomePage.adminNav.adminCreateMenu).toBeVisible();

      await adminHomePage.adminNav.surveyCreateMenuOption.click();

      await expect(adminHomePage.createSurveyDialog.copyFromRadioButton).toBeVisible();

      await adminHomePage.createSurveyDialog.copyFromRadioButton.click();
      await adminHomePage.createSurveyDialog.selectDropdown.click();
      await adminHomePage.createSurveyDialog.getSurveyToCopy(surveyName).click();
      await adminHomePage.createSurveyDialog.continueButton.click();

      await expect(adminHomePage.createSurveyModal.nameInput).toBeVisible();
      await expect(adminHomePage.createSurveyModal.nameInput).toHaveValue(expectedSurveyCopyName);

      await adminHomePage.createSurveyModal.saveButton.click();
    });

    await test.step('Verify the survey was created correctly', async () => {
      await expect(surveyAdminPage.page).toHaveURL(surveyAdminPage.pathRegex);
      await expect(surveyAdminPage.generalTab.name).toHaveText(expectedSurveyCopyName);
    });
  });

  test('Create a copy of a survey via the Create Survey button on the Surveys admin page', async ({
    adminHomePage,
    surveysAdminPage,
    surveyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-862',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const expectedSurveyCopyName = `${surveyName} (1)`;
    surveysToDelete.push(surveyName, expectedSurveyCopyName);

    await test.step('Navigate to the surveys admin page', async () => {
      await adminHomePage.surveyTileLink.click();
    });

    await test.step('Create the survey to be copied', async () => {
      await surveysAdminPage.page.waitForLoadState();
      await surveysAdminPage.createSurvey(surveyName);
      await surveyAdminPage.sidebar.adminGearIcon.click();
    });

    await test.step('Navigate back to surveys admin page', async () => {
      await adminHomePage.page.waitForLoadState();
      await adminHomePage.surveyTileLink.click();
    });

    await test.step('Create the copy of the survey', async () => {
      await surveysAdminPage.page.waitForLoadState();
      await surveysAdminPage.createSurveyButton.click();

      await expect(surveysAdminPage.createSurveyDialog.copyFromRadioButton).toBeVisible();

      await surveysAdminPage.createSurveyDialog.copyFromRadioButton.click();
      await surveysAdminPage.createSurveyDialog.selectDropdown.click();
      await surveysAdminPage.createSurveyDialog.getSurveyToCopy(surveyName).click();
      await surveysAdminPage.createSurveyDialog.continueButton.click();

      await expect(surveysAdminPage.createSurveyModal.nameInput).toBeVisible();
      await expect(surveysAdminPage.createSurveyModal.nameInput).toHaveValue(expectedSurveyCopyName);

      await surveysAdminPage.createSurveyModal.saveButton.click();
    });

    await test.step('Verify the survey was created correctly', async () => {
      await expect(surveyAdminPage.page).toHaveURL(surveyAdminPage.pathRegex);
      await expect(surveyAdminPage.generalTab.name).toHaveText(expectedSurveyCopyName);
    });
  });

  test('Create a copy of a survey via the create button on the Surveys tile on the admin home page', async ({
    adminHomePage,
    surveyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-863',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const expectedSurveyCopyName = `${surveyName} (1)`;
    surveysToDelete.push(surveyName, expectedSurveyCopyName);

    await test.step('Create the survey to be copied', async () => {
      await adminHomePage.createSurveyUsingSurveyTileButton(surveyName);
    });

    await test.step('Navigate back to admin home page', async () => {
      await surveyAdminPage.sidebar.adminGearIcon.click();
    });

    await test.step('Create the copy of the survey', async () => {
      await adminHomePage.page.waitForLoadState();
      await adminHomePage.surveyTileLink.hover();

      await expect(adminHomePage.surveyTileCreateButton).toBeVisible();

      await adminHomePage.surveyTileCreateButton.click();

      await expect(adminHomePage.createSurveyDialog.copyFromRadioButton).toBeVisible();

      await adminHomePage.createSurveyDialog.copyFromRadioButton.click();
      await adminHomePage.createSurveyDialog.selectDropdown.click();
      await adminHomePage.createSurveyDialog.getSurveyToCopy(surveyName).click();
      await adminHomePage.createSurveyDialog.continueButton.click();

      await expect(adminHomePage.createSurveyModal.nameInput).toBeVisible();

      await expect(adminHomePage.createSurveyModal.nameInput).toHaveValue(expectedSurveyCopyName);

      await adminHomePage.createSurveyModal.saveButton.click();
    });

    await test.step('Verify the survey was created correctly', async () => {
      await expect(surveyAdminPage.page).toHaveURL(surveyAdminPage.pathRegex);
      await expect(surveyAdminPage.generalTab.name).toHaveText(expectedSurveyCopyName);
    });
  });

  test("Update a survey supporting data app's name", async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-696',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const updatedSurveyName = `${surveyName}-updated`;
    surveysToDelete.push(updatedSurveyName);

    await test.step('Create the survey supporting data app whose name will be updated', async () => {
      await adminHomePage.createSurvey(surveyName);
    });

    await test.step("Update the survey supporting data app's name", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.nameInput).toHaveValue(surveyName);

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.nameInput.fill(updatedSurveyName);
      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify the survey supporting data app was updated correctly', async () => {
      await expect(surveyAdminPage.generalTab.name).toHaveText(updatedSurveyName);
    });
  });

  test('Disable a survey supporting data app', async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-697',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app to be disabled', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.status).toHaveText('Enabled');
    });

    await test.step('Disable the survey supporting data app', async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.statusToggle.click();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify the survey supporting data app was disabled correctly', async () => {
      await expect(surveyAdminPage.generalTab.status).toHaveText('Disabled');
    });
  });

  test('Enable a survey supporting data app', async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-698',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();

    await test.step('Create the survey supporting data app to be enabled', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.status).toHaveText('Enabled');
    });

    await test.step('Disable the survey supporting data app', async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.statusToggle.click();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();

      await expect(surveyAdminPage.generalTab.status).toHaveText('Disabled');
    });

    await test.step('Enable the survey supporting data app', async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.statusToggle.click();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();
    });

    await test.step('Verify the survey supporting data app was enabled correctly', async () => {
      await expect(surveyAdminPage.generalTab.status).toHaveText('Enabled');
    });
  });

  test("Update a survey supporting data app's description", async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-699',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const updatedDescription = 'This is an updated description';
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app whose description will be updated', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.description).toHaveText('');
    });

    await test.step("Update the survey supporting data app's description", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.descriptionEditor).toHaveText('');

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.descriptionEditor.fill(updatedDescription);
      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's description was updated correctly", async () => {
      await expect(surveyAdminPage.generalTab.description).toHaveText(updatedDescription);
    });
  });

  test("Disable a survey supporting data app's content versioning", async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-700',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app whose content versioning will be disabled', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.contentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });

    await test.step("Disable the survey supporting data app's content versioning", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(
        surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionStatusSwitch
      ).toHaveAttribute('aria-checked', 'true');

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionStatusToggle.click();

      await expect(
        surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionStatusSwitch
      ).toHaveAttribute('aria-checked', 'false');

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionTypes).toBeHidden();

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's content versioning was disabled correctly", async () => {
      await expect(surveyAdminPage.generalTab.contentVersionStatus).toHaveText('Disabled');
    });
  });

  test("Enable a survey supporting data app's content versioning", async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-701',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app whose content versioning will be enabled', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.contentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });

    await test.step("Disable the survey supporting data app's content versioning", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionStatusToggle.click();
      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();
      await expect(surveyAdminPage.generalTab.contentVersionStatus).toHaveText('Disabled');
    });

    await test.step("Enable the survey supporting data app's content versioning", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(
        surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionStatusSwitch
      ).toHaveAttribute('aria-checked', 'false');

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionTypes).toBeHidden();

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionStatusToggle.click();

      await expect(
        surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionStatusSwitch
      ).toHaveAttribute('aria-checked', 'true');

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's content versioning was enabled correctly", async () => {
      await expect(surveyAdminPage.generalTab.contentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });
  });

  test("Change the save types of a survey supporting data app's content versioning", async ({
    adminHomePage,
    surveyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-702',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app whose content versioning will be changed', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.contentVersionStatus).toHaveText('Enabled - Direct User Saves');
    });

    await test.step("Change the survey supporting data app's content versioning", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(
        surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionStatusSwitch
      ).toHaveAttribute('aria-checked', 'true');

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.directUserSavesCheckbox).toBeChecked();

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.indirectUserSavesCheckbox.check();
      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.apiSavesCheckbox.check();
      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.systemSavesCheckbox.check();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.indirectUserSavesCheckbox).toBeChecked();
      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.apiSavesCheckbox).toBeChecked();
      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.systemSavesCheckbox).toBeChecked();

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's content versioning was changed correctly", async () => {
      await expect(surveyAdminPage.generalTab.contentVersionStatus).toHaveText(
        'Enabled - Direct User Saves, Indirect User Saves, API Saves, System Saves'
      );
    });
  });

  test("Disable a survey supporting data app's concurrent edit alert", async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-703',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app whose concurrent edit alert will be disabled', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Enabled');
    });

    await test.step("Disable the survey supporting data app's concurrent edit alert", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.concurrentEditAlertCheckbox).toBeChecked();

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.concurrentEditAlertCheckbox.uncheck();

      await expect(
        surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.concurrentEditAlertCheckbox
      ).not.toBeChecked();

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's concurrent edit alert was disabled correctly", async () => {
      await expect(surveyAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Disabled');
    });
  });

  test("Enable a survey supporting data app's concurrent edit alert", async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-704',
    });

    const appName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(appName);

    await test.step('Create the survey supporting data app whose concurrent edit alert will be enabled', async () => {
      await adminHomePage.createSurvey(appName);
      await expect(surveyAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Enabled');
    });

    await test.step("Disable the survey supporting data app's concurrent edit alert", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.concurrentEditAlertCheckbox.uncheck();
      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();
      await expect(surveyAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Disabled');
    });

    await test.step("Enable the survey supporting data app's concurrent edit alert", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(
        surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.concurrentEditAlertCheckbox
      ).not.toBeChecked();

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.concurrentEditAlertCheckbox.check();

      await expect(surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.concurrentEditAlertCheckbox).toBeChecked();

      await surveyAdminPage.generalTab.editSurveyGeneralSettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's concurrent edit alert was enabled correctly", async () => {
      await expect(surveyAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Enabled');
    });
  });

  test("Update a survey supporting data's display link field", async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-705',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app whose display link field will be updated', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.displayLink).toHaveText('Record Id');
    });

    await test.step("Update the survey supporting data app's display link field", async () => {
      await surveyAdminPage.generalTab.editDisplaySettingsLink.click();
      await surveyAdminPage.generalTab.editSurveyDisplaySettingsModal.displayLinkSelect.click();
      await surveyAdminPage.page.getByRole('option', { name: 'Created Date' }).click();
      await surveyAdminPage.generalTab.editSurveyDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's display link field was updated correctly", async () => {
      await expect(surveyAdminPage.generalTab.displayLink).toHaveText('Created Date');
    });
  });

  test("Update a survey supporting data app's integration link field", async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-706',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app whose integration link field will be updated', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.integrationLink).toHaveText('Record Id');
    });

    await test.step("Update the survey supporting data app's integration link field", async () => {
      await surveyAdminPage.generalTab.editDisplaySettingsLink.click();
      await surveyAdminPage.generalTab.editSurveyDisplaySettingsModal.integrationLinkSelect.click();
      await surveyAdminPage.page.getByRole('option', { name: 'Created Date' }).click();
      await surveyAdminPage.generalTab.editSurveyDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's integration link field was updated correctly", async () => {
      await expect(surveyAdminPage.generalTab.integrationLink).toHaveText('Created Date');
    });
  });

  test("Update a survey supporting data app's display fields", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-707',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's primary sort field", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-708',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's secondary sort field", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-709',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Change a survey supporting data app's administration permissions to private", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-710',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Give survey supporting data app administration permissions to specific users', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-711',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Give survey supporting data app administration permissions to specific roles', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-712',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Give survey supporting data app administration permissions to specific groups', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-713',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Change a survey supporting data app's administration permissions to public", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-714',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Enable geocoding for a survey supporting data app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-715',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's geocoding field mapping", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-716',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Disable geocoding for a survey supporting data app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-717',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's survey notes", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-718',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Delete a survey supporting data app', async ({ adminHomePage, surveysAdminPage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-865',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const surveyRow = surveysAdminPage.surveyGrid.getByRole('row', { name: surveyName }).first();
    const surveyDeleteButton = surveyRow.getByTitle('Delete Survey');

    await test.step('Navigate to the Surveys admin page', async () => {
      adminHomePage.surveyTileLink.click();
    });

    await test.step('Create the survey supporting data app to be deleted', async () => {
      await surveysAdminPage.createSurvey(surveyName);
      await surveyAdminPage.page.waitForLoadState();
      await surveyAdminPage.closeButton.click();
    });

    await test.step('Navigate to the surveys admin page', async () => {
      await surveysAdminPage.goto();
      await expect(surveyRow).toBeVisible();
    });

    await test.step('Delete the survey supporting data app', async () => {
      await surveyRow.hover();

      await surveyDeleteButton.click();

      await expect(surveysAdminPage.deleteSurveyDialog.confirmationInput).toBeVisible();

      await surveysAdminPage.deleteSurveyDialog.confirmationInput.pressSequentially('OK', {
        delay: 100,
      });

      await expect(surveysAdminPage.deleteSurveyDialog.confirmationInput).toHaveValue('OK');
      await expect(surveysAdminPage.deleteSurveyDialog.deleteButton).toBeEnabled();

      await surveysAdminPage.deleteSurveyDialog.deleteButton.click();
      await surveysAdminPage.deleteSurveyDialog.waitForDialogToBeDismissed();
      await surveysAdminPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify the survey supporting data app was deleted', async () => {
      await expect(surveyRow).not.toBeAttached();
    });
  });
});
