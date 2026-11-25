import { App, EmailBody, FakeDataFactory } from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  EmailBodyTasks,
  EmailMessageConfigReportTargets,
  EmailMessageConfigReportTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppFixture, expect, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type EmailMessageConfigReportTestFixtures = {
  app: App;
};

const test = base.extend<EmailMessageConfigReportTestFixtures>({
  app: AppFixture.create().build(),
});

test.describe('email message configurations report', () => {
  test('Filter the email messaging configurations report', async ({ app, sysAdminActor }) => {
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
      await createEmailBody(sysAdminActor, app, emailBody);
    });

    await test.step('Navigate to the email messaging configurations report page', async () => {
      await sysAdminActor.attemptsTo(EmailMessageConfigReportTasks.goto());
    });

    await test.step('Filter the email messaging configurations report', async () => {
      await sysAdminActor.attemptsTo(
        EmailMessageConfigReportTasks.filterReport({
          appOrSurvey: app.name,
          type: 'Email Body',
          status: 'OK',
        })
      );
    });

    await test.step('Verify the email messaging configurations report is filtered', async () => {
      await sysAdminActor.browse().check(EmailMessageConfigReportTargets.rows).hasCount(1);
      await sysAdminActor.browse().check(EmailMessageConfigReportTargets.rowByName(emailBody.name)).isVisible();
    });
  });

  test('Sort the email messaging configurations report', async ({ app, sysAdminActor }) => {
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
      await createEmailBody(sysAdminActor, app, firstEmailBody);
      await createEmailBody(sysAdminActor, app, secondEmailBody);
    });

    await test.step('Navigate to the email messaging configurations report page', async () => {
      await sysAdminActor.attemptsTo(EmailMessageConfigReportTasks.goto());
    });

    await test.step('Filter the report to just the test app', async () => {
      await sysAdminActor.attemptsTo(
        EmailMessageConfigReportTasks.filterReport({
          appOrSurvey: app.name,
          type: 'Email Body',
          status: 'OK',
        })
      );
    });

    await test.step('Sort the email messaging configurations report', async () => {
      await sysAdminActor.attemptsTo(EmailMessageConfigReportTasks.sortGridBy('App/Survey Name', 'ascending'));
    });

    await test.step('Verify the email messaging configurations report is sorted', async () => {
      await sysAdminActor
        .browse()
        .check(EmailMessageConfigReportTargets.rowAt(0))
        .hasText(new RegExp(`^${app.name}.*${firstEmailBody.name}.*$`));
      await sysAdminActor
        .browse()
        .check(EmailMessageConfigReportTargets.rowAt(1))
        .hasText(new RegExp(`^${app.name}.*${secondEmailBody.name}.*$`));
    });
  });

  test('Bulk edit and update some messaging configurations sender email address', async ({ app, sysAdminActor }) => {
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
      await createEmailBody(sysAdminActor, app, emailBody);
    });

    await test.step('Navigate to the email messaging configurations report page', async () => {
      await sysAdminActor.attemptsTo(EmailMessageConfigReportTasks.goto());
    });

    await test.step('Filter the report to just the test app', async () => {
      await sysAdminActor.attemptsTo(
        EmailMessageConfigReportTasks.filterReport({
          appOrSurvey: app.name,
          type: 'Email Body',
          status: 'OK',
        })
      );
    });

    const fakeEmail = FakeDataFactory.createFakeEmailFromAddress();
    const fakeEmailParts = fakeEmail.split('@');
    const newLocalText = fakeEmailParts[0];
    const newDomain = fakeEmailParts[1];

    await test.step('Bulk edit the email body', async () => {
      await sysAdminActor.attemptsTo(
        EmailMessageConfigReportTasks.selectAllRecords(),
        EmailMessageConfigReportTasks.bulkEditSelectedRecords(newLocalText, newDomain)
      );
    });

    await test.step('Verify the email body was updated', async () => {
      await sysAdminActor.browse().waitForTimeout(1000);
      await sysAdminActor.attemptsTo(
        EmailMessageConfigReportTasks.filterReport({
          appOrSurvey: app.name,
          type: 'Email Body',
          status: 'OK',
        })
      );

      const rowTexts = await sysAdminActor.browse().getAllTexts(EmailMessageConfigReportTargets.rows);
      expect(rowTexts.length).toBeGreaterThanOrEqual(1);

      for (const rowText of rowTexts) {
        expect(rowText).toMatch(new RegExp(`^.*${newLocalText}.*$`));
      }
    });
  });
});

async function createEmailBody(actor: WebActor, app: App, emailBody: EmailBody) {
  await actor.attemptsTo(
    AppTasks.gotoAppMessagingTab(app.id),
    EmailBodyTasks.createFromAppMessagingTab(emailBody.name),
    EmailBodyTasks.update(emailBody),
    EmailBodyTasks.save()
  );
}
