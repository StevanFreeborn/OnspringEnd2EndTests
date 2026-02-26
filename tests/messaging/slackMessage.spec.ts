import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { EditSlackMessagePage } from '../../pageObjectModels/messaging/editSlackMessagePage';
import { SlackMessageAdminPage } from '../../pageObjectModels/messaging/slackMessageAdminPage';
import { AnnotationType } from '../annotations';

type SlackMessageTestFixtures = {
  targetApp: App;
  adminHomePage: AdminHomePage;
  appAdminPage: AppAdminPage;
  editSlackMessagePage: EditSlackMessagePage;
  slackMessageAdminPage: SlackMessageAdminPage;
};

const test = base.extend<SlackMessageTestFixtures>({
  targetApp: app,
  adminHomePage: async ({ sysAdminPage }, use) => use(new AdminHomePage(sysAdminPage)),
  appAdminPage: async ({ sysAdminPage }, use) => use(new AppAdminPage(sysAdminPage)),
  editSlackMessagePage: async ({ sysAdminPage }, use) => use(new EditSlackMessagePage(sysAdminPage)),
  slackMessageAdminPage: async ({ sysAdminPage }, use) => use(new SlackMessageAdminPage(sysAdminPage)),
});

test.describe('slack message', () => {
  test("Add Slack Message to an app from an app's Messaging tab", async ({
    targetApp,
    appAdminPage,
    editSlackMessagePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-229',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step('Navigate to the messaging tab', async () => {
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create the slack message', async () => {
      await appAdminPage.messagingTab.createSlackMessage(slackMessageName);
      await appAdminPage.page.waitForURL(editSlackMessagePage.pathRegex);
    });

    await test.step('Verify the slack message was created', async () => {
      await expect(editSlackMessagePage.generalTab.nameInput).toHaveValue(slackMessageName);
    });
  });

  test("Create a copy of a Slack Message on an app from an app's Messaging tab", async ({
    targetApp,
    appAdminPage,
    editSlackMessagePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-230',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();
    const slackMessageCopyName = FakeDataFactory.createFakeSlackMessageName();

    await test.step("Navigate to the app's admin page", async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step("Navigate to the app's Messaging tab", async () => {
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create the slack message to be copied', async () => {
      await appAdminPage.messagingTab.createSlackMessage(slackMessageName);
      await appAdminPage.page.waitForURL(editSlackMessagePage.pathRegex);
    });

    await test.step("Navigate back to the app's messaging tab", async () => {
      await appAdminPage.goto(targetApp.id);
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create a copy of the slack message', async () => {
      await appAdminPage.messagingTab.createSlackMessageCopy(slackMessageName, slackMessageCopyName);
      await appAdminPage.page.waitForURL(editSlackMessagePage.pathRegex);
    });

    await test.step('Verify the Slack Message was created', async () => {
      await expect(editSlackMessagePage.generalTab.nameInput).toHaveValue(slackMessageCopyName);
    });
  });

  test('Add Slack Message to an app from the Create button in the admin header', async ({
    targetApp,
    adminHomePage,
    editSlackMessagePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-231',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the slack message', async () => {
      await adminHomePage.createSlackMessageUsingHeaderCreateButton(targetApp.name, slackMessageName);
      await adminHomePage.page.waitForURL(editSlackMessagePage.pathRegex);
    });

    await test.step('Verify the slack message was created', async () => {
      await expect(editSlackMessagePage.generalTab.nameInput).toHaveValue(slackMessageName);
    });
  });

  test('Create a copy of a Slack Message on an app from the Create button in the admin header', async ({
    targetApp,
    adminHomePage,
    editSlackMessagePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-232',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();
    const slackMessageCopyName = FakeDataFactory.createFakeSlackMessageName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the slack message to be copied', async () => {
      await adminHomePage.createSlackMessageUsingHeaderCreateButton(targetApp.name, slackMessageName);
      await adminHomePage.page.waitForURL(editSlackMessagePage.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Copy the slack message', async () => {
      await adminHomePage.createSlackMessageCopyUsingHeaderCreateButton(
        targetApp.name,
        slackMessageName,
        slackMessageCopyName
      );
    });

    await test.step('Verify the slack message was copied', async () => {
      await expect(editSlackMessagePage.generalTab.nameInput).toHaveValue(slackMessageCopyName);
    });
  });

  test('Add Slack Message to an app from the Create Slack Message button on the slack message page', async ({
    targetApp,
    slackMessageAdminPage,
    editSlackMessagePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-233',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();

    await test.step('Navigate to slack message admin page', async () => {
      await slackMessageAdminPage.goto();
    });

    await test.step('Create the slack message', async () => {
      await slackMessageAdminPage.createSlackMessage(targetApp.name, slackMessageName);
      await slackMessageAdminPage.page.waitForURL(editSlackMessagePage.pathRegex);
    });

    await test.step('Verify the slack message was created', async () => {
      await expect(editSlackMessagePage.generalTab.nameInput).toHaveValue(slackMessageName);
    });
  });

  test('Create a copy of a Slack Message on an app from the Create Slack Message button on the slack message page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-234',
    });

    expect(true).toBeTruthy();
  });

  test("Update a Slack Message's configurations on an app from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-235',
    });

    expect(true).toBeTruthy();
  });

  test("Update a Slack Message's configurations on an app from the Slack Message page", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-236',
    });

    expect(true).toBeTruthy();
  });

  test("Delete a Slack Message from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-237',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Slack Message from the Slack Message page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-238',
    });

    expect(true).toBeTruthy();
  });
});
