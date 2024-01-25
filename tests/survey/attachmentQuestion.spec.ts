import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { survey } from '../../fixtures/survey.fixtures';
import { AttachmentQuestion } from '../../models/attachmentQuestion';
import { Survey } from '../../models/survey';
import { SurveyAdminPage } from '../../pageObjectModels/surveys/surveyAdminPage';
import { AnnotationType } from '../annotations';

type AttachmentQuestionTestFixtures = {
  surveyAdminPage: SurveyAdminPage;
  survey: Survey;
};

const test = base.extend<AttachmentQuestionTestFixtures>({
  surveyAdminPage: async ({ sysAdminPage }, use) => {
    const surveyAdminPage = new SurveyAdminPage(sysAdminPage);
    await use(surveyAdminPage);
  },
  survey: survey,
});

test.describe('attachment question', function () {
  test('Create an attachment question', async function ({ survey, surveyAdminPage }) {
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

    await test.step('Navigate to survey admin page', async () => {
      await surveyAdminPage.goto(survey.id);
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add an attachment question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(attachmentQuestion);
    });

    await test.step('Preview the survey and confirm the attachment question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(surveyItemId, attachmentQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Create a copy of an attachment question', async function ({ survey, surveyAdminPage }) {
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

    await test.step('Navigate to survey admin page', async () => {
      await surveyAdminPage.goto(survey.id);
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add an attachment question to copy', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(attachmentQuestion);
    });

    await test.step('Copy the attachment question', async () => {
      surveyItemIdCopy = await surveyAdminPage.designTab.surveyDesignerModal.copyQuestion(
        surveyItemId,
        attachmentQuestion.questionText
      );
    });

    await test.step('Preview the survey and confirm the copied attachment question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const copiedQuestion = previewPage.getQuestion(surveyItemId, attachmentQuestion.questionText);
      const questionCopy = previewPage.getQuestion(surveyItemIdCopy, attachmentQuestion.questionText);

      await expect(copiedQuestion).toBeVisible();
      await expect(questionCopy).toBeVisible();
    });
  });

  test('Import an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-276',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Update an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-277',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Move an attachment question on a page', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-278',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Move an attachment question to another page', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-279',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Delete an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-312',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });
});
