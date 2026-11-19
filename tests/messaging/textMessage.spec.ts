import { App, FakeDataFactory, SendingNumber, TextMessage } from '@stevanfreeborn/onspring-models';
import {
  AppDetailTargets,
  AppMessagingTabTargets,
  AppTasks,
  EditTextMessagePageTargets,
  TextMessageAdminPageTargets,
  TextMessageTasks,
} from '@stevanfreeborn/onspring-ui';
import { AppFixture, SendingNumberFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';
import { Tags } from '../tags';

type TextMessageTestFixtures = {
  app: App;
  sendingNumber: SendingNumber;
};

const test = base.extend<TextMessageTestFixtures>({
  app: AppFixture.create().build(),
  sendingNumber: SendingNumberFixture.create().build(),
});

test.describe(
  'text message',
  {
    tag: [Tags.NotFedRAMP],
  },
  () => {
    test.beforeEach(({ environment }) => {
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(environment.isFedspring(), 'This feature is not applicable to the FEDSPRING environment');
    });

    test("Add Text Message to an app from an app's Messaging tab", async ({ app, sysAdminActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-219',
      });

      const textMessageName = FakeDataFactory.createFakeTextMessageName();

      await test.step("Navigate to the app's messaging tab", async () => {
        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
      });

      await test.step('Add a new text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createFromAppMessagingTab(textMessageName));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Verify the text message was added', async () => {
        await sysAdminActor.browse().check(EditTextMessagePageTargets.generalTab.nameInput).hasValue(textMessageName);
      });
    });

    test("Create a copy of a Text Message on an app from an app's Messaging tab", async ({ app, sysAdminActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-220',
      });

      const textToCopyName = FakeDataFactory.createFakeTextMessageName();
      const textCopyName = FakeDataFactory.createFakeTextMessageName();

      await test.step('Navigate to the app messaging tab', async () => {
        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
      });

      await test.step('Create a new text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createFromAppMessagingTab(textToCopyName));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Navigate back to the app messaging tab', async () => {
        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
      });

      await test.step('Create a copy of the text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createCopyFromAppMessagingTab(textToCopyName, textCopyName));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Verify the text message copy was added', async () => {
        await sysAdminActor.browse().check(EditTextMessagePageTargets.generalTab.nameInput).hasValue(textCopyName);
      });
    });

    test('Add Text Message to an app from the Create button in the admin header', async ({ app, sysAdminActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-221',
      });

      const textMessageName = FakeDataFactory.createFakeTextMessageName();

      await test.step('Navigate to the admin home page', async () => {
        await sysAdminActor.browse().goto('/Admin/Home');
      });

      await test.step('Create a new text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createViaHeader(app.name, textMessageName));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Verify the text message was added', async () => {
        await sysAdminActor.browse().check(EditTextMessagePageTargets.generalTab.nameInput).hasValue(textMessageName);

        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
        await sysAdminActor.browse().check(AppMessagingTabTargets.textMessageRowByName(textMessageName)).isVisible();
      });
    });

    test('Create a copy of a Text Message on an app from the Create button in the admin header', async ({
      app,
      sysAdminActor,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-222',
      });

      const textToCopyName = FakeDataFactory.createFakeTextMessageName();
      const textCopyName = FakeDataFactory.createFakeTextMessageName();

      await test.step('Navigate to the admin home page', async () => {
        await sysAdminActor.browse().goto('/Admin/Home');
      });

      await test.step('Create a new text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createViaHeader(app.name, textToCopyName));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Navigate back to the admin home page', async () => {
        await sysAdminActor.browse().goto('/Admin/Home');
      });

      await test.step('Create a copy of the text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createCopyViaHeader(app.name, textToCopyName, textCopyName));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Verify the text message copy was added', async () => {
        await sysAdminActor.browse().check(EditTextMessagePageTargets.generalTab.nameInput).hasValue(textCopyName);

        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
        await sysAdminActor.browse().check(AppMessagingTabTargets.textMessageRowByName(textCopyName)).isVisible();
      });
    });

    test('Add Text Message to an app from the Create Text Message button on the text message page', async ({
      app,
      sysAdminActor,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-223',
      });

      const textMessageName = FakeDataFactory.createFakeTextMessageName();

      await test.step('Navigate to the text message admin page', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.goto());
      });

      await test.step('Create a new text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createFromAdminPage(app.name, textMessageName));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Verify the text message was added', async () => {
        await sysAdminActor.browse().check(EditTextMessagePageTargets.generalTab.nameInput).hasValue(textMessageName);

        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
        await sysAdminActor.browse().check(AppMessagingTabTargets.textMessageRowByName(textMessageName)).isVisible();
      });
    });

    test('Create a copy of a Text Message on an app from the Create Text Message button on the text message page', async ({
      app,
      sysAdminActor,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-224',
      });

      const textToCopyName = FakeDataFactory.createFakeTextMessageName();
      const textCopyName = FakeDataFactory.createFakeTextMessageName();

      await test.step('Navigate to the text message admin page', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.goto());
      });

      await test.step('Create the text message to copy', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createFromAdminPage(app.name, textToCopyName));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Navigate back to the text message admin page', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.goto());
      });

      await test.step('Create a copy of the text message', async () => {
        await sysAdminActor.attemptsTo(
          TextMessageTasks.createCopyFromAdminPage(app.name, textToCopyName, textCopyName)
        );
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Verify the text message copy was added', async () => {
        await sysAdminActor.browse().check(EditTextMessagePageTargets.generalTab.nameInput).hasValue(textCopyName);

        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
        await sysAdminActor.browse().check(AppMessagingTabTargets.textMessageRowByName(textCopyName)).isVisible();
      });
    });

    test("Update a Text Message's configurations on an app from an app's Messaging tab", async ({
      app,
      sendingNumber,
      sysAdminActor,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-225',
      });

      const textMessage = new TextMessage({
        appName: app.name,
        name: FakeDataFactory.createFakeTextMessageName(),
        message: 'Hello, world!',
        status: false,
        description: 'This is a test text message',
        fromNumber: sendingNumber.smsSendingNumber,
        recipientsBasedOnFields: ['Created By'],
      });

      await test.step('Navigate to the app messaging tab', async () => {
        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
      });

      await test.step('Create a new text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createFromAppMessagingTab(textMessage.name));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Navigate back to the app messaging tab', async () => {
        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
      });

      await test.step('Open the text message configurations', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.openForEditFromAppMessagingTab(textMessage.name));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Update the text message configurations', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.update(textMessage), TextMessageTasks.save());
      });

      await test.step('Verify the text message configurations were updated', async () => {
        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);

        const row = AppMessagingTabTargets.textMessageRowByName(textMessage.name);
        await sysAdminActor.browse().check(row).isVisible();
        await sysAdminActor.browse().check(row).hasText(new RegExp(textMessage.name, 'i'));
        await sysAdminActor
          .browse()
          .check(row)
          .hasText(/disabled/i);
      });
    });

    test("Update a Text Message's configurations on an app from the Text Message page", async ({
      app,
      sendingNumber,
      sysAdminActor,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-226',
      });

      const textMessage = new TextMessage({
        appName: app.name,
        name: FakeDataFactory.createFakeTextMessageName(),
        message: 'Hello, world!',
        status: false,
        description: 'This is a test text message',
        fromNumber: sendingNumber.smsSendingNumber,
        recipientsBasedOnFields: ['Created By'],
      });

      await test.step('Navigate to the text message admin page', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.goto());
      });

      await test.step('Create a new text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createFromAdminPage(textMessage.appName, textMessage.name));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Navigate back to the text message admin page', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.goto());
      });

      await test.step('Open the text message configurations', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.openForEditFromAdminPage(textMessage.name));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Update the text message configurations', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.update(textMessage), TextMessageTasks.save());
      });

      await test.step('Verify the text message configurations were updated', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.goto());

        const row = TextMessageAdminPageTargets.rowByName(textMessage.name);
        await sysAdminActor.browse().check(row).isVisible();
        await sysAdminActor.browse().check(row).hasText(new RegExp(textMessage.name, 'i'));
        await sysAdminActor
          .browse()
          .check(row)
          .hasText(/disabled/i);
      });
    });

    test("Delete a Text Message from an app's Messaging tab", async ({ app, sysAdminActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-227',
      });

      const textMessageName = FakeDataFactory.createFakeTextMessageName();

      await test.step('Navigate to the app messaging tab', async () => {
        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
      });

      await test.step('Create a new text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createFromAppMessagingTab(textMessageName));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Delete the text message', async () => {
        await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
        await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
        await sysAdminActor.attemptsTo(TextMessageTasks.deleteFromAppMessagingTab(textMessageName));
      });

      await test.step('Verify the text message was deleted', async () => {
        await sysAdminActor
          .browse()
          .check(AppMessagingTabTargets.textMessageRowByName(textMessageName))
          .isNotAttached();
      });
    });

    test('Delete a Text Message from the Text Message page', async ({ app, sysAdminActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-228',
      });

      const textMessageName = FakeDataFactory.createFakeTextMessageName();

      await test.step('Navigate to the text message admin page', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.goto());
      });

      await test.step('Create a new text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.createFromAdminPage(app.name, textMessageName));
        await sysAdminActor.browse().checkPage().hasUrl(EditTextMessagePageTargets.pathRegex);
      });

      await test.step('Delete the text message', async () => {
        await sysAdminActor.attemptsTo(TextMessageTasks.goto());
        await sysAdminActor.attemptsTo(TextMessageTasks.deleteFromAdminPage(textMessageName));
      });

      await test.step('Verify the text message was deleted', async () => {
        await sysAdminActor.browse().check(TextMessageAdminPageTargets.rowByName(textMessageName)).isNotAttached();
      });
    });
  }
);
