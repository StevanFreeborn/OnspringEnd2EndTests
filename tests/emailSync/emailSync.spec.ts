import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditEmailSyncPage } from '../../pageObjectModels/emailSyncs/editEmailSyncPage';
import { EmailSyncAdminPage } from '../../pageObjectModels/emailSyncs/emailSyncAdminPage';
import { AnnotationType } from '../annotations';

type EmailSyncTestFixtures = {
  app: App;
  adminHomePage: AdminHomePage;
  editEmailSyncPage: EditEmailSyncPage;
  emailSyncAdminPage: EmailSyncAdminPage;
};

const test = base.extend<EmailSyncTestFixtures>({
  app: app,
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
      await expect(editEmailSyncPage.dataSyncTab.nameInput).toHaveValue(emailSyncName);
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
      await expect(editEmailSyncPage.dataSyncTab.nameInput).toHaveValue(emailSyncName);
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

    await test.step('Create the emails sync', async () => {
      await emailSyncAdminPage.createEmailSync(emailSyncName);
    });

    await test.step('verify the email was created successfully', async () => {
      await expect(editEmailSyncPage.dataSyncTab.nameInput).toHaveValue(emailSyncName);
    });
  });

  test('Create a copy of an Email Sync via the create button in the header of the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-375',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of an Email Sync via the create button on the Integrations tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-376',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of an Email Sync via the "Create Email Integration (Sync)" button on the email sync home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-377',
    });

    expect(true).toBeTruthy();
  });

  test('Update an Email Sync', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-378',
    });

    expect(true).toBeTruthy();
  });

  test('Delete an Email Sync', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-379',
    });

    expect(true).toBeTruthy();
  });
});
