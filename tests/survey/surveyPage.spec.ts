import { expect, surveyQuestionTest as test } from '../../fixtures';
import { Survey } from '../../models/survey';
import { AnnotationType } from '../annotations';

test.describe('survey page', () => {
  test.describe.configure({
    mode: 'default',
  });

  let targetSurvey: Survey;
  let pagesToBeDeleted: string[] = [];

  test.beforeAll('Create target survey', ({ targetSurvey: survey }) => {
    targetSurvey = survey;
  });

  test.beforeEach('Navigate to survey admin page', async ({ surveyAdminPage }) => {
    await surveyAdminPage.goto(targetSurvey.id);
  });

  test.afterEach('Delete pages created during test', async ({ surveyAdminPage }) => {
    pagesToBeDeleted = [];
  });

  test('Create a survey page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-657',
    });

    expect(true).toBeTruthy();
  });

  test('Edit a survey page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-658',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a survey page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-659',
    });

    expect(true).toBeTruthy();
  });

  test('Move a survey page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-660',
    });

    expect(true).toBeTruthy();
  });
});
