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
});
