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

  test('Create a copy of a date/time question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-345',
    });

    // TODO: Implement test
    expect(true).toBeTruthy();
  });

  test('Import a date/time question', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-346',
    });

    // TODO: Implement test
    expect(true).toBeTruthy();
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