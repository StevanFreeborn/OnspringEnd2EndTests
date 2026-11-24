import { FakeDataFactory, Survey, SurveyPage, TextQuestion } from '@stevanfreeborn/onspring-models';
import {
  SurveyDesignerQuestions,
  SurveyDesignerTasks,
  SurveyPreviewTargets,
  SurveyTasks,
} from '@stevanfreeborn/onspring-ui';
import { test as base, SurveyFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend<{ targetSurvey: Survey }>({
  targetSurvey: SurveyFixture.create().build(),
});

test.describe('survey page', () => {
  test.describe.configure({
    mode: 'default',
  });

  let targetSurvey: Survey;
  let pagesToBeDeleted: string[] = [];

  test.beforeAll('Create target survey', ({ targetSurvey: survey }) => {
    targetSurvey = survey;
  });

  test.beforeEach('Navigate to survey admin page', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(SurveyTasks.gotoSurvey(targetSurvey.id));
  });

  test.afterEach('Delete pages created during test', async ({ sysAdminActor }) => {
    for (const pageName of pagesToBeDeleted) {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.deletePage(pageName));
    }

    pagesToBeDeleted = [];
  });

  test('Create a survey page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-657',
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });
    pagesToBeDeleted.push(newPage.name);

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a question to page 1', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(createFakeTextQuestion()));
    });

    await test.step('Add a second page to the survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addPage(newPage));
    });

    await test.step('Add a question to page 2', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(createFakeTextQuestion()));
    });

    await test.step('Preview the survey and verify that page 2 is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor.browse().click(SurveyPreviewTargets.nextButton);
        await previewActor.browse().check(SurveyPreviewTargets.pageSelect).hasText(newPage.name);
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Edit a survey page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-658',
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    const updatedPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });
    pagesToBeDeleted.push(updatedPage.name);

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a question to page 1', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(createFakeTextQuestion()));
    });

    await test.step('Add a second page to the survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addPage(newPage));
    });

    await test.step('Add a question to page 2', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(createFakeTextQuestion()));
    });

    await test.step('Update page 2', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.updatePage(newPage.name, updatedPage));
    });

    await test.step('Preview the survey and verify that the updated page 2 is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor.browse().click(SurveyPreviewTargets.nextButton);
        await previewActor.browse().check(SurveyPreviewTargets.pageSelect).hasText(updatedPage.name);
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Delete a survey page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-659',
    });

    const pageOneQuestion = createFakeTextQuestion();
    let surveyItemId = '';

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a question to page 1', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(pageOneQuestion));
      surveyItemId = await sysAdminActor.asks(SurveyDesignerQuestions.surveyItemIdByText(pageOneQuestion.questionText));
    });

    await test.step('Add a second page to the survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addPage(newPage));
    });

    await test.step('Add a question to page 2', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(createFakeTextQuestion()));
    });

    await test.step('Delete page 2', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.deletePage(newPage.name));
    });

    await test.step('Preview the survey and verify that page 2 is not present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor.browse().check(SurveyPreviewTargets.pageSelect).isHidden();
        await previewActor
          .browse()
          .check(SurveyPreviewTargets.question(surveyItemId, pageOneQuestion.questionText))
          .isVisible();
      } finally {
        await previewActor.browse().close();
      }
    });
  });

  test('Move a survey page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-660',
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });
    pagesToBeDeleted.push(newPage.name);

    await test.step('Open the survey designer', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.openDesignTab(), SurveyTasks.openSurveyDesigner());
    });

    await test.step('Add a question to page 1', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(createFakeTextQuestion()));
    });

    await test.step('Add a second page to the survey', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addPage(newPage));
    });

    await test.step('Add a question to page 2', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.addQuestion(createFakeTextQuestion()));
    });

    await test.step('Move page 2 to be the first page', async () => {
      await sysAdminActor.attemptsTo(SurveyDesignerTasks.movePageAbove(newPage.name, 'Page 1'));
    });

    await test.step('Preview the survey and verify that page 2 is present', async () => {
      const previewActor = await sysAdminActor.asks(SurveyDesignerQuestions.previewSurvey());

      try {
        await previewActor.browse().check(SurveyPreviewTargets.pageSelect).hasText(newPage.name);
      } finally {
        await previewActor.browse().close();
      }
    });
  });
});

function createFakeTextQuestion(): TextQuestion {
  const questionId = FakeDataFactory.createFakeQuestionId();
  return new TextQuestion({
    questionId,
    questionText: questionId,
  });
}
