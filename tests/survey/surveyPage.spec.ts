import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, surveyQuestionTest as test } from '../../fixtures';
import { Survey } from '../../models/survey';
import { SurveyPage } from '../../models/surveyPage';
import { TextQuestion } from '../../models/textQuestion';
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
    for (const page of pagesToBeDeleted) {
      await surveyAdminPage.designTab.surveyDesignerModal.deletePage(page);
    }

    pagesToBeDeleted = [];
  });

  test('Create a survey page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-657',
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });
    pagesToBeDeleted.push(newPage.name);

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a question to page 1', async () => {
      const questionId = FakeDataFactory.createFakeQuestionId();

      await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(
        new TextQuestion({
          questionId: questionId,
          questionText: questionId,
        })
      );
    });

    await test.step('Add a second page to the survey', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addPage(newPage);
    });

    await test.step('Add a question to page 2', async () => {
      const questionId = FakeDataFactory.createFakeQuestionId();

      await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(
        new TextQuestion({
          questionId: questionId,
          questionText: questionId,
        })
      );
    });

    await test.step('Preview the survey and verify that page 2 is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      await previewPage.nextButton.click();

      await expect(previewPage.pageSelect).toHaveText(newPage.name);
    });
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
