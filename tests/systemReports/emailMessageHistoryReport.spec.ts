import { Page } from '@playwright/test';
import { env } from '../../env';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { testUserPage } from '../../fixtures/auth.fixtures';
import { activeUserWithRole } from '../../fixtures/user.fixtures';
import { App } from '../../models/app';
import { EmailBody } from '../../models/emailBody';
import { LayoutItem } from '../../models/layoutItem';
import { AdminReportPermission, AppPermission, Permission, Role } from '../../models/role';
import { TextRuleWithValue } from '../../models/rule';
import { SimpleRuleLogic } from '../../models/ruleLogic';
import { TextField } from '../../models/textField';
import { User } from '../../models/user';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { EditEmailBodyPage } from '../../pageObjectModels/messaging/editEmailBodyPage';
import { EmailBodyAdminPage } from '../../pageObjectModels/messaging/emailBodyAdminPage';
import { AddRoleAdminPage } from '../../pageObjectModels/roles/addRoleAdminPage';
import { EditRoleAdminPage } from '../../pageObjectModels/roles/editRoleAdminPage';
import { RolesSecurityAdminPage } from '../../pageObjectModels/roles/rolesSecurityAdminPage';
import { EmailHistoryPage } from '../../pageObjectModels/systemReports/emailHistoryPage';
import { UserAdminPage } from '../../pageObjectModels/users/userAdminPage';
import { EmailService } from '../../services/emailService';
import { AnnotationType } from '../annotations';

type EmailHistoryReportTestFixtures = {
  app: App;
  role: Role;
  user: User;
  testUserPage: Page;
  emailHistoryPage: EmailHistoryPage;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
  emailBodyAdminPage: EmailBodyAdminPage;
  editEmailBodyPage: EditEmailBodyPage;
  userAdminPage: UserAdminPage;
};

const test = base.extend<EmailHistoryReportTestFixtures>({
  app: app,
  role: async ({ sysAdminPage, app }, use) => {
    const addRoleAdminPage = new AddRoleAdminPage(sysAdminPage);
    const editRoleAdminPage = new EditRoleAdminPage(sysAdminPage);
    const roleSecurityAdminPage = new RolesSecurityAdminPage(sysAdminPage);
    const roleName = FakeDataFactory.createFakeRoleName();
    const role = new Role({
      name: roleName,
      status: 'Active',
      appPermissions: [
        new AppPermission({
          appName: app.name,
          contentRecords: new Permission({ read: true }),
        }),
      ],
      adminReportPermissions: [
        new AdminReportPermission({
          reportName: 'Email Message History',
          permission: { read: true },
        }),
      ],
    });

    await addRoleAdminPage.addRole(role);
    await addRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
    await editRoleAdminPage.page.waitForLoadState();

    role.id = editRoleAdminPage.getRoleIdFromUrl();

    await use(role);

    await roleSecurityAdminPage.deleteRoles([roleName]);
  },
  user: activeUserWithRole,
  testUserPage: testUserPage,
  emailHistoryPage: async ({ sysAdminPage }, use) => use(new EmailHistoryPage(sysAdminPage)),
  appAdminPage: async ({ sysAdminPage }, use) => use(new AppAdminPage(sysAdminPage)),
  addContentPage: async ({ sysAdminPage }, use) => use(new AddContentPage(sysAdminPage)),
  editContentPage: async ({ sysAdminPage }, use) => use(new EditContentPage(sysAdminPage)),
  emailBodyAdminPage: async ({ sysAdminPage }, use) => use(new EmailBodyAdminPage(sysAdminPage)),
  editEmailBodyPage: async ({ sysAdminPage }, use) => use(new EditEmailBodyPage(sysAdminPage)),
  userAdminPage: async ({ sysAdminPage }, use) => use(new UserAdminPage(sysAdminPage)),
});

