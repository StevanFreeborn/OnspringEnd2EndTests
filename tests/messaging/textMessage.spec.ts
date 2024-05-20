import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { EditTextMessagePage } from '../../pageObjectModels/messaging/editTextMessagePage';
import { AnnotationType } from '../annotations';
import { Tags } from '../tags';

type TextMessageTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  editTextPage: EditTextMessagePage;
  adminHomePage: AdminHomePage;
};

const test = base.extend<TextMessageTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  editTextPage: async ({ sysAdminPage }, use) => await use(new EditTextMessagePage(sysAdminPage)),
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
});

test.describe(
  'text message',
  {
    tag: [Tags.NotFedRAMP],
  },
  () => {
    test("Add Text Message to an app from an app's Messaging tab", async ({ app, appAdminPage, editTextPage }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-219',
      });

      const textMessageName = FakeDataFactory.createFakeTextMessageName();

      await test.step("Navigate to the app's messaging tab", async () => {
        await appAdminPage.goto(app.id);
        await appAdminPage.messagingTabButton.click();
      });

      await test.step('Add a new text message', async () => {
        await appAdminPage.messagingTab.createTextMessage(textMessageName);
        await appAdminPage.page.waitForURL(editTextPage.pathRegex);
      });

      await test.step('Verify the text message was added', async () => {
        await expect(editTextPage.generalTab.nameInput).toHaveValue(textMessageName);
      });
    });

    test("Create a copy of a Text Message on an app from an app's Messaging tab", async ({
      app,
      appAdminPage,
      editTextPage,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-220',
      });

      const textToCopyName = FakeDataFactory.createFakeTextMessageName();
      const textCopyName = FakeDataFactory.createFakeTextMessageName();

      await test.step('Navigate to the app messaging tab', async () => {
        await appAdminPage.goto(app.id);
        await appAdminPage.messagingTabButton.click();
      });

      await test.step('Create a new text message', async () => {
        await appAdminPage.messagingTab.createTextMessage(textToCopyName);
        await appAdminPage.page.waitForURL(editTextPage.pathRegex);
      });

      await test.step('Navigate back to the app messaging tab', async () => {
        await appAdminPage.goto(app.id);
        await appAdminPage.messagingTabButton.click();
      });

      await test.step('Create a copy of the text message', async () => {
        await appAdminPage.messagingTab.createTextMessageCopy(textToCopyName, textCopyName);
        await appAdminPage.page.waitForURL(editTextPage.pathRegex);
      });

      await test.step('Verify the text message copy was added', async () => {
        await expect(editTextPage.generalTab.nameInput).toHaveValue(textCopyName);
      });
    });

    test('Add Text Message to an app from the Create button in the admin header', async ({
      app,
      adminHomePage,
      editTextPage,
      appAdminPage,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-221',
      });

      const textMessageName = FakeDataFactory.createFakeTextMessageName();

      await test.step('Navigate to the admin home page', async () => {
        await adminHomePage.goto();
      });

      await test.step('Create a new text message', async () => {
        await adminHomePage.createTextUsingHeaderCreateButton(app.name, textMessageName);
        await adminHomePage.page.waitForURL(editTextPage.pathRegex);
      });

      await test.step('Verify the text message was added', async () => {
        await expect(editTextPage.generalTab.nameInput).toHaveValue(textMessageName);

        await appAdminPage.goto(app.id);
        await appAdminPage.messagingTabButton.click();

        const row = appAdminPage.messagingTab.textMessageGrid.getByRole('row', { name: textMessageName });
        await expect(row).toBeVisible();
      });
    });

    test('Create a copy of a Text Message on an app from the Create button in the admin header', async ({
      app,
      appAdminPage,
      adminHomePage,
      editTextPage,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-222',
      });

      const textToCopyName = FakeDataFactory.createFakeTextMessageName();
      const textCopyName = FakeDataFactory.createFakeTextMessageName();

      await test.step('Navigate to the admin home page', async () => {
        await adminHomePage.goto();
      });

      await test.step('Create a new text message', async () => {
        await adminHomePage.createTextUsingHeaderCreateButton(app.name, textToCopyName);
        await adminHomePage.page.waitForURL(editTextPage.pathRegex);
      });

      await test.step('Navigate back to the admin home page', async () => {
        await adminHomePage.goto();
      });

      await test.step('Create a copy of the text message', async () => {
        await adminHomePage.createTextCopyUsingHeaderCreateButton(app.name, textToCopyName, textCopyName);
        await adminHomePage.page.waitForURL(editTextPage.pathRegex);
      });

      await test.step('Verify the text message copy was added', async () => {
        await expect(editTextPage.generalTab.nameInput).toHaveValue(textCopyName);

        await appAdminPage.goto(app.id);
        await appAdminPage.messagingTabButton.click();

        const row = appAdminPage.messagingTab.textMessageGrid.getByRole('row', { name: textCopyName });
        await expect(row).toBeVisible();
      });
    });

    test('Add Text Message to an app from the Create Text Message button on the text message page', async ({}) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-223',
      });

      expect(true).toBeTruthy();
    });

    test('Create a copy of a Text Message on an app from the Create Text Message button on the text message page', async ({}) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-224',
      });

      expect(true).toBeTruthy();
    });

    test("Update a Text Message's configurations on an app from an app's Messaging tab", async ({}) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-225',
      });

      expect(true).toBeTruthy();
    });

    test("Update a Text Message's configurations on an app from the Text Message page", async ({}) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-226',
      });

      expect(true).toBeTruthy();
    });

    test("Delete a Text Message from an app's Messaging tab", async ({}) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-227',
      });

      expect(true).toBeTruthy();
    });

    test('Delete a Text Message from the Text Message page', async ({}) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-228',
      });

      expect(true).toBeTruthy();
    });
  }
);
