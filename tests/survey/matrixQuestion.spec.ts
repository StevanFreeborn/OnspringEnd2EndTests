import { BaseListValue, FakeDataFactory, MatrixQuestion, Survey, SurveyPage } from '@stevanfreeborn/onspring-models';
import {
  DeleteQuestionRequest,
  SurveyDesignerQuestions,
  SurveyDesignerTasks,
  SurveyPreviewTargets,
  SurveyTasks,
} from '@stevanfreeborn/onspring-ui';
import { test as base, SurveyFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend<{ sourceSurvey: Survey; targetSurvey: Survey }>({
  sourceSurvey: SurveyFixture.create().build(),
  targetSurvey: SurveyFixture.create().build(),
});

test.describe('matrix question', () => {
  test.describe.configure({
    mode: 'default',
  });

  let targetSurvey: Survey;
  let surveyItemsToBeDeleted: DeleteQuestionRequest[] = [];

  test.beforeAll('Create target survey', ({ targetSurvey: survey }) => {
    targetSurvey = survey;
  });

  test.beforeEach('Navigate to survey admin page', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(SurveyTasks.gotoSurvey(targetSurvey.id));
  });

  test.afterEach('Delete questions created during the test', async ({ sysAdminActor }) => {
    if (surveyItemsToBeDeleted.length === 0) {
      return;
    }

    await sysAdminActor.attemptsTo(SurveyTasks.gotoSurveyDesignTab(targetSurvey.id), SurveyTasks.openSurveyDesigner());

    for (const itemToBeDeleted of surveyItemsToBeDeleted) {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.deleteQuestion({
          surveyItemId: itemToBeDeleted.surveyItemId,
          pageName: itemToBeDeleted.pageName,
        })
      );
    }

    surveyItemsToBeDeleted = [];
  });

  test('Create a matrix question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-552',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const matrixQuestion = new MatrixQuestion({
      questionId,
      questionText: questionId,
      rowValues: [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })],
      columnValues: [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })],
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a matrix question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(matrixQuestion));
      surveyItemId = await sysAdminActor.asks(SurveyDesignerQuestions.surveyItemIdByText(matrixQuestion.questionText));
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Preview the survey and confirm the matrix question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, matrixQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Create a copy of a matrix question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-553',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const matrixQuestion = new MatrixQuestion({
      questionId,
      questionText: questionId,
      rowValues: [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })],
      columnValues: [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })],
    });

    let surveyItemId = '';
    let surveyItemIdCopy = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a matrix question to copy', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(matrixQuestion));
      surveyItemId = await sysAdminActor.asks(SurveyDesignerQuestions.surveyItemIdByText(matrixQuestion.questionText));
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Copy the matrix question', async () => {
      surveyItemIdCopy = await sysAdminActor.asks(
        SurveyDesignerQuestions.copyQuestion(surveyItemId, matrixQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemIdCopy });
    });

    await test.step('Preview the survey and confirm the copied matrix question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, matrixQuestion.questionText))
          .isVisible();
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemIdCopy, matrixQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Import a matrix question', async ({ sourceSurvey, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-554',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceMatrixQuestion = new MatrixQuestion({
      questionId,
      questionText: questionId,
      rowValues: [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })],
      columnValues: [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })],
    });

    let questionCreatedViaImport = '';

    await test.step("Open the source survey's survey designer", async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(sourceSurvey.id),
        SurveyTasks.openSurveyDesigner()
      );
    });

    await test.step('Add a matrix question to the source survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(sourceMatrixQuestion));
    });

    await test.step("Open the target survey's survey designer", async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(targetSurvey.id),
        SurveyTasks.openSurveyDesigner()
      );
    });

    await test.step('Import the matrix question into the target survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.importQuestion(sourceSurvey.name, sourceMatrixQuestion));
      questionCreatedViaImport = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(sourceMatrixQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: questionCreatedViaImport });
    });

    await test.step('Preview the target survey and confirm the matrix question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(questionCreatedViaImport, sourceMatrixQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Update a matrix question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-555',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const matrixQuestion = new MatrixQuestion({
      questionId,
      questionText: questionId,
      rowValues: [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })],
      columnValues: [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })],
    });

    const updatedQuestion = new MatrixQuestion({
      questionId: matrixQuestion.questionId,
      questionText: `${matrixQuestion.questionText} updated`,
      rowValues: matrixQuestion.rowValues,
      columnValues: matrixQuestion.columnValues,
    });

    let createdQuestionItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create the matrix question to update', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(matrixQuestion));
      createdQuestionItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(matrixQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: createdQuestionItemId });
    });

    await test.step('Update the matrix question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.updateQuestion(createdQuestionItemId, updatedQuestion));
    });

    await test.step('Preview the survey and confirm the updated matrix question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(createdQuestionItemId, updatedQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Move a matrix question on a page', async ({ sysAdminActor }) => {
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
        rowValues,
        columnValues,
      }),
      new MatrixQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Matrix Question 2',
        rowValues,
        columnValues,
      }),
    ];

    const surveyItemIds: string[] = [];

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create matrix questions', async () => {
      for (const matrixQuestion of matrixQuestions) {
        await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(matrixQuestion));
        const surveyItemId = await sysAdminActor.asks(
          SurveyDesignerQuestions.surveyItemIdByText(matrixQuestion.questionText)
        );
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({ surveyItemId });
      }
    });

    await test.step('Move the second matrix question above the first matrix question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]));
    });

    await test.step('Preview the survey and confirm the second matrix question is displayed above the first matrix question', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.questionByItemId(surveyItemIds[1]))
          .isAbove(SurveyPreviewTargets.questionByItemId(surveyItemIds[0]));
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Move a matrix question to another page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-557',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const matrixQuestion = new MatrixQuestion({
      questionId,
      questionText: questionId,
      rowValues: [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })],
      columnValues: [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })],
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create a matrix question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(matrixQuestion));
      surveyItemId = await sysAdminActor.asks(SurveyDesignerQuestions.surveyItemIdByText(matrixQuestion.questionText));
      surveyItemsToBeDeleted.push({ surveyItemId, pageName: newPage.name });
    });

    await test.step('Create a new survey page', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addPage(newPage));
    });

    await test.step('Move the matrix question to the new page', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.goToPage(firstPageName),
        SurveyDesignerTasks.moveQuestionToPage(surveyItemId, newPage.name)
      );
    });

    await test.step('Preview the survey and confirm the matrix question is on the new page', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor.browse().waitForState(SurveyPreviewTargets.nextButton, 'visible');
        await previewActor.browse().click(SurveyPreviewTargets.nextButton);
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, matrixQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Delete a matrix question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-558',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const matrixQuestion = new MatrixQuestion({
      questionId,
      questionText: questionId,
      rowValues: [new BaseListValue({ value: 'Row 1' }), new BaseListValue({ value: 'Row 2' })],
      columnValues: [new BaseListValue({ value: 'Column 1' }), new BaseListValue({ value: 'Column 2' })],
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a matrix question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(matrixQuestion));
      surveyItemId = await sysAdminActor.asks(SurveyDesignerQuestions.surveyItemIdByText(matrixQuestion.questionText));
    });

    await test.step('Delete the matrix question', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.deleteQuestion({
          surveyItemId,
          questionText: matrixQuestion.questionText,
        })
      );
    });

    await test.step('Preview the survey and confirm the matrix question is not present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, matrixQuestion.questionText))
          .isHidden();
      } finally {
        await previewActor.browse().close();
      }
    });
  });
});
