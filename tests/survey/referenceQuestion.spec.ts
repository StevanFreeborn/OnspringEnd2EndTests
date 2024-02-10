import { DeleteQuestionRequest } from '../../componentObjectModels/modals/surveyDesignerModal';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, surveyQuestionTest as test } from '../../fixtures';
import { createApp } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { ReferenceQuestion } from '../../models/referenceQuestion';
import { Survey } from '../../models/survey';
import { SurveyPage } from '../../models/surveyPage';
import { AppsAdminPage } from '../../pageObjectModels/apps/appsAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { AnnotationType } from '../annotations';

test.describe('reference question', () => {
  test.describe.configure({
    mode: 'default',
  });

  let targetSurvey: Survey;
  let referencedApp: App;
  let surveyItemsToBeDeleted: DeleteQuestionRequest[] = [];

  test.beforeAll(
    'Create target survey, referenced app, and answer value content record',
    async ({ sysAdminPage, targetSurvey: survey }) => {
      targetSurvey = survey;
      referencedApp = await createApp(sysAdminPage);

      const addContentPage = new AddContentPage(sysAdminPage);
      const editContentPage = new EditContentPage(sysAdminPage);

      await addContentPage.goto(referencedApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    }
  );

  test.beforeEach('Navigate to survey admin page', async ({ surveyAdminPage }) => {
    await surveyAdminPage.goto(targetSurvey.id);
  });

  test.afterEach('Delete questions created during the test', async ({ surveyAdminPage }) => {
    await surveyAdminPage.goto(targetSurvey.id);
    await surveyAdminPage.designTabButton.click();
    await surveyAdminPage.designTab.openSurveyDesigner();

    for (const itemToBeDeleted of surveyItemsToBeDeleted) {
      await surveyAdminPage.designTab.surveyDesignerModal.deleteQuestion({
        surveyItemId: itemToBeDeleted.surveyItemId,
        pageName: itemToBeDeleted.pageName,
      });
    }

    surveyItemsToBeDeleted = [];
  });

  test.afterAll('Delete the referenced app created during the test', async ({ sysAdminPage }) => {
    const appsAdminPage = new AppsAdminPage(sysAdminPage);
    await appsAdminPage.deleteApps([referencedApp.name]);
  });

  test('Create a reference question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-587',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const referenceQuestion = new ReferenceQuestion({
      questionId: questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a reference question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(referenceQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemId });
    });

    await test.step('Preview the survey and confirm the reference question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(surveyItemId, referenceQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Create a copy of a reference question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-588',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const referenceQuestion = new ReferenceQuestion({
      questionId: questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    let surveyItemId: string;
    let surveyItemIdCopy: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a reference question to copy', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(referenceQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemId });
    });

    await test.step('Copy the reference question', async () => {
      surveyItemIdCopy = await surveyAdminPage.designTab.surveyDesignerModal.copyQuestion(
        surveyItemId,
        referenceQuestion.questionText
      );
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemIdCopy });
    });

    await test.step('Preview the survey and confirm the copied reference question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const copiedQuestion = previewPage.getQuestion(surveyItemId, referenceQuestion.questionText);
      const questionCopy = previewPage.getQuestion(surveyItemIdCopy, referenceQuestion.questionText);

      await expect(copiedQuestion).toBeVisible();
      await expect(questionCopy).toBeVisible();
    });
  });

  test('Import a reference question', async ({ sourceSurvey, surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-589',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const sourceReferenceQuestion = new ReferenceQuestion({
      questionId: questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    let questionCreatedViaImport: string;

    await test.step("Navigate to the source survey's admin page", async () => {
      await surveyAdminPage.goto(sourceSurvey.id);
    });

    await test.step("Open the source survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a reference question to the source survey', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(sourceReferenceQuestion);
    });

    await test.step("Navigate to the target survey's admin page", async () => {
      await surveyAdminPage.goto(targetSurvey.id);
    });

    await test.step("Open the target survey's survey designer", async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Import the reference question into the target survey', async () => {
      questionCreatedViaImport = await surveyAdminPage.designTab.surveyDesignerModal.importQuestion(
        sourceSurvey.name,
        sourceReferenceQuestion
      );
      surveyItemsToBeDeleted.push({ surveyItemId: questionCreatedViaImport });
    });

    await test.step('Preview the target survey and confirm the reference question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const createdQuestion = previewPage.getQuestion(questionCreatedViaImport, sourceReferenceQuestion.questionText);
      await expect(createdQuestion).toBeVisible();
    });
  });

  test('Update a reference question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-590',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const referenceQuestion = new ReferenceQuestion({
      questionId: questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    const updatedQuestion = { ...referenceQuestion, questionText: `${referenceQuestion.questionText} updated` };

    let createdQuestionItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create the reference question to update', async () => {
      createdQuestionItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(referenceQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId: createdQuestionItemId });
    });

    await test.step('Update the reference question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.updateQuestion(createdQuestionItemId, updatedQuestion);
    });

    await test.step('Preview the survey and confirm the updated reference question is present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const updatedQuestionElement = previewPage.getQuestion(createdQuestionItemId, updatedQuestion.questionText);
      await expect(updatedQuestionElement).toBeVisible();
    });
  });

  test('Move a reference question on a page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-591',
    });

    const referenceQuestions = [
      new ReferenceQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Reference Question 1',
        appReference: referencedApp.name,
        answerValues: 'ALL',
      }),
      new ReferenceQuestion({
        questionId: FakeDataFactory.createFakeQuestionId(),
        questionText: 'Reference Question 2',
        appReference: referencedApp.name,
        answerValues: 'ALL',
      }),
    ];

    const surveyItemIds: string[] = [];

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create reference questions', async () => {
      for (const referenceQuestion of referenceQuestions) {
        const surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(referenceQuestion);
        surveyItemIds.push(surveyItemId);
        surveyItemsToBeDeleted.push({ surveyItemId: surveyItemId });
      }
    });

    await test.step('Move the second reference question above the first reference question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionAbove(surveyItemIds[1], surveyItemIds[0]);
    });

    await test.step('Preview the survey and confirm the second reference question is displayed above the first reference question', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const isAbove = await previewPage.questionIsAbove(surveyItemIds[1], surveyItemIds[0]);

      expect(isAbove).toBe(true);
    });
  });

  test('Move a reference question to another page', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-592',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();
    const firstPageName = 'Page 1';

    const referenceQuestion = new ReferenceQuestion({
      questionId: questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    const newPage = new SurveyPage({
      name: FakeDataFactory.createFakeSurveyPageName(),
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Create a reference question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(referenceQuestion);
      surveyItemsToBeDeleted.push({ surveyItemId: surveyItemId, pageName: newPage.name });
    });

    await test.step('Create a new survey page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.addPage(newPage);
    });

    await test.step('Move the reference question to the new page', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.goToPage(firstPageName);
      await surveyAdminPage.designTab.surveyDesignerModal.moveQuestionToPage(surveyItemId, newPage.name);
    });

    await test.step('Preview the survey and confirm the reference question is on the new page', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      await previewPage.nextButton.click();

      const question = previewPage.getQuestion(surveyItemId, referenceQuestion.questionText);
      await expect(question).toBeVisible();
    });
  });

  test('Delete a reference question', async ({ surveyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-593',
    });

    const questionId = FakeDataFactory.createFakeQuestionId();

    const referenceQuestion = new ReferenceQuestion({
      questionId: questionId,
      questionText: questionId,
      appReference: referencedApp.name,
      answerValues: 'ALL',
    });

    let surveyItemId: string;

    await test.step('Open the survey designer', async () => {
      await surveyAdminPage.designTabButton.click();
      await surveyAdminPage.designTab.openSurveyDesigner();
    });

    await test.step('Add a reference question', async () => {
      surveyItemId = await surveyAdminPage.designTab.surveyDesignerModal.addQuestion(referenceQuestion);
    });

    await test.step('Delete the reference question', async () => {
      await surveyAdminPage.designTab.surveyDesignerModal.deleteQuestion({
        surveyItemId: surveyItemId,
        questionText: referenceQuestion.questionText,
      });
    });

    await test.step('Preview the survey and confirm the reference question is not present', async () => {
      const previewPage = await surveyAdminPage.designTab.surveyDesignerModal.previewSurvey();
      const question = previewPage.getQuestion(surveyItemId, referenceQuestion.questionText);
      await expect(question).toBeHidden();
    });
  });
});
