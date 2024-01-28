import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, surveyQuestionTest as test } from '../../fixtures';
import { NumberQuestion } from '../../models/numberQuestion';
import { SurveyPage } from '../../models/surveyPage';
import { AnnotationType } from '../annotations';

test.describe('number question', () => {
  test('Create a number question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-566',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const numberQuestion = new NumberQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    let surveyItemId: string;

    await test.step('Navigate to survey admin page', async () => {
      await surveyAdminPage.goto(survey.id);
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a number question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(numberQuestion);
    });

    await test.step('Preview the survey and confirm the number question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(surveyItemId, numberQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Create a copy of a number question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-567',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const numberQuestion = new NumberQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    let surveyItemId: string;
    let surveyItemIdCopy: string;

    await test.step('Navigate to survey admin page', async () => {
      await surveyAdminPage.goto(survey.id);
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a number question to copy', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(numberQuestion);
    });

    await test.step('Copy the number question', async () => {
      surveyItemIdCopy = await surveyAdminPage.designTab.surveyDesignerModal.copyQuestion(
        surveyItemId,
        numberQuestion.questionText
      );
    });

    await test.step('Preview the survey and confirm the copied number question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const copiedQuestion = previewPage.getQuestion(surveyItemId, numberQuestion.questionText);
      const questionCopy = previewPage.getQuestion(surveyItemIdCopy, numberQuestion.questionText);

      await expect(copiedQuestion).toBeVisible();
      await expect(questionCopy).toBeVisible();
    });
  });

  test('Import a number question', async ({ sourceSurvey, targetSurvey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-568',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceNumberQuestion = new NumberQuestion({
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

    await test.step('Add a number question to the source survey', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(sourceNumberQuestion);
    });

    await test.step("Navigate to the target survey's admin page", async () => {
      await surveyAdminPage.goto(targetSurvey.id);
    });

    await test.step("Open the target survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Import the number question into the target survey', async () => {
      questionCreatedViaImport = await surveyAdminPage.designTab.surveyDesignerModal.importQuestion(
        sourceSurvey.name,
        sourceNumberQuestion
      );
    });

    await test.step('Preview the target survey and confirm the number question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(questionCreatedViaImport, sourceNumberQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Update a number question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-569',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const numberQuestion = new NumberQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    const updatedQuestion = { ...numberQuestion, questionText: `${numberQuestion.questionText} updated` };

    let createdQuestionItemId: string;

    await test.step('Navigate to survey admin page', async () => {
      await surveyAdminPage.goto(survey.id);
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create the number question to update', async () => {
      createdQuestionItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(numberQuestion);
    });

    await test.step('Update the number question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.updateQuestion(createdQuestionItemId, updatedQuestion);
    });

    await test.step('Preview the survey and confirm the updated number question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const updatedQuestionElement = previewPage.getQuestion(createdQuestionItemId, updatedQuestion.questionText);
      await expect(updatedQuestionElement).toBeVisible();
    });
  });

  test('Move a number question on a page', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-570',
    });

    const numberQuestions = [
      new NumberQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Number Question 1',
      }),
      new NumberQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Number Question 2',
      }),
    ];

    let surveyItemIds: string[] = [];

    await test.step('Navigate to survey admin page', async () => {
      await surveyAdminPage.goto(survey.id);
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create number questions', async () => {
      for (const numberQuestion of numberQuestions) {
        const surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(numberQuestion);
        surveyItemIds.push(surveyItemId);
      }
    });

    await test.step('Move the second number question above the first number question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]);
    });

    await test.step('Preview the survey and confirm the second number question is displayed above the first number question', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const isAbove = await previewPage.questionIsAbove(surveyItemIds[1], surveyItemIds[0]);

      expect(isAbove).toBe(true);
    });
  });

  test('Move a number question to another page.', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-571',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const numberQuestion = new NumberQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    let surveyItemId: string;

    await test.step('Navigate to survey admin page', async () => {
      await surveyAdminPage.goto(survey.id);
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create a number question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(numberQuestion);
    });

    await test.step('Create a new survey page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addPage(newPage);
    });

    await test.step('Move the number question to the new page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.goToPage(firstPageName);
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionToPage(surveyItemId, newPage.name);
    });

    await test.step('Preview the survey and confirm the number question is on the new page', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      await previewPage.nextButton.click();

      const question = previewPage.getQuestion(surveyItemId, numberQuestion.questionText);
      await expect(question).toBeVisible();
    });
  });

  test('Delete a number question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-572',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const numberQuestion = new NumberQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    let surveyItemId: string;

    await test.step('Navigate to survey admin page', async () => {
      await surveyAdminPage.goto(survey.id);
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a number question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(numberQuestion);
    });

    await test.step('Delete the number question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.deleteQuestion(surveyItemId, numberQuestion.questionText);
    });

    await test.step('Preview the survey and confirm the number question is not present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const question = previewPage.getQuestion(surveyItemId, numberQuestion.questionText);
      await expect(question).not.toBeVisible();
    });
  });
});
