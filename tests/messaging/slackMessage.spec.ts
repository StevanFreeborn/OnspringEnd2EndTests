import { App, FakeDataFactory, SlackMessage } from '@stevanfreeborn/onspring-models';
import {
  AppDetailTargets,
  AppMessagingTabTargets,
  AppTasks,
  EditSlackMessagePageTargets,
  SlackMessageAdminPageTargets,
  SlackMessageTasks,
} from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type SlackMessageTestFixtures = {
  targetApp: App;
};

const test = base.extend<SlackMessageTestFixtures>({
  targetApp: AppFixture.create().build(),
});

test.describe('slack message', () => {
  test("Add Slack Message to an app from an app's Messaging tab", async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-229',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();

    await test.step('Navigate to the app admin page', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
    });

    await test.step('Navigate to the messaging tab', async () => {
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create the slack message', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.createFromAppMessagingTab(slackMessageName));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Verify the slack message was created', async () => {
      await sysAdminActor.browse().check(EditSlackMessagePageTargets.generalTab.nameInput).hasValue(slackMessageName);
    });
  });

  test("Create a copy of a Slack Message on an app from an app's Messaging tab", async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-230',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();
    const slackMessageCopyName = FakeDataFactory.createFakeSlackMessageName();

    await test.step("Navigate to the app's admin page", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
    });

    await test.step("Navigate to the app's Messaging tab", async () => {
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create the slack message to be copied', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.createFromAppMessagingTab(slackMessageName));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step("Navigate back to the app's messaging tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create a copy of the slack message', async () => {
      await sysAdminActor.attemptsTo(
        SlackMessageTasks.createCopyFromAppMessagingTab(slackMessageName, slackMessageCopyName)
      );
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Verify the Slack Message was created', async () => {
      await sysAdminActor
        .browse()
        .check(EditSlackMessagePageTargets.generalTab.nameInput)
        .hasValue(slackMessageCopyName);
    });
  });

  test('Add Slack Message to an app from the Create button in the admin header', async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-231',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the slack message', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.createViaHeader(targetApp.name, slackMessageName));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Verify the slack message was created', async () => {
      await sysAdminActor.browse().check(EditSlackMessagePageTargets.generalTab.nameInput).hasValue(slackMessageName);
    });
  });

  test('Create a copy of a Slack Message on an app from the Create button in the admin header', async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-232',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();
    const slackMessageCopyName = FakeDataFactory.createFakeSlackMessageName();

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the slack message to be copied', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.createViaHeader(targetApp.name, slackMessageName));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Copy the slack message', async () => {
      await sysAdminActor.attemptsTo(
        SlackMessageTasks.createCopyViaHeader(targetApp.name, slackMessageName, slackMessageCopyName)
      );
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Verify the slack message was copied', async () => {
      await sysAdminActor
        .browse()
        .check(EditSlackMessagePageTargets.generalTab.nameInput)
        .hasValue(slackMessageCopyName);
    });
  });

  test('Add Slack Message to an app from the Create Slack Message button on the slack message page', async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-233',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();

    await test.step('Navigate to slack message admin page', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.goto());
    });

    await test.step('Create the slack message', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.createFromAdminPage(targetApp.name, slackMessageName));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Verify the slack message was created', async () => {
      await sysAdminActor.browse().check(EditSlackMessagePageTargets.generalTab.nameInput).hasValue(slackMessageName);
    });
  });

  test('Create a copy of a Slack Message on an app from the Create Slack Message button on the slack message page', async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-234',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();
    const slackMessageCopyName = FakeDataFactory.createFakeSlackMessageName();

    await test.step('Navigate to the slack message admin page', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.goto());
    });

    await test.step('Create the slack message to be copied', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.createFromAdminPage(targetApp.name, slackMessageName));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Navigate back to the slack message admin page', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.goto());
    });

    await test.step('Copy the slack message', async () => {
      await sysAdminActor.attemptsTo(
        SlackMessageTasks.createCopyFromAdminPage(targetApp.name, slackMessageName, slackMessageCopyName)
      );
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Verify the slack message was copied', async () => {
      await sysAdminActor
        .browse()
        .check(EditSlackMessagePageTargets.generalTab.nameInput)
        .hasValue(slackMessageCopyName);
    });
  });

  test("Update a Slack Message's configurations on an app from an app's Messaging tab", async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-235',
    });

    const slackMessage = new SlackMessage({
      appName: targetApp.name,
      name: FakeDataFactory.createFakeSlackMessageName(),
      messageTitle: 'Message Title',
      message: 'Hello, world!',
      channelName: 'general',
      status: false,
      description: 'This is a test slack message',
    });

    await test.step('Navigate to the app messaging tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create a new slack message', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.createFromAppMessagingTab(slackMessage.name));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Navigate back to the app messaging tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Open the slack message configurations', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.openForEditFromAppMessagingTab(slackMessage.name));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Update the slack message configurations', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.update(slackMessage), SlackMessageTasks.save());
    });

    await test.step('Verify the slack message configurations were updated', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);

      const row = AppMessagingTabTargets.slackMessageRowByName(slackMessage.name);
      await sysAdminActor.browse().check(row).isVisible();
      await sysAdminActor.browse().check(row).hasText(new RegExp(slackMessage.name, 'i'));
      await sysAdminActor
        .browse()
        .check(row)
        .hasText(/disabled/i);
    });
  });

  test("Update a Slack Message's configurations on an app from the Slack Message page", async ({
    targetApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-236',
    });

    const slackMessage = new SlackMessage({
      appName: targetApp.name,
      name: FakeDataFactory.createFakeSlackMessageName(),
      messageTitle: 'Message Title',
      message: 'Hello, world!',
      channelName: 'general',
      status: false,
      description: 'This is a test slack message',
    });

    await test.step('Navigate to the slack message admin page', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.goto());
    });

    await test.step('Create a new slack message', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.createFromAdminPage(slackMessage.appName, slackMessage.name));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Navigate back to the slack message admin page', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.goto());
    });

    await test.step('Open the slack message configurations', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.openForEditFromAdminPage(slackMessage.name));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Update the slack message configurations', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.update(slackMessage), SlackMessageTasks.save());
    });

    await test.step('Verify the slack message configurations were updated', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.goto());

      const row = SlackMessageAdminPageTargets.rowByName(slackMessage.name);
      await sysAdminActor.browse().check(row).isVisible();
      await sysAdminActor.browse().check(row).hasText(new RegExp(slackMessage.name, 'i'));
      await sysAdminActor
        .browse()
        .check(row)
        .hasText(/disabled/i);
    });
  });

  test("Delete a Slack Message from an app's Messaging tab", async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-237',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();

    await test.step('Navigate to the app messaging tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
    });

    await test.step('Create a new slack message', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.createFromAppMessagingTab(slackMessageName));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Delete the slack message', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id));
      await sysAdminActor.browse().click(AppDetailTargets.messagingTabButton);
      await sysAdminActor.attemptsTo(SlackMessageTasks.deleteFromAppMessagingTab(slackMessageName));
    });

    await test.step('Verify the slack message was deleted', async () => {
      await sysAdminActor
        .browse()
        .check(AppMessagingTabTargets.slackMessageRowByName(slackMessageName))
        .isNotAttached();
    });
  });

  test('Delete a Slack Message from the Slack Message page', async ({ targetApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-238',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();

    await test.step('Navigate to the slack message admin page', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.goto());
    });

    await test.step('Create a new slack message', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.createFromAdminPage(targetApp.name, slackMessageName));
      await sysAdminActor.browse().checkPage().hasUrl(EditSlackMessagePageTargets.pathRegex);
    });

    await test.step('Delete the slack message', async () => {
      await sysAdminActor.attemptsTo(SlackMessageTasks.goto());
      await sysAdminActor.attemptsTo(SlackMessageTasks.deleteFromAdminPage(slackMessageName));
    });

    await test.step('Verify the slack message was deleted', async () => {
      await sysAdminActor.browse().check(SlackMessageAdminPageTargets.rowByName(slackMessageName)).isNotAttached();
    });
  });
});