test.describe('email message history report', () => {
  test.slow();

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
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textField = new TextField({ name: 'Send Email?' });
    const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });
    const emailBody = new EmailBody({
      name: emailBodyName,
      appName: app.name,
      status: true,
      subject: `${emailBodyName} - Test Subject`,
      body: 'This is a test email body',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
      sendLogic: new SimpleRuleLogic({
        rules: [rule],
      }),
    });

    await test.step('Send email from specific app', async () => {
      await addItemToAppLayout({ appAdminPage, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ app, appAdminPage, emailBody, emailBodyAdminPage, editEmailBodyPage });
      await addRecordToTriggerEmail({ addContentPage, app, editContentPage, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    await test.step('Navigate to the email message history report', async () => {
      await emailHistoryPage.goto();
    });

    await test.step('Filter the email message history report', async () => {
      await emailHistoryPage.selectTypeFilter('Messaging');
      await emailHistoryPage.selectAppFilter(app);
    });

    await test.step('Verify the email message history report is filtered', async () => {
      const emailCount = await emailHistoryPage.emailsGridBody.locator('tr').count();
      expect(emailCount).toBe(1);
    });
  });

  test('Sort the email message history report', async ({
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
      description: 'Test-352',
    });

    const emailBodyNames = [FakeDataFactory.createFakeEmailBodyName(), FakeDataFactory.createFakeEmailBodyName()];

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textField = new TextField({ name: 'Send Email?' });
    const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });
    const emailBodies = emailBodyNames.map(
      (emailBodyName, i) =>
        new EmailBody({
          name: emailBodyName,
          appName: app.name,
          status: true,
          subject: `${i} ${emailBodyName} - Test Subject`,
          body: 'This is a test email body',
          fromName: 'Automation Test',
          fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
          recipientsBasedOnFields: ['Created By'],
          sendLogic: new SimpleRuleLogic({
            rules: [rule],
          }),
        })
    );

    await test.step('Add field for email send logic', async () => {
      await addItemToAppLayout({ appAdminPage, app, item: textField, tabName, sectionName });
    });

    for (const [index, emailBody] of emailBodies.entries()) {
      await test.step(`Send email number ${index + 1} from specific app`, async () => {
        await createAndConfigureEmailBody({ app, appAdminPage, emailBody, emailBodyAdminPage, editEmailBodyPage });
        await addRecordToTriggerEmail({ addContentPage, app, editContentPage, rule, tabName, sectionName });
      });
    }

    for (const [index, emailBody] of emailBodies.entries()) {
      await test.step(`Wait for email number ${index + 1} to be received`, async () => {
        await verifyEmailReceived({ emailBodyName: emailBody.name, sysAdminEmail });
      });
    }

    await test.step('Navigate to the email message history report', async () => {
      await emailHistoryPage.goto();
    });

    await test.step('Filter the email message history report', async () => {
      await emailHistoryPage.selectTypeFilter('Messaging');
      await emailHistoryPage.selectAppFilter(app);
    });

    await test.step('Sort the email message history report', async () => {
      await emailHistoryPage.clearGridSorting();
      await emailHistoryPage.sortGridBy('Subject');
    });

    await test.step('Verify the email message history report is sorted', async () => {
      const firstEmail = emailHistoryPage.emailsGridBody.locator('tr').first();
      const lastEmail = emailHistoryPage.emailsGridBody.locator('tr').last();

      const firstEmailSubject = await firstEmail.locator('td').nth(4).innerText();
      const lastEmailSubject = await lastEmail.locator('td').nth(4).innerText();

      expect(firstEmailSubject).toContain(emailBodies[0].subject);
      expect(lastEmailSubject).toContain(emailBodies[1].subject);
    });
  });

  test('Export the email message history report', async ({
    user,
    app,
    appAdminPage,
    addContentPage,
    editContentPage,
    emailBodyAdminPage,
    editEmailBodyPage,
    sysAdminEmail,
    testUserPage,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-353',
    });

    const emailHistoryPage = new EmailHistoryPage(testUserPage);
    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const testEmailSubject = `${emailBodyName} - Test Subject`;
    const testFromAddress = FakeDataFactory.createFakeEmailFromAddress();
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textField = new TextField({ name: 'Send Email?' });
    const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });
    const emailBody = new EmailBody({
      name: emailBodyName,
      appName: app.name,
      status: true,
      subject: testEmailSubject,
      body: 'This is a test email body',
      fromName: 'Automation Test',
      fromAddress: testFromAddress,
      recipientsBasedOnFields: ['Created By'],
      sendLogic: new SimpleRuleLogic({
        rules: [rule],
      }),
    });

    await test.step('Send email from specific app', async () => {
      await addItemToAppLayout({ appAdminPage, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ app, appAdminPage, emailBody, emailBodyAdminPage, editEmailBodyPage });
      await addRecordToTriggerEmail({ addContentPage, app, editContentPage, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    await test.step('Navigate to the email message history report', async () => {
      await emailHistoryPage.goto();
    });

    await test.step('Filter the email message history report', async () => {
      await emailHistoryPage.selectTypeFilter('Messaging');
      await emailHistoryPage.selectAppFilter(app);
    });

    await test.step('Export the email message history report', async () => {
      await emailHistoryPage.exportReport();
    });

    let exportEmailContent: string;

    await test.step('Verify the email message history report is exported', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', user.email], ['TEXT', 'Email Message History'], ['UNSEEN']];
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

    await test.step('Download the exported email message history report', async () => {
      await testUserPage.setContent(exportEmailContent);

      const reportDownload = testUserPage.waitForEvent('download');
      await testUserPage.getByRole('link', { name: 'Download the export file' }).click();
      const report = await reportDownload;
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData).toHaveLength(1);

      const sheet = reportData[0];
      expect(sheet.name).toEqual('Report Data');
      expect(sheet.data).toHaveLength(1);
      expect(sheet.data[0]).toEqual({
        'Email Type': 'Messaging',
        'To Name': `${env.SYS_ADMIN_FIRST_NAME} ${env.SYS_ADMIN_LAST_NAME}`,
        'To Address': env.SYS_ADMIN_EMAIL,
        'From Address': testFromAddress,
        Subject: testEmailSubject,
        'Time Created': expect.any(Date),
        'Time Sent': expect.any(Date),
      });
    });
  });

  test('View the details of an email message history report item', async ({
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
      description: 'Test-354',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textField = new TextField({ name: 'Send Email?' });
    const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });
    const emailBody = new EmailBody({
      name: emailBodyName,
      appName: app.name,
      status: true,
      subject: `${emailBodyName} - Test Subject`,
      body: 'This is a test email body',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
      sendLogic: new SimpleRuleLogic({
        rules: [rule],
      }),
    });

    await test.step('Send email from specific app', async () => {
      await addItemToAppLayout({ appAdminPage, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ app, appAdminPage, emailBody, emailBodyAdminPage, editEmailBodyPage });
      await addRecordToTriggerEmail({ addContentPage, app, editContentPage, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    await test.step('Navigate to the email message history report', async () => {
      await emailHistoryPage.goto();
    });

    await test.step('Filter the email message history report', async () => {
      await emailHistoryPage.selectTypeFilter('Messaging');
      await emailHistoryPage.selectAppFilter(app);
    });

    await test.step('Open the details of an email message history report item', async () => {
      await emailHistoryPage.emailsGridBody.getByRole('row', { name: emailBody.subject }).click();
    });

    await test.step('Verify the email message history report item details are displayed', async () => {
      await expect(emailHistoryPage.messageDetailModal.subject).toHaveText(emailBody.subject);
    });
  });

  test('Resend an email message history report item', async ({
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
      description: 'Test-355',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textField = new TextField({ name: 'Send Email?' });
    const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });
    const emailBody = new EmailBody({
      name: emailBodyName,
      appName: app.name,
      status: true,
      subject: `${emailBodyName} - Test Subject`,
      body: 'This is a test email body',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
      sendLogic: new SimpleRuleLogic({
        rules: [rule],
      }),
    });

    await test.step('Send email from specific app', async () => {
      await addItemToAppLayout({ appAdminPage, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ app, appAdminPage, emailBody, emailBodyAdminPage, editEmailBodyPage });
      await addRecordToTriggerEmail({ addContentPage, app, editContentPage, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    await test.step('Navigate to the email message history report', async () => {
      await emailHistoryPage.goto();
    });

    await test.step('Filter the email message history report', async () => {
      await emailHistoryPage.selectTypeFilter('Messaging');
      await emailHistoryPage.selectAppFilter(app);
    });

    await test.step('Resend the email', async () => {
      const emailRow = emailHistoryPage.emailsGridBody.getByRole('row', { name: emailBody.subject });
      await emailRow.getByRole('link', { name: 'Resend' }).click();
      await emailHistoryPage.resendEmailDialog.okButton.click();
    });

    await test.step('Verify the email was resent', async () => {
      await expect(async () => {
        const searchCriteria = ['UNSEEN', ['TEXT', emailBodyName]];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);
      }).toPass({
        intervals: [30_000],
        timeout: 300_000,
      });
    });
  });

  test('Use the To Name link in the email message history report', async ({
    emailHistoryPage,
    app,
    appAdminPage,
    addContentPage,
    editContentPage,
    emailBodyAdminPage,
    editEmailBodyPage,
    sysAdminEmail,
    userAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-356',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textField = new TextField({ name: 'Send Email?' });
    const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });
    const emailBody = new EmailBody({
      name: emailBodyName,
      appName: app.name,
      status: true,
      subject: `${emailBodyName} - Test Subject`,
      body: 'This is a test email body',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
      sendLogic: new SimpleRuleLogic({
        rules: [rule],
      }),
    });

    await test.step('Send email from specific app', async () => {
      await addItemToAppLayout({ appAdminPage, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ app, appAdminPage, emailBody, emailBodyAdminPage, editEmailBodyPage });
      await addRecordToTriggerEmail({ addContentPage, app, editContentPage, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    await test.step('Navigate to the email message history report', async () => {
      await emailHistoryPage.goto();
    });

    await test.step('Filter the email message history report', async () => {
      await emailHistoryPage.selectTypeFilter('Messaging');
      await emailHistoryPage.selectAppFilter(app);
    });

    await test.step('Click on the To Name link', async () => {
      const emailRow = emailHistoryPage.emailsGridBody.getByRole('row', { name: emailBody.subject });
      await emailRow.getByRole('gridcell').nth(1).getByRole('link').click();
    });

    await test.step("Verify the To Name link opens the user's security record", async () => {
      await expect(emailHistoryPage.page).toHaveURL(userAdminPage.pathRegex);
    });
  });

  test('Use the links in the email message history report detail view', async ({
    emailHistoryPage,
    app,
    appAdminPage,
    addContentPage,
    editContentPage,
    emailBodyAdminPage,
    editEmailBodyPage,
    sysAdminEmail,
    userAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-357',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textField = new TextField({ name: 'Send Email?' });
    const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });
    const emailBody = new EmailBody({
      name: emailBodyName,
      appName: app.name,
      status: true,
      subject: `${emailBodyName} - Test Subject`,
      body: 'This is a test email body',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
      sendLogic: new SimpleRuleLogic({
        rules: [rule],
      }),
    });
    let recordId: number;

    await test.step('Send email from specific app', async () => {
      await addItemToAppLayout({ appAdminPage, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ app, appAdminPage, emailBody, emailBodyAdminPage, editEmailBodyPage });
      recordId = await addRecordToTriggerEmail({ addContentPage, app, editContentPage, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    const links = [
      {
        linkName: 'To',
        locator: emailHistoryPage.messageDetailModal.toLink,
        expectedPathRegex: userAdminPage.pathRegex,
      },
      {
        linkName: 'Email Body',
        locator: emailHistoryPage.messageDetailModal.emailBodyLink,
        expectedPathRegex: editEmailBodyPage.pathRegex,
      },
      {
        linkName: 'Record',
        locator: emailHistoryPage.messageDetailModal.recordLink,
        expectedPathRegex: new RegExp(`/Content/${app.id}/${recordId!}`),
      },
    ];

    for (const link of links) {
      await test.step('Navigate to the email message history report', async () => {
        await emailHistoryPage.goto();
      });

      await test.step('Filter the email message history report', async () => {
        await emailHistoryPage.selectTypeFilter('Messaging');
        await emailHistoryPage.selectAppFilter(app);
      });

      await test.step('Open the details of the email message history report item', async () => {
        await emailHistoryPage.emailsGridBody.getByRole('row', { name: emailBody.subject }).click();
      });

      await test.step(`Click on the ${link.linkName} link`, async () => {
        await link.locator.click();
      });

      await test.step("Verify the To Name link opens the user's security record", async () => {
        await expect(emailHistoryPage.page).toHaveURL(link.expectedPathRegex);
      });

      await test.step('Navigate back to the email message history report', async () => {
        await emailHistoryPage.goto();
      });
    }
  });
});

async function addItemToAppLayout({
  appAdminPage,
  app,
  item,
  tabName,
  sectionName,
}: {
  appAdminPage: AppAdminPage;
  app: App;
  item: LayoutItem;
  tabName: string;
  sectionName: string;
}) {
  await appAdminPage.goto(app.id);
  await appAdminPage.layoutTabButton.click();
  await appAdminPage.layoutTab.openLayout();
  await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(item);

  if (item.type === 'Formatted Text Block') {
    await appAdminPage.layoutTab.layoutDesignerModal.dragObjectOnToLayout({
      objectName: item.name,
      tabName: tabName,
      sectionName: sectionName,
      sectionRow: 0,
      sectionColumn: 0,
    });
  } else {
    await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
      fieldName: item.name,
      tabName: tabName,
      sectionName: sectionName,
      sectionRow: 0,
      sectionColumn: 0,
    });
  }

  await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
}

async function createAndConfigureEmailBody({
  app,
  appAdminPage,
  emailBody,
  emailBodyAdminPage,
  editEmailBodyPage,
}: {
  app: App;
  appAdminPage: AppAdminPage;
  emailBody: EmailBody;
  emailBodyAdminPage: EmailBodyAdminPage;
  editEmailBodyPage: EditEmailBodyPage;
}) {
  await appAdminPage.goto(app.id);
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
}

async function addRecordToTriggerEmail({
  addContentPage,
  app,
  editContentPage,
  rule,
  tabName,
  sectionName,
}: {
  addContentPage: AddContentPage;
  app: App;
  editContentPage: EditContentPage;
  rule: TextRuleWithValue;
  tabName: string;
  sectionName: string;
}) {
  await addContentPage.goto(app.id);
  const editableTextField = await addContentPage.form.getField({
    fieldName: rule.fieldName,
    fieldType: rule.fieldType,
    tabName: tabName,
    sectionName: sectionName,
  });
  await editableTextField.fill(rule.value);
  await addContentPage.saveRecordButton.click();
  await addContentPage.page.waitForURL(editContentPage.pathRegex);
  return editContentPage.getRecordIdFromUrl();
}

async function verifyEmailReceived({
  emailBodyName,
  sysAdminEmail,
}: {
  emailBodyName: string;
  sysAdminEmail: EmailService;
}) {
  await expect(async () => {
    const searchCriteria = [['TEXT', emailBodyName]];
    const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

    expect(result.isOk()).toBe(true);
  }).toPass({
    intervals: [30_000],
    timeout: 300_000,
  });
}
