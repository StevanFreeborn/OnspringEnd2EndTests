import { DeleteQuestionRequest } from '../../componentObjectModels/modals/surveyDesignerModal';
import { Survey } from '../../models/survey';
import { AnnotationType } from '../annotations';
import { expect, surveyQuestionTest as test } from './../../fixtures/index';

test.describe('likert question', () => {
  test.describe.configure({
    mode: 'default',
  });

  let targetSurvey: Survey;
  let surveyItemsToBeDeleted: DeleteQuestionRequest[] = [];

  test.beforeAll('Create target survey', ({ targetSurvey: survey }) => {
    targetSurvey = survey;
  });

  test.beforeEach('Navigate to survey admin page', async ({ surveyAdminPage }) => {
    await surveyAdminPage.goto(targetSurvey.id);
  });

  test.afterEach('Delete questions created during the test', async ({ surveyAdminPage }) => {
    await surveyAdminPage.goto(targetSurvey.id);
    await surveyAdminPage.designTabButton.click();
    await surveyAdminPage.designTab.openSurveyDesigner();

    for (const itemToBeDeleted of surveyItemsToBeDeleted) {
      await surveyAdminPage.designTab.surveyDesignerModal.deleteQuestion({
        surveyItemId: itemToBeDeleted.surveyItemId,
        pageName: itemToBeDeleted.pageName,
      });
    }

    surveyItemsToBeDeleted = [];
  });

  test('Create a likert scale question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-542',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of a likert scale question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-543',
    });

    expect(true).toBe(true);
  });

  test('Import a likert scale question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-544',
    });

    expect(true).toBe(true);
  });

  test('Update a likert scale question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-545',
    });

    expect(true).toBe(true);
  });

  test('Move a likert scale question on a page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-546',
    });

    expect(true).toBe(true);
  });

  test('Move a likert scale question to another page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-547',
    });

    expect(true).toBe(true);
  });

  test('Delete a likert scale question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-548',
    });

    expect(true).toBe(true);
  });
});
