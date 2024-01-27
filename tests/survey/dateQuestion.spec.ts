import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, surveyQuestionTest as test } from '../../fixtures';
import { DateQuestion } from '../../models/dateQuestion';
import { AnnotationType } from '../annotations';

test.describe('date/time question', () => {
  test('Create a date/time question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-344',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const dateQuestion = new DateQuestion({
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

    await test.step('Add a date question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(dateQuestion);
    });

    await test.step('Preview the survey and confirm the date question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(surveyItemId, dateQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Create a copy of a date/time question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-345',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const dateQuestion = new DateQuestion({
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

    await test.step('Add a date question to copy', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(dateQuestion);
    });

    await test.step('Copy the date question', async () => {
      surveyItemIdCopy = await surveyAdminPage.designTab.surveyDesignerModal.copyQuestion(
        surveyItemId,
        dateQuestion.questionText
      );
    });

    await test.step('Preview the survey and confirm the copied date question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const copiedQuestion = previewPage.getQuestion(surveyItemId, dateQuestion.questionText);
      const questionCopy = previewPage.getQuestion(surveyItemIdCopy, dateQuestion.questionText);

      await expect(copiedQuestion).toBeVisible();
      await expect(questionCopy).toBeVisible();
    });
  });

  test('Import a date/time question', async ({ sourceSurvey, targetSurvey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-346',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceDateQuestion = new DateQuestion({
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

    await test.step('Add an date question to the source survey', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(sourceDateQuestion);
    });

    await test.step("Navigate to the target survey's admin page", async () => {
      await surveyAdminPage.goto(targetSurvey.id);
    });

    await test.step("Open the target survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Import the date question into the target survey', async () => {
      questionCreatedViaImport = await surveyAdminPage.designTab.surveyDesignerModal.importQuestion(
        sourceSurvey.name,
        sourceDateQuestion
      );
    });

    await test.step('Preview the target survey and confirm the date question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(questionCreatedViaImport, sourceDateQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Update a date/time question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-347',
    });

    // TODO: Implement test
    expect(true).toBeTruthy();
  });

  test('Move a date/time question on a page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-348',
    });

    // TODO: Implement test
    expect(true).toBeTruthy();
  });

  test('Move a date/time question to another page.', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-349',
    });

    // TODO: Implement test
    expect(true).toBeTruthy();
  });

  test('Delete a date/time question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-350',
    });

    // TODO: Implement test
    expect(true).toBeTruthy();
  });
});
