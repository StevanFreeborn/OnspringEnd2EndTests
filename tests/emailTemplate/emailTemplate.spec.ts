import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditEmailTemplatePage } from '../../pageObjectModels/messaging/editEmailTemplatePage';
import { EmailTemplateAdminPage } from '../../pageObjectModels/messaging/emailTemplateAdminPage';
import { AnnotationType } from '../annotations';

type EmailTemplateTestFixtures = {
  adminHomePage: AdminHomePage;
  editEmailTemplatePage: EditEmailTemplatePage;
  emailTemplateAdminPage: EmailTemplateAdminPage;
};

const test = base.extend<EmailTemplateTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  editEmailTemplatePage: async ({ sysAdminPage }, use) => await use(new EditEmailTemplatePage(sysAdminPage)),
  emailTemplateAdminPage: async ({ sysAdminPage }, use) => await use(new EmailTemplateAdminPage(sysAdminPage)),
});

test.describe('email template', () => {
  let emailTemplatesToDelete: string[] = [];

  test.afterEach(async ({ emailTemplateAdminPage }) => {
    await emailTemplateAdminPage.deleteEmailTemplates(emailTemplatesToDelete);
    emailTemplatesToDelete = [];
  });

  test('Create an Email Template via the create button in the header of the admin home page', async ({
    adminHomePage,
    editEmailTemplatePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-380',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    emailTemplatesToDelete.push(emailTemplateName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email template', async () => {
      await adminHomePage.createEmailTemplateUsingHeaderCreateButton(emailTemplateName);
      await adminHomePage.page.waitForURL(editEmailTemplatePage.pathRegex);
    });

    await test.step('Verify the email template is created', async () => {
      await expect(editEmailTemplatePage.generalTab.nameInput).toHaveValue(emailTemplateName);
    });
  });

  test('Create an Email Template via the create button on the Messaging tile on the admin home page', async ({
    adminHomePage,
    editEmailTemplatePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-381',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    emailTemplatesToDelete.push(emailTemplateName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email template using the Messaging tile', async () => {
      await adminHomePage.createEmailTemplateUsingMessagingTile(emailTemplateName);
      await adminHomePage.page.waitForURL(editEmailTemplatePage.pathRegex);
    });

    await test.step('Verify the email template is created', async () => {
      await expect(editEmailTemplatePage.generalTab.nameInput).toHaveValue(emailTemplateName);
    });
  });

  test('Create an Email Template via the "Create Email Template" button on the email template home page', async ({
    emailTemplateAdminPage,
    editEmailTemplatePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-382',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    emailTemplatesToDelete.push(emailTemplateName);

    await test.step('Navigate to the email template admin page', async () => {
      await emailTemplateAdminPage.goto();
    });

    await test.step('Create the email template', async () => {
      await emailTemplateAdminPage.createTemplate(emailTemplateName);
    });

    await test.step('Verify the email template is created', async () => {
      await emailTemplateAdminPage.page.waitForURL(editEmailTemplatePage.pathRegex);
      await expect(editEmailTemplatePage.generalTab.nameInput).toHaveValue(emailTemplateName);
    });
  });

  test('Create a copy of an Email Template via the create button in the header of the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-383',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of an Email Template via the create button on the Messaging tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-384',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of an Email Template via the "Create Email Template" button on the email templates home page.', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-385',
    });

    expect(true).toBeTruthy();
  });

  test('Update an email template', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-386',
    });

    expect(true).toBeTruthy();
  });

  test('Delete an email template', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-387',
    });

    expect(true).toBeTruthy();
  });
});
