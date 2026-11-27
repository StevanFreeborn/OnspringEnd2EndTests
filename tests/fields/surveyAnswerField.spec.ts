import { expect } from '@playwright/test';
import { FakeDataFactory, Survey, SurveyAnswerField, TextQuestion } from '@stevanfreeborn/onspring-models';
import {
  AppLayoutTabTargets,
  AppTasks,
  FieldQuestions,
  FieldTargets,
  FieldTasks,
  SurveyAnswerFieldTasks,
  SurveyDesignerTasks,
  SurveyTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { test as base, SurveyFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type FieldCreationState = {
  created: boolean;
};

async function cleanupSurveyAnswerField(
  actor: WebActor,
  surveyId: number,
  fieldName: string,
  state: FieldCreationState
): Promise<void> {
  if (!state.created) {
    return;
  }

  await actor.attemptsTo(SurveyTasks.gotoSurveyLayoutsTab(surveyId), FieldTasks.deleteFromGrid(fieldName));
}

const test = base.extend<{ survey: Survey }>({
  survey: SurveyFixture.create().build(),
});

test.describe('survey answer field', () => {
  test('Create a survey answer field', async ({ sysAdminActor, survey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-653',
    });

    const questionText = FakeDataFactory.createFakeQuestionId('survey-answer-question-test');
    const question = new TextQuestion({
      questionId: questionText,
      questionText,
    });
    const field = new SurveyAnswerField({
      name: FakeDataFactory.createFakeFieldName('survey-answer-test'),
      description: 'Survey answer field created by Test-653.',
      questionText,
    });
    const placement = {
      tabName: 'Survey Information',
      sectionName: 'Survey Content',
      column: 1,
      row: 1,
    };

    const creation: FieldCreationState = { created: false };

    try {
      await test.step('Add a question to the survey', async () => {
        await sysAdminActor.attemptsTo(
          SurveyTasks.gotoSurveyDesignTab(survey.id),
          SurveyTasks.openSurveyDesigner(),
          SurveyDesignerTasks.addQuestion(question),
          SurveyDesignerTasks.close()
        );
      });

      await test.step('Create the survey answer field from the default layout', async () => {
        await sysAdminActor.attemptsTo(SurveyAnswerFieldTasks.addFromSurveyLayout({ field }));
        creation.created = true;

        const fieldInBank = AppLayoutTabTargets.designer.fieldFromBank(field.name);
        await sysAdminActor.browse().check(fieldInBank).isVisible();
        await sysAdminActor
          .browse()
          .check(fieldInBank)
          .doesNotHaveClass(/ui-draggable-disabled/);
      });

      await test.step('Place the field on the default layout and save', async () => {
        const section = AppLayoutTabTargets.designer.canvasSectionByName(placement.sectionName);

        await sysAdminActor.attemptsTo(AppTasks.dragFieldOntoLayout({ ...placement, fieldName: field.name }));
        await sysAdminActor
          .browse()
          .check(AppLayoutTabTargets.designer.dropzoneInSectionAt(section, placement.column, placement.row))
          .containsText(field.name);
        await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
      });

      await test.step('Verify the field was created', async () => {
        await sysAdminActor.browse().check(FieldTargets.rowByName(field.name)).isVisible();

        field.id = await sysAdminActor.asks(FieldQuestions.fieldIdInGrid(field.name));
        expect(field.id).toBeGreaterThan(0);
      });
    } finally {
      await cleanupSurveyAnswerField(sysAdminActor, survey.id, field.name, creation);
    }
  });
});
