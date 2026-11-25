import { App, TextField, User } from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  ContentQuestions,
  ContentRecordTargets,
  ContentTasks,
  SidebarNavTargets,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, AppFixture, UserFixture, test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type ContentRecordTestFixtures = {
  targetApp: App;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<ContentRecordTestFixtures>({
  targetApp: AppFixture.create().build(),
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('content record', () => {
  test('Create a content record from the "Create Content" button on the content home page', async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-300',
    });

    let createdRecordId: number;

    await test.step('Navigate to the content home page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoHome());
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.openAddFromHome(targetApp.name), ContentTasks.saveRecord());
      createdRecordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Verify the content record was created', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoView(targetApp.id, createdRecordId));
      const section = await sysAdminActor.asks(
        ContentQuestions.section({ tabName: 'About', sectionName: 'Record Information' })
      );
      const createdBy = ContentRecordTargets.readOnlyReferenceFieldInSection(section, 'Created By');
      await sysAdminActor.browse().check(createdBy).isVisible();
      await sysAdminActor.browse().check(createdBy).hasText(/John/);
    });
  });

  test('Create a content record from the "Create Content" button the content home page of an app/survey', async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-301',
    });

    let createdRecordId: number;

    await test.step('Navigate to the app content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAppContent(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.openAddFromAppContent(), ContentTasks.saveRecord());
      createdRecordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Verify the content record was created', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoView(targetApp.id, createdRecordId));
      const section = await sysAdminActor.asks(
        ContentQuestions.section({ tabName: 'About', sectionName: 'Record Information' })
      );
      const createdBy = ContentRecordTargets.readOnlyReferenceFieldInSection(section, 'Created By');
      await sysAdminActor.browse().check(createdBy).isVisible();
      await sysAdminActor.browse().check(createdBy).hasText(/John/);
    });
  });

  test('Create a content record from the quick add layout on the content home page of an app/survey', async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-302',
    });

    let createdRecordId: number;

    await test.step('Navigate to apps admin page', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(targetApp.id));
    });

    await test.step('Enable the  quick add layout for the app', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner('Quick Content Add'),
        AppTasks.updateLayoutProperties({ enabled: true })
      );
    });

    await test.step('Add the record id field to the layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.dragFieldOntoLayout({
          fieldName: 'Record Id',
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          column: 0,
          row: 0,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Navigate to the app home page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAppContent(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveQuickAddRecord({ openAfterSave: true }));
      createdRecordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Verify the content record was created', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoView(targetApp.id, createdRecordId));
      const section = await sysAdminActor.asks(
        ContentQuestions.section({ tabName: 'About', sectionName: 'Record Information' })
      );
      const createdBy = ContentRecordTargets.readOnlyReferenceFieldInSection(section, 'Created By');
      await sysAdminActor.browse().check(createdBy).isVisible();
      await sysAdminActor.browse().check(createdBy).hasText(/John/);
    });
  });

  test('Create a copy of a content record', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-303',
    });

    let createdRecordId: number;

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
    });

    await test.step('Copy the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.copyRecord());
      createdRecordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Verify the content record was copied', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoView(targetApp.id, createdRecordId));
      const section = await sysAdminActor.asks(
        ContentQuestions.section({ tabName: 'About', sectionName: 'Record Information' })
      );
      const createdBy = ContentRecordTargets.readOnlyReferenceFieldInSection(section, 'Created By');
      await sysAdminActor.browse().check(createdBy).isVisible();
      await sysAdminActor.browse().check(createdBy).hasText(/John/);
    });
  });

  test('View a content record', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-304',
    });

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
    });

    await test.step('View the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.switchToViewMode());
      const section = await sysAdminActor.asks(
        ContentQuestions.section({ tabName: 'About', sectionName: 'Record Information' })
      );
      const createdBy = ContentRecordTargets.readOnlyReferenceFieldInSection(section, 'Created By');

      await sysAdminActor.browse().checkPage().hasUrl(ContentRecordTargets.viewPathRegex);
      await sysAdminActor.browse().check(createdBy).isVisible();
    });
  });

  test('Edit a content record', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-305',
    });

    const textField = new TextField({ name: 'Text Field' });
    const textFieldValue = 'Test';
    const updatedTextFieldValue = 'Updated Test';
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    let createdRecordId: number;

    await test.step('Navigate to the app admin page', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(targetApp.id));
    });

    await test.step('Add an editable field to the default layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.addLayoutItemInLayoutDesigner(textField),
        AppTasks.dragFieldOntoLayout({
          fieldName: textField.name,
          tabName,
          sectionName,
          column: 0,
          row: 0,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.fillTextField({
          tabName,
          sectionName,
          fieldName: textField.name,
          value: textFieldValue,
        }),
        ContentTasks.saveRecord()
      );
      createdRecordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to the view content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoView(targetApp.id, createdRecordId));
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.readOnlyTextFieldInSection(section, textField.name))
        .hasText(textFieldValue);
    });

    await test.step('Edit the content record', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.switchToEditMode(),
        ContentTasks.typeTextField({
          tabName,
          sectionName,
          fieldName: textField.name,
          value: updatedTextFieldValue,
          delay: 0,
        }),
        ContentTasks.saveEditedRecord()
      );
    });

    await test.step('Verify the content record was edited', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoView(targetApp.id, createdRecordId));
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.readOnlyTextFieldInSection(section, textField.name))
        .hasText(updatedTextFieldValue);
    });
  });

  test('Save a content record', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-306',
    });

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
    });

    await test.step('Verify that the content record was saved', async () => {
      const section = await sysAdminActor.asks(
        ContentQuestions.section({ tabName: 'About', sectionName: 'Record Information' })
      );
      const createdBy = ContentRecordTargets.readOnlyReferenceFieldInSection(section, 'Created By');

      await sysAdminActor.browse().checkPage().hasUrl(ContentRecordTargets.editPathRegex);
      await sysAdminActor.browse().check(createdBy).isVisible();
      await sysAdminActor.browse().check(createdBy).hasText(/John/);
    });
  });

  test('Save and close a content record', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-307',
    });

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveAndCloseRecord());
    });

    await test.step('Verify the record was closed and saved', async () => {
      expect(sysAdminActor.browse().url()).not.toMatch(ContentRecordTargets.editPathRegex);

      await sysAdminActor.attemptsTo(ContentTasks.gotoView(targetApp.id, 1));
      const section = await sysAdminActor.asks(
        ContentQuestions.section({ tabName: 'About', sectionName: 'Record Information' })
      );
      const createdBy = ContentRecordTargets.readOnlyReferenceFieldInSection(section, 'Created By');
      await sysAdminActor.browse().check(createdBy).isVisible();
      await sysAdminActor.browse().check(createdBy).hasText(/John/);
    });
  });

  test('Cancel editing a content record', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-308',
    });

    const textField = new TextField({ name: 'Text Field' });
    const textFieldValue = 'Test';
    const updatedTextFieldValue = 'Updated Test';
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    let createdRecordId: number;

    await test.step('Navigate to the app admin page', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(targetApp.id));
    });

    await test.step('Add an editable field to the default layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.addLayoutItemInLayoutDesigner(textField),
        AppTasks.dragFieldOntoLayout({
          fieldName: textField.name,
          tabName,
          sectionName,
          column: 0,
          row: 0,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.fillTextField({
          tabName,
          sectionName,
          fieldName: textField.name,
          value: textFieldValue,
        }),
        ContentTasks.saveRecord()
      );
      createdRecordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to the view content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoView(targetApp.id, createdRecordId));
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.readOnlyTextFieldInSection(section, textField.name))
        .hasText(textFieldValue);
    });

    await test.step('Edit the content record and cancel it', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.switchToEditMode(),
        ContentTasks.typeTextField({
          tabName,
          sectionName,
          fieldName: textField.name,
          value: updatedTextFieldValue,
          delay: 0,
        }),
        ContentTasks.cancelRecord()
      );
    });

    await test.step('Verify the content record was not edited', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoView(targetApp.id, createdRecordId));
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.readOnlyTextFieldInSection(section, textField.name))
        .hasText(textFieldValue);
    });
  });

  test('Delete a content record', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-309',
    });

    let createdRecordId: number;

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
      createdRecordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Delete the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.deleteRecord());
    });

    await test.step('Verify the content record was deleted', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoView(targetApp.id, createdRecordId));
      await sysAdminActor.browse().check(ContentRecordTargets.notFoundMessage).isVisible();
    });
  });

  test('Print content record', async ({ targetApp, sysAdminActor, pdfParser, downloadService }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-310',
    });

    let pdfFilePath: string;

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
    });

    await test.step('Print the content record to PDF', async () => {
      const pdf = await sysAdminActor.asks(ContentQuestions.printRecordToPdf());
      pdfFilePath = await downloadService.saveDownload(pdf);
    });

    await test.step('Verify the printed content record contains expected text', async () => {
      const foundCreatedByText = await pdfParser.findTextInPDF(pdfFilePath, ['Created By', 'John Wick']);
      expect(foundCreatedByText).toBe(true);
    });
  });

  test('Pin a content record', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-311',
    });

    let createdRecordId: number;

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
      createdRecordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Pin the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.pinRecord());
    });

    await test.step('Verify the content record was pinned', async () => {
      await sysAdminActor.browse().check(SidebarNavTargets.pinnedRecordLink(targetApp.id, createdRecordId)).isVisible();
    });
  });

  test('View version history for a content record', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-892',
    });

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
    });

    await test.step('View the version history', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.openVersionHistory());
    });

    await test.step('Verify the version history is displayed', async () => {
      await sysAdminActor.browse().check(ContentRecordTargets.versionHistoryModal.dialog).isVisible();
    });
  });

  test('Filter version history for a content record', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-893',
    });

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
    });

    await test.step('Filter the version history', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.openVersionHistory());

      const yesterdayInMs = Date.now() - 86_400_000;

      await sysAdminActor.attemptsTo(
        ContentTasks.filterVersionHistory({
          fromDate: new Date(yesterdayInMs),
          toDate: new Date(yesterdayInMs),
        })
      );
    });

    await test.step('Verify the version history is filtered', async () => {
      await sysAdminActor.browse().check(ContentRecordTargets.versionHistoryModal.versionRows).hasCount(0);
    });
  });

  test('Export version history for a content record', async ({
    targetApp,
    sysAdminActor,
    user,
    testUserActor,
    sysAdminUser,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-894',
    });

    test.slow();

    await test.step('Navigate to the add content page', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(targetApp.id));
    });

    let recordId: number;

    await test.step('Create the content record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Export the version history', async () => {
      await testUserActor.attemptsTo(
        ContentTasks.gotoEdit(targetApp.id, recordId),
        ContentTasks.openVersionHistory(),
        ContentTasks.exportVersionHistory()
      );
    });

    let exportEmailContent: string;

    await test.step('Verify the version history was exported', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', user.email], ['TEXT', 'Version History'], ['UNSEEN']];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();

        exportEmailContent = email.html as string;
      }).toPass({
        intervals: [30_000],
        timeout: 300_000,
      });
    });

    let reportPath: string;

    await test.step('Download the version history report', async () => {
      const report = await sysAdminActor.asks(
        ContentQuestions.downloadedVersionHistoryExportFromEmailHtml(exportEmailContent)
      );
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify the version history report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath, false);
      expect(reportData).toHaveLength(1);

      const sheet = reportData[0];
      expect(sheet.name).toEqual('Report Data');

      const [firstRow, secondRow, ...remainingRows] = sheet.data;

      expect(firstRow).toEqual({ '0': 'Content Record', '1': recordId.toString() });

      expect(secondRow).toMatchObject({
        '0': 'Version',
        '1': 'User',
        '2': 'Field Name',
        '3': 'Updated Version',
        '4': 'Previous Version',
      });

      for (const row of remainingRows) {
        expect(row).toMatchObject({
          '0': expect.any(String),
          '1': sysAdminUser.fullName,
          '2': expect.any(String),
          '3': expect.any(String),
          '4': expect.any(String),
        });
      }
    });
  });
});
