import { DeleteQuestionRequest } from '../../componentObjectModels/modals/surveyDesignerModal';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, surveyQuestionTest as test } from '../../fixtures';
import { BaseListValue } from '../../models/listValue';
import { MatrixQuestion } from '../../models/matrixQuestion';
import { Survey } from '../../models/survey';
import { SurveyPage } from '../../models/surveyPage';
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

  test('Move a matrix question on a page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-556',
    });

    const rowValues = [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })];
    const columnValues = [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })];

    const matrixQuestions = [
      new MatrixQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Matrix Question 1',
        rowValues: rowValues,
        columnValues: columnValues,
      }),
      new MatrixQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Matrix Question 2',
        rowValues: rowValues,
        columnValues: columnValues,
      }),
    ];

    const surveyItemIds: string[] = [];

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create matrix questions', async () => {
      for (const matrixQuestion of matrixQuestions) {
        const surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(matrixQuestion);
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({
          surveyItemId: surveyItemId,
        });
      }
    });

    await test.step('Move the second matrix question above the first matrix question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]);
    });

    await test.step('Preview the survey and confirm the second matrix question is displayed above the first matrix question', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const isAbove = await previewPage.questionIsAbove(surveyItemIds[1], surveyItemIds[0]);

      expect(isAbove).toBe(true);
    });
  });

  test('Move a matrix question to another page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-557',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const matrixQuestion = new MatrixQuestion({
      questionId: questionId,
      questionText: questionId,
      rowValues: [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })],
      columnValues: [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })],
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create a matrix question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(matrixQuestion);
      surveyItemsToBeDeleted.push({
        surveyItemId: surveyItemId,
        pageName: newPage.name,
      });
    });

    await test.step('Create a new survey page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addPage(newPage);
    });

    await test.step('Move the matrix question to the new page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.goToPage(firstPageName);
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionToPage(surveyItemId, newPage.name);
    });

    await test.step('Preview the survey and confirm the matrix question is on the new page', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();

      await previewPage.nextButton.waitFor();
      await previewPage.nextButton.click();

      const question = previewPage.getQuestion(surveyItemId, matrixQuestion.questionText);
      await expect(question).toBeVisible();
    });
  });

  test('Delete a matrix question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-558',
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
    });

    await test.step('Delete the matrix question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.deleteQuestion({
        surveyItemId: surveyItemId,
        questionText: matrixQuestion.questionText,
      });
    });

    await test.step('Preview the survey and confirm the matrix question is not present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const question = previewPage.getQuestion(surveyItemId, matrixQuestion.questionText);
      await expect(question).toBeHidden();
    });
  });
});
