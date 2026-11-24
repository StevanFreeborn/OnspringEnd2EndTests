import { FakeDataFactory, ListValue, SingleSelectQuestion, Survey, SurveyPage } from '@stevanfreeborn/onspring-models';
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

test.describe('single select question', () => {
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

  test('Create a single select question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-645',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const singleSelectQuestion = new SingleSelectQuestion({
      questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a single select question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(singleSelectQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(singleSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Preview the survey and confirm the single select question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, singleSelectQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Create a copy of a single select question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-646',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const singleSelectQuestion = new SingleSelectQuestion({
      questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let surveyItemId = '';
    let surveyItemIdCopy = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a single select question to copy', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(singleSelectQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(singleSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Copy the single select question', async () => {
      surveyItemIdCopy = await sysAdminActor.asks(
        SurveyDesignerQuestions.copyQuestion(surveyItemId, singleSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemIdCopy });
    });

    await test.step('Preview the survey and confirm the copied single select question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, singleSelectQuestion.questionText))
          .isVisible();
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemIdCopy, singleSelectQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Import a single select question', async ({ sourceSurvey, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-647',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceSingleSelectQuestion = new SingleSelectQuestion({
      questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let questionCreatedViaImport = '';

    await test.step("Open the source survey's survey designer", async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(sourceSurvey.id),
        SurveyTasks.openSurveyDesigner()
      );
    });

    await test.step('Add a single select question to the source survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(sourceSingleSelectQuestion));
    });

    await test.step("Open the target survey's survey designer", async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(targetSurvey.id),
        SurveyTasks.openSurveyDesigner()
      );
    });

    await test.step('Import the single select question into the target survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.importQuestion(sourceSurvey.name, sourceSingleSelectQuestion));
      questionCreatedViaImport = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(sourceSingleSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: questionCreatedViaImport });
    });

    await test.step('Preview the target survey and confirm the single select question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(questionCreatedViaImport, sourceSingleSelectQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Update a single select question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-648',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const singleSelectQuestion = new SingleSelectQuestion({
      questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const updatedQuestion = new SingleSelectQuestion({
      questionId: singleSelectQuestion.questionId,
      questionText: `${singleSelectQuestion.questionText} updated`,
      answerValues: [new ListValue({ value: 'Nah' }), new ListValue({ value: 'Yeah' })],
    });

    let createdQuestionItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create the single select question to update', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(singleSelectQuestion));
      createdQuestionItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(singleSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: createdQuestionItemId });
    });

    await test.step('Update the single select question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.updateQuestion(createdQuestionItemId, updatedQuestion));
    });

    await test.step('Preview the survey and confirm the updated single select question is present', async () => {
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

  test('Move a single select question on a page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-649',
    });

    const singleSelectQuestions = [
      new SingleSelectQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Single Select Question 1',
        answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
      }),
      new SingleSelectQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Single Select Question 2',
        answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
      }),
    ];

    const surveyItemIds: string[] = [];

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create single select questions', async () => {
      for (const singleSelectQuestion of singleSelectQuestions) {
        await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(singleSelectQuestion));
        const surveyItemId = await sysAdminActor.asks(
          SurveyDesignerQuestions.surveyItemIdByText(singleSelectQuestion.questionText)
        );
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({ surveyItemId });
      }
    });

    await test.step('Move the second single select question above the first single select question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]));
    });

    await test.step('Preview the survey and confirm the second single select question is displayed above the first single select question', async () => {
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

  test('Move a single select question to another page.', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-650',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const singleSelectQuestion = new SingleSelectQuestion({
      questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create a single select question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(singleSelectQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(singleSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId, pageName: newPage.name });
    });

    await test.step('Create a new survey page', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addPage(newPage));
    });

    await test.step('Move the single select question to the new page', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.goToPage(firstPageName),
        SurveyDesignerTasks.moveQuestionToPage(surveyItemId, newPage.name)
      );
    });

    await test.step('Preview the survey and confirm the single select question is on the new page', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor.browse().waitForState(SurveyPreviewTargets.nextButton, 'visible');
        await previewActor.browse().click(SurveyPreviewTargets.nextButton);
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, singleSelectQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Delete a single select question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-651',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const singleSelectQuestion = new SingleSelectQuestion({
      questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a single select question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(singleSelectQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(singleSelectQuestion.questionText)
      );
    });

    await test.step('Delete the single select question', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.deleteQuestion({
          surveyItemId,
          questionText: singleSelectQuestion.questionText,
        })
      );
    });

    await test.step('Preview the survey and confirm the single select question is not present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, singleSelectQuestion.questionText))
          .isHidden();
      } finally {
        await previewActor.browse().close();
      }
    });
  });
});
