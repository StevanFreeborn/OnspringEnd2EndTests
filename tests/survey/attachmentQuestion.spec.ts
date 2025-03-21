import { DeleteQuestionRequest } from '../../componentObjectModels/modals/surveyDesignerModal';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, surveyQuestionTest as test } from '../../fixtures';
import { AttachmentQuestion } from '../../models/attachmentQuestion';
import { Survey } from '../../models/survey';
import { SurveyPage } from '../../models/surveyPage';
import { AnnotationType } from '../annotations';

test.describe('attachment question', () => {
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

  test('Create an attachment question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-274',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const attachmentQuestion = new AttachmentQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add an attachment question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(attachmentQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId });
    });

    await test.step('Preview the survey and confirm the attachment question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(surveyItemId, attachmentQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Create a copy of an attachment question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-275',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const attachmentQuestion = new AttachmentQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    let surveyItemId: string;
    let surveyItemIdCopy: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add an attachment question to copy', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(attachmentQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemId });
    });

    await test.step('Copy the attachment question', async () => {
      surveyItemIdCopy = await surveyAdminPage.designTab.surveyDesignerModal.copyQuestion(
        surveyItemId,
        attachmentQuestion.questionText
      );
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemIdCopy });
    });

    await test.step('Preview the survey and confirm the copied attachment question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const copiedQuestion = previewPage.getQuestion(surveyItemId, attachmentQuestion.questionText);
      const questionCopy = previewPage.getQuestion(surveyItemIdCopy, attachmentQuestion.questionText);

      await expect(copiedQuestion).toBeVisible();
      await expect(questionCopy).toBeVisible();
    });
  });

  test('Import an attachment question', async ({ sourceSurvey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-276',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceAttachmentQuestion = new AttachmentQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    let questionCreatedViaImport: string;

    await test.step("Navigate to the source survey's admin page", async () => {
      await surveyAdminPage.goto(sourceSurvey.id);
    });

    await test.step("Open the source survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add an attachment question to the source survey', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(sourceAttachmentQuestion);
    });

    await test.step("Navigate to the target survey's admin page", async () => {
      await surveyAdminPage.goto(targetSurvey.id);
    });

    await test.step("Open the target survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Import the attachment question into the target survey', async () => {
      questionCreatedViaImport = await surveyAdminPage.designTab.surveyDesignerModal.importQuestion(
        sourceSurvey.name,
        sourceAttachmentQuestion
      );
      surveyItemsToBeDeleted.push({ surveyItemId: questionCreatedViaImport });
    });

    await test.step('Preview the target survey and confirm the attachment question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(questionCreatedViaImport, sourceAttachmentQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Update an attachment question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-277',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const attachmentQuestion = new AttachmentQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    const updatedQuestion = { ...attachmentQuestion, questionText: `${attachmentQuestion.questionText} updated` };

    let createdQuestionItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create the attachment question to update', async () => {
      createdQuestionItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(attachmentQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId: createdQuestionItemId });
    });

    await test.step('Update the attachment question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.updateQuestion(createdQuestionItemId, updatedQuestion);
    });

    await test.step('Preview the survey and confirm the updated attachment question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const updatedQuestionElement = previewPage.getQuestion(createdQuestionItemId, updatedQuestion.questionText);
      await expect(updatedQuestionElement).toBeVisible();
    });
  });

  test('Move an attachment question on a page', async ({ surveyAdminPage }) => {
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
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create attachment questions', async () => {
      for (const attachmentQuestion of attachmentQuestions) {
        const surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(attachmentQuestion);
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({ surveyItemId: surveyItemId });
      }
    });

    await test.step('Move the second attachment question above the first attachment question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]);
    });

    await test.step('Preview the survey and confirm the second attachment question is displayed above the first attachment question', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const isAbove = await previewPage.questionIsAbove(surveyItemIds[1], surveyItemIds[0]);

      expect(isAbove).toBe(true);
    });
  });

  test('Move an attachment question to another page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-279',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const attachmentQuestion = new AttachmentQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create an attachment question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(attachmentQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemId, pageName: newPage.name });
    });

    await test.step('Create a new survey page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addPage(newPage);
    });

    await test.step('Move the attachment question to the new page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.goToPage(firstPageName);
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionToPage(surveyItemId, newPage.name);
    });

    await test.step('Preview the survey and confirm the attachment question is on the new page', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      
      await previewPage.nextButton.waitFor();
      await previewPage.nextButton.click();

      const question = previewPage.getQuestion(surveyItemId, attachmentQuestion.questionText);
      await expect(question).toBeVisible();
    });
  });

  test('Delete an attachment question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-312',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const attachmentQuestion = new AttachmentQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add an attachment question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(attachmentQuestion);
    });

    await test.step('Delete the attachment question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.deleteQuestion({
        surveyItemId: surveyItemId,
        questionText: attachmentQuestion.questionText,
      });
    });

    await test.step('Preview the survey and confirm the attachment question is not present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const question = previewPage.getQuestion(surveyItemId, attachmentQuestion.questionText);
      await expect(question).toBeHidden();
    });
  });
});
