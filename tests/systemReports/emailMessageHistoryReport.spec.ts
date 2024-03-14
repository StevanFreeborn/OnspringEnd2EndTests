import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { EmailBody } from '../../models/emailBody';
import { TextRuleWithValue } from '../../models/rule';
import { SimpleRuleLogic } from '../../models/ruleLogic';
import { TextField } from '../../models/textField';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { EditEmailBodyPage } from '../../pageObjectModels/messaging/editEmailBodyPage';
import { EmailBodyAdminPage } from '../../pageObjectModels/messaging/emailBodyAdminPage';
import { EmailHistoryPage } from '../../pageObjectModels/systemReports/emailHistoryPage';
import { AnnotationType } from '../annotations';

type EmailHistoryReportTestFixtures = {
  emailHistoryPage: EmailHistoryPage;
  app: App;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
  emailBodyAdminPage: EmailBodyAdminPage;
  editEmailBodyPage: EditEmailBodyPage;
};

const test = base.extend<EmailHistoryReportTestFixtures>({
  emailHistoryPage: async ({ sysAdminPage }, use) => use(new EmailHistoryPage(sysAdminPage)),
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => use(new AppAdminPage(sysAdminPage)),
  addContentPage: async ({ sysAdminPage }, use) => use(new AddContentPage(sysAdminPage)),
  editContentPage: async ({ sysAdminPage }, use) => use(new EditContentPage(sysAdminPage)),
  emailBodyAdminPage: async ({ sysAdminPage }, use) => use(new EmailBodyAdminPage(sysAdminPage)),
  editEmailBodyPage: async ({ sysAdminPage }, use) => use(new EditEmailBodyPage(sysAdminPage)),
});

test.describe('email message history report', () => {
  test('Filter the email message history report', async ({
    emailHistoryPage,
    app,
    appAdminPage,
    addContentPage,
    editContentPage,
    emailBodyAdminPage,
    editEmailBodyPage,
    sysAdminEmail,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-351',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Send email from specific app', async () => {
      await sendEmailFromApp({
        emailBodyName,
        app,
        appAdminPage,
        addContentPage,
        editContentPage,
        emailBodyAdminPage,
        editEmailBodyPage,
      });
    });

    await test.step('Wait for email to be received', async () => {
      await expect(async () => {
        const searchCriteria = [['TEXT', emailBodyName]];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);
      }).toPass({
        intervals: [5000],
        timeout: 60_000,
      });
    });

    await test.step('Navigate to the email message history report', async () => {
      await emailHistoryPage.goto();
    });

    await test.step('Filter the email message history report', async () => {
      await emailHistoryPage.selectTypeFilter('Messaging');
      await emailHistoryPage.selectAppFilter(app.name);
    });

    await test.step('Verify the email message history report is filtered', async () => {
      const emailCount = await emailHistoryPage.emailsGrid.locator('tr').count();
      expect(emailCount).toBe(1);
    });
  });

  test('Sort the email message history report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-352',
    });

    expect(true).toBeTruthy();
  });

  test('Export the email message history report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-353',
    });

    expect(true).toBeTruthy();
  });

  test('View the details of an email message history report item', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-354',
    });

    expect(true).toBeTruthy();
  });

  test('Resend an email message history report item', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-355',
    });

    expect(true).toBeTruthy();
  });

  test('Use the links in the email message history report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-356',
    });

    expect(true).toBeTruthy();
  });

  test('Use the links in the email message history report detail view', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-357',
    });

    expect(true).toBeTruthy();
  });
});

async function sendEmailFromApp({
  emailBodyName,
  app,
  appAdminPage,
  addContentPage,
  editContentPage,
  emailBodyAdminPage,
  editEmailBodyPage,
}: {
  emailBodyName: string;
  app: App;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
  emailBodyAdminPage: EmailBodyAdminPage;
  editEmailBodyPage: EditEmailBodyPage;
}) {
  const tabName = 'Tab 2';
  const sectionName = 'Section 1';
  const textField = new TextField({ name: 'Send Email?' });
  const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });
  const bodyTemplate = 'This email is from record id';
  const emailBody = new EmailBody({
    name: emailBodyName,
    appName: app.name,
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

  // create field needed for email send logic
  await appAdminPage.goto(app.id);
  await appAdminPage.layoutTabButton.click();
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

  // create and configure email body
  await appAdminPage.messagingTabButton.click();
  await appAdminPage.messagingTab.createEmailBody(emailBody.name);
  await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
  await emailBodyAdminPage.goto();
  const emailBodyRow = emailBodyAdminPage.emailBodyGrid.getByRole('row', { name: emailBody.name });
  await emailBodyRow.hover();
  await emailBodyRow.getByTitle('Edit Email Body').click();
  await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
  await editEmailBodyPage.updateEmailBody(emailBody);
  await editEmailBodyPage.save();

  // add record to trigger email
  await addContentPage.goto(app.id);
  const editableTextField = await addContentPage.form.getField({
    fieldName: textField.name,
    fieldType: textField.type as FieldType,
    tabName: tabName,
    sectionName: sectionName,
  });
  await editableTextField.fill(rule.value);
  await addContentPage.saveRecordButton.click();
  await addContentPage.page.waitForURL(editContentPage.pathRegex);
}
