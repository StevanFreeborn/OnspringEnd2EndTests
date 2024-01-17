import { test as teardown } from '../fixtures';
import { SurveysAdminPage } from '../pageObjectModels/surveys/surveysAdminPage';

teardown('delete all surveys created as part of tests', async ({ sysAdminPage }) => {
  var surveysAdminPage = new SurveysAdminPage(sysAdminPage);
});
