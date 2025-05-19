import { DeleteQuestionRequest } from '../../componentObjectModels/modals/surveyDesignerModal';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { ListValue } from '../../models/listValue';
import { MultiSelectQuestion } from '../../models/multiSelectQuestion';
import { Survey } from '../../models/survey';
import { SurveyPage } from '../../models/surveyPage';
import { AnnotationType } from '../annotations';
import { expect, surveyQuestionTest as test } from './../../fixtures/index';

test.describe('multi select question', () => {
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

  test('Create a multi select question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-559',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const multiSelectQuestion = new MultiSelectQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a multi select question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(multiSelectQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemId,
      });
    });

    await test.step('Preview the survey and confirm the multi select question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(surveyItemId, multiSelectQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Create a copy of a multi select question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-560',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const multiSelectQuestion = new MultiSelectQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let surveyItemId: string;
    let surveyItemIdCopy: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a multi select question to copy', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(multiSelectQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemId,
      });
    });

    await test.step('Copy the multi select question', async () => {
      surveyItemIdCopy = await surveyAdminPage.designTab.surveyDesignerModal.copyQuestion(
        surveyItemId,
        multiSelectQuestion.questionText
      );
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemIdCopy,
      });
    });

    await test.step('Preview the survey and confirm the copied multi select question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const copiedQuestion = previewPage.getQuestion(surveyItemId, multiSelectQuestion.questionText);
      const questionCopy = previewPage.getQuestion(surveyItemIdCopy, multiSelectQuestion.questionText);

      await expect(copiedQuestion).toBeVisible();
      await expect(questionCopy).toBeVisible();
    });
  });

  test('Import a multi select question', async ({ sourceSurvey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-561',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceMultiSelectQuestion = new MultiSelectQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let questionCreatedViaImport: string;

    await test.step("Navigate to the source survey's admin page", async () => {
      await surveyAdminPage.goto(sourceSurvey.id);
    });

    await test.step("Open the source survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a multi select question to the source survey', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(sourceMultiSelectQuestion);
    });

    await test.step("Navigate to the target survey's admin page", async () => {
      await surveyAdminPage.goto(targetSurvey.id);
    });

    await test.step("Open the target survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Import the multi select question into the target survey', async () => {
      questionCreatedViaImport = await surveyAdminPage.designTab.surveyDesignerModal.importQuestion(
        sourceSurvey.name,
        sourceMultiSelectQuestion
      );
      surveyItemsToBeDeleted.push({
        surveyItemId: questionCreatedViaImport,
      });
    });

    await test.step('Preview the target survey and confirm the multi select question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(questionCreatedViaImport, sourceMultiSelectQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Update a multi select question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-562',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const multiSelectQuestion = new MultiSelectQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const updatedQuestion = {
      ...multiSelectQuestion,
      questionText: `${multiSelectQuestion.questionText} updated`,
      answerValues: [new ListValue({ value: 'Nah' }), new ListValue({ value: 'Yeah' })],
    };

    let createdQuestionItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create the multi select question to update', async () => {
      createdQuestionItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(multiSelectQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: createdQuestionItemId,
      });
    });

    await test.step('Update the multi select question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.updateQuestion(createdQuestionItemId, updatedQuestion);
    });

    await test.step('Preview the survey and confirm the updated multi select question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const updatedQuestionElement = previewPage.getQuestion(createdQuestionItemId, updatedQuestion.questionText);
      await expect(updatedQuestionElement).toBeVisible();
    });
  });

  test('Move a multi select question on a page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-563',
    });

    const multiSelectQuestions = [
      new MultiSelectQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Multi Select Question 1',
        answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
      }),
      new MultiSelectQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Multi Select Question 2',
        answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
      }),
    ];

    const surveyItemIds: string[] = [];

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create multi select questions', async () => {
      for (const multiSelectQuestion of multiSelectQuestions) {
        const surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(multiSelectQuestion);
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({
          surveyItemId: surveyItemId,
        });
      }
    });

    await test.step('Move the second multi select question above the first multi select question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]);
    });

    await test.step('Preview the survey and confirm the second multi select question is displayed above the first multi select question', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const isAbove = await previewPage.questionIsAbove(surveyItemIds[1], surveyItemIds[0]);

      expect(isAbove).toBe(true);
    });
  });

  test('Move a multi select question to another page.', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-564',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const multiSelectQuestion = new MultiSelectQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create a multi select question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(multiSelectQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemId,
        pageName: newPage.name,
      });
    });

    await test.step('Create a new survey page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addPage(newPage);
    });

    await test.step('Move the multi select question to the new page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.goToPage(firstPageName);
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionToPage(surveyItemId, newPage.name);
    });

    await test.step('Preview the survey and confirm the multi select question is on the new page', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();

      await previewPage.nextButton.waitFor();
      await previewPage.nextButton.click();

      const question = previewPage.getQuestion(surveyItemId, multiSelectQuestion.questionText);
      await expect(question).toBeVisible();
    });
  });

  test('Delete a multi select question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-565',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const multiSelectQuestion = new MultiSelectQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a multi select question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(multiSelectQuestion);
    });

    await test.step('Delete the multi select question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.deleteQuestion({
        surveyItemId: surveyItemId,
        questionText: multiSelectQuestion.questionText,
      });
    });

    await test.step('Preview the survey and confirm the multi select question is not present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const question = previewPage.getQuestion(surveyItemId, multiSelectQuestion.questionText);
      await expect(question).toBeHidden();
    });
  });
});
