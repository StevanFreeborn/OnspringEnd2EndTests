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

  test('Edit a survey page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-658',
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    const updatedPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });
    pagesToBeDeleted.push(updatedPage.name);

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

    await test.step('Update page 2', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.updatePage(newPage.name, updatedPage);
    });

    await test.step('Preview the survey and verify that the updated page 2 is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      await previewPage.nextButton.click();

      await expect(previewPage.pageSelect).toHaveText(updatedPage.name);
    });
  });

  test('Delete a survey page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-659',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const question = new TextQuestion({
      questionId: questionId,
      questionText: questionId,
    });
    let surveyItemId: string;

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a question to page 1', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(question);
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

    await test.step('Delete page 2', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.deletePage(newPage.name);
    });

    await test.step('Preview the survey and verify that page 1 is not present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const addedQuestion = previewPage.getQuestion(surveyItemId, question.questionText);

      await expect(previewPage.pageSelect).toBeHidden();
      await expect(addedQuestion).toBeVisible();
    });
  });

  test('Move a survey page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-660',
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

    await test.step('Move page 2 to be the first page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.movePageAbove(newPage.name, 'Page 1');
    });

    await test.step('Preview the survey and verify that page 2 is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();

      await expect(previewPage.pageSelect).toHaveText(newPage.name);
    });
  });
});
