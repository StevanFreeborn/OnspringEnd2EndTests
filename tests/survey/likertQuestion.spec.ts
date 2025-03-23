import { DeleteQuestionRequest } from '../../componentObjectModels/modals/surveyDesignerModal';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { LikertQuestion } from '../../models/likertQuestion';
import { BaseListValue } from '../../models/listValue';
import { Survey } from '../../models/survey';
import { SurveyPage } from '../../models/surveyPage';
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

  test('Create a likert scale question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-542',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const likertQuestion = new LikertQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new BaseListValue({ value: 'Strongly Disagree' }), new BaseListValue({ value: 'Strongly Agree' })],
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a likert question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(likertQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemId,
      });
    });

    await test.step('Preview the survey and confirm the likert question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(surveyItemId, likertQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Create a copy of a likert scale question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-543',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const likertQuestion = new LikertQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new BaseListValue({ value: 'Strongly Disagree' }), new BaseListValue({ value: 'Strongly Agree' })],
    });

    let surveyItemId: string;
    let surveyItemIdCopy: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a likert question to copy', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(likertQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemId,
      });
    });

    await test.step('Copy the likert question', async () => {
      surveyItemIdCopy = await surveyAdminPage.designTab.surveyDesignerModal.copyQuestion(
        surveyItemId,
        likertQuestion.questionText
      );
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemIdCopy,
      });
    });

    await test.step('Preview the survey and confirm the copied likert question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const copiedQuestion = previewPage.getQuestion(surveyItemId, likertQuestion.questionText);
      const questionCopy = previewPage.getQuestion(surveyItemIdCopy, likertQuestion.questionText);

      await expect(copiedQuestion).toBeVisible();
      await expect(questionCopy).toBeVisible();
    });
  });

  test('Import a likert scale question', async ({ surveyAdminPage, sourceSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-544',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceLikertQuestion = new LikertQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new BaseListValue({ value: 'Strongly Disagree' }), new BaseListValue({ value: 'Strongly Agree' })],
    });

    let questionCreatedViaImport: string;

    await test.step("Navigate to the source survey's admin page", async () => {
      await surveyAdminPage.goto(sourceSurvey.id);
    });

    await test.step("Open the source survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a likert question to the source survey', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(sourceLikertQuestion);
    });

    await test.step("Navigate to the target survey's admin page", async () => {
      await surveyAdminPage.goto(targetSurvey.id);
    });

    await test.step("Open the target survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Import the likert question into the target survey', async () => {
      questionCreatedViaImport = await surveyAdminPage.designTab.surveyDesignerModal.importQuestion(
        sourceSurvey.name,
        sourceLikertQuestion
      );
      surveyItemsToBeDeleted.push({
        surveyItemId: questionCreatedViaImport,
      });
    });

    await test.step('Preview the target survey and confirm the likert question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(questionCreatedViaImport, sourceLikertQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Update a likert scale question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-545',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const likertQuestion = new LikertQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new BaseListValue({ value: 'Strongly Disagree' }), new BaseListValue({ value: 'Strongly Agree' })],
    });

    const updatedQuestion = { ...likertQuestion, questionText: `${likertQuestion.questionText} updated` };

    let createdQuestionItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create the likert question to update', async () => {
      createdQuestionItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(likertQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: createdQuestionItemId,
      });
    });

    await test.step('Update the likert question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.updateQuestion(createdQuestionItemId, updatedQuestion);
    });

    await test.step('Preview the survey and confirm the updated likert question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const updatedQuestionElement = previewPage.getQuestion(createdQuestionItemId, updatedQuestion.questionText);
      await expect(updatedQuestionElement).toBeVisible();
    });
  });

  test('Move a likert scale question on a page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-546',
    });

    const values = [new BaseListValue({ value: 'Strongly Disagree' }), new BaseListValue({ value: 'Strongly Agree' })];

    const likertQuestions = [
      new LikertQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Likert Question 1',
        answerValues: values,
      }),
      new LikertQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Likert Question 2',
        answerValues: values,
      }),
    ];

    const surveyItemIds: string[] = [];

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create likert questions', async () => {
      for (const likertQuestion of likertQuestions) {
        const surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(likertQuestion);
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({
          surveyItemId: surveyItemId,
        });
      }
    });

    await test.step('Move the second likert question above the first likert question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]);
    });

    await test.step('Preview the survey and confirm the second likert question is displayed above the first likert question', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const isAbove = await previewPage.questionIsAbove(surveyItemIds[1], surveyItemIds[0]);

      expect(isAbove).toBe(true);
    });
  });

  test('Move a likert scale question to another page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-547',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const likertQuestion = new LikertQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new BaseListValue({ value: 'Strongly Disagree' }), new BaseListValue({ value: 'Strongly Agree' })],
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create a likert question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(likertQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemId,
        pageName: newPage.name,
      });
    });

    await test.step('Create a new survey page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addPage(newPage);
    });

    await test.step('Move the likert question to the new page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.goToPage(firstPageName);
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionToPage(surveyItemId, newPage.name);
    });

    await test.step('Preview the survey and confirm the likert question is on the new page', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();

      await previewPage.nextButton.waitFor();
      await previewPage.nextButton.click();

      const question = previewPage.getQuestion(surveyItemId, likertQuestion.questionText);
      await expect(question).toBeVisible();
    });
  });

  test('Delete a likert scale question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-548',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const likertQuestion = new LikertQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new BaseListValue({ value: 'Strongly Disagree' }), new BaseListValue({ value: 'Strongly Agree' })],
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a likert question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(likertQuestion);
    });

    await test.step('Delete the likert question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.deleteQuestion({
        surveyItemId: surveyItemId,
        questionText: likertQuestion.questionText,
      });
    });

    await test.step('Preview the survey and confirm the likert question is not present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const question = previewPage.getQuestion(surveyItemId, likertQuestion.questionText);
      await expect(question).toBeHidden();
    });
  });
});
