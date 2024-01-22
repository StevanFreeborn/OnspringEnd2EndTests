import { test as base, expect } from '../../fixtures';
import { survey } from '../../fixtures/survey.fixtures';
import { Survey } from '../../models/survey';
import { SurveyAdminPage } from '../../pageObjectModels/surveys/surveyAdminPage';
import { AnnotationType } from '../annotations';

type AttachmentQuestionTestFixtures = {
  surveyAdminPage: SurveyAdminPage;
  survey: Survey;
};

const test = base.extend<AttachmentQuestionTestFixtures>({
  surveyAdminPage: async ({ sysAdminPage }, use) => {
    const surveyAdminPage = new SurveyAdminPage(sysAdminPage);
    await use(surveyAdminPage);
  },
  survey: survey,
});

test.describe('attachment question', function () {
  test('Create an attachment question', async function ({ survey, surveyAdminPage }) {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-274',
    });

    await test.step('Navigate to survey admin page', async () => {
      await surveyAdminPage.goto(survey.id);
    });

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.designSurveyLink.click();
      await surveyAdminPage.page.waitForLoadState('networkidle');

      if (await surveyAdminPage.designTab.surveyDesignerModal.autoSaveDialog.isVisible()) {
        await surveyAdminPage.designTab.surveyDesignerModal.autoSaveDialog.dismiss();
      }
    });

    await test.step('Add an attachment question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.attachmentButton.click();
      const attachmentQuestionEditForm =
        surveyAdminPage.designTab.surveyDesignerModal.getQuestionEditForm('Attachment');
      await attachmentQuestionEditForm.questionTextEditor.fill('Attachment Question');
      await attachmentQuestionEditForm.questionIdInput.fill('attachmentQuestion');
      await attachmentQuestionEditForm.dragBar.click();
      await surveyAdminPage.designTab.surveyDesignerModal.saveIndicator.waitFor({ state: 'hidden' });
      await surveyAdminPage.page.waitForTimeout(10000);
    });

    await test.step('Preview the survey and confirm the attachment question is present', async () => {
      const context = surveyAdminPage.page.context();
      const previewPagePromise = context.waitForEvent('page');
      await surveyAdminPage.designTab.surveyDesignerModal.previewButton.click();
      const previewPage = await previewPagePromise;
      const attachmentQuestion = previewPage.locator('.survey-item', { hasText: /Attachment Question/ });
      await expect(attachmentQuestion).toBeVisible();
    });

    // TODO: implement this test
    // create the survey
    // navigate to the designer
    // create an attachment questions
    // complete required fields then leave defaults as is
    // preview the survey...surveys auto save so might need to
    // detect the save and wait for it to complete before previewing
    // confirm the attachment question is present
  });

  test('Create a copy of an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-275',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Import an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-276',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Update an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-277',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Move an attachment question on a page', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-278',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Move an attachment question to another page', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-279',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Delete an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-312',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });
});
