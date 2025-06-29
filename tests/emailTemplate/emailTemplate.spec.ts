import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditEmailTemplatePage } from '../../pageObjectModels/messaging/editEmailTemplatePage';
import { AnnotationType } from '../annotations';

type EmailTemplateTestFixtures = {
  adminHomePage: AdminHomePage;
  editEmailTemplatePage: EditEmailTemplatePage;
};

const test = base.extend<EmailTemplateTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  editEmailTemplatePage: async ({ sysAdminPage }, use) => await use(new EditEmailTemplatePage(sysAdminPage)),
});

test.describe('email template', () => {
  test('Create an Email Template via the create button in the header of the admin home page', async ({
    adminHomePage,
    editEmailTemplatePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-380',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();

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

  test('Create an Email Template via the create button on the Messaging tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-381',
    });

    expect(true).toBeTruthy();
  });

  test('Create an Email Template via the "Create Email Template" button on the email template home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-382',
    });

    expect(true).toBeTruthy();
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
