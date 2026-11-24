import { App, FakeDataFactory, ReferenceQuestion, Survey, SurveyPage } from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  ContentTasks,
  DeleteQuestionRequest,
  SurveyDesignerQuestions,
  SurveyDesignerTasks,
  SurveyPreviewTargets,
  SurveyTasks,
} from '@stevanfreeborn/onspring-ui';
import { test as base, createAppWithActor, SurveyFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend<{ sourceSurvey: Survey; targetSurvey: Survey }>({
  sourceSurvey: SurveyFixture.create().build(),
  targetSurvey: SurveyFixture.create().build(),
});

test.describe('reference question', () => {
  test.describe.configure({
    mode: 'default',
  });

  let targetSurvey: Survey;
  let referencedApp: App;
  let surveyItemsToBeDeleted: DeleteQuestionRequest[] = [];

  test.beforeAll(
    'Create target survey, referenced app, and answer value content record',
    async ({ sysAdminActor, targetSurvey: survey }) => {
      targetSurvey = survey;
      referencedApp = await createAppWithActor(sysAdminActor);
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(referencedApp.id), ContentTasks.saveRecord());
    }
  );

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

  test.afterAll('Delete the referenced app created during the test', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(AppTasks.deleteApps([referencedApp.name]));
  });

  test('Create a reference question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-587',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const referenceQuestion = new ReferenceQuestion({
      questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a reference question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(referenceQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(referenceQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Preview the survey and confirm the reference question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, referenceQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Create a copy of a reference question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-588',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const referenceQuestion = new ReferenceQuestion({
      questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    let surveyItemId = '';
    let surveyItemIdCopy = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a reference question to copy', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(referenceQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(referenceQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Copy the reference question', async () => {
      surveyItemIdCopy = await sysAdminActor.asks(
        SurveyDesignerQuestions.copyQuestion(surveyItemId, referenceQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemIdCopy });
    });

    await test.step('Preview the survey and confirm the copied reference question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, referenceQuestion.questionText))
          .isVisible();
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemIdCopy, referenceQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Import a reference question', async ({ sourceSurvey, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-589',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceReferenceQuestion = new ReferenceQuestion({
      questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    let questionCreatedViaImport = '';

    await test.step("Open the source survey's survey designer", async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(sourceSurvey.id),
        SurveyTasks.openSurveyDesigner()
      );
    });

    await test.step('Add a reference question to the source survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(sourceReferenceQuestion));
    });

    await test.step("Open the target survey's survey designer", async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(targetSurvey.id),
        SurveyTasks.openSurveyDesigner()
      );
    });

    await test.step('Import the reference question into the target survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.importQuestion(sourceSurvey.name, sourceReferenceQuestion));
      questionCreatedViaImport = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(sourceReferenceQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: questionCreatedViaImport });
    });

    await test.step('Preview the target survey and confirm the reference question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(questionCreatedViaImport, sourceReferenceQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Update a reference question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-590',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const referenceQuestion = new ReferenceQuestion({
      questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    const updatedQuestion = new ReferenceQuestion({
      questionId: referenceQuestion.questionId,
      questionText: `${referenceQuestion.questionText} updated`,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    let createdQuestionItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create the reference question to update', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(referenceQuestion));
      createdQuestionItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(referenceQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: createdQuestionItemId });
    });

    await test.step('Update the reference question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.updateQuestion(createdQuestionItemId, updatedQuestion));
    });

    await test.step('Preview the survey and confirm the updated reference question is present', async () => {
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

  test('Move a reference question on a page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-591',
    });

    const referenceQuestions = [
      new ReferenceQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Reference Question 1',
        appReference: referencedApp.name,
        answerValues: 'ALL',
      }),
      new ReferenceQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Reference Question 2',
        appReference: referencedApp.name,
        answerValues: 'ALL',
      }),
    ];

    const surveyItemIds: string[] = [];

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create reference questions', async () => {
      for (const referenceQuestion of referenceQuestions) {
        await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(referenceQuestion));
        const surveyItemId = await sysAdminActor.asks(
          SurveyDesignerQuestions.surveyItemIdByText(referenceQuestion.questionText)
        );
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({ surveyItemId });
      }
    });

    await test.step('Move the second reference question above the first reference question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]));
    });

    await test.step('Preview the survey and confirm the second reference question is displayed above the first reference question', async () => {
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

  test('Move a reference question to another page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-592',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const referenceQuestion = new ReferenceQuestion({
      questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create a reference question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(referenceQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(referenceQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId, pageName: newPage.name });
    });

    await test.step('Create a new survey page', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addPage(newPage));
    });

    await test.step('Move the reference question to the new page', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.goToPage(firstPageName),
        SurveyDesignerTasks.moveQuestionToPage(surveyItemId, newPage.name)
      );
    });

    await test.step('Preview the survey and confirm the reference question is on the new page', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor.browse().waitForState(SurveyPreviewTargets.nextButton, 'visible');
        await previewActor.browse().click(SurveyPreviewTargets.nextButton);
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, referenceQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Delete a reference question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-593',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const referenceQuestion = new ReferenceQuestion({
      questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a reference question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(referenceQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(referenceQuestion.questionText)
      );
    });

    await test.step('Delete the reference question', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.deleteQuestion({
          surveyItemId,
          questionText: referenceQuestion.questionText,
        })
      );
    });

    await test.step('Preview the survey and confirm the reference question is not present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, referenceQuestion.questionText))
          .isHidden();
      } finally {
        await previewActor.browse().close();
      }
    });
  });
});
