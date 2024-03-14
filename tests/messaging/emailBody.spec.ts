import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { EmailBody } from '../../models/emailBody';
import { TextRuleWithValue } from '../../models/rule';
import { SimpleRuleLogic } from '../../models/ruleLogic';
import { TextField } from '../../models/textField';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { EditEmailBodyPage } from '../../pageObjectModels/messaging/editEmailBodyPage';
import { EmailBodyAdminPage } from '../../pageObjectModels/messaging/emailBodyAdminPage';
import { AnnotationType } from '../annotations';

type EmailBodyTestFixtures = {
  targetApp: App;
  adminHomePage: AdminHomePage;
  appAdminPage: AppAdminPage;
  editEmailBodyPage: EditEmailBodyPage;
  emailBodyAdminPage: EmailBodyAdminPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
};

const test = base.extend<EmailBodyTestFixtures>({
  targetApp: app,
  adminHomePage: async ({ sysAdminPage }, use) => use(new AdminHomePage(sysAdminPage)),
  appAdminPage: async ({ sysAdminPage }, use) => use(new AppAdminPage(sysAdminPage)),
  editEmailBodyPage: async ({ sysAdminPage }, use) => use(new EditEmailBodyPage(sysAdminPage)),
  emailBodyAdminPage: async ({ sysAdminPage }, use) => use(new EmailBodyAdminPage(sysAdminPage)),
  addContentPage: async ({ sysAdminPage }, use) => use(new AddContentPage(sysAdminPage)),
  editContentPage: async ({ sysAdminPage }, use) => use(new EditContentPage(sysAdminPage)),
});

