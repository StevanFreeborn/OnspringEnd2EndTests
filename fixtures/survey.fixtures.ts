import { Page } from '@playwright/test';
import { FakeDataFactory } from '../factories/fakeDataFactory';
import { Survey } from '../models/survey';
import { AdminHomePage } from '../pageObjectModels/adminHomePage';
import { SurveyAdminPage } from '../pageObjectModels/surveys/surveyAdminPage';
import { SurveysAdminPage } from '../pageObjectModels/surveys/surveysAdminPage';

export async function survey({ sysAdminPage }: { sysAdminPage: Page }, use: (r: Survey) => Promise<void>) {
  const adminHomePage = new AdminHomePage(sysAdminPage);
  const surveysAdminPage = new SurveysAdminPage(sysAdminPage);
  const surveyAdminPage = new SurveyAdminPage(sysAdminPage);
  const surveyName = FakeDataFactory.createFakeSurveyName();

  await adminHomePage.goto();
  await adminHomePage.createSurvey(surveyName);
  await adminHomePage.page.waitForURL(surveyAdminPage.pathRegex);
  const surveyId = surveyAdminPage.getIdFromUrl();
  const survey = new Survey({ id: surveyId, name: surveyName });

  await use(survey);

  await surveysAdminPage.deleteSurveys([surveyName]);
}
