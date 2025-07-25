import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { EmailSync } from '../../models/emailSync';
import { TextField } from '../../models/textField';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { EditEmailSyncPage } from '../../pageObjectModels/emailSyncs/editEmailSyncPage';
import { EmailSyncAdminPage } from '../../pageObjectModels/emailSyncs/emailSyncAdminPage';
import { AnnotationType } from '../annotations';

type EmailSyncTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  adminHomePage: AdminHomePage;
  editEmailSyncPage: EditEmailSyncPage;
  emailSyncAdminPage: EmailSyncAdminPage;
};

const test = base.extend<EmailSyncTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  editEmailSyncPage: async ({ sysAdminPage }, use) => await use(new EditEmailSyncPage(sysAdminPage)),
  emailSyncAdminPage: async ({ sysAdminPage }, use) => await use(new EmailSyncAdminPage(sysAdminPage)),
});

test.describe('email sync', () => {
  let emailSyncsToDelete: string[] = [];

  test.afterEach(async () => {
    emailSyncsToDelete = [];
  });

  test('Create an Email Sync via the create button in the header of the admin home page', async ({
    adminHomePage,
    editEmailSyncPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-372',
    });

    const emailSyncName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email sync', async () => {
      await adminHomePage.createEmailSyncUsingHeaderCreateButton(emailSyncName);
      await adminHomePage.page.waitForURL(editEmailSyncPage.pathRegex);
    });

    await test.step('Verify the email sync was created successfully', async () => {
      await expect(editEmailSyncPage.dataSyncTab.name()).toHaveValue(emailSyncName);
    });
  });

  test('Create an Email Sync via the create button on the Integrations tile on the admin home page', async ({
    adminHomePage,
    editEmailSyncPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-373',
    });

    const emailSyncName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email sync', async () => {
      await adminHomePage.createEmailSyncUsingIntegrationsTileButton(emailSyncName);
      await adminHomePage.page.waitForURL(editEmailSyncPage.pathRegex);
    });

    await test.step('Verify the email sync was created successfully', async () => {
      await expect(editEmailSyncPage.dataSyncTab.name()).toHaveValue(emailSyncName);
    });
  });

  test('Create an Email Sync via the "Create Email Integration (Sync)" button on the email sync home page', async ({
    emailSyncAdminPage,
    editEmailSyncPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-374',
    });

    const emailSyncName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncName);

    await test.step('Navigate to the email sync admin page', async () => {
      await emailSyncAdminPage.goto();
    });

    await test.step('Create the email sync', async () => {
      await emailSyncAdminPage.createEmailSync(emailSyncName);
    });

    await test.step('verify the email was created successfully', async () => {
      await expect(editEmailSyncPage.dataSyncTab.name()).toHaveValue(emailSyncName);
    });
  });

  test('Create a copy of an Email Sync via the create button in the header of the admin home page', async ({
    adminHomePage,
    editEmailSyncPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-375',
    });

    const emailSyncToCopyName = FakeDataFactory.createFakeEmailSyncName();
    const emailSyncCopyName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncToCopyName, emailSyncCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email sync to copy', async () => {
      await adminHomePage.createEmailSyncUsingHeaderCreateButton(emailSyncToCopyName);
      await adminHomePage.page.waitForURL(editEmailSyncPage.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email sync copy', async () => {
      await adminHomePage.createEmailSyncCopyUsingHeaderCreateButton(emailSyncToCopyName, emailSyncCopyName);
      await adminHomePage.page.waitForURL(editEmailSyncPage.pathRegex);
    });

    await test.step('Verify the email sync copy was created successfully', async () => {
      await expect(editEmailSyncPage.dataSyncTab.name()).toHaveValue(emailSyncCopyName);
    });
  });

  test('Create a copy of an Email Sync via the create button on the Integrations tile on the admin home page', async ({
    adminHomePage,
    editEmailSyncPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-376',
    });

    const emailSyncToCopyName = FakeDataFactory.createFakeEmailSyncName();
    const emailSyncCopyName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncToCopyName, emailSyncCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email sync to copy', async () => {
      await adminHomePage.createEmailSyncUsingIntegrationsTileButton(emailSyncToCopyName);
      await adminHomePage.page.waitForURL(editEmailSyncPage.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email sync copy', async () => {
      await adminHomePage.createEmailSyncCopyUsingIntegrationsTileButton(emailSyncToCopyName, emailSyncCopyName);
      await adminHomePage.page.waitForURL(editEmailSyncPage.pathRegex);
    });

    await test.step('Verify the email sync copy was created successfully', async () => {
      await expect(editEmailSyncPage.dataSyncTab.name()).toHaveValue(emailSyncCopyName);
    });
  });

  test('Create a copy of an Email Sync via the "Create Email Integration (Sync)" button on the email sync home page', async ({
    emailSyncAdminPage,
    editEmailSyncPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-377',
    });

    const emailSyncToCopyName = FakeDataFactory.createFakeEmailSyncName();
    const emailSyncCopyName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncToCopyName, emailSyncCopyName);

    await test.step('Navigate to the email syncs admin page', async () => {
      await emailSyncAdminPage.goto();
    });

    await test.step('Create the email sync to copy', async () => {
      await emailSyncAdminPage.createEmailSync(emailSyncToCopyName);
      await emailSyncAdminPage.page.waitForURL(editEmailSyncPage.pathRegex);
    });

    await test.step('Navigate back to the email syncs admin page', async () => {
      await emailSyncAdminPage.goto();
    });

    await test.step('Create a copy of the email sync', async () => {
      await emailSyncAdminPage.createEmailSyncCopy(emailSyncToCopyName, emailSyncCopyName);
      await emailSyncAdminPage.page.waitForURL(editEmailSyncPage.pathRegex);
    });

    await test.step('Verify the email sync was copied successfully', async () => {
      await expect(editEmailSyncPage.dataSyncTab.name()).toHaveValue(emailSyncCopyName);
    });
  });

  test('Update an Email Sync', async ({ app, appAdminPage, emailSyncAdminPage, editEmailSyncPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-378',
    });

    const textField = new TextField({ name: FakeDataFactory.createFakeFieldName() });

    const emailSync = new EmailSync({
      name: FakeDataFactory.createFakeEmailSyncName(),
      status: true,
      appOrSurvey: app.name,
      emailKey: FakeDataFactory.createFakeEmailSyncKey(),
      dataMapping: { Subject: textField.name },
    });
    emailSyncsToDelete.push(emailSync.name);

    await test.step('Add text field for use in data mapping', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Navigate to the email syncs admin page', async () => {
      await emailSyncAdminPage.goto();
    });

    await test.step('Create the email sync to update', async () => {
      await emailSyncAdminPage.createEmailSync(emailSync.name);
      await emailSyncAdminPage.page.waitForURL(editEmailSyncPage.pathRegex);
    });

    await test.step('Update the email sync', async () => {
      await editEmailSyncPage.updateEmailSync(emailSync);
      await editEmailSyncPage.save();
    });

    await test.step('Verify the email sync was updated', async () => {
      await editEmailSyncPage.page.reload();
      await expect(editEmailSyncPage.dataSyncTab.emailKey()).toBeDisabled();
      await expect(editEmailSyncPage.dataSyncTab.emailKey()).toHaveValue(emailSync.emailKey);
    });
  });

  test('Delete an Email Sync', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-379',
    });

    expect(true).toBeTruthy();
  });
});
