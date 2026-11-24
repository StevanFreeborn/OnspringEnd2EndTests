import { FakeDataFactory, ListValue, MultiSelectQuestion, Survey, SurveyPage } from '@stevanfreeborn/onspring-models';
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

test.describe('multi select question', () => {
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

  test('Create a multi select question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-559',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const multiSelectQuestion = new MultiSelectQuestion({
      questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a multi select question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(multiSelectQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(multiSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Preview the survey and confirm the multi select question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, multiSelectQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Create a copy of a multi select question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-560',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const multiSelectQuestion = new MultiSelectQuestion({
      questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let surveyItemId = '';
    let surveyItemIdCopy = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a multi select question to copy', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(multiSelectQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(multiSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Copy the multi select question', async () => {
      surveyItemIdCopy = await sysAdminActor.asks(
        SurveyDesignerQuestions.copyQuestion(surveyItemId, multiSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemIdCopy });
    });

    await test.step('Preview the survey and confirm the copied multi select question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, multiSelectQuestion.questionText))
          .isVisible();
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemIdCopy, multiSelectQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Import a multi select question', async ({ sourceSurvey, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-561',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceMultiSelectQuestion = new MultiSelectQuestion({
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

    await test.step('Add a multi select question to the source survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(sourceMultiSelectQuestion));
    });

    await test.step("Open the target survey's survey designer", async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(targetSurvey.id),
        SurveyTasks.openSurveyDesigner()
      );
    });

    await test.step('Import the multi select question into the target survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.importQuestion(sourceSurvey.name, sourceMultiSelectQuestion));
      questionCreatedViaImport = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(sourceMultiSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: questionCreatedViaImport });
    });

    await test.step('Preview the target survey and confirm the multi select question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(questionCreatedViaImport, sourceMultiSelectQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Update a multi select question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-562',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const multiSelectQuestion = new MultiSelectQuestion({
      questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const updatedQuestion = new MultiSelectQuestion({
      questionId: multiSelectQuestion.questionId,
      questionText: `${multiSelectQuestion.questionText} updated`,
      answerValues: [new ListValue({ value: 'Nah' }), new ListValue({ value: 'Yeah' })],
    });

    let createdQuestionItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create the multi select question to update', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(multiSelectQuestion));
      createdQuestionItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(multiSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: createdQuestionItemId });
    });

    await test.step('Update the multi select question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.updateQuestion(createdQuestionItemId, updatedQuestion));
    });

    await test.step('Preview the survey and confirm the updated multi select question is present', async () => {
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

  test('Move a multi select question on a page', async ({ sysAdminActor }) => {
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
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create multi select questions', async () => {
      for (const multiSelectQuestion of multiSelectQuestions) {
        await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(multiSelectQuestion));
        const surveyItemId = await sysAdminActor.asks(
          SurveyDesignerQuestions.surveyItemIdByText(multiSelectQuestion.questionText)
        );
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({ surveyItemId });
      }
    });

    await test.step('Move the second multi select question above the first multi select question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]));
    });

    await test.step('Preview the survey and confirm the second multi select question is displayed above the first multi select question', async () => {
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

  test('Move a multi select question to another page.', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-564',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const multiSelectQuestion = new MultiSelectQuestion({
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

    await test.step('Create a multi select question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(multiSelectQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(multiSelectQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId, pageName: newPage.name });
    });

    await test.step('Create a new survey page', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addPage(newPage));
    });

    await test.step('Move the multi select question to the new page', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.goToPage(firstPageName),
        SurveyDesignerTasks.moveQuestionToPage(surveyItemId, newPage.name)
      );
    });

    await test.step('Preview the survey and confirm the multi select question is on the new page', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor.browse().waitForState(SurveyPreviewTargets.nextButton, 'visible');
        await previewActor.browse().click(SurveyPreviewTargets.nextButton);
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, multiSelectQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Delete a multi select question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-565',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const multiSelectQuestion = new MultiSelectQuestion({
      questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a multi select question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(multiSelectQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(multiSelectQuestion.questionText)
      );
    });

    await test.step('Delete the multi select question', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.deleteQuestion({
          surveyItemId,
          questionText: multiSelectQuestion.questionText,
        })
      );
    });

    await test.step('Preview the survey and confirm the multi select question is not present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, multiSelectQuestion.questionText))
          .isHidden();
      } finally {
        await previewActor.browse().close();
      }
    });
  });
});
