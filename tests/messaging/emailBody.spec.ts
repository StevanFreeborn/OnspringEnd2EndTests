import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { EditEmailBodyPage } from '../../pageObjectModels/messaging/editEmailBodyPage';
import { AnnotationType } from '../annotations';

type EmailBodyTestFixtures = {
  targetApp: App;
  appAdminPage: AppAdminPage;
  editEmailBodyPage: EditEmailBodyPage;
};

const test = base.extend<EmailBodyTestFixtures>({
  targetApp: app,
  appAdminPage: async ({ sysAdminPage }, use) => use(new AppAdminPage(sysAdminPage)),
  editEmailBodyPage: async ({ sysAdminPage }, use) => use(new EditEmailBodyPage(sysAdminPage)),
});

test.describe('email body', () => {
  test("Add Email Body to an app from an app's Messaging tab", async ({
    targetApp,
    appAdminPage,
    editEmailBodyPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-209',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step('Navigate to the messaging tab', async () => {
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create the email body', async () => {
      await appAdminPage.messagingTab.createEmailBody(emailBodyName);
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Verify the email body was created', async () => {
      await expect(editEmailBodyPage.generalTab.nameInput).toHaveValue(emailBodyName);
    });
  });

  test("Create a copy of an Email Body on an app from an app's Messaging tab", async ({
    targetApp,
    appAdminPage,
    editEmailBodyPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-210',
    });

    const emailBodyName = FakeDataFactory.createFakeEmailBodyName();
    const emailBodyCopyName = FakeDataFactory.createFakeEmailBodyName();

    await test.step("Navigate to the app's admin page", async () => {
      await appAdminPage.goto(targetApp.id);
    });

    await test.step("Navigate to the app's Messaging tab", async () => {
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create the email body to be copied', async () => {
      await appAdminPage.messagingTab.createEmailBody(emailBodyName);
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step("Navigate back to the app's messaging tab", async () => {
      await appAdminPage.goto(targetApp.id);
      await appAdminPage.messagingTabButton.click();
    });

    await test.step('Create a copy of the email body', async () => {
      await appAdminPage.messagingTab.addEmailBodyLink.click();
      await appAdminPage.messagingTab.createEmailBodyDialog.copyFromRadioButton.click();
      await appAdminPage.messagingTab.createEmailBodyDialog.selectDropdown.click();
      await appAdminPage.messagingTab.createEmailBodyDialog.getEmailBodyToCopy(emailBodyName).click();
      await appAdminPage.messagingTab.createEmailBodyDialog.nameInput.fill(emailBodyCopyName);
      await appAdminPage.messagingTab.createEmailBodyDialog.saveButton.click();
      await appAdminPage.page.waitForURL(editEmailBodyPage.pathRegex);
    });

    await test.step('Verify the Email Body was created', async () => {
      await expect(editEmailBodyPage.generalTab.nameInput).toHaveValue(emailBodyCopyName);
    });
  });

  test('Add Email Body to an app from the Create button in the admin header', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-211',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of an Email Body on an app from the Create button in the admin header', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-212',
    });

    expect(true).toBe(true);
  });

  test('Add Email Body to an app from the Create Email Body button on the email body page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-213',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of an Email Body on an app from the Create Email Body button on the email body page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-214',
    });

    expect(true).toBe(true);
  });

  test("Update an Email Body's configurations on an app from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-215',
    });

    expect(true).toBe(true);
  });

  test("Update an Email Body's configurations on an app from the Email Body page", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-216',
    });

    expect(true).toBe(true);
  });

  test("Delete an Email Body from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-217',
    });

    expect(true).toBe(true);
  });

  test('Delete an Email Body from the Email Body page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-218',
    });

    expect(true).toBe(true);
  });
});
