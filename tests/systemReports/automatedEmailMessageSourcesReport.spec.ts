import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, test as base } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { EmailBody } from '../../models/emailBody';
import { TextRuleWithValue } from '../../models/rule';
import { SimpleRuleLogic } from '../../models/ruleLogic';
import { TextField } from '../../models/textField';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { EditEmailBodyPage } from '../../pageObjectModels/messaging/editEmailBodyPage';
import { AutomatedEmailMessageSourcesPage } from '../../pageObjectModels/systemReports/automatedEmailMessageSourcesPage';
import { AnnotationType } from '../annotations';

type AutomatedEmailMessageSourcesReportTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  editEmailBodyPage: EditEmailBodyPage;
  automatedMessageSourcesPage: AutomatedEmailMessageSourcesPage;
};

const test = base.extend<AutomatedEmailMessageSourcesReportTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  editEmailBodyPage: async ({ sysAdminPage }, use) => await use(new EditEmailBodyPage(sysAdminPage)),
  automatedMessageSourcesPage: async ({ sysAdminPage }, use) => await use(new AutomatedEmailMessageSourcesPage(sysAdminPage)),
});

test.describe('automated email message sources report', () => {
  test('Filter the Automated Email Message Sources Report', async ({ app, appAdminPage, editEmailBodyPage, automatedMessageSourcesPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-282',
    });
    
    const textField = new TextField({ name: 'Send Email?' });
    const emailBody = buildEmailBody(app, textField);

    await test.step('Create an email body', async () => {
      await createTextField(appAdminPage, app, textField);
      await createEmailBody(appAdminPage, app, editEmailBodyPage, emailBody);
    });

    await test.step('Navigate to the automated email message sources report', async () => {
      await automatedMessageSourcesPage.goto();
    });

    await test.step('Filter the automated email message sources report', async () => {
      await automatedMessageSourcesPage.applyFilter({ emailType: 'Email Body', appOrSurvey: app.name });
    });

    await test.step('Verify the automated email message sources report is filtered', async () => {
      const rows = await automatedMessageSourcesPage.getRows();
      expect(rows.length).toBe(1);
    });
  });

  test('Edit an item in the Automated Email Message Sources Report', async ({
    app,
    appAdminPage,
    editEmailBodyPage,
    automatedMessageSourcesPage
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-284',
    });
    
    const updatedEmailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const textField = new TextField({ name: 'Send Email?' });
    const emailBody = buildEmailBody(app, textField);

    await test.step('Create an email body', async () => {
      await createTextField(appAdminPage, app, textField);
      await createEmailBody(appAdminPage, app, editEmailBodyPage, emailBody);
    });

    await test.step('Navigate to the automated email message sources report', async () => {
      await automatedMessageSourcesPage.goto();
    });

    await test.step('Edit the email body from the automated email message sources report', async () => {
      await automatedMessageSourcesPage.applyFilter({ emailType: 'Email Body', appOrSurvey: app.name });

      const rows = await automatedMessageSourcesPage.getRows();
      await rows[0].click();
      await automatedMessageSourcesPage.page.waitForURL(editEmailBodyPage.pathRegex);

      emailBody.name = updatedEmailBodyName;
      await editEmailBodyPage.updateEmailBody(emailBody);
      await editEmailBodyPage.save();
    });

    await test.step('Verify the email body was edited', async () => {
      await automatedMessageSourcesPage.goto();
      await automatedMessageSourcesPage.applyFilter({ emailType: 'Email Body', appOrSurvey: app.name });

      const rows = await automatedMessageSourcesPage.getRows();
      await expect(rows[0]).toHaveText(new RegExp(updatedEmailBodyName));
    });
  });

  test('Sort the Automated Email Message Sources Report', async ({
    app,
    appAdminPage,
    editEmailBodyPage,
    automatedMessageSourcesPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-313',
    });

    const textField = new TextField({ name: 'Send Email?' });
    const firstEmailBody = buildEmailBody(app, textField, `1-${FakeDataFactory.createFakeEmailBodyName()}`);
    const secondEmailBody = buildEmailBody(app, textField, `2-${FakeDataFactory.createFakeEmailBodyName()}`);
    
    await test.step('Create two email bodies', async () => {
      await createTextField(appAdminPage, app, textField);
      await createEmailBody(appAdminPage, app, editEmailBodyPage, firstEmailBody);
      await createEmailBody(appAdminPage, app, editEmailBodyPage, secondEmailBody);
    });

    await test.step('Navigate to the automated email message sources report', async () => {
      await automatedMessageSourcesPage.goto();
    });

    await test.step('Sort the automated email message sources report', async () => {
      await automatedMessageSourcesPage.applyFilter({ emailType: 'Email Body', appOrSurvey: app.name });
      await automatedMessageSourcesPage.sortGridBy('Item Name', 'ascending');
    });

    await test.step('Verify the automated email message sources report is sorted', async () => {
      const rows = await automatedMessageSourcesPage.getRows();
      await expect(rows[0]).toHaveText(new RegExp(firstEmailBody.name));
      await expect(rows[1]).toHaveText(new RegExp(secondEmailBody.name));
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

async function createTextField(appAdminPage: AppAdminPage, app: App, textField: TextField) {
  await appAdminPage.goto(app.id);
  await appAdminPage.layoutTabButton.click();
  await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
}

async function createEmailBody(appAdminPage: AppAdminPage, app: App, editEmailBodyPage: EditEmailBodyPage, emailBody: EmailBody) {
  await appAdminPage.goto(app.id);
  await appAdminPage.messagingTabButton.click();
  await appAdminPage.messagingTab.createEmailBody(emailBody.name);
  await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
  await editEmailBodyPage.updateEmailBody(emailBody);
  await editEmailBodyPage.save();
}
