import { AttachmentQuestion, FakeDataFactory, Survey, SurveyPage } from '@stevanfreeborn/onspring-models';
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

test.describe('attachment question', () => {
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

  test('Create an attachment question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-274',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const attachmentQuestion = new AttachmentQuestion({
      questionId,
      questionText: questionId,
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add an attachment question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(attachmentQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(attachmentQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Preview the survey and confirm the attachment question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, attachmentQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Create a copy of an attachment question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-275',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const attachmentQuestion = new AttachmentQuestion({
      questionId,
      questionText: questionId,
    });

    let surveyItemId = '';
    let surveyItemIdCopy = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add an attachment question to copy', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(attachmentQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(attachmentQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Copy the attachment question', async () => {
      surveyItemIdCopy = await sysAdminActor.asks(
        SurveyDesignerQuestions.copyQuestion(surveyItemId, attachmentQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemIdCopy });
    });

    await test.step('Preview the survey and confirm the copied attachment question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, attachmentQuestion.questionText))
          .isVisible();
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemIdCopy, attachmentQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Import an attachment question', async ({ sourceSurvey, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-276',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceAttachmentQuestion = new AttachmentQuestion({
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

    await test.step('Add an attachment question to the source survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(sourceAttachmentQuestion));
    });

    await test.step("Open the target survey's survey designer", async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(targetSurvey.id),
        SurveyTasks.openSurveyDesigner()
      );
    });

    await test.step('Import the attachment question into the target survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.importQuestion(sourceSurvey.name, sourceAttachmentQuestion));
      questionCreatedViaImport = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(sourceAttachmentQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: questionCreatedViaImport });
    });

    await test.step('Preview the target survey and confirm the attachment question is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(questionCreatedViaImport, sourceAttachmentQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Update an attachment question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-277',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const attachmentQuestion = new AttachmentQuestion({
      questionId,
      questionText: questionId,
    });

    const updatedQuestion = new AttachmentQuestion({
      questionId: attachmentQuestion.questionId,
      questionText: `${attachmentQuestion.questionText} updated`,
    });

    let createdQuestionItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create the attachment question to update', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(attachmentQuestion));
      createdQuestionItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(attachmentQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId: createdQuestionItemId });
    });

    await test.step('Update the attachment question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.updateQuestion(createdQuestionItemId, updatedQuestion));
    });

    await test.step('Preview the survey and confirm the updated attachment question is present', async () => {
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

  test('Move an attachment question on a page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-278',
    });

    const attachmentQuestions = [
      new AttachmentQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Attachment Question 1',
      }),
      new AttachmentQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Attachment Question 2',
      }),
    ];

    const surveyItemIds: string[] = [];

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Create attachment questions', async () => {
      for (const attachmentQuestion of attachmentQuestions) {
        await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(attachmentQuestion));
        const surveyItemId = await sysAdminActor.asks(
          SurveyDesignerQuestions.surveyItemIdByText(attachmentQuestion.questionText)
        );
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({ surveyItemId });
      }
    });

    await test.step('Move the second attachment question above the first attachment question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]));
    });

    await test.step('Preview the survey and confirm the second attachment question is displayed above the first attachment question', async () => {
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

  test('Move an attachment question to another page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-279',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const attachmentQuestion = new AttachmentQuestion({
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

    await test.step('Create an attachment question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(attachmentQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(attachmentQuestion.questionText)
      );
      surveyItemsToBeDeleted.push({ surveyItemId, pageName: newPage.name });
    });

    await test.step('Create a new survey page', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addPage(newPage));
    });

    await test.step('Move the attachment question to the new page', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.goToPage(firstPageName),
        SurveyDesignerTasks.moveQuestionToPage(surveyItemId, newPage.name)
      );
    });

    await test.step('Preview the survey and confirm the attachment question is on the new page', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor.browse().waitForState(SurveyPreviewTargets.nextButton, 'visible');
        await previewActor.browse().click(SurveyPreviewTargets.nextButton);
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, attachmentQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Delete an attachment question', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-312',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const attachmentQuestion = new AttachmentQuestion({
      questionId,
      questionText: questionId,
    });

    let surveyItemId = '';

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add an attachment question', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(attachmentQuestion));
      surveyItemId = await sysAdminActor.asks(
        SurveyDesignerQuestions.surveyItemIdByText(attachmentQuestion.questionText)
      );
    });

    await test.step('Delete the attachment question', async () => {
      await sysAdminActor.attemptsTo(
        SurveyDesignerTasks.deleteQuestion({
          surveyItemId,
          questionText: attachmentQuestion.questionText,
        })
      );
    });

    await test.step('Preview the survey and confirm the attachment question is not present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, attachmentQuestion.questionText))
          .isHidden();
      } finally {
        await previewActor.browse().close();
      }
    });
  });
});
