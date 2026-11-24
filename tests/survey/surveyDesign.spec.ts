import { FakeDataFactory, FormattedText, Survey, TextQuestion } from '@stevanfreeborn/onspring-models';
import {
  SurveyDesignerQuestions,
  SurveyDesignerTasks,
  SurveyPreviewTargets,
  SurveyTasks,
} from '@stevanfreeborn/onspring-ui';
import { test as base, SurveyFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend<{ survey: Survey }>({
  survey: SurveyFixture.create().build(),
});

test.describe('survey design', () => {
  test("Preview a survey's design", async ({ sysAdminActor, survey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-656',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const question = new TextQuestion({
      questionId,
      questionText: questionId,
    });

    const formattedText = new FormattedText({
      formattedText: 'Thank you for taking the survey!',
      objectId: 'Thank You',
    });

    let questionItemId = '';
    let formattedTextItemId = '';

    await test.step('Navigate to the survey admin page and open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.gotoSurveyDesignTab(survey.id), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a question to the survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(question));
      questionItemId = await sysAdminActor.asks(SurveyDesignerQuestions.surveyItemIdByText(question.questionText));
    });

    await test.step('Add a thank you message to the thank you page', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.goToPage('Thank You'));
      formattedTextItemId = await sysAdminActor.asks(SurveyDesignerQuestions.nthSurveyItemId(0));
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.updateFormattedText(formattedTextItemId, formattedText));
    });

    await test.step('Preview the survey and complete and submit it', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(questionItemId, question.questionText))
          .isVisible();
        await previewActor.browse().click(SurveyPreviewTargets.completeAndSubmitButton);
        await previewActor.browse().check(SurveyPreviewTargets.text(formattedText.formattedText)).isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });
});
