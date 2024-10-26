import { Document, Paragraph } from 'docx';
import { GetAttachmentFieldParams } from '../../componentObjectModels/forms/addOrEditRecordForm';
import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { Locator, test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AttachmentField } from '../../models/attachmentField';
import { DynamicDocument } from '../../models/dynamicDocument';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { DocumentAdminPage } from '../../pageObjectModels/documents/documentAdminPage';
import { EditDocumentPage } from '../../pageObjectModels/documents/editDocumentPage';
import { ReportAppPage } from '../../pageObjectModels/reports/reportAppPage';
import { ReportPage } from '../../pageObjectModels/reports/reportPage';
import { AnnotationType } from '../annotations';
import { SavedReportAsReportDataOnly } from './../../models/report';

type DynamicDocumentTestFixtures = {
  app: App;
  adminHomePage: AdminHomePage;
  editDocumentPage: EditDocumentPage;
  documentAdminPage: DocumentAdminPage;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
  reportAppPage: ReportAppPage;
  reportPage: ReportPage;
};

const test = base.extend<DynamicDocumentTestFixtures>({
  app: app,
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  editDocumentPage: async ({ sysAdminPage }, use) => await use(new EditDocumentPage(sysAdminPage)),
  documentAdminPage: async ({ sysAdminPage }, use) => await use(new DocumentAdminPage(sysAdminPage)),
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  addContentPage: async ({ sysAdminPage }, use) => await use(new AddContentPage(sysAdminPage)),
  editContentPage: async ({ sysAdminPage }, use) => await use(new EditContentPage(sysAdminPage)),
  reportAppPage: async ({ sysAdminPage }, use) => await use(new ReportAppPage(sysAdminPage)),
  reportPage: async ({ sysAdminPage }, use) => await use(new ReportPage(sysAdminPage)),
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

  test('Create a dynamic document via the "Create Document" button on the Documents admin page', async ({
    app,
    documentAdminPage,
    editDocumentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-241',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the Documents admin page', async () => {
      await documentAdminPage.goto();
    });

    await test.step('Create the dynamic document', async () => {
      await documentAdminPage.createDocument(app.name, documentName);
      await documentAdminPage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Verify the dynamic document was created', async () => {
      await expect(editDocumentPage.informationTab.documentNameInput).toHaveValue(documentName);
    });
  });

  test("Create a dynamic document via the Add Document button on an app's Documents tab", async ({
    app,
    appAdminPage,
    editDocumentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-866',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step("Navigate to the app's Documents tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();
    });

    await test.step('Create the dynamic document', async () => {
      await appAdminPage.documentsTab.createDocument(documentName);
      await appAdminPage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Verify the dynamic document was created', async () => {
      await expect(editDocumentPage.informationTab.documentNameInput).toHaveValue(documentName);
    });
  });

  test('Create a copy of a dynamic document via the create button on the header of the admin home page', async ({
    app,
    adminHomePage,
    editDocumentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-242',
    });

    const documentToCopy = FakeDataFactory.createFakeDocumentName();
    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the dynamic document to copy', async () => {
      await adminHomePage.createDynamicDocumentUsingHeaderCreateButton(app.name, documentToCopy);
      await adminHomePage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a copy of the dynamic document', async () => {
      await adminHomePage.createDynamicDocumentCopyUsingHeaderCreateButton(app.name, documentToCopy, documentName);
      await adminHomePage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Verify the dynamic document was created', async () => {
      await expect(editDocumentPage.informationTab.documentNameInput).toHaveValue(documentName);
    });
  });

  test('Create a copy of a dynamic document via the create button on the Documents tile on the admin home page', async ({
    app,
    adminHomePage,
    editDocumentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-243',
    });

    const documentToCopy = FakeDataFactory.createFakeDocumentName();
    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the dynamic document to copy', async () => {
      await adminHomePage.createDynamicDocumentUsingDocumentTileButton(app.name, documentToCopy);
      await adminHomePage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a copy of the dynamic document', async () => {
      await adminHomePage.createDynamicDocumentCopyUsingDocumentTileButton(app.name, documentToCopy, documentName);
      await adminHomePage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Verify the dynamic document was created', async () => {
      await expect(editDocumentPage.informationTab.documentNameInput).toHaveValue(documentName);
    });
  });

  test('Create a copy of a dynamic document via the "Create Document" button on the Documents admin page', async ({
    app,
    documentAdminPage,
    editDocumentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-244',
    });

    const documentToCopy = FakeDataFactory.createFakeDocumentName();
    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the Documents admin page', async () => {
      await documentAdminPage.goto();
    });

    await test.step('Create the dynamic document to copy', async () => {
      await documentAdminPage.createDocument(app.name, documentToCopy);
      await documentAdminPage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Navigate back to the Documents admin page', async () => {
      await documentAdminPage.goto();
    });

    await test.step('Create a copy of the dynamic document', async () => {
      await documentAdminPage.createDocumentCopy(app.name, documentToCopy, documentName);
      await documentAdminPage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Verify the dynamic document was created', async () => {
      await expect(editDocumentPage.informationTab.documentNameInput).toHaveValue(documentName);
    });
  });

  test("Create a copy of a dynamic document via the Add Document button on an app's Documents tab", async ({
    app,
    appAdminPage,
    editDocumentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-867',
    });

    const documentToCopy = FakeDataFactory.createFakeDocumentName();
    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step("Navigate to the app's Documents tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();
    });

    await test.step('Create the dynamic document to copy', async () => {
      await appAdminPage.documentsTab.createDocument(documentToCopy);
      await appAdminPage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Navigate back to the app Documents tab', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();
    });

    await test.step('Create a copy of the dynamic document', async () => {
      await appAdminPage.documentsTab.createDocumentCopy(documentToCopy, documentName);
      await appAdminPage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Verify the dynamic document was created', async () => {
      await expect(editDocumentPage.informationTab.documentNameInput).toHaveValue(documentName);
    });
  });

  test("Update a dynamic document's configurations on an app from an app's Documents tab", async ({
    app,
    appAdminPage,
    dynamicDocumentService,
    editDocumentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-245',
    });

    const template = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'This was generated for record: {:Record Id}',
            }),
          ],
        },
      ],
    });

    const templatePath = await dynamicDocumentService.createTemplate(template);

    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath: templatePath,
      status: true,
    });

    const updatedName = FakeDataFactory.createFakeDocumentName();

    await test.step("Navigate to the app's Documents tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();
    });

    await test.step('Create the dynamic document', async () => {
      await appAdminPage.documentsTab.createDocument(document.name);
      await appAdminPage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step("Navigate back to the app's Documents tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();
    });

    await test.step('Update the dynamic document', async () => {
      const documentRow = appAdminPage.documentsTab.documentsGrid.getByRole('row', { name: document.name });

      await documentRow.hover();
      await documentRow.getByTitle('Edit Document').click();
      await appAdminPage.page.waitForURL(editDocumentPage.pathRegex);

      document.name = updatedName;
      await editDocumentPage.fillOutForm(document);
      await editDocumentPage.save();
    });

    await test.step('Verify the dynamic document was updated', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();

      const documentRow = appAdminPage.documentsTab.documentsGrid.getByRole('row', { name: updatedName });

      await expect(documentRow).toBeVisible();
      await expect(documentRow).toHaveText(/enabled/i);
    });
  });

  test("Update a dynamic document's configurations from the Documents admin page", async ({
    app,
    documentAdminPage,
    editDocumentPage,
    dynamicDocumentService,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-246',
    });

    const template = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'This was generated for record: {:Record Id}',
            }),
          ],
        },
      ],
    });

    const templatePath = await dynamicDocumentService.createTemplate(template);

    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath: templatePath,
      status: true,
    });

    const updatedName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the Documents admin page', async () => {
      await documentAdminPage.goto();
    });

    await test.step('Create the dynamic document', async () => {
      await documentAdminPage.createDocument(app.name, document.name);
      await documentAdminPage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Navigate back to the Documents admin page', async () => {
      await documentAdminPage.goto();
    });

    await test.step('Update the dynamic document', async () => {
      const documentRow = documentAdminPage.documentsGrid.getByRole('row', { name: document.name });

      await documentRow.hover();
      await documentRow.getByTitle('Edit Document').click();
      await documentAdminPage.page.waitForURL(editDocumentPage.pathRegex);

      document.name = updatedName;
      await editDocumentPage.fillOutForm(document);
      await editDocumentPage.save();
    });

    await test.step('Verify the dynamic document was updated', async () => {
      await documentAdminPage.goto();

      const documentRow = documentAdminPage.documentsGrid.getByRole('row', { name: updatedName });

      await expect(documentRow).toBeVisible();
      await expect(documentRow).toHaveText(/enabled/i);
    });
  });

  test("Delete a dynamic document on an app from an app's Documents tab", async ({
    app,
    appAdminPage,
    editDocumentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-247',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();
    const documentRow = appAdminPage.documentsTab.documentsGrid.getByRole('row', { name: documentName });

    await test.step("Navigate to the app's Documents tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();
    });

    await test.step('Create the dynamic document to delete', async () => {
      await appAdminPage.documentsTab.createDocument(documentName);
      await appAdminPage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step("Navigate back to the app's Documents tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();
    });

    await test.step('Delete the dynamic document', async () => {
      await documentRow.hover();
      await documentRow.getByTitle('Delete Document').click();

      await appAdminPage.documentsTab.deleteDocumentDialog.deleteButton.click();
      await appAdminPage.documentsTab.deleteDocumentDialog.waitForDialogToBeDismissed();
    });

    await test.step('Verify the dynamic document was deleted', async () => {
      await expect(documentRow).not.toBeAttached();
    });
  });

  test('Delete a dynamic document from the Documents admin page', async ({
    app,
    documentAdminPage,
    editDocumentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-248',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();
    const documentRow = documentAdminPage.documentsGrid.getByRole('row', { name: documentName });

    await test.step('Navigate to the Documents admin page', async () => {
      await documentAdminPage.goto();
    });

    await test.step('Create the dynamic document to delete', async () => {
      await documentAdminPage.createDocument(app.name, documentName);
      await documentAdminPage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Navigate back to the Documents admin page', async () => {
      await documentAdminPage.goto();
    });

    await test.step('Delete the dynamic document', async () => {
      await documentRow.hover();
      await documentRow.getByTitle('Delete Document').click();

      await documentAdminPage.deleteDocumentDialog.deleteButton.click();
      await documentAdminPage.deleteDocumentDialog.waitForDialogToBeDismissed();
    });

    await test.step('Verify the dynamic document was deleted', async () => {
      await expect(documentRow).not.toBeAttached();
    });
  });

  test("Disable a dynamic document from an app's Documents tab", async ({
    app,
    appAdminPage,
    editDocumentPage,
    dynamicDocumentService,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-254',
    });

    const template = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'This was generated for record: {:Record Id}',
            }),
          ],
        },
      ],
    });

    const templatePath = await dynamicDocumentService.createTemplate(template);

    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath: templatePath,
      status: true,
    });

    let recordId: number;

    await test.step("Navigate to the app's Documents tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();
    });

    await test.step('Create the dynamic document to disable', async () => {
      await appAdminPage.documentsTab.createDocument(document.name);
      await appAdminPage.page.waitForURL(editDocumentPage.pathRegex);

      await editDocumentPage.fillOutForm(document);
      await editDocumentPage.save();
    });

    await test.step('Verify the dynamic document is enabled', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      recordId = editContentPage.getRecordIdFromUrl();

      await editContentPage.actionMenuButton.click();

      await expect(editContentPage.actionMenu.generateDocumentLink).toBeVisible();
    });

    await test.step('Disable the dynamic document', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();

      const documentRow = appAdminPage.documentsTab.documentsGrid.getByRole('row', { name: document.name });

      await documentRow.hover();
      await documentRow.getByTitle('Edit Document').click();
      await appAdminPage.page.waitForURL(editDocumentPage.pathRegex);

      await editDocumentPage.informationTab.updateStatus(false);
      await editDocumentPage.save();
    });

    await test.step('Verify the dynamic document is disabled', async () => {
      await editContentPage.goto(app.id, recordId);

      await editContentPage.actionMenuButton.click();

      await expect(editContentPage.actionMenu.generateDocumentLink).toBeHidden();
    });
  });

  test('Disable a dynamic document from the Documents admin page', async ({
    app,
    documentAdminPage,
    editDocumentPage,
    dynamicDocumentService,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-255',
    });

    const template = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'This was generated for record: {:Record Id}',
            }),
          ],
        },
      ],
    });

    const templatePath = await dynamicDocumentService.createTemplate(template);

    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath: templatePath,
      status: true,
    });

    let recordId: number;

    await test.step('Navigate to the Documents admin page', async () => {
      await documentAdminPage.goto();
    });

    await test.step('Create the dynamic document to disable', async () => {
      await documentAdminPage.createDocument(app.name, document.name);
      await documentAdminPage.page.waitForURL(editDocumentPage.pathRegex);

      await editDocumentPage.fillOutForm(document);
      await editDocumentPage.save();
    });

    await test.step('Verify the dynamic document is enabled', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      recordId = editContentPage.getRecordIdFromUrl();

      await editContentPage.actionMenuButton.click();

      await expect(editContentPage.actionMenu.generateDocumentLink).toBeVisible();
    });

    await test.step('Disable the dynamic document', async () => {
      await documentAdminPage.goto();
      await documentAdminPage.documentsGrid.getByRole('row', { name: document.name }).click();
      await documentAdminPage.page.waitForURL(editDocumentPage.pathRegex);

      await editDocumentPage.informationTab.updateStatus(false);
      await editDocumentPage.save();
    });

    await test.step('Verify the dynamic document is disabled', async () => {
      await editContentPage.goto(app.id, recordId);

      await editContentPage.actionMenuButton.click();

      await expect(editContentPage.actionMenu.generateDocumentLink).toBeHidden();
    });
  });

  test("Enable a dynamic document from an app's Documents tab", async ({
    app,
    appAdminPage,
    dynamicDocumentService,
    editDocumentPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-256',
    });

    const template = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'This was generated for record: {:Record Id}',
            }),
          ],
        },
      ],
    });

    const templatePath = await dynamicDocumentService.createTemplate(template);

    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath: templatePath,
      status: false,
    });

    let recordId: number;

    await test.step("Navigate to the app's Documents tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();
    });

    await test.step('Create the dynamic document to enable', async () => {
      await appAdminPage.documentsTab.createDocument(document.name);
      await appAdminPage.page.waitForURL(editDocumentPage.pathRegex);

      await editDocumentPage.fillOutForm(document);
      await editDocumentPage.save();
    });

    await test.step('Verify the dynamic document is disabled', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      recordId = editContentPage.getRecordIdFromUrl();

      await editContentPage.actionMenuButton.click();

      await expect(editContentPage.actionMenu.generateDocumentLink).toBeHidden();
    });

    await test.step('Enable the dynamic document', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.documentsTabButton.click();

      const documentRow = appAdminPage.documentsTab.documentsGrid.getByRole('row', { name: document.name });

      await documentRow.hover();
      await documentRow.getByTitle('Edit Document').click();
      await appAdminPage.page.waitForURL(editDocumentPage.pathRegex);

      await editDocumentPage.informationTab.updateStatus(true);
      await editDocumentPage.save();
    });

    await test.step('Verify the dynamic document is enabled', async () => {
      await editContentPage.goto(app.id, recordId);

      await editContentPage.actionMenuButton.click();

      await expect(editContentPage.actionMenu.generateDocumentLink).toBeVisible();
    });
  });

  test('Enable a dynamic document from the Documents admin page', async ({
    app,
    documentAdminPage,
    dynamicDocumentService,
    editDocumentPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-257',
    });

    const template = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'This was generated for record: {:Record Id}',
            }),
          ],
        },
      ],
    });

    const templatePath = await dynamicDocumentService.createTemplate(template);

    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath: templatePath,
      status: false,
    });

    let recordId: number;

    await test.step('Navigate to the Documents admin page', async () => {
      await documentAdminPage.goto();
    });

    await test.step('Create the dynamic document to enable', async () => {
      await documentAdminPage.createDocument(app.name, document.name);
      await documentAdminPage.page.waitForURL(editDocumentPage.pathRegex);

      await editDocumentPage.fillOutForm(document);
      await editDocumentPage.save();
    });

    await test.step('Verify the dynamic document is disabled', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      recordId = editContentPage.getRecordIdFromUrl();

      await editContentPage.actionMenuButton.click();

      await expect(editContentPage.actionMenu.generateDocumentLink).toBeHidden();
    });

    await test.step('Enable the dynamic document', async () => {
      await documentAdminPage.goto();
      await documentAdminPage.documentsGrid.getByRole('row', { name: document.name }).click();
      await documentAdminPage.page.waitForURL(editDocumentPage.pathRegex);

      await editDocumentPage.informationTab.updateStatus(true);
      await editDocumentPage.save();
    });

    await test.step('Verify the dynamic document is enabled', async () => {
      await editContentPage.goto(app.id, recordId);

      await editContentPage.actionMenuButton.click();

      await expect(editContentPage.actionMenu.generateDocumentLink).toBeVisible();
    });
  });

  test('Add a report token to a dynamic document', async ({
    app,
    reportAppPage,
    reportPage,
    appAdminPage,
    dynamicDocumentService,
    documentAdminPage,
    editDocumentPage,
    addContentPage,
    editContentPage,
    downloadService,
    pdfParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-794',
    });

    const report = new SavedReportAsReportDataOnly({
      appName: app.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step('Create report to reference in dynamic document', async () => {
      await reportAppPage.goto(app.id);
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
    });

    const attachmentField = new AttachmentField({
      name: FakeDataFactory.createFakeFieldName(),
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Create an attachment field and add to app layout to save generated document in', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(attachmentField);

      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        fieldName: attachmentField.name,
        tabName: tabName,
        sectionName: sectionName,
        sectionColumn: 0,
        sectionRow: 0,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    const template = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: `{:Report:${report.name}}`,
            }),
          ],
        },
      ],
    });

    const templatePath = await dynamicDocumentService.createTemplate(template);

    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath: templatePath,
      status: true,
      saveToFieldAccess: 'Allowed',
      attachmentField: attachmentField.name,
      fileType: 'Microsoft Word or PDF',
    });

    await test.step('Navigate to the document admin page', async () => {
      await documentAdminPage.goto();
    });

    await test.step('Create a dynamic document', async () => {
      await documentAdminPage.createDocument(app.name, document.name);
      await documentAdminPage.page.waitForURL(editDocumentPage.pathRegex);
    });

    await test.step('Add a report token to the dynamic document', async () => {
      await editDocumentPage.fillOutForm(document);
      await editDocumentPage.save();
    });

    await test.step('Generate the dynamic document', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      await editContentPage.actionMenuButton.click();
      await editContentPage.actionMenu.generateDocumentLink.click();
      await editContentPage.generateDocumentModal.fillOutForm({
        fileType: 'PDF',
        documentAction: 'Save to an attachment field',
      });
      await editContentPage.generateDocumentModal.okButton.click();
      await editContentPage.generateDocumentModal.closeButton.click();
    });

    let generatedDocumentRow: Locator;

    await test.step('Verify the dynamic document was generated', async () => {
      await expect(async () => {
        await editContentPage.page.reload();

        const attachmentControl = await editContentPage.form.getField({
          fieldName: attachmentField.name,
          fieldType: attachmentField.type as FieldType,
          tabName,
          sectionName,
        } as GetAttachmentFieldParams);

        const attachmentName = `${editContentPage.getRecordIdFromUrl()} - ${document.name}.pdf`;
        generatedDocumentRow = attachmentControl.attachmentGridBody.getByRole('row', { name: attachmentName });

        await expect(generatedDocumentRow).toBeVisible({ timeout: 5_000 });
      }).toPass({
        intervals: [5_000],
        timeout: 300_000,
      });
    });

    await test.step('Verify the dynamic document contains the report data', async () => {
      const pdfDownload = editContentPage.page.waitForEvent('download');
      await generatedDocumentRow.click();
      const pdf = await pdfDownload;
      const pdfFilePath = await downloadService.saveDownload(pdf);
      const foundCreatedByText = await pdfParser.findTextInPDF(pdfFilePath, ['Record Id', '1']);

      expect(foundCreatedByText).toBe(true);
    });
  });
});
