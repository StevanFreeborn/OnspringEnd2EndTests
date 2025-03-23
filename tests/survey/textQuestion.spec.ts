import { DeleteQuestionRequest } from '../../componentObjectModels/modals/surveyDesignerModal';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, surveyQuestionTest as test } from '../../fixtures';
import { Survey } from '../../models/survey';
import { SurveyPage } from '../../models/surveyPage';
import { TextQuestion } from '../../models/textQuestion';
import { AnnotationType } from '../annotations';

test.describe('text question', () => {
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

  test('Create a text question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-661',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const textQuestion = new TextQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a text question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(textQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemId });
    });

    await test.step('Preview the survey and confirm the text question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(surveyItemId, textQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Create a copy of a text question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-662',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const textQuestion = new TextQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    let surveyItemId: string;
    let surveyItemIdCopy: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a text question to copy', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(textQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemId });
    });

    await test.step('Copy the text question', async () => {
      surveyItemIdCopy = await surveyAdminPage.designTab.surveyDesignerModal.copyQuestion(
        surveyItemId,
        textQuestion.questionText
      );
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemIdCopy });
    });

    await test.step('Preview the survey and confirm the copied text question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const copiedQuestion = previewPage.getQuestion(surveyItemId, textQuestion.questionText);
      const questionCopy = previewPage.getQuestion(surveyItemIdCopy, textQuestion.questionText);

      await expect(copiedQuestion).toBeVisible();
      await expect(questionCopy).toBeVisible();
    });
  });

  test('Import a text question', async ({ sourceSurvey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-663',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceTextQuestion = new TextQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    let questionCreatedViaImport: string;

    await test.step("Navigate to the source survey's admin page", async () => {
      await surveyAdminPage.goto(sourceSurvey.id);
    });

    await test.step("Open the source survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a text question to the source survey', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(sourceTextQuestion);
    });

    await test.step("Navigate to the target survey's admin page", async () => {
      await surveyAdminPage.goto(targetSurvey.id);
    });

    await test.step("Open the target survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Import the text question into the target survey', async () => {
      questionCreatedViaImport = await surveyAdminPage.designTab.surveyDesignerModal.importQuestion(
        sourceSurvey.name,
        sourceTextQuestion
      );
      surveyItemsToBeDeleted.push({ surveyItemId: questionCreatedViaImport });
    });

    await test.step('Preview the target survey and confirm the text question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(questionCreatedViaImport, sourceTextQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Update a text question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-664',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const textQuestion = new TextQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    const updatedQuestion = { ...textQuestion, questionText: `${textQuestion.questionText} updated` };

    let createdQuestionItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create the text question to update', async () => {
      createdQuestionItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(textQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId: createdQuestionItemId });
    });

    await test.step('Update the text question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.updateQuestion(createdQuestionItemId, updatedQuestion);
    });

    await test.step('Preview the survey and confirm the updated text question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const updatedQuestionElement = previewPage.getQuestion(createdQuestionItemId, updatedQuestion.questionText);
      await expect(updatedQuestionElement).toBeVisible();
    });
  });

  test('Move a text question on a page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-665',
    });

    const textQuestions = [
      new TextQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Text Question 1',
      }),
      new TextQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Text Question 2',
      }),
    ];

    const surveyItemIds: string[] = [];

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create text questions', async () => {
      for (const textQuestion of textQuestions) {
        const surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(textQuestion);
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({ surveyItemId: surveyItemId });
      }
    });

    await test.step('Move the second text question above the first text question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]);
    });

    await test.step('Preview the survey and confirm the second text question is displayed above the first text question', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const isAbove = await previewPage.questionIsAbove(surveyItemIds[1], surveyItemIds[0]);

      expect(isAbove).toBe(true);
    });
  });

  test('Move a text question to another page.', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-666',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const textQuestion = new TextQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create a text question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(textQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemId, pageName: newPage.name });
    });

    await test.step('Create a new survey page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addPage(newPage);
    });

    await test.step('Move the text question to the new page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.goToPage(firstPageName);
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionToPage(surveyItemId, newPage.name);
    });

    await test.step('Preview the survey and confirm the text question is on the new page', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();

      await previewPage.nextButton.waitFor();
      await previewPage.nextButton.click();

      const question = previewPage.getQuestion(surveyItemId, textQuestion.questionText);
      await expect(question).toBeVisible();
    });
  });

  test('Delete a text question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-667',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const textQuestion = new TextQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a text question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(textQuestion);
    });

    await test.step('Delete the text question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.deleteQuestion({
        surveyItemId: surveyItemId,
        questionText: textQuestion.questionText,
      });
    });

    await test.step('Preview the survey and confirm the text question is not present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const question = previewPage.getQuestion(surveyItemId, textQuestion.questionText);
      await expect(question).toBeHidden();
    });
  });
});
