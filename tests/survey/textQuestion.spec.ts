import { FakeDataFactory, Survey, SurveyPage, TextQuestion } from '@stevanfreeborn/onspring-models';
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

test.describe('text question', () => {
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

  test('Create a text question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-661',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const textQuestion = new TextQuestion({
      questionId,
      questionText: questionId,
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a text question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(textQuestion));
      surveyItemId = await sysAdminActor.asks(SurveyDesignerQuestions.surveyItemIdByText(textQuestion.questionText));
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Preview the survey and confirm the text question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, textQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Create a copy of a text question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-662',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const textQuestion = new TextQuestion({
      questionId,
      questionText: questionId,
    });

    let surveyItemId = '';
    let surveyItemIdCopy = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a text question to copy', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(textQuestion));
      surveyItemId = await sysAdminActor.asks(SurveyDesignerQuestions.surveyItemIdByText(textQuestion.questionText));
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Copy the text question', async () => {
      surveyItemIdCopy = await sysAdminActor.asks(
        SurveyDesignerQuestions.copyQuestion(surveyItemId, textQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemIdCopy });
    });

    await test.step('Preview the survey and confirm the copied text question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, textQuestion.questionText))
          .isVisible();
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemIdCopy, textQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Import a text question', async ({ sourceSurvey, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-663',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceTextQuestion = new TextQuestion({
      questionId,
      questionText: questionId,
    });

    let questionCreatedViaImport = '';

    await test.step("Open the source survey's survey designer", async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(sourceSurvey.id),
        SurveyTasks.openSurveyDesigner()
      );
    });

    await test.step('Add a text question to the source survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(sourceTextQuestion));
    });

    await test.step("Open the target survey's survey designer", async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(targetSurvey.id),
        SurveyTasks.openSurveyDesigner()
      );
    });

    await test.step('Import the text question into the target survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.importQuestion(sourceSurvey.name, sourceTextQuestion));
      questionCreatedViaImport = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(sourceTextQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: questionCreatedViaImport });
    });

    await test.step('Preview the target survey and confirm the text question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(questionCreatedViaImport, sourceTextQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Update a text question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-664',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const textQuestion = new TextQuestion({
      questionId,
      questionText: questionId,
    });

    const updatedQuestion = new TextQuestion({
      questionId: textQuestion.questionId,
      questionText: `${textQuestion.questionText} updated`,
    });

    let createdQuestionItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create the text question to update', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(textQuestion));
      createdQuestionItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(textQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: createdQuestionItemId });
    });

    await test.step('Update the text question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.updateQuestion(createdQuestionItemId, updatedQuestion));
    });

    await test.step('Preview the survey and confirm the updated text question is present', async () => {
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

  test('Move a text question on a page', async ({ sysAdminActor }) => {
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
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create text questions', async () => {
      for (const textQuestion of textQuestions) {
        await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(textQuestion));
        const surveyItemId = await sysAdminActor.asks(
          SurveyDesignerQuestions.surveyItemIdByText(textQuestion.questionText)
        );
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({ surveyItemId });
      }
    });

    await test.step('Move the second text question above the first text question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]));
    });

    await test.step('Preview the survey and confirm the second text question is displayed above the first text question', async () => {
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

  test('Move a text question to another page.', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-666',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const textQuestion = new TextQuestion({
      questionId,
      questionText: questionId,
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create a text question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(textQuestion));
      surveyItemId = await sysAdminActor.asks(SurveyDesignerQuestions.surveyItemIdByText(textQuestion.questionText));
      surveyItemsToBeDeleted.push({ surveyItemId, pageName: newPage.name });
    });

    await test.step('Create a new survey page', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addPage(newPage));
    });

    await test.step('Move the text question to the new page', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.goToPage(firstPageName),
        SurveyDesignerTasks.moveQuestionToPage(surveyItemId, newPage.name)
      );
    });

    await test.step('Preview the survey and confirm the text question is on the new page', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor.browse().waitForState(SurveyPreviewTargets.nextButton, 'visible');
        await previewActor.browse().click(SurveyPreviewTargets.nextButton);
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, textQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Delete a text question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-667',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const textQuestion = new TextQuestion({
      questionId,
      questionText: questionId,
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a text question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(textQuestion));
      surveyItemId = await sysAdminActor.asks(SurveyDesignerQuestions.surveyItemIdByText(textQuestion.questionText));
    });

    await test.step('Delete the text question', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.deleteQuestion({
          surveyItemId,
          questionText: textQuestion.questionText,
        })
      );
    });

    await test.step('Preview the survey and confirm the text question is not present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, textQuestion.questionText))
          .isHidden();
      } finally {
        await previewActor.browse().close();
      }
    });
  });
});
