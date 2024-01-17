import fs from 'fs';
import { test as teardown } from '../fixtures';
import { SurveysAdminPage } from '../pageObjectModels/surveys/surveysAdminPage';
import { AUTH_DIR } from '../playwright.config';

teardown.describe.configure({ mode: 'default' });

teardown.describe('global teardown', () => {
  teardown('delete all surveys created as part of tests', async ({ sysAdminPage }) => {
    var surveysAdminPage = new SurveysAdminPage(sysAdminPage);

    await surveysAdminPage.goto();

    const surveyRow = surveysAdminPage.surveyGrid.getByRole('row', { name: /survey-test/i }).first();
    let isVisible = await surveyRow.isVisible();

    while (isVisible) {
      await surveyRow.hover();
      await surveyRow.getByTitle('Delete Survey').click();
      await surveysAdminPage.deleteSurveyDialog.confirmationInput.pressSequentially('OK', {
        delay: 100,
      });

      const deleteResponse = surveysAdminPage.page.waitForResponse(/\/Admin\/Survey\/\d+\/Delete/);
      const refreshListResponse = surveysAdminPage.page.waitForResponse(/\/Admin\/Survey\/SurveyListRead/);

      await surveysAdminPage.deleteSurveyDialog.deleteButton.click();

      await deleteResponse;
      await refreshListResponse;

      isVisible = await surveyRow.isVisible();
    }
  });

  teardown('remove saved auth states', async () => {
    fs.rmSync(AUTH_DIR, { recursive: true, force: true });
  });
});
