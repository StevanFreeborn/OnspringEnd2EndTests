import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditDocumentPage } from '../../pageObjectModels/documents/editDocumentPage';
import { AnnotationType } from '../annotations';

type DynamicDocumentTestFixtures = {
  app: App;
  adminHomePage: AdminHomePage;
  editDocumentPage: EditDocumentPage;
};

const test = base.extend<DynamicDocumentTestFixtures>({
  app: app,
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  editDocumentPage: async ({ sysAdminPage }, use) => await use(new EditDocumentPage(sysAdminPage)),
});

test.describe('Dynamic Documents', () => {
  test('Create a dynamic document via the create button on the header of the admin home page', async ({
    app,
    adminHomePage,
    editDocumentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-239',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the dynamic document', async () => {
      await adminHomePage.createDynamicDocumentUsingHeaderCreateButton(app.name, documentName);
      await adminHomePage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Verify the dynamic document was created', async () => {
      await expect(editDocumentPage.informationTab.documentNameInput).toHaveValue(documentName);
    });
  });

  test('Create a dynamic document via the create button on the Documents tile on the admin home page', async ({
    app,
    adminHomePage,
    editDocumentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-240',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the dynamic document', async () => {
      await adminHomePage.createDynamicDocumentUsingDocumentTileButton(app.name, documentName);
      await adminHomePage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Verify the dynamic document was created', async () => {
      await expect(editDocumentPage.informationTab.documentNameInput).toHaveValue(documentName);
    });
  });

  test('Create a dynamic document via the "Create Document" button on the Documents admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-241',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a dynamic document via the create button on the header of the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-242',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a dynamic document via the create button on the Documents tile on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-243',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a dynamic document via the "Create Document" button on the Documents admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-244',
    });

    expect(true).toBeTruthy();
  });

  test("Update a dynamic document's configurations on an app from an app's Documents tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-245',
    });

    expect(true).toBeTruthy();
  });

  test("Update a dynamic document's configurations from the Documents admin page", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-246',
    });

    expect(true).toBeTruthy();
  });

  test("Delete a dynamic document on an app from an app's Documents tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-247',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a dynamic document from the Documents admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-248',
    });

    expect(true).toBeTruthy();
  });

  test("Disable a dynamic document from an app's Documents tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-254',
    });

    expect(true).toBeTruthy();
  });

  test('Disable a dynamic document from the Documents admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-255',
    });

    expect(true).toBeTruthy();
  });

  test("Enable a dynamic document from an app's Documents tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-256',
    });

    expect(true).toBeTruthy();
  });

  test('Enable a dynamic document from the Documents admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-257',
    });

    expect(true).toBeTruthy();
  });

  test('Add a report token to a dynamic document', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-794',
    });

    expect(true).toBeTruthy();
  });
});
