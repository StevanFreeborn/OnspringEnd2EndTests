import { expect } from '@playwright/test';
import { FakeDataFactory, Survey, SurveyAnswerField, TextQuestion } from '@stevanfreeborn/onspring-models';
import {
  AppLayoutTabTargets,
  AppTasks,
  FieldQuestions,
  FieldTargets,
  FieldTasks,
  SurveyAnswerFieldTargets,
  SurveyAnswerFieldTasks,
  SurveyDesignerTasks,
  SurveyTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { test as base, SurveyFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

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

    const creation: FieldCreationState = {};

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
        creation.fieldName = field.name;

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
      await cleanupSurveyAnswerField(sysAdminActor, survey.id, creation);
    }
  });

  test('Update a survey answer field', async ({ sysAdminActor, survey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-654',
    });

    const questionText = FakeDataFactory.createFakeQuestionId('survey-answer-update-question');
    const question = new TextQuestion({
      questionId: questionText,
      questionText,
    });
    const field = new SurveyAnswerField({
      name: FakeDataFactory.createFakeFieldName('survey-answer-update-test'),
      description: 'Survey answer field before the Test-654 update.',
      questionText,
    });
    const updatedField = new SurveyAnswerField({
      name: FakeDataFactory.createFakeFieldName('survey-answer-updated-test'),
      description: 'Survey answer field updated by Test-654.',
      questionText,
    });
    const creation: FieldCreationState = {};

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
        await sysAdminActor.attemptsTo(SurveyAnswerFieldTasks.addFromSurveyLayout({ field }), AppTasks.closeLayout());
        creation.fieldName = field.name;
      });

      await test.step('Update the survey answer field', async () => {
        await sysAdminActor.attemptsTo(
          SurveyAnswerFieldTasks.updateFromGrid({ currentName: field.name, updatedField })
        );
        creation.fieldName = updatedField.name;
      });

      await test.step('Verify the updated field values persisted', async () => {
        await sysAdminActor.browse().check(FieldTargets.rowByName(updatedField.name)).isVisible();
        await sysAdminActor
          .browse()
          .check(FieldTargets.rowCellAt(updatedField.name, 1))
          .containsText(updatedField.description);

        await sysAdminActor.attemptsTo(SurveyAnswerFieldTasks.openFromGrid(updatedField.name));
        await sysAdminActor.browse().check(FieldTargets.modal.nameInput(0)).hasValue(updatedField.name);
        await sysAdminActor
          .browse()
          .check(SurveyAnswerFieldTargets.modal.descriptionEditor(0))
          .containsText(updatedField.description);
      });
    } finally {
      await cleanupSurveyAnswerField(sysAdminActor, survey.id, creation);
    }
  });

  test('Delete a survey answer field', async ({ sysAdminActor, survey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-655',
    });

    const questionText = FakeDataFactory.createFakeQuestionId('survey-answer-delete-question');
    const question = new TextQuestion({
      questionId: questionText,
      questionText,
    });
    const field = new SurveyAnswerField({
      name: FakeDataFactory.createFakeFieldName('survey-answer-delete-test'),
      description: 'Survey answer field deleted by Test-655.',
      questionText,
    });
    const creation: FieldCreationState = {};

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
        await sysAdminActor.attemptsTo(SurveyAnswerFieldTasks.addFromSurveyLayout({ field }), AppTasks.closeLayout());
        creation.fieldName = field.name;
      });

      await test.step('Delete the survey answer field', async () => {
        await sysAdminActor.attemptsTo(FieldTasks.deleteFromGrid(field.name));
        creation.fieldName = undefined;
      });

      await test.step('Verify the field was deleted', async () => {
        await sysAdminActor.browse().check(FieldTargets.rowByName(field.name)).isHidden();
      });
    } finally {
      await cleanupSurveyAnswerField(sysAdminActor, survey.id, creation);
    }
  });
});

type FieldCreationState = {
  fieldName?: string;
};

async function cleanupSurveyAnswerField(actor: WebActor, surveyId: number, state: FieldCreationState): Promise<void> {
  if (!state.fieldName) {
    return;
  }

  await actor.attemptsTo(SurveyTasks.gotoSurveyLayoutsTab(surveyId), FieldTasks.deleteFromGrid(state.fieldName));
}
