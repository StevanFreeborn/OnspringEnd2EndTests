import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { EmailTemplate } from '../../models/emailTemplate';
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
    await emailTemplateAdminPage.deleteTemplates(emailTemplatesToDelete);
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

  test('Create a copy of an Email Template via the create button in the header of the admin home page', async ({
    adminHomePage,
    editEmailTemplatePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-383',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    const emailTemplateCopyName = `${emailTemplateName} Copy`;
    emailTemplatesToDelete.push(emailTemplateName);
    emailTemplatesToDelete.push(emailTemplateCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email template to copy', async () => {
      await adminHomePage.createEmailTemplateUsingHeaderCreateButton(emailTemplateName);
      await adminHomePage.page.waitForURL(editEmailTemplatePage.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a copy of the email template', async () => {
      await adminHomePage.createEmailTemplateCopyUsingHeaderCreateButton(emailTemplateName, emailTemplateCopyName);
    });

    await test.step('Verify the email template is copied', async () => {
      await adminHomePage.page.waitForURL(editEmailTemplatePage.pathRegex);
      await expect(editEmailTemplatePage.generalTab.nameInput).toHaveValue(emailTemplateCopyName);
    });
  });

  test('Create a copy of an Email Template via the create button on the Messaging tile on the admin home page', async ({
    adminHomePage,
    editEmailTemplatePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-384',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    const emailTemplateCopyName = `${emailTemplateName} Copy`;

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the email template to copy', async () => {
      await adminHomePage.createEmailTemplateUsingMessagingTile(emailTemplateName);
      await adminHomePage.page.waitForURL(editEmailTemplatePage.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a copy of the email template using the Messaging tile', async () => {
      await adminHomePage.createEmailTemplateCopyUsingMessagingTile(emailTemplateName, emailTemplateCopyName);
    });

    await test.step('Verify the email template is copied', async () => {
      await adminHomePage.page.waitForURL(editEmailTemplatePage.pathRegex);
      await expect(editEmailTemplatePage.generalTab.nameInput).toHaveValue(emailTemplateCopyName);
    });
  });

  test('Create a copy of an Email Template via the "Create Email Template" button on the email templates home page.', async ({
    emailTemplateAdminPage,
    editEmailTemplatePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-385',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    const emailTemplateCopyName = `${emailTemplateName} Copy`;
    emailTemplatesToDelete.push(emailTemplateName);
    emailTemplatesToDelete.push(emailTemplateCopyName);

    await test.step('Navigate to the email template admin page', async () => {
      await emailTemplateAdminPage.goto();
    });

    await test.step('Create the email template to copy', async () => {
      await emailTemplateAdminPage.createTemplate(emailTemplateName);
      await emailTemplateAdminPage.page.waitForURL(editEmailTemplatePage.pathRegex);
    });

    await test.step('Navigate back to the email template admin page', async () => {
      await emailTemplateAdminPage.goto();
    });

    await test.step('Create a copy of the email template', async () => {
      await emailTemplateAdminPage.createTemplateCopy(emailTemplateName, emailTemplateCopyName);
    });

    await test.step('Verify the email template is copied', async () => {
      await emailTemplateAdminPage.page.waitForURL(editEmailTemplatePage.pathRegex);
      await expect(editEmailTemplatePage.generalTab.nameInput).toHaveValue(emailTemplateCopyName);
    });
  });

  test('Update an email template', async ({ emailTemplateAdminPage, editEmailTemplatePage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-386',
    });

    const emailTemplate = new EmailTemplate({
      name: FakeDataFactory.createFakeEmailTemplateName(),
    });

    await test.step('Navigate to the email template admin page', async () => {
      await emailTemplateAdminPage.goto();
    });

    await test.step('Create an email template to update', async () => {
      await emailTemplateAdminPage.createTemplate(emailTemplate.name);
      await emailTemplateAdminPage.page.waitForURL(editEmailTemplatePage.pathRegex);
    });

    await test.step('Update the email template', async () => {
      emailTemplate.name = `${emailTemplate.name} Updated`;
      await editEmailTemplatePage.updateTemplate(emailTemplate);
      await editEmailTemplatePage.save();
    });

    await test.step('Verify the email template is updated', async () => {
      await editEmailTemplatePage.page.reload();
      await expect(editEmailTemplatePage.generalTab.nameInput).toHaveValue(emailTemplate.name);
    });
  });

  test('Delete an email template', async ({ emailTemplateAdminPage, editEmailTemplatePage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-387',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();

    await test.step('Navigate to the email template admin page', async () => {
      await emailTemplateAdminPage.goto();
    });

    await test.step('Create an email template to delete', async () => {
      await emailTemplateAdminPage.createTemplate(emailTemplateName);
      await emailTemplateAdminPage.page.waitForURL(editEmailTemplatePage.pathRegex);
    });

    await test.step('Navigate back to the email template admin page', async () => {
      await emailTemplateAdminPage.goto();
    });

    await test.step('Delete the email template', async () => {
      await emailTemplateAdminPage.deleteTemplate(emailTemplateName);
    });

    await test.step('Verify the email template is deleted', async () => {
      const row = emailTemplateAdminPage.getRowByName(emailTemplateName);

      await expect(row).toBeHidden();
    });
  });
});
