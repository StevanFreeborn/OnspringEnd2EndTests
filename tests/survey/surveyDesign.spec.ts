import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, surveyQuestionTest as test } from '../../fixtures';
import { FormattedText } from '../../models/formattedText';
import { TextQuestion } from '../../models/textQuestion';
import { AnnotationType } from '../annotations';

test.describe('survey design', () => {
  test("Preview a survey's design", async ({ targetSurvey: survey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-656',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const question = new TextQuestion({
      questionId: questionId,
      questionText: questionId,
    });

    const formattedText = new FormattedText({
      formattedText: 'Thank you for taking the survey!',
      objectId: 'Thank You',
    });

    let questionItemId: string;
    let formattedTextItemId: string;

    await test.step('Navigate to the survey admin page', async () => {
      await surveyAdminPage.goto(survey.id);
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a question to the survey', async () => {
      questionItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(question);
    });

    await test.step('Add a thank you message to the thank you page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.goToPage('Thank You');
      formattedTextItemId = await surveyAdminPage.designTab.surveyDesignerModal.getNthSurveyItemId(0);
      await surveyAdminPage.designTab.surveyDesignerModal.updatedFormattedText(formattedTextItemId, formattedText);
    });

    await test.step('Preview the survey and complete and submit it', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const questionAdded = previewPage.getQuestion(questionItemId, question.questionText);

      await expect(questionAdded).toBeVisible();

      await previewPage.completeAndSubmitButton.click();

      const thankYouMessage = previewPage.page.getByText(formattedText.formattedText);
      await expect(thankYouMessage).toBeVisible();
    });
  });
});
