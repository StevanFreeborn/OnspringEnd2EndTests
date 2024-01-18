import { test as teardown } from '../fixtures';
import { SurveysAdminPage } from '../pageObjectModels/surveys/surveysAdminPage';

const THIRTY_MINUTES = 30 * 60 * 1000;

teardown.setTimeout(THIRTY_MINUTES);

teardown.describe('cleanup', () => {
  teardown('delete all surveys created as part of tests', async ({ sysAdminPage }) => {
    await new SurveysAdminPage(sysAdminPage).deleteAllTestSurveys();
  });
});
