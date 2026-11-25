import {
  App,
  EmailBody,
  FakeDataFactory,
  SimpleRuleLogic,
  TextField,
  TextRuleWithValue,
} from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  AutomatedEmailMessageSourcesReportTargets,
  AutomatedEmailMessageSourcesReportTasks,
  EmailBodyTasks,
  FieldTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type AutomatedEmailMessageSourcesReportTestFixtures = {
  app: App;
};

const test = base.extend<AutomatedEmailMessageSourcesReportTestFixtures>({
  app: AppFixture.create().build(),
});

test.describe('automated email message sources report', () => {
  test('Filter the Automated Email Message Sources Report', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-282',
    });

    const textField = new TextField({ name: 'Send Email?' });
    const emailBody = buildEmailBody(app, textField);

    await test.step('Create an email body', async () => {
      await createTextField(sysAdminActor, app, textField);
      await createEmailBody(sysAdminActor, app, emailBody);
    });

    await test.step('Navigate to the automated email message sources report', async () => {
      await sysAdminActor.attemptsTo(AutomatedEmailMessageSourcesReportTasks.goto());
    });

    await test.step('Filter the automated email message sources report', async () => {
      await sysAdminActor.attemptsTo(
        AutomatedEmailMessageSourcesReportTasks.applyFilter({ emailType: 'Email Body', appOrSurvey: app.name })
      );
    });

    await test.step('Verify the automated email message sources report is filtered', async () => {
      await sysAdminActor.browse().check(AutomatedEmailMessageSourcesReportTargets.rows).hasCount(1);
    });
  });

  test('Edit an item in the Automated Email Message Sources Report', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-284',
    });

    const updatedEmailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const textField = new TextField({ name: 'Send Email?' });
    const emailBody = buildEmailBody(app, textField);

    await test.step('Create an email body', async () => {
      await createTextField(sysAdminActor, app, textField);
      await createEmailBody(sysAdminActor, app, emailBody);
    });

    await test.step('Navigate to the automated email message sources report', async () => {
      await sysAdminActor.attemptsTo(AutomatedEmailMessageSourcesReportTasks.goto());
    });

    await test.step('Edit the email body from the automated email message sources report', async () => {
      await sysAdminActor.attemptsTo(
        AutomatedEmailMessageSourcesReportTasks.applyFilter({ emailType: 'Email Body', appOrSurvey: app.name }),
        AutomatedEmailMessageSourcesReportTasks.openItemAt(0)
      );

      emailBody.name = updatedEmailBodyName;
      await sysAdminActor.attemptsTo(EmailBodyTasks.update(emailBody), EmailBodyTasks.save());
    });

    await test.step('Verify the email body was edited', async () => {
      await sysAdminActor.attemptsTo(
        AutomatedEmailMessageSourcesReportTasks.goto(),
        AutomatedEmailMessageSourcesReportTasks.applyFilter({ emailType: 'Email Body', appOrSurvey: app.name })
      );

      await sysAdminActor
        .browse()
        .check(AutomatedEmailMessageSourcesReportTargets.rowAt(0))
        .hasText(new RegExp(updatedEmailBodyName));
    });
  });

  test('Sort the Automated Email Message Sources Report', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-313',
    });

    const textField = new TextField({ name: 'Send Email?' });
    const firstEmailBody = buildEmailBody(app, textField, `1-${FakeDataFactory.createFakeEmailBodyName()}`);
    const secondEmailBody = buildEmailBody(app, textField, `2-${FakeDataFactory.createFakeEmailBodyName()}`);

    await test.step('Create two email bodies', async () => {
      await createTextField(sysAdminActor, app, textField);
      await createEmailBody(sysAdminActor, app, firstEmailBody);
      await createEmailBody(sysAdminActor, app, secondEmailBody);
    });

    await test.step('Navigate to the automated email message sources report', async () => {
      await sysAdminActor.attemptsTo(AutomatedEmailMessageSourcesReportTasks.goto());
    });

    await test.step('Sort the automated email message sources report', async () => {
      await sysAdminActor.attemptsTo(
        AutomatedEmailMessageSourcesReportTasks.applyFilter({ emailType: 'Email Body', appOrSurvey: app.name }),
        AutomatedEmailMessageSourcesReportTasks.sortGridBy('Item Name', 'ascending')
      );
    });

    await test.step('Verify the automated email message sources report is sorted', async () => {
      await sysAdminActor
        .browse()
        .check(AutomatedEmailMessageSourcesReportTargets.rowAt(0))
        .hasText(new RegExp(firstEmailBody.name));
      await sysAdminActor
        .browse()
        .check(AutomatedEmailMessageSourcesReportTargets.rowAt(1))
        .hasText(new RegExp(secondEmailBody.name));
    });
  });
});

function buildEmailBody(app: App, textField: TextField, emailBodyName?: string) {
  const name = emailBodyName || FakeDataFactory.createFakeEmailBodyName();
  const rule = new TextRuleWithValue({
    fieldName: textField.name,
    operator: 'Contains',
    value: 'Yes',
  });

  return new EmailBody({
    name: name,
    appName: app.name,
    status: true,
    subject: `Test Subject - ${name}`,
    body: 'This is a test email body.',
    fromName: 'Automation Test',
    fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
    recipientsBasedOnFields: ['Created By'],
    sendLogic: new SimpleRuleLogic({
      rules: [rule],
    }),
  });
}

async function createTextField(actor: WebActor, app: App, textField: TextField) {
  await actor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id), FieldTasks.addFromGrid(textField));
}

async function createEmailBody(actor: WebActor, app: App, emailBody: EmailBody) {
  await actor.attemptsTo(
    AppTasks.gotoAppMessagingTab(app.id),
    EmailBodyTasks.createFromAppMessagingTab(emailBody.name),
    EmailBodyTasks.update(emailBody),
    EmailBodyTasks.save()
  );
}
