import {
  App,
  AttachmentField,
  DynamicDocument,
  FakeDataFactory,
  SavedReportAsReportDataOnly,
} from '@stevanfreeborn/onspring-models';
import {
  AppDocumentsTabTargets,
  AppTasks,
  ContentQuestions,
  ContentRecordTargets,
  ContentTasks,
  DynamicDocumentAdminPageTargets,
  DynamicDocumentTasks,
  EditDynamicDocumentPageTargets,
  FieldTasks,
  ReportTasks,
} from '@stevanfreeborn/onspring-ui';
import { Document, Paragraph } from 'docx';
import { AppFixture, test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type DynamicDocumentTestFixtures = {
  app: App;
};

const test = base.extend<DynamicDocumentTestFixtures>({
  app: AppFixture.create().build(),
});

test.describe('Dynamic Documents', () => {
  test('Create a dynamic document via the create button on the header of the admin home page', async ({
    app,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-239',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.gotoAdminHome());
    });

    await test.step('Create the dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createViaHeader(app.name, documentName));
    });

    await test.step('Verify the dynamic document was created', async () => {
      await sysAdminActor
        .browse()
        .check(EditDynamicDocumentPageTargets.informationTab.documentNameInput)
        .hasValue(documentName);
    });
  });

  test('Create a dynamic document via the create button on the Documents tile on the admin home page', async ({
    app,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-240',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.gotoAdminHome());
    });

    await test.step('Create the dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createViaDocumentsTile(app.name, documentName));
    });

    await test.step('Verify the dynamic document was created', async () => {
      await sysAdminActor
        .browse()
        .check(EditDynamicDocumentPageTargets.informationTab.documentNameInput)
        .hasValue(documentName);
    });
  });

  test('Create a dynamic document via the "Create Document" button on the Documents admin page', async ({
    app,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-241',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the Documents admin page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.goto());
    });

    await test.step('Create the dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createFromAdminPage(app.name, documentName));
    });

    await test.step('Verify the dynamic document was created', async () => {
      await sysAdminActor
        .browse()
        .check(EditDynamicDocumentPageTargets.informationTab.documentNameInput)
        .hasValue(documentName);
    });
  });

  test("Create a dynamic document via the Add Document button on an app's Documents tab", async ({
    app,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-866',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step("Navigate to the app's Documents tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppDocumentsTab(app.id));
    });

    await test.step('Create the dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createFromAppDocumentsTab(documentName));
    });

    await test.step('Verify the dynamic document was created', async () => {
      await sysAdminActor
        .browse()
        .check(EditDynamicDocumentPageTargets.informationTab.documentNameInput)
        .hasValue(documentName);
    });
  });

  test('Create a copy of a dynamic document via the create button on the header of the admin home page', async ({
    app,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-242',
    });

    const documentToCopy = FakeDataFactory.createFakeDocumentName();
    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.gotoAdminHome());
    });

    await test.step('Create the dynamic document to copy', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createViaHeader(app.name, documentToCopy));
    });

    await test.step('Navigate back to the admin home page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.gotoAdminHome());
    });

    await test.step('Create a copy of the dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createCopyViaHeader(app.name, documentToCopy, documentName));
    });

    await test.step('Verify the dynamic document was created', async () => {
      await sysAdminActor
        .browse()
        .check(EditDynamicDocumentPageTargets.informationTab.documentNameInput)
        .hasValue(documentName);
    });
  });

  test('Create a copy of a dynamic document via the create button on the Documents tile on the admin home page', async ({
    app,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-243',
    });

    const documentToCopy = FakeDataFactory.createFakeDocumentName();
    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.gotoAdminHome());
    });

    await test.step('Create the dynamic document to copy', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createViaDocumentsTile(app.name, documentToCopy));
    });

    await test.step('Navigate back to the admin home page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.gotoAdminHome());
    });

    await test.step('Create a copy of the dynamic document', async () => {
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.createCopyViaDocumentsTile(app.name, documentToCopy, documentName)
      );
    });

    await test.step('Verify the dynamic document was created', async () => {
      await sysAdminActor
        .browse()
        .check(EditDynamicDocumentPageTargets.informationTab.documentNameInput)
        .hasValue(documentName);
    });
  });

  test('Create a copy of a dynamic document via the "Create Document" button on the Documents admin page', async ({
    app,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-244',
    });

    const documentToCopy = FakeDataFactory.createFakeDocumentName();
    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the Documents admin page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.goto());
    });

    await test.step('Create the dynamic document to copy', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createFromAdminPage(app.name, documentToCopy));
    });

    await test.step('Navigate back to the Documents admin page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.goto());
    });

    await test.step('Create a copy of the dynamic document', async () => {
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.createCopyFromAdminPage(app.name, documentToCopy, documentName)
      );
    });

    await test.step('Verify the dynamic document was created', async () => {
      await sysAdminActor
        .browse()
        .check(EditDynamicDocumentPageTargets.informationTab.documentNameInput)
        .hasValue(documentName);
    });
  });

  test("Create a copy of a dynamic document via the Add Document button on an app's Documents tab", async ({
    app,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-867',
    });

    const documentToCopy = FakeDataFactory.createFakeDocumentName();
    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step("Navigate to the app's Documents tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppDocumentsTab(app.id));
    });

    await test.step('Create the dynamic document to copy', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createFromAppDocumentsTab(documentToCopy));
    });

    await test.step('Navigate back to the app Documents tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppDocumentsTab(app.id));
    });

    await test.step('Create a copy of the dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createCopyFromAppDocumentsTab(documentToCopy, documentName));
    });

    await test.step('Verify the dynamic document was created', async () => {
      await sysAdminActor
        .browse()
        .check(EditDynamicDocumentPageTargets.informationTab.documentNameInput)
        .hasValue(documentName);
    });
  });

  test("Update a dynamic document's configurations on an app from an app's Documents tab", async ({
    app,
    sysAdminActor,
    dynamicDocumentService,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-245',
    });

    const templatePath = await dynamicDocumentService.createTemplate(createRecordIdTemplate());
    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath,
      status: true,
    });
    const updatedName = FakeDataFactory.createFakeDocumentName();

    await test.step("Navigate to the app's Documents tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppDocumentsTab(app.id));
    });

    await test.step('Create the dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createFromAppDocumentsTab(document.name));
    });

    await test.step("Navigate back to the app's Documents tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppDocumentsTab(app.id));
    });

    await test.step('Update the dynamic document', async () => {
      const originalName = document.name;
      document.name = updatedName;
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.openForEditFromAppDocumentsTab(originalName),
        DynamicDocumentTasks.fillForm(document),
        DynamicDocumentTasks.save()
      );
    });

    await test.step('Verify the dynamic document was updated', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppDocumentsTab(app.id));
      const documentRow = AppDocumentsTabTargets.rowByName(updatedName);
      await sysAdminActor.browse().check(documentRow).isVisible();
      await sysAdminActor
        .browse()
        .check(documentRow)
        .hasText(/enabled/i);
    });
  });

  test("Update a dynamic document's configurations from the Documents admin page", async ({
    app,
    sysAdminActor,
    dynamicDocumentService,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-246',
    });

    const templatePath = await dynamicDocumentService.createTemplate(createRecordIdTemplate());
    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath,
      status: true,
    });
    const updatedName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the Documents admin page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.goto());
    });

    await test.step('Create the dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createFromAdminPage(app.name, document.name));
    });

    await test.step('Navigate back to the Documents admin page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.goto());
    });

    await test.step('Update the dynamic document', async () => {
      const originalName = document.name;
      document.name = updatedName;
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.openForEditFromAdminPage(originalName),
        DynamicDocumentTasks.fillForm(document),
        DynamicDocumentTasks.save()
      );
    });

    await test.step('Verify the dynamic document was updated', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.goto());
      const documentRow = DynamicDocumentAdminPageTargets.rowByName(updatedName);
      await sysAdminActor.browse().check(documentRow).isVisible();
      await sysAdminActor
        .browse()
        .check(documentRow)
        .hasText(/enabled/i);
    });
  });

  test("Delete a dynamic document on an app from an app's Documents tab", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-247',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step("Navigate to the app's Documents tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppDocumentsTab(app.id));
    });

    await test.step('Create the dynamic document to delete', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createFromAppDocumentsTab(documentName));
    });

    await test.step("Navigate back to the app's Documents tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppDocumentsTab(app.id));
    });

    await test.step('Delete the dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.deleteFromAppDocumentsTab(documentName));
    });

    await test.step('Verify the dynamic document was deleted', async () => {
      await sysAdminActor.browse().check(AppDocumentsTabTargets.rowByName(documentName)).isNotAttached();
    });
  });

  test('Delete a dynamic document from the Documents admin page', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-248',
    });

    const documentName = FakeDataFactory.createFakeDocumentName();

    await test.step('Navigate to the Documents admin page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.goto());
    });

    await test.step('Create the dynamic document to delete', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createFromAdminPage(app.name, documentName));
    });

    await test.step('Navigate back to the Documents admin page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.goto());
    });

    await test.step('Delete the dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.deleteFromAdminPage(documentName));
    });

    await test.step('Verify the dynamic document was deleted', async () => {
      await sysAdminActor.browse().check(DynamicDocumentAdminPageTargets.rowByName(documentName)).isNotAttached();
    });
  });

  test("Disable a dynamic document from an app's Documents tab", async ({
    app,
    sysAdminActor,
    dynamicDocumentService,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-254',
    });

    const templatePath = await dynamicDocumentService.createTemplate(createRecordIdTemplate());
    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath,
      status: true,
    });
    let recordId: number;

    await test.step("Navigate to the app's Documents tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppDocumentsTab(app.id));
    });

    await test.step('Create the dynamic document to disable', async () => {
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.createFromAppDocumentsTab(document.name),
        DynamicDocumentTasks.fillForm(document),
        DynamicDocumentTasks.save()
      );
    });

    await test.step('Verify the dynamic document is enabled', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
      await sysAdminActor.attemptsTo(ContentTasks.openActionMenu());
      await sysAdminActor.browse().check(ContentRecordTargets.actionMenuOption('Generate Document')).isVisible();
    });

    await test.step('Disable the dynamic document', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppDocumentsTab(app.id),
        DynamicDocumentTasks.openForEditFromAppDocumentsTab(document.name),
        DynamicDocumentTasks.updateStatus(false),
        DynamicDocumentTasks.save()
      );
    });

    await test.step('Verify the dynamic document is disabled', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoEdit(app.id, recordId), ContentTasks.openActionMenu());
      await sysAdminActor.browse().check(ContentRecordTargets.actionMenuOption('Generate Document')).isHidden();
    });
  });

  test('Disable a dynamic document from the Documents admin page', async ({
    app,
    sysAdminActor,
    dynamicDocumentService,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-255',
    });

    const templatePath = await dynamicDocumentService.createTemplate(createRecordIdTemplate());
    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath,
      status: true,
    });
    let recordId: number;

    await test.step('Navigate to the Documents admin page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.goto());
    });

    await test.step('Create the dynamic document to disable', async () => {
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.createFromAdminPage(app.name, document.name),
        DynamicDocumentTasks.fillForm(document),
        DynamicDocumentTasks.save()
      );
    });

    await test.step('Verify the dynamic document is enabled', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
      await sysAdminActor.attemptsTo(ContentTasks.openActionMenu());
      await sysAdminActor.browse().check(ContentRecordTargets.actionMenuOption('Generate Document')).isVisible();
    });

    await test.step('Disable the dynamic document', async () => {
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.goto(),
        DynamicDocumentTasks.openForEditFromAdminPage(document.name),
        DynamicDocumentTasks.updateStatus(false),
        DynamicDocumentTasks.save()
      );
    });

    await test.step('Verify the dynamic document is disabled', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoEdit(app.id, recordId), ContentTasks.openActionMenu());
      await sysAdminActor.browse().check(ContentRecordTargets.actionMenuOption('Generate Document')).isHidden();
    });
  });

  test("Enable a dynamic document from an app's Documents tab", async ({
    app,
    sysAdminActor,
    dynamicDocumentService,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-256',
    });

    const templatePath = await dynamicDocumentService.createTemplate(createRecordIdTemplate());
    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath,
      status: false,
    });
    let recordId: number;

    await test.step("Navigate to the app's Documents tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppDocumentsTab(app.id));
    });

    await test.step('Create the dynamic document to enable', async () => {
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.createFromAppDocumentsTab(document.name),
        DynamicDocumentTasks.fillForm(document),
        DynamicDocumentTasks.save()
      );
    });

    await test.step('Verify the dynamic document is disabled', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
      await sysAdminActor.attemptsTo(ContentTasks.openActionMenu());
      await sysAdminActor.browse().check(ContentRecordTargets.actionMenuOption('Generate Document')).isHidden();
    });

    await test.step('Enable the dynamic document', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppDocumentsTab(app.id),
        DynamicDocumentTasks.openForEditFromAppDocumentsTab(document.name),
        DynamicDocumentTasks.updateStatus(true),
        DynamicDocumentTasks.save()
      );
    });

    await test.step('Verify the dynamic document is enabled', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoEdit(app.id, recordId), ContentTasks.openActionMenu());
      await sysAdminActor.browse().check(ContentRecordTargets.actionMenuOption('Generate Document')).isVisible();
    });
  });

  test('Enable a dynamic document from the Documents admin page', async ({
    app,
    sysAdminActor,
    dynamicDocumentService,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-257',
    });

    const templatePath = await dynamicDocumentService.createTemplate(createRecordIdTemplate());
    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      templatePath,
      status: false,
    });
    let recordId: number;

    await test.step('Navigate to the Documents admin page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.goto());
    });

    await test.step('Create the dynamic document to enable', async () => {
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.createFromAdminPage(app.name, document.name),
        DynamicDocumentTasks.fillForm(document),
        DynamicDocumentTasks.save()
      );
    });

    await test.step('Verify the dynamic document is disabled', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
      await sysAdminActor.attemptsTo(ContentTasks.openActionMenu());
      await sysAdminActor.browse().check(ContentRecordTargets.actionMenuOption('Generate Document')).isHidden();
    });

    await test.step('Enable the dynamic document', async () => {
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.goto(),
        DynamicDocumentTasks.openForEditFromAdminPage(document.name),
        DynamicDocumentTasks.updateStatus(true),
        DynamicDocumentTasks.save()
      );
    });

    await test.step('Verify the dynamic document is enabled', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoEdit(app.id, recordId), ContentTasks.openActionMenu());
      await sysAdminActor.browse().check(ContentRecordTargets.actionMenuOption('Generate Document')).isVisible();
    });
  });

  test('Add a report token to a dynamic document', async ({
    app,
    sysAdminActor,
    dynamicDocumentService,
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
      await sysAdminActor.attemptsTo(ReportTasks.createSavedDataReport(app.id, report));
    });

    const attachmentField = new AttachmentField({
      name: FakeDataFactory.createFakeFieldName(),
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Create an attachment field and add to app layout to save generated document in', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        FieldTasks.addFromGrid(attachmentField),
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          fieldName: attachmentField.name,
          tabName,
          sectionName,
          column: 0,
          row: 0,
        }),
        AppTasks.saveAndCloseLayout()
      );
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
      templatePath,
      status: true,
      saveToFieldAccess: 'Allowed',
      attachmentField: attachmentField.name,
      fileType: 'Microsoft Word or PDF',
    });

    await test.step('Navigate to the document admin page', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.goto());
    });

    await test.step('Create a dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.createFromAdminPage(app.name, document.name));
    });

    await test.step('Add a report token to the dynamic document', async () => {
      await sysAdminActor.attemptsTo(DynamicDocumentTasks.fillForm(document), DynamicDocumentTasks.save());
    });

    let recordId: number;

    await test.step('Generate the dynamic document', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
      await sysAdminActor.attemptsTo(
        ContentTasks.generateDynamicDocument({
          fileType: 'PDF',
          documentAction: 'Save to an attachment field',
        })
      );
    });

    await test.step('Verify the dynamic document was generated', async () => {
      await expect(async () => {
        await sysAdminActor.browse().reload();
        const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
        const generatedDocumentRow = ContentRecordTargets.attachmentRowInSection(
          section,
          attachmentField.name,
          `${recordId} - ${document.name}.pdf`
        );
        await sysAdminActor.browse().check(generatedDocumentRow).isVisible({ timeout: 5_000 });
      }).toPass({
        intervals: [5_000],
        timeout: 300_000,
      });
    });

    await test.step('Verify the dynamic document contains the report data', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      const generatedDocumentRow = ContentRecordTargets.attachmentRowInSection(
        section,
        attachmentField.name,
        `${recordId} - ${document.name}.pdf`
      );
      const pdf = await sysAdminActor.browse().clickAndWaitForDownload(generatedDocumentRow);
      const pdfFilePath = await downloadService.saveDownload(pdf);
      const foundReportData = await pdfParser.findTextInPDF(pdfFilePath, ['Record Id', '1']);

      expect(foundReportData).toBe(true);
    });
  });
});

function createRecordIdTemplate(): Document {
  return new Document({
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
}
