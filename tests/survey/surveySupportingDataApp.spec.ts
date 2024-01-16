import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { UserFactory } from '../../factories/userFactory';
import { test as base, expect } from '../../fixtures';
import { Role } from '../../models/role';
import { UserStatus } from '../../models/user';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AddGroupAdminPage } from '../../pageObjectModels/groups/addGroupAdminPage';
import { EditGroupAdminPage } from '../../pageObjectModels/groups/editGroupAdminPage';
import { GroupsSecurityAdminPage } from '../../pageObjectModels/groups/groupsSecurityAdminPage';
import { AddRoleAdminPage } from '../../pageObjectModels/roles/addRoleAdminPage';
import { EditRoleAdminPage } from '../../pageObjectModels/roles/editRoleAdminPage';
import { RolesSecurityAdminPage } from '../../pageObjectModels/roles/rolesSecurityAdminPage';
import { SurveyAdminPage } from '../../pageObjectModels/surveys/surveyAdminPage';
import { SurveysAdminPage } from '../../pageObjectModels/surveys/surveysAdminPage';
import { AddUserAdminPage } from '../../pageObjectModels/users/addUserAdminPage';
import { EditUserAdminPage } from '../../pageObjectModels/users/editUserAdminPage';
import { UsersSecurityAdminPage } from '../../pageObjectModels/users/usersSecurityAdminPage';
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

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.nameInput).toHaveValue(surveyName);

      await surveyAdminPage.generalTab.editGeneralSettingsModal.nameInput.fill(updatedSurveyName);
      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
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

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await surveyAdminPage.generalTab.editGeneralSettingsModal.statusToggle.click();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
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

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await surveyAdminPage.generalTab.editGeneralSettingsModal.statusToggle.click();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();

      await expect(surveyAdminPage.generalTab.status).toHaveText('Disabled');
    });

    await test.step('Enable the survey supporting data app', async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await surveyAdminPage.generalTab.editGeneralSettingsModal.statusToggle.click();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.statusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
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

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.descriptionEditor).toHaveText('');

      await surveyAdminPage.generalTab.editGeneralSettingsModal.descriptionEditor.fill(updatedDescription);
      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
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

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusToggle.click();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionTypes).toBeHidden();

      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
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
      await surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusToggle.click();
      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
      await expect(surveyAdminPage.generalTab.contentVersionStatus).toHaveText('Disabled');
    });

    await test.step("Enable the survey supporting data app's content versioning", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'false'
      );

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionTypes).toBeHidden();

      await surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusToggle.click();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
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

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionStatusSwitch).toHaveAttribute(
        'aria-checked',
        'true'
      );

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.contentVersionTypes).toBeVisible();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.directUserSavesCheckbox).toBeChecked();

      await surveyAdminPage.generalTab.editGeneralSettingsModal.indirectUserSavesCheckbox.check();
      await surveyAdminPage.generalTab.editGeneralSettingsModal.apiSavesCheckbox.check();
      await surveyAdminPage.generalTab.editGeneralSettingsModal.systemSavesCheckbox.check();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.indirectUserSavesCheckbox).toBeChecked();
      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.apiSavesCheckbox).toBeChecked();
      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.systemSavesCheckbox).toBeChecked();

      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
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

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertCheckbox).toBeChecked();

      await surveyAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertCheckbox.uncheck();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertCheckbox).not.toBeChecked();

      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
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

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app whose concurrent edit alert will be enabled', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Enabled');
    });

    await test.step("Disable the survey supporting data app's concurrent edit alert", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();
      await surveyAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertCheckbox.uncheck();
      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
      await expect(surveyAdminPage.generalTab.concurrentEditAlertStatus).toHaveText('Disabled');
    });

    await test.step("Enable the survey supporting data app's concurrent edit alert", async () => {
      await surveyAdminPage.generalTab.editGeneralSettingsLink.click();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertCheckbox).not.toBeChecked();

      await surveyAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertCheckbox.check();

      await expect(surveyAdminPage.generalTab.editGeneralSettingsModal.concurrentEditAlertCheckbox).toBeChecked();

      await surveyAdminPage.generalTab.editGeneralSettingsModal.saveButton.click();
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
      await surveyAdminPage.generalTab.editDisplaySettingsModal.displayLinkSelect.click();
      await surveyAdminPage.page.getByRole('option', { name: 'Created Date' }).click();
      await surveyAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
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
      await surveyAdminPage.generalTab.editDisplaySettingsModal.integrationLinkSelect.click();
      await surveyAdminPage.page.getByRole('option', { name: 'Created Date' }).click();
      await surveyAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's integration link field was updated correctly", async () => {
      await expect(surveyAdminPage.generalTab.integrationLink).toHaveText('Created Date');
    });
  });

  test("Update a survey supporting data app's display fields", async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-707',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app whose display fields will be updated', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.displayFields).toHaveText('Record Id');
    });

    await test.step("Update the survey supporting data app's display fields", async () => {
      await surveyAdminPage.generalTab.editDisplaySettingsLink.click();
      await surveyAdminPage.generalTab.editDisplaySettingsModal.addDisplayField('Created Date');
      await surveyAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's display fields were updated correctly", async () => {
      await expect(surveyAdminPage.generalTab.displayFields).toHaveText(/Record Id/);
      await expect(surveyAdminPage.generalTab.displayFields).toHaveText(/Created Date/);
    });
  });

  test("Update a survey supporting data app's primary sort field", async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-708',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app whose primary sort field will be updated', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.sort).toHaveText('None');
    });

    await test.step("Update the survey supporting data app's primary sort field", async () => {
      await surveyAdminPage.generalTab.editDisplaySettingsLink.click();
      await surveyAdminPage.generalTab.editDisplaySettingsModal.selectPrimarySortField('Record Id');

      await expect(surveyAdminPage.generalTab.editDisplaySettingsModal.primarySortDirectionSelect).toBeVisible();
      await expect(surveyAdminPage.generalTab.editDisplaySettingsModal.primarySortDirectionSelect).toHaveText(
        'Ascending'
      );

      await surveyAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's primary sort field was updated correctly", async () => {
      await expect(surveyAdminPage.generalTab.sort).toHaveText('Record Id (Ascending)');
    });
  });

  test("Update a survey supporting data app's secondary sort field", async ({ adminHomePage, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-709',
    });

    const appName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(appName);

    await test.step('Create the survey supporting data app whose secondary sort field will be updated', async () => {
      await adminHomePage.createSurvey(appName);
      await expect(surveyAdminPage.generalTab.sort).toHaveText('None');
    });

    await test.step("Update the survey supporting data app's secondary sort field", async () => {
      await surveyAdminPage.generalTab.editDisplaySettingsLink.click();
      await surveyAdminPage.generalTab.editDisplaySettingsModal.addDisplayField('Created Date');
      await surveyAdminPage.generalTab.editDisplaySettingsModal.selectPrimarySortField('Record Id');

      await surveyAdminPage.generalTab.editDisplaySettingsModal.selectSecondarySortField('Created Date');

      await expect(surveyAdminPage.generalTab.editDisplaySettingsModal.secondarySortDirectionSelect).toBeVisible();
      await expect(surveyAdminPage.generalTab.editDisplaySettingsModal.secondarySortDirectionSelect).toHaveText(
        'Ascending'
      );

      await surveyAdminPage.generalTab.editDisplaySettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's secondary sort field was updated correctly", async () => {
      await expect(surveyAdminPage.generalTab.sort).toHaveText(/Record Id \(Ascending\)/);
      await expect(surveyAdminPage.generalTab.sort).toHaveText(/Created Date \(Ascending\)/);
    });
  });

  test("Change a survey supporting data app's administration permissions to private", async ({
    adminHomePage,
    surveyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-710',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey supporting data app whose administration permissions will be changed', async () => {
      await adminHomePage.createSurvey(surveyName);
      await expect(surveyAdminPage.generalTab.adminPermissions).toHaveText('Public');
    });

    await test.step("Change the survey supporting data app's administration permissions to private", async () => {
      await surveyAdminPage.generalTab.editAdminSettingsLink.click();
      await surveyAdminPage.generalTab.editAdminSettingsModal.selectAdminPermissions('Private');

      await expect(surveyAdminPage.generalTab.editAdminSettingsModal.usersSelect).toBeVisible();
      await expect(surveyAdminPage.generalTab.editAdminSettingsModal.groupsSelect).toBeVisible();
      await expect(surveyAdminPage.generalTab.editAdminSettingsModal.rolesSelect).toBeVisible();

      await surveyAdminPage.generalTab.editAdminSettingsModal.saveButton.click();
    });

    await test.step("Verify survey supporting data app's administration permissions were set to private", async () => {
      await expect(surveyAdminPage.generalTab.adminPermissions).toHaveText('Private');
    });
  });

  test('Give survey supporting data app administration permissions to specific users', async ({
    sysAdminPage,
    adminHomePage,
    surveyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-711',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const newUser = UserFactory.createNewUser(UserStatus.Inactive);
    surveysToDelete.push(surveyName);
    const usersToDelete = [newUser.username];

    await test.step('Create user that will be given admin permissions', async () => {
      const addUserAdminPage = new AddUserAdminPage(sysAdminPage);
      const editUserAdminPage = new EditUserAdminPage(sysAdminPage);
      await addUserAdminPage.addUser(newUser);
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
    });

    await test.step('Create the survey supporting data app whose administration permissions will be changed', async () => {
      await adminHomePage.createSurvey(surveyName);
    });

    await test.step('Give survey supporting data app admin permissions to user', async () => {
      await surveyAdminPage.generalTab.editAdminSettingsLink.click();
      await surveyAdminPage.generalTab.editAdminSettingsModal.selectAdminPermissions('Private');

      await expect(surveyAdminPage.generalTab.editAdminSettingsModal.usersSelect).toBeVisible();

      await surveyAdminPage.generalTab.editAdminSettingsModal.selectUser(newUser.fullName);
      await surveyAdminPage.generalTab.editAdminSettingsModal.saveButton.click();
    });

    await test.step('Verify survey supporting data app admin permissions were given to user', async () => {
      await expect(surveyAdminPage.generalTab.adminPermissions).toHaveText('Private');
      await expect(surveyAdminPage.generalTab.adminUsers).toHaveText(newUser.fullName);
    });

    await test.step('Delete user', async () => {
      const usersSecurityAdminPage = new UsersSecurityAdminPage(sysAdminPage);
      await usersSecurityAdminPage.deleteUsers(usersToDelete);
    });
  });

  test('Give survey supporting data app administration permissions to specific roles', async ({
    sysAdminPage,
    adminHomePage,
    surveyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-712',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const roleName = FakeDataFactory.createFakeRoleName();
    surveysToDelete.push(surveyName);
    const rolesToDelete = [roleName];

    await test.step('Create role that will be given admin permissions', async () => {
      const addRoleAdminPage = new AddRoleAdminPage(sysAdminPage);
      const editRoleAdminPage = new EditRoleAdminPage(sysAdminPage);
      await addRoleAdminPage.addRole(new Role({ name: roleName }));
      await addRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
    });

    await test.step('Create the survey supporting data app whose administration permissions will be changed', async () => {
      await adminHomePage.createSurvey(surveyName);
    });

    await test.step('Give survey supporting data app admin permissions to role', async () => {
      await surveyAdminPage.generalTab.editAdminSettingsLink.click();
      await surveyAdminPage.generalTab.editAdminSettingsModal.selectAdminPermissions('Private');

      await expect(surveyAdminPage.generalTab.editAdminSettingsModal.rolesSelect).toBeVisible();

      await surveyAdminPage.generalTab.editAdminSettingsModal.selectRole(roleName);
      await surveyAdminPage.generalTab.editAdminSettingsModal.saveButton.click();
    });

    await test.step('Verify survey supporting data app admin permissions were given to role', async () => {
      await expect(surveyAdminPage.generalTab.adminPermissions).toHaveText('Private');
      await expect(surveyAdminPage.generalTab.adminRoles).toHaveText(roleName);
    });

    await test.step('Delete role', async () => {
      const roleSecurityAdminPage = new RolesSecurityAdminPage(sysAdminPage);
      await roleSecurityAdminPage.deleteRoles(rolesToDelete);
    });
  });

  test('Give survey supporting data app administration permissions to specific groups', async ({
    sysAdminPage,
    adminHomePage,
    surveyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-713',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    const groupName = FakeDataFactory.createFakeGroupName();
    surveysToDelete.push(surveyName);
    const groupsToDelete = [groupName];

    await test.step('Create group that will be given admin permissions', async () => {
      const addGroupAdminPage = new AddGroupAdminPage(sysAdminPage);
      const editGroupAdminPage = new EditGroupAdminPage(sysAdminPage);
      await addGroupAdminPage.addGroup(groupName);
      await addGroupAdminPage.page.waitForURL(editGroupAdminPage.pathRegex);
    });

    await test.step('Create the survey supporting data app whose administration permissions will be changed', async () => {
      await adminHomePage.createSurvey(surveyName);
    });

    await test.step('Give survey supporting data app admin permissions to group', async () => {
      await surveyAdminPage.generalTab.editAdminSettingsLink.click();
      await surveyAdminPage.generalTab.editAdminSettingsModal.selectAdminPermissions('Private');

      await expect(surveyAdminPage.generalTab.editAdminSettingsModal.groupsSelect).toBeVisible();

      await surveyAdminPage.generalTab.editAdminSettingsModal.selectGroup(groupName);
      await surveyAdminPage.generalTab.editAdminSettingsModal.saveButton.click();
    });

    await test.step('Verify survey supporting data app admin permissions were given to group', async () => {
      await expect(surveyAdminPage.generalTab.adminPermissions).toHaveText('Private');
      await expect(surveyAdminPage.generalTab.adminGroups).toHaveText(groupName);
    });

    await test.step('Delete group', async () => {
      const groupSecurityAdminPage = new GroupsSecurityAdminPage(sysAdminPage);
      await groupSecurityAdminPage.deleteGroups(groupsToDelete);
    });
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
