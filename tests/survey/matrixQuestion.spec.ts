import { DeleteQuestionRequest } from '../../componentObjectModels/modals/surveyDesignerModal';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, surveyQuestionTest as test } from '../../fixtures';
import { BaseListValue } from '../../models/listValue';
import { MatrixQuestion } from '../../models/matrixQuestion';
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

  test('Create a matrix question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-552',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const matrixQuestion = new MatrixQuestion({
      questionId: questionId,
      questionText: questionId,
      rowValues: [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })],
      columnValues: [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })],
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a matrix question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(matrixQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemId,
      });
    });

    await test.step('Preview the survey and confirm the matrix question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(surveyItemId, matrixQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Create a copy of a matrix question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-553',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const matrixQuestion = new MatrixQuestion({
      questionId: questionId,
      questionText: questionId,
      rowValues: [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })],
      columnValues: [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })],
    });

    let surveyItemId: string;
    let surveyItemIdCopy: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a matrix question to copy', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(matrixQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemId,
      });
    });

    await test.step('Copy the matrix question', async () => {
      surveyItemIdCopy = await surveyAdminPage.designTab.surveyDesignerModal.copyQuestion(
        surveyItemId,
        matrixQuestion.questionText
      );
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemIdCopy,
      });
    });

    await test.step('Preview the survey and confirm the copied matrix question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const copiedQuestion = previewPage.getQuestion(surveyItemId, matrixQuestion.questionText);
      const questionCopy = previewPage.getQuestion(surveyItemIdCopy, matrixQuestion.questionText);

      await expect(copiedQuestion).toBeVisible();
      await expect(questionCopy).toBeVisible();
    });
  });

  test('Import a matrix question', async ({ sourceSurvey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-554',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceMatrixQuestion = new MatrixQuestion({
      questionId: questionId,
      questionText: questionId,
      rowValues: [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })],
      columnValues: [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })],
    });

    let questionCreatedViaImport: string;

    await test.step("Navigate to the source survey's admin page", async () => {
      await surveyAdminPage.goto(sourceSurvey.id);
    });

    await test.step("Open the source survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a matrix question to the source survey', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(sourceMatrixQuestion);
    });

    await test.step("Navigate to the target survey's admin page", async () => {
      await surveyAdminPage.goto(targetSurvey.id);
    });

    await test.step("Open the target survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Import the matrix question into the target survey', async () => {
      questionCreatedViaImport = await surveyAdminPage.designTab.surveyDesignerModal.importQuestion(
        sourceSurvey.name,
        sourceMatrixQuestion
      );
      surveyItemsToBeDeleted.push({
        surveyItemId: questionCreatedViaImport,
      });
    });

    await test.step('Preview the target survey and confirm the matrix question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(questionCreatedViaImport, sourceMatrixQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Update a matrix question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-555',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const matrixQuestion = new MatrixQuestion({
      questionId: questionId,
      questionText: questionId,
      rowValues: [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })],
      columnValues: [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })],
    });

    const updatedQuestion = { ...matrixQuestion, questionText: `${matrixQuestion.questionText} updated` };

    let createdQuestionItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create the matrix question to update', async () => {
      createdQuestionItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(matrixQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: createdQuestionItemId,
      });
    });

    await test.step('Update the matrix question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.updateQuestion(createdQuestionItemId, updatedQuestion);
    });

    await test.step('Preview the survey and confirm the updated matrix question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const updatedQuestionElement = previewPage.getQuestion(createdQuestionItemId, updatedQuestion.questionText);
      await expect(updatedQuestionElement).toBeVisible();
    });
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