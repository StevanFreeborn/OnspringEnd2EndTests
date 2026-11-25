import {
  AdminReportPermission,
  App,
  AppPermission,
  EmailBody,
  FakeDataFactory,
  LayoutItem,
  Permission,
  Role,
  SimpleRuleLogic,
  TextField,
  TextRuleWithValue,
  User,
} from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  ContentQuestions,
  ContentTasks,
  EditEmailBodyPageTargets,
  EditUserPageTargets,
  EmailBodyTasks,
  EmailMessageHistoryReportTargets,
  EmailMessageHistoryReportTasks,
  SystemReportQuestions,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { env } from '../../env';
import { ActorFixture, AppFixture, expect, RoleFixture, test as base, UserFixture } from '../../fixtures';
import { EmailService } from '../../services/emailService';
import { AnnotationType } from '../annotations';

type EmailHistoryReportTestFixtures = {
  app: App;
  role: Role;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<EmailHistoryReportTestFixtures>({
  app: AppFixture.create().build(),
  role: RoleFixture.create()
    .withStatus('Active')
    .withAppPermissions(({ app }) => [
      new AppPermission({
        appName: app.name,
        contentRecords: new Permission({ read: true }),
      }),
    ])
    .withAdminReportPermissions([
      new AdminReportPermission({
        reportName: 'Email Message History',
        permission: { read: true },
      }),
    ])
    .build(),
  user: UserFixture.create()
    .withStatus('Active')
    .withRoles(({ role }) => [role.name])
    .build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('email message history report', () => {
  test.slow();

  test('Filter the email message history report', async ({ sysAdminActor, app, sysAdminEmail }) => {
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
      await addItemToAppLayout({ actor: sysAdminActor, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ actor: sysAdminActor, app, emailBody });
      await addRecordToTriggerEmail({ actor: sysAdminActor, app, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    await test.step('Navigate to the email message history report', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.goto());
    });

    await test.step('Filter the email message history report', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.filterReport({ emailType: 'Messaging', app }));
    });

    await test.step('Verify the email message history report is filtered', async () => {
      await sysAdminActor.browse().check(EmailMessageHistoryReportTargets.rows).hasCount(1);
    });
  });

  test('Sort the email message history report', async ({ sysAdminActor, app, sysAdminEmail }) => {
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
      await addItemToAppLayout({ actor: sysAdminActor, app, item: textField, tabName, sectionName });
    });

    for (const [index, emailBody] of emailBodies.entries()) {
      await test.step(`Send email number ${index + 1} from specific app`, async () => {
        await createAndConfigureEmailBody({ actor: sysAdminActor, app, emailBody });
        await addRecordToTriggerEmail({ actor: sysAdminActor, app, rule, tabName, sectionName });
      });
    }

    for (const [index, emailBody] of emailBodies.entries()) {
      await test.step(`Wait for email number ${index + 1} to be received`, async () => {
        await verifyEmailReceived({ emailBodyName: emailBody.name, sysAdminEmail });
      });
    }

    await test.step('Navigate to the email message history report', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.goto());
    });

    await test.step('Filter the email message history report', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.filterReport({ emailType: 'Messaging', app }));
    });

    await test.step('Sort the email message history report', async () => {
      await sysAdminActor.attemptsTo(
        EmailMessageHistoryReportTasks.clearGridSorting(),
        EmailMessageHistoryReportTasks.sortGridBy('Subject')
      );
    });

    await test.step('Verify the email message history report is sorted', async () => {
      const firstEmailSubject = await sysAdminActor
        .browse()
        .getText(EmailMessageHistoryReportTargets.firstRowSubjectCell);
      const lastEmailSubject = await sysAdminActor
        .browse()
        .getText(EmailMessageHistoryReportTargets.lastRowSubjectCell);

      expect(firstEmailSubject).toContain(emailBodies[0].subject);
      expect(lastEmailSubject).toContain(emailBodies[1].subject);
    });
  });

  test('Export the email message history report', async ({
    user,
    app,
    sysAdminActor,
    sysAdminEmail,
    testUserActor,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-353',
    });

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
      await addItemToAppLayout({ actor: sysAdminActor, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ actor: sysAdminActor, app, emailBody });
      await addRecordToTriggerEmail({ actor: sysAdminActor, app, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    await test.step('Navigate to the email message history report', async () => {
      await testUserActor.attemptsTo(EmailMessageHistoryReportTasks.goto());
    });

    await test.step('Filter the email message history report', async () => {
      await testUserActor.attemptsTo(EmailMessageHistoryReportTasks.filterReport({ emailType: 'Messaging', app }));
    });

    await test.step('Export the email message history report', async () => {
      await testUserActor.attemptsTo(EmailMessageHistoryReportTasks.exportReport());
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
      const report = await testUserActor.asks(SystemReportQuestions.downloadedExportFromEmailHtml(exportEmailContent));
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

  test('View the details of an email message history report item', async ({ sysAdminActor, app, sysAdminEmail }) => {
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
      await addItemToAppLayout({ actor: sysAdminActor, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ actor: sysAdminActor, app, emailBody });
      await addRecordToTriggerEmail({ actor: sysAdminActor, app, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    await test.step('Navigate to the email message history report', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.goto());
    });

    await test.step('Filter the email message history report', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.filterReport({ emailType: 'Messaging', app }));
    });

    await test.step('Open the details of an email message history report item', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.openMessageDetails(emailBody.subject));
    });

    await test.step('Verify the email message history report item details are displayed', async () => {
      await sysAdminActor
        .browse()
        .check(EmailMessageHistoryReportTargets.messageDetailModal.subject)
        .hasText(emailBody.subject);
    });
  });

  test('Resend an email message history report item', async ({ sysAdminActor, app, sysAdminEmail }) => {
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
      await addItemToAppLayout({ actor: sysAdminActor, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ actor: sysAdminActor, app, emailBody });
      await addRecordToTriggerEmail({ actor: sysAdminActor, app, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    await test.step('Navigate to the email message history report', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.goto());
    });

    await test.step('Filter the email message history report', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.filterReport({ emailType: 'Messaging', app }));
    });

    await test.step('Resend the email', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.resendEmail(emailBody.subject));
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

  test('Use the To Name link in the email message history report', async ({ sysAdminActor, app, sysAdminEmail }) => {
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
      await addItemToAppLayout({ actor: sysAdminActor, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ actor: sysAdminActor, app, emailBody });
      await addRecordToTriggerEmail({ actor: sysAdminActor, app, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    await test.step('Navigate to the email message history report', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.goto());
    });

    await test.step('Filter the email message history report', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.filterReport({ emailType: 'Messaging', app }));
    });

    await test.step('Click on the To Name link', async () => {
      await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.clickToNameLink(emailBody.subject));
    });

    await test.step("Verify the To Name link opens the user's security record", async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditUserPageTargets.pathRegex);
    });
  });

  test('Use the links in the email message history report detail view', async ({
    sysAdminActor,
    app,
    sysAdminEmail,
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
    let recordId = 0;

    await test.step('Send email from specific app', async () => {
      await addItemToAppLayout({ actor: sysAdminActor, app, item: textField, tabName, sectionName });
      await createAndConfigureEmailBody({ actor: sysAdminActor, app, emailBody });
      recordId = await addRecordToTriggerEmail({ actor: sysAdminActor, app, rule, tabName, sectionName });
    });

    await test.step('Wait for email to be received', async () => {
      await verifyEmailReceived({ emailBodyName, sysAdminEmail });
    });

    const links = [
      {
        linkName: 'To',
        target: EmailMessageHistoryReportTargets.messageDetailModal.toLink,
        expectedPathRegex: EditUserPageTargets.pathRegex,
      },
      {
        linkName: 'Email Body',
        target: EmailMessageHistoryReportTargets.messageDetailModal.emailBodyLink,
        expectedPathRegex: EditEmailBodyPageTargets.pathRegex,
      },
      {
        linkName: 'Record',
        target: EmailMessageHistoryReportTargets.messageDetailModal.recordLink,
        expectedPathRegex: new RegExp(`/Content/${app.id}/${recordId}`),
      },
    ];

    for (const link of links) {
      await test.step('Navigate to the email message history report', async () => {
        await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.goto());
      });

      await test.step('Filter the email message history report', async () => {
        await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.filterReport({ emailType: 'Messaging', app }));
      });

      await test.step('Open the details of the email message history report item', async () => {
        await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.openMessageDetails(emailBody.subject));
      });

      await test.step(`Click on the ${link.linkName} link`, async () => {
        await sysAdminActor.browse().click(link.target);
      });

      await test.step("Verify the To Name link opens the user's security record", async () => {
        await sysAdminActor.browse().checkPage().hasUrl(link.expectedPathRegex);
      });

      await test.step('Navigate back to the email message history report', async () => {
        await sysAdminActor.attemptsTo(EmailMessageHistoryReportTasks.goto());
      });
    }
  });
});

