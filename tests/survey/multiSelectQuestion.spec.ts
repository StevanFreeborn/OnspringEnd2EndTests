import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { ListValue } from '../../models/listValue';
import { MultiSelectQuestion } from '../../models/multiSelectQuestion';
import { AnnotationType } from '../annotations';
import { expect, surveyQuestionTest as test } from './../../fixtures/index';

test.describe('multi select question', () => {
  test('Create a multi select question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-559',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const multiSelectQuestion = new MultiSelectQuestion({
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

    await test.step('Add a multi select question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(multiSelectQuestion);
    });

    await test.step('Preview the survey and confirm the multi select question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(surveyItemId, multiSelectQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Create a copy of a multi select question', async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-560',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const multiSelectQuestion = new MultiSelectQuestion({
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

    await test.step('Add a multi select question to copy', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(multiSelectQuestion);
    });

    await test.step('Copy the multi select question', async () => {
      surveyItemIdCopy = await surveyAdminPage.designTab.surveyDesignerModal.copyQuestion(
        surveyItemId,
        multiSelectQuestion.questionText
      );
    });

    await test.step('Preview the survey and confirm the copied multi select question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const copiedQuestion = previewPage.getQuestion(surveyItemId, multiSelectQuestion.questionText);
      const questionCopy = previewPage.getQuestion(surveyItemIdCopy, multiSelectQuestion.questionText);

      await expect(copiedQuestion).toBeVisible();
      await expect(questionCopy).toBeVisible();
    });
  });
});
