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
      await createEmailBody(app, emailBody, appAdminPage, editEmailBodyPage);
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

  test('Sort the email messaging configurations report', async ({
    app,
    appAdminPage,
    editEmailBodyPage,
    emailMessageConfigReportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-361',
    });

    const firstEmailBody = new EmailBody({
      name: FakeDataFactory.createFakeEmailBodyName(),
      appName: app.name,
      status: true,
      subject: 'Test A',
      body: 'Test',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
    });

    const secondEmailBody = new EmailBody({
      name: FakeDataFactory.createFakeEmailBodyName(),
      appName: app.name,
      status: true,
      subject: 'Test B',
      body: 'Test',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
    });

    await test.step('Create email bodies to sort in the report', async () => {
      await createEmailBody(app, firstEmailBody, appAdminPage, editEmailBodyPage);
      await createEmailBody(app, secondEmailBody, appAdminPage, editEmailBodyPage);
    });

    await test.step('Navigate to the email messaging configurations report page', async () => {
      await emailMessageConfigReportPage.goto();
    });

    await test.step('Filter the report to just the test app', async () => {
      await emailMessageConfigReportPage.filterReport({
        appOrSurvey: app.name,
        type: 'Email Body',
        status: 'OK',
      });
    });

    await test.step('Sort the email messaging configurations report', async () => {
      await emailMessageConfigReportPage.sortGridBy('App/Survey Name', 'ascending');
    });

    await test.step('Verify the email messaging configurations report is sorted', async () => {
      const rows = await emailMessageConfigReportPage.getRows();

      await expect(rows[0]).toHaveText(new RegExp(`^${app.name}.*${firstEmailBody.name}.*$`));
      await expect(rows[1]).toHaveText(new RegExp(`^${app.name}.*${secondEmailBody.name}.*$`));
    });
  });

  test('Bulk edit and update some messaging configurations sender email address', async ({
    app,
    appAdminPage,
    editEmailBodyPage,
    emailMessageConfigReportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-362',
    });

    const emailBody = new EmailBody({
      name: FakeDataFactory.createFakeEmailBodyName(),
      appName: app.name,
      status: true,
      subject: 'Test C',
      body: 'Test',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
    });

    await test.step('Create an email body for the report', async () => {
      await createEmailBody(app, emailBody, appAdminPage, editEmailBodyPage);
    });

    await test.step('Navigate to the email messaging configurations report page', async () => {
      await emailMessageConfigReportPage.goto();
    });

    await test.step('Filter the report to just the test app', async () => {
      await emailMessageConfigReportPage.filterReport({
        appOrSurvey: app.name,
        type: 'Email Body',
        status: 'OK',
      });
    });

    const fakeEmail = FakeDataFactory.createFakeEmailFromAddress();
    const fakeEmailParts = fakeEmail.split('@');
    const newLocalText = fakeEmailParts[0];
    const newDomain = fakeEmailParts[1];

    await test.step('Bulk edit the email body', async () => {
      await emailMessageConfigReportPage.selectAllRecords();
      await emailMessageConfigReportPage.bulkEditSelectedRecords(newLocalText, newDomain);
    });

    await test.step('Verify the email body was updated', async () => {
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await emailMessageConfigReportPage.page.waitForTimeout(1000);
      await emailMessageConfigReportPage.filterReport({
        appOrSurvey: app.name,
        type: 'Email Body',
        status: 'OK',
      });

      const rows = await emailMessageConfigReportPage.getRows();

      for (const row of rows) {
        await expect(row).toHaveText(new RegExp(`^.*${newLocalText}.*$`));
      }
    });
  });
});

async function createEmailBody(
  app: App,
  emailBody: EmailBody,
  appAdminPage: AppAdminPage,
  editEmailBodyPage: EditEmailBodyPage
) {
  await appAdminPage.goto(app.id);
  await appAdminPage.messagingTabButton.click();
  await appAdminPage.messagingTab.createEmailBody(emailBody.name);
  await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
  await editEmailBodyPage.updateEmailBody(emailBody);
  await editEmailBodyPage.save();
}