async function addItemToAppLayout({
  actor,
  app,
  item,
  tabName,
  sectionName,
}: {
  actor: WebActor;
  app: App;
  item: LayoutItem;
  tabName: string;
  sectionName: string;
}) {
  await actor.attemptsTo(
    AppTasks.gotoAppLayoutTab(app.id),
    AppTasks.openLayoutDesigner(),
    AppTasks.addLayoutItemInLayoutDesigner(item)
  );

  if (item.type === 'Formatted Text Block') {
    await actor.attemptsTo(
      AppTasks.dragObjectOntoLayout({
        objectName: item.name,
        tabName,
        sectionName,
        row: 0,
        column: 0,
      })
    );
  } else {
    await actor.attemptsTo(
      AppTasks.dragFieldOntoLayout({
        fieldName: item.name,
        tabName,
        sectionName,
        row: 0,
        column: 0,
      })
    );
  }

  await actor.attemptsTo(AppTasks.saveAndCloseLayout());
}

async function createAndConfigureEmailBody({
  actor,
  app,
  emailBody,
}: {
  actor: WebActor;
  app: App;
  emailBody: EmailBody;
}) {
  await actor.attemptsTo(
    AppTasks.gotoAppMessagingTab(app.id),
    EmailBodyTasks.createFromAppMessagingTab(emailBody.name),
    EmailBodyTasks.update(emailBody),
    EmailBodyTasks.save()
  );
}

async function addRecordToTriggerEmail({
  actor,
  app,
  rule,
  tabName,
  sectionName,
}: {
  actor: WebActor;
  app: App;
  rule: TextRuleWithValue;
  tabName: string;
  sectionName: string;
}): Promise<number> {
  await actor.attemptsTo(
    ContentTasks.gotoAdd(app.id),
    ContentTasks.fillTextField({
      tabName,
      sectionName,
      fieldName: rule.fieldName,
      value: rule.value,
    }),
    ContentTasks.saveRecord()
  );

  return actor.asks(ContentQuestions.currentRecordId());
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
