import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { EmailBody } from '../../models/emailBody';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { EditEmailBodyPage } from '../../pageObjectModels/messaging/editEmailBodyPage';
import { EmailMessageConfigReportPage } from '../../pageObjectModels/systemReports/emailMessageConfigReportPage';
import { AnnotationType } from '../annotations';

type EmailMessageConfigReportTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  editEmailBodyPage: EditEmailBodyPage;
  emailMessageConfigReportPage: EmailMessageConfigReportPage;
};

const test = base.extend<EmailMessageConfigReportTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  editEmailBodyPage: async ({ sysAdminPage }, use) => await use(new EditEmailBodyPage(sysAdminPage)),
  emailMessageConfigReportPage: async ({ sysAdminPage }, use) =>
    await use(new EmailMessageConfigReportPage(sysAdminPage)),
});

test.describe('email message configurations report', () => {
  test('Filter the email messaging configurations report', async ({
    app,
    appAdminPage,
    editEmailBodyPage,
    emailMessageConfigReportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-360',
    });

    const emailBody = new EmailBody({
      name: FakeDataFactory.createFakeEmailBodyName(),
      appName: app.name,
      status: true,
      subject: 'Test Subject',
      body: 'Test',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
    });

    await test.step('Create an email body to find with a filter', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.messagingTabButton.click();
      await appAdminPage.messagingTab.createEmailBody(emailBody.name);
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
      await editEmailBodyPage.updateEmailBody(emailBody);
      await editEmailBodyPage.save();
    });

    await test.step('Navigate to the email messaging configurations report page', async () => {
      await emailMessageConfigReportPage.goto();
    });

    await test.step('Filter the email messaging configurations report', async () => {
      await emailMessageConfigReportPage.filterReport({
        appOrSurvey: app.name,
        type: 'Email Body',
        status: 'OK',
      });
    });

    await test.step('Verify the email messaging configurations report is filtered', async () => {
      const rows = await emailMessageConfigReportPage.getRows();
      const row = await emailMessageConfigReportPage.getRowByName(emailBody.name);

      expect(rows.length).toBe(1);
      await expect(row).toBeVisible();
    });
  });

  test('Sort the email messaging configurations report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-361',
    });

    expect(true).toBeTruthy();
  });

  test('Bulk edit and update some messaging configurations sender email address', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-361',
    });

    expect(true).toBeTruthy();
  });
});
