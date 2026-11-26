import {
  App,
  EmailBody,
  FakeDataFactory,
  SimpleRuleLogic,
  TextField,
  TextRuleWithValue,
} from '@stevanfreeborn/onspring-models';
import {
  AppDetailTargets,
  AppMessagingTabTargets,
  AppTasks,
  ContentTasks,
  EditEmailBodyPageTargets,
  EmailBodyAdminPageTargets,
  EmailBodyTasks,
} from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type EmailBodyTestFixtures = {
  targetApp: App;
};

const test = base.extend<EmailBodyTestFixtures>({
  targetApp: AppFixture.create().build(),
});

test.describe('email body', () => {
  test("Add Email Body to an app from an app's Messaging tab", async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-209',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Navigate to the app admin page', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
    });

    await test.step('Navigate to the messaging tab', async () => {
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create the email body', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.createFromAppMessagingTab(emailBodyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step('Verify the email body was created', async () => {
      await sysAdminActor.browse().check(EditEmailBodyPageTargets.generalTab.nameInput).hasValue(emailBodyName);
    });
  });

  test("Create a copy of an Email Body on an app from an app's Messaging tab", async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-210',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const emailBodyCopyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step("Navigate to the app's admin page", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
    });

    await test.step("Navigate to the app's Messaging tab", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create the email body to be copied', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.createFromAppMessagingTab(emailBodyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step("Navigate back to the app's messaging tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create a copy of the email body', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.createCopyFromAppMessagingTab(emailBodyName, emailBodyCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step('Verify the Email Body was created', async () => {
      await sysAdminActor.browse().check(EditEmailBodyPageTargets.generalTab.nameInput).hasValue(emailBodyCopyName);
    });
  });

  test('Add Email Body to an app from the Create button in the admin header', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-211',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email body', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.createViaHeader(targetApp.name, emailBodyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step('Verify the email body was created', async () => {
      await sysAdminActor.browse().check(EditEmailBodyPageTargets.generalTab.nameInput).hasValue(emailBodyName);
    });
  });

  test('Create a copy of an Email Body on an app from the Create button in the admin header', async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-212',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const emailBodyCopyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email body to be copied', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.createViaHeader(targetApp.name, emailBodyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Copy the email body', async () => {
      await sysAdminActor.attemptsTo(
        EmailBodyTasks.createCopyViaHeader(targetApp.name, emailBodyName, emailBodyCopyName)
      );
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step('Verify the email body was copied', async () => {
      await sysAdminActor.browse().check(EditEmailBodyPageTargets.generalTab.nameInput).hasValue(emailBodyCopyName);
    });
  });

  test('Add Email Body to an app from the Create Email Body button on the email body page', async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-213',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Navigate to email body admin page', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.goto());
    });

    await test.step('Create the email body', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.createFromAdminPage(targetApp.name, emailBodyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step('Verify the email body was created', async () => {
      await sysAdminActor.browse().check(EditEmailBodyPageTargets.generalTab.nameInput).hasValue(emailBodyName);
    });
  });

  test('Create a copy of an Email Body on an app from the Create Email Body button on the email body page', async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-214',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const emailBodyCopyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Navigate to the email body admin page', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.goto());
    });

    await test.step('Create the email body to be copied', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.createFromAdminPage(targetApp.name, emailBodyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step('Navigate back to the email body admin page', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.goto());
    });

    await test.step('Copy the email body', async () => {
      await sysAdminActor.attemptsTo(
        EmailBodyTasks.createCopyFromAdminPage(targetApp.name, emailBodyName, emailBodyCopyName)
      );
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step('Verify the email body was copied', async () => {
      await sysAdminActor.browse().check(EditEmailBodyPageTargets.generalTab.nameInput).hasValue(emailBodyCopyName);
    });
  });

  test("Update an Email Body's configurations on an app from an app's Messaging tab", async ({
    targetApp,
    sysAdminEmail,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-215',
    });

    test.slow();

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textField = new TextField({ name: 'Send Email?' });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });

    const bodyTemplate = 'This email is from record id';

    const emailBody = new EmailBody({
      name: emailBodyName,
      appName: targetApp.name,
      status: true,
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
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
    });

    await test.step("Navigate to the app's layout tab", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.layoutTabButton);
    });

    await test.step('Create a field and add to app layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.addLayoutItemInLayoutDesigner(textField),
        AppTasks.dragFieldOntoLayout({
          fieldName: textField.name,
          tabName: tabName,
          sectionName: sectionName,
          row: 0,
          column: 0,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step("Navigate to the app's messaging tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create the email body to update', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.createFromAppMessagingTab(emailBody.name));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step("Navigate back to the app's messaging tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Open email body to update', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.openForEditFromAppMessagingTab(emailBody.name));
    });

    await test.step('Update the email body', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.update(emailBody), EmailBodyTasks.save());
    });

    await test.step('Add a content record that satisfies send logic', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.gotoAdd(targetApp.id),
        ContentTasks.fillTextField({
          tabName: tabName,
          sectionName: sectionName,
          fieldName: textField.name,
          value: rule.value,
        }),
        ContentTasks.saveRecord()
      );
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
        intervals: [30_000],
        timeout: 300_000,
      });
    });
  });

  test("Update an Email Body's configurations on an app from the Email Body page", async ({
    targetApp,
    sysAdminEmail,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-216',
    });

    test.slow();

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textField = new TextField({ name: 'Send Email?' });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    const rule = new TextRuleWithValue({ fieldName: textField.name, operator: 'Contains', value: 'Yes' });

    const bodyTemplate = 'This email is from record id';

    const emailBody = new EmailBody({
      name: emailBodyName,
      appName: targetApp.name,
      status: true,
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
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
    });

    await test.step("Navigate to the app's layout tab", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.layoutTabButton);
    });

    await test.step('Create a field and add to the app layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.addLayoutItemInLayoutDesigner(textField),
        AppTasks.dragFieldOntoLayout({
          fieldName: textField.name,
          tabName: tabName,
          sectionName: sectionName,
          row: 0,
          column: 0,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step("Navigate to the app's messaging tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create the email body to update', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.createFromAppMessagingTab(emailBody.name));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step('Navigate to the email bodies admin page', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.goto());
    });

    await test.step('Open email body to update', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.openForEditFromAdminPage(emailBody.name));
    });

    await test.step('Update the email body', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.update(emailBody), EmailBodyTasks.save());
    });

    await test.step('Add a content record that satisfies send logic', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.gotoAdd(targetApp.id),
        ContentTasks.fillTextField({
          tabName: tabName,
          sectionName: sectionName,
          fieldName: textField.name,
          value: rule.value,
        }),
        ContentTasks.saveRecord()
      );
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
        intervals: [30_000],
        timeout: 300_000,
      });
    });
  });

  test("Delete an Email Body from an app's Messaging tab", async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-217',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step("Navigate to the app's admin page", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
    });

    await test.step("Navigate to the app's messaging tab", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create the email body to delete', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.createFromAppMessagingTab(emailBodyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step('Navigate back to the app messaging tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Delete the email body', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.deleteFromAppMessagingTab(emailBodyName));
    });

    await test.step('Verify the email body was deleted', async () => {
      await sysAdminActor.browse().check(AppMessagingTabTargets.rowByName(emailBodyName)).isNotAttached();
    });
  });

  test('Delete an Email Body from the Email Body page', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-218',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step("Navigate to the app's admin page", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
    });

    await test.step("Navigate to the app's messaging tab", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create the email body to delete', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.createFromAppMessagingTab(emailBodyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailBodyPageTargets.pathRegex);
    });

    await test.step('Navigate to the email bodies admin page', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.goto());
    });

    await test.step('Delete the email body', async () => {
      await sysAdminActor.attemptsTo(EmailBodyTasks.deleteFromAdminPage(emailBodyName));
    });

    await test.step('Verify the email body was deleted', async () => {
      await sysAdminActor.browse().check(EmailBodyAdminPageTargets.rowByName(emailBodyName)).isNotAttached();
    });
  });
});
