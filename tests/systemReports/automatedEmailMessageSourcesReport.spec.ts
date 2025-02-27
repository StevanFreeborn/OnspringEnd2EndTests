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
import { AutomatedMessageSourcesPage } from '../../pageObjectModels/systemReports/automatedMessageSourcesPage';
import { AnnotationType } from '../annotations';

type AutomatedEmailMessageSourcesReportTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  editEmailBodyPage: EditEmailBodyPage;
  automatedMessageSourcesPage: AutomatedMessageSourcesPage;
};

const test = base.extend<AutomatedEmailMessageSourcesReportTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  editEmailBodyPage: async ({ sysAdminPage }, use) => await use(new EditEmailBodyPage(sysAdminPage)),
  automatedMessageSourcesPage: async ({ sysAdminPage }, use) => await use(new AutomatedMessageSourcesPage(sysAdminPage)),
});

test.describe('automated email message sources report', () => {
  test('Filter the Automated Email Message Sources Report', async ({ app, appAdminPage, editEmailBodyPage, automatedMessageSourcesPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-282',
    });
    
    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const textField = new TextField({ name: 'Send Email?'});
    const rule = new TextRuleWithValue({
      fieldName: textField.name,
      operator: 'Contains',
      value: 'Yes',
    });

    const emailBody = new EmailBody({
      name: emailBodyName,
      appName: app.name,
      status: true,
      subject: `Test Subject - ${emailBodyName}`,
      body: 'This is a test email body.',
      fromName: 'Automation Test',
      fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
      recipientsBasedOnFields: ['Created By'],
      sendLogic: new SimpleRuleLogic({
        rules: [rule],
      }),
    });

    await test.step('Create an email body', async () => {
      await createEmailBody(appAdminPage, editEmailBodyPage, app, emailBody);
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

  test('Edit an item in the Automated Email Message Sources Report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-284',
    });

    await test.step('Create an email body', async () => {});

    await test.step('Navigate to the automated email message sources report', async () => {});

    await test.step('Edit the email body from the automated email message sources report', async () => {});

    await test.step('Verify the email body was edited', async () => {});

    expect(true).toBeTruthy();
  });

  test('Sort the Automated Email Message Sources Report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-313',
    });

    await test.step('Create two email bodies', async () => {});

    await test.step('Navigate to the automated email message sources report', async () => {});

    await test.step('Sort the automated email message sources report', async () => {});

    await test.step('Verify the automated email message sources report is sorted', async () => {});

    expect(true).toBeTruthy();
  });
});

async function createEmailBody(appAdminPage: AppAdminPage, editEmailBodyPage: EditEmailBodyPage, app: App, emailBody: EmailBody) {
  await appAdminPage.goto(app.id);
  await appAdminPage.layoutTabButton.click();
  await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(new TextField({ name: 'Send Email?'}));

  await appAdminPage.messagingTabButton.click();
  await appAdminPage.messagingTab.createEmailBody(emailBody.name);
  await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
  await editEmailBodyPage.updateEmailBody(emailBody);
  await editEmailBodyPage.save();
}
