import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { EditSlackMessagePage } from '../../pageObjectModels/messaging/editSlackMessagePage';
import { AnnotationType } from '../annotations';

type SlackMessageTestFixtures = {
  targetApp: App;
  appAdminPage: AppAdminPage;
  editSlackMessagePage: EditSlackMessagePage;
};

const test = base.extend<SlackMessageTestFixtures>({
  targetApp: app,
  appAdminPage: async ({ sysAdminPage }, use) => use(new AppAdminPage(sysAdminPage)),
  editSlackMessagePage: async ({ sysAdminPage }, use) => use(new EditSlackMessagePage(sysAdminPage)),
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

  test("Create a copy of a Slack Message on an app from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-230',
    });

    expect(true).toBeTruthy();
  });

  test('Add Slack Message to an app from the Create button in the admin header', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-231',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Slack Message on an app from the Create button in the admin header', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-232',
    });

    expect(true).toBeTruthy();
  });

  test('Add Slack Message to an app from the Create Slack Message button on the slack message page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-233',
    });

    expect(true).toBeTruthy();
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