test.describe('email body', () => {
  test("Add Email Body to an app from an app's Messaging tab", async ({
    targetApp,
    appAdminPage,
    editEmailBodyPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-209',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step('Navigate to the messaging tab', async () => {
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create the email body', async () => {
      await appAdminPage.messagingTab.createEmailBody(emailBodyName);
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Verify the email body was created', async () => {
      await expect(editEmailBodyPage.generalTab.nameInput).toHaveValue(emailBodyName);
    });
  });

  test("Create a copy of an Email Body on an app from an app's Messaging tab", async ({
    targetApp,
    appAdminPage,
    editEmailBodyPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-210',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const emailBodyCopyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step("Navigate to the app's admin page", async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step("Navigate to the app's Messaging tab", async () => {
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create the email body to be copied', async () => {
      await appAdminPage.messagingTab.createEmailBody(emailBodyName);
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step("Navigate back to the app's messaging tab", async () => {
      await appAdminPage.goto(targetApp.id);
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create a copy of the email body', async () => {
      await appAdminPage.messagingTab.addEmailBodyLink.click();
      await appAdminPage.messagingTab.createEmailBodyDialog.copyFromRadioButton.click();
      await appAdminPage.messagingTab.createEmailBodyDialog.copyFromDropdown.click();
      await appAdminPage.messagingTab.createEmailBodyDialog.getEmailBodyToCopy(emailBodyName).click();
      await appAdminPage.messagingTab.createEmailBodyDialog.nameInput.fill(emailBodyCopyName);
      await appAdminPage.messagingTab.createEmailBodyDialog.saveButton.click();
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Verify the Email Body was created', async () => {
      await expect(editEmailBodyPage.generalTab.nameInput).toHaveValue(emailBodyCopyName);
    });
  });

  test('Add Email Body to an app from the Create button in the admin header', async ({
    targetApp,
    adminHomePage,
    editEmailBodyPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-211',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email body', async () => {
      await adminHomePage.createEmailBodyUsingHeaderCreateButton(targetApp.name, emailBodyName);
      await adminHomePage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Verify the email body was created', async () => {
      await expect(editEmailBodyPage.generalTab.nameInput).toHaveValue(emailBodyName);
    });
  });

  test('Create a copy of an Email Body on an app from the Create button in the admin header', async ({
    targetApp,
    adminHomePage,
    editEmailBodyPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-212',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const emailBodyCopyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email body to be copied', async () => {
      await adminHomePage.createEmailBodyUsingHeaderCreateButton(targetApp.name, emailBodyName);
      await adminHomePage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Copy the email body', async () => {
      await adminHomePage.createEmailBodyCopyUsingHeaderCreateButton(targetApp.name, emailBodyName, emailBodyCopyName);
    });

    await test.step('Verify the email body was copied', async () => {
      await expect(editEmailBodyPage.generalTab.nameInput).toHaveValue(emailBodyCopyName);
    });
  });

  test('Add Email Body to an app from the Create Email Body button on the email body page', async ({
    targetApp,
    emailBodyAdminPage,
    editEmailBodyPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-213',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Navigate to email body admin page', async () => {
      await emailBodyAdminPage.goto();
    });

    await test.step('Create the email body', async () => {
      await emailBodyAdminPage.createEmailBody(targetApp.name, emailBodyName);
      await emailBodyAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Verify the email body was created', async () => {
      await expect(editEmailBodyPage.generalTab.nameInput).toHaveValue(emailBodyName);
    });
  });

  test('Create a copy of an Email Body on an app from the Create Email Body button on the email body page', async ({
    targetApp,
    emailBodyAdminPage,
    editEmailBodyPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-214',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const emailBodyCopyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Navigate to the email body admin page', async () => {
      await emailBodyAdminPage.goto();
    });

    await test.step('Create the email body to be copied', async () => {
      await emailBodyAdminPage.createEmailBody(targetApp.name, emailBodyName);
      await emailBodyAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Navigate back to the email body admin page', async () => {
      await emailBodyAdminPage.goto();
    });

    await test.step('Copy the email body', async () => {
      await emailBodyAdminPage.createEmailBodyCopy(targetApp.name, emailBodyName, emailBodyCopyName);
    });

    await test.step('Verify the email body was copied', async () => {
      await expect(editEmailBodyPage.generalTab.nameInput).toHaveValue(emailBodyCopyName);
    });
  });

  test("Update an Email Body's configurations on an app from an app's Messaging tab", async ({
    targetApp,
    appAdminPage,
    editEmailBodyPage,
    addContentPage,
    editContentPage,
    sysAdminEmail,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-215',
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textField = new TextField({ name: 'Send Email?' });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });

    const bodyTemplate = 'This email is from record id';

    const emailBody = new EmailBody({
      name: emailBodyName,
      appName: targetApp.name,
      status: 'Active',
      subject: `Test Subject - ${emailBodyName}`,
      body: bodyTemplate + ' {:Record Id}',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
      sendLogic: new SimpleRuleLogic({
        rules: [rule],
      }),
    });

    await test.step("Navigate to the app's home page", async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step("Navigate to the app's layout tab", async () => {
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a field and add to app layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(textField);
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        fieldName: textField.name,
        tabName: tabName,
        sectionName: sectionName,
        sectionRow: 0,
        sectionColumn: 0,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step("Navigate to the app's messaging tab", async () => {
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create the email body to update', async () => {
      await appAdminPage.messagingTab.createEmailBody(emailBody.name);
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step("Navigate back to the app's messaging tab", async () => {
      await appAdminPage.goto(targetApp.id);
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Open email body to update', async () => {
      const emailBodyRow = appAdminPage.messagingTab.emailBodyGrid.getByRole('row', { name: emailBody.name });

      await emailBodyRow.hover();
      await emailBodyRow.getByTitle('Edit Email Body').click();
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Update the email body', async () => {
      await editEmailBodyPage.updateEmailBody(emailBody);
      await editEmailBodyPage.save();
    });

    await test.step('Add a content record that satisfies send logic', async () => {
      await addContentPage.goto(targetApp.id);
      const editableTextField = await addContentPage.form.getField({
        fieldName: textField.name,
        fieldType: textField.type as FieldType,
        tabName: tabName,
        sectionName: sectionName,
      });

      await editableTextField.fill(rule.value);

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Verify the email body was updated', async () => {
      await expect(async () => {
        const searchCriteria = [['TEXT', emailBodyName]];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();

        expect(email.subject).toBe(emailBody.subject);
        expect(email.text).toContain(bodyTemplate + ' 1');
      }).toPass({
        intervals: [5000],
        timeout: 60_000,
      });
    });
  });

  test("Update an Email Body's configurations on an app from the Email Body page", async ({
    targetApp,
    appAdminPage,
    editEmailBodyPage,
    emailBodyAdminPage,
    addContentPage,
    editContentPage,
    sysAdminEmail,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-216',
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textField = new TextField({ name: 'Send Email?' });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });

    const bodyTemplate = 'This email is from record id';

    const emailBody = new EmailBody({
      name: emailBodyName,
      appName: targetApp.name,
      status: 'Active',
      subject: `Test Subject - ${emailBodyName}`,
      body: bodyTemplate + ' {:Record Id}',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
      sendLogic: new SimpleRuleLogic({
        rules: [rule],
      }),
    });

    await test.step("Navigate to the app's home page", async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step("Navigate to the app's layout tab", async () => {
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a field and add to the app layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(textField);
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        fieldName: textField.name,
        tabName: tabName,
        sectionName: sectionName,
        sectionRow: 0,
        sectionColumn: 0,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step("Navigate to the app's messaging tab", async () => {
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create the email body to update', async () => {
      await appAdminPage.messagingTab.createEmailBody(emailBody.name);
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Navigate to the email bodies admin page', async () => {
      await emailBodyAdminPage.goto();
    });

    await test.step('Open email body to update', async () => {
      const emailBodyRow = emailBodyAdminPage.emailBodyGrid.getByRole('row', { name: emailBody.name });

      await emailBodyRow.hover();
      await emailBodyRow.getByTitle('Edit Email Body').click();
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Update the email body', async () => {
      await editEmailBodyPage.updateEmailBody(emailBody);
      await editEmailBodyPage.save();
    });

    await test.step('Add a content record that satisfies send logic', async () => {
      await addContentPage.goto(targetApp.id);
      const editableTextField = await addContentPage.form.getField({
        fieldName: textField.name,
        fieldType: textField.type as FieldType,
        tabName: tabName,
        sectionName: sectionName,
      });

      await editableTextField.fill(rule.value);

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Verify the email body was updated', async () => {
      await expect(async () => {
        const searchCriteria = [['TEXT', emailBodyName]];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();

        expect(email.subject).toBe(emailBody.subject);
        expect(email.text).toContain(bodyTemplate + ' 1');
      }).toPass({
        intervals: [5000],
        timeout: 60_000,
      });
    });
  });

  test("Delete an Email Body from an app's Messaging tab", async ({ targetApp, appAdminPage, editEmailBodyPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-217',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const emailBodyRow = appAdminPage.messagingTab.emailBodyGrid.getByRole('row', { name: emailBodyName });

    await test.step("Navigate to the app's admin page", async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step("Navigate to the app's messaging tab", async () => {
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create the email body to delete', async () => {
      await appAdminPage.messagingTab.createEmailBody(emailBodyName);
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Navigate back to the app messaging tab', async () => {
      await appAdminPage.goto(targetApp.id);
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Delete the email body', async () => {
      await emailBodyRow.hover();
      await emailBodyRow.getByTitle('Delete Email Body').click();
      await appAdminPage.messagingTab.deleteEmailBodyDialog.deleteButton.click();
    });

    await test.step('Verify the email body was deleted', async () => {
      await expect(emailBodyRow).not.toBeAttached();
    });
  });

  test('Delete an Email Body from the Email Body page', async ({
    targetApp,
    appAdminPage,
    editEmailBodyPage,
    emailBodyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-218',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const emailBodyRow = emailBodyAdminPage.emailBodyGrid.getByRole('row', { name: emailBodyName });

    await test.step("Navigate to the app's admin page", async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step("Navigate to the app's messaging tab", async () => {
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create the email body to delete', async () => {
      await appAdminPage.messagingTab.createEmailBody(emailBodyName);
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Navigate to the email bodies admin page', async () => {
      await emailBodyAdminPage.goto();
    });

    await test.step('Delete the email body', async () => {
      await emailBodyRow.hover();
      await emailBodyRow.getByTitle('Delete Email Body').click();
      await emailBodyAdminPage.deleteEmailBodyDialog.deleteButton.click();
    });

    await test.step('Verify the email body was deleted', async () => {
      await expect(emailBodyRow).not.toBeAttached();
    });
  });
});
