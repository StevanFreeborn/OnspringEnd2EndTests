import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { test as base, expect, Page } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { testUserPage } from '../../fixtures/auth.fixtures';
import { createUserFixture } from '../../fixtures/user.fixtures';
import { App } from '../../models/app';
import { TextField } from '../../models/textField';
import { User, UserStatus } from '../../models/user';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { AppContentPage } from '../../pageObjectModels/content/appContentPage';
import { ContentHomePage } from '../../pageObjectModels/content/contentHomePage';
import { CopyContentPage } from '../../pageObjectModels/content/copyContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { ViewContentPage } from '../../pageObjectModels/content/viewContentPage';
import { AnnotationType } from '../annotations';

type ContentRecordTestFixtures = {
  targetApp: App;
  appAdminPage: AppAdminPage;
  contentHomePage: ContentHomePage;
  appContentPage: AppContentPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
  viewContentPage: ViewContentPage;
  copyContentPage: CopyContentPage;
  testUser: User;
  testUserPage: Page;
};

const test = base.extend<ContentRecordTestFixtures>({
  targetApp: app,
  appAdminPage: async ({ sysAdminPage }, use) => {
    const appAdminPage = new AppAdminPage(sysAdminPage);
    await use(appAdminPage);
  },
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
  copyContentPage: async ({ sysAdminPage }, use) => {
    const copyContentPage = new CopyContentPage(sysAdminPage);
    await use(copyContentPage);
  },
  testUser: async ({ browser, sysAdminPage }, use, testInfo) => {
    await createUserFixture(
      {
        browser,
        sysAdminPage,
        sysAdmin: true,
        userStatus: UserStatus.Active,
        roles: [],
      },
      use,
      testInfo
    );
  },
  testUserPage: async ({ browser, testUser }, use, testInfo) =>
    await testUserPage({ browser, user: testUser }, use, testInfo),
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
        tabName: 'About',
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
        tabName: 'About',
        sectionName: 'Record Information',
        fieldName: 'Created By',
        fieldType: 'Reference',
      });

      await expect(createdBy).toBeVisible();
      await expect(createdBy).toHaveText(/John/);
    });
  });

  test('Create a content record from the quick add layout on the content home page of an app/survey', async ({
    targetApp,
    appAdminPage,
    appContentPage,
    editContentPage,
    viewContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-302',
    });

    let createdRecordId: number;

    await test.step('Navigate to apps admin page', async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step('Enable the  quick add layout for the app', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout('Quick Content Add');
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesLink.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.statusToggle.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.applyButton.click();
    });

    await test.step('Add the record id field to the layout', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        fieldName: 'Record Id',
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Navigate to the app home page', async () => {
      await appContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      await appContentPage.quickContentAddForm.openAfterSaveCheckbox.check();
      await appContentPage.quickContentAddForm.saveButton.click();
      await appContentPage.page.waitForURL(editContentPage.pathRegex);
      createdRecordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Verify the content record was created', async () => {
      await viewContentPage.goto(targetApp.id, createdRecordId);

      const createdBy = await viewContentPage.form.getField({
        tabName: 'About',
        sectionName: 'Record Information',
        fieldName: 'Created By',
        fieldType: 'Reference',
      });

      await expect(createdBy).toBeVisible();
      await expect(createdBy).toHaveText(/John/);
    });
  });

  test('Create a copy of a content record', async ({
    targetApp,
    addContentPage,
    copyContentPage,
    editContentPage,
    viewContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-303',
    });

    let createdRecordId: number;

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Copy the content record', async () => {
      await editContentPage.actionMenuButton.click();
      await editContentPage.actionMenu.copyRecordLink.click();
      await editContentPage.page.waitForURL(copyContentPage.pathRegex);

      await copyContentPage.saveRecordButton.click();
      await copyContentPage.page.waitForURL(editContentPage.pathRegex);
      createdRecordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Verify the content record was copied', async () => {
      await viewContentPage.goto(targetApp.id, createdRecordId);

      const createdBy = await viewContentPage.form.getField({
        tabName: 'About',
        sectionName: 'Record Information',
        fieldName: 'Created By',
        fieldType: 'Reference',
      });

      await expect(createdBy).toBeVisible();
      await expect(createdBy).toHaveText(/John/);
    });
  });

  test('View a content record', async ({ targetApp, addContentPage, editContentPage, viewContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-304',
    });

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('View the content record', async () => {
      await editContentPage.viewRecordButton.click();
      await editContentPage.page.waitForURL(viewContentPage.pathRegex);

      const createdBy = await viewContentPage.form.getField({
        tabName: 'About',
        sectionName: 'Record Information',
        fieldName: 'Created By',
        fieldType: 'Reference',
      });

      expect(viewContentPage.page.url()).toMatch(viewContentPage.pathRegex);
      await expect(createdBy).toBeVisible();
    });
  });

  test('Edit a content record', async ({
    targetApp,
    appAdminPage,
    addContentPage,
    editContentPage,
    viewContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-305',
    });

    const textField = new TextField({ name: 'Text Field' });
    const textFieldValue = 'Test';
    const updatedTextFieldValue = 'Updated Test';
    const getFieldParams = {
      tabName: 'Tab 2',
      sectionName: 'Section 1',
      fieldName: textField.name,
      fieldType: textField.type as FieldType,
    };

    let createdRecordId: number;

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step('Add an editable field to the default layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(textField);
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        fieldName: textField.name,
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      const editableTextField = await addContentPage.form.getField(getFieldParams);

      await editableTextField.fill(textFieldValue);

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      createdRecordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to the view content page', async () => {
      await viewContentPage.goto(targetApp.id, createdRecordId);

      const readOnlyTextField = await viewContentPage.form.getField(getFieldParams);

      await expect(readOnlyTextField).toHaveText(textFieldValue);
    });

    await test.step('Edit the content record', async () => {
      await viewContentPage.editRecordButton.click();
      await editContentPage.page.waitForURL(editContentPage.pathRegex);

      const editableTextField = await editContentPage.form.getField(getFieldParams);

      await editableTextField.clear();
      await editableTextField.pressSequentially(updatedTextFieldValue);
      await editContentPage.save();
    });

    await test.step('Verify the content record was edited', async () => {
      await viewContentPage.goto(targetApp.id, createdRecordId);

      const readOnlyTextField = await viewContentPage.form.getField(getFieldParams);

      await expect(readOnlyTextField).toHaveText(updatedTextFieldValue);
    });
  });

  test('Save a content record', async ({ targetApp, addContentPage, editContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-306',
    });

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Verify that the content record was saved', async () => {
      const createdBy = await editContentPage.form.getUnEditableField({
        tabName: 'About',
        sectionName: 'Record Information',
        fieldName: 'Created By',
        fieldType: 'Reference',
      });

      expect(editContentPage.page.url()).toMatch(editContentPage.pathRegex);
      await expect(createdBy).toBeVisible();
      await expect(createdBy).toHaveText(/John/);
    });
  });

  test('Save and close a content record', async ({
    sysAdminPage,
    targetApp,
    addContentPage,
    editContentPage,
    viewContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-307',
    });

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      const backToOriginResponse = addContentPage.page.waitForResponse(/BackToOrigin/);
      await addContentPage.saveAndCloseButton.click();
      await backToOriginResponse;
    });

    await test.step('Verify the record was closed and saved', async () => {
      expect(sysAdminPage.url()).not.toMatch(editContentPage.pathRegex);

      await viewContentPage.goto(targetApp.id, 1);

      const createdBy = await viewContentPage.form.getField({
        tabName: 'About',
        sectionName: 'Record Information',
        fieldName: 'Created By',
        fieldType: 'Reference',
      });

      await expect(createdBy).toBeVisible();
      await expect(createdBy).toHaveText(/John/);
    });
  });

  test('Cancel editing a content record', async ({
    targetApp,
    appAdminPage,
    addContentPage,
    editContentPage,
    viewContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-308',
    });

    const textField = new TextField({ name: 'Text Field' });
    const textFieldValue = 'Test';
    const updatedTextFieldValue = 'Updated Test';
    const getFieldParams = {
      tabName: 'Tab 2',
      sectionName: 'Section 1',
      fieldName: textField.name,
      fieldType: textField.type as FieldType,
    };

    let createdRecordId: number;

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step('Add an editable field to the default layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(textField);
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        fieldName: textField.name,
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      const editableTextField = await addContentPage.form.getField(getFieldParams);

      await editableTextField.fill(textFieldValue);

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      createdRecordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to the view content page', async () => {
      await viewContentPage.goto(targetApp.id, createdRecordId);

      const readOnlyTextField = await viewContentPage.form.getField(getFieldParams);

      await expect(readOnlyTextField).toHaveText(textFieldValue);
    });

    await test.step('Edit the content record and cancel it', async () => {
      await viewContentPage.editRecordButton.click();
      await editContentPage.page.waitForURL(editContentPage.pathRegex);

      const editableTextField = await editContentPage.form.getField(getFieldParams);

      await editableTextField.clear();
      await editableTextField.pressSequentially(updatedTextFieldValue);

      const backToOriginResponse = editContentPage.page.waitForResponse(/BackToOrigin/);
      await editContentPage.cancelButton.click();
      await backToOriginResponse;
    });

    await test.step('Verify the content record was not edited', async () => {
      await viewContentPage.goto(targetApp.id, createdRecordId);

      const readOnlyTextField = await viewContentPage.form.getField(getFieldParams);

      await expect(readOnlyTextField).toHaveText(textFieldValue);
    });
  });

  test('Delete a content record', async ({ targetApp, addContentPage, editContentPage, viewContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-309',
    });

    let createdRecordId: number;

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      createdRecordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Delete the content record', async () => {
      await editContentPage.actionMenuButton.click();
      await editContentPage.actionMenu.deleteRecordLink.click();

      const backToOriginResponse = editContentPage.page.waitForResponse(/BackToOrigin/);
      await editContentPage.deleteRecordDialog.deleteButton.click();
      await backToOriginResponse;
    });

    await test.step('Verify the content record was deleted', async () => {
      await viewContentPage.goto(targetApp.id, createdRecordId);

      const notFoundMessage = viewContentPage.page.getByText("Oops! The page you're trying to view doesn't exist");
      await expect(notFoundMessage).toBeVisible();
    });
  });

  test('Print content record', async ({ targetApp, addContentPage, editContentPage, pdfParser, downloadService }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-310',
    });

    let pdfFilePath: string;

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Print the content record to PDF', async () => {
      await editContentPage.actionMenuButton.click();
      await editContentPage.actionMenu.printRecordLink.click();

      await editContentPage.printRecordModal.selectPrintAction('Print to a PDF and download');

      const pdfDownload = editContentPage.page.waitForEvent('download');
      await editContentPage.printRecordModal.okButton.click();
      const pdf = await pdfDownload;
      pdfFilePath = await downloadService.saveDownload(pdf);
    });

    await test.step('Verify the printed content record contains expected text', async () => {
      const foundCreatedByText = await pdfParser.findTextInPDF(pdfFilePath, ['Created By', 'John Wick']);
      expect(foundCreatedByText).toBe(true);
    });
  });

  test('Pin a content record', async ({ targetApp, addContentPage, editContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-311',
    });

    let createdRecordId: number;

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      createdRecordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Pin the content record', async () => {
      await editContentPage.pinRecordButton.click();
    });

    await test.step('Verify the content record was pinned', async () => {
      const pinnedRecordLink = editContentPage.sidebar.pinnedContent.locator(
        `a[href="/Content/${targetApp.id}/${createdRecordId}"]`
      );

      await expect(pinnedRecordLink).toBeVisible();
    });
  });

  test('View version history for a content record', async ({ targetApp, addContentPage, editContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-892',
    });

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('View the version history', async () => {
      await editContentPage.openVersionHistory();
    });

    await test.step('Verify the version history is displayed', async () => {
      await expect(editContentPage.viewVersionHistoryModal.modal()).toBeVisible();
    });
  });

  test('Filter version history for a content record', async ({ targetApp, addContentPage, editContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-893',
    });

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    await test.step('Create the content record', async () => {
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Filter the version history', async () => {
      await editContentPage.openVersionHistory();

      const YESTERDAY_IN_MS = Date.now() - 86_400_000;

      await editContentPage.viewVersionHistoryModal.filterBy({
        fromDate: new Date(YESTERDAY_IN_MS),
        toDate: new Date(YESTERDAY_IN_MS),
      });
    });

    await test.step('Verify the version history is filtered', async () => {
      const versionRows = await editContentPage.viewVersionHistoryModal.getVersionRows();
      expect(versionRows).toHaveLength(0);
    });
  });

  test('Export version history for a content record', async ({
    addContentPage,
    targetApp,
    editContentPage,
    testUser,
    testUserPage,
    sysAdminUser,
    sysAdminEmail,
    sysAdminPage,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-894',
    });

    test.slow();

    await test.step('Navigate to the add content page', async () => {
      await addContentPage.goto(targetApp.id);
    });

    let recordId: number;

    await test.step('Create the content record', async () => {
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Export the version history', async () => {
      const testUserEditContentPage = new EditContentPage(testUserPage);
      await testUserEditContentPage.goto(targetApp.id, recordId);

      await testUserEditContentPage.openVersionHistory();

      await testUserEditContentPage.viewVersionHistoryModal.exportReport();
    });

    let exportEmailContent: string;

    await test.step('Verify the version history was exported', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', testUser.email], ['TEXT', 'Version History'], ['UNSEEN']];
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
      await sysAdminPage.setContent(exportEmailContent);

      const reportDownload = sysAdminPage.waitForEvent('download');
      await sysAdminPage.getByRole('link').click();
      const report = await reportDownload;
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
