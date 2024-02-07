import { DeleteQuestionRequest } from '../../componentObjectModels/modals/surveyDesignerModal';
import { expect, surveyQuestionTest as test } from '../../fixtures';
import { Survey } from '../../models/survey';
import { AnnotationType } from '../annotations';

test.describe('matrix question', () => {
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

  test('Create a matrix question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-552',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of a matrix question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-553',
    });

    expect(true).toBe(true);
  });

  test('Import a matrix question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-554',
    });

    expect(true).toBe(true);
  });

  test('Update a matrix question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-555',
    });

    expect(true).toBe(true);
  });

  test('Move a matrix question on a page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-556',
    });

    expect(true).toBe(true);
  });

  test('Move a matrix question to another page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-557',
    });

    expect(true).toBe(true);
  });

  test('Delete a matrix question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-558',
    });

    expect(true).toBe(true);
  });
});
