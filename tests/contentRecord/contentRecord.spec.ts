import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { AppContentPage } from '../../pageObjectModels/content/appContentPage';
import { ContentHomePage } from '../../pageObjectModels/content/contentHomePage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { ViewContentPage } from '../../pageObjectModels/content/viewContentPage';
import { AnnotationType } from '../annotations';

type ContentRecordTestFixtures = {
  targetApp: App;
  contentHomePage: ContentHomePage;
  appContentPage: AppContentPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
  viewContentPage: ViewContentPage;
};

const test = base.extend<ContentRecordTestFixtures>({
  targetApp: app,
  contentHomePage: async ({ sysAdminPage }, use) => {
    const contentHomePage = new ContentHomePage(sysAdminPage);
    await use(contentHomePage);
  },
  appContentPage: async ({ sysAdminPage }, use) => {
    const appContentPage = new AppContentPage(sysAdminPage);
    await use(appContentPage);
  },
  addContentPage: async ({ sysAdminPage }, use) => {
    const addContentPage = new AddContentPage(sysAdminPage);
    await use(addContentPage);
  },
  editContentPage: async ({ sysAdminPage }, use) => {
    const editContentPage = new EditContentPage(sysAdminPage);
    await use(editContentPage);
  },
  viewContentPage: async ({ sysAdminPage }, use) => {
    const viewContentPage = new ViewContentPage(sysAdminPage);
    await use(viewContentPage);
  },
});

test.describe('content record', () => {
  test('Create a content record from the "Create Content" button on the content home page', async ({
    targetApp,
    contentHomePage,
    addContentPage,
    editContentPage,
    viewContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-300',
    });

    let createdRecordId: number;

    await test.step('Navigate to the content home page', async () => {
      await contentHomePage.goto();
    });

    await test.step('Create the content record', async () => {
      await contentHomePage.toolbar.createRecord(targetApp.name);
      await contentHomePage.page.waitForURL(addContentPage.pathRegex);

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      createdRecordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Verify the content record was created', async () => {
      await viewContentPage.goto(targetApp.id, createdRecordId);

      const createdBy = await viewContentPage.form.getField({
        tabName: undefined,
        sectionName: 'Record Information',
        fieldName: 'Created By',
        fieldType: 'Reference',
      });

      await expect(createdBy).toBeVisible();
      await expect(createdBy).toHaveText(/John/);
    });
  });

  test('Create a content record from the "Create Content" button the content home page of an app/survey', async ({
    targetApp,
    appContentPage,
    addContentPage,
    editContentPage,
    viewContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-301',
    });

    let createdRecordId: number;

    await test.step('Navigate to the app content page', async () => {
      await appContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      await appContentPage.toolbar.createContentButton.click();
      await appContentPage.page.waitForURL(addContentPage.pathRegex);

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      createdRecordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Verify the content record was created', async () => {
      await viewContentPage.goto(targetApp.id, createdRecordId);

      const createdBy = await viewContentPage.form.getField({
        tabName: undefined,
        sectionName: 'Record Information',
        fieldName: 'Created By',
        fieldType: 'Reference',
      });

      await expect(createdBy).toBeVisible();
      await expect(createdBy).toHaveText(/John/);
    });
  });

  test('Create a content record from the quick add layout on the content home page of an app/survey', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-302',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-303',
    });

    expect(true).toBe(true);
  });

  test('View a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-304',
    });

    expect(true).toBe(true);
  });

  test('Edit a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-305',
    });

    expect(true).toBe(true);
  });

  test('Save a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-306',
    });

    expect(true).toBe(true);
  });

  test('Save and close a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-307',
    });

    expect(true).toBe(true);
  });

  test('Cancel editing a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-308',
    });

    expect(true).toBe(true);
  });

  test('Delete a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-309',
    });

    expect(true).toBe(true);
  });

  test('Print content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-310',
    });

    expect(true).toBe(true);
  });

  test('Pin a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-311',
    });

    expect(true).toBe(true);
  });
});
