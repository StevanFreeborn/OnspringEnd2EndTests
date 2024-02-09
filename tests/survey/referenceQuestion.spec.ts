import { DeleteQuestionRequest } from '../../componentObjectModels/modals/surveyDesignerModal';
import { surveyQuestionTest as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { Survey } from '../../models/survey';
import { AnnotationType } from '../annotations';

type ReferenceQuestionTest = {
  referencedApp: App;
};

const test = base.extend<ReferenceQuestionTest>({
  referencedApp: app,
});

test.describe('reference question', () => {
  test.describe.configure({
    mode: 'default',
  });

  let targetSurvey: Survey;
  let referencedApp: App;
  let surveyItemsToBeDeleted: DeleteQuestionRequest[] = [];

  test.beforeAll('Create target survey', ({ targetSurvey: survey, referencedApp: app }) => {
    targetSurvey = survey;
    referencedApp = app;
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

  test('Create a reference question question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-587',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of a reference question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-588',
    });

    expect(true).toBe(true);
  });

  test('Import a reference question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-589',
    });

    expect(true).toBe(true);
  });

  test('Update a reference question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-590',
    });

    expect(true).toBe(true);
  });

  test('Move a reference question on a page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-591',
    });

    expect(true).toBe(true);
  });

  test('Move a reference question to another page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-592',
    });

    expect(true).toBe(true);
  });

  test('Delete a reference question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-593',
    });

    expect(true).toBe(true);
  });
});
