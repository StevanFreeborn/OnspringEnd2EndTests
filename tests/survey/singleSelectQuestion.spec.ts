import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, surveyQuestionTest as test } from '../../fixtures';
import { ListValue } from '../../models/listValue';
import { SingleSelectQuestion } from '../../models/singleSelectQuestion';
import { AnnotationType } from '../annotations';

test.describe('single select question', () => {
  test('Create a single select question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-645',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const singleSelectQuestion = new SingleSelectQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let surveyItemId: string;

    await test.step('Navigate to survey admin page', async () => {
      await surveyAdminPage.goto(survey.id);
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a single select question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(singleSelectQuestion);
    });

    await test.step('Preview the survey and confirm the single select question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(surveyItemId, singleSelectQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Create a copy of a single select question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-646',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const singleSelectQuestion = new SingleSelectQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
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

    await test.step('Add a single select question to copy', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(singleSelectQuestion);
    });

    await test.step('Copy the single select question', async () => {
      surveyItemIdCopy = await surveyAdminPage.designTab.surveyDesignerModal.copyQuestion(
        surveyItemId,
        singleSelectQuestion.questionText
      );
    });

    await test.step('Preview the survey and confirm the copied single select question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const copiedQuestion = previewPage.getQuestion(surveyItemId, singleSelectQuestion.questionText);
      const questionCopy = previewPage.getQuestion(surveyItemIdCopy, singleSelectQuestion.questionText);

      await expect(copiedQuestion).toBeVisible();
      await expect(questionCopy).toBeVisible();
    });
  });

  test('Import a single select question', async ({ sourceSurvey, targetSurvey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-647',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceSingleSelectQuestion = new SingleSelectQuestion({
      questionId: questionId,
      questionText: questionId,
      answerValues: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    let questionCreatedViaImport: string;

    await test.step("Navigate to the source survey's admin page", async () => {
      await surveyAdminPage.goto(sourceSurvey.id);
    });

    await test.step("Open the source survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a single select question to the source survey', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(sourceSingleSelectQuestion);
    });

    await test.step("Navigate to the target survey's admin page", async () => {
      await surveyAdminPage.goto(targetSurvey.id);
    });

    await test.step("Open the target survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Import the single select question into the target survey', async () => {
      questionCreatedViaImport = await surveyAdminPage.designTab.surveyDesignerModal.importQuestion(
        sourceSurvey.name,
        sourceSingleSelectQuestion
      );
    });

    await test.step('Preview the target survey and confirm the single select question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(
        questionCreatedViaImport,
        sourceSingleSelectQuestion.questionText
      );
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Update a single select question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-648',
    });
  });

  test('Move a single select question on a page', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-649',
    });
  });

  test('Move a single select question to another page.', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-650',
    });
  });

  test('Delete a single select question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-651',
    });
  });
});
